---
title: Mac的包管理器homebrew环境变量配置
date: 2025-02-23
categories:
- mac
tags:
- mac
- homebrew
- PATH
---
<!--2025-02-23 14:42:0-->
按照 https://brew.sh 这里的提示：
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

装完brew后，敲brew居然不认得，还得我自己配一下
所以：

```bash
cd /opt/homebrew/bin/

PATH=$PATH:/opt/homebrew/bin
```
然后再
```bash
cd ~/

touch .zshrc

echo export PATH=$PATH:/opt/homebrew/bin >> .zshrc
```
这下就可以用brew啦，我主要是拿来
```bash
bres install git
```
安装git
但是神奇的是当我后面再用`vim ~/ .zshrc`想看看它时却似乎打不开这个文件，难道mac的设置是一次性的生效就删