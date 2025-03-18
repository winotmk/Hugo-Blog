---
title: Hugo_GithubAction自动部署到阿里云OSS
date: 2025-02-20
categories:
- Hugo
tags:
- 阿里云
- Github
- OSS
---
整了大半天，总算明白GithubAction是怎么用的了，给人感觉其实有那么些像docker，而需要为其写的action规则又像dockerfile或者dockercompose，它们都是去调用一些已经做好的功能/镜像，来按步骤去一步步达成一些事
参考文章：
https://thooooor.github.io/posts/%E8%84%B1%E5%9D%91%E8%AE%B0%E5%BD%95/hugo%E6%90%AD%E5%BB%BA%E5%8D%9A%E5%AE%A2/
https://kingtuo123.com/posts/hugo-deploy/
https://zhuanlan.zhihu.com/p/367426039



## 参考链接
action：
https://github.com/manyuanrong/setup-ossutil
https://github.com/peaceiris/actions-hugo

hugo和其主题：
https://gohugo.io/getting-started/quick-start/
https://github.com/adityatelange/hugo-PaperMod







当你通过 `git push` 触发 GitHub Actions 流程时，需要将 **Hugo 博客的源代码**推送到仓库。以下是具体操作步骤和本地准备：

---

### **一、本地准备工作**
#### 1. **项目结构要求**
你的本地 Hugo 博客项目需要包含以下内容：
```
your-blog-repo/
├── .github/workflows/deploy.yml   # 你的 GitHub Actions 配置文件
├── content/                       # 博客文章
├── themes/                        # Hugo 主题（通常作为 Git 子模块）
├── config.toml                    # Hugo 配置文件
└── (其他 Hugo 相关文件)
```

#### 2. **本地环境配置**
- **安装 Git**：确保已安装 Git 并配置好 GitHub 账户。
- **安装 Hugo**（可选）：  
  建议本地安装 Hugo 用于测试（与 Actions 中版本一致）：
  ```bash
  brew install hugo  # macOS
  # 或参考 Hugo 官方文档 https://gohugo.io/installation/
  ```

#### 3. **初始化 Git 仓库**
```bash
cd your-blog-repo
git init
git remote add origin https://github.com/你的用户名/你的仓库名.git
```

#### 4. **处理子模块（主题）**
如果使用了 Hugo 主题（如通过 Git 子模块添加）：
```bash
# 示例：添加主题为子模块
git submodule add https://github.com/主题作者/主题仓库.git themes/主题名
```
确保 `.gitmodules` 文件已提交。

---

### **二、触发 Actions 的 Push 内容**
你需要将以下内容推送到 GitHub 仓库：
1. **Hugo 源文件**  
   - `config.toml`（Hugo 配置）
   - `content/`（文章）
   - `themes/`（主题，通常以子模块形式存在）
   - `archetypes/`、`static/` 等其他 Hugo 所需文件

2. **GitHub Actions 配置文件**  
   确保 `.github/workflows/deploy.yml` 文件存在于仓库中。

3. **不包含生成的文件**  
   **不要推送** `public/` 目录（Hugo 生成的静态文件会被 Actions 自动构建）。

---

### **三、操作流程示例**
#### 1. **本地修改并测试**
```bash
# 本地生成静态文件测试（可选）
hugo server -D  # 启动本地预览
```

#### 2. **提交代码**
```bash
git add .
git commit -m "更新博客内容"
```

#### 3. **推送到 GitHub**
```bash
git push -u origin main  # 假设主分支是 main
```

#### 4. **触发 Actions**
推送后，到 GitHub 仓库的 **Actions** 标签页查看运行状态。  
若流程成功，阿里云 OSS 的存储桶中会自动出现 `public/` 的内容。

---

### **四、关键注意事项**
1. **分支匹配**  
   确保工作流配置中的 `push` 事件分支（默认所有分支）与你推送的分支一致。  
   （若需限制分支，可在配置中指定：`on.push.branches: [main]`）

2. **密钥安全**  
   - 阿里云的 `OSS_KEY_ID` 和 `OSS_KEY_SECRET` 必须通过 GitHub 仓库的 **Settings → Secrets** 添加，**不要明文写在代码中**。

3. **子模块更新**  
   如果主题子模块有更新，需在本地执行：
   ```bash
   git submodule update --remote --merge
   git add themes/主题名
   git commit -m "更新主题"
   ```

4. **调试失败问题**  
   - 若 Actions 运行失败，检查日志中的报错信息（如 Hugo 版本冲突、OSS 权限不足等）。
   - 本地可通过 `hugo --minify` 命令预验证构建是否正常。

---

### **五、流程图解**
```
本地修改博客内容 → 提交并推送 → GitHub 触发 Actions → 自动构建 Hugo → 上传到 OSS
                        （无需手动操作部署）
```

通过这种方式，你只需专注于内容创作和本地代码修改，部署过程会完全自动化。

## 其他
### hexo的action
hexo的GithubAction自动部署，用了两个仓库——github.io与hexo项目仓库区分操作
https://hackergavin.com/2024/01/11/hexo-automate-deploy/#%E5%88%9B%E5%BB%BA-Github-Actions-%E8%84%9A%E6%9C%AC

另外一种hexo部署
https://cloud.tencent.com/developer/article/2369534