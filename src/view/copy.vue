<template>
  <div class="copy-page fade-in">
    <!-- Page Header -->
    <div class="page-header" :class="{ active: proxy.Open }">
      <div class="header-content">
        <div class="header-info">
          <h2>{{ $t('clipboardmanager') }}</h2>
          <p>{{ $t('clipboardmanager_label') }}</p>
        </div>
        <div class="header-action">
          <el-switch v-model="proxy.Open" size="large" />
        </div>
      </div>
      <div class="header-glow" v-if="proxy.Open"></div>
    </div>

    <!-- Info Alert -->
    <el-alert :title="$t('copy_tips1')" type="info" :closable="false" class="modern-alert" show-icon />

    <!-- Data Table Card -->
    <div class="table-card" :class="{ disabled: !proxy.Open }">
      <div class="table-wrapper">
        <el-table
          :data="proxy.Menu"
          stripe
          class="modern-table"
          v-loading="!proxy.Menu"
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
              <p>{{ $t('no_data') }}</p>
              <el-button type="primary" :icon="Plus" @click="create">
                {{ $t('create') }}
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
          <el-form-item :label="$t('name')">
            <el-input
              v-model="modal.Name"
              :placeholder="$t('enter_name')"
              size="large"
            />
          </el-form-item>

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
  name: 'copy',
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
        Name: '',
        Actions: [],
        NewActions: [],
        btn: 'primary'
      }
    }
  },
  computed: {
    ...mapGetters([
      'cfg'
    ]),
    proxy () {
      return this.cfg.ClipboardManager ? this.cfg.ClipboardManager : {
        Open: false,
        Menu: []
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
      var row = this.proxy.Menu[index]
      row.Valid = value
    },
    modify (index) {
      this.modal.editing = true
      this.modal.index = index
      var row = this.proxy.Menu[index]
      this.modal.title = this.$t('modify_menu')
      this.modal.btn = 'primary'
      this.modal.Name = row.Name
      this.modal.Actions = row.Actions
      this.modal.NewActions = row.Actions
    },
    create () {
      this.modal.editing = true
      this.modal.index = undefined
      this.modal.title = this.$t('add_menu')
      this.modal.btn = 'success'
      this.modal.Name = ''
      var actions = []
      this.modal.Actions = actions
      this.modal.NewActions = actions
    },
    on_modify () {
      this.modal.editing = false
      var index = this.modal.index
      if (index !== undefined) {
        var row = this.proxy.Menu[index]
        row.Name = this.modal.Name
        row.Actions = this.modal.NewActions
      } else {
        var new_row = {
          Valid: true,
          Name: this.modal.Name,
          Actions: this.modal.NewActions
        }
        this.proxy.Menu.push(new_row)
      }
    },
    remove (index) {
      this.proxy.Menu.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.copy-page {
  max-width: 1000px;
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
  transition: opacity 0.3s ease;

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
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

  .name-cell {
    .el-tag {
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
  :deep(.el-form-item__label) {
    color: var(--text-secondary);
    font-weight: 500;
    padding-bottom: 8px;
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
