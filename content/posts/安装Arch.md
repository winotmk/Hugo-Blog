---
title: 安装ArchLinux系统（详细过程）
date: 2021-10-25
tags:
  - linux
---
参考文章：[https://zhuanlan.zhihu.com/p/138951848](https://zhuanlan.zhihu.com/p/138951848)

官方WIKI安装指南（上文和本文大致流程基于此）：[https://wiki.archlinux.org/title/Installation_guide](https://wiki.archlinux.org/title/Installation_guide)

家里旧笔记本淘汰装个Linux跑跑服务发挥余热，
这里是彻底格式化硬盘新安装，而不需要多系统引导

我的环境有：

* 2核  Intel(R) Pentium(R) CPU 997 @ 1.60GHz
* 4GB 1600内存
* UEFI启动（不能为BIOS）
* Samsang 850 EVO 250G 2.5寸SATA接口
* 无线网卡拆掉了，用得是网线
* 路由器上全局梯子（所以我没有换源，用官方源速度足够了）

## 准备镜像

https://archlinux.org/download/
下载发行版的Linux的ISO
然后制作U盘启动，我是在mac下用balenaEtcher做的，操作非常方便

![2025-02-27-23-39-41](http://pictures.winotmk.com/%E5%AE%89%E8%A3%85Arch/2025-02-27-23-39-41_6fe1b0ee.png)
<!-- more -->

然后重启电脑从U盘启动

## 硬盘准备

进入U盘系统后先连pacman试试

```Shell
pacman -Syyy
```
![2025-02-27-23-39-55](http://pictures.winotmk.com/%E5%AE%89%E8%A3%85Arch/2025-02-27-23-39-55_7733f272.png)

### 检查硬盘

```Shell
lsblk
```
![2025-02-27-23-40-07](http://pictures.winotmk.com/%E5%AE%89%E8%A3%85Arch/2025-02-27-23-40-07_d009c4a5.png)

### 建立分区

```Shell
cfdisk /dev/sda
```

选择New 回车，然后
选择Write 回车 输入 yes 回车
写入完成 选择Quit 回车退出

### 格式化

将刚刚分好的区格式化为ext4格式，这里认准分区号sda1

```Shell
mkfs.ext4 /dev/sda1
```

### 挂载分区

sda1

```Shell
mount /dev/sda1 /mnt
```

## 安装系统

```Shell
pacstrap /mnt base linux linux-firmware nano
```

## 生成fstab文件

```Shell
genfstab -U /mnt >> /mnt/etc/fstab
```

检查生成的fstab文件

```Shell
cat /mnt/etc/fstab
```

## 配置新系统

### 切换到装好的系统

```Shell
arch-chroot /mnt
```

### 设置时区

```Shell
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

### 设置locale

```Shell
nano /etc/locale.gen
```

Ctrl+W 输入 #en_US 回车 找到UTF-8那一行 删掉前面的#

Ctrl+W 输入 #zh_CN 回车 找到UTF-8那一行 删掉前面的#
Ctrl+X 然后Y保存退出
生成locale

```Shell
locale-gen
```

创建并写入/etc/locale.conf文件

```Shell
nano /etc/locale.conf 
```

填入内容，注意这里只能填这个

```Shell
LANG=en_US.UTF-8
```

### 创建并写入hostname

```Shell
nano /etc/hostname
```

我这里名字叫WinArch
保存退出

### 修改hosts

```Shell
nano /etc/hosts
```

写入内容如图（中间的空白用tab而非空格），arch替换为你之前在hostname里写入的内容，其他都按照图里面的写（注意最后一行的ip是127.0.1.1）
![2025-02-27-23-40-26](http://pictures.winotmk.com/%E5%AE%89%E8%A3%85Arch/2025-02-27-23-40-26_f63948a7.png)

保存退出

建议上述编辑的内容都用cat输出检查一下

### root用户创建密码

```Shell
passwd
```

然后输入并确认密码

### 装启动器和一些软件

包含了一些常用到的软件

```Shell
pacman -S grub efibootmgr networkmanager network-manager-applet dialog wireless_tools wpa_supplicant os-prober mtools dosfstools ntfs-3g base-devel linux-headers reflector git sudo
```

intel的cpu，需要安装intel的微码文件

```Shell
pacman -S intel-ucode
```

完成之后输入

```Shell
grub-install /dev/sda
```

注意是硬盘位置不是分区位置，硬盘上也只有刚刚安装的Arch系统

生成grub.cfg

```Shell
grub-mkconfig -o /boot/grub/grub.cfg
```

出现吧啦吧啦done就完成了

## 退出新系统重启

```shell
exit
reboot
```

不装桌面环境的话，到这步即可使用了，后续需要什么再装不迟

## 新建用户并授权

```Shell
useradd -m -G wheel winotmk
```

我的用户是winotkm，这里主要是创建一个非root的账户，桌面环境一般无法用root登陆的
创建密码

```Shell
passwd winotmk
```

授权

```Shell
EDITOR=nano visudo
```

Ctrl+W 输入 # %wheel 回车 找到这行 删除前面的 #（取消注释）

## 安装Display Server和Display Manager

```Shell
pacman -S xorg
```

然后我喜欢KDE桌面，所以装：

```Shell
pacman -S sddm
```

设置开机启动

```Shell
systemctl enable sddm
```

PS.取消开机启动是

```Shell
systemctl disable sddm
```

## 安装Desktop Environment

KDE：

```Shell
pacman -S plasma kde-applications packagekit-qt5
```

安装中文的字体

```Shell
pacman -S noto-fonts-cjk
```

好了，大功告成

```Shell
reboot
```
![2025-02-27-23-42-43](http://pictures.winotmk.com/%E5%AE%89%E8%A3%85Arch/2025-02-27-23-42-43_c78205c3.png)

