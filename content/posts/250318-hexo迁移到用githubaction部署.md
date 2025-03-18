---
title: hexo迁移到用githubAction部署
description: ""
date: 2025-03-18T02:58:09.254Z
preview: ""
draft: false
tags: []
categories: []
image: ""
---
## 原有本地目录简介
![2025-03-18-11-00-10](http://pictures.winotmk.com/250318-hexo%E8%BF%81%E7%A7%BB%E5%88%B0%E7%94%A8githubaction%E9%83%A8%E7%BD%B2/2025-03-18-11-00-10_c57182a9.png)
这个本地目录几经辗转，更新目录可见
https://md.winotmk.com/posts/winnote/
最早是在一块树莓派3B的TF卡上，然后试图使用阿里云eci容器+自制docker镜像构建，到现在基本稳定在文件存在阿里云NAS上，然后挂载给ECS服务器打包，今天或许是它最终的归宿了，直接塞进github仓库，使用action触发部署

## 准备工作
- **源码仓库**：存放Hexo源文件（如文章、主题、配置等）。
- **目标仓库**：GitHub Pages仓库（格式为 `<username>.github.io`），用于存放生成的静态文件。
![2025-03-18-11-08-59](http://pictures.winotmk.com/250318-hexo%E8%BF%81%E7%A7%BB%E5%88%B0%E7%94%A8githubaction%E9%83%A8%E7%BD%B2/2025-03-18-11-08-59_0da17349.png)
- **生成SSH密钥对**：
  ```bash
  ssh-keygen -t ed25519 -C "github-actions@example.com"
  ```
  - 将公钥（如 `id_ed25519.pub`）添加到目标仓库的 **Deploy Keys**（需勾选允许写入权限）。
  - 将私钥（`id_ed25519`）保存到源码仓库的 **Secrets** 中，命名为 `ACTIONS_DEPLOY_KEY`。
`ACTIONS_DEPLOY_KEY`存在这里：
![2025-03-18-11-09-54](http://pictures.winotmk.com/250318-hexo%E8%BF%81%E7%A7%BB%E5%88%B0%E7%94%A8githubaction%E9%83%A8%E7%BD%B2/2025-03-18-11-09-54_797a80dc.png)

将我本地目录的所有内容，push到**源码仓库**里保存，因为我换了图床，所有图片均不必在博客目录里保存，删了所有的图片的目录体积小了很多

## 创建GitHub Actions工作流
在源码仓库的 `.github/workflows/deploy.yml` 文件中添加以下内容：

```yaml
name: Deploy Hexo Site

on:
  push:
    branches:
      - main  # 触发分支，根据实际情况修改

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      # 步骤1：检出源码仓库
      - name: Checkout Source
        uses: actions/checkout@v4

      - name: pwd & ls
        run: pwd & ls

      # 步骤2：设置Node.js环境
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.5'  # 根据你的需求调整版本

      # 步骤3：缓存Node.js依赖，加速构建
      - name: Cache Node Modules
        uses: actions/cache@v3
        env:
          cache-name: node-modules
        with:
          path: node_modules
          key: ${{ runner.os }}-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}

      # 步骤4：安装Hexo及依赖
      - name: Install dependencies
        run: npm install
      
      - name: Install Dependencies
        run: npm install -g hexo-cli  # 全局安装Hexo命令行工具

      # 步骤5：生成静态文件
      - name: Generate Site
        run: hexo generate  # 生成静态文件到public目录

      # 步骤6：部署到目标仓库
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          deploy_key: ${{ secrets.ACTIONS_DEPLOY_KEY }}  # 使用私钥认证
          external_repository: winotmk/winotmk.github.io  # 目标仓库名称
          publish_dir: ./public  # Hexo生成的静态文件目录
          publish_branch: hexo-new-deploy  # 目标仓库的分支
          user_name: winotmk  # 提交者信息（可选）
          user_email: 5500330147@qq.com  # 提交者邮箱（可选）
```

## 踩过的坑
### `node_modules`目录问题：
本地目录push到源码仓库里的时候，发现自动排除了`node_modules`目录和`public`目录，和deepseek确认加排查了`.gitignore`文件确认它们确实被排除了，这`node_modules`目录里的东西讲道理会在`package.json`里有所定义，并在上面的action里重新下载设置，所以是没必要传的（而且较大文件居多又碎），但无奈我的hexo-theme-next主题也在其中，并且我自己后来还修改过，还是试着上传一下`node_modules`目录到github库里吧，然而上传后启用action，到了步骤5总是报错：
![2025-03-18-11-18-24](http://pictures.winotmk.com/250318-hexo%E8%BF%81%E7%A7%BB%E5%88%B0%E7%94%A8githubaction%E9%83%A8%E7%BD%B2/2025-03-18-11-18-24_81cc23b4.png)
估么着是因为在action里装了一遍`npm install -g hexo-cli`然后仓库里还有一份`node_modules`，出了些冲突？
总之最后还是删除了库里的`node_modules`目录，就能正常action了

### 排序出错
我可能是修改过`node_modules`包里的`hexo-generator-index`，现在每次构建重新拉肯定就不对了，所以在`package.json`里的这里
![2025-03-18-12-48-22](http://pictures.winotmk.com/250318-hexo%E8%BF%81%E7%A7%BB%E5%88%B0%E7%94%A8githubaction%E9%83%A8%E7%BD%B2/2025-03-18-12-48-22_04e27348.png)
改为
```
"hexo-generator-index": "^4.0.0",
```
https://www.npmjs.com/package/hexo-generator-index
然后再需要置顶的文章头FM里加入`sticky: 100`即可实现置顶

参考出处：
https://blog.51cto.com/u_15477117/4919708
但没采用，因为发现更新版本的`hexo-generator-index`已经支持置顶

---

发现和本文思路类似的action，也是两个仓库+使用`peaceiris/actions-gh-pages`这个action部署生成好的静态页面
https://hackergavin.com/2024/01/11/hexo-automate-deploy/