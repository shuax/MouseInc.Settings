<template>
  <div class="hotkey-page fade-in">
    <!-- Alerts Section -->
    <div class="alerts-section">
      <el-alert
        :title="$t('hotkey_tips1')"
        type="info"
        :closable="false"
        show-icon
        class="modern-alert"
      />
    </div>

    <!-- Data Table Card -->
    <div class="table-card">
      <div class="table-header">
        <div class="table-stats">
          <el-tag type="info" effect="dark" size="small">
            {{ $t('total') }}: {{ cfg.Hotkeys?.length || 0 }}
          </el-tag>
          <el-tag type="success" effect="dark" size="small">
            {{ $t('active') }}: {{ activeCount }}
          </el-tag>
        </div>
        <el-button type="primary" :icon="Plus" @click="create" class="create-btn">
          {{ $t('create') }}
        </el-button>
      </div>

      <div class="table-wrapper">
        <el-table
          :data="cfg.Hotkeys"
          stripe
          class="modern-table"
          v-loading="!cfg.Hotkeys"
        >
          <el-table-column :label="$t('valid')" width="70" align="center">
            <template #default="{ row, $index }">
              <el-switch
                v-model="row.Valid"
                size="small"
                @change="oncheck($index, $event)"
              />
            </template>
          </el-table-column>

          <el-table-column :label="$t('name')" prop="Name" width="160">
            <template #default="{ row }">
              <div class="name-cell">
                <el-tag size="small" effect="dark" type="primary">
                  {{ row.Name }}
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="$t('keys')" prop="Keys" width="140">
            <template #default="{ row }">
              <div class="keys-cell">
                <el-tag size="small" effect="dark" type="warning">
                  {{ row.Keys }}
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="$t('actions')" prop="Actions" min-width="300">
            <template #default="{ row }">
              <div class="actions-preview">
                <span class="actions-text" v-html="highlightJSON(formatActions(row.Actions))" :title="formatActions(row.Actions)"></span>
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="$t('operate')" align="center" fixed="right" width="120">
            <template #default="{ $index }">
              <div class="operate-cell">
                <el-button
                  type="primary"
                  link
                  size="small"
                  :icon="Edit"
                  @click="modify($index)"
                >
                  {{ $t('modify') }}
                </el-button>
                <el-divider direction="vertical" />
                <el-popconfirm
                  :title="$t('match_warning')"
                  :confirm-button-text="$t('ok')"
                  :cancel-button-text="$t('cancel')"
                  @confirm="remove($index)"
                >
                  <template #reference>
                    <el-button type="danger" link size="small" :icon="Delete">
                      {{ $t('delete') }}
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>

          <template #empty>
            <div class="empty-state">
              <p>{{ $t('no_hotkeys') }}</p>
              <el-button type="primary" :icon="Plus" @click="create">
                {{ $t('create_first') }}
              </el-button>
            </div>
          </template>
        </el-table>
      </div>
    </div>

    <!-- Edit Dialog -->
    <el-dialog
      v-model="modal.editing"
      :title="modal.title"
      width="650px"
      align-center
      destroy-on-close
      class="modern-dialog"
      :close-on-click-modal="false"
    >
      <div class="dialog-body">
        <el-form label-position="top" @submit.prevent>
          <div class="form-row">
            <el-form-item :label="$t('name')" class="form-item-half">
              <el-input
                v-model="modal.Name"
                :placeholder="$t('enter_name')"
                size="large"
              />
            </el-form-item>

            <el-form-item :label="$t('keys')" class="form-item-half">
              <el-input
                v-model="modal.Keys"
                :placeholder="$t('enter_keys')"
                size="large"
              />
            </el-form-item>
          </div>

          <el-form-item :label="$t('actions')">
            <div class="json-editor-wrapper">
              <JsonEdit
                :value="modal.Actions"
                :editing="modal.editing"
                @on-input="modal.NewActions = $event"
              />
            </div>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" @click="modal.editing = false">
            {{ $t('cancel') }}
          </el-button>
          <el-button
            :type="modal.btn"
            size="large"
            @click="on_modify"
            class="save-btn"
          >
            {{ $t('ok') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { highlightJSON } from '@/libs/util'
import type { Config } from '@/types/index.ts'
import JsonEdit from './components/json.vue'

const store = useStore()
const { t } = useI18n()
const cfg = computed<Config>(() => store.getters.cfg)

interface HotkeyItem {
  Valid: boolean
  Keys: string
  Name: string
  Actions: string[][]
}

interface ModalState {
  editing: boolean
  title: string
  Keys: string
  Name: string
  Actions: string[][]
  NewActions: string[][]
  btn: string
  index?: number
}

const modal = reactive<ModalState>({
  editing: false,
  title: '',
  Keys: '',
  Name: '',
  Actions: [],
  NewActions: [],
  btn: 'primary'
})

const activeCount = computed<number>(() => {
  if (!cfg.value.Hotkeys) return 0
  return cfg.value.Hotkeys.filter((h: HotkeyItem) => h.Valid).length
})

function formatActions (actions: string[][]): string {
  if (!actions || !Array.isArray(actions)) return ''
  return (actions as unknown as unknown[]).map(a => {
    if (typeof a === 'string') return a
    const obj = a as Record<string, unknown>
    if (obj.cmd) return `cmd: ${obj.cmd}`
    if (obj.key) return `key: ${obj.key}`
    return JSON.stringify(a)
  }).join(' → ')
}

function oncheck (index: number, value: boolean): void {
  const row = cfg.value.Hotkeys?.[index]
  if (row) {
    row.Valid = value
  }
}

function modify (index: number): void {
  modal.editing = true
  modal.index = index
  const row = cfg.value.Hotkeys?.[index]
  if (row) {
    modal.title = t('modify_keys')
    modal.btn = 'primary'
    modal.Keys = row.Keys
    modal.Name = row.Name
    modal.Actions = row.Actions
    modal.NewActions = row.Actions
  }
}

function create (): void {
  modal.editing = true
  modal.index = undefined
  modal.title = t('add_keys')
  modal.btn = 'success'
  modal.Keys = ''
  modal.Name = ''
  const actions: string[][] = []
  modal.Actions = actions
  modal.NewActions = actions
}

function on_modify (): void {
  modal.editing = false
  const index = modal.index
  if (index !== undefined && cfg.value.Hotkeys) {
    const row = cfg.value.Hotkeys[index]
    if (row) {
      row.Keys = modal.Keys
      row.Name = modal.Name
      row.Actions = modal.NewActions
    }
  } else if (index === undefined) {
    const new_row: HotkeyItem = {
      Valid: true,
      Keys: modal.Keys,
      Name: modal.Name,
      Actions: modal.NewActions
    }
    if (!cfg.value.Hotkeys) {
      cfg.value.Hotkeys = []
    }
    cfg.value.Hotkeys.push(new_row)
  }
}

function remove (index: number): void {
  cfg.value.Hotkeys?.splice(index, 1)
}
</script>

<style lang="less" scoped>
.hotkey-page {
  &:extend(.page-container);
}

.table-wrapper {
  &:extend(.table-wrapper-bordered all);
  margin-bottom: 0;
}

.modern-table {
  // Cell Styles
  .name-cell {
    .el-tag {
      font-weight: 500;
    }
  }

  .keys-cell {
    .el-tag {
      font-family: monospace;
      font-weight: 500;
    }
  }
}
</style>
