<template>
  <div class="switch-page fade-in">
    <!-- Page Header -->
    <div class="page-header compact">
      <div class="header-content">
        <h2>{{ $t('switch') }}</h2>
        <p>{{ $t('switch_desc') }}</p>
      </div>
    </div>

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
                  <el-switch v-model="proxy[item.model]" />
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <div class="select-grid">
              <div class="select-item">
                <label>{{ $t('volumecontrolsound') }}</label>
                <el-select v-model="proxy.VolumeSoundIndex" class="full-width">
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
                <el-select v-model="proxy.KeySoundIndex" class="full-width">
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
                <el-select v-model="proxy.OcrService" class="full-width">
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

<script>
import { mapGetters } from 'vuex'
import { ElMessageBox } from 'element-plus'

export default {
  name: 'fast-switch',
  data () {
    return {
      switchList: [
        {
          title: this.$t('mousegesture'),
          label: this.$t('mousegesture_label'),
          model: 'MouseGestureOpen'
        },
        {
          title: this.$t('wheelswitch'),
          label: this.$t('wheelswitch_label'),
          model: 'WheelSwitch',
          disabledFn: (proxy) => !proxy.MouseGestureOpen
        },
        {
          title: this.$t('wheeledge'),
          label: this.$t('wheeledge_label'),
          model: 'WheelEdgeOpen'
        },
        {
          title: this.$t('corner'),
          label: this.$t('corner_tips1'),
          model: 'HotCornerOpen'
        },
        {
          title: this.$t('clipboardmanager'),
          label: this.$t('clipboardmanager_label'),
          model: 'ClipboardManagerOpen'
        },
        {
          title: this.$t('keycast'),
          label: this.$t('keycast_label'),
          model: 'KeycastOpen'
        },
        {
          title: this.$t('altdrag'),
          label: this.$t('altdrag_label'),
          model: 'AltDrag'
        },
        {
          title: this.$t('wheelaltcontrol'),
          label: this.$t('wheelaltcontrol_label'),
          model: 'WheelAltControl'
        },
        {
          title: this.$t('volumecontrolsound'),
          label: this.$t('volumecontrolsound_label'),
          model: 'VolumeControlSound'
        },
        {
          title: this.$t('keysound'),
          label: this.$t('keysound_label'),
          model: 'KeySound'
        },
        {
          title: '输入法状态显示',
          label: '显示当前窗口输入法的中英文状态',
          model: 'ShowIme'
        },
        {
          title: '快速跳转',
          label: '打开/保存对话框自动使用最近资源管理器目录',
          model: 'QuickJump'
        },
        {
          title: this.$t('ignorefullscreen'),
          label: this.$t('ignorefullscreen_label'),
          model: 'IgnoreFullScreen'
        },
        {
          title: this.$t('showtrayicon'),
          label: this.$t('showtrayicon_label'),
          model: 'ShowTrayIcon',
          beforeChange: this.BeforeShowTrayIconChange
        }
      ],
      moreSwitchList: [
        {
          title: this.$t('capslockled'),
          label: this.$t('capslockled_label'),
          model: 'CapsLockLed'
        },
        {
          title: this.$t('capsunlock'),
          label: this.$t('capsunlock_label'),
          model: 'CapsUnlock'
        },
        {
          title: this.$t('wheelthrough'),
          label: this.$t('wheelthrough_label'),
          model: 'WheelThrough'
        },
        {
          title: this.$t('wheelnatural'),
          label: this.$t('wheelnatural_label'),
          model: 'WheelNatural'
        },
        {
          title: this.$t('autoclip'),
          label: this.$t('autoclip_label'),
          model: 'AutoClip'
        },
        {
          title: this.$t('fastpaste'),
          label: this.$t('fastpaste_label'),
          model: 'FastPaste'
        },
        {
          title: this.$t('administrator'),
          label: this.$t('administrator_label'),
          model: 'Administrator'
        }
      ]
    }
  },
  methods: {
    handleCollpasedChange (state) {
      if (state.length) {
        setTimeout(() => {
          var content = document.querySelector('.content-area')
          if (content) {
            content.scrollTo({
              top: content.scrollHeight + 50,
              behavior: 'smooth'
            })
          }
        }, 350)
      }
    },
    BeforeShowTrayIconChange () {
      if (!this.proxy.ShowTrayIcon) return true

      return new Promise((resolve) => {
        ElMessageBox.confirm(
          this.$t('icon_warning'),
          this.$t('warning'),
          {
            confirmButtonText: this.$t('ok'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning'
          }
        ).then(() => {
          resolve()
        }).catch(() => {
          // 用户取消，不做任何事情
        })
      })
    }
  },
  computed: {
    ...mapGetters(['cfg']),
    VolumeSoundList () {
      return [{
        value: 0,
        label: this.$t('volume0')
      },
      {
        value: 1,
        label: this.$t('volume1')
      }]
    },
    KeySoundList () {
      return [{
        value: 0,
        label: this.$t('key0')
      },
      {
        value: 1,
        label: this.$t('key1')
      },
      {
        value: 2,
        label: this.$t('key2')
      },
      {
        value: 3,
        label: this.$t('key3')
      },
      {
        value: 4,
        label: this.$t('key4')
      }]
    },
    OcrApiList () {
      return [
        {
          value: 0,
          label: '自有'
        }, {
          value: 1,
          label: '有道'
        },
        {
          value: 2,
          label: '飞桨'
        }]
    },
    proxy () {
      var ret = this.cfg.MouseGesture ? {
        MouseGestureOpen: this.cfg.MouseGesture.Open,
        WheelSwitch: this.cfg.MouseGesture.WheelSwitch,
        WheelEdgeOpen: this.cfg.WheelEdge?.Open,
        HotCornerOpen: this.cfg.HotCorner?.Open,
        ClipboardManagerOpen: this.cfg.ClipboardManager?.Open,
        KeycastOpen: this.cfg.Keycast?.Open,
        AltDrag: this.cfg.AltDrag,
        WheelAltControl: this.cfg.WheelAltControl,
        VolumeControlSound: this.cfg.VolumeControlSound,
        KeySound: this.cfg.KeySound,
        ShowIme: this.cfg.ShowIme,
        QuickJump: this.cfg.QuickJump,
        IgnoreFullScreen: this.cfg.IgnoreFullScreen,
        ShowTrayIcon: this.cfg.ShowTrayIcon,
        CapsLockLed: this.cfg.CapsLockLed,
        CapsUnlock: this.cfg.CapsUnlock,
        WheelThrough: this.cfg.WheelThrough,
        WheelNatural: this.cfg.WheelNatural,
        AutoClip: this.cfg.AutoClip,
        FastPaste: this.cfg.FastPaste,
        Administrator: this.cfg.Administrator,
        VolumeSoundIndex: this.cfg.VolumeSoundIndex,
        KeySoundIndex: this.cfg.KeySoundIndex,
        OcrService: this.cfg.OcrService
      } : {
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
      }
      return ret
    }
  },
  watch: {
    proxy: {
      deep: true,
      handler (val) {
        if (this.cfg.MouseGesture) {
          this.cfg.MouseGesture.Open = val.MouseGestureOpen
          this.cfg.MouseGesture.WheelSwitch = val.WheelSwitch
          if (this.cfg.WheelEdge) this.cfg.WheelEdge.Open = val.WheelEdgeOpen
          if (this.cfg.HotCorner) this.cfg.HotCorner.Open = val.HotCornerOpen
          if (this.cfg.ClipboardManager) this.cfg.ClipboardManager.Open = val.ClipboardManagerOpen
          if (this.cfg.Keycast) this.cfg.Keycast.Open = val.KeycastOpen
          this.cfg.AltDrag = val.AltDrag
          this.cfg.WheelAltControl = val.WheelAltControl
          this.cfg.VolumeControlSound = val.VolumeControlSound
          this.cfg.KeySound = val.KeySound
          this.cfg.ShowIme = val.ShowIme
          this.cfg.QuickJump = val.QuickJump
          this.cfg.IgnoreFullScreen = val.IgnoreFullScreen
          this.cfg.ShowTrayIcon = val.ShowTrayIcon
          this.cfg.CapsLockLed = val.CapsLockLed
          this.cfg.CapsUnlock = val.CapsUnlock
          this.cfg.WheelThrough = val.WheelThrough
          this.cfg.WheelNatural = val.WheelNatural
          this.cfg.AutoClip = val.AutoClip
          this.cfg.FastPaste = val.FastPaste
          this.cfg.Administrator = val.Administrator
          this.cfg.VolumeSoundIndex = val.VolumeSoundIndex
          this.cfg.KeySoundIndex = val.KeySoundIndex
          this.cfg.OcrService = val.OcrService
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.switch-page {
  max-width: 1200px;
  margin: 0 auto;
}

// Compact Page Header
.page-header.compact {
  margin-bottom: 20px;

  .header-content {
    h2 {
      margin: 0 0 6px;
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

// Compact Section Card
.section-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 16px;

  &.compact {
    padding: 16px 20px;
  }

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-light);
  }
}

// Collapse Title
.collapse-title-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

// Switch Grid
.switch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}

// Clean Switch Item
.switch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--border-light);
    background: var(--bg-hover);
  }

  &.disabled {
    opacity: 0.5;
  }
}

.switch-info {
  flex: 1;
  min-width: 0;
  margin-right: 12px;
}

.switch-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 3px;
}

.switch-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.3;
}

.switch-control {
  flex-shrink: 0;
}

// Advanced Content
.advanced-content {
  padding-top: 8px;

  .divider {
    height: 1px;
    background: var(--border-color);
    margin: 20px 0;
  }
}

// Select Grid
.select-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.select-item {
  label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }

  :deep(.el-select) {
    width: 100%;

    .el-input__wrapper {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      box-shadow: none;

      &.is-focus {
        border-color: var(--primary-color);
      }
    }
  }
}

.full-width {
  width: 100%;
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

// Responsive
@media (max-width: 768px) {
  .switch-grid {
    grid-template-columns: 1fr;
  }

  .select-grid {
    grid-template-columns: 1fr;
  }
}
</style>
