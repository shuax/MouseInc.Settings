<template>
  <div class="keycast-page fade-in">
    <!-- Page Header -->
    <div class="page-header" :class="{ active: proxy.Open }">
      <div class="header-content">
        <div class="header-info">
          <h2>{{ $t('keycast') }}</h2>
          <p>{{ $t('keycast_label') }}</p>
        </div>
        <div class="header-action">
          <el-switch v-model="proxy.Open" size="large" />
        </div>
      </div>
      <div class="header-glow" v-if="proxy.Open"></div>
    </div>

    <!-- Main Settings Grid -->
    <div class="settings-grid">
      <!-- Toggle Settings -->
      <div class="settings-section">
        <div class="section-header">
          <span>{{ $t('basic_settings') }}</span>
        </div>

        <div class="settings-cards">
          <!-- Ignore Single -->
          <div class="setting-card">
            <div class="card-content">
              <div class="card-title">{{ $t('ignoresingle_label') }}</div>
              <div class="card-desc">{{ $t('ignoresingle_desc') }}</div>
            </div>
            <el-switch v-model="proxy.IgnoreSingle" />
          </div>
        </div>
      </div>

      <!-- Color Settings -->
      <div class="settings-section">
        <div class="section-header">
          <span>{{ $t('style_settings') }}</span>
        </div>

        <div class="style-grid">
          <div class="style-card color-card">
            <label>{{ $t('backgroundcolor_label') }}</label>
            <div class="color-picker-wrapper">
              <el-color-picker v-model="proxy.BackgroundColor" size="large" />
              <span class="color-value">{{ proxy.BackgroundColor }}</span>
            </div>
          </div>

          <div class="style-card color-card">
            <label>{{ $t('textcolor_label') }}</label>
            <div class="color-picker-wrapper">
              <el-color-picker v-model="proxy.TextColor" size="large" />
              <span class="color-value">{{ proxy.TextColor }}</span>
            </div>
          </div>

          <div class="style-card color-card">
            <label>{{ $t('textshadowcolor_label') }}</label>
            <div class="color-picker-wrapper">
              <el-color-picker v-model="proxy.TextShadowColor" size="large" />
              <span class="color-value">{{ proxy.TextShadowColor }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Advanced Settings -->
      <div class="section-card compact">
        <el-collapse @change="handleCollpasedChange">
          <el-collapse-item>
            <template #title>
              <span class="collapse-title-text">{{ $t('more_setting') }}</span>
            </template>

            <div class="advanced-content">
              <div class="select-grid">
                <div class="select-item">
                  <label>{{ $t('position') }} - X</label>
                  <el-input-number v-model="proxy.X" :min="0" :max="100" class="full-width" />
                  <p class="input-hint">{{ $t('x_tips') }}</p>
                </div>

                <div class="select-item">
                  <label>{{ $t('position') }} - Y</label>
                  <el-input-number v-model="proxy.Y" :min="0" :max="100" class="full-width" />
                  <p class="input-hint">{{ $t('y_tips') }}</p>
                </div>

                <div class="select-item">
                  <label>{{ $t('space_label') }}</label>
                  <el-input-number v-model="proxy.Space" :min="0" :max="50" class="full-width" />
                  <p class="input-hint">{{ $t('space_tips') }}</p>
                </div>
              </div>

              <div class="divider"></div>

              <div class="slider-grid">
                <div class="slider-item">
                  <label>{{ $t('fontsize_label') }}</label>
                  <div class="slider-wrapper">
                    <el-slider
                      v-model="proxy.FontSize"
                      :step="2"
                      :min="8"
                      :max="72"
                      :marks="FontSizeMarks"
                      show-stops
                    />
                    <span class="slider-value">{{ proxy.FontSize }}px</span>
                  </div>
                </div>

                <div class="slider-item">
                  <label>{{ $t('fade_label') }}</label>
                  <div class="slider-wrapper">
                    <el-slider
                      v-model="proxy.Fade"
                      :min="1"
                      :max="10"
                      :marks="FadeMarks"
                      show-stops
                    />
                    <span class="slider-value">{{ proxy.Fade }}s</span>
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
import type { Config } from '@/types/index.ts'

const store = useStore()
const { t } = useI18n()
const cfg = computed<Config>(() => store.getters.cfg)

interface KeycastConfig {
  Open: boolean
  IgnoreSingle: boolean
  Fade: number
  FontSize: number
  Space: number
  Y: number
  X: number
  TextColor: string
  TextShadowColor: string
  BackgroundColor: string
}

const FontSizeMarks = computed(() => ({
  24: t('default')
}))

const FadeMarks = computed(() => ({
  5: t('default')
}))

const proxy = computed<KeycastConfig>(() => {
  return cfg.value.Keycast ? cfg.value.Keycast as KeycastConfig : {
    IgnoreSingle: false,
    Open: false,
    Fade: 5,
    FontSize: 24,
    Space: 10,
    Y: 84,
    X: 40,
    TextColor: '#FFFFFF',
    TextShadowColor: '#141414',
    BackgroundColor: '#353535'
  }
})

function handleCollpasedChange (state: string[]): void {
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
.keycast-page {
  max-width: 1000px;
  margin: 0 auto;
}

// 特有的紧凑选择项样式
.select-item {
  .input-hint {
    margin: 6px 0 0;
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.4;
  }

  :deep(.el-input-number) {
    width: 100%;
  }
}

// 响应式
@media (max-width: 768px) {
  .select-grid,
  .slider-grid {
    grid-template-columns: 1fr;
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
