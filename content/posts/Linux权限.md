---
title: linux文件和目录权限
date: 2021-10-24
tags:
  - linux
---
*本文摘录整理为主

用`ls -l`查看权限：

```
文件属性     文件数    拥有者   所属的group    文件大小    建档日期        文件名　　
drwx--x--x   1      root       wheel       6872    2  7 22:41     compressedPackage/
drwxr-xr-x   1      liuml      wheel       8620    2 15 09:32     wwwroot/　　
lrwxrwxrwx   1      liuml      wheel       46      2 24 19:30     abc@ -> home/abc
-rwxr-xr-x   1      liuml      wheel       68568   2 29 07:43     test*　　
 
- 文件名栏位 文件后面的符号含义  
	- / ：表明是一个目录
	- @ ：表明是到其它文件的符号链接
	- * ：表明是一个可执行文件。

- 对于权限设置的解释
	- r 是读，w 是写，x 是执行

	- 对应数字如下:
		- r = 4    w = 2    x = 1
		- rwx ：4+2+1 = 7
		- rw- ：4+2 = 6
		- r-x ：4+1 = 5
		- drwxr-xr-x ：755

- 第 0-1位   文件类型
	- “-” ：表示普通文件；
	- “d” ：表示目录；
	- “l” ：表示链接文件；
	- “p” ：表示管理文件；
	- “b” ：表示块设备文件；
	- “c” ：表示字符设备文件；
	- “s” ：表示套接字文件；

- 第 2-4位   文件所有者权限 [User]

- 第 5-7位   文件所有者所在组权限 [Group]

- 第 8-10位  其他用户权限 [Others]

- 没有的权限用 “-” 来表示
————————————————
版权声明：本文为CSDN博主「烟雨弥漫了江南」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/u010324331/article/details/88035175/
```
<!-- more -->
![2025-02-27-23-54-11](http://pictures.winotmk.com/Linux%E6%9D%83%E9%99%90/2025-02-27-23-54-11_2249d00f.png)

图片来源：[https://blog.csdn.net/zhuoya_/article/details/77418413](https://blog.csdn.net/zhuoya_/article/details/77418413)

共显示了七列信息，从左至右依次为：权限、文件数、归属用户、归属群组、文件大小、创建日期、文件名称
d ：第一位表示文件类型


| 第一位字符 | 文件类型     |
| :----------: | -------------- |
|     d     | 文件夹       |
|     -     | 普通文件     |
|     l     | 链接         |
|     b     | 块设备文件   |
|     p     | 管道文件     |
|     c     | 字符设备文件 |
|     s     | 套接口文件   |

rxw和数值权限的对应：


| rxw     | 数值 |
| --------- | ------ |
| r(读)   | 4    |
| w(写)   | 2    |
| x(执行) | 1    |

所以，例如：
rwx rw- r--
7    6    4
三个一组,rwx权限分别对应421相加得7,rw-对应42相加,r--对应4

![2025-02-27-23-54-26](http://pictures.winotmk.com/Linux%E6%9D%83%E9%99%90/2025-02-27-23-54-26_341c9e8c.png)

图片来源：[http://man.linuxde.net/chmod](http://man.linuxde.net/chmod)

举例：-rw-r--r--，即为644权限
6对应4+2   rw-
4对应   r--
那么这个文件的权限就是所有者rw-,所属组r--,其他人r--

常用的linux权限对应：


| 数值 | rxw       |
| ------ | ----------- |
| 444  | r--r--r-- |
| 600  | rw------- |
| 644  | rw-r--r-- |
| 666  | rw-rw-rw- |
| 700  | rwx------ |
| 744  | rwxr--r-- |
| 755  | rwxr-xr-x |
| 777  | rwxrwxrwx |

## 命令修改权限

1. **权限管理命令chmod**

修改文件或者目录的权限
全拼: change permissions mode of a file
语法:

```
chmod [{ugoa}{+-=}{rwx}] [文件或目录]
[mode=421] [文件或目录]
-R 递归修改

u:所有者, g:所属组,o:其他人,a:所有;
+:添加权限,-减少权限,=直接赋值成这个权限
```

2. **创建目录mkdir时加权限**

```
$ mkdir -m=r-- letter
```

上面的命令会创建一个名为 letter 的目录，同时为**目录所有者、用户组和其他用户** 针对该目录赋予**只读权限**

mkdir命令小参考：[在 Linux 下用 mkdir 命令来创建目录和子目录](https://linux.cn/article-2713-1.html)

## 参考：

[linux权限drwxrwxrwx所代表的意义](https://www.cnblogs.com/tianchao/p/11821556.html)

[linux ls -l命令显示详解](https://blog.csdn.net/u010324331/article/details/88035175/)

[linux更改文件(夹)权限或所有者](https://blog.csdn.net/ken1583096683/article/details/82594037)

[Linux 文件权限查看及修改](https://jingyan.baidu.com/article/4853e1e5413b541909f72632.html)
