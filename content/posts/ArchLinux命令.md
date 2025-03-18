---
title: ArchLinux命令集
date: 2021-10-24
tags:
    - linux
---

刚装完archlinux后ifconfig无法使用?

```console
# pacman -S net-tools dnsutils inetutils iproute2
```

### Archlinux开启ssh服务命令：

```console
# systemctl enable sshd.service  开机启动

# systemctl start sshd.service     立即启动

# systemctl restart sshd.service   立即重启
```

### 关于systemctl:

https://wiki.archlinux.org/title/Systemd_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)

比如：关闭开机启用KDE桌面环境

```console
# systemctl disable sddm
```

### 切换到root用户：

```shell
# su
```

<!-- more -->

---

以下无用，应该是旧版本PuTTY密钥算法支持有限，请更新PuTTY。。

用PuTTY登录报错：

couldn't agree a host key algorithm

解决，生成密钥：（出处：[https://forums.centos.org/viewtopic.php?t=52892](https://forums.centos.org/viewtopic.php?t=52892)

```shell
# cd /etc/ssh
# ssh-keygen -t dsa -f /etc/ssh/ssh_host_dsa_key
# vi /etc/ssh/sshd_config
Uncomment this line:
# HostKey /etc/ssh/ssh_host_dsa_key
# chgrp ssh_keys ssh_host_dsa_key
# service sshd restart
```

如果putty连接报Network error:connection refused
关闭防火墙

```shell
# systemctl start iptables
```

---

### 安装jre环境

```shell
# pacman -S jre8-openjdk
```

高版本mc需要高JDK

```shell
# pacman -S jre17-openjdk
```

切换java版本

```shell
# sudo archlinux-java set java-17-openjdk
```

查看java状态

```shell
# java -version
```

### 启动一个mc服务器

https://cloud.tencent.com/developer/article/1622545

```shell
# java -Xms1024MB -Xmx2048MB -jar iserver.jar
```

### 设置中文环境

```shell
# vim /etc/locale.conf
```

增加以下内容
LANG=zh_CN.UTF-8

下次重新登录就是中文啦。可以输入date查看日期，如果显示中文，就说明设置正常啦

### 关于linux任务前后台处理：

https://blog.csdn.net/timonium/article/details/116245621
https://www.cnblogs.com/xiaoleiel/p/8349675.html

正在前台运行的命令暂停且放到后台：

```shell
# Ctrl+z
```

```shell
# jobs ## 查看后台进程编号
# jobs -l ##查看进程PID，可以配合kill干掉进程
```

bg在后台继续执行，fg调回前台执行

```shell
# bg [作业编号]
# fg [作业编号]
```

一开始就后台执行：
https://www.cnblogs.com/linnuo/p/9084125.html

```shell
# java -jar shareniu.jar &
```

&代表在后台运行

```shell
# nohup java -jar shareniu.jar &
```

nohup 意思是不挂断运行命令,当账户退出或终端关闭时,程序仍然运行
当用 nohup 命令执行作业时，缺省情况下该作业的所有输出被重定向到nohup.out的文件中，除非另外指定了输出文件。

ps：我觉得上面的后台操作不好用不如试试Screen

[https://blog.csdn.net/han0373/article/details/81352663](https://blog.csdn.net/han0373/article/details/81352663)

> screen -S yourname -> 新建一个叫yourname的session
> screen -ls         -> 列出当前所有的session
> screen -r yourname -> 回到yourname这个session
> screen -d yourname -> 远程detach某个session
> screen -d -r yourname -> 结束当前session并回到yourname这个session

回到MCSManager的面板
```
# screen -r mcsm
```

### 看进程
```shell
# ps aux
或者
# top
```

### 压缩
[https://www.jianshu.com/p/59d93f942506](https://www.jianshu.com/p/59d93f942506)
```
01-.tar格式
解包：# tar xvf FileName.tar
打包：# tar cvf FileName.tar DirName（注：tar是打包，不是压缩！）
02-.gz格式
解压1：# gunzip FileName.gz
解压2：# gzip -d FileName.gz
压 缩：# gzip FileName

03-.tar.gz格式
解压：# tar zxvf FileName.tar.gz
压缩：# tar zcvf FileName.tar.gz DirName
```