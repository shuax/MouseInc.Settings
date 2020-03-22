<template>
  <div>
    <p style="padding-bottom: 10px;">{{$t('demo_tips')}}</p>
    <Row :gutter="10">
      <Col :sm="24" :md="12" :lg="12" :xl="8" :xxl="6" v-for="(info, i) in action_list" :key="`info-${i}`" style="padding-bottom: 10px;">
        <Card shadow>
            <p slot="title">
                {{info[0]}}
            </p>
            <a href="#" slot="extra" @click.prevent="copy" class="copyCode" data-clipboard-action="copy" :data-clipboard-text="stringify(info[1])">
                {{$t('copy_btn')}}
            </a>
            <div  style="overflow: hidden;text-overflow: ellipsis;white-space:nowrap;color:#a11;">
                <code>
                    {{JSON.stringify(info[1])}}
                </code>
            </div>
            <!-- <codemirror :value="JSON.stringify(info[1])" :options="option"> -->
            <!-- </codemirror> -->
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import beautify from 'js-beautify'
export default {
  methods: {
    stringify (data) {
      return beautify.js(JSON.stringify(data), {
        indent_size: 4,
        indent_with_tabs: true,
        eol: '\r\n'
      })
    },
    copy () {}
  },
  mounted () {
    this.clipboard = new this.Clipboard('.copyCode')
    this.clipboard.on('success', () => {
      this.$Message.success(this.$t('copy_ok'))
    })
    this.clipboard.on('error', () => {
      this.$Message.error(this.$t('copy_error'))
    })
  },
  destroyed () {
    this.clipboard.destroy()
  },
  data () {
    return {
      action_list: [
        ['隐藏窗口到托盘', [['Window', 'HideTray']]],
        ['暂停恢复MouseInc', [['Internal', 'Pause']]],
        ['截图参考同时复制', [['Screenshot', 'ToClipboard'], ['Screenshot', 'Reference']]],
        ['强制结束程序', [['Execute', 'taskkill /f /pid %pid%', 'hide']]],
        ['锁屏', [['Execute', 'rundll32 user32.dll,LockWorkStation']]],
        ['关机', [['Execute', 'shutdown -s -t 0', 'hide']]],
        ['复制', [['SendKeys', 'Ctrl+C']]],
        ['粘贴', [['SendKeys', 'Ctrl+V']]],
        ['调高亮度', [['SetBrightness', 'UP']]],
        ['调低亮度', [['SetBrightness', 'DOWN']]],
        ['关闭窗口', [['Window', 'Close']]],
        ['置顶窗口', [['Window', 'Top']]],
        ['延迟1秒', [['Internal', 'Delay', '1000']]],
        ['关于电脑', [['Execute', 'rundll32 shell32.DLL,ShellAbout']]],
        ['控制面板', [['Execute', 'rundll32 shell32.dll,Control_RunDLL']]],
        ['设备管理器', [['Execute', 'rundll32 devmgr.dll DeviceManager_Execute']]],
        ['系统属性', [['Execute', 'rundll32 shell32.dll,Control_RunDLL sysdm.cpl,,1']]],
        ['打开QQ', [['Execute', '"C:\\Program Files (x86)\\Tencent\\QQ\\Bin\\QQ.exe"']]],
        ['打开微信', [['Execute', '"C:\\Program Files (x86)\\Tencent\\WeChat\\WeChat.exe"']]],
        ['打开TIM', [['Execute', '"C:\\Program Files (x86)\\Tencent\\TIM\\Bin\\TIM.exe"']]],
        ['Everything搜索选中内容', [['SendKeys', 'Ctrl+C'], ['Execute', 'Everything.exe -s %clipboard%']]],
        ['Python运行选中代码', [['SendKeys', 'Ctrl+C'], ['Execute', 'python -i -c %clipboard%']]],
        ['base64编码', [['SendKeys', 'Ctrl+C'], ['Algorithm', 'b64encode', '%clipboard%']]],
        ['base64解码', [['SendKeys', 'Ctrl+C'], ['Algorithm', 'b64decode', '%clipboard%']]],
        ['生成二维码', [['SendKeys', 'Ctrl+C'], ['Algorithm', 'qrcode', '%clipboard%']]],
        ['快递查询', [['Execute', 'https://m.kuaidi100.com/result.jsp?nu=%clipboard%']]],
        ['百度搜索选中内容', [['SendKeys', 'Ctrl+C'], ['Execute', 'https://www.baidu.com/s?ie=UTF-8&wd=%clipboard%']]],
        ['谷歌搜索选中内容', [['SendKeys', 'Ctrl+C'], ['Execute', 'https://www.google.com/search?q=%clipboard%']]],
        ['谷歌翻译', [['Execute', 'https://translate.google.com/?source=osdd#auto|auto|%clipboard%']]],
        ['有道翻译', [['Execute', 'http://fanyi.youdao.com/translate?i=%clipboard%&keyfrom=plugin&smartresult=dict&smartresult=rule']]],
        ['京东搜索', [['Execute', 'https://search.jd.com/Search?keyword=%clipboard%&enc=utf-8']]],
        ['淘宝搜索', [['Execute', 'http://s.taobao.com/search?q=%clipboard%']]],
        ['什么值得买', [['Execute', 'https://search.smzdm.com/?c=home&s=%clipboard%']]],
        ['哔哩哔哩', [['Execute', 'http://www.bilibili.tv/search?keyword=%clipboard%']]],
        ['知乎', [['Execute', 'http://www.zhihu.com/search?q=%clipboard%']]],
        ['高德地图', [['Execute', 'https://ditu.amap.com/search?query=%clipboard%']]]
      ]
    }
  }
}
</script>
