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
    <div class="settings-grid" :class="{ disabled: !proxy.Open }">
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
      <div class="settings-section advanced">
        <el-collapse @change="handleCollapsedChange">
          <el-collapse-item>
            <template #title>
              <div class="collapse-title">
                <span>{{ $t('more_setting') }}</span>
              </div>
            </template>

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
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'cfg',
  data () {
    return {
      FontSizeMarks: {
        26: '默认'
      },
      TraceWidthMarks: {
        3: '默认'
      },
      SensitiveMarks: {
        0: '低',
        50: '默认',
        100: '高'
      }
    }
  },
  methods: {
    handleCollapsedChange (state) {
      if (state.length) {
        // 等待 el-collapse 动画完成 (300ms) + 额外延迟确保渲染完成
        setTimeout(() => {
          var content = document.querySelector('.content-area')
          if (content) {
            // 滚动到底部并添加小偏移量确保完全可见
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
    ...mapGetters(['cfg']),
    proxy () {
      var default_cfg = {
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
        Sensitive: 50
      }
      if (!this.cfg.MouseGesture) return default_cfg
      var cfg = this.cfg.MouseGesture
      for (var k in default_cfg) {
        if (!Object.prototype.hasOwnProperty.call(cfg, k)) {
          cfg[k] = default_cfg[k]
        }
      }
      return cfg
    }
  }
}
</script>

<style lang="less" scoped>
.settings-page {
  max-width: 1200px;
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

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
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

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;

  .color-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .color-value {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    font-family: monospace;
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

  &.toggle-card {
    .toggle-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .toggle-hint {
      font-size: 12px;
      color: var(--text-muted);
    }
  }
}

.card-header-sm {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.input-hint {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
}

// Responsive
@media (max-width: 768px) {
  .settings-cards {
    grid-template-columns: 1fr;
  }

  .style-grid {
    grid-template-columns: 1fr;
  }

  .style-card.slider-card,
  .style-card.input-card {
    grid-column: span 1;
  }

  .advanced-grid {
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
