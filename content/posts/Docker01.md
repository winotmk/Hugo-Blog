---
title: Docker01_用docker构建hexo和vsftpd与ddns镜像并且用阿里云容器服务ECI运行
date: 2023-08-05
categories:
- docker
tags:
- hexo
- next
- docker
- 阿里云
- eci
---
<style type="text/css" rel="stylesheet">
.nav-number { 
    display:none !important;
}
.post-toc .nav-item {
    white-space: normal !important;
}
</style>

一口气步子迈得有大，慢慢记录一下,如果你碰巧看到这个文章，希望这个文章的某些部分对你有帮助，来源我已尽量在文章中标出，还有很多部分是自己敲的

了解ECI弹性容器：https://www.aliyun.com/product/eci
了解阿里云NAS文件存储：https://www.aliyun.com/product/nas

**为什么要用eci来运行hexo？**
因为好玩，同时来学习从pull到发布到运行整个docker镜像的流程，也想给自己的hexo博客找个新家，酷酷的那种
本博客之前是由树莓派上的hexo生成，部署到github上的
最近在捣鼓docker，一时想不起来有什么灵活小巧的服务拿来用docker玩，那么想着干脆把树莓派上hexo这部分服务做成镜像，需要用的时候拿出来用用想必是极好的（这么一来好像树莓派又要吃灰了）
恰巧最近又在琢磨阿里云ECI容器服务，所以理论上是可以用我自己打包好的镜像的
最后成品的结构大致如下图：

