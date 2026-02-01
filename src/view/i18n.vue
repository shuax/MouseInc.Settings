<template>
  <div class="i18n-page fade-in">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h2>{{ $t('LanguageSelect') }}</h2>
        <p>{{ $t('language_settings_desc') }}</p>
      </div>
    </div>

    <!-- Language Selector Card -->
    <div class="selector-card">
      <div class="selector-content">
        <div class="selector-label">
          <span>{{ $t('current_language') }}</span>
        </div>
        <el-select v-model="selectedLang" class="lang-select" size="large">
          <el-option v-for="item in Languages" :value="item" :key="item">
            <div class="option-content">
              <span>{{ $t(item) }}</span>
            </div>
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- Translation Tabs Card -->
    <div class="translations-card">
      <el-tabs type="border-card" class="lang-tabs">
        <el-tab-pane v-for="(item, lang) in cfg.Locales" :label="lang" :name="lang" :key="lang">
          <div class="table-wrapper">
            <el-table
              :data="LangTable(item)"
              stripe
              class="modern-table"
              height="calc(100vh - 380px)"
            >
              <el-table-column label="Key" prop="key" width="200" fixed="left">
                <template #default="{ row }">
                  <div class="key-cell">
                    <el-tag size="small" effect="dark" type="info">{{ row.key }}</el-tag>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="Value" show-overflow-tooltip>
                <template #default="{ row }">
                  <TextEdit :value="row.value" @on-input="change(row.key, lang, $event)" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import TextEdit from './components/text.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'i18n',
  components: {
    TextEdit
  },

  data () {
    return {
      selectedLang: ''
    }
  },

  mounted () {
    this.selectedLang = this.$i18n.locale || 'zh-CN'
  },

  watch: {
    selectedLang (newVal) {
      this.$store.dispatch('setLocal', newVal)
      this.$i18n.locale = newVal
    }
  },

  computed: {
    ...mapGetters([
      'cfg'
    ]),
    Languages () {
      var list = ['auto']
      for (var k in this.cfg.Locales) {
        list.push(k)
      }
      return list
    }
  },
  methods: {
    LangTable (data) {
      var result = []
      for (var k in data) {
        result.push({
          key: k,
          value: data[k]
        })
      }
      return result
    },
    change (key, lang, value) {
      var row = this.cfg.Locales[lang]
      row[key] = value
    }
  }
}
</script>

<style lang="less" scoped>
.i18n-page {
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

// Selector Card
.selector-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  margin-bottom: 20px;
}

.selector-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.selector-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.lang-select {
  width: 240px;

  :deep(.el-input__wrapper) {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    box-shadow: none;
    border-radius: 10px;
  }
}

.option-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

// Translations Card
.translations-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.lang-tabs {
  :deep(.el-tabs__header) {
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 0;

    .el-tabs__nav-wrap {
      padding: 0 16px;
    }

    .el-tabs__item {
      color: var(--text-secondary);
      font-weight: 500;
      padding: 0 20px;
      height: 48px;
      line-height: 48px;

      &.is-active {
        color: var(--primary-color);
      }

      &:hover {
        color: var(--text-primary);
      }
    }

    .el-tabs__active-bar {
      background: var(--primary-gradient);
      height: 3px;
    }
  }

  :deep(.el-tabs__content) {
    padding: 0;
  }
}

.table-wrapper {
  padding: 16px;
}

// Modern Table
.modern-table {
  background: transparent;

  :deep(.el-table__header) {
    th {
      background: var(--bg-tertiary);
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--border-color);
      padding: 12px 0;
    }
  }

  :deep(.el-table__row) {
    transition: all 0.2s ease;

    &:hover {
      background: var(--bg-hover);
    }

    td {
      border-bottom: 1px solid var(--border-light);
      padding: 12px 0;
    }
  }
}

.key-cell {
  .el-tag {
    font-family: monospace;
  }
}

// Responsive
@media (max-width: 768px) {
  .selector-content {
    flex-direction: column;
    align-items: stretch;
  }

  .lang-select {
    width: 100%;
  }
}
</style>
