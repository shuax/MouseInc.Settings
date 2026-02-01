<template>
  <div class="demo-page fade-in">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h2>{{ $t('demo') }}</h2>
        <p>{{ $t('demo_tips') }}</p>
      </div>
    </div>

    <!-- Info Alert -->
    <el-alert :title="$t('demo_tips')" type="info" :closable="false" class="modern-alert" show-icon />

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

<script>
import beautify from 'js-beautify'
import { ElMessage } from 'element-plus'
import { CopyDocument } from '@element-plus/icons-vue'

export default {
  name: 'demo',
  setup () {
    return {
      CopyDocument
    }
  },
  methods: {
    stringify (data) {
      return beautify.js(JSON.stringify(data), {
        indent_size: 4,
        indent_with_tabs: true,
        eol: '\r\n'
      })
    },
    copy (data) {
      const text = this.stringify(data)
      navigator.clipboard.writeText(text).then(() => {
        ElMessage.success(this.$t('copy_ok'))
      }).catch(() => {
        ElMessage.error(this.$t('copy_error'))
      })
    }
  },
  data () {
    return {
      action_list: [
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
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.demo-page {
  max-width: 1200px;
  margin: 0 auto;
}

// Page Header
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

  .header-content {
    h2 {
      margin: 0 0 4px;
      font-size: 22px;
      font-weight: 600;
      color: var(--text-primary);
    }

    p {
      margin: 0;
      font-size: 13px;
      color: var(--text-secondary);
    }
  }
}

// Modern Alert
.modern-alert {
  margin-bottom: 24px;
  border-radius: 12px;
  border: 1px solid rgba(88, 166, 255, 0.2);
  background: rgba(88, 166, 255, 0.08);

  :deep(.el-alert__content) {
    color: var(--text-primary);
  }
}

// Actions Grid
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

// Action Card
.action-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 16px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);

    .copy-btn {
      opacity: 1;
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;

  .card-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.copy-btn {
  opacity: 0;
  transition: opacity 0.25s ease;
  background: var(--primary-gradient);
  border: none;

  &:hover {
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
}

.code-block {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
}

.code-content {
  color: var(--accent-orange);
  font-family: 'Courier New', monospace;
  font-size: 12px;
  white-space: nowrap;
}

// Responsive
@media (max-width: 768px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }

  .copy-btn {
    opacity: 1;
  }
}
</style>
