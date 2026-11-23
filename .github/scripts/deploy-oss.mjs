import { execFileSync } from 'node:child_process';
import { appendFileSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [source, destination, mode] = process.argv.slice(2);
const manifestKey = '.hugo-deploy/files.json';
const maxDeletes = 50;

function rclone(args, capture = false) {
  return execFileSync('rclone', ['--config', '/dev/null', ...args], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    stdio: ['ignore', capture ? 'pipe' : 'inherit', 'inherit'],
  });
}

function listFiles(root) {
  const output = rclone([
    'lsjson', root, '--recursive', '--files-only', '--fast-list',
    '--hash-type', 'MD5', '--no-modtime', '--no-mimetype',
  ], true);
  return new Map(JSON.parse(output).map(file => [file.Path, file]));
}

function isSitePath(path) {
  return typeof path === 'string'
    && !/[\r\n\0]/.test(path)
    && path !== '.hugo-deploy'
    && !path.startsWith('.hugo-deploy/')
    && path.split('/').every(part => part && part !== '.' && part !== '..');
}

function publish() {
  if (!source || !destination || !['preview', 'deploy'].includes(mode)) {
    throw new Error('Expected a Hugo output directory, an Rclone destination, and preview or deploy.');
  }

  const local = listFiles(source);
  if (!local.get('index.html')?.Size || local.size < 100) {
    throw new Error(`Incomplete Hugo build (${local.size} files).`);
  }
  for (const [path, file] of local) {
    if (!isSitePath(path) || !file.Hashes?.md5) {
      throw new Error(`Cannot publish build file ${JSON.stringify(path)}.`);
    }
  }

  const remote = listFiles(destination);
  const manifestUrl = `${destination}/${manifestKey}`;
  const manifest = remote.has(manifestKey)
    ? JSON.parse(rclone(['cat', manifestUrl], true))
    : { version: 1, files: [] };
  if (manifest?.version !== 1 || !Array.isArray(manifest.files) || !manifest.files.every(isSitePath)) {
    throw new Error('Invalid OSS deployment manifest.');
  }

  const managed = new Set(manifest.files);
  const uploads = [];
  let uploadBytes = 0;
  for (const [path, file] of local) {
    const existing = remote.get(path);
    if (existing?.Size === file.Size && existing.Hashes?.md5 === file.Hashes.md5) continue;
    uploads.push(path);
    uploadBytes += file.Size;
  }
  const deletes = [...managed].filter(path => !local.has(path) && remote.has(path));

  console.log(`${local.size} generated files. ${uploads.length} to upload (${uploadBytes} bytes). ${deletes.length} to delete.`);
  for (const path of uploads) console.log(`Upload ${JSON.stringify(path)}`);
  for (const path of deletes) console.log(`Delete ${JSON.stringify(path)}`);
  if (deletes.length > maxDeletes) {
    throw new Error(`Planned deletion count ${deletes.length} exceeds ${maxDeletes}. OSS writes blocked.`);
  }
  if (mode === 'preview') {
    report(`Dry run: ${uploads.length} uploads and ${deletes.length} deletions planned`);
    return;
  }

  const work = mkdtempSync(join(tmpdir(), 'hugo-oss-'));
  const manifestFile = join(work, 'files.json');
  const allManaged = new Set([...managed, ...local.keys()]);

  function saveManifest(paths) {
    const files = [...paths].sort();
    writeFileSync(manifestFile, JSON.stringify({ version: 1, files }));
    rclone(['copyto', manifestFile, manifestUrl, '--ignore-times']);
  }

  // Record new paths before upload so a later run can clean up an interrupted deploy.
  if (allManaged.size !== managed.size) saveManifest(allManaged);
  if (uploads.length) {
    const list = join(work, 'upload.txt');
    writeFileSync(list, `${uploads.join('\n')}\n`);
    rclone([
      'copy', source, destination, '--files-from-raw', list, '--no-traverse',
      '--ignore-times', '--transfers', '8', '--log-level', 'INFO',
    ]);
  }
  if (deletes.length) {
    const list = join(work, 'delete.txt');
    writeFileSync(list, `${deletes.join('\n')}\n`);
    rclone([
      'delete', destination, '--files-from-raw', list, '--fast-list',
      '--max-delete', String(maxDeletes), '--retries', '1', '--log-level', 'INFO',
    ]);
  }
  if (allManaged.size !== local.size) saveManifest(local.keys());
  report(`Published ${uploads.length} files (${uploadBytes} bytes) and deleted ${deletes.length}`);
}

function report(message) {
  console.log(message);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${message}\n`);
  }
}

publish();
