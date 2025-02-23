---
title: 生成秘钥连接至github————用来推hexo
tags:
  - linux
  - github
---
## 生成秘钥
```
ssh-keygen -t ed25519 -C "550330147@qq.com"
```
邮箱自然是我的git注册邮箱
## 如果修改passphrade密码
```
ssh-keygen -p -f ~/.ssh/id_ed25519
```
直接enter即密码为空，这是秘钥的密码
## 复制秘钥到github
![](images/20230618002355.png)
打开/root/.ssh/id_ed25519.pub
复制到这里
![](images/20230618002554.png)
https://github.com/settings/ssh/new

PS官方已不推荐用rsa加密

## 测试
```
ssh -T git@github.com
```
![](images/20230618003332.png)
这里输入yes
![](images/20230618003428.png)
成功！