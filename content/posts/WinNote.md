---
title: WinNote
date: 2023-12-13
top: 1
sticky: 100
tags:
  - WinNote
weight: 1
image: http://pictures.winotmk.com/20211101_005742_IMB_3iZZzg_ac4eb74c.gif
---
<!--![](images/catcat.png)-->
![2025-02-26-22-52-55](http://pictures.winotmk.com/catcat_5d2b2bde.png)

![20211101_005742_IMB_3iZZzg [hugo-no-render]](http://pictures.winotmk.com/20211101_005742_IMB_3iZZzg_ac4eb74c.gif)
<!--{% asset_img 20211101_005742_IMB_3iZZzg.gif 800 %}-->

一个轻量级MD文档收集博客，不保证阅读性
使用树莓派+hexo构建，定制化next主题，github部署
2023.9.8更新
使用eci容器构建，自制镜像，cdn加速

一些编辑的Tips:
首页文章预览至：
```
<!-- more -->
```

markdown paste粘图：
```
ctrl+art+a
```
本站加速域名：[https://md.winotmk.com/](https://md.winotmk.com/)
正式站：[winotmk.com](https://www.winotmk.com)

<!-- more -->
***
2023.12.13更新
为了防止忘记如何写这个博客，特留备忘
NAS上工作台的盘符请设置为T
启动ecistarter容器
然后`CD ecistart` 进入目录
使用`. ./hexo_s` 来脚本启动阿里云eci上的容器，此脚本包含如果一段时间内没有连接将会自动释放掉eci容器的功能，判断依据是是否有SSH接入
![2025-02-26-22-54-02](http://pictures.winotmk.com/WinNote/2025-02-26-22-54-02_c17f1445.png)

之后通过VSCode的插件SSH FS来接入
md文档的目录是`./hexo/Winblog/source/_posts`

关于图片插入：本地目录`T:\博客\md_for_hexo\Images`将会与FTP上的`./hexo/Winblog/source/images`自动单向同步

***
2024.06.17再更新
因为买了阿里99服务器，改用了容器的形式运行
启动组
`docker compose -f hexo_debian_DockerCompose.yml up -d ` 
关闭组
`docker compose -f hexo_debian_DockerCompose.yml down -v`
同时配置了本地文章目录`T:\博客\md_for_hexo_workspace`和FTP上的`./hexo/Winblog/source/_posts`自动同步，终于不会存在本地和服务器上两份文章了
在`md_for_hexo_workspace`写好后直接`docker exec hexo hexo g -d`即可发布
***
2025.02.20再更新
1. 忽然发现阿里云OSS每个月要扣3块钱，才发现现在**同城冗余**和**本地存储**计价分开了，不能使用资源包扣容量了，**本地存储**的40G一年才几块钱却不起作用，傻傻交了好几个月的3块钱
那么我忽然想到，现在是用SFTP插件同步本地目录完成上传图片到远程文件存储的，何不直接使用OSS呢，它不就是用来干这个的嘛，拿来做图床想必轻而易举，所以找到了一个插件来完成oss上传图片的工作
![2025-02-20-18-43-03](http://pictures.winotmk.com/WinNote/2025-02-20-18-43-03_f587624d.png)
还蛮好用的，绑定了`elan upload from clipboard`到`ctrl+shift+alt+a`来粘贴并上传文件到bucket，会按照当前文档名称建文件夹分类
1. vscode的账户真是太乱了，能用微软登录，能用github登，甚至能用微软里再用github登，今天统一为用github的550330147邮箱登录
***
2025.03.10再更新
经过小两周的努力，本博客已经实现了一份写作，两份部署，将之前的cdn加速域名[https://md.winotmk.com/](https://md.winotmk.com/)替换为了hugo驱动的阿里云oss部署的新博客，两个博客文章数据完全一致，只是做了两份部署（因为好玩）这么一来即便不用cdn加速，但是hugo生成的静态网页和oss的速度也可以飞速访问了，同时[https://md.winotmk.com/](https://md.winotmk.com/)还添加了disqusjs评论系统，是个完完整整的博客了，具体实现过程如下图：
![2025-03-10-19-53-21](http://pictures.winotmk.com/WinNote/2025-03-10-19-53-21_62c5618b.png)
后面有时间单独出个文章说说hugo的主题定制化以及这个自动发布脚本

这次在尝试了disqus和waline后还是选择了waline，后者需要自己架设，虽然用得都是免费服务，但还就是比公共且需要梯子的disqus稳且快非常多
![2025-03-11-15-14-57](http://pictures.winotmk.com/WinNote/2025-03-11-15-14-57_91301dd5.png)

看到这则标志着部署成功