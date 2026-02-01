<template>
  <div class="match-page fade-in">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h2>{{ $t('global_gestures') }}</h2>
        <p>{{ $t('match_tips') }}</p>
      </div>
    </div>

    <!-- Info Alert -->
    <el-alert :title="$t('match_tips')" type="info" :closable="false" class="modern-alert" show-icon />

    <!-- Data Table Card -->
    <div class="table-card">
      <div class="table-wrapper">
        <el-table
          :data="cfg.MatchGlobal"
          stripe
          class="modern-table"
          v-loading="!cfg.MatchGlobal"
        >
          <el-table-column :label="$t('valid')" width="70" align="center" fixed="left">
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
                  @click="modify($index)"
                >
                  {{ $t('modify') }}
                </el-button>
                <el-divider direction="vertical" />
                <el-popconfirm
                  :title="$t('match_warning')"
                  confirm-button-text="确定"
                  cancel-button-text="取消"
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
  </div>
</template>

<script>
import JsonEdit from './components/json.vue'
import SelectEdit from './components/select.vue'
import GestureEdit from './components/gesture.vue'
import { mapGetters } from 'vuex'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

export default {
  name: 'match',
  components: {
    JsonEdit,
    SelectEdit,
    GestureEdit
  },
  setup () {
    return {
      Plus,
      Edit,
      Delete
    }
  },
  data () {
    return {
      modal: {
        editing: false,
        title: '',
        sign: '',
        name: '',
        actions: [],
        new_actions: [],
        btn: 'primary'
      }
    }
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
    oncheck (index, value) {
      var row = this.cfg.MatchGlobal[index]
      row.Valid = value
    },
    modify (index) {
      this.modal.editing = true
      this.modal.index = index
      var row = this.cfg.MatchGlobal[index]
      this.modal.title = this.$t('modify_gesture')
      this.modal.btn = 'primary'
      this.modal.sign = row.Sign
      this.modal.name = row.Name
      this.modal.actions = row.Actions
      this.modal.new_actions = row.Actions
    },
    create () {
      this.modal.editing = true
      this.modal.index = undefined
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
      if (index !== undefined) {
        var row = this.cfg.MatchGlobal[index]
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
        this.cfg.MatchGlobal.push(new_row)
      }
    },
    remove (index) {
      this.cfg.MatchGlobal.splice(index, 1)
    }
  },
  computed: {
    ...mapGetters([
      'cfg'
    ])
  }
}
</script>

<style lang="less" scoped>
.match-page {
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

// Table Card
.table-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
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
</style>
