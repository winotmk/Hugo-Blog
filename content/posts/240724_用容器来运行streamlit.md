---
title: 用容器来运行streamlit
date: 2024-07-24
categories:
- docker
tags:
- docker
- streamlit
image: http://pictures.winotmk.com/240724_%E7%94%A8%E5%AE%B9%E5%99%A8%E6%9D%A5%E8%BF%90%E8%A1%8Cstreamlit/2025-03-06-14-16-24_bf12f74b.png
---
![2025-03-06-14-16-24 [hugo-no-render]](http://pictures.winotmk.com/240724_%E7%94%A8%E5%AE%B9%E5%99%A8%E6%9D%A5%E8%BF%90%E8%A1%8Cstreamlit/2025-03-06-14-16-24_bf12f74b.png)
一开始玩这个的时候就在想用docker跑，因为实在不想在本机里搭各种乱七八糟的环境，也懒得用Anaconda那样的中间环境，总感觉本地跑个模型才用得上那种大玩意儿，于是在dockerhub上找了找
一些已有的可用镜像：
https://hub.docker.com/r/aminehy/docker-streamlit-app
https://hub.docker.com/r/samdobson/streamlit
就是镜像build都好几年前了，实测目前有些新的例程都跑不了，还是自己做个镜像吧
## 制作dockerfile
https://docs.streamlit.io/deploy/tutorials/docker
好在官网已给出方案
这是我微改后的：
```
# app/Dockerfile

FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    software-properties-common \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/streamlit/streamlit-example.git .

RUN pip3 install -r requirements.txt

EXPOSE 8501

HEALTHCHECK CMD curl --fail http://localhost:8501/_stcore/health

CMD ["streamlit", "run", "main.py", "--server.port=8501", "--server.address=0.0.0.0"]
```
 <!-- more -->
主要就最后一行并没有用`ENTRYPOINT`，因为记得这个不是必须，用`CMD`的好处是非常方便的就能修改`docker run`时要运行的内容
## 构建和使用镜像
打开CMD，CD到这个Dockerfile保存的目录下
`docker build -t streamlit_winotmk:latest . `点不要落下

然后就可用来运行任意py的app文件了
`docker run -ti --rm -p 8501:8501 -v $(pwd):/app streamlit_winotmk:latest streamlit run name_main_file.py`
`$(pwd)`换成宿主机的目录，记得暴露8501的默认端口
我这里目录是`C:\Cloud\docker\streamlit\demo3\examples`
所以直接:
`docker run -ti --rm -p 8501:8501 -v C:\Cloud\docker\streamlit\demo3\examples:/app streamlit_winotmk:latest streamlit run intro.py`
保持运行并想下次继续用可以
`docker run -ti -d -p 8501:8501 -v $(pwd):/app --name MystreamlitAPP streamlit_winotmk:latest`
*用容器跑起来的一些例程APP：
![2025-03-06-14-30-24](http://pictures.winotmk.com/240724_%E7%94%A8%E5%AE%B9%E5%99%A8%E6%9D%A5%E8%BF%90%E8%A1%8Cstreamlit/2025-03-06-14-30-24_1488ee48.png)

![2025-03-06-14-30-30](http://pictures.winotmk.com/240724_%E7%94%A8%E5%AE%B9%E5%99%A8%E6%9D%A5%E8%BF%90%E8%A1%8Cstreamlit/2025-03-06-14-30-30_e5ad57f1.png)