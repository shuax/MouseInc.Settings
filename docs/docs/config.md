# 配置文件
**注：大部分配置可以通过设置界面直接进行修改。**

如果配置文件MouseInc.json不存在，主程序会自动释放默认配置文件。

所以如果配置文件改坏了，不知道怎么改回来，直接删掉。重新运行程序就会重新创建一个新的配置。

或者有时候程序更新以后，配置文件不兼容也可以这样操作。

注意：[json格式](http://www.json.org/json-zh.html)要求比较严格，详情可以查看官方文档介绍。

## json
JSON 是轻量级的文本数据交换格式。JSON 比 XML 更小、更快，更易解析。

### 花括号`{}`
表示对象(object)，存储 名称/值 的集合。
```json
{
    "name": "David",
    "age": 18
}
```
名称是字符串，应该使用双引号括起来

### 方括号`[]`
表示数组(array)，存储 值 的列表。
```json
[
    "1",
    2,
    true,
    {},
    []
]
```

### 值(value)
可以是字符串(string)、数值(number)、true、false、null、对象(object)或者数组(array)

### 字符串(string)
用双引号 `""` 括起来，可以是属性或值

### 冒号 `:`
表示后者是前者的值，类似于其它语言的等于`=`

### 逗号 `,`
数据应该使用逗号分隔**（注意最后一组后面没有逗号）**

### 转义
如果字符串中含有特殊字符，则需要转义。

例如：**文件路径中需要使用`\\`而不是`\`，双引号应该使用`\"`而不是`"`。**

### 注释
你可能会发现我在部分说明中使用了`//`来表示注释，然而程序实际上并不支持带注释的json。


## 多语言
多语言信息，控制程序的界面显示。典型内容如下：
```js
"Language": "auto",
"Locales": {
    "zh-CN": {
        "Autorun": "开机启动(&A)",
        "Settings": "设置(&S)...",
    }
}
```
如果程序读取失败则会显示英文信息。例如无法找到`TrayTip`对应的语言则会直接显示`TrayTip`。

`auto`会根据系统语言进行显示，你也可以通过修改`Language`为`zh-CN`强制显示汉语。

目前程序内嵌英语、简体、繁体。英语基本是谷歌翻译的，有问题可以联系我进行修改。

## 显示图标

是否在系统托盘处显示MouseInc图标
```js
"ShowTrayIcon": true,
```


## 音量回馈

音量调节时是否播放音效，默认播放
```js
"VolumeControlSound": true,
```

具体的声音效果
```js
"VolumeSoundIndex": 0,
```

## 快速音量调节

按住Alt时滚动滚轮调节音量大小，按下滚轮禁音
```js
"WheelAltControl": true,
```

## 快速移动窗口

按住Alt时按住鼠标左键拖动，可以直接移动窗口
```js
"AltDrag": true,
```

## 快速复制粘贴

鼠标选中或双击文字自动复制（根据光标），按住左键点右键粘贴
```js
"AutoClip": false,
```

## 按键音效

发出悦耳的打字声
```js
"KeySound": false,
```

具体的声音效果
```js
"KeySoundIndex": 0,
```

## 滚轮穿透

是否开启鼠标滚轮穿透，默认禁用

win10自带此功能，推荐老系统win7开启。
```js
"WheelThrough": false,
```

## 自然滚动

是否开启鼠标滚轮自然滚动，默认禁用

保持和Mac OS X一致（滚轮反向）。
```js
"WheelNatural": false,
```

## 大写锁定提示

在屏幕右上角显示大写锁定状态

方便那些没有指示灯的键盘
```js
"CapsLockLed": false,
```

## 自动关闭大写锁定

在30秒后自动取消大写锁定

通常我们不需要一直开启大小锁定
```js
"CapsUnlock": false,
```

## 边缘滚动

鼠标在屏幕四个边滚动时触发的功能。
```js
"WheelEdge": {
  "Open": true,   // 是否开启，默认打开
  "Left": {       // 左边缘触发功能
   "Valid": true,
   "UpActions": [["SendKeys", "VolumeUp"]],
   "DownActions": [["SendKeys", "VolumeDown"]],
   "PressActions": [["SendKeys", "VolumeMute"]],
   "Name": "Volume"
  },
  "Top": {...},      // 上边缘触发功能
  "Right": {...},    // 右边缘触发功能
  "Bottom": {...}    // 底边缘触发功能
},
```

## 触发角

鼠标移动到屏幕四个角触发的功能。
```js
"HotCorner": {
  "Open": false,   // 是否开启，默认关闭
  "TopLeft": {       // 左上角触发功能
   "Valid": true,
   "Actions": [["SendKeys", "Win+Tab"]],
   "Name": "切换桌面"
  },
  "TopRight": {...},      // 右上角触发功能
  "BottomLeft": {...},    // 左下角触发功能
  "BottomRight": {...}    // 右下角触发功能
},
```


## 排除列表
排除列表，在列表中的程序不会启用鼠标手势等功能，忽略大小写。
```js
"Excludes": [
    "Photoshop.exe"
],
```

## 忽略全屏程序

是否开启忽略全屏程序，默认开启

如果当前程序是一个全屏程序，会自动暂停MouseInc功能。
```js
"IgnoreFullScreen": true,
```

## 鼠标手势
下面是鼠标手势的基础配置。
```js
"MouseGesture": {
    "Open": true,               // 是否开启，成功后会对手势起点下面的窗口进程起作用
    "WheelSwitch": true,        // 滚轮切换，按下右键的时候，滚动滚轮是否进行自定义操作。
    "StartDistance": 10,        // 触发距离，按下鼠标右键以后移动超过这个距离才会开启手势
    "Timeout": 1000,            // 手势超时，单位毫秒，超过这个时间未移动鼠标，会放弃手势
    "RestoreEvent": false,      // 手势失效时后否还原鼠标按下事件
    "AddMode": false,           // 手势未识别时进行添加
    "FailColor": "#CAD0D3",     // RGB格式的手势颜色（特用于识别失败时）
    "DrawColor": "#E47542",     // RGB格式的手势颜色
    "DrawResult": true,         // 是否绘制识别结果
    "DrawTrace": true,          // 是否绘制鼠标轨迹
    "TraceWidth": 3,            // 轨迹宽度
    "TraceArrow": true,         // 是否绘制轨迹箭头
    "Sensitive": 50             // 手势识别灵敏度 0 - 100，默认50
}
```

### 滚轮切换
如果开启滚轮切换功能，那么滚轮上下滚动会产生两个特殊动作。

分别会执行手势中的`WheelSwitchUp`和`WheelSwitchDown`。

一般会用于切换标签，支持为不同程序分配不同动作。

### 手势列表

这里保存的是手势的数据，一般不要手动更改。

```js
"Gestures": [{
        "Sign": "UP",
        "Data": [0, 259, 0, 247, 0, 237, 0, 224, 0, 203, 0, 169, 0, 140, 0, 106, 0, 96, 1, 63, 2, 34, 2, 13, 3, 0]
    },
    {
        "Sign": "DOWN",
        "Data": [0, 0, 0, 13, 0, 26, 0, 44, 0, 56, 0, 66, 0, 76, 0, 89, 0, 99]
    }
]
```

Sign表示为每个手势定义的符号名字。

Data实际上是一系列坐标点，会在识别形状时使用。


### 通用手势
```js
"MatchGlobal": [{
    "Valid": true,
    "Actions": [
        ["SendKeys", "Ctrl+C"]
    ],
    "Name": "复制",
    "Sign": "UP"
}, {
    "Valid": true,
    "Actions": [
        ["SendKeys", "Ctrl+V"]
    ],
    "Name": "粘贴",
    "Sign": "DOWN"
}],
```
`MatchGlobal`用于存储通用手势

Sign为匹配的手势符号

Name为匹配结果名称，这个名称可以自动读取多语言信息。

Valid代表这个手势是否生效，方便临时禁用，而不用删除。

Actions为匹配成功以后的动作序列，支持多个动作依次执行，每个动作会间隔100ms。

Actions非常重要，程序许多功能都由这个实现。

具体支持哪些动作，请参看动作说明。

#### 手势动作结构
每一个手势动作结构为：
```js
["SendKeys", "Ctrl+C"]
```
前面`SendKeys`为实际执行的动作名称，忽略大小写。

后面`Ctrl+C`实际上是这个动作使用的参数，有一些动作可能支持多个参数。

### 特定手势
```js
"MatchCustom": [{
    "Name": "浏览器",
    "Match": ["Chrome.exe", "Firefox.exe", "MicrosoftEdge.exe", "iexplore.exe"],
    "List": [{
        "Valid": true,
        "Actions": [
            ["SendKeys", "Home"]
        ],
        "Name": "页面顶部",
        "Sign": "UP"
    }, {
        "Valid": true,
        "Actions": [
            ["SendKeys", "End"]
        ],
        "Name": "页面底部",
        "Sign": "DOWN"
    }]
},{
    "Name": "Chrome",
    "Match": ["Chrome.exe"],
    "List": [{
        "Valid": true,
        "Actions": [
            ["SendKeys", "Ctrl+Shift+N"]
        ],
        "Name": "隐私窗口",
        "Sign": "P"
    }]
}, {
    "Name": "Firefox",
    "Match": ["Firefox.exe"],
    "List": [{
        "Valid": true,
        "Actions": [
            ["SendKeys", "Ctrl+Shift+P"]
        ],
        "Name": "隐私窗口",
        "Sign": "P"
    }]
}]
```
`MatchGlobal`特定手势

`List`结构同通用手势。

`Name`这组手势的名称，没有实际作用。

`Match`为匹配的程序列表。

这个配置会忽略大小写`Chrome.exe`等同于`chrome.exe`

支持多个程序共用一组设置，比如多个浏览器的通用快捷键，可以写在一组里面。

如果有不同的快捷键，再单独为这个程序配置，就像上面演示的一样。


## 全局热键
直接使用一个快捷键绑定动作。

格式为修饰键+普通键。其中修饰键为Ctrl，Alt，Shift，Win。
```js
"Hotkeys": [{
    "Keys": "Ctrl+PrtSc",
    "Valid": true,
    "Actions": [
        ["ScreenshotHQ", "ToFile", "DrawCursor|TransparencyGrid"]
    ]
}],
```
Actions同手势。


## 复制增强
是否对复制进行增强，默认关闭。
```js
"ClipboardManager": {
    "Open": false,
    "Menu": [{
        "Valid": true,
        "Actions": [["Execute", "https://www.baidu.com/s?wd=%clipboard%"]],
        "Name": "百度(&B)"
    }]
}
```
选中文字快速按下两次Ctrl+C后，会弹出一个快捷操作菜单，可以进行搜索等。

为了避免误操作，两次按键时间间隔需要小于0.5秒，文字长度需要小于100k。

其中`Name`项如果为空，则生成菜单分隔线。

Actions同手势。

## 按键回显
在屏幕上显示键盘按键，方便录制教程
```js
"Keycast": {
    "Open": false,          // 是否开启，默认关闭
    "IgnoreSingle": false,  // 是否忽略单个字符，默认关闭
    "X": 40,                // 窗口相对屏幕左边偏移，如果是负数则相对右边
    "Y": 84,                // 窗口相对屏幕顶部偏移，如果是负数则相对底部
    "Space": 50,            // 窗口间隔
    "FontSize": 32,         // 字体大小
    "Fade": 5,              // 消失时间
    "TextColor": "#FFFFFF",        // RGB格式的文字颜色
    "TextShadowColor": "#141414",  // RGB格式的文字阴影颜色
    "BackgroundColor": "#353535"   // RGB格式的背景颜色
}
```
