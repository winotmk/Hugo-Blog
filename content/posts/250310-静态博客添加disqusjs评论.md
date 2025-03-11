---
title: 静态博客添加disqusjs评论
description: ""
date: 2025-03-10T11:33:47.816Z
preview: ""
draft: false
image: http://pictures.winotmk.com/250310-%E9%9D%99%E6%80%81%E5%8D%9A%E5%AE%A2%E6%B7%BB%E5%8A%A0disqusjs%E8%AF%84%E8%AE%BA/2025-03-10-19-48-47_460e258c.png
tags:
    - web
    - 博客
    - 开发
categories:
    - web
---
![2025-03-10-19-48-47 [hugo-no-render]](http://pictures.winotmk.com/250310-%E9%9D%99%E6%80%81%E5%8D%9A%E5%AE%A2%E6%B7%BB%E5%8A%A0disqusjs%E8%AF%84%E8%AE%BA/2025-03-10-19-48-47_460e258c.png)

---

## 注册disqus评论
### 获取api
https://disqus.com/api/applications/
在这里点新建一个 application，然后要绑定你的博客域名才会给公钥，记录下公钥Public Key
![2025-03-10-19-43-26](http://pictures.winotmk.com/250310-%E9%9D%99%E6%80%81%E5%8D%9A%E5%AE%A2%E6%B7%BB%E5%8A%A0disqusjs%E8%AF%84%E8%AE%BA/2025-03-10-19-43-26_6225c1e9.png)
### 获取shortname
https://disqus.com/admin/
如果你点开上面页面跳转了，则说明需要新建一个shortname
![2025-03-10-19-45-15](http://pictures.winotmk.com/250310-%E9%9D%99%E6%80%81%E5%8D%9A%E5%AE%A2%E6%B7%BB%E5%8A%A0disqusjs%E8%AF%84%E8%AE%BA/2025-03-10-19-45-15_9b04d600.png)
我这里建完后是这样的，winNote即是我的短名，有一些个性化设置可以改

## 设置到静态博客
我用的是hugo stack主题，已经内置了disqusjs，只需要在根目录的hugo.yaml设置里填入对应的即可
![2025-03-10-19-46-28](http://pictures.winotmk.com/250310-%E9%9D%99%E6%80%81%E5%8D%9A%E5%AE%A2%E6%B7%BB%E5%8A%A0disqusjs%E8%AF%84%E8%AE%BA/2025-03-10-19-46-28_b2e388e9.png)
这里的`ApiUrl`是个什么呢？是我自己设置的反向代理

## 设置反向代理
可参考：
https://blog.ichr.me/post/use-disqus-conveniently/
原因是我发现作者提供的默认地址https://disqus.skk.moe/disqus/
似乎已经有点不好用了
简单搭建一下倒是很快
### Cloudflare Workers 反代
在 Cloudflare 中新建一个 Worker，将下述代码替换原有代码。
https://workers.cloudflare.com/
```
addEventListener('fetch', event => {
    event.respondWith(proxy(event));
});

async function proxy(event) {
    const getReqHeader = (key) => event.request.headers.get(key);

    let url = new URL(event.request.url);
    url.hostname = "disqus.com";

    let parameter = {
        headers: {
            'Host': 'disqus.com',
            'User-Agent': getReqHeader("User-Agent"),
            'Accept': getReqHeader("Accept"),
            'Accept-Language': getReqHeader("Accept-Language"),
            'Accept-Encoding': getReqHeader("Accept-Encoding"),
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0'
        }
    };

    if (event.request.headers.has("Referer")) {
        parameter.headers.Referer = getReqHeader("Referer");
    }

    if (event.request.headers.has("Origin")) {
        parameter.headers.Origin = getReqHeader("Origin");
    }

    return fetch(new Request(url, event.request), parameter);
}
```
例如这里是我的：
![2025-03-10-19-39-59](http://pictures.winotmk.com/250310-%E9%9D%99%E6%80%81%E5%8D%9A%E5%AE%A2%E6%B7%BB%E5%8A%A0disqusjs%E8%AF%84%E8%AE%BA/2025-03-10-19-39-59_e2a1b57b.png)
`https://winotmk-di-xxxxxx.winotmk.workers.dev/api/`即是我的代理地址了

## 后续
然而即便设置了这些以后，我的博客依然经常在无梯网络环境中出现类似：
![2025-03-11-12-18-14](http://pictures.winotmk.com/250310-%E9%9D%99%E6%80%81%E5%8D%9A%E5%AE%A2%E6%B7%BB%E5%8A%A0disqusjs%E8%AF%84%E8%AE%BA/2025-03-11-12-18-14_22c104c3.png)
评论加载很慢或者干脆加载不了的情况，正在考虑换成自架waline