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
      <el-tabs v-model="activeTab" type="border-card" class="lang-tabs">
        <el-tab-pane v-for="(item, lang) in cfg.Locales" :label="lang" :name="lang" :key="lang">
          <div class="table-wrapper">
            <el-table
              :data="LangTable(item)"
              stripe
              class="modern-table"
              height="calc(100vh - 380px)"
            >
              <el-table-column label="Key" prop="key" width="200">
                <template #default="{ row }">
                  <div class="key-cell">
                    <el-tag size="small" effect="dark" type="info">{{ row.key }}</el-tag>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="Value" show-overflow-tooltip>
                <template #default="{ row }">
                  <div class="value-cell" @click="openEdit(row.key, lang, row.value)">
                    <span class="value-text">{{ row.value }}</span>
                    <el-icon class="edit-icon"><Edit /></el-icon>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- Edit Dialog -->
    <el-dialog
      v-model="editDialog.visible"
      :title="$t('modify')"
      width="500px"
      class="modern-dialog"
      align-center
    >
      <div class="edit-dialog-content">
        <div class="key-info">
          <span class="label">Key:</span>
          <el-tag size="small" type="info">{{ editDialog.key }}</el-tag>
        </div>
        <el-input
          v-model="editDialog.value"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6 }"
          resize="none"
          class="modern-textarea"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialog.visible = false">{{ $t('cancel') }}</el-button>
          <el-button type="primary" @click="saveEdit">{{ $t('ok') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { Edit } from '@element-plus/icons-vue'

interface LocaleData {
  [key: string]: string
}

interface Config {
  Locales: { [lang: string]: LocaleData }
  Language?: string
}

const store = useStore()
const selectedLang = ref('')
const activeTab = ref('')

const cfg = computed<Config>(() => store.getters.cfg)

const Languages = computed<string[]>(() => {
  const list = ['auto']
  if (cfg.value.Locales) {
    for (const k in cfg.value.Locales) {
      list.push(k)
    }
  }
  return list
})

// Edit Dialog State
const editDialog = ref({
  visible: false,
  key: '',
  lang: '',
  value: ''
})

onMounted(() => {
  // Initialize with the main program's language setting, default to 'auto'
  selectedLang.value = cfg.value.Language || 'auto'
  
  // Initialize active tab
  if (cfg.value.Locales) {
    const keys = Object.keys(cfg.value.Locales)
    if (keys.length > 0) {
      activeTab.value = keys[0]
    }
  }
})

// Update main program's language setting when selection changes
watch(selectedLang, (newVal) => {
  if (cfg.value) {
    cfg.value.Language = newVal
  }
})

// Watch for changes in cfg.Language (e.g. initial load) to update the selector
watch(() => cfg.value.Language, (newVal) => {
  if (newVal && newVal !== selectedLang.value) {
    selectedLang.value = newVal
  }
})

// Ensure activeTab is set if it becomes available later
watch(() => cfg.value.Locales, (newVal) => {
  if (newVal && !activeTab.value) {
    const keys = Object.keys(newVal)
    if (keys.length > 0) {
      activeTab.value = keys[0]
    }
  }
}, { deep: true })

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

const openEdit = (key: string, lang: string, value: string) => {
  editDialog.value = {
    visible: true,
    key,
    lang,
    value
  }
}

const saveEdit = () => {
  const { key, lang, value } = editDialog.value
  if (cfg.value.Locales && cfg.value.Locales[lang]) {
    cfg.value.Locales[lang][key] = value
  }
  editDialog.value.visible = false
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

.value-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s ease;

  &:hover {
    background: var(--bg-active);
    
    .edit-icon {
      opacity: 1;
      transform: scale(1);
    }
  }

  .value-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-primary);
  }

  .edit-icon {
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.2s ease;
    color: var(--primary-color);
  }
}

.edit-dialog-content {
  .key-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    
    .label {
      font-weight: 500;
      color: var(--text-secondary);
    }
  }
}

.modern-textarea {
  :deep(.el-textarea__inner) {
    background: var(--bg-tertiary);
    border-radius: 8px;
    padding: 12px;
    font-size: 14px;
    line-height: 1.6;
    box-shadow: 0 0 0 1px var(--border-color) inset;
    
    &:focus {
      box-shadow: 0 0 0 1px var(--primary-color) inset, 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }
}
</style>
