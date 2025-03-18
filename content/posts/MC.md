---
title: SourceCraft服务器
date: 2021-11-07
tags:

- Minecraft
image: http://pictures.winotmk.com/MC/2025-02-27-23-58-20_41d3fcaa.png
---
![2025-02-27-23-58-20 [hugo-no-render]](http://pictures.winotmk.com/MC/2025-02-27-23-58-20_41d3fcaa.png)

Java服务器地址：mc.winotmk.com:25465
基岩服务器地址：mc.winotmk.com:19132

网站：
Web地图：[http://mcmap.winotmk.com](http://mcmap.winotmk.com)

<!-- more -->

## 服务器概况

目前版本：spigot-1.20.1
自有服务器，计划长期开服，主世界不清档，视情况可以增加副世界
使用了Geyser插件，实现基岩版和Java版本同服，支持多种客户端，可以在手机和电脑上同时玩 ~~（主机也行没测过~~

开服日期：2021-11-07
容器化上云: 2023-08-25

世界结构：
Lobby
MainWorld -Nether -TheEnd
LyhWorld

![2025-02-27-23-58-52](http://pictures.winotmk.com/MC/2025-02-27-23-58-52_69aad3ef.png)

现有传送门：

1. Lobby去塔顶
2. Lobby去主世界（主传送门）
3. Lobby去lyh存档世界
4. 主世界往返湖边村落

## 更新log
**2023-08-25**
- 版本由spigot-1.17.1更新至spigot-1.20.1
- 运行环境eci内运行，服务器文件nas上存储，环境和数据分离
- 服务器版本更新至1.20.1（顺带更新对应插件版本）
禁用如下插件：
- PlaceholderAPI
- MiaoChat(被曝有后门)
- wolfyutilities
- ServerMinimap(似乎没啥用)
- Dynmap(web端地图，性能消耗巨大，体积巨大，暂移除)


## 常用玩家命令

按T输入文本

**第一次进服务器需要注册**
```
/reg 密码 密码
```


登录
```
/l 密码
```

回主城lobby
```
/spawn
```

回家（上次认得床）
```
/home
```

回上次移动的地方（或上次死的地方)
```
/back
```

移动到玩家身边（需要对方确认)
```
/tpa 玩家名
```

## 开始

首先选择一个版本
如果你买过Windows版、主机，iPad之类的版本，可以选择基岩版
或者在windows和MAC上玩Java版

![2025-02-27-23-59-11](http://pictures.winotmk.com/MC/2025-02-27-23-59-11_9e56d9af.png)

附上Windows游戏购买链接
java：[https://www.minecraft.net/zh-hans/store/minecraft-java-edition](https://www.minecraft.net/zh-hans/store/minecraft-java-edition)
基岩：[https://www.minecraft.net/zh-hans/store/minecraft-windows10](https://www.minecraft.net/zh-hans/store/minecraft-windows10)

### Java版连接服务器

#### 如果购买过正版java版本

直接进多人游戏输入服务器地址`mc.winotmk.com:25465`即可

#### 如果没有购买

这里提供原版纯净客户端：

链接：[https://pan.baidu.com/s/1dl3mBgqhmvxPGMNVG2bRgw](https://pan.baidu.com/s/1dl3mBgqhmvxPGMNVG2bRgw)
提取码：lijt

#### 下载java运行环境

[https://www.oracle.com/java/technologies/downloads/#jdk17-windows](https://www.oracle.com/java/technologies/downloads/#jdk17-windows)

#### 下载客户端

运行HMCL登陆器

登录方式选离线模即可，写个名字，即游玩服务器时的名字

![2025-02-27-23-59-23](http://pictures.winotmk.com/MC/2025-02-27-23-59-23_b3cad586.png)

ps.如果启动失败请确保使用了java17

![2025-02-27-23-59-32](http://pictures.winotmk.com/MC/2025-02-27-23-59-32_c5b58d87.png)

进游戏选择

![2025-02-27-23-59-41](http://pictures.winotmk.com/MC/2025-02-27-23-59-41_39df0b39.png)

**第一次进服务器需要按T**

**然后输入/reg 密码 密码**

注册

enjoy！

### 基岩版连接服务器

启动游戏选服务器，添加服务器

![2025-02-27-23-59-51](http://pictures.winotmk.com/MC/2025-02-27-23-59-51_9e2d5ea9.png)

然后输入地址mc.winotmk.com端口19132

![2025-02-27-23-59-59](http://pictures.winotmk.com/MC/2025-02-27-23-59-59_8d4c333a.png)

## 服务器插件列表

以下部分玩家有兴趣可看

插件有功能类和玩法类多种，简单记录一下目前所有的插件

1. ActionHealth
2. AncientGates
3. AureliumSkills-Beta1.1.4
4. BlockLocker
5. ~~BossShopPro~~
6. CatSeedLogin-1.3.9
7. ~~Dynmap-3.2.1-spigot~~
8. EssentialsX-2.19.0
9. EssentialsXChat-2.19.0
10. EssentialsXSpawn-2.19.0
11. Geyser-Spigot_基岩转发
12. ~~GiftPack~~
13. GSit
14. LuckPerms-Bukkit-5.3.47
15. ~~MiaoChat~~
16. NekoMaid
17. PocketGames
18. Residence5.0.0.4
19. ~~ServerMinimap~~
20. Tree Feller-V2.2
21. Multiverse

API前置类

1. CMILib1.0.4.2_圈地前置
2. ~~PlaceholderAPI-2.10.10~~
3. SmartInvs-1.2.7
4. Vault
5. Uniporter-1.3.2_Web管理前置
6. ~~wolfyutilities-1.7.2.0~~

#### ActionHealth

![2025-02-28-00-00-21](http://pictures.winotmk.com/MC/2025-02-28-00-00-21_f74c2081.png)

在物品栏上显示血量
[https://www.spigotmc.org/resources/action-bar-health.2661/](https://www.spigotmc.org/resources/action-bar-health.2661/)

#### AncientGates

传送门

基础用法：
本插件可以传送一切实体，包括玩家、运输工具、实体都能进入传送门
这个插件不仅能跨服务器传送实体和输入指令，而且可以在进入另一个服务器时输入指令
指令非常简单
首先，需要输入指令打开功能：/gate setconf bungeeCordSupport true
接下来你就可以使用任何关于BC的指令，创建传送门方法与普通的方法几乎无异
/gate setto [id] [服务器] - 设置传送到的目的地
/gate setbungeetype [id] [LOCATION/SERVER] - 在本地服务器上设置传送类型
/gate addto [id] [服务器] - 添加传送到的服务器
/gate remto [id] [服务器] - 删除可以传送到的服务器

[https://www.mcbbs.net/forum.php?mod=viewthread&tid=584063](https://www.mcbbs.net/forum.php?mod=viewthread&tid=584063)

#### AureliumSkills

技能系统

> * 15 种独特的技能 (耕作Farming, 锻造Foraging, 挖矿Mining, 钓鱼Fishing, 采掘(旧版本翻译为掘土)Excavation, 箭术Archery, 防御Defense, 战斗Fighting, 耐力Endurance, 敏捷Agility, 炼金Alchemy, 附魔Enchanting, 巫术Sorcery, 治愈Healing, 以及锻造Forging)
> * 6 种玩家属性 (生命Health, 力量Strength, 再生Regeneration, 幸运Luck, 智慧Wisdom, 以及韧性Toughness)
> * 简洁明了, 能显示详细信息的 GUI
> * 能够自定义物品和盔甲上的特殊属性
> * 自定义打怪, 采集和钓鱼获得的特殊物品(掉落表/道具池, 原文为 Loot Table)
> * 经验值来源及大小均可修改,Beta 1.1.1以后不再支持 MythicMobs 自定义怪物作为经验来源
> * 多语言支持
> * ActionBar 与 BossBar 位置显示
> * 可供开发者使用的 API
> * 支持 MySQL

/skills 或 /skill 或 /sk - 打开技能菜单,详见MCBBS
MCbbs搬运：[https://www.mcbbs.net/forum.php?mod=viewthread&tid=1094927](https://www.mcbbs.net/forum.php?mod=viewthread&tid=1094927)
[https://www.spigotmc.org/resources/aurelium-skills-advanced-skills-stats-abilities-and-more.81069/](https://www.spigotmc.org/resources/aurelium-skills-advanced-skills-stats-abilities-and-more.81069/)

#### BlockLocker

![2025-02-28-00-00-32](http://pictures.winotmk.com/MC/2025-02-28-00-00-32_48cd7dd1.png)

上锁插件

**使用方法**

**1. 放置木牌**
对于容器类: 只需放置木牌即可,[私有]和玩家名会被自动生成.
对于门类: 放置木牌在门上或周围的方块上即可,内容会自动生成.

其他:你也可以自己添加锁定信息,按照生成木牌的格式填写即可~

**2.编辑木牌**
右击木牌,输入"/blocklocker <行数> <文本>"来编辑木牌.
指令简写: "/bl" = "/blocklocker",方法为: "/bl <行数> <文本>".
可添加其他字符来避免被识别为玩家名,例如 "~".

**3.信任其他玩家**
在第二步的 <文本> 内容中添加你要信任的玩家名即可.
如果想添加两个以上的玩家名,再放置一个木牌即可,内容会自动添加.
第二个木牌添加内容 "‘[更多使用者]’ ‘[所有人]’".
"[所有人]"标签将允许所有人访问容器.请更改.

MCbbs搬运：[https://www.mcbbs.net/forum.php?mod=viewthread&tid=1173296](https://www.mcbbs.net/forum.php?mod=viewthread&tid=1173296)
[https://www.spigotmc.org/resources/blocklocker.3268/](https://www.spigotmc.org/resources/blocklocker.3268/)

#### ~~BossShopPro~~

已移除
商店系统

[https://www.mcbbs.net/forum.php?mod=viewthread&tid=829068](https://www.mcbbs.net/forum.php?mod=viewthread&tid=829068)
商店页面编辑器：[https://www.mcbbs.net/forum.php?mod=viewthread&tid=1273221](https://www.mcbbs.net/forum.php?mod=viewthread&tid=1273221)

#### CatSeedLogin

![2025-02-28-00-00-50](http://pictures.winotmk.com/MC/2025-02-28-00-00-50_8e0ba904.png)

种子猫登录插件
基岩入口和java入口都关闭了正版验证，所以加了登录插件来管理玩家的账号，此插件备选可替换AuthMe

> 登录
>     /login 密码
>     /l 密码
> 注册密码
>   /register 密码 重复密码
>   /reg 密码 重复密码
> 修改密码
>   /changepassword 旧密码 新密码 重复新密码
>   /changepw 旧密码 新密码 重复新密码
>
> 绑定邮箱  
> /bindemail set 邮箱  
> /bdmail set 邮箱
> 用邮箱收到的验证码完成绑定  
> /bindemail verify 验证码  
> /bdmail verify 验证码
> 忘记密码，请求服务器给自己绑定的邮箱发送重置密码的验证码
>   /resetpassword forget  /repw forget
> 用邮箱收到的验证码重置密码
>   /resetpassword re 验证码 新密码
>   /repw re 验证码 新密码

MCBBS:[https://www.mcbbs.net/forum.php?mod=viewthread&tid=847859](https://www.mcbbs.net/forum.php?mod=viewthread&tid=847859)

#### ~~Dynmap~~

![2025-02-28-00-01-19](http://pictures.winotmk.com/MC/2025-02-28-00-01-19_f4d458dc.png)

20230825更新：会消耗过多云服务资源暂移除

Web端卫星地图，还可3d显示，实时显示在线玩家位置，上帝视角

Mcbbs:[https://www.mcbbs.net/forum.php?mod=viewthread&tid=990539](https://www.mcbbs.net/forum.php?mod=viewthread&tid=990539)
[https://dynmap.us/builds/dynmap/](https://dynmap.us/builds/dynmap/)

#### EssentialsX

系列管理插件

[https://www.mcbbs.net/forum.php?mod=viewthread&tid=619883](https://www.mcbbs.net/forum.php?mod=viewthread&tid=619883)

#### Geyser-Spigot

![2025-02-28-00-01-48](http://pictures.winotmk.com/MC/2025-02-28-00-01-48_5ffb87f9.png)

该插件让基岩版玩家可以进入本服务器

[https://geysermc.org/](https://geysermc.org/)
[https://www.mcbbs.net/thread-973002-1-1.html](https://www.mcbbs.net/thread-973002-1-1.html)

#### ~~GiftPack~~

已移除
礼包插件

[https://www.mcbbs.net/thread-1141658-1-1.html](https://www.mcbbs.net/thread-1141658-1-1.html)

#### GSit

![2025-02-28-00-01-59](http://pictures.winotmk.com/MC/2025-02-28-00-01-59_7753d937.png)

座椅子插件

/gsit(/sit) 坐在方块上
/glgy(/lay) 躺在方块上
/gcrawl(/crawl) 趴在方块上
/gsittoggle(/sittoggle) 开关右键坐下
/gsitreload(/gsitrl) 重载插件配置

[https://www.mcbbs.net/forum.php?mod=viewthread&tid=1107053](https://www.mcbbs.net/forum.php?mod=viewthread&tid=1107053)
[https://www.spigotmc.org/resources/gsit-modern-sit-seat-and-chair-lay-and-crawl-plugin-1-13-x-1-17-x.62325/](https://www.spigotmc.org/resources/gsit-modern-sit-seat-and-chair-lay-and-crawl-plugin-1-13-x-1-17-x.62325/)

#### LuckPerms

![2025-02-28-00-02-10](http://pictures.winotmk.com/MC/2025-02-28-00-02-10_710adb1e.png)

权限管理
[https://www.mcbbs.net/forum.php?mod=viewthread&tid=676818](https://www.mcbbs.net/forum.php?mod=viewthread&tid=676818)
[https://www.spigotmc.org/resources/luckperms.28140/](https://www.spigotmc.org/resources/luckperms.28140/)

#### ~~MiaoChat~~

![2025-02-28-00-02-20](http://pictures.winotmk.com/MC/2025-02-28-00-02-20_c60723e4.png)

聊天功能增加

20230825更新：移除，被曝有后台

聊天的时候输出%数字，代表展示手上物品
%1-9 代表快捷物品栏1-9号格子的物品

[https://www.mcbbs.net/forum.php?mod=viewthread&tid=631240](https://www.mcbbs.net/forum.php?mod=viewthread&tid=631240)

#### NekoMaid

![2025-02-28-00-02-35](http://pictures.winotmk.com/MC/2025-02-28-00-02-35_f2094a00.png)

Wed后台管理插件

[https://www.mcbbs.net/forum.php?mod=viewthread&tid=1230139](https://www.mcbbs.net/forum.php?mod=viewthread&tid=1230139)

#### PocketGamesPo

![2025-02-28-00-03-01](http://pictures.winotmk.com/MC/2025-02-28-00-03-01_2e632f3e.png)

34+口袋游戏|随时随地想玩就玩

**玩家命令:**

* **/pocketgames|/pocket|/pg - 打开游戏菜单**
* **/pg help - 打开插件帮助**
* /pg menu [玩家名] - 为指定玩家打开游戏菜单
* /pg multiplayer [玩家名] - 为指定玩家打开多人游戏菜单
* /pg spectate [玩家名] - 为指定玩家打开观战菜单
* /pg play <游戏ID> [玩家名] - 让指定的玩家玩指定的游戏
* /pg highscore <游戏ID> [玩家名] - 为指定玩家打开指定游戏的高分榜
* /pg duel <a/d/玩家名> [游戏ID] - 接受邀请/拒绝邀请/邀请玩家进行多人游戏
* /pg check <玩家名> - 检查玩家是否在玩游戏以及玩的什么游戏
* /pg list - 插件的游戏列表

**管理员命令:**

* **/pocketgamesadmin|/pga - 管理员帮助信息**
* /pga reset file <文件名> [只可填highscores.yml]
* /pga reset database [表] - 刷新数据库指定的表
* /pga info - 插件信息
* /pga reload - 重载插件

[https://www.mcbbs.net/forum.php?mod=viewthread&tid=913753](https://www.mcbbs.net/forum.php?mod=viewthread&tid=913753)

#### Residence

![2025-02-28-00-03-12](http://pictures.winotmk.com/MC/2025-02-28-00-03-12_f6ad867b.png)

圈地插件

/res ? —— 查看帮助

[https://www.mcbbs.net/forum.php?mod=viewthread&tid=631343](https://www.mcbbs.net/forum.php?mod=viewthread&tid=631343)

#### ~~Serverminimap~~

小地图

20230825更新：似乎没啥用，移除

/minimap - 为您提供小地图项目
/waypoint help [command] - 为您提供有关此命令的信息
/waypoint add [x] [z] - 在您当前的位置或指定的 x 和 z 坐标上添加一个航点。
/waypoint list - 列出所有航点及其索引
/waypoint remove <index> - 删除索引为 <index> 的航点。注意：删除航点时，索引会发生变化。
/waypoint hide <index> [true|false] - 切换航点的可见性，或将其设置为给定的布尔值。

> /lp group admin permission set minimap.fastupdate
> /lp group admin permission set minimap.command.minimap
> /lp group admin permission set minimap.command.waypoint.help
> /lp group admin permission set minimap.command.waypoint.list
> /lp group admin permission set minimap.command.waypoint.add
> /lp group admin permission set minimap.command.waypoint.remove
> /lp group admin permission set minimap.command.waypoint.hide

https://dev.bukkit.org/projects/serverminimap

#### Tree Feller

一键砍树插件

[https://www.spigotmc.org/resources/tree-feller.92998/](https://www.spigotmc.org/resources/tree-feller.92998/)

#### Multiverse

多世界插件

#命令语法

> mv [FILTER] [PAGE #]
> #发送版本信息至控制台
>
> mv version -[pbg]
> #列出所有世界名称
>
> mv list
> #列出综合信息
>
> mv info [WORLD] [PAGE]
> */mv info [世界名称] [页码]
>
> #创建世界
> mv create {名字} {环境} -s [种子] -g [生成器[:ID]] -t [生成器] [-n] -a [true|false]
>
> #复制某个世界
> mv clone {目标} {名字} -g [生成器[:ID]]
>
> #转换某个世界的类型
> mv import {名字} {环境} -g [生成器[:ID]] [-n]
>
> #重新加载配置文件
> mv reload
>
> #重置当前世界的默认出生点为脚下
> mv setspawn

mcbbs:[https://www.mcbbs.net/forum.php?mod=viewthread&tid=1016455](https://www.mcbbs.net/forum.php?mod=viewthread&tid=1016455)

[https://www.spigotmc.org/resources/multiverse-core.390/](https://www.spigotmc.org/resources/multiverse-core.390/)
