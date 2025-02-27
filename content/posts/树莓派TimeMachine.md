---
title: 树莓派上架设TimeMachine服务
date: 2021-10-14
tags:
  - linux
  - rashbeerypi
image: http://pictures.winotmk.com/%E6%A0%91%E8%8E%93%E6%B4%BETimeMachine/2025-02-27-23-44-08_12ebde84.png
---

![2025-02-27-23-44-08 [hugo-no-render]](http://pictures.winotmk.com/%E6%A0%91%E8%8E%93%E6%B4%BETimeMachine/2025-02-27-23-44-08_12ebde84.png)


## 命令

前半参考：
[从此Mac上的文件再也不会丟了](https://zhuanlan.zhihu.com/p/335259509)

后半参考：
[如何自己搭建一个Time Machine服务器](https://www.jianshu.com/p/d9b180f6d397)

挂载硬盘目录

```
sudo mount /dev/sda2 /mnt/WinSource
```

1.安装netatalk和avahi（自己感觉avahi不装也行

```
sudo apt install netatalk avahi-daemon -y
```

2.创建账户wintm来访问TimeMachine，**至少别用root，root访问不能！**

```
useradd -c "Time machine" -m -s /bin/bash wintm
```

然后设置密码

```
sudo passwd wintm
```
<!-- more -->

3.配置netatalk

```
sudo nano /etc/netatalk/AppleVolumes.default
```

这个文件似乎一行代表一个服务
可以在

```
# The line below sets some DEFAULT, starting with Netatalk 2.1.
:DEFAULT: options:upriv,usedots

# By default all users have access to their home directories.
~/			"Home Directory"
```

下面加上一行

```
/mnt/WinSource/TimeMachine WinMachine allow:wintm options:tm
#挂在硬盘里的文件夹           afp服务名   允许wintm用户登陆   开启timemachine
```

4.重启服务

```
sudo service netatalk restart
sudo service avahi-daemon restart
```

## 一些坑

* 试图直接使用root账户连接，在这里卡了很久，还尝试在**AppleVolumes.default**设置里写上例如

``/mnt/WinSource/TimeMachine WinMachine allow:root rwlist:root  options:tm``

翻到这篇：[[NAS之旅]-基于Centos7搭建Netatalk为Windows增加AFP协议](https://www.it610.com/article/1297957643536637952.htm)

才忽然醒悟，**root用户是禁止登录AFP服务**的，得嘞，新开个专门的用户吧

提到了新建一个用户来跑timemachine：[如何自己搭建一个Time Machine服务器](https://www.jianshu.com/p/d9b180f6d397)

* 一开始习惯将硬盘挂载到`/root/WinSource`，然鹅这似乎导致即便mac上TimeMachine连接上了也报错没法开始备份，想想也是wintm用户没有权限进root。。总结为避免不必要的麻烦以后硬盘不挂`/root`里，这里我挂进了`/mnt`

ps:当时还试图对`/root/WinSource`使用chown

```
sudo chown -R wintm:wintm /root/WinSource
```

见这篇：[用树莓派实现 Time Capsule](https://aaron67.cc/2017/01/14/rpi-as-time-capsule/)

无解，chown改不了`WinSource`目录的所有者，root强而有力，认输

## 补充连接

NetaTalk官方文档和下载：[http://netatalk.sourceforge.net/3.1/htmldocs/afp.conf.5.html](http://netatalk.sourceforge.net/3.1/htmldocs/afp.conf.5.html)

[AFP Netatalk 分享配置 (又名 Apple Time Machine).](https://openwrt.org/zh/docs/guide-user/services/nas/netatalk_configuration#afp_netatalk_分享配置_又名_apple_time_machine)

[使用netatalk打造一款属于自己的Time-Machine在线备份服务器](https://blog.maxisvest.com/使用netatalk打造一款属于自己的Time-Machine在线备份服务器/)

