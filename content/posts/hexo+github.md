---
title: hexo+github
date: 2021-10-13
tags:
  - hexo
  - github
---

[https://winotmk.github.io/](https://winotmk.github.io/)

github：[https://github.com/winotmk/winotmk.github.io](https://github.com/winotmk/winotmk.github.io)

总有一些零碎的想法，需要记录下来，写全面的文章没有时间，不写下来又会忘，日记app又不方便整理，同时也想利用一下树莓派，网上搜索便发现hexo+github部署的方式，于是想尝试尝试，一路遇到很多问题



主要参考：[基于树莓派搭建Hexo博客部署到GitHub/Gitee](https://cuifengwei.com/2020/02/21/%E5%9F%BA%E4%BA%8E%E6%A0%91%E8%8E%93%E6%B4%BE%E6%90%AD%E5%BB%BAHexo%E5%8D%9A%E5%AE%A2%E9%83%A8%E7%BD%B2%E5%88%B0GitHub/)

前期第二参考：[hexo——轻量、简易、高逼格的博客](https://zhuanlan.zhihu.com/p/44233946)

更详细的安装过程：[GitHub+Hexo 搭建个人网站详细教程](https://zhuanlan.zhihu.com/p/26625249)

hexo官方文档：[https://hexo.io/docs/](https://hexo.io/docs/)

hexo博客文档（似乎和上面有不少内容重叠）：[https://theme-next.js.org/docs/](https://theme-next.js.org/docs/)

## 安装hexo

下载armv7版本的node.js：[nodejs下载](https://nodejs.org/en/download/)
<!-- more -->

## 配置github

git key配置：[github每次需要输入密码和用户名的问题...](https://blog.csdn.net/qq_36711388/article/details/88780372)

取消使用key令牌后还要输入密码：[取消 SSH 私钥密码](https://cloud.tencent.com/developer/article/1095516)

## 后期配置

### hexo配置

官方文档：[https://hexo.io/zh-cn/docs/configuration](https://hexo.io/zh-cn/docs/configuration)

### 主题

Next主题github：[https://github.com/next-theme/hexo-theme-next](https://github.com/next-theme/hexo-theme-next)

Next主题的文档(ps.页面样式好看可参考)：[第三方服务集成](http://theme-next.iissnan.com/third-party-services.html)

Next主题代码框高亮预览设置：[https://theme-next.js.org/highlight/](https://theme-next.js.org/highlight/)

### 资产文件夹

[https://hexo.io/docs/asset-folders](https://hexo.io/docs/asset-folders)

### 访客统计

[DevOps 访客数统计 & google analytics 数据分析](https://www.dazhuanlan.com/jane2382/topics/1350442https:/)

[将文章视图添加到您的 Hexo 博客](https://qiuyiwu.github.io/2019/01/26/Hexo-View/)(有LeanCloud和Firebase比较分析）

[给hexo博客文章添加阅读次数统计](https://zhangjh.me/2016/04/12/hexo-visit-analytics-md/)

hexo next主题的leancloud安全插件github：[https://github.com/theme-nex...](https://github.com/theme-next/hexo-leancloud-counter-security)

上面链接的说明：[Leancloud访客统计插件重大安全漏洞修复指南](https://leaferx.online/2018/02/11/lc-security/)

Firebase:[https://console.firebase.google...](https://console.firebase.google.com/project/winnote-visitor/overview)

### 评论

畅言：[https://changyan.kuaizhan.com/v3/changyan/overview](https://changyan.kuaizhan.com/v3/changyan/overview)
valine：[https://valine.js.org](https://valine.js.org)

## 其他

### 配置vscode：

本来都是用**putty**打指令，用**WinSCP**访问我的目录操作的，但是**WinSCP**自带的文本编辑过与拉跨，有几次多打空格没看出来导致直接`hexo g`失败，后来突发奇想为啥不找个轻量级的IDE直接去写这些呢，于是用起了vscode

[Vscode配置ftp连接远程服务器（上传本地文件）](https://blog.csdn.net/weixin_42592326/article/details/108058711https:/)

不过自己测试发现不好用，于是用了**SSH FS**这个vscode插件

[相对路径./与../区别](https://blog.csdn.net/qq_34769573/article/details/80445681)
