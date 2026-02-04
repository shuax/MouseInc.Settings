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

    <!-- Alerts Section -->
    <div class="alerts-section">
      <el-alert :title="$t('copy_tips1')" type="info" :closable="false" class="modern-alert" show-icon />
    </div>

    <!-- Data Table Card -->
    <div class="table-card">
      <div class="table-wrapper">
        <el-table
          :data="proxy.Menu"
          stripe
          class="modern-table"
          v-loading="!proxy.Menu"
          :row-class-name="getRowClass"
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

          <el-table-column :label="$t('name')" min-width="160">
            <template #default="{ row }">
              <div class="name-cell">
                <template v-if="row.Name">
                  <el-tag size="small" effect="dark" type="primary" class="menu-item-tag">
                    {{ row.Name }}
                  </el-tag>
                </template>
                <template v-else>
                  <div class="divider-row">
                    <span>{{ $t('divider') }}</span>
                  </div>
                </template>
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="$t('actions')" prop="Actions" min-width="300">
            <template #default="{ row }">
              <div class="actions-preview">
                <template v-if="!row.Name">
                  <span class="muted-dash"></span>
                </template>
                <template v-else-if="!row.Actions || row.Actions.length === 0">
                  <el-tag size="small" class="sub-menu-tag" effect="light">
                    <el-icon><Operation /></el-icon> {{ $t('sub_menu') }}
                  </el-tag>
                </template>
                <template v-else>
                  <span class="actions-text" v-html="highlightJSON(formatActions(row.Actions))" :title="formatActions(row.Actions)"></span>
                </template>
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
      width="900px"
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

                      <el-form-item :label="$t('actions')" class="full-width-item">
                      <div class="json-editor-wrapper">              <JsonEdit
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
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import JsonEdit from './components/json.vue'
import { Plus, Edit, Delete, Operation } from '@element-plus/icons-vue'
import { highlightJSON } from '@/libs/util'

interface MenuItem {
  Valid: boolean
  Name: string
  Actions: string[][]
}

interface ClipboardManager {
  Open: boolean
  Menu: MenuItem[]
}

const store = useStore()
const { t } = useI18n()

const getRowClass = ({ row }: { row: MenuItem }) => {
  return !row.Name ? 'is-divider-row' : ''
}

const modal = reactive({
  editing: false,
  title: '',
  Name: '',
  Actions: [] as string[][],
  NewActions: [] as string[][],
  btn: 'primary',
  index: undefined as number | undefined
})

const cfg = computed(() => store.getters.cfg)

const proxy = computed<ClipboardManager>(() => {
  return cfg.value.ClipboardManager ? cfg.value.ClipboardManager : {
    Open: false,
    Menu: []
  }
})

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

const oncheck = (index: number, value: boolean) => {
  const row = proxy.value.Menu[index]
  row.Valid = value
}

const modify = (index: number) => {
  modal.editing = true
  modal.index = index
  const row = proxy.value.Menu[index]
  modal.title = t('modify_menu')
  modal.btn = 'primary'
  modal.Name = row.Name
  modal.Actions = row.Actions
  modal.NewActions = row.Actions
}

const create = () => {
  modal.editing = true
  modal.index = undefined
  modal.title = t('add_menu')
  modal.btn = 'success'
  modal.Name = ''
  const actions: string[][] = []
  modal.Actions = actions
  modal.NewActions = actions
}

const on_modify = () => {
  modal.editing = false
  const index = modal.index
  if (index !== undefined) {
    const row = proxy.value.Menu[index]
    row.Name = modal.Name
    row.Actions = modal.NewActions
  } else {
    const new_row: MenuItem = {
      Valid: true,
      Name: modal.Name,
      Actions: modal.NewActions
    }
    proxy.value.Menu.push(new_row)
  }
}

const remove = (index: number) => {
  proxy.value.Menu.splice(index, 1)
}
</script>

<style lang="less" scoped>
.copy-page {
  max-width: 1000px;
  margin: 0 auto;
}

.table-wrapper {
  &:extend(.table-wrapper-bordered);
}

.modern-table {

  .name-cell {

    .el-tag {

      font-weight: 500;

    }

  }

  

  :deep(.is-divider-row) {

    background-color: var(--bg-primary) !important;

    opacity: 0.8;

  }

}



.divider-row {

  display: flex;

  align-items: center;

  width: 100%;

  color: var(--text-muted);

  font-size: 11px;

  font-weight: 600;

  text-transform: uppercase;

  letter-spacing: 1px;



  &::after {

    content: '';

    flex: 1;

    height: 1px;

    margin-left: 12px;

    background: linear-gradient(90deg, var(--border-color), transparent);

  }

}



.sub-menu-tag {
  background-color: rgba(114, 46, 209, 0.1) !important;
  color: #722ed1 !important;
  border: 1px solid rgba(114, 46, 209, 0.2) !important;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  
  :deep(.el-tag__content) {
    display: inline-flex;
    align-items: center;
  }
  
  .el-icon {
    margin-right: 4px;
  }
}



.muted-dash {

  display: block;

  width: 20px;

  height: 1px;

  background: var(--border-color);

}

</style>
