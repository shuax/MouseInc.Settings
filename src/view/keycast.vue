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
      <div class="settings-section advanced">
        <el-collapse @change="handleCollpasedChange">
          <el-collapse-item>
            <template #title>
              <div class="collapse-title">
                <span>{{ $t('more_setting') }}</span>
              </div>
            </template>

            <div class="advanced-grid">
              <div class="advanced-card input-card">
                <div class="card-header-sm">
                  <span>{{ $t('position') }}</span>
                </div>
                <div class="position-inputs">
                  <div class="input-group">
                    <label>X</label>
                    <el-input-number v-model="proxy.X" :min="0" :max="100" />
                    <span class="input-hint">{{ $t('x_tips') }}</span>
                  </div>
                  <div class="input-group">
                    <label>Y</label>
                    <el-input-number v-model="proxy.Y" :min="0" :max="100" />
                    <span class="input-hint">{{ $t('y_tips') }}</span>
                  </div>
                </div>
              </div>

              <div class="advanced-card input-card">
                <div class="card-header-sm">
                  <span>{{ $t('space_label') }}</span>
                </div>
                <div class="input-group">
                  <el-input-number v-model="proxy.Space" :min="0" :max="50" />
                  <span class="input-hint">{{ $t('space_tips') }}</span>
                </div>
              </div>

              <div class="advanced-card slider-card">
                <div class="card-header-sm">
                  <span>{{ $t('fontsize_label') }}</span>
                </div>
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

              <div class="advanced-card slider-card">
                <div class="card-header-sm">
                  <span>{{ $t('fade_label') }}</span>
                </div>
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
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'keycast',
  data () {
    return {
      FontSizeMarks: {
        24: '默认'
      },
      FadeMarks: {
        5: '默认'
      }
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
    }
  },
  computed: {
    ...mapGetters([
      'cfg'
    ]),
    proxy () {
      return this.cfg.Keycast ? this.cfg.Keycast : {
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
    }
  }
}
</script>

<style lang="less" scoped>
.keycast-page {
  max-width: 1000px;
  margin: 0 auto;
}

// Page Header
.page-header {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 20px;
  overflow: hidden;

  &.active {
    border-color: var(--primary-color);
  }
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.header-info {
  flex: 1;

  h2 {
    margin: 0 0 4px;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
  }

  p {
    margin: 0;
    font-size: 13px;
    color: var(--text-secondary);
  }
}

.header-glow {
  position: absolute;
  top: 50%;
  left: 24px;
  transform: translateY(-50%);
  width: 80px;
  height: 80px;
  background: var(--primary-color);
  filter: blur(50px);
  opacity: 0.3;
  pointer-events: none;
}

// Settings Grid
.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
  transition: opacity 0.3s ease;

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

// Settings Section
.settings-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 24px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--border-light);
  }

  &.advanced {
    padding: 0;
    overflow: hidden;

    :deep(.el-collapse) {
      border: none;

      .el-collapse-item {
        &__header {
          background: transparent;
          border: none;
          padding: 20px 24px;
          height: auto;
          font-size: inherit;
          color: inherit;

          &:hover {
            background: var(--bg-hover);
          }
        }

        &__wrap {
          background: transparent;
          border: none;
        }

        &__content {
          padding: 0 24px 24px;
        }
      }
    }
  }
}

.section-header {
  margin-bottom: 20px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.collapse-title {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

// Settings Cards
.settings-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.setting-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: all 0.25s ease;

  &:hover {
    border-color: var(--border-light);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .card-content {
    flex: 1;
    min-width: 0;
  }

  .card-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 2px;
  }

  .card-desc {
    font-size: 12px;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// Style Grid
.style-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.style-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px;
  transition: all 0.25s ease;

  &:hover {
    border-color: var(--border-light);
  }

  label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 12px;
  }
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;

  .color-value {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    font-family: monospace;
  }
}

// Advanced Grid
.advanced-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.advanced-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px;
  transition: all 0.25s ease;

  &:hover {
    border-color: var(--border-light);
  }

  &.slider-card {
    grid-column: span 2;

    @media (max-width: 768px) {
      grid-column: span 1;
    }
  }
}

.card-header-sm {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.position-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 500;
  }

  .input-hint {
    font-size: 12px;
    color: var(--text-muted);
    margin: 0;
  }
}

.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;

  .el-slider {
    flex: 1;
  }

  .slider-value {
    font-size: 13px;
    font-weight: 500;
    color: var(--primary-color);
    font-family: monospace;
    min-width: 50px;
    text-align: right;
  }
}

:deep(.el-slider__marks-text) {
  font-size: 12px;
  color: var(--text-muted);
}

// Responsive
@media (max-width: 768px) {
  .settings-cards {
    grid-template-columns: 1fr;
  }

  .style-grid {
    grid-template-columns: 1fr;
  }

  .advanced-grid {
    grid-template-columns: 1fr;
  }

  .advanced-card.slider-card {
    grid-column: span 1;
  }

  .position-inputs {
    grid-template-columns: 1fr;
  }

  .header-content {
    flex-wrap: wrap;
    gap: 12px;
  }

  .header-info {
    order: 3;
    width: 100%;
  }
}
</style>
