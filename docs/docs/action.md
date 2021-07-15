# 动作列表
MouseInc内置了丰富动作，这是实际功能的列表。

充分阅读本篇文章，你就会成为使用MouseInc的高手！

所有动作不区分大小写，`Window`等同于`window`

所有的手势动作，会以手势画出的起点作为目标窗口。

## Window
一系列对窗口进行操作的动作，通过这样使用
```js
["Window", "Minimize"]
```
这个命令可以忽略大小写。`Minimize`等同于`minimize`

### Maximize
窗口最大化，如果已经最大化则还原。
```js
["Window", "Maximize"]
```

### Minimize
窗口最小化。
```js
["Window", "Minimize"]
```

### Top
窗口置顶，如果已经置顶则还原。
```js
["Window", "Top"]
```

### Center
窗口居中。
```js
["Window", "Center"]
```

### Close
关闭窗口。
```js
["Window", "Close"]
```

### CloseSimilar
关闭相似窗口。会关闭相同类名的窗口，比如开了好几个计算器，会同时关闭。
```js
["Window", "CloseSimilar"]
```

### HideTray
隐藏窗口到托盘。双击托盘图标后可以恢复。
```js
["Window", "HideTray"]
```

### ShowTray
恢复所有隐藏到托盘的窗口。
```js
["Window", "ShowTray"]
```

### ToggleTray
切换隐藏窗口到托盘。如果已经有窗口隐藏则恢复，如果没有窗口隐藏则隐藏。
```js
["Window", "ToggleTray"]
```


## Internal
调用MouseInc内部功能，通过这样使用
```js
["Internal", "Settings"]
```
这个命令可以忽略大小写。`Settings`等同于`settings`

### Exit
退出MouseInc。
```js
["Internal", "Exit"]
```

### Pause
暂停/恢复MouseInc功能。
```js
["Internal", "Pause"]
```

### Icon
隐藏/恢复MouseInc托盘图标。
```js
["Internal", "Icon"]
```

### ClipboardMenu
手动打开复制增强菜单，而不需要两次Ctrl+C。
```js
["Internal", "ClipboardMenu"]
```

### Exclude
把当前程序加入到MouseInc排除列表，为避免误操作，此功能使用时会有二次确认弹窗。
```js
["Internal", "Exclude"]
```

### Reload
重新加载MouseInc设置。
```js
["Internal", "Reload"]
```

### Config
手动设置配置文件的`key=value`，注意区分大小写。

多级路径使用`.`分隔，值为json字符串，简单的比如true和false。

设置后会自动刷新配置。
```js
["Internal", "Config", "ShowTrayIcon", "false"],
["Internal", "Config", "Keycast.Open", "true"]
```

### Settings
打开MouseInc设置。
```js
["Internal", "Settings"]
```

### Delay
延长指定时间，单位毫秒。
```js
["Internal", "Delay", "1000"]
```

### Print
打印参数，可用于调试变量展开。参考Execute中相关说明。
```js
["Internal", "Print", "%fullpath%"]
```

### ShowTips
在屏幕右下角显示消息，支持变量展开。参考Execute中相关说明。
```js
["Internal", "ShowTips", "%clipboard%"],
["Internal", "ShowTips", "Title", "%clipboard%"]
```


## SendKeys
非常方便的发送按键，通过这样使用
```js
["SendKeys", "Ctrl+C"]
```
直接使用字符串的方式即可，不需要记忆特殊的符号。同样忽略参数大小写。

使用这个命令，会自动激活目标窗口（手势起点窗口），以免按键失效。

### 特殊按键

普通按键无需说明，这里列出一些特别的按键：

`Escape, Esc, Tab, Backspace, Enter, Space`

`PrtSc, Scroll, Pause, Break`

`Insert, Delete, Del`

`Home, End`

方向键 `Left, Right, Up, Down`

翻页 `PageUp, PageDown, PgUp, PgDn`

加减 `Plus, Minus`

浏览器 `Back, Forward, Refresh`

音量 `VolumeMute, VolumeDown, VolumeUp`

多媒体 `MediaNext, MediaPrev, MediaPlayPause`

小键盘 'Num 0 - Num 9'


### 不激活窗口
```js
["SendKeys", "Ctrl+C", "NOACTIVATE"]
```
有时候不需要激活窗口，则需要这个功能。

## SendKeyDown
发送按键按下【慎用】
```js
["SendKeyDown", "Ctrl"]
```

## SendKeyUp
发送按键弹起【慎用】
```js
["SendKeyUp", "Ctrl"]
```

## Activate
激活目标窗口
```js
["Activate"]
```
就是SendKeys自带的那个功能

