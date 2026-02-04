<template>
  <div class="switch-page fade-in">

    <!-- Quick Toggle Section -->
    <div class="section-card compact">
      <div class="section-title">{{ $t('quick_switch') }}</div>

      <div class="switch-grid">
        <div
          v-for="(item, index) in switchList"
          :key="index"
          class="switch-item"
          :class="{ disabled: item.disabledFn ? item.disabledFn(proxy) : false }"
        >
          <div class="switch-info">
            <div class="switch-title">{{ item.title }}</div>
            <div class="switch-desc">{{ item.label }}</div>
          </div>
          <div class="switch-control">
            <el-switch
              v-model="proxy[item.model]"
              :disabled="item.disabledFn ? item.disabledFn(proxy) : false"
              :before-change="item.beforeChange"
              @change="syncToStore"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- More Settings Section -->
    <div class="section-card compact">
      <el-collapse @change="handleCollpasedChange">
        <el-collapse-item>
          <template #title>
            <span class="collapse-title-text">{{ $t('more_setting') }}</span>
          </template>

          <div class="advanced-content">
            <div class="switch-grid">
              <div
                v-for="(item, index) in moreSwitchList"
                :key="index"
                class="switch-item"
              >
                <div class="switch-info">
                  <div class="switch-title">{{ item.title }}</div>
                  <div class="switch-desc">{{ item.label }}</div>
                </div>
                <div class="switch-control">
                  <el-switch v-model="proxy[item.model]" @change="syncToStore" />
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <div class="select-grid">
              <div class="select-item">
                <label>{{ $t('volumecontrolsound') }}</label>
                <el-select v-model="proxy.VolumeSoundIndex" class="full-width" @change="syncToStore">
                  <el-option
                    v-for="item in VolumeSoundList"
                    :value="item.value"
                    :key="item.value"
                    :label="item.label"
                  />
                </el-select>
              </div>

              <div class="select-item">
                <label>{{ $t('keysound') }}</label>
                <el-select v-model="proxy.KeySoundIndex" class="full-width" @change="syncToStore">
                  <el-option
                    v-for="item in KeySoundList"
                    :value="item.value"
                    :key="item.value"
                    :label="item.label"
                  />
                </el-select>
              </div>

              <div class="select-item">
                <label>{{ $t('ocrapi') }}</label>
                <el-select v-model="proxy.OcrService" class="full-width" @change="syncToStore">
                  <el-option
                    v-for="item in OcrApiList"
                    :value="item.value"
                    :key="item.value"
                    :label="item.label"
                  />
                </el-select>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { ElMessageBox } from 'element-plus'
import type { Config, SwitchItem, SelectOption } from '@/types/index.ts'

const store = useStore()
const { t } = useI18n()
const cfg = computed<Config>(() => store.getters.cfg)

const switchList = computed<SwitchItem[]>(() => [
  {
    title: t('mousegesture'),
    label: t('mousegesture_label'),
    model: 'MouseGestureOpen'
  },
  {
    title: t('wheelswitch'),
    label: t('wheelswitch_label'),
    model: 'WheelSwitch',
    disabledFn: (p) => !p.MouseGestureOpen
  },
  {
    title: t('wheeledge'),
    label: t('wheeledge_label'),
    model: 'WheelEdgeOpen'
  },
  {
    title: t('corner'),
    label: t('corner_tips1'),
    model: 'HotCornerOpen'
  },
  {
    title: t('clipboardmanager'),
    label: t('clipboardmanager_label'),
    model: 'ClipboardManagerOpen'
  },
  {
    title: t('keycast'),
    label: t('keycast_label'),
    model: 'KeycastOpen'
  },
  {
    title: t('altdrag'),
    label: t('altdrag_label'),
    model: 'AltDrag'
  },
  {
    title: t('wheelaltcontrol'),
    label: t('wheelaltcontrol_label'),
    model: 'WheelAltControl'
  },
  {
    title: t('volumecontrolsound'),
    label: t('volumecontrolsound_label'),
    model: 'VolumeControlSound'
  },
  {
    title: t('keysound'),
    label: t('keysound_label'),
    model: 'KeySound'
  },
  {
    title: t('showime'),
    label: t('showime_label'),
    model: 'ShowIme'
  },
  {
    title: t('quickjump'),
    label: t('quickjump_label'),
    model: 'QuickJump'
  },
  {
    title: t('ignorefullscreen'),
    label: t('ignorefullscreen_label'),
    model: 'IgnoreFullScreen'
  },
  {
    title: t('showtrayicon'),
    label: t('showtrayicon_label'),
    model: 'ShowTrayIcon',
    beforeChange: BeforeShowTrayIconChange
  }
])

