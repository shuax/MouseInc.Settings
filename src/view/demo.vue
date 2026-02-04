<template>
  <div class="demo-page fade-in">

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
            <span class="card-title">{{ $t(info[0]) }}</span>
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
            <code class="code-content" v-html="highlightJSON(info[1])"></code>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import beautify from 'js-beautify'
import { ElMessage } from 'element-plus'
import { CopyDocument } from '@element-plus/icons-vue'
import { highlightJSON } from '@/libs/util'

interface ActionItem {
  0: string
  1: string[][]
}

const { t } = useI18n()

const action_list = computed<ActionItem[]>(() => [
  ['demo_hide_tray', [['Window', 'HideTray']]],
  ['demo_pause_resume', [['Internal', 'Pause']]],
  ['demo_screenshot_stick', [['Screenshot', 'ToClipboard'], ['Screenshot', 'Stick']]],
  ['demo_kill_pid', [['Execute', 'taskkill /f /pid %pid%', 'admin|hide']]],
  ['demo_lock_screen', [['Execute', 'rundll32 user32.dll,LockWorkStation']]],
  ['demo_shutdown', [['Execute', 'shutdown -s -t 0', 'hide']]],
  ['copy', [['SendKeys', 'Ctrl+C']]],
  ['fastpaste', [['SendKeys', 'Ctrl+V']]],
  ['demo_brightness_up', [['SetBrightness', 'UP']]],
  ['demo_brightness_down', [['SetBrightness', 'DOWN']]],
  ['demo_close_window', [['Window', 'Close']]],
  ['demo_top_window', [['Window', 'Top']]],
  ['demo_delay_1s', [['Internal', 'Delay', '1000']]],
  ['demo_my_computer', [['Execute2', 'shell:MyComputerFolder']]],
  ['demo_my_documents', [['Execute2', 'shell:DocumentsLibrary']]],
  ['demo_about_computer', [['Execute', 'rundll32 shell32.DLL,ShellAbout']]],
  ['demo_control_panel', [['Execute', 'rundll32 shell32.dll,Control_RunDLL']]],
  ['demo_device_manager', [['Execute', 'rundll32 devmgr.dll DeviceManager_Execute']]],
  ['demo_system_properties', [['Execute', 'rundll32 shell32.dll,Control_RunDLL sysdm.cpl,,1']]],
  ['demo_open_qq', [['Execute', '"C:\\Program Files (x86)\\Tencent\\QQ\\Bin\\QQ.exe"']]],
  ['demo_open_wechat', [['Execute', '"C:\\Program Files (x86)\\Tencent\\WeChat\\WeChat.exe"']]],
  ['demo_open_tim', [['Execute', '"C:\\Program Files (x86)\\Tencent\\TIM\\Bin\\TIM.exe"']]],
  ['demo_everything_search', [['SendKeys', 'Ctrl+C'], ['Execute', 'Everything.exe -s %clipboard%']]],
  ['demo_python_run', [['SendKeys', 'Ctrl+C'], ['Execute', 'python -i -c %clipboard%']]],
  ['demo_base64_encode', [['SendKeys', 'Ctrl+C'], ['Algorithm', 'b64encode', '%clipboard%']]],
  ['demo_base64_decode', [['SendKeys', 'Ctrl+C'], ['Algorithm', 'b64decode', '%clipboard%']]],
  ['demo_qrcode', [['SendKeys', 'Ctrl+C'], ['Algorithm', 'qrcode', '%clipboard%']]],
  ['demo_kuaidi', [['Execute', 'https://m.kuaidi100.com/result.jsp?nu=%clipboard%']]],
  ['demo_baidu_search', [['SendKeys', 'Ctrl+C'], ['Execute', 'https://www.baidu.com/s?ie=UTF-8&wd=%clipboard%']]],
  ['demo_google_search', [['SendKeys', 'Ctrl+C'], ['Execute', 'https://www.google.com/search?q=%clipboard%']]],
  ['demo_google_translate', [['Execute', 'https://translate.google.com/?source=osdd#auto|auto|%clipboard%']]],
  ['demo_youdao_translate', [['Execute', 'http://fanyi.youdao.com/translate?i=%clipboard%&keyfrom=plugin&smartresult=dict&smartresult=rule']]],
  ['demo_jd_search', [['Execute', 'https://search.jd.com/Search?keyword=%clipboard%&enc=utf-8']]],
  ['demo_taobao_search', [['Execute', 'http://s.taobao.com/search?q=%clipboard%']]],
  ['demo_smzdm_search', [['Execute', 'https://search.smzdm.com/?c=home&s=%clipboard%']]],
  ['demo_bilibili_search', [['Execute', 'http://www.bilibili.tv/search?keyword=%clipboard%']]],
  ['demo_zhihu_search', [['Execute', 'http://www.zhihu.com/search?q=%clipboard%']]],
  ['demo_amap_search', [['Execute', 'https://ditu.amap.com/search?query=%clipboard%']]]
])

const stringify = (data: unknown): string => {
  return beautify.js(JSON.stringify(data), {
    indent_size: 4,
    indent_with_tabs: true,
    eol: '\r\n'
  })
}

const copy = (data: unknown) => {
  const text = stringify(data)
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success(t('copy_ok'))
  }).catch(() => {
    ElMessage.error(t('copy_error'))
  })
}
</script>

<style lang="less" scoped>
.demo-page {
  &:extend(.page-container);
}
</style>
