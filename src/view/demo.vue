<template>
  <div>
    <Row :gutter="10">
      <Col :sm="24" :md="12" :lg="12" :xl="8" :xxl="6" v-for="(info, i) in action_list" :key="`info-${i}`" style="padding-bottom: 10px;">
        <Card shadow>
            <p slot="title">
                {{info[0]}}
            </p>
            <a href="#" slot="extra" @click.prevent="copy" class="copyCode" data-clipboard-action="copy" :data-clipboard-text="stringify(info[1])">
                复制
            </a>
            <codemirror :value="JSON.stringify(info[1])" :options="option">
            </codemirror>
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
        ['锁屏', [['Execute', 'rundll32 user32.dll,LockWorkStation']]],
        ['延迟1秒', [['Internal', 'Delay', '1000']]],
        ['截图参考同时复制', [['Screenshot', 'ToClipboard'], ['Screenshot', 'Reference']]],
        ['设备管理器', [['Execute', 'rundll32 devmgr.dll DeviceManager_Execute']]],
        ['打开QQ', [['Execute', '"C:\\Program Files (x86)\\Tencent\\QQ\\Bin\\QQ.exe"']]],
        ['打开微信', [['Execute', '"C:\\Program Files (x86)\\Tencent\\WeChat\\WeChat.exe"']]],
        ['打开TIM', [['Execute', '"C:\\Program Files (x86)\\Tencent\\TIM\\Bin\\TIM.exe"']]],
        ['系统属性', [['Execute', 'rundll32 shell32.dll,Control_RunDLL sysdm.cpl,,1']]],
        ['控制面板', [['Execute', 'rundll32 shell32.dll,Control_RunDLL']]],
        ['关于电脑', [['Execute', 'rundll32 shell32.DLL,ShellAbout']]]
      ],
      option: {
        lineNumbers: false,
        readOnly: true,
        styleActiveLine: false,
        tabSize: 4,
        indentUnit: 4,
        indentWithTabs: true,
        // line: true,
        // keyMap: 'sublime',
        mode: {
          name: 'javascript',
          json: true
        }
        // theme: 'default'
      }
    }
  }
}
</script>

<style>
.CodeMirror {
  height: auto;
  /*line-height: 2;*/
}
</style>