function BeforeShowTrayIconChange (): boolean | Promise<void> {
  if (!proxy.value.ShowTrayIcon) return true

  return new Promise((resolve) => {
    ElMessageBox.confirm(
      t('icon_warning'),
      t('warning'),
      {
        confirmButtonText: t('ok'),
        cancelButtonText: t('cancel'),
        type: 'warning'
      }
    ).then(() => {
      resolve()
    }).catch(() => {
      // 用户取消，不做任何事情
    })
  })
}

const moreSwitchList = computed<SwitchItem[]>(() => [
  {
    title: t('capslockled'),
    label: t('capslockled_label'),
    model: 'CapsLockLed'
  },
  {
    title: t('capsunlock'),
    label: t('capsunlock_label'),
    model: 'CapsUnlock'
  },
  {
    title: t('wheelthrough'),
    label: t('wheelthrough_label'),
    model: 'WheelThrough'
  },
  {
    title: t('wheelnatural'),
    label: t('wheelnatural_label'),
    model: 'WheelNatural'
  },
  {
    title: t('autoclip'),
    label: t('autoclip_label'),
    model: 'AutoClip'
  },
  {
    title: t('fastpaste'),
    label: t('fastpaste_label'),
    model: 'FastPaste'
  },
  {
    title: t('administrator'),
    label: t('administrator_label'),
    model: 'Administrator'
  }
])

const VolumeSoundList = computed<SelectOption[]>(() => [
  {
    value: 0,
    label: t('volume0')
  },
  {
    value: 1,
    label: t('volume1')
  }
])

const KeySoundList = computed<SelectOption[]>(() => [
  {
    value: 0,
    label: t('key0')
  },
  {
    value: 1,
    label: t('key1')
  },
  {
    value: 2,
    label: t('key2')
  },
  {
    value: 3,
    label: t('key3')
  },
  {
    value: 4,
    label: t('key4')
  }
])

const OcrApiList = computed<SelectOption[]>(() => [
  {
    value: 0,
    label: '自有'
  },
  {
    value: 1,
    label: '有道'
  },
  {
    value: 2,
    label: '飞桨'
  }
])

interface ProxyConfig {
  MouseGestureOpen: boolean
  WheelSwitch: boolean
  WheelEdgeOpen: boolean
  HotCornerOpen: boolean
  ClipboardManagerOpen: boolean
  KeycastOpen: boolean
  AltDrag: boolean
  WheelAltControl: boolean
  VolumeControlSound: boolean
  KeySound: boolean
  ShowIme: boolean
  QuickJump: boolean
  IgnoreFullScreen: boolean
  ShowTrayIcon: boolean
  CapsLockLed: boolean
  CapsUnlock: boolean
  WheelThrough: boolean
  WheelNatural: boolean
  AutoClip: boolean
  FastPaste: boolean
  Administrator: boolean
  VolumeSoundIndex: number
  KeySoundIndex: number
  OcrService: number
}

// 创建一个响应式的本地状态对象
const proxy = ref<ProxyConfig>({
  MouseGestureOpen: false,
  WheelSwitch: false,
  WheelEdgeOpen: false,
  HotCornerOpen: false,
  ClipboardManagerOpen: false,
  KeycastOpen: false,
  AltDrag: true,
  WheelAltControl: false,
  VolumeControlSound: false,
  KeySound: false,
  ShowIme: false,
  QuickJump: false,
  IgnoreFullScreen: false,
  ShowTrayIcon: true,
  CapsLockLed: false,
  CapsUnlock: false,
  WheelThrough: false,
  WheelNatural: false,
  AutoClip: false,
  FastPaste: false,
  Administrator: false,
  VolumeSoundIndex: 0,
  KeySoundIndex: 0,
  OcrService: 0
})

// 初始化本地状态
watch(cfg, () => {
  if (cfg.value.MouseGesture) {
    proxy.value = {
      MouseGestureOpen: cfg.value.MouseGesture.Open,
      WheelSwitch: cfg.value.MouseGesture.WheelSwitch,
      WheelEdgeOpen: cfg.value.WheelEdge?.Open ?? false,
      HotCornerOpen: cfg.value.HotCorner?.Open ?? false,
      ClipboardManagerOpen: cfg.value.ClipboardManager?.Open ?? false,
      KeycastOpen: cfg.value.Keycast?.Open ?? false,
      AltDrag: cfg.value.AltDrag,
      WheelAltControl: cfg.value.WheelAltControl,
      VolumeControlSound: cfg.value.VolumeControlSound,
      KeySound: cfg.value.KeySound,
      ShowIme: cfg.value.ShowIme,
      QuickJump: cfg.value.QuickJump,
      IgnoreFullScreen: cfg.value.IgnoreFullScreen,
      ShowTrayIcon: cfg.value.ShowTrayIcon,
      CapsLockLed: cfg.value.CapsLockLed,
      CapsUnlock: cfg.value.CapsUnlock,
      WheelThrough: cfg.value.WheelThrough,
      WheelNatural: cfg.value.WheelNatural,
      AutoClip: cfg.value.AutoClip,
      FastPaste: cfg.value.FastPaste,
      Administrator: cfg.value.Administrator,
      VolumeSoundIndex: cfg.value.VolumeSoundIndex,
      KeySoundIndex: cfg.value.KeySoundIndex,
      OcrService: cfg.value.OcrService
    }
  }
}, { immediate: true })

const syncToStore = () => {
  const val = proxy.value
  if (cfg.value.MouseGesture) {
    store.commit('updateConfig', { key: 'MouseGesture', value: { ...cfg.value.MouseGesture, Open: val.MouseGestureOpen, WheelSwitch: val.WheelSwitch } })
    if (cfg.value.WheelEdge) store.commit('updateConfig', { key: 'WheelEdge', value: { ...cfg.value.WheelEdge, Open: val.WheelEdgeOpen } })
    if (cfg.value.HotCorner) store.commit('updateConfig', { key: 'HotCorner', value: { ...cfg.value.HotCorner, Open: val.HotCornerOpen } })
    if (cfg.value.ClipboardManager) store.commit('updateConfig', { key: 'ClipboardManager', value: { ...cfg.value.ClipboardManager, Open: val.ClipboardManagerOpen } })
    if (cfg.value.Keycast) store.commit('updateConfig', { key: 'Keycast', value: { ...cfg.value.Keycast, Open: val.KeycastOpen } })
    
    store.commit('updateConfig', { key: 'AltDrag', value: val.AltDrag })
    store.commit('updateConfig', { key: 'WheelAltControl', value: val.WheelAltControl })
    store.commit('updateConfig', { key: 'VolumeControlSound', value: val.VolumeControlSound })
    store.commit('updateConfig', { key: 'KeySound', value: val.KeySound })
    store.commit('updateConfig', { key: 'ShowIme', value: val.ShowIme })
    store.commit('updateConfig', { key: 'QuickJump', value: val.QuickJump })
    store.commit('updateConfig', { key: 'IgnoreFullScreen', value: val.IgnoreFullScreen })
    store.commit('updateConfig', { key: 'ShowTrayIcon', value: val.ShowTrayIcon })
    store.commit('updateConfig', { key: 'CapsLockLed', value: val.CapsLockLed })
    store.commit('updateConfig', { key: 'CapsUnlock', value: val.CapsUnlock })
    store.commit('updateConfig', { key: 'WheelThrough', value: val.WheelThrough })
    store.commit('updateConfig', { key: 'WheelNatural', value: val.WheelNatural })
    store.commit('updateConfig', { key: 'AutoClip', value: val.AutoClip })
    store.commit('updateConfig', { key: 'FastPaste', value: val.FastPaste })
    store.commit('updateConfig', { key: 'Administrator', value: val.Administrator })
    store.commit('updateConfig', { key: 'VolumeSoundIndex', value: val.VolumeSoundIndex })
    store.commit('updateConfig', { key: 'KeySoundIndex', value: val.KeySoundIndex })
    store.commit('updateConfig', { key: 'OcrService', value: val.OcrService })
  }
}

function handleCollpasedChange (state: string[]) {
  if (state.length) {
    setTimeout(() => {
      const content = document.querySelector('.content-area')
      if (content) {
        content.scrollTo({
          top: content.scrollHeight + 50,
          behavior: 'smooth'
        })
      }
    }, 350)
  }
}
</script>

<style lang="less" scoped>
.switch-page {
  &:extend(.page-container);
}

// Collapse styling
:deep(.el-collapse) {
  border: none;

  .el-collapse-item {
    &__header {
      background: transparent;
      border: none;
      padding: 0;
      height: auto;
      font-size: inherit;
      color: inherit;

      &:hover {
        color: var(--primary-color);
      }
    }

    &__arrow {
      margin-left: 8px;
    }

    &__wrap {
      background: transparent;
      border: none;
    }

    &__content {
      padding: 0;
    }
  }
}
</style>
