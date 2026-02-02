<template>
  <div class="demo-page fade-in">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h2>{{ $t('demo') }}</h2>
        <p>{{ $t('demo_tips') }}</p>
      </div>
    </div>

    <!-- Alerts Section -->
    <div class="alerts-section">
      <el-alert :title="$t('demo_tips')" type="info" :closable="false" class="modern-alert" show-icon />
    </div>

    <!-- Action Cards Grid -->
    <div class="actions-grid">
      <div
        v-for="(info, i) in action_list"
        :key="`info-${i}`"
        class="action-card"
      >
        <div class="card-header">
          <div class="card-title-wrapper">
            <span class="card-title">{{ info[0] }}</span>
          </div>
          <el-button
            type="primary"
            :icon="CopyDocument"
            circle
            size="small"
            class="copy-btn"
            @click="copy(info[1])"
          />
        </div>
        <div class="code-block">
          <el-scrollbar>
            <code class="code-content">{{ JSON.stringify(info[1]) }}</code>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import beautify from 'js-beautify'
import { ElMessage } from 'element-plus'
import { CopyDocument } from '@element-plus/icons-vue'

interface ActionItem {
  0: string
  1: any[]
}

const instance = getCurrentInstance()

const action_list = ref<ActionItem[]>([
  ['隐藏窗口到托盘', [['Window', 'HideTray']]],
  ['暂停恢复MouseInc', [['Internal', 'Pause']]],
  ['贴图同时复制', [['Screenshot', 'ToClipboard'], ['Screenshot', 'Stick']]],
  ['强制结束程序', [['Execute', 'taskkill /f /pid %pid%', 'admin|hide']]],
  ['锁屏', [['Execute', 'rundll32 user32.dll,LockWorkStation']]],
  ['关机', [['Execute', 'shutdown -s -t 0', 'hide']]],
  ['复制', [['SendKeys', 'Ctrl+C']]],
  ['粘贴', [['SendKeys', 'Ctrl+V']]],
  ['调高亮度', [['SetBrightness', 'UP']]],
  ['调低亮度', [['SetBrightness', 'DOWN']]],
  ['关闭窗口', [['Window', 'Close']]],
  ['置顶窗口', [['Window', 'Top']]],
  ['延迟1秒', [['Internal', 'Delay', '1000']]],
  ['我的电脑', [['Execute2', 'shell:MyComputerFolder']]],
  ['我的文档', [['Execute2', 'shell:DocumentsLibrary']]],
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
])

const stringify = (data: any): string => {
  return beautify.js(JSON.stringify(data), {
    indent_size: 4,
    indent_with_tabs: true,
    eol: '\r\n'
  })
}

const copy = (data: any) => {
  const text = stringify(data)
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success(instance?.proxy?.$t ? instance.proxy.$t('copy_ok') : 'copy_ok')
  }).catch(() => {
    ElMessage.error(instance?.proxy?.$t ? instance.proxy.$t('copy_error') : 'copy_error')
  })
}
</script>

<style lang="less" scoped>
.demo-page {
  &:extend(.page-container);
}
</style>