## SendClick
非常方便的发送鼠标点击，参数分别为`left`,`right`,`middle`
左键单击
```js
["SendClick", "left"]
```

## MouseMove
鼠标移动到指定位置。其中坐标参数有几个特殊值`start_x`,`start_y`,`end_x`,`end_y`。
```js
["MouseMove", "100", "300"]
```
移动到手势起始点
```js
["MouseMove", "start_x", "start_y"]
```

## SetClipboard
设置剪贴板内容
```js
["SetClipboard", "text"]
```


## Execute
执行命令或打开网页，通过这样使用
```js
["Execute", "Calc"]         // 打开计算器
["Execute", "https://www.baidu.com/"]   //打开百度
```
基本等同于Win+R的效果，支持参数，例如编辑hosts
```js
["Execute", "notepad.exe %systemroot%\\system32\\drivers\\etc\\hosts", "admin"]
```

参数会自动展开。支持系统环境变量，比如`%appdata%`。

另外有一些内置变量：

* `%appdir%` MouscInc所在目录，例如`D:\software\MouscInc\`
* `%clipboard%` 剪贴板文字内容
* `%filepath%` 激活窗口进程路径，例如`C:\Program Files (x86)\Tencent\TIM\Bin\TIM.exe`
* `%filename%` 激活窗口进程名称，例如`TIM.exe`
* `%pid%` 激活窗口进程id，例如`8094`
* `%port%` MouseInc设置端口，例如`53202`

另外如果参数以http开头，那么会对变量自动进行urlencode

支持额外参数：

`hide` 隐藏执行命令，例如关机命令`shutdown`

`admin` 使用管理员运行

`wait` 等待程序执行完毕

**注意：在json中路径分隔符`\`要写成`\\`，路径有空格需要用引号括起来，而引号`"`要写成`\"`。**

例如打开TIM需要写成这样
```js
["Execute", "\"C:\\Program Files (x86)\\Tencent\\TIM\\Bin\\TIM.exe\""]
```

## Execute2
使用Explorer打开程序，可实现管理员运行MouseInc时低权限启动程序。
这个效果更加接近Win+R功能。
基本用法和Execute一致，但不支持额外参数`hide`等。

## Screenshot
截图功能，通过这样使用
```js
["Screenshot", "ToClipboard"]
```
调用这个功能会自动截图手势划过的区域。

如果并非由手势触发，那么区域会设置为当前激活窗口。

如果需要更精准的区域选择，请使用`Snapshot`

### ToClipboard
截图到剪贴板
```js
["Screenshot", "ToClipboard"]
```

### ToFile
截图到文件，会弹出保存窗口。
```js
["Screenshot", "ToFile"]
```

### Stick
创建贴图，此功能会把截图贴在屏幕上，方便和其它内容放在一起作参考。
```js
["Screenshot", "Stick"]
```

鼠标左键可以拖动窗口，按下`Esc`或点右键退出。

鼠标移动到窗口边缘可以调整窗口大小。

双击或按`空格`或按`回车`可以切换缩略图和原始图。

鼠标滚轮可以调整窗口透明度，避免挡住背景内容。

`Ctrl+C` 复制到剪贴板

`Ctrl+S` 保存该贴图

`Ctrl+O` OCR识别

`Ctrl+W` 关闭贴图

使用`w`,`a`,`s`,`d`每次可移动10个像素。

使用`↑`,`←`,`↓`,`→`每次可移动1个像素。


### PiP
创建画中画，此功能会把目标窗口区域贴在屏幕上，会保持对窗口内容的跟踪。

**注意：目标窗口关闭后会失去内容，目标窗口最小化后会停止刷新内容。**
```js
["Screenshot", "PiP"]
```

鼠标左键可以拖动窗口，按下`Esc`或点右键退出。

鼠标移动到窗口边缘可以调整窗口大小。

双击或按`空格`或按`回车`可以还原默认透明度和大小。

鼠标滚轮可以调整窗口透明度，避免挡住背景内容。

使用`w`,`a`,`s`,`d`每次可移动10个像素。

使用`↑`,`←`,`↓`,`→`每次可移动1个像素。


### OCR
截图后进行OCR识别，识别结果会自动复制到剪贴板。
```js
["Screenshot", "OCR"]
```

目前使用接口：http://aidemo.youdao.com/ocrdemo


## Snapshot
矩形截图功能，通过这样使用
```js
["Snapshot", "Stick"]
```
和`Screenshot`的区别是这个功能会调出一个内置截图窗口，通过框选矩形的方式截图，选择区域更精准。

