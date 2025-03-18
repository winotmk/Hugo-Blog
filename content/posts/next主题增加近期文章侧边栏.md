---
title: next主题增加近期文章侧边栏
date: 2023-07-27
tags:
- hexo
- next
---
## 边栏显示文章列表效果
我还奇怪next没用提供这样的功能，文章一多一篇篇翻实在是累，还好找到了有人实现最近文章的功能，那么做文章列表也就同理了
![2025-02-28-00-06-56](http://pictures.winotmk.com/next%E4%B8%BB%E9%A2%98%E5%A2%9E%E5%8A%A0%E8%BF%91%E6%9C%9F%E6%96%87%E7%AB%A0%E4%BE%A7%E8%BE%B9%E6%A0%8F/2025-02-28-00-06-56_9999a2e7.png)

我修改过的代码
首先是：
### sidebar.njk
`/hexo-theme-next/layout/_macro/sidebar.njk`
在最后一个`{% endif %}`后面加入
```
      {% if theme.recent_posts.enable %}
          <div class="links-of-blogroll" style="margin-top:20px; border-style:dotted none none none; padding-top:5px; text-align:left;padding-left: 20px; padding-right: 10px; padding-bottom: 5px;">
            <div class="links-of-blogroll-title" style="padding-bottom: 5px; padding-top: 5px; padding-left: 0px; padding-right: 20px; font-size: 1.6em; argin-right: 5px;">
          <!-- 选择合适的icon -->
          {%- if theme.recent_posts.icon %}<i class="{{ theme.recent_posts.icon }}" aria-hidden="true"></i>{%- endif %}
              <b style="font-size: 0.65em; padding-left: 8px; position: relative; top: -2px;">{{ theme.recent_posts.description }}</b>
            </div>
            <ul class="links-of-blogroll-list">
          <!-- 文章排序规格,-updated 按照文章更新时间倒排 -->
              {% set posts = site.posts.sort('-updated').toArray() %}
          <!-- 显示20数目的文章 -->
              {% for post in posts.slice('0','20') %}
                <li class="postsSidebarNumb" style="text-indent: -1em;">
                  <a href="{{ url_for(post.path) }}" title="{{ post.title }}" target="_blank">{{ post.title }}</a>
                </li>
              {% endfor %}
            </ul>
          </div>
      {% endif %}
```
<!-- more -->

出于美观我把一些css代码内嵌进去了其实不推荐这样做（寄
### _config.yml
`/hexo-theme-next/_config.yml`
```
# 近期文章配置  
recent_posts:
  enable: true
  icon: fab fa-markdown
  description: 文章列表
```
### main.styl
`/hexo-theme-next/source/css/main.styl`
是因为我想给文章列表加上计数，直接在css里用伪类做（要不是伪类不能html内嵌写进去我也不写这里
```
//侧边栏计数伪类
body {
counter-reset: postsSidebarNumbsection; 
}

.postsSidebarNumb::before {
  counter-increment: postsSidebarNumbsection;
  content: counter(postsSidebarNumbsection) ": ";
}
```

## 一些搜集资料

ps在查找的过程中发现提到这些的多半是next主题，而且别人的next主题都挺有意思的啊想搬！（爬

### 资料01：Hexo博客：(7)给NexT主题添加最新文章模块

首先是这篇
[https://pickear.github.io/2020/04/12](https://pickear.github.io/2020/04/12/Hexo%E5%8D%9A%E5%AE%A2%EF%BC%9A-7-%E7%BB%99NexT%E4%B8%BB%E9%A2%98%E6%B7%BB%E5%8A%A0%E6%9C%80%E6%96%B0%E6%96%87%E7%AB%A0%E6%A8%A1%E5%9D%97%20-%20%E5%89%AF%E6%9C%AC/)
提到了：
next/layout/_macro/sidebar.swig ,这个负责渲染侧边栏。在sidebar.swig的if theme.links的end if后面添加以下代码:
```
{% if theme.recent_posts %}
<div class="links-of-blogroll motion-element {{ "links-of-blogroll-" + theme.recent_posts_layout  }}">
  <div class="links-of-blogroll-title">
	<!-- modify icon to fire by szw -->
	<i class="fa fa-history fa-{{ theme.recent_posts_icon | lower }}" aria-hidden="true"></i>
	{{ theme.recent_posts_title }}
  </div>
  <ul class="links-of-blogroll-list">
	{% set posts = site.posts.sort('-date') %}
	{% for post in posts.slice('0', '5') %}
	  <li>
		<a href="{{ url_for(post.path) }}" title="{{ post.title }}" target="_blank">{{ post.title }}</a>
	  </li>
	{% endfor %}
  </ul>
</div>
{% endif %}
```
然后在NexT主题目录下的_config.yaml配置文件，添加下面配置:
```
recent_posts_title: 最新文章
recent_posts_layout: block
recent_posts: true
```
然而实际效果是只会显示“最新文章”几个字
![2025-02-28-00-07-34](http://pictures.winotmk.com/next%E4%B8%BB%E9%A2%98%E5%A2%9E%E5%8A%A0%E8%BF%91%E6%9C%9F%E6%96%87%E7%AB%A0%E4%BE%A7%E8%BE%B9%E6%A0%8F/2025-02-28-00-07-34_09b50eb8.png)

查了得知 
> NexT 的架構檔案格式從 swig 改成 njk，照著舊的文章貼上不會成功

---

### 资料02：[Day33] Hexo x NexT - 顯示最新文章、導入Google Analytics 的坑

接着是这篇，感谢提到了next主题架构更变的问题
https://ithelp.ithome.com.tw/articles/10283488?sc=iThomeR

*左側選單顯示最新文章*

NexT 已經有 hexo-related-popular-posts 套件來顯示最新文章列表的功能，但是這個套件似乎沒辦法正常運作，網路上有不少教學文章，但是 NexT 的架構檔案格式從 swig 改成 njk，照著舊的文章貼上不會成功，設定步驟如下：

在 sidebar.njk 檔案裡面加入下段程式碼（跟 swig 版本就只差了一個 .toArray() ）

```
{%- if theme.recent_posts %}
  <div class="links-of-blogroll motion-element {{ "links-of-blogroll-" + theme.recent_posts_layout  }}">
  <div class="links-of-blogroll-title">
      <!-- 設定你要的fa fa icon-->
      <i class="fa fa-history fa-{{ theme.recent_posts_icon | lower }}" aria-hidden="true" style="margin: 1rem 0.25rem 0.5rem 0"></i>
      {{ theme.recent_posts_title }}
  </div>
  <ul class="links-of-blogroll-list">
      {%- set posts = site.posts.sort('-date') %}
      {%- for post in posts.slice('0', '5').toArray() %}
      <li>
          <a href="{{ url_for(post.path) }}" title="{{ post.title }}" target="_blank">{{ post.title }}</a>
      </li>
      {%- endfor %}
  </ul>
  </div>
  {%- endif %}
```

---

### 资料03: Hexo-NexT 后续优化

https://blog.yileaf.com/posts/15baca53/
我最后使用的基本上参考了这篇的代码

*侧边栏添加近期文章*
1.打开`blog\source\_data\sidebar.njk`文件，加入以下代码：
```
{% if theme.recent_posts.enable %}
    <div class="links-of-blogroll">
      <div class="links-of-blogroll-title">
		<!-- 选择合适的icon -->
		{%- if theme.recent_posts.icon %}<i class="{{ theme.recent_posts.icon }}" aria-hidden="true"></i>{%- endif %}
        {{ theme.recent_posts.description }}
      </div>
      <ul class="links-of-blogroll-list">
		<!-- 文章排序规格,-updated 按照文章更新时间倒排 -->
        {% set posts = site.posts.sort('-updated').toArray() %}
		 <!-- 显示四条近期文章 -->
        {% for post in posts.slice('0', '4') %}
          <li>
            <a href="{{ url_for(post.path) }}" title="{{ post.title }}" target="_blank">{{ post.title }}</a>
          </li>
        {% endfor %}
      </ul>
    </div>
{% endif %}
```
2.主题config.yml
```
# 近期文章配置  
recent_posts:
  enable: true
  icon: fas fa-history
  description: 近期文章
```