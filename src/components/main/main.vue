<template>
  <div class="modern-layout">
    <!-- Sidebar -->
    <aside
      :class="['sidebar', { 'collapsed': collapsed }]"
      :style="{ width: collapsed ? '70px' : '260px' }"
    >
      <!-- Navigation Menu -->
      <side-menu
        ref="sideMenuRef"
        :active-name="$route.name"
        :collapsed="collapsed"
        @on-select="turnToPage"
        :menu-list="menuList"
        :key="local"
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
          <custom-bread-crumb :list="breadCrumbList" :key="local" />
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

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElLoading } from 'element-plus'
import type { LoadingInstance } from 'element-plus'
import { RefreshLeft, Refresh, Download, Warning, Fold, Expand } from '@element-plus/icons-vue'
import SideMenu from './components/side-menu'
import CustomBreadCrumb from './components/header-bar/custom-bread-crumb'
import Language from './components/language'
import { js_beautify } from 'js-beautify/js/lib/beautify.js'
import config from '@/config'
import { setTitle, getParams } from '@/libs/util'
import type { MenuItem, Config, AppRoute } from '@/types'

const store = useStore()
const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

// Refs
const sideMenuRef = ref<InstanceType<typeof SideMenu> | null>(null)
const collapsed = ref(false)
const init = ref(false)
const modified = ref(false)
const loading = ref('正在连接到 MouseInc...')
const resetWarning = ref(false)
const resetLoading = ref(false)
const saveLoading = ref(false)
const websocket = ref<WebSocket | null>(null)
const loadingInstance = ref<LoadingInstance | null>(null)
const connectionErrorShown = ref(false)
const skipNextModifiedCheck = ref(false)

// Computed
const menuList = computed<MenuItem[]>(() => store.getters.menuList)
const breadCrumbList = computed<MenuItem[]>(() => store.getters.breadCrumbList)
const local = computed<string>(() => store.getters.local)
const cfg = computed<Config>(() => store.getters.cfg)

// 使用 ref 存储版本号，确保响应式更新
const version = ref(config.version[0] || '--')

// 更新版本号的函数
const updateVersion = (newVersion: string, isAdmin: number) => {
  if (newVersion) {
    version.value = newVersion + (isAdmin === 1 ? ' A' : ' B')
    config.version[0] = version.value
  }
}

// Methods
const setBreadCrumb = (newRoute: AppRoute) => {
  store.dispatch('setBreadCrumb', newRoute)
}

// Watch
watch(
  () => route,
  (newRoute) => {
    setBreadCrumb(newRoute as unknown as AppRoute)
    setTitle(newRoute as unknown as AppRoute, { $t: t })
    if (sideMenuRef.value) {
      sideMenuRef.value.updateOpenName(newRoute.name as string)
    }
    // 页面切换时滚动到顶部
    nextTick(() => {
      const contentArea = document.querySelector('.content-area')
      if (contentArea) {
        contentArea.scrollTop = 0
      }
    })
  },
  { immediate: true, deep: true }
)

watch(
  () => cfg.value,
  () => {
    if (skipNextModifiedCheck.value) {
      skipNextModifiedCheck.value = false
      return
    }
    if (init.value) {
      modified.value = true
    }
    init.value = true
  },
  { deep: true }
)

watch(
  () => local.value,
  () => {
    setTitle(route as unknown as AppRoute, { $t: t })
  }
)

const setLocal = (lang: string) => {
  store.dispatch('setLocal', lang)
  locale.value = lang
}

const turnToPage = (routeItem: string | { name: string; params?: Record<string, unknown>; query?: Record<string, unknown> }) => {
  let name: string
  let params: Record<string, unknown> | undefined
  let query: Record<string, unknown> | undefined
  
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
  router.push({ name, params, query }).catch(() => {})
}

const handleCollapsedChange = (state: boolean) => {
  collapsed.value = state
}

const showResetDialog = () => {
  resetWarning.value = true
}

const reset = () => {
  resetLoading.value = true

  if (websocket.value && websocket.value.readyState === WebSocket.OPEN) {
    websocket.value.send(JSON.stringify({ type: 'reset_settings' }))
  }
}

const refresh = () => {
  location.reload()
}

const save = () => {
  saveLoading.value = true

  const formattedCfg = js_beautify(JSON.stringify(cfg.value), {
    indent_size: 4,
    indent_with_tabs: true,
    eol: '\r\n'
  })

  if (websocket.value && websocket.value.readyState === WebSocket.OPEN) {
    websocket.value.send(JSON.stringify({ type: 'save_settings', config: formattedCfg }))
  }
}

const setupWebSocket = () => {
  const params = getParams(location.search || '?')
  let port = params['port']
  port = port || 80

  websocket.value = new WebSocket('ws://127.0.0.1:' + port + '/ws')

  websocket.value.onopen = () => {
    console.log('WebSocket connected')
    connectionErrorShown.value = false
    websocket.value?.send(JSON.stringify({ type: 'load_settings' }))
  }

  websocket.value.onclose = (event) => {
    console.log('WebSocket closed:', event.code, event.reason, 'wasClean:', event.wasClean)
    if (loadingInstance.value) {
      loadingInstance.value.close()
    }
    if (!event.wasClean || !init.value) {
      connectionErrorShown.value = true
    }
  }

  websocket.value.onmessage = (evt: MessageEvent) => {
    const message = JSON.parse(evt.data)

    if (message.type === 'load_settings') {
      if (loadingInstance.value) {
        loadingInstance.value.close()
      }

      init.value = true
      skipNextModifiedCheck.value = true
      modified.value = false
      store.dispatch('setSettings', message.data)

      // 更新版本号
      updateVersion(message.data.version, message.data.admin)
      setTitle(route, { $t: t })
    } else if (message.type === 'save_settings') {
      ElMessage.success(t('save_ok'))
      saveLoading.value = false
      skipNextModifiedCheck.value = true
      modified.value = false
      store.dispatch('setSettings', message.data)
    } else if (message.type === 'reset_settings') {
      ElMessage.success(t('reset_ok'))
      resetLoading.value = false
      resetWarning.value = false
      skipNextModifiedCheck.value = true
      modified.value = false
      store.dispatch('setSettings', message.data)
    }
  }

  websocket.value.onerror = (error) => {
    console.error('WebSocket error:', error)
    if (loadingInstance.value) {
      loadingInstance.value.close()
    }
    connectionErrorShown.value = true
  }
}

// Lifecycle
onMounted(() => {
  setBreadCrumb(route)
  setLocal(local.value)

  ElMessage.closeAll()

  nextTick(() => {
    loadingInstance.value = ElLoading.service({
      fullscreen: true,
      text: loading.value,
      background: 'rgba(13, 17, 23, 0.95)',
      lock: true,
      customClass: 'modern-loading'
    })

    setTimeout(() => {
      setupWebSocket()
    }, 100)
  })
})

onBeforeUnmount(() => {
  if (loadingInstance.value) {
    loadingInstance.value.close()
  }
  if (websocket.value) {
    websocket.value.close()
  }
})

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

</style>

<style lang="less">
// Modern Loading - Global Style
.modern-loading {
  background: var(--bg-primary) !important;
  
  .el-loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    .el-loading-text {
      color: var(--text-primary);
      font-size: 16px;
      font-weight: 500;
      margin-top: 20px;
      letter-spacing: 0.5px;
    }

    .circular {
      width: 50px !important;
      height: 50px !important;
      
      circle {
        stroke: var(--primary-color);
        stroke-width: 3;
        stroke-linecap: round;
        animation: loading-dash 1.5s ease-in-out infinite;
      }
    }
  }
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -124;
  }
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
