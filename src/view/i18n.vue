<template>
  <div class="i18n-page fade-in">
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

<script setup lang="ts">
import { ref, computed, onMounted, watch, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import TextEdit from './components/text.vue'

interface LocaleData {
  [key: string]: string
}

interface Config {
  Locales: { [lang: string]: LocaleData }
}

const store = useStore()
const instance = getCurrentInstance()
const selectedLang = ref('')

const cfg = computed<Config>(() => store.getters.cfg)

const Languages = computed<string[]>(() => {
  const list = ['auto']
  for (const k in cfg.value.Locales) {
    list.push(k)
  }
  return list
})

onMounted(() => {
  selectedLang.value = instance?.proxy?.$i18n?.locale || 'zh-CN'
})

watch(selectedLang, (newVal) => {
  store.dispatch('setLocal', newVal)
  if (instance?.proxy?.$i18n) {
    instance.proxy.$i18n.locale = newVal
  }
})

interface LangTableItem {
  key: string
  value: string
}

const LangTable = (data: LocaleData): LangTableItem[] => {
  const result: LangTableItem[] = []
  for (const k in data) {
    result.push({
      key: k,
      value: data[k]
    })
  }
  return result
}

const change = (key: string, lang: string, value: string) => {
  const row = cfg.value.Locales[lang]
  row[key] = value
}
</script>

<style lang="less" scoped>
.i18n-page {
  &:extend(.page-container);
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
</style>