使用`w`,`a`,`s`,`d`每次可调整10个像素。

使用`↑`,`←`,`↓`,`→`每次可调整1个像素。

按下`Esc`或右键或激活其他窗口可以取消本次截图。

**注意，一次只能启动一个截图窗口**


### ToClipboard
截图到剪贴板
```js
["Snapshot", "ToClipboard"]
```

### ToFile
截图到文件，会弹出保存窗口。
```js
["Snapshot", "ToFile"]
```

### Stick
创建贴图
```js
["Snapshot", "Stick"]
```

### PiP
创建画中画
```js
["Snapshot", "PiP"]
```

### OCR
进行OCR识别
```js
["Snapshot", "OCR"]
```


## GetClipboard
读取剪贴板进行操作，通过这样使用。

目前此功能主要针对图片，且对图像格式有一定要求。
```js
["GetClipboard", "Stick"]
```

### ToFile
保存到文件，会弹出保存窗口。
```js
["GetClipboard", "ToFile"]
```

### Stick
创建贴图
```js
["GetClipboard", "Stick"]
```

### OCR
进行OCR识别
```js
["GetClipboard", "OCR"]
```



## ScreenshotHQ
高质量截图功能，通过这样使用
```js
["ScreenshotHQ", "ToFile", "DrawCursor|TransparencyGrid"]
```
调用这个功能会对当前活动窗口截图。

这个截图会保留窗口阴影，半透明（包括win7和win10的毛玻璃特效）。

支持额外参数：

`DrawCursor` 绘制鼠标指针

`TransparencyGrid` 使用透明网格填充背景


### ToClipboard
截图到剪贴板，如果没有使用网格填充背景，则会填充白色背景。
```js
["ScreenshotHQ", "ToClipboard"]
```

### ToFile
截图到文件，会弹出保存窗口，并且根据窗口标题和时间自动填充文件名。
```js
["ScreenshotHQ", "ToFile"]
```


## Algorithm
调用各种算法。第三个参数会自动展开，参考Execute中相关说明。

### b64decode
base64解码，成功后会自动复制到剪贴板中
```js
["Algorithm", "b64decode", "%clipboard%"]
```

### b64encode
base64编码，成功后会自动复制到剪贴板中
```js
["Algorithm", "b64encode", "%clipboard%"]
```

### urlencode
urlencode，成功后会自动复制到剪贴板中
```js
["Algorithm", "urlencode", "%clipboard%"]
```

### urldecode
urldecode，成功后会自动复制到剪贴板中
```js
["Algorithm", "urldecode", "%clipboard%"]
```

### md5
md5，成功后会自动复制到剪贴板中
```js
["Algorithm", "md5", "%clipboard%"]
```

### sha1
sha1，成功后会自动复制到剪贴板中
```js
["Algorithm", "sha1", "%clipboard%"]
```

### sha256
sha256，成功后会自动复制到剪贴板中
```js
["Algorithm", "sha256", "%clipboard%"]
```

### qrcode
生成二维码，会自动复制到剪贴板中，并且借用贴图功能进行显示。
```js
["Algorithm", "qrcode", "%clipboard%"]
```

### CyberChef
使用CyberChef网站探测输入
```js
["Algorithm", "CyberChef", "%clipboard%"]
```


## Explorer
调用资源管理器功能。

### select
打开文件所在位置。第三个参数会自动展开，参考Execute中相关说明。
```js
["Explorer", "select", "%fullpath%"]
```

### recyclebin
清空回收站
```js
["Explorer", "recyclebin", "noconfirmation|noprogressui"]
```

支持额外参数：

`noconfirmation` 无需确认

`noprogressui` 不显示进度界面

### turnoffmonitor
关闭显示器
```js
["Explorer", "turnoffmonitor"]
```

## SetBrightness
亮度调节功能。

### 调高亮度（最高100）
```js
["SetBrightness", "UP"]
```

### 调低亮度（最低0）
```js
["SetBrightness", "DOWN"]
```

### 默认亮度（100）
注意：退出MouseInc后会自动恢复默认亮度。
```js
["SetBrightness", "DEFAULT"]
```

## PostMessage
给窗口发送指定消息，和系统API保持一致，可以实现一些特殊操作。
```js
["PostMessage",       "272",               "40022"]
//PostMessage(WM_SYSCOMMAND, IDC_MANAGE_EXTENSIONS, 0)
```
共三个参数，省略默认为0。



## RegSet
设定注册表功能，只支持数字和字符串两种类型。
```js
["RegSet", "HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced", "HideFileExt", "0"]
```
参数分别为路径、名称、值。

如果值不存在则删除该项。