![2025-02-28-00-09-02](http://pictures.winotmk.com/Docker01/2025-02-28-00-09-02_461c3121.png)

这里挂了3个镜像：
**1.node.js+git+ssh+hexo**
主要是此镜像——由node.js+hexo组成的运行hexo环境，用过的都了解hexo是基于node.js的，每次我们生成文章的时候都会`hexo g -d`，而运行这套需要一个环境容器
git和ssh主要是部署在github上用的，同时我习惯用VSCode的SSH FS来管理远程文件和写博客，主要是ssh连接，也方便我拿PuTTY和WinSCP远程登录管理
**2.vsftpd**
一个常用的ftp服务，我是在本地些完再上传的，用这个是因为我发现如果要给文章插入图片，我还需要手动用ssh上传到hexo对应目录里。而用VSCode的SSH FS可以帮我自动同步本地工作目录和云上即将生成静态网页的hexo目录，非常方便！
**3.ddns**
因为容器是即用即开，用完就释放的，每次开会新分配一个弹性IP做为外网接口，但是不想每次都去复制这个新的ip地址，那么就要用到动态域名解析，刚好我在阿里云上购买过一个我自己的域名，所以ddns这部分服务就拉出来做个镜像

还挂了一个NAS盘：
![2025-02-28-00-09-26](http://pictures.winotmk.com/Docker01/2025-02-28-00-09-26_46c6e19a.png)
挂载以后：
![2025-02-28-00-09-35](http://pictures.winotmk.com/Docker01/2025-02-28-00-09-35_bc212f63.png)
可见我的hexo，主题，文章，图片等等都存放在里面，服务容器可以随便释放拉取，数据不会受到影响，几百M的NAS容量价格抹零后可以忽略不计



文章后面（第三部分）会说如何按我的需求构建定制这几个镜像，并上传到阿里云容器镜像ARK仓库以方便调用

<!-- more -->

**vsftpd**还有**ddns**可以与主镜像**node.js+hexo**合并成一个大镜像吗？
**当然可以**，但我实际做了几次以后发现把ftp，ddns这样常用的服务功能单独拿出来会方便得多的多，毕竟我想起别得服务，也可以给他们挂上ftp等常用服务，我也可以选择不挂，这样容器的优势就体现出来了。我可以把单一的服务都做成单独的小镜像，需要哪个挂哪个，性能消耗也很小

整套下来有这些部分：

1. **docker基本操作**
2. **已经启动的本地容器修改端口，启动容器时即启动服务等**
3. **打包制作自己的docker镜像(dockerfile)**
4. **docker镜像打包并上传到阿里云镜像库ARK**
5. **eci容器创建模板和eci命令行工具使用**
6. **hexo本地编辑环境设置————如何用VSCode舒服的写MD文档**

附表：
群晖搭建私有镜像仓库和dockerengine设置
eci价格计算表

---

## 1. docker 基本操作
博主吐槽一下，总觉得一些类似run，commit操作完全可以做成一个美观好用的UI控制软件，但是docker destop就是不做，然后大家都默认敲命令行是方便的，好用的。十分不解，可能需要ui的不会写ui，熟练使用命令行的也不需要什么ui吧，诶
——后面随着对docker了解的深入，明白它不是虚拟机，用得还是linux内核，这么一想，处处真是浓浓的linux味，现在能提供一个windows下的Docker Desktop桌面程序，已经非常得不错了！
资料网站：

[官方命令大全](https://docs.docker.com/engine/reference/commandline/cli/)

[基于Docker的Hexo博客搭建](https://chunchengwei.github.io/ruan-jian/ji-yu-docker-de-hexo-bo-ke-da-jian/)

这个基本操作写得还行下次爬一篇下来吧：

[[小抄] Docker 基本命令](https://yingclin.github.io/2018/docker-basic.html)

### 1.1 运行容器
```bash
docker run -it -d --name [container-name] -p 8088:80 [image-name]
```
这里是将容器内的80端口映射到宿主机的8088端口

参数说明

`-d` 表示后台运行容器
`-t` 为docker分配一个伪终端并绑定到容器的标准输入上
`-i` 是让容器的标准输入保持打开状态
`-p` 指定映射端口

还能这么写：

```bash
docker run --name mssql -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=xxxx' \
     -p 1433:1433  \
     -d mssql-2019-with-cimb
```
`\`应该是可以换行表述
`-e` 定义环境变量（通常制作镜像的时候应该已经写好了，或者在容器内做好自动脚本，run时候再写毕竟是不方便的）

### 1.2 将此容器 commit 保存为新镜像：

格式：
```
docker commit container-id new-name
```
container-id也可以是已有容器的名字，例如：
```
docker commit node-test nodehexo
```
nodehexo这里是新镜像名

### 1.3 启动docker引擎时自动运行docker容器：
https://blog.csdn.net/londa/article/details/97611947

ps:上面链接文章还有:修改docker容器的挂载路径，修改docker默认的存储位置
```
docker run --restart=always
```
有时候，我们创建容器时忘了添加参数 `--restart=always` ，当 Docker 重启时，容器未能自动启动，

现在要添加该参数怎么办呢，方法有二：

1、Docker 命令修改

```
docker container update --restart=always 容器名字
```

我实际运行时，可以支持同时配置多个容器id，比如（其中container关键字可以忽略不写）

```
docker update 87cd61ad7f7c f488b0479f24 2109903220ce 1fb346ea1a46 --restart=no
```
2、直接改配置文件

首先停止容器，不然无法修改配置文件

配置文件路径为：`/var/lib/docker/containers/` 容器ID

在该目录下找到一个文件 hostconfig.json ，找到该文件中关键字 RestartPolicy

修改前配置：`"RestartPolicy":{"Name":"no","MaximumRetryCount":0}`

修改后配置：`"RestartPolicy":{"Name":"always","MaximumRetryCount":0}`

最后启动容器。


### 1.4 有关dockerfile
dockerfile是用来构建镜像的脚本
主要参考这几篇：
https://www.runoob.com/docker/docker-dockerfile.html
https://developer.aliyun.com/article/484262
[docker容器启动时自动启动脚本](https://juejin.cn/s/docker%E5%AE%B9%E5%99%A8%E5%90%AF%E5%8A%A8%E6%97%B6%E8%87%AA%E5%8A%A8%E5%90%AF%E5%8A%A8%E8%84%9A%E6%9C%AC)

#### 编写dockerfile
我的第一个dockerfile：
简单做个测试，在之前做的镜像上加了条启动命令
**Dockerfile** （文件没有后缀)
```
## Set the base image to CentOS  基于nodehexo
FROM nodehexo:V4
COPY ddnsstart.sh /ddnsstart.sh
ENTRYPOINT ["/bin/bash", "/ddnsstart.sh"]
```
很简单:
`FROM`基于`nodehexo:V4`镜像构建
`COPY`就是拷贝构建目录下的`ddnsstart.sh`到之后构建好的镜像根目录下
`ENTRYPOINT`会在用新镜像开启容器时再执行，这里会在执行`/bin/bash`里执行`/ddnsstart.sh`

一个dockerfile只能有一条`ENTRYPOINT`，多个也只执行最后一个,`CMD`也是如此
如果 Dockerfile 中如果存在多个 `CMD` 指令，仅最后一个生效。

关于`CMD`还有些写法，比如还可以
`CMD service ssh start && service XXX start && tail -f /etc/passwd`一起执行多道指令
这在构建镜像的时候会被自动转换为类似：
`CMD ["/bin/sh", "service ssh start","service XXX start","tail -f /etc/passwd"]`

`tail -f /etc/passwd`作用在于防止docker容器开启后立即关闭见下面段落

CMD格式：
```
CMD <shell 命令> 
CMD ["<可执行文件或命令>","<param1>","<param2>",...] 
CMD ["<param1>","<param2>",...]  # 该写法是为 ENTRYPOINT 指令指定的程序提供默认参数
```
推荐使用第二种格式，执行过程比较明确。第一种格式实际上在运行的过程中也会自动转换成第二种格式运行，并且默认是 `bin/sh`

**ddnsstart.sh文件**
```
#!/bin/bash
root/ddnsAPP/ddns -c root/ddnsAPP/config.json
echo "更新mcwrite.winotmk.com解析"
service ssh start
tail -f /etc/passwd
```
这里都是简单的shell命令了
`root/ddnsAPP/ddns -c root/ddnsAPP/config.json`是执行ddns更新，解析新的ip到域名上，因为我这个镜像打算放到阿里云ECI里跑，每次新拉的IP当然都不一样（一直占着一个IP会产生费用，没必要）

同时我还执行了启动ssh服务，有的时候会用上ssh，因为我把网盘挂载到了容器内
`tail -f /etc/passwd`这里起到的比较重要的占着进程的作用，详见下面：

*关于 `CMD` 或 `entrypoint` 构建后 `docker run -dit` 为何容器依然秒退
https://www.zhihu.com/question/344939968
是因为使用了CMD或者entrypoint去service *** start命令作为容器启动命令，主进程执行完结束了，容器也就结束了

>dockerfile 写清楚 entrypoint 和 cmd，启动脚本如果立刻会退出，那么在最后添加 tail -f 某个日志文件。或者 监听某个端口或者进程。
>方法1: 设置容器启动时就启动服务ENTRYPOINT ["flask", "run", "-h", "0.0.0.0", "-p", "80"]
>方法2:CMD service apache2 start && tail -F /var/log/apache2/error.log再极端点 sleep infinite



#### 用dockerfile构建镜像
`docker build -t <新镜像名字:标签> .`
比如`docker build -t nodehexo:V5 .`
请不要忘记最后一个`.`，这表示在当前目录下构建
用这条指令前先`CD`到dockerfile文件所放置的目录
比如我先`CD ./dockerbuild`，因为我的文件放在`用户/dockerbuild`目录下面
然后就拥有了属于构建的镜像！

#### 1.4.1 ENTRYPOINT与CMD的区别

Docker 的 ENTRYPOINT 和 CMD 参数探秘
https://aws.amazon.com/cn/blogs/china/demystifying-entrypoint-cmd-docker/

#### 1.4.2 dockerfile构建镜像时如何选择FROM镜像以减小镜像体积

busybox：
https://blog.csdn.net/hknaruto/article/details/70229896
alpine：
https://hub.docker.com/_/alpine
alpine包管理器APK：
https://wangchujiang.com/linux-command/c/apk.html
https://wiki.alpinelinux.org/wiki/Alpine_Package_Keeper

### 1.5 将已有镜像打包带走/使用将打包来的镜像
https://zhuanlan.zhihu.com/p/348849578

#### 将镜像保存为本地文件
可以使用Docker save命令
```
docker save -o mssql-2019-with-cimb.tar mssql-2019-with-cimb
```
会得到一个`mssql-2019-with-cimb.tar`文件，就可以随身携带啦

从文件载入镜像

#### 从文件载入镜像
使用Docker load命令:
```
docker load --input mssql-2019-with-cimb.tar
```

### 1.6 docker挂载本地目录
有关volume:https://docs.docker.com/storage/volumes/
https://docs.docker.com/get-started/05_persisting_data/
https://blog.csdn.net/zz00008888/article/details/131924286

在Docker中，可以使用“-v”选项来挂载本地目录。该选项需要两个参数，分别是本地目录路径和容器内目录路径。例如，以下命令将本地目录“/home/user/app”挂载到容器内的“/app”目录中：

```
docker run -v /home/user/app:/app my_image
```
这将使得容器可以访问本地目录中的文件，并且任何对该目录的更改也会反映在容器中。

**Docker挂载本地目录到已有容器**

除了在容器启动时挂载本地目录外，还可以在运行时将本地目录挂载到正在运行的容器中。要实现这一点，可以使用“docker cp”命令将本地目录复制到容器中，并使用“docker exec”命令在容器中执行命令。例如，以下命令将本地目录“/home/user/data”挂载到正在运行的容器中：
```
docker cp /home/user/data my_container:/data
docker exec -it my_container bash
```
在容器中，可以访问挂载的目录“/data”，并且任何对该目录的更改也会反映在本地文件系统中。



### 1.7 其他一些操作

```
# ****************************** 容器 ****************************** #
# 查看正在运行的容器
$ docker ps
# 查看所有容器
$ docker ps -a
# 启动/停止某个容器
$ docker start/stop id/name
# 以交互方式启动一个容器
$ docker start -i id/name
# 进入某个容器(使用exit退出后容器也跟着停止运行)
$ docker attach id/name
# 启动一个伪终端以交互式的方式进入某个运行的容器（使用exit退出后容器不停止运行）
$ docker exec -it id/name
# 删除某个容器
$ docker rm id/name
# 复制ubuntu容器并且重命名为test且运行，然后以伪终端交互式方式进入容器，运行bash
$ docker run --name test -ti ubuntu /bin/bash

# ****************************** 镜像 ****************************** #
# 查看本地镜像
$ docker images
# 删除某个镜像
$ docker rmi id/name
# 基于当前目录下的Dockerfile，创建一个名为name:flag的镜像
$ docker build -t name:flag .
```

## 2. 已启动容器操作
### 2.1 win10下docker给已存在的容器添加端口映射的方法

博主再吐槽一下，这个调试阶段如此常用的修改容我端口，改起来却像游戏作弊，不觉得这个要做简单很难，怕只是没做
https://mdnice.com/writing/25822ca29531424d9b68d7feb8273a82
https://blog.csdn.net/Taysuesue/article/details/126706394
https://www.cnblogs.com/kingsonfu/p/11578073.html

查看容器已映射的端口（dockerdeskUI内也可看见）
```
docker port 容器ID/容器名
```
先停止容器
```
docker stop {容器的名称或者 id }
```
查看容器完整的 `hash_of_the_container` 数值：

```
docker inspect {容器的名称或者 id } | grep Id

# 比如：
docker inspect cbe26510c276 | grep Id
# 会得到如下结果：
# "Id": "cbe26510c276fa9a4487a8c2af8cbb49410f2a5305149d2b26eb8ce37c777d00"
```
**如果主机是linux（mac应该也行没测）**
打开 hostconfig.json 配置文件:

```
vim /var/lib/docker/containers/{hash_of_the_container}/hostconfig.json
```
记得还要改 config.v2.json，改法同下面的win10
**如果是win10**
1.先找到容器的配置文件，首先我的电脑地址栏输\\wsl$\进入到网络文件夹上,在一步一步找到容器目录
```
\\wsl$\docker-desktop-data\data\docker\containers
```

2.点击进入相应容器ID文件夹，打开后修改其中的 `config.v2.json` 和 `hostconfig.json`

**hostconfig.json**
```
"PortBindings":{"22/tcp":[{"HostIp":"","HostPort":"50022"}],"3306/tcp":[{"HostIp":"","HostPort":"53306"}],"6379/tcp":[{"HostIp":"","HostPort":"56379"}]}
```
这里的`HostPort`字面意思就是宿主机的端口，所以即：
容器内22>外部5022访问
容器内3306>外部53306访问
容器内6379>外部56379访问

**config.v2.json** 有两处需要添加，只修改一处不生效
```
"ExposedPorts":{"22/tcp":{},"3306/tcp":{},"6379/tcp":{}}
```

```
"Ports":{"22/tcp":[{"HostIp":"0.0.0.0","HostPort":"50022"}],"3306/tcp":[{"HostIp":"0.0.0.0","HostPort":"53306"}],"6379/tcp":[{"HostIp":"0.0.0.0","HostPort":"56379"}]}
```
不过我实际只改了这里的`"ExposedPorts"`貌似就行了

然后重启**docker**，注意不只是重启容器，我一开始只重启容器发现白改了
```
# 重启 docker
service docker restart
```
或者在系统右下角，点击Restart重启整个 Docker 服务，然后再重启 Container 即可正常使用


### 2.2 docker容器内服务开机自启动实现方案（以ssh服务为例）

**<font color=red>注意，2.2这段内容随着对docker和linux了解的深入觉得有不妥，但是作为学习的过程还是保留</font>**

https://blog.csdn.net/qq_38603541/article/details/124028994

因为我后续打算用类似vscode里的remote-ssh来管理容器内，也想用winscp等好用的工具可以接进来，还是有必要开个ssh
**解决方案**
1、正常我们在linux操作系统内设置服务自启动的方法一般都是使用systemctl。

systemctl enable ssh
2、但是，一般在docker容器内我们一般不这么干，因为容器内没有systemctl权限……

3、我们依然还是使用脚本的形式将ssh设为自启，只不过这个的这个脚本和我们使用Dockerfile的脚本不一样。

4、在 /root 目录下新建一个 start_ssh.sh文件，并给予该文件可执行权限。
```
touch /root/start_ssh.sh
 
vim /root/start_ssh.sh
 
chmod +x /root/start_ssh.sh
```
5、start_ssh.sh 脚本的内容，如下：
```
#!/bin/bash
 
LOGTIME=$(date "+%Y-%m-%d %H:%M:%S")
echo "[$LOGTIME] startup run..." >>/root/start_ssh.log
service ssh start >>/root/start_ssh.log
#service mysql start >>/root/star_mysql.log   //其他服务也可这么实现
```
6、将start_ssh.sh脚本添加到启动文件中
```
vim /root/.bashrc
```
 7、在 .bashrc 文件末尾加入如下内容：
```
# startup run
if [ -f /root/start_ssh.sh ]; then
      . /root/start_ssh.sh
fi
```

 8、保存后，等下次重启容器的时候，添加的服务也就跟着重启了。

docker容器在启动的时候，会自动执行的是~/.bashrc文件，所以，环境变量需要配置在该文件内，这样镜像启动时，可自动执行该文件，使环境变量生效。

**<font color=red>正确的理解是：</font>**
/root/.bashrc会在容器启动的时候自动执行这句十分欠妥，
准确的来讲是**root用户登录bash的时候会执行，每次开新的bash shell也会执行一遍**
如果dockerfile内定义了ENTRYPOINT或者CMD执行类似：
```
ENTRYPOINT [ "/bin/bash","-c","service apache2 start" ]
```
那么对于容器来说PID 1号进程就是bash（apache是bash的子进程），也确实会跑一遍.bashrc内的内容，但是这不代表所有容器启动时一定会启动bash shell，也可能直接是个java进程，也可能是dumb-int，更多时候可能是sh shell，这应该都不会触发.bashrc
所以如果想要在容器启动时自动启动一个服务，推荐写在dockerfile里，比如
```
COPY start.sh /
ENTRYPOINT [ "sh","/start.sh" ]
```

然后再在start.sh里写上你需要启动的服务
```
#!/bin/sh
service ssh restart
service apache2 restart
```

以及如果确实有很多个服务需要启，考虑使用类似docker compose启多个镜像，每个镜像跑单个服务

#### 2.2.1 拓展：~/.bashrc /etc/bashrc /etc/profile三个文件的区别
https://segmentfault.com/q/1010000003793341

## 3 打包制作自己的docker镜像(dockerfile)
dockerfile是告诉docker engine如何构建镜像的脚本
### 3.1 node.js+git+hexo镜像
其实这部分镜像做了两遍，第一遍直接拉的官方node镜像，然后发现ssh不好装，走了很多弯路，随着对docker了解的加深，最后我自己做了dockerfile重构了这部分镜像

#### 3.1.1 Dockerfile


**<i class="fas fa-file"></i>dockerfileV02（可以没有后缀）**
```
#这个包将包含：node-v29.5.0  git ssh hexo
#hexo环境目录/hexo/Winblog
FROM debian:stable-slim
LABEL maintainer="winotmk" web="md.winotmk.com" Ver="02"
#ADD有自动解压功能
ADD node-v20.5.0-linux-x64.tar.xz /
    #移动node二进制文件到目录
RUN mkdir -p /usr/local/nodejs &&\
    mv node-v20.5.0-linux-x64 /usr/local/nodejs &&\
    #mk hexo目录
    mkdir -p /hexo/Winblog &&\
    apt-get update &&\
    #安装SSH 安装GIT
    apt-get install -y --no-install-recommends openssh-server git-core &&\
    apt-get autoremove -y &&\
    apt-get clean
#node和npm环境变量
ENV PATH="/usr/local/nodejs/node-v20.5.0-linux-x64/bin:$PATH"
#安装hexo
WORKDIR /hexo/Winblog
RUN npm install -g hexo-cli
#hexo环境变量
ENV PATH="$PATH:/hexo/Winblog/node_modules/.bin"
#更新ssh设置
COPY sshd_config /etc/ssh/
#环境变量设置
COPY .profile /root/
#设置启动脚本
COPY hexo_debian_service_start.sh /service_start.sh
CMD ["/bin/bash","/service_start.sh"]
```
基本上都是些安装命令以及配置环境变量
安装了`hexo`,`git`,`ssh`,`node`
这是优化过了的第二版，主要是第二版使用了`ADD`，它基本和`COPY`一样，都可以把某个构建目录下的文件打入正在生成的镜像里，但当用ADD在执行 <源文件> 为 tar 压缩文件的话，压缩格式为 gzip, bzip2 以及 xz 的情况下，会自动复制并解压到 <目标路径>。说白了ADD会帮我自动解压
在这里我还设置了ssh（但是没有配置root密码）

而我的第一版开头：
**<i class="fas fa-file"></i>dockerfileV01**
```   
FROM debian:stable-slim

COPY node-v20.5.0-linux-x64.tar.xz /node-v20.5.0-linux-x64.tar.xz
RUN apt-get update &&\
    apt-get install -y xz-utils --no-install-recommends &&\
    tar -xvf node-v20.5.0-linux-x64.tar.xz &&\
    mkdir -p /usr/local/nodejs &&\
    mv node-v20.5.0-linux-x64 /usr/local/nodejs &&\
    #删除xz包
    apt-get purge -y xz-utils && \
    apt-get autoremove -y && \
    apt-get clean && \
    #删除node-v20.5.0-linux-x64.tar.xz包
    rm node-v20.5.0-linux-x64.tar.xz

#node和npm环境变量
ENV PATH="/usr/local/nodejs/node-v20.5.0-linux-x64/bin:$PATH"
```
当时不知道`ADD`的功能，使用 `COPY`拷贝整个.tar.xz包结果debian还没有.xz包解压功能，需要安装`xz-utils`[详见](https://blog.csdn.net/weixin_43502175/article/details/129547250)，凭空多出好几行

**为什么要用二进制包安装呢node.js呢？**
因为实测如果用`apt-get install nodejs`安装，
或者`curl -fsSL https://deb.nodesource.com/setup_19.x | bash - &&\
apt-get install -y nodejs`[命令出处](https://github.com/nodesource/distributions)，
安装出来镜像体积就是会楞大出好几百MB

#### 3.1.2 node.js+git+hexo镜像COPY的文件
**<i class="fas fa-file"></i>.profile**
```
# ~/.profile: executed by Bourne-compatible login shells.

if [ "$BASH" ]; then
  if [ -f ~/.bashrc ]; then
    . ~/.bashrc
  fi
fi

mesg n 2> /dev/null || true

export PATH="/usr/local/nodejs/node-v20.5.0-linux-x64/bin:$PATH"
export PATH="$PATH:/hexo/Winblog/node_modules/.bin"
```
为了防止镜像上云后莫名其妙的原因导致环境变量出问题，脚本里再跑一遍，这俩`export PATH`其实dockerfile里设置过

**sshd_config是什么**
ssh的设置
参考：https://blog.csdn.net/weixin_34910922/article/details/125193597
主要改了两条
```bash
#vim /etc/ssh/sshd_config
PermitRootLogin yes #root登陆权限
PasswordAuthentication yes #密码权限
```
等于我们预先改好了配置文件，在构建的时候再把配置放入容器里面

**<i class="fas fa-file"></i>hexo_debian_service_start.sh**
```
#!/bin/bash
. ~/.profile
LOGTIME=$(date "+%Y-%m-%d %H:%M:%S")
echo "[$LOGTIME] startup run..." >>/start_ssh.log
service ssh start >>/start_ssh.log
tail -f /start_ssh.log
```
启动脚本，主要启动了ssh服务，并且用`tail -f`让这个容器一直运行以方便我们来连接

#### 3.1.3 开始构建镜像
先`CD`到Dockerfile所在的目录
![2025-02-28-00-10-57](http://pictures.winotmk.com/Docker01/2025-02-28-00-10-57_85fedbc9.png)
```
docker build -t hexo_debian:V02 -f dockerfileV02 .
```
格式是
```
docker build -t 镜像名:tag -f Dockerfile文件名 .
```
注意`.`不要落下！

这样我们的镜像就做好了！



本节参考资料：
二进制手动安装node参考：
https://github.com/nodejs/help/wiki/Installation
https://blog.51cto.com/u_13460811/4901015

一些关于dockerfile指令的说明：
较详细： https://yeasy.gitbook.io/docker_practice/image/dockerfile/copy
https://blog.csdn.net/qq_35528657/article/details/127244194
https://www.runoob.com/docker/docker-dockerfile.html

在dockerfile里用apt-get包管理的建议：
https://ubuntu.com/blog/we-reduced-our-docker-images-by-60-with-no-install-recommends
https://www.metricfire.com/blog/how-to-build-optimal-docker-images/

hexo所需环境安装说明：
https://hexo.io/zh-cn/docs/index.html

#### 3.1.4 测试镜像功能
来启个容器试试！
```
docker run -it -d -p 22:22 --name hexo_debian hexo_debian:V02
```
这里开放了22端口来方便验证ssh服务和登录ssh没有问题
启动成功！
容器内执行来验证服务状态都正常：
```
ssh
node -v
git -v
```
输出：
![2025-02-28-00-11-11](http://pictures.winotmk.com/Docker01/2025-02-28-00-11-11_3d59334a.png)
可以看见一切正常！

#### 3.1.5 设置和再打包镜像

##### 设置
毕竟自用镜像，我习惯直接把比如ssh密钥之类全都配置好，再`commit`为一个新镜像，以后就再也不用输密码了，这样确实不安全，但是自己的hexo博客而已，何必为难自己呢
接下来设置root密码和重启ssh服务
![2025-02-28-00-11-21](http://pictures.winotmk.com/Docker01/2025-02-28-00-11-21_0c7fd65b.png)
```
passwd root
#然后敲自己设置的密码
service ssh restart
```
尝试使用PuTTY进行SSH root@127.0.0.1登录：
![2025-02-28-00-11-33](http://pictures.winotmk.com/Docker01/2025-02-28-00-11-33_fdc9ecda.png)
成功!!!
接下来配置git和ssh，要生成新的ssh公钥
详见：https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent
![2025-02-28-00-11-48](http://pictures.winotmk.com/Docker01/2025-02-28-00-11-48_647a6186.png)
```
ssh-keygen -t ed25519 -C "github邮箱@qq.com"
```
得到密钥默认在`/root/.ssh/id_ed25519.pub`
![2025-02-28-00-12-13](http://pictures.winotmk.com/Docker01/2025-02-28-00-12-13_dd9d9ecb.png)
在Github的头像点Setting然后点右上角击**New SSH key**，把id_ed25519.pub内容粘贴进即可！
测试SSH连接：
```
ssh -T git@github.com
```
![2025-02-28-00-12-23](http://pictures.winotmk.com/Docker01/2025-02-28-00-12-23_9f4a79cd.png)
这样就连上了！
需要进行一个小设置：
```
git config --global user.email "you@example.com"
```
这样以后使用`hexo d`的时候就能无脑部署了

##### 再打包
为了存下我们配置好的连接，制作成最终镜像方便eci云上调用，把现有容器再commit一次
```
docker commit hexo_debian hexo_debian:V02-configured
```
成了！得到了`hexo_debian:V02-configured`作为我最后准备上传至ECI云的镜像

---
#### 3.1.6 附一些命令参考
##### 如何用ssh连接 docker 容器

https://blog.csdn.net/weixin_34910922/article/details/125193597

1.修改root密码

```
$ passwd root
输入密码：123456(自己决定)
```

2.安装Openssh
```
sudo apt-get update # 更新源
sudo apt-get upgrade # 更新系统软件
apt-get install -y openssh-server
```

3.修改ssh配置,允许root登录
https://blog.csdn.net/weixin_43343144/article/details/102494830
**【非常重要】在/etc/ssh/ssh_config中没有PermitRootLogin yes选项的话，就要在sshd_config文件中寻找！**
```
vim /etc/ssh/sshd_config
PermitRootLogin yes #root登陆权限
PasswordAuthentication yes #密码权限
```
4.启动ssh服务/重启服务

```
service ssh start
service ssh restart
```

##### 安装hexo
```
npm install hexo-cli -g
```

##### SSH远程登录这个镜像
之前在本机docker内已经配好了ssh服务，讲道理应该启动则开启ssh但是不知为啥没有自动启动，以后再研究吧
打开Workbench远程连接，启动ssh
由于我启用ECI时开通了弹性公网IP，所以我可以通过这个IP:22用ssh来登录
![2025-02-28-00-14-08](http://pictures.winotmk.com/Docker01/2025-02-28-00-14-08_59350d93.png)
使用PuTTY工具登录成功！！
![2025-02-28-00-13-59](http://pictures.winotmk.com/Docker01/2025-02-28-00-13-59_dd471be1.png)
多么令人振奋的一刻

---

### 3.2 vsftpd镜像
这个镜像比较简单，只跑ftp服务，主要在写作的时候方便上传图片
#### 3.2.1 Dockerfile
**<i class="fas fa-file"></i>vsftpd_dockerfileV01**
```
#这个包将包含：vsftp（root登录）
FROM debian:stable-slim
LABEL maintainer="winotmk" web="md.winotmk.com" Ver="01"
RUN apt-get update &&\
    apt-get install -y vsftpd --no-install-recommends &&\
    apt-get autoremove -y &&\
    apt-get clean &&\
    echo "root:yourpasswd" | chpasswd
COPY ftpusers /etc/
COPY vsftpd.conf /etc/
COPY service_start.sh /service_start.sh
CMD ["/bin/bash","/service_start.sh"]
```
比较简单的dockerfile，就装了个vsftpd服务，然后拷贝了一些设置文件
如果要在dockerfile里配置用户密码可以这么写：
```
echo "root:yourpasswd" | chpasswd
```
#### 3.2.2 vsftpd镜像COPY的文件
**<i class="fas fa-file"></i>service_start.sh**
```
#!/bin/bash
LOGTIME=$(date "+%Y-%m-%d %H:%M:%S")
echo "[$LOGTIME] startup run..." >>/start_vsftpd.log
service vsftpd start >>/start_vsftpd.log
tail -f /start_vsftpd.log
```
简单的服务启动脚本，使用`tail -f`来维持住进程

**<i class="fas fa-file"></i>ftpusers**
`root`前加个`#`以启用root登录
```
# /etc/ftpusers: list of users disallowed FTP access. See ftpusers(5).

#root
daemon
bin
sys
sync
games
man
lp
mail
news
uucp
nobody
```

**<i class="fas fa-file"></i>vsftpd.conf**
ftp设置文件，这个文件内容很多只些下修改的部分
```
listen=NO
listen_ipv6=YES
anonymous_enable=NO
local_enable=YES
write_enable=YES
dirmessage_enable=YES
use_localtime=YES
connect_from_port_20=YES
pam_service_name=vsftpd
utf8_filesystem=YES
```
*关于修改vsftpd的端口
https://askubuntu.com/questions/37058/how-to-change-vsftpd-default-port
`vsftpd.conf`里的设置不是完全设置，可以自己增加字段
```
listen_port=234
ftp_data_port=235
pasv_min_port=30000
pasv_max_port=31000
```
来设置端口
注意FTP默认20传输数据，21用来listen，所以改得话干脆两个都改吧

*这里遇到过一个小坑坑
![2025-02-28-00-14-45](http://pictures.winotmk.com/Docker01/2025-02-28-00-14-45_1313f14d.png)
构建器报错，一直卡在`Starting FTP server: vsftpdvsftpd failed - probably invalid config. ... (warning).`
![2025-02-28-00-15-01](http://pictures.winotmk.com/Docker01/2025-02-28-00-15-01_61908eb5.png)
自己在容器内运行`service vsftpd start`的时候同样如此，一般这样是因为`vsftpd.conf`文件设置错了，可神奇的是我只要打开dockerDesktop的Files文件管理把`vsftpd.conf`打开再保存一下就可以成功运行`service vsftpd start`
我发现这个文件的格式是UTF-8 CRLF
![2025-02-28-00-15-30](http://pictures.winotmk.com/Docker01/2025-02-28-00-15-30_14a47584.png)
修改为LF
![2025-02-28-00-15-38](http://pictures.winotmk.com/Docker01/2025-02-28-00-15-38_b5d21031.png)
即可顺利启动vsftpd服务

参考：
https://www.cnblogs.com/Dreamcho/p/10805690.html

如果要在dockerfile里加用户：
https://blog.csdn.net/u010275850/article/details/120587850

### 3.3 ddns镜像
这个镜像更简单？只在启动的时候跑一个ddns
但是我却在这里卡了很久
原因之一是因为一开始选用的ddns软件本地跑得好好的，在阿里云上总是报错，log显示已经修改了a记录但是自己去一看啥也没有，很是困惑，所以换了个软件实现
最开始使用的是这个软件，配置方便
https://github.com/NewFuture/DDNS
参考：
https://blog.csdn.net/biao0309/article/details/117202951
无奈阿里云上即便是用官方提供的镜像`newfuture/ddns`也会报错（恼

所以我改用ddns-go:
https://github.com/jeessy2/ddns-go
先贴上官方镜像的层：
**jeessy/ddns-go**
![2025-02-28-00-16-07](http://pictures.winotmk.com/Docker01/2025-02-28-00-16-07_a03a145f.png)
我们的新镜像将基于官方镜像来做
#### 3.3.1 dockerfile
**<i class="fas fa-file"></i>ddns-go_dockerfileV01**
```
FROM jeessy/ddns-go
LABEL maintainer="winotmk" web="md.winotmk.com" Ver="01"
COPY ddns_start.sh /
COPY ddns_go_config.yaml /
ENV DDNS_URL=
ENTRYPOINT [ "sh","/ddns_start.sh" ]
CMD [ "" ]
```



这里做了一个变量`$DDNS_URL`来定义我想要dns的域名(当然这个域名我得拥有)
ENTRYPOINT和CMD的设置会覆盖掉的之前镜像内的设置
我不确定CMD [ "" ]是否有必要，但总之我想使官方镜像里的CMD失效，从结果上来看管用

#### 3.3.2 ddns镜像COPY的文件
**<i class="fas fa-file"></i>ddns_go_config.yaml**
```
dnsconf:
    - ipv4:
        enable: true
        gettype: url
        url: https://myip4.ipip.net,https://ddns.oray.com/checkip,https://ip.3322.net,https://4.ipw.cn
        netinterface: ""
        cmd: ""
        domains:
            - null.winotmk.com
      ipv6:
        enable: false
        gettype: netInterface
        url: https://speed.neu6.edu.cn/getIP.php,https://v6.ident.me,https://6.ipw.cn
        netinterface: ""
        cmd: ""
        ipv6reg: ""
        domains:
            - ""
      dns:
        name: alidns
        id: 阿里云的AccessKey ID
        secret: 阿里云的AccessKey secret
      ttl: ""
user:
    username: ""
    password: ""
webhook:
    webhookurl: ""
    webhookrequestbody: ""
    webhookheaders: ""
notallowwanaccess: true
```
这个是ddns-go的配置文件，第一次启动会在本地:9876打开个web界面，保存设置后会在root中生成这个文件，这里我直接引入这个文件是希望后面能用`sed`命令对文件的`domains`字段进行修改

**<i class="fas fa-file"></i>ddns_start.sh**
```
#!/bin/sh
LOGTIME=$(date "+%Y-%m-%d %H:%M:%S")
echo "[$LOGTIME] startup run..." >>/start_ddns.log
cd /
if [ "$DDNS_URL" = "" ]  
then  
    echo "DDNS_URL is not set!" >>/start_ddns.log 
    tail -f /start_ddns.log 
else    
    sed -i "s/null.winotmk.com/$DDNS_URL/g" ddns_go_config.yaml
    #chmod 777 ddns_go_config.yaml
    sleep 3
    /app/ddns-go -l :9876 -f 300 -c /ddns_go_config.yaml
    echo "已执行更新[$DDNS_URL]解析" >>/start_ddns.log
    tail -f /start_ddns.log
fi
```
在这个脚本里会判断`$DDNS_URL`是否为空，空的话直接输出需要`$DDNS_URL`设置
如果不为空的话会通过`sed`替换字符，这里设置文件内默认写得是`null.winotmk.com`
用这种方式去直接修改设置文件，是因为我没找到这个软件是否能直接用环境变量来定义解析到的域名

关于用sed替换congif.json设置内的字段：
如何使用sed:
https://linux.cn/article-11367-1.html
如何在sed命令内使用变量
https://www.cnblogs.com/muahao/p/6874412.html
判断变量是否为空的方法：
https://cloud.tencent.com/developer/article/1721905







## 4 docker镜像打包并上传到阿里云镜像库ARK

将自己的镜像上传至阿里云：
阿里云提供容器镜像服务，我自己玩开通个人实例即可
https://cr.console.aliyun.com/cn-shanghai/instances

![2025-02-28-00-16-41](http://pictures.winotmk.com/Docker01/2025-02-28-00-16-41_03b9efc6.png)

建立一个自己的仓库，然后就能看到示例说明，我们就能把自己的镜像上传了
### 4.1 将镜像推送到Registry
```
$ docker login --username=*****@qq.com registry.cn-shanghai.aliyuncs.com
$ docker tag [ImageId] registry.cn-shanghai.aliyuncs.com/******:[镜像版本号]
$ docker push registry.cn-shanghai.aliyuncs.com/******:[镜像版本号]
```
`tag`是类似复制一份且重命名镜像，`push`是上传（不知道为什么要重命名

针对上面的3个镜像，分别是：`node.js+git+hexo`,`vsftpd`,`ddns-go`
我分别tag成了：
```
registry-vpc.cn-shanghai.aliyuncs.com/******:debian_V02_configured #应该写成:hexo_debian_V02_configured的，漏了。。算了
registry-vpc.cn-shanghai.aliyuncs.com/******:vsftpd_debian_V01
registry-vpc.cn-shanghai.aliyuncs.com/******:ddns_go_V01
```
再分别`push`即可
### 4.2 在阿里云上使用容器实例（ECI）运行镜像
阿里云ECI提供这个服务，你可以直接用现有的镜像也可以自己上传（就是上一步镜像服务里上传的镜像）按秒收费！不过作为hexo这种启用>生成>部署>关闭的服务来说，花不了几毛钱

![2025-02-28-00-16-51](http://pictures.winotmk.com/Docker01/2025-02-28-00-16-51_c8efac34.png)

然后就能看到我们上传的镜像
![2025-02-28-00-16-59](http://pictures.winotmk.com/Docker01/2025-02-28-00-16-59_7422cb6f.png)

## 5 eci容器创建模板和eci命令行工具使用
参考文章这两篇足够:
https://github.com/aliyuneci/eci-client-doc/blob/main/eci_run.md
https://help.aliyun.com/document_detail/186961.html

### 5.1 eci简介
https://www.aliyun.com/product/eci
ECI是 Serverless 和容器化的弹性计算服务。您无需管理底层 ECS 服务器，只需要提供打包好的镜像，即可运行容器，与阿里云容器服务无缝对接并仅为容器实际运行消耗的资源付费。

博主：比ECS云服务器灵活得多，本地用docker制作好镜像以后，上传，随启随用，用完就释放，成本可以很低,但如果连开一个月，并不会比ECS划算，详见本站[ECI价格计算附表](https://winotmk.github.io/Docker01.1_%E4%BB%B7%E6%A0%BC%E8%AE%A1%E7%AE%97%E8%A1%A8/)

### 5.2 用模板创建eci
![2025-02-28-00-17-18](http://pictures.winotmk.com/Docker01/2025-02-28-00-17-18_4d97b3f6.png)
询问过阿里云客服，说在web控制面版里的这个功能已经下线了
不过没关系，我们还有命令行工具！
安装：
```
sudo bash -c "$(curl -s https://eci-docs.oss-cn-beijing.aliyuncs.com/eci-client/1.0/install.sh)"
```
然后配置你的阿里云信息
```
eci config set-context \
--access-key-id **** \
--access-secret **** \
--region-id cn-shanghai \
--security-group-id sg-**** \
--v-switch-id vsw-****
```
要指定自己的`access-key-id`和`access-secret`，地区以及安全组和虚拟交换机
建议这些东西在web上的控制台里准备好，会直观很多

然后就可以直接创建一个容器了
```
eci run -n myeci centos:7 sleep 3600
```
指令很像`docker run`喝！很好，很有精神

我们还可以编写yaml模板文件
然后执行
```
eci run -f eci.yaml -w 20
```
需要注意的事，如果使用了`-f xxxx.yaml`模板文件，除了-f和-w选项以外，其他选项都将被忽略，因为这些选项都是针对实例中某个容器的，如果模板中定义了多个容器，ECI将不知道这些选项应该作用于哪个容器
那么我自己的启动模板是这样的：
**<i class="fas fa-file"></i>hexo_debian_eci.yaml**
```
ContainerGroupName: eci-hexo
Cpu: "0.5"
Memory: "1"
Container:
- Name: hexo
  Image: registry-vpc.cn-shanghai.aliyuncs.com/****:debian_V02_configured
  Command: ["/bin/bash","/service_start.sh"]
  ImagePullPolicy: IfNotPresent
  Cpu: "0.5"
  Memory: "1"
  VolumeMount:
  - Name: hexo
    MountPath: /hexo
    ReadOnly: false
- Name: vsftpd
  Image: registry-vpc.cn-shanghai.aliyuncs.com/****:vsftpd_debian_V01
  Command: ["/bin/bash","/service_start.sh"]
  ImagePullPolicy: IfNotPresent
  VolumeMount:
  - Name: hexo
    MountPath: /hexo
    ReadOnly: false
- Name: ddns
  Image: registry-vpc.cn-shanghai.aliyuncs.com/****:ddns_go_V01
  ImagePullPolicy: IfNotPresent
  EnvironmentVar:
  - FieldRefFieldPath: ""
    Key: DDNS_URL
    Value: mdwrite.winotmk.com
Volume:
- Name: hexo
  Type: NFSVolume
  NFSVolume:
    Server: ****.cn-shanghai.nas.aliyuncs.com
    Path: /
    ReadOnly: false
```
是不是挺像`docker compose`~

cpu只给了0.5,Memory 1G，足够了，之前这套可是在树莓派3B上跑得溜溜得呢
对于阿里云ECI，CPU和Memory直接和成本挂钩，能少就少吧

这里启了上面做好的3个镜像，分别实现hexo，ftp，还有ddns
`Command:`写法目测类似dockerfile里的`CMD`，我习惯做好启动sh脚本就是为了方便这里再调用
最后一段声明了我的一个阿里云NAS卷，卷里的内容就是我的hexo目录
![2025-02-28-00-17-56](http://pictures.winotmk.com/Docker01/2025-02-28-00-17-56_bc212f63.png)
然后把它挂到hexo和ftp镜像上就好了

值得一提的是ddns镜像还写了个环境变量`DDNS_URL`值为`mdwrite.winotmk.com`，这会修改`ddns-go`的解析配置

然后执行
```
eci run -f hexo_debian_eci.yaml -w 20
```
不出意外的话会返回一个eci的id编号，打开web会发现已经创建成功了！
![2025-02-28-00-18-19](http://pictures.winotmk.com/Docker01/2025-02-28-00-18-19_748517aa.png)

## 6 hexo本地编辑环境设置————如何用VSCode舒服的写MD文档
### 6.1 VSCodeSSH FS插件配置
![2025-02-28-00-18-33](http://pictures.winotmk.com/Docker01/2025-02-28-00-18-33_e39a872e.png)
简单配置一下服务器地址和用户密码就可以把远程目录映射到工作区里，很方便
![2025-02-28-00-18-42](http://pictures.winotmk.com/Docker01/2025-02-28-00-18-42_2bdf1198.png)
这里可以看到`/root/hexo/Winblog`目录下是我挂载的阿里云NAS网盘了
### 6.2 Markdown Paste插件配置
一个很方便的在VScode里直接粘图的插件
#### 配置：
![2025-02-28-00-18-51](http://pictures.winotmk.com/Docker01/2025-02-28-00-18-51_08d61cb4.png)
会用时间来命名图片
然后会将图片放入MD文件目录下的`images`下
![2025-02-28-00-19-01](http://pictures.winotmk.com/Docker01/2025-02-28-00-19-01_bae3735a.png)

然后文件》首选项》键盘快捷方式
![2025-02-28-00-19-19](http://pictures.winotmk.com/Docker01/2025-02-28-00-19-19_690acbb0.png)
我将快捷键设置为`ctrl+alt+a`
配置完成！
#### 使用：
截图我习惯用Sinpaste，按F1就能截图
![2025-02-28-00-19-36](http://pictures.winotmk.com/Docker01/2025-02-28-00-19-36_68b61e41.png)
然后点右下角复制按钮
在VScode的markdown文档里`ctrl+alt+a`就能粘图了！
![2025-02-28-00-19-45](http://pictures.winotmk.com/Docker01/2025-02-28-00-19-45_282c0fc0.png)
图片文件会自动保存!

### 6.2 VSCode的SFTP插件配置
先把images文件夹单独放到工作区里
然后在Ctrl+Shift+P打开命令面板，运行SFTP: config命令
sftp.json目录下会出现一个名为的基本配置文件.vscode
![2025-02-28-00-19-58](http://pictures.winotmk.com/Docker01/2025-02-28-00-19-58_4d3f4080.png)
然后编辑
**<i class="fas fa-file"></i>sftp.json**
```
{
    "name": "Hexo_images",
    "host": "mdwrite.winotmk.com",
    "protocol": "ftp",
    "port": 21,
    "username": "root",
    "password": "****",
    "remotePath": "/hexo/Winblog/source/images",
    "useTempFile": false,
    "openSsh": false,
    "uploadOnSave": false, 
    "watcher": {
      "files": "**/*",
      "autoUpload": true,
      "autoDelete": true
    },
    "syncOption": {
      "delete": true
    }
}
```
`"watcher"`是用来设置自动更新的
这样我们在md里粘了图，就会自动上传到到ftp目录上

参考：
https://marketplace.visualstudio.com/items?itemName=Natizyskunk.sftp#remote-explorer
开启watcher模式，实现增加文件时自动上传目录同步
https://github.com/Natizyskunk/vscode-sftp/blob/master/FAQ.md#automatically-sync-both-ways-without-user-interaction
