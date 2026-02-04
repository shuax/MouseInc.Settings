<template>
  <div class="custom-match-page fade-in">
    <!-- Alerts Section -->
    <div class="alerts-section">
      <el-alert :title="$t('custom_tips')" type="info" :closable="false" class="modern-alert" show-icon />
    </div>

    <!-- Tabs Card -->
    <div class="tabs-card">
      <el-tabs v-model="tab" type="border-card" class="custom-tabs" lazy>
        <el-tab-pane v-for="(item, index) in cfg.MatchCustom" :label="item.Name" :key="index" :name="String(index)">
          <!-- Match Settings Card - Collapsed by default -->
          <el-collapse v-model="matchListCollapse" class="match-list-collapse">
            <el-collapse-item :name="String(index)">
              <template #title>
                <div class="collapse-title">
                  <span>{{ $t('custom_list') }}</span>
                  <el-tag size="small" type="info" effect="dark" class="count-tag">
                    {{ item.Match ? item.Match.length : 0 }} {{ $t('items') }}
                  </el-tag>
                  <el-switch 
                    v-model="item.IgnoreGlobal" 
                    size="small" 
                    class="section-toggle" 
                    @click.stop
                  />
                  <span class="toggle-label" @click.stop>{{ $t('ignore_global') }}</span>
                </div>
              </template>
              
              <!-- Match List -->
              <div class="match-list">
                <div v-for="(match, match_index) in item.Match" :key="match" class="match-item">
                  <div class="match-tag">
                    <span>{{ match }}</span>
                  </div>
                  <el-button
                    type="danger"
                    :icon="Delete"
                    circle
                    size="small"
                    class="delete-btn"
                    @click="removematch(index, match_index)"
                  />
                </div>

                <!-- Add Match -->
                <div class="match-add">
                  <div class="add-input-wrapper">
                    <el-input
                      v-model="value"
                      :placeholder="$t('add')"
                      @keyup.enter="addmatch(index)"
                      clearable
                      class="add-input"
                    />
                  </div>
                  <el-button type="primary" :icon="Plus" @click="addmatch(index)">
                    {{ $t('add') }}
                  </el-button>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>

          <!-- Gestures Table Card -->
          <div class="gestures-card">
            <div class="section-header">
              <span>{{ $t('gesture_list') }}</span>
              <el-tag size="small" type="info" effect="dark" class="count-tag">
                {{ item.List ? item.List.length : 0 }} {{ $t('items') }}
              </el-tag>
            </div>
            <div class="table-wrapper">
              <el-table
                :data="MatchTable(item.List, index)"
                stripe
                class="modern-table"
              >
                    <el-table-column :label="$t('valid')" width="70" align="center">
                      <template #default="{ row, $index }">
                        <el-switch
                          v-model="row.Valid"
                          size="small"
                          @change="oncheck(index, $index, $event)"
                        />
                      </template>
                    </el-table-column>

                    <el-table-column :label="$t('sign')" width="140" align="center">
                      <template #default="{ row }">
                        <GestureEdit :value="row.Sign" />
                      </template>
                    </el-table-column>

                    <el-table-column :label="$t('name')" width="140">
                      <template #default="{ row }">
                        <el-tag size="small" effect="dark" type="primary">
                          {{ row.Name }}
                        </el-tag>
                      </template>
                    </el-table-column>

                    <el-table-column :label="$t('actions')" prop="Actions" min-width="250">
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
                            @click="modify(index, $index)"
                          >
                            {{ $t('modify') }}
                          </el-button>
                          <el-divider direction="vertical" />
                          <el-popconfirm
                            :title="$t('match_warning')"
                            :confirm-button-text="$t('ok')"
                            :cancel-button-text="$t('cancel')"
                            @confirm="remove(index, $index)"
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
                        <el-button type="primary" :icon="Plus" @click="create(index)">
                          {{ $t('create') }}
                        </el-button>
                      </div>
                    </template>
                  </el-table>
                </div>

                <div class="table-footer">
                  <el-button type="primary" :icon="Plus" @click="create(index)" class="create-btn">
                    {{ $t('create') }}
                  </el-button>
                </div>
              </div>
            </el-tab-pane>

        <!-- Tab Extra Actions -->
        <template #extra>
          <div class="tab-actions">
            <el-button type="primary" link size="small" :icon="Edit" @click="modtab">
              {{ $t('modify') }}
            </el-button>
            <el-button type="success" link size="small" :icon="CopyDocument" @click="addtab">
              {{ $t('clone') }}
            </el-button>
            <el-popconfirm
              :title="$t('custom_warning')"
              :confirm-button-text="$t('ok')"
              :cancel-button-text="$t('cancel')"
              @confirm="removetab"
            >
              <template #reference>
                <el-button type="danger" link size="small" :icon="Delete">
                  {{ $t('delete') }}
                </el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-tabs>
    </div>

    <!-- Edit Gesture Dialog -->
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

    <!-- Edit Tab Name Dialog -->
    <el-dialog
      v-model="tabModal.visible"
      :title="$t('custom_edit')"
      width="450px"
      align-center
      class="modern-dialog"
    >
      <div class="dialog-body">
        <el-input
          v-model="tabModal.name"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('enter_name')"
        />
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="tabModal.visible = false">
            {{ $t('cancel') }}
          </el-button>
          <el-button type="primary" @click="onTabModalOk" class="save-btn">
            {{ $t('ok') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import JsonEdit from './components/json.vue'
import SelectEdit from './components/select.vue'
import GestureEdit from './components/gesture.vue'
import { highlightJSON } from '@/libs/util'
import { Plus, Delete, Edit, CopyDocument } from '@element-plus/icons-vue'

interface GestureItem {
  Valid: boolean
  Sign: string
  Name: string
  Actions: string[][]
  index?: number
}

interface CustomMatch {
  Name: string
  IgnoreGlobal: boolean
  Match: string[]
  List: GestureItem[]
}

interface Config {
  MatchCustom: CustomMatch[]
}

const store = useStore()
const { t } = useI18n()

const tab = ref('0')
const value = ref('')
const matchListCollapse = ref<string[]>([]) // 默认折叠程序列表

const modal = reactive({
  editing: false,
  title: '',
  sign: '',
  name: '',
  actions: [] as string[][],
  new_actions: [] as string[][],
  btn: 'primary',
  index: 0,
  match_index: undefined as number | undefined
})

const tabModal = reactive({
  visible: false,
  name: ''
})

const cfg = computed<Config>(() => store.getters.cfg)

const formatActions = (actions: string[][]): string => {
  if (!actions || !Array.isArray(actions)) return ''
  return (actions as unknown as unknown[]).map(a => {
    if (typeof a === 'string') return a
    const obj = a as Record<string, unknown>
    if (obj.cmd) return `cmd: ${obj.cmd}`
    if (obj.key) return `key: ${obj.key}`
    return JSON.stringify(a)
  }).join(' → ')
}

const oncheck = (index: number, match_index: number, value: boolean) => {
  const row = cfg.value.MatchCustom[index].List[match_index]
  row.Valid = value
}

const modify = (index: number, match_index: number) => {
  modal.editing = true
  modal.index = index
  modal.match_index = match_index
  const row = cfg.value.MatchCustom[index].List[match_index]
  modal.title = t('modify_gesture')
  modal.btn = 'primary'
  modal.sign = row.Sign
  modal.name = row.Name
  modal.actions = row.Actions
  modal.new_actions = row.Actions
}

const create = (index: number) => {
  modal.editing = true
  modal.index = index
  modal.match_index = undefined
  modal.title = t('add_gesture')
  modal.btn = 'success'
  modal.sign = ''
  modal.name = ''
  const actions: string[][] = []
  modal.actions = actions
  modal.new_actions = actions
}

const on_modify = () => {
  modal.editing = false
  const index = modal.index
  const match_index = modal.match_index
  if (match_index !== undefined) {
    const row = cfg.value.MatchCustom[index].List[match_index]
    row.Sign = modal.sign
    row.Name = modal.name
    row.Actions = modal.new_actions
  } else {
    const new_row: GestureItem = {
      Valid: true,
      Sign: modal.sign,
      Name: modal.name,
      Actions: modal.new_actions
    }
    cfg.value.MatchCustom[index].List.push(new_row)
  }
}

const remove = (index: number, match_index: number) => {
  cfg.value.MatchCustom[index].List.splice(match_index, 1)
}

const removematch = (index: number, match_index: number) => {
  cfg.value.MatchCustom[index].Match.splice(match_index, 1)
}

const addmatch = (index: number) => {
  if (value.value.indexOf('.') === -1) {
    ElMessage.error(t('exclude_warning'))
    return
  }
  cfg.value.MatchCustom[index].Match.push(value.value)
  value.value = ''
}

const modtab = () => {
  tabModal.name = cfg.value.MatchCustom[parseInt(tab.value)].Name
  tabModal.visible = true
}

const onTabModalOk = () => {
  cfg.value.MatchCustom[parseInt(tab.value)].Name = tabModal.name
  tabModal.visible = false
}

const addtab = () => {
  cfg.value.MatchCustom.push(JSON.parse(JSON.stringify(cfg.value.MatchCustom[parseInt(tab.value)])))
  tab.value = String(cfg.value.MatchCustom.length - 1)
}

const removetab = () => {
  cfg.value.MatchCustom.splice(parseInt(tab.value), 1)
  tab.value = String(Math.min(parseInt(tab.value), cfg.value.MatchCustom.length - 1))
}

const MatchTable = (data: GestureItem[], index: number): GestureItem[] => {
  const result: GestureItem[] = []
  for (const k in data) {
    result.push({
      Valid: data[k].Valid,
      Sign: data[k].Sign,
      Name: data[k].Name,
      Actions: data[k].Actions,
      index: index
    })
  }
  return result
}
</script>

<style lang="less" scoped>
.custom-match-page {
  &:extend(.page-container);
}

// Section Header for match settings
// Table Styles
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
      padding: 14px 0;
    }
  }
}

