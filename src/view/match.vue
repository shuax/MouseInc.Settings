<template>
  <div class="match-page fade-in">
    <!-- Alerts Section -->
    <div class="alerts-section">
      <el-alert :title="$t('match_tips')" type="info" :closable="false" class="modern-alert" show-icon />
    </div>

    <!-- Data Table Card -->
    <div class="table-card">
      <div class="table-wrapper">
        <el-table
          :data="cfg.MatchGlobal"
          stripe
          class="modern-table"
          v-loading="!cfg.MatchGlobal"
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

          <el-table-column :label="$t('sign')" width="140" align="center">
            <template #default="{ row }">
              <GestureEdit :value="row.Sign" />
            </template>
          </el-table-column>

          <el-table-column :label="$t('name')" width="160">
            <template #default="{ row }">
              <el-tag size="small" effect="dark" type="primary">
                {{ row.Name }}
              </el-tag>
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
              <p>{{ $t('no_gestures') }}</p>
              <el-button type="primary" :icon="Plus" @click="create">
                {{ $t('create_first') }}
              </el-button>
            </div>
          </template>
        </el-table>
      </div>

      <div class="table-footer">
        <el-button type="primary" :icon="Plus" @click="create" class="create-btn">
          {{ $t('create') }}
        </el-button>
      </div>
    </div>

    <!-- Edit Dialog -->
    <el-dialog
      v-model="modal.editing"
      :title="modal.title"
      width="900px"
      align-center
      destroy-on-close
      class="modern-dialog"
      :close-on-click-modal="false"
    >
      <div class="dialog-body">
        <el-form label-position="top" @submit.prevent>
          <div class="form-row">
            <el-form-item :label="$t('sign')" class="form-item-half">
              <SelectEdit v-model="modal.sign" />
            </el-form-item>

            <el-form-item :label="$t('name')" class="form-item-half">
              <el-input
                v-model="modal.name"
                :placeholder="$t('enter_name')"
                size="large"
              />
            </el-form-item>
          </div>

                      <el-form-item :label="$t('actions')" class="full-width-item">
                      <div class="json-editor-wrapper">              <JsonEdit
                :value="modal.actions"
                :editing="modal.editing"
                @on-input="modal.new_actions = $event"
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
import JsonEdit from './components/json.vue'
import SelectEdit from './components/select.vue'
import GestureEdit from './components/gesture.vue'
import { highlightJSON } from '@/libs/util'
import type { Config } from '@/types/index.ts'

interface MatchRow {
  Valid: boolean
  Sign: string
  Name: string
  Actions: string[][]
}

interface ModalState {
  editing: boolean
  title: string
  index?: number
  sign: string
  name: string
  actions: string[][]
  new_actions: string[][]
  btn: 'primary' | 'success'
}

const store = useStore()
const { t } = useI18n()
const cfg = computed<Config>(() => store.getters.cfg)

const modal = reactive<ModalState>({
  editing: false,
  title: '',
  sign: '',
  name: '',
  actions: [],
  new_actions: [],
  btn: 'primary'
})

function formatActions (actions: string[][] | undefined): string {
  if (!actions || !Array.isArray(actions)) return ''
  return (actions as unknown as unknown[]).map(a => {
    if (typeof a === 'string') return a
    const obj = a as Record<string, unknown>
    if (obj.cmd) return `cmd: ${obj.cmd}`
    if (obj.key) return `key: ${obj.key}`
    return JSON.stringify(a)
  }).join(' → ')
}

function oncheck (index: number, value: boolean) {
  const row = cfg.value.MatchGlobal?.[index]
  if (row) {
    row.Valid = value
  }
}

function modify (index: number) {
  const row = cfg.value.MatchGlobal?.[index]
  if (!row) return
  modal.editing = true
  modal.index = index
  modal.title = t('modify_gesture')
  modal.btn = 'primary'
  modal.sign = row.Sign
  modal.name = row.Name
  modal.actions = row.Actions
  modal.new_actions = row.Actions
}

function create () {
  modal.editing = true
  modal.index = undefined
  modal.title = t('add_gesture')
  modal.btn = 'success'
  modal.sign = ''
  modal.name = ''
  modal.actions = []
  modal.new_actions = []
}

function on_modify () {
  modal.editing = false
  const index = modal.index
  if (index !== undefined) {
    const row = cfg.value.MatchGlobal?.[index]
    if (row) {
      row.Sign = modal.sign
      row.Name = modal.name
      row.Actions = modal.new_actions
    }
  } else {
    const newRow: MatchRow = {
      Valid: true,
      Sign: modal.sign,
      Name: modal.name,
      Actions: modal.new_actions
    }
    cfg.value.MatchGlobal?.push(newRow)
  }
}

function remove (index: number) {
  cfg.value.MatchGlobal?.splice(index, 1)
}
</script>

<style lang="less" scoped>
.match-page {
  &:extend(.page-container);
}

.table-wrapper {
  &:extend(.table-wrapper-bordered);
}
</style>
