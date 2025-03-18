---
title: 生成秘钥连接至github————用来推hexo
date: 2023-06-18
tags:
  - linux
  - github
image: http://pictures.winotmk.com/%E7%94%9F%E6%88%90%E7%A7%98%E9%92%A5%E8%BF%9E%E6%8E%A5%E8%87%B3github_%E7%94%A8%E6%9D%A5%E6%8E%A8hexo/2025-02-27-23-31-30_51beb5cc.png
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
![2025-02-27-23-30-51](http://pictures.winotmk.com/%E7%94%9F%E6%88%90%E7%A7%98%E9%92%A5%E8%BF%9E%E6%8E%A5%E8%87%B3github_%E7%94%A8%E6%9D%A5%E6%8E%A8hexo/2025-02-27-23-30-51_e913dfa6.png)
打开/root/.ssh/id_ed25519.pub
复制到这里
![2025-02-27-23-31-30](http://pictures.winotmk.com/%E7%94%9F%E6%88%90%E7%A7%98%E9%92%A5%E8%BF%9E%E6%8E%A5%E8%87%B3github_%E7%94%A8%E6%9D%A5%E6%8E%A8hexo/2025-02-27-23-31-30_51beb5cc.png)
https://github.com/settings/ssh/new

PS官方已不推荐用rsa加密

## 测试
```
ssh -T git@github.com
```
![2025-02-27-23-31-41](http://pictures.winotmk.com/%E7%94%9F%E6%88%90%E7%A7%98%E9%92%A5%E8%BF%9E%E6%8E%A5%E8%87%B3github_%E7%94%A8%E6%9D%A5%E6%8E%A8hexo/2025-02-27-23-31-41_8f57328d.png)
这里输入yes
![2025-02-27-23-31-51](http://pictures.winotmk.com/%E7%94%9F%E6%88%90%E7%A7%98%E9%92%A5%E8%BF%9E%E6%8E%A5%E8%87%B3github_%E7%94%A8%E6%9D%A5%E6%8E%A8hexo/2025-02-27-23-31-51_592f0bdc.png)
成功！