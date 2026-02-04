<template>
  <div class="settings-page fade-in">
    <!-- Page Header -->
    <div class="page-header" :class="{ active: proxy.Open }">
      <div class="header-content">
        <div class="header-info">
          <h2>{{ $t('mousegesture') }}</h2>
          <p>{{ $t('mousegesture_label') }}</p>
        </div>
        <div class="header-action">
          <el-switch v-model="proxy.Open" size="large" />
        </div>
      </div>
      <div class="header-glow" v-if="proxy.Open"></div>
    </div>

    <!-- Main Settings Grid -->
    <div class="settings-grid">
      <!-- Visual Settings -->
      <div class="settings-section">
        <div class="section-header">
          <span>{{ $t('visual_settings') }}</span>
        </div>

        <div class="settings-cards">
          <!-- Draw Trace -->
          <div class="setting-card">
            <div class="card-content">
              <div class="card-title">{{ $t('drawtrace_label') }}</div>
              <div class="card-desc">{{ $t('drawtrace_desc') }}</div>
            </div>
            <el-switch v-model="proxy.DrawTrace" />
          </div>

          <!-- Trace Arrow -->
          <div class="setting-card" :class="{ disabled: !proxy.DrawTrace }">
            <div class="card-content">
              <div class="card-title">{{ $t('tracearrow_label') }}</div>
              <div class="card-desc">{{ $t('tracearrow_desc') }}</div>
            </div>
            <el-switch v-model="proxy.TraceArrow" :disabled="!proxy.DrawTrace" />
          </div>

          <!-- Draw Result -->
          <div class="setting-card">
            <div class="card-content">
              <div class="card-title">{{ $t('drawresult_label') }}</div>
              <div class="card-desc">{{ $t('drawresult_desc') }}</div>
            </div>
            <el-switch v-model="proxy.DrawResult" />
          </div>

          <!-- Add Mode -->
          <div class="setting-card">
            <div class="card-content">
              <div class="card-title">{{ $t('addmode_label') }}</div>
              <div class="card-desc">{{ $t('addmode_tip') }}</div>
            </div>
            <el-switch v-model="proxy.AddMode" />
          </div>
        </div>
      </div>

      <!-- Color & Style Settings -->
      <div class="settings-section">
        <div class="section-header">
          <span>{{ $t('style_settings') }}</span>
        </div>

        <div class="style-grid">
          <div class="style-card">
            <label>{{ $t('drawcolor_label') }}</label>
            <div class="color-picker-wrapper">
              <el-color-picker
                v-model="proxy.DrawColor"
                size="large"
                :disabled="proxy.RandColor"
              />
              <div class="color-info">
                <span class="color-value">{{ proxy.DrawColor }}</span>
                <el-checkbox v-model="proxy.RandColor" size="small">
                  {{ $t('randcolor_label') }}
                </el-checkbox>
              </div>
            </div>
          </div>

          <div class="style-card">
            <label>{{ $t('failcolor_label') }}</label>
            <div class="color-picker-wrapper">
              <el-color-picker v-model="proxy.FailColor" size="large" />
              <span class="color-value">{{ proxy.FailColor }}</span>
            </div>
          </div>

          <div class="style-card slider-card">
            <label>{{ $t('tracewidth_label') }}</label>
            <div class="slider-wrapper">
              <el-slider
                v-model="proxy.TraceWidth"
                :min="1"
                :max="10"
                :marks="TraceWidthMarks"
                :disabled="!proxy.DrawTrace"
                show-stops
              />
              <span class="slider-value">{{ proxy.TraceWidth }}px</span>
            </div>
          </div>

          <div class="style-card slider-card">
            <label>{{ $t('fontsize_label') }}</label>
            <div class="slider-wrapper">
              <el-slider
                v-model="proxy.FontSize"
                :step="2"
                :min="8"
                :max="72"
                :marks="FontSizeMarks"
                :disabled="!proxy.DrawResult"
                show-stops
              />
              <span class="slider-value">{{ proxy.FontSize }}px</span>
            </div>
          </div>

          <div class="style-card input-card">
            <label>{{ $t('offset_label') }}</label>
            <div class="input-wrapper">
              <el-input-number
                v-model="proxy.Offset"
                :disabled="!proxy.DrawResult"
                :min="0"
                :max="500"
                :step="10"
              />
              <span class="input-hint">{{ $t('offset_tip') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Advanced Settings -->
      <div class="section-card compact">
        <el-collapse @change="handleCollapsedChange">
          <el-collapse-item>
            <template #title>
              <span class="collapse-title-text">{{ $t('more_setting') }}</span>
            </template>

            <div class="advanced-content">
              <div class="advanced-grid">
                <div class="advanced-card">
                  <div class="card-header-sm">
                    <span>{{ $t('timeout_label') }}</span>
                  </div>
                  <div class="input-with-unit">
                    <el-input-number
                      v-model="proxy.Timeout"
                      :min="500"
                      :max="3000"
                      :step="100"
                    />
                    <el-tag size="small" type="info">ms</el-tag>
                  </div>
                  <p class="input-hint">{{ $t('timeout_tip') }}</p>
                </div>

                <div class="advanced-card">
                  <div class="card-header-sm">
                    <span>{{ $t('startdistance_label') }}</span>
                  </div>
                  <div class="input-with-unit">
                    <el-input-number
                      v-model="proxy.StartDistance"
                      :min="1"
                      :max="50"
                    />
                    <el-tag size="small" type="info">px</el-tag>
                  </div>
                  <p class="input-hint">{{ $t('startdistance_tip') }}</p>
                </div>

                <div class="advanced-card">
                  <div class="card-header-sm">
                    <span>{{ $t('sensitive_label') }}</span>
                  </div>
                  <el-slider
                    v-model="proxy.Sensitive"
                    :step="5"
                    :max="100"
                    :marks="SensitiveMarks"
                    show-stops
                  />
                </div>

                <div class="advanced-card toggle-card">
                  <div class="card-header-sm">
                    <span>{{ $t('restoreevent_label') }}</span>
                  </div>
                  <div class="toggle-row">
                    <el-switch v-model="proxy.RestoreEvent" />
                    <span class="toggle-hint">{{ $t('restoreevent_tip') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import type { Config, MouseGestureConfig } from '@/types/index.ts'

const store = useStore()
const { t } = useI18n()
const cfg = computed<Config>(() => store.getters.cfg)

const FontSizeMarks = computed(() => ({ 26: t('default') }))
const TraceWidthMarks = computed(() => ({ 3: t('default') }))
const SensitiveMarks = computed(() => ({
  0: t('low'),
  50: t('default'),
  100: t('high')
}))

function handleCollapsedChange (state: string[]) {
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

const proxy = computed<MouseGestureConfig>(() => {
  const defaultCfg: MouseGestureConfig = {
    Open: false,
    StartDistance: 10,
    Timeout: 1000,
    RestoreEvent: false,
    AddMode: false,
    RandColor: false,
    FailColor: '#CAD0D3',
    DrawColor: '#E47542',
    DrawResult: true,
    DrawTrace: true,
    TraceWidth: 3,
    FontSize: 26,
    Offset: 150,
    TraceArrow: true,
    Sensitive: 50,
    WheelSwitch: false
  }
  if (!cfg.value.MouseGesture) return defaultCfg
  const gestureCfg = cfg.value.MouseGesture
  for (const k in defaultCfg) {
    const key = k as keyof MouseGestureConfig
    if (!Object.prototype.hasOwnProperty.call(gestureCfg, key)) {
      (gestureCfg as Record<string, unknown>)[key] = defaultCfg[key]
    }
  }
  return gestureCfg
})
</script>

<style lang="less" scoped>
.settings-page {
  &:extend(.page-container);
}

// Settings Cards
.settings-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.setting-card {
  &:extend(.setting-card all);

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

// Style Grid
.style-grid {
  &:extend(.style-grid all);
}

.style-card {
  &:extend(.style-card all);

  &.slider-card {
    grid-column: span 2;

    @media (max-width: 768px) {
      grid-column: span 1;
    }
  }

  &.input-card {
    grid-column: span 2;

    @media (max-width: 768px) {
      grid-column: span 1;
    }
  }
}

.slider-wrapper {
  &:extend(.slider-wrapper all);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;

  .input-hint {
    margin: 0;
    font-size: 12px;
    color: var(--text-muted);
  }
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
