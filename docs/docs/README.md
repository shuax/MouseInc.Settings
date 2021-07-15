# MouseInc

## 简介
MouseInc是一款小巧好用的全局鼠标手势软件。

郑重承诺永久免费，无广告，不扫描硬盘，不上传隐私。

个人作者没有能力和精力解决报毒的问题，只能承诺永无任何恶意行为。

**杀软报毒，如果信任我，请加入白名单。如果信不过，就不要使用，不要找我反馈！！！**

便携化设计，单执行文件，无运行库依赖，不需要安装就能运行。

首次运行时会在当前目录释放MouseInc.json配置文件。（注意保证目录可写哦）

## 开始
如果你第一次使用，推荐先打开设置界面（双击通知区域的图标），看一下程序有什么功能，有哪些默认手势。

设置界面采用Web技术编写，测试兼容Chromium内核和Gecko内核，所以推荐安装Chrome或Firefox。

如果无法打开设置或者无法连接设置通道，则只能手动编辑配置文件。

设置界面已经开源到[GitHub](https://github.com/shuax/MouseInc.Settings)，欢迎帮我完善。

如果你不喜欢在线版设置，你也可以通过上面的开源代码自行构建本地版设置。

有人对设置界面这个技术比较感兴趣，参考：

https://github.com/zserge/lorca
https://github.com/GoogleChromeLabs/carlo/

## 警告
由于Vista以上系统采用了用户界面特权隔离（UIPI），低权限程序无法操作高权限程序。

比如当前激活窗口是任务管理器，普通权限运行的MouseInc将无法正常点击右键。

所以为了程序正常工作，**强烈推荐自动获取管理员权限**。

另外一些安全软件同样会导致无法正常点击右键，例如360，请自行处理。

如果你开启了用户权限控制（UAC），那么每次打开的时候会有一个弹窗提示。

如果你想去掉这个提示，可以用任务计划来跳过，具体操作请看常见问题。

## 反馈
对软件有什么建议，或者发现了问题欢迎在[GitHub](https://github.com/shuax/MouseInc.Settings/discussions)的discussions提问题。

软件运行中会输出一些调试信息，可以下载 [Dbgview.exe](https://docs.microsoft.com/en-us/sysinternals/downloads/debugview) 进行查看。
