<template>
  <div class="hotkey-page fade-in">
    <!-- Page Header -->
    <div class="page-header">
       <div class="header-content">
        <h2>{{ $t('hotkeys_title') }}</h2>
        <p>{{ $t('hotkeys_desc') }}</p>
      </div>
    </div>

    <!-- Info Alert -->
    <el-alert
      :title="$t('hotkey_tips1')"
      type="info"
      :closable="false"
      show-icon
      class="modern-alert"
    />

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
          <el-table-column :label="$t('valid')" width="70" align="center" fixed="left">
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

<script>
import JsonEdit from './components/json.vue'
import { mapGetters } from 'vuex'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

export default {
  name: 'hotkey',
  components: {
    JsonEdit
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
        Keys: '',
        Name: '',
        Actions: [],
        NewActions: [],
        btn: 'primary'
      }
    }
  },
  computed: {
    ...mapGetters(['cfg']),
    activeCount () {
      if (!this.cfg.Hotkeys) return 0
      return this.cfg.Hotkeys.filter(h => h.Valid).length
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
      var row = this.cfg.Hotkeys[index]
      row.Valid = value
    },
    modify (index) {
      this.modal.editing = true
      this.modal.index = index
      var row = this.cfg.Hotkeys[index]
      this.modal.title = this.$t('modify_keys')
      this.modal.btn = 'primary'
      this.modal.Keys = row.Keys
      this.modal.Name = row.Name
      this.modal.Actions = row.Actions
      this.modal.NewActions = row.Actions
    },
    create () {
      this.modal.editing = true
      this.modal.index = undefined
      this.modal.title = this.$t('add_keys')
      this.modal.btn = 'success'
      this.modal.Keys = ''
      this.modal.Name = ''
      var actions = []
      this.modal.Actions = actions
      this.modal.NewActions = actions
    },
    on_modify () {
      this.modal.editing = false
      var index = this.modal.index
      if (index !== undefined) {
        var row = this.cfg.Hotkeys[index]
        row.Keys = this.modal.Keys
        row.Name = this.modal.Name
        row.Actions = this.modal.NewActions
      } else {
        var new_row = {
          Valid: true,
          Keys: this.modal.Keys,
          Name: this.modal.Name,
          Actions: this.modal.NewActions
        }
        this.cfg.Hotkeys.push(new_row)
      }
    },
    remove (index) {
      this.cfg.Hotkeys.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.hotkey-page {
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

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .table-stats {
      display: flex;
      gap: 8px;
    }

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
}

.table-wrapper {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border-color);
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
