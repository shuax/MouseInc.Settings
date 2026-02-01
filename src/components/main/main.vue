<template>
  <div class="modern-layout">
    <!-- Sidebar -->
    <aside
      :class="['sidebar', { 'collapsed': collapsed }]"
      :style="{ width: collapsed ? '70px' : '260px' }"
    >
      <!-- Brand Area -->
      <div class="brand-area" v-if="!collapsed">
        <div class="brand-logo">
          <div class="logo-icon">
            <el-icon><Mouse /></el-icon>
          </div>
          <div class="brand-text">
            <h3>MouseInc</h3>
            <p>Settings</p>
          </div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <side-menu
        ref="sideMenu"
        :active-name="$route.name"
        :collapsed="collapsed"
        @on-select="turnToPage"
        :menu-list="menuList"
        accordion
      />

      <!-- Sidebar Footer -->
      <div class="sidebar-footer" v-if="!collapsed">
        <div class="version-info">
          <span>{{ $t('version') }}</span>
          <span class="version-tag">{{ version }}</span>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="main-area">
      <!-- Header -->
      <header class="modern-header">
        <div class="header-left">
          <button
            class="collapse-btn"
            @click="handleCollapsedChange(!collapsed)"
          >
            <el-icon :size="18">
              <Fold v-if="!collapsed" />
              <Expand v-else />
            </el-icon>
          </button>
          <custom-bread-crumb :list="breadCrumbList" />
        </div>

        <div class="header-actions">
          <language v-if="config.useI18n" @on-lang-change="setLocal" :lang="local" />
          
          <el-tooltip :content="$t('reset')" placement="bottom">
            <button class="action-btn" @click="showResetDialog">
              <el-icon><RefreshLeft /></el-icon>
            </button>
          </el-tooltip>
          
          <el-tooltip :content="$t('refresh')" placement="bottom">
            <button class="action-btn" @click="refresh">
              <el-icon><Refresh /></el-icon>
            </button>
          </el-tooltip>
          
          <el-button
            :type="modified ? 'primary' : 'default'"
            :class="['save-btn', { 'modified': modified }]"
            :disabled="!modified"
            :loading="saveLoading"
            @click="save"
          >
            <el-icon><Download /></el-icon>
            <span>{{ $t('save') }}</span>
          </el-button>
        </div>
      </header>

      <!-- Content -->
      <div class="content-area">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- Reset Dialog -->
    <el-dialog
      v-model="resetWarning"
      width="420px"
      align-center
      :show-close="false"
      class="modern-dialog"
      destroy-on-close
    >
      <template #header>
        <div class="dialog-header-warning">
          <div class="warning-icon">
            <el-icon><Warning /></el-icon>
          </div>
          <span>{{ $t('warning') }}</span>
        </div>
      </template>
      
      <div class="dialog-body">
        <p class="warning-text">{{ $t('reset_tips1') }}</p>
        <p class="warning-subtext">{{ $t('reset_tips2') }}</p>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetWarning = false">
            {{ $t('cancel') }}
          </el-button>
          <el-button
            type="danger"
            :loading="resetLoading"
            @click="reset"
          >
            {{ $t('reset') }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Connection Error Overlay -->
    <div v-if="!init && connectionErrorShown" class="connection-error-overlay">
      <div class="error-content">
        <el-icon class="error-icon"><Warning /></el-icon>
        <h3>{{ $t('connection_error') }}</h3>
        <p>{{ $t('connection_error_desc') }}</p>
        <el-button type="primary" @click="refresh">
          {{ $t('retry') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ElMessage, ElLoading } from 'element-plus'
import { markRaw } from 'vue'
import { RefreshLeft, Refresh, Download, Warning, Fold, Expand, Mouse } from '@element-plus/icons-vue'
import SideMenu from './components/side-menu'
import CustomBreadCrumb from './components/header-bar/custom-bread-crumb'
import Language from './components/language'
import config from '@/config'
import { setTitle, getParams } from '@/libs/util'
import beautify from 'js-beautify'

export default {
  name: 'MainLayout',
  components: {
    SideMenu,
    CustomBreadCrumb,
    Language,
    RefreshLeft,
    Refresh,
    Download,
    Warning,
    Fold,
    Expand,
    Mouse
  },
  data () {
    return {
      config,
      collapsed: false,
      init: false,
      modified: false,
      loading: 'Loading',
      resetWarning: false,
      resetLoading: false,
      saveLoading: false,
      websocket: null,
      loadingInstance: null,
      connectionErrorShown: false,
      skipNextModifiedCheck: false,
      RefreshLeft: markRaw(RefreshLeft),
      Refresh: markRaw(Refresh),
      Download: markRaw(Download),
      Warning: markRaw(Warning),
      Fold: markRaw(Fold),
      Expand: markRaw(Expand),
      Mouse: markRaw(Mouse)
    }
  },
  computed: {
    ...mapGetters(['menuList', 'breadCrumbList', 'local', 'cfg']),
    version () {
      return config.version[0] || ''
    }
  },
  watch: {
    '$route': {
      handler (newRoute) {
        this.setBreadCrumb(newRoute)
        if (this.$refs.sideMenu) {
          this.$refs.sideMenu.updateOpenName(newRoute.name)
        }
      },
      immediate: true,
      deep: true
    },
    'cfg': {
      handler () {
        if (this.skipNextModifiedCheck) {
          this.skipNextModifiedCheck = false
          return
        }
        if (this.init) {
          this.modified = true
        }
        this.init = true
      },
      deep: true
    }
  },
  mounted () {
    this.setBreadCrumb(this.$route)
    this.setLocal(this.$i18n.locale)

    ElMessage.closeAll()

    this.$nextTick(() => {
      this.loadingInstance = ElLoading.service({
        fullscreen: true,
        text: this.loading,
        background: 'rgba(13, 17, 23, 0.95)',
        lock: true,
        customClass: 'modern-loading'
      })

      setTimeout(() => {
        this.setupWebSocket()
      }, 100)
    })
  },
  beforeUnmount () {
    if (this.loadingInstance) {
      this.loadingInstance.close()
    }
    if (this.websocket) {
      this.websocket.close()
    }
  },
  methods: {
    setBreadCrumb (newRoute) {
      this.$store.dispatch('setBreadCrumb', newRoute)
    },
    setLocal (lang) {
      this.$store.dispatch('setLocal', lang)
      this.$i18n.locale = lang
    },
    turnToPage (routeItem) {
      let { name, params, query } = {}
      if (typeof routeItem === 'string') {
        name = routeItem
      } else {
        name = routeItem.name
        params = routeItem.params
        query = routeItem.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({ name, params, query }).catch(() => {})
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    showResetDialog () {
      this.resetWarning = true
    },
    reset () {
      this.resetLoading = true

      if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
        this.websocket.send(JSON.stringify({ type: 'reset_settings' }))
      }
    },
    refresh () {
      location.reload()
    },
    save () {
      this.saveLoading = true

      const formattedCfg = beautify.js(JSON.stringify(this.cfg), {
        indent_size: 4,
        indent_with_tabs: true,
        eol: '\r\n'
      })

      if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
        this.websocket.send(JSON.stringify({ type: 'save_settings', config: formattedCfg }))
      }
    },
    setupWebSocket () {
      let port = getParams(location.search || '?')['port']
      port = port || 80

      this.websocket = new WebSocket('ws://127.0.0.1:' + port + '/ws')

      this.websocket.onopen = () => {
        console.log('WebSocket connected')
        this.connectionErrorShown = false
        this.websocket.send(JSON.stringify({ type: 'load_settings' }))
      }

      this.websocket.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason, 'wasClean:', event.wasClean)
        if (this.loadingInstance) {
          this.loadingInstance.close()
        }
        if (!event.wasClean || !this.init) {
          this.connectionErrorShown = true
          if (!this.connectionErrorShown) {
            ElMessage.error('与MouseInc主程序的连接已断开，请检查主程序是否运行')
          }
        }
      }

      this.websocket.onmessage = (evt) => {
        const message = JSON.parse(evt.data)

        if (message.type === 'load_settings') {
          if (this.loadingInstance) {
            this.loadingInstance.close()
          }

          this.init = true
          this.skipNextModifiedCheck = true
          this.modified = false
          this.$store.dispatch('setSettings', message.data)

          config.version[0] = message.data.version
          if (message.data.admin === 1) {
            config.version[0] += ' A'
          } else {
            config.version[0] += ' B'
          }
          setTitle(this.$route, { $t: this.$t })
        } else if (message.type === 'save_settings') {
          ElMessage.success(this.$t('save_ok'))
          this.saveLoading = false
          this.skipNextModifiedCheck = true
          this.modified = false
          this.$store.dispatch('setSettings', message.data)
        } else if (message.type === 'reset_settings') {
          ElMessage.success(this.$t('reset_ok'))
          this.resetLoading = false
          this.resetWarning = false
          this.skipNextModifiedCheck = true
          this.modified = false
          this.$store.dispatch('setSettings', message.data)
        }
      }

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error)
        if (this.loadingInstance) {
          this.loadingInstance.close()
        }
        this.connectionErrorShown = true
        if (!this.connectionErrorShown) {
          ElMessage.error('无法连接到MouseInc主程序，请检查主程序是否已启动')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.modern-layout {
  display: flex;
  height: 100vh;
  background: var(--bg-primary);
  overflow: hidden;
}

// Sidebar
.sidebar {
  display: flex;
  flex-direction: column;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-right: 1px solid var(--glass-border);
  transition: width 0.3s ease;
  overflow: hidden;
  position: relative;

  &.collapsed {
    .brand-area {
      padding: 16px 12px;
      
      &.collapsed-logo {
        display: flex;
        justify-content: center;
        
        .logo-icon {
          width: 44px;
          height: 44px;
        }
      }
    }
  }
}

.brand-area {
  padding: 20px 16px;
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;

  .brand-logo {
    display: flex;
    align-items: center;
    gap: 12px;

    .logo-icon {
      width: 44px;
      height: 44px;
      background: var(--primary-gradient);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.35);
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.45);
      }

      .el-icon {
        color: white;
        font-size: 24px;
      }
    }

    .brand-text {
      h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        background: var(--primary-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: -0.5px;
      }

      p {
        margin: 2px 0 0;
        font-size: 11px;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 1px;
      }
    }
  }

  &.collapsed-logo {
    display: none;
  }
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-light);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  flex-shrink: 0;

  .version-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: var(--text-muted);

    .version-tag {
      background: var(--bg-tertiary);
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      color: var(--accent-blue);
      border: 1px solid var(--border-light);
    }
  }
}

