<template>
  <div class="custom-match-page fade-in">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h2>{{ $t('custom_match') }}</h2>
        <p>{{ $t('custom_tips') }}</p>
      </div>
    </div>

    <!-- Info Alert -->
    <el-alert :title="$t('custom_tips')" type="info" :closable="false" class="modern-alert" show-icon />

    <!-- Tabs Card -->
    <div class="tabs-card">
      <el-tabs v-model="tab" type="border-card" class="custom-tabs">
        <el-tab-pane v-for="(item, index) in cfg.MatchCustom" :label="item.Name" :key="index" :name="String(index)">
          <!-- Match Settings Card -->
          <div class="match-settings-card">
            <div class="section-header">
              <span>{{ $t('custom_list') }}</span>
              <el-switch v-model="item.IgnoreGlobal" size="small" class="section-toggle" />
              <span class="toggle-label">{{ $t('ignore_global') }}</span>
            </div>

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
          </div>

          <!-- Gestures Table Card - Collapsible -->
          <el-collapse v-model="activeCollapse" class="gestures-collapse">
            <el-collapse-item :name="String(index)">
              <template #title>
                <div class="collapse-title">
                  <span>{{ $t('gesture_list') }}</span>
                  <el-tag size="small" type="info" effect="dark" class="count-tag">
                    {{ item.List ? item.List.length : 0 }} {{ $t('items') }}
                  </el-tag>
                </div>
              </template>
              <div class="gestures-card">
                <div class="table-wrapper">
                  <el-table
                    :data="MatchTable(item.List, index)"
                    stripe
                    class="modern-table"
                  >
                    <el-table-column :label="$t('valid')" width="70" align="center" fixed="left">
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
                          <span class="actions-text" :title="formatActions(row.Actions)">
                            {{ formatActions(row.Actions) }}
                          </span>
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
                            confirm-button-text="确定"
                            cancel-button-text="取消"
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
            </el-collapse-item>
          </el-collapse>
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
              confirm-button-text="确定"
              cancel-button-text="取消"
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
      width="650px"
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

          <el-form-item :label="$t('actions')">
            <div class="json-editor-wrapper">
              <JsonEdit
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

<script>
import JsonEdit from './components/json.vue'
import SelectEdit from './components/select.vue'
import GestureEdit from './components/gesture.vue'
import { mapGetters } from 'vuex'
import { ElMessage } from 'element-plus'
import { Plus, Delete, Edit, CopyDocument } from '@element-plus/icons-vue'

export default {
  name: 'custom-match',
  components: {
    JsonEdit,
    SelectEdit,
    GestureEdit
  },
  setup () {
    return {
      Plus,
      Delete,
      Edit,
      CopyDocument
    }
  },
  data () {
    return {
      tab: '0',
      value: '',
      activeCollapse: [], // 控制折叠面板状态，默认空数组表示都折叠
      modal: {
        editing: false,
        title: '',
        sign: '',
        name: '',
        actions: [],
        new_actions: [],
        btn: 'primary'
      },
      tabModal: {
        visible: false,
        name: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'cfg'
    ])
  },
  methods: {
    formatActions (actions) {
      if (!actions || !Array.isArray(actions)) return ''
      return actions.map(a => {
        if (typeof a === 'string') return a
        if (a.cmd) return `cmd: ${a.cmd}`
        if (a.key) return `key: ${a.key}`
        return JSON.stringify(a)
      }).join(' → ')
    },
    oncheck (index, match_index, value) {
      var row = this.cfg.MatchCustom[index].List[match_index]
      row.Valid = value
    },
    modify (index, match_index) {
      this.modal.editing = true
      this.modal.index = index
      this.modal.match_index = match_index
      var row = this.cfg.MatchCustom[index].List[match_index]
      this.modal.title = this.$t('modify_gesture')
      this.modal.btn = 'primary'
      this.modal.sign = row.Sign
      this.modal.name = row.Name
      this.modal.actions = row.Actions
      this.modal.new_actions = row.Actions
    },
    create (index) {
      this.modal.editing = true
      this.modal.index = index
      this.modal.match_index = undefined
      this.modal.title = this.$t('add_gesture')
      this.modal.btn = 'success'
      this.modal.sign = ''
      this.modal.name = ''
      var actions = []
      this.modal.actions = actions
      this.modal.new_actions = actions
    },
    on_modify () {
      this.modal.editing = false
      var index = this.modal.index
      var match_index = this.modal.match_index
      if (match_index !== undefined) {
        var row = this.cfg.MatchCustom[index].List[match_index]
        row.Sign = this.modal.sign
        row.Name = this.modal.name
        row.Actions = this.modal.new_actions
      } else {
        var new_row = {
          Valid: true,
          Sign: this.modal.sign,
          Name: this.modal.name,
          Actions: this.modal.new_actions
        }
        this.cfg.MatchCustom[index].List.push(new_row)
      }
    },
    remove (index, match_index) {
      this.cfg.MatchCustom[index].List.splice(match_index, 1)
    },
    removematch (index, match_index) {
      this.cfg.MatchCustom[index].Match.splice(match_index, 1)
    },
    addmatch (index) {
      if (this.value.indexOf('.') === -1) {
        ElMessage.error(this.$t('exclude_warning'))
        return
      }
      this.cfg.MatchCustom[index].Match.push(this.value)
      this.value = ''
    },
    modtab () {
      this.tabModal.name = this.cfg.MatchCustom[parseInt(this.tab)].Name
      this.tabModal.visible = true
    },
    onTabModalOk () {
      this.cfg.MatchCustom[parseInt(this.tab)].Name = this.tabModal.name
      this.tabModal.visible = false
    },
    addtab () {
      this.cfg.MatchCustom.push(JSON.parse(JSON.stringify(this.cfg.MatchCustom[parseInt(this.tab)])))
      this.tab = String(this.cfg.MatchCustom.length - 1)
    },
    removetab () {
      this.cfg.MatchCustom.splice(parseInt(this.tab), 1)
      this.tab = String(Math.min(parseInt(this.tab), this.cfg.MatchCustom.length - 1))
    },
    MatchTable (data, index) {
      var result = []
      for (var k in data) {
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
  }
}
</script>

<style lang="less" scoped>
.custom-match-page {
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

// Alert
.modern-alert {
  margin-bottom: 20px;
  border-radius: 10px;
  border: 1px solid rgba(88, 166, 255, 0.2);
  background: rgba(88, 166, 255, 0.08);

  :deep(.el-alert__content) {
    color: var(--text-primary);
  }
}

// Tabs Card
.tabs-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.custom-tabs {
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
    padding: 20px;
  }
}

.tab-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
}

// Match Settings Card
.match-settings-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);

  .section-toggle {
    margin-left: auto;
  }

  .toggle-label {
    font-size: 13px;
    font-weight: 400;
    color: var(--text-secondary);
  }
}

