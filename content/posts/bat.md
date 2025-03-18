---
title: 批处理实现批量改名以及SVN批量改名
date: 2021-12-14
tags:

- bat
---
## 需求

![2025-02-28-00-04-57](http://pictures.winotmk.com/bat/2025-02-28-00-04-57_7f11abc1.png)

注意Mesh和Texture前加了编号

工作需要整理目录文件，要将多组资产目录（Assets01,Assets02,Assets03...内的Resource目录下的Texture和Mesh目录加编号)

感觉这是一个可以用批处理脚本做到的事情，所以稍微研究了一下

## 改名实现

如果单只是改名其实很简单，只需要几行即可实现：

```bat
@echo off
for /f "delims=" %%a in ('dir /ad/s/b "Mesh"') do ren "%%~a" 01-Mesh
for /f "delims=" %%b in ('dir /ad/s/b "Texture"') do ren "%%~b" 00-Texture
pause
```
<!-- more -->

`@echo off`打开批处理黑窗口

`for in do`常用在查找匹配，满足条件后执行

`dir /ad/s/b "Mesh"`这行可以参考`dir`命令的用法，`/ab`在这里是只显示目录（如果是要显示文件是`/a-d`）`/s`显示目录和包含子目录，`/b`不显示日期大小等其他信息，`"Mesh"`会列出包含Mesh目录

`pause`这里会暂停一下按任意键继续

所以连起来就是列出包含Mesh和Texture的目录，然后用`ren`改名

## SVN Rename批处理

然而上面的简单改名这对于我遇到的实际情况不理想，有些资源是在SVN目录库里的，对于SVN来说，直接用`ren`等于删除Mesh旧目录，再新添加一个00-Mesh新目录，这会来带几个问题：

* log丢失，历史版本找不回来
* 如果文件多，占用空间很大，浪费大家带宽（每个人update会重新下载一遍）

所以最好是用SVN的命令来进行操作

然后发现用`svn mv oldname newname`就能完成

```bat
svn mv Mesh 00-Mesh
```

移动，重命名，对svn来说都是这一个命令

所以大致思路就是用`for in do`来找到Mesh和Texture文件夹，然后用变量来做oldname和newname

```bat
@echo off
setlocal EnableDelayedExpansion

for /f "delims=" %%b in ('dir /ad/s/b "Mesh"') do (
set "oldm=%%b"
set "newm=!oldm:Mesh=00_Mesh!"
echo ------旧Mesh目录名称
echo !oldm!
echo ------新Mesh目录名称
echo !newm!
echo ------Mesh改名中...
svn mv !oldm! !newm!
)
for /f "delims=" %%b in ('dir /ad/s/b "Texture"') do (
set "oldt=%%b"
set "newt=!oldt:Texture=01_Texture!"
echo ------旧Texture目录名称
echo !oldt!
echo ------新Texture目录名称
echo !newt!
echo ------Texture改名中...
svn mv !oldt! !newt!
)

pause
```

一开始卡在变量这块很久，最后发现一定要有`setlocal EnableDelayedExpansion`，然后变量才可以在`do()`里用`!oldm!`这样，而不能用`%oldm%`

`set "newm=!oldm:Mesh=00_Mesh!"`这行的操作是字符串替换，举例来说此时`!oldm!`为`C:\Users\winte\Desktop\project\Assets01\Resource\Mesh`

会将此段字符串中的`Mesh`替换为`00_Mesh`,得到

`C:\Users\winte\Desktop\project\Assets01\Resource\00_Mesh`

然后是一些交互上的完善，有个用到的结构

```bat
@echo off
echo 如需要撤销操作请按r,按其他任意键退出...
set /p a=请输入r后回车:
if "%a%"=="r" Goto abc
exit /b
:abc
....
```

这里有个判断，如果按下了r键，会触发`Goto abc`，然后跳转到`:abc`以下的脚本，否则会直接走`exit /b`退出脚本，很实用

## 一些Tips

* 将变量与批处理中的另一个变量的一部分匹配

[https://www.thinbug.com/q/19056911](https://www.thinbug.com/q/19056911)

测试这段是好用的，用来检测一段字符串是否含有一段字符串

```bat
@echo off
set "h=Hello-World"
set "f=This is a Hello-World test"
call set "a=%%f:%h%=%%"
if not "%a%"=="%f%" goto :done
pause
exit /b
:done
echo it matched
pause
```

* 一个ping通隔段时间再ping，ping不通就关机的例子
  [http://www.bathome.net/thread-12490-1-1.html](http://www.bathome.net/thread-12490-1-1.html)

```bat
@echo off
:open
ping 192.168.1.90
if %ERRORLEVEL%==0 goto Ok
if %ERRORLEVEL%==1 goto No
exit

:No
cls&echo 不通!关机操作
shutdown -s -f -t 5000
 ::5000秒后关机
exit

:Ok
cls&echo.通，10分钟后再监测，请勿关闭本窗口
ping 127.0.1 /n 600 >nul
 ::600秒后执行检测
goto open
```

* 如果要检测的是上段脚本执行以后的返回值，可以用到`%ERRORLEVEL%`

[https://www.jianshu.com/p/5e72aed76b71](https://www.jianshu.com/p/5e72aed76b71)

不过`%ERRORLEVEL%`返回的是个数值，成功执行是0，不成功执行是非0，但是我用作svn命令执行判断的时候发现，有些指令即便不成功执行也返回0？懒得深究

* 找到另外一种方法直接判断返回的字符串

[https://blog.csdn.net/hadsdn/article/details/78957361](https://blog.csdn.net/hadsdn/article/details/78957361)