// Main Area
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

// Modern Header
.modern-header {
  height: 70px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-btn {
  width: 38px;
  height: 38px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;

  &:hover {
    background: var(--bg-hover);
    border-color: var(--primary-color);
    color: var(--text-primary);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  width: 38px;
  height: 38px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;

  &:hover {
    background: var(--bg-hover);
    border-color: var(--accent-blue);
    color: var(--accent-blue);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(88, 166, 255, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
}

.save-btn {
  height: 38px;
  padding: 0 20px;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);

  &:not(:disabled) {
    background: var(--primary-gradient);
    border: none;
    color: white;
    box-shadow: 0 4px 14px rgba(102, 126, 234, 0.35);

    &:hover {
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.modified {
    animation: pulse-glow 2s ease-in-out infinite;
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 4px 14px rgba(102, 126, 234, 0.35);
  }
  50% {
    box-shadow: 0 6px 24px rgba(102, 126, 234, 0.55);
  }
}

// Content Area
.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: var(--bg-primary);
  position: relative;
}

// Transitions
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

// Dialog Styles
:deep(.modern-dialog) {
  .el-dialog {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    box-shadow: var(--shadow-lg);

    &__header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--border-light);
    }

    &__body {
      padding: 24px;
    }

    &__footer {
      padding: 16px 24px 24px;
      border-top: none;
    }
  }
}

.dialog-header-warning {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--accent-orange);
  font-size: 18px;
  font-weight: 600;

  .warning-icon {
    width: 40px;
    height: 40px;
    background: rgba(210, 153, 34, 0.15);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    .el-icon {
      font-size: 22px;
    }
  }
}

.dialog-body {
  text-align: center;
  padding: 8px 0;

  .warning-text {
    font-size: 15px;
    color: var(--text-primary);
    margin: 0 0 8px;
    font-weight: 500;
  }

  .warning-subtext {
    font-size: 13px;
    color: var(--text-muted);
    margin: 0;
  }
}

.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  .el-button {
    padding: 10px 24px;
    border-radius: 10px;
    font-weight: 500;
  }
}

// Connection Error Overlay
.connection-error-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .error-content {
    text-align: center;
    padding: 40px;

    .error-icon {
      font-size: 64px;
      color: var(--accent-orange);
      margin-bottom: 24px;
    }

    h3 {
      font-size: 24px;
      color: var(--text-primary);
      margin: 0 0 12px;
    }

    p {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0 0 24px;
    }
  }
}

// Modern Loading
:deep(.modern-loading) {
  .el-loading-spinner {
    .el-loading-text {
      color: var(--text-secondary);
      font-size: 14px;
      margin-top: 16px;
    }

    .circular {
      circle {
        stroke: var(--primary-color);
      }
    }
  }
}
</style>