// Match List
.match-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.match-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  transition: all 0.25s ease;

  &:hover {
    border-color: var(--border-light);
    transform: translateX(4px);
  }

  .match-tag {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: var(--text-primary);
    font-family: 'Courier New', monospace;
  }

  .delete-btn {
    background: rgba(248, 81, 73, 0.1);
    border: 1px solid rgba(248, 81, 73, 0.3);
    color: var(--accent-red);

    &:hover {
      background: var(--accent-red);
      border-color: var(--accent-red);
      color: white;
    }
  }
}

// Match Add
.match-add {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 10px;
}

.add-input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0 12px;
  transition: all 0.25s ease;

  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }

  .add-input {
    flex: 1;

    :deep(.el-input__wrapper) {
      background: transparent;
      box-shadow: none;
      padding: 8px 0;
    }
  }
}

// Gestures Card
gestures-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
}

.table-wrapper {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  margin-bottom: 16px;
}

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

  .actions-preview {
    display: flex;
    align-items: center;
    gap: 8px;

    .actions-text {
      font-size: 13px;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .operate-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;

    .el-divider {
      background: var(--border-color);
    }
  }
}

// Table Footer
.table-footer {
  display: flex;
  justify-content: flex-start;

  .create-btn {
    background: var(--primary-gradient);
    border: none;
    font-weight: 500;

    &:hover {
      box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
      transform: translateY(-1px);
    }
  }
}

// Empty State
.empty-state {
  padding: 60px 20px;
  text-align: center;

  p {
    color: var(--text-secondary);
    margin: 0 0 20px;
    font-size: 14px;
  }
}

// Dialog Styles
:deep(.modern-dialog) {
  .el-dialog {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;

    &__header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--border-color);
      margin-right: 0;

      .el-dialog__title {
        color: var(--text-primary);
        font-weight: 600;
      }
    }

    &__body {
      padding: 24px;
    }

    &__footer {
      padding: 16px 24px 24px;
      border-top: 1px solid var(--border-color);
    }
  }
}

.dialog-body {
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .form-item-half {
    margin-bottom: 20px;

    :deep(.el-form-item__label) {
      color: var(--text-secondary);
      font-weight: 500;
      padding-bottom: 8px;
    }
  }

  .json-editor-wrapper {
    border: 1px solid var(--border-color);
    border-radius: 10px;
    overflow: hidden;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  .save-btn {
    min-width: 100px;
  }
}

// Responsive
@media (max-width: 768px) {
  .match-add {
    flex-direction: column;
    align-items: stretch;
  }

  .tab-actions {
    flex-wrap: wrap;
  }
}
</style>