.table-wrapper {
  &:extend(.table-wrapper-bordered);
}

// Section header for gestures
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);

  .count-tag {
    font-weight: 500;
  }
}

// Gestures card
gestures-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-top: 16px;
}

// Match list collapse styles
.match-list-collapse {
  margin-bottom: 16px;
  
  :deep(.el-collapse-item) {
    &__header {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 12px 16px;
      height: auto;
      line-height: 1.5;
      
      &:hover {
        border-color: var(--border-light);
      }
    }
    
    &__wrap {
      border: none;
    }
    
    &__content {
      padding: 16px 0 0;
    }
  }
  
  .collapse-title {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    
    .count-tag {
      font-weight: 500;
    }
    
    .section-toggle {
      margin-left: auto;
    }
    
    .toggle-label {
      font-size: 13px;
      color: var(--text-secondary);
      cursor: pointer;
    }
  }
}

// Match list styles
.match-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.match-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  
  .match-tag {
    font-size: 13px;
    color: var(--text-primary);
  }
  
  .delete-btn {
    opacity: 0.6;
    
    &:hover {
      opacity: 1;
    }
  }
}

.match-add {
  display: flex;
  gap: 8px;
  width: 100%;
  margin-top: 8px;
  
  .add-input-wrapper {
    flex: 1;
  }
}
</style>
