<template>
  <div class="corner-page fade-in">
    <!-- Page Header -->
    <div class="page-header" :class="{ active: proxy.Open }">
      <div class="header-content">
        <div class="header-info">
          <h2>{{ $t('corner') }}</h2>
          <p>{{ $t('corner_desc') }}</p>
        </div>
        <div class="header-action">
          <el-switch v-model="proxy.Open" size="large" />
        </div>
      </div>
      <div class="header-glow" v-if="proxy.Open"></div>
    </div>

    <!-- Alerts Section -->
    <div class="alerts-section">
      <el-alert :title="$t('corner_tips1')" type="info" :closable="false" class="modern-alert" show-icon />
    </div>

    <!-- Data Table -->
    <div class="table-card">
      <el-table :data="corner_data" stripe class="modern-table">
        <el-table-column :label="$t('valid')" width="70" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.Valid" size="small" @change="oncheck(row.Location, $event)" />
          </template>
        </el-table-column>

        <el-table-column :label="$t('location')" width="100">
          <template #default="{ row }">
            <el-tag size="small" effect="dark" :type="getLocationType(row.Location)">
              {{ $t(row.Location) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column :label="$t('name')" prop="Name" width="150">
          <template #default="{ row }">
            <span class="name-text">{{ row.Name }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('actions')" prop="Actions" min-width="250">
          <template #default="{ row }">
            <span class="actions-text" v-html="highlightJSON(formatActions(row.Actions))" :title="formatActions(row.Actions)"></span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('operate')" align="center" fixed="right" width="100">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="modify(row.Location)">
              {{ $t('modify') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Edit Dialog -->
    <el-dialog
      v-model="modal.editing"
      :title="modal.title"
      width="600px"
      align-center
      destroy-on-close
      class="modern-dialog"
    >
      <div class="dialog-body">
        <el-form label-position="top" @submit.prevent>
          <el-form-item :label="$t('name')">
            <el-input v-model="modal.Name" size="large" :placeholder="$t('enter_name')" />
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
          <el-button type="primary" size="large" class="save-btn" @click="on_modify">
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
import { highlightJSON } from '@/libs/util'
import type { Config } from '@/types/index.ts'
import JsonEdit from './components/json.vue'

const store = useStore()
const { t } = useI18n()
const cfg = computed<Config>(() => store.getters.cfg)

interface CornerDataItem {
  Location: string
  Valid: boolean
  Name: string
  Actions: string[][]
}

interface ModalState {
  editing: boolean
  title: string
  Name: string
  Actions: string[][]
  NewActions: string[][]
  Location?: string
}

const modal = reactive<ModalState>({
  editing: false,
  title: '',
  Name: '',
  Actions: [],
  NewActions: []
})

interface HotCornerDetail {
  Valid?: boolean
  Name?: string
  Actions?: string[][]
}

interface HotCornerConfig {
  Open: boolean
  TopLeft?: HotCornerDetail
  TopRight?: HotCornerDetail
  BottomLeft?: HotCornerDetail
  BottomRight?: HotCornerDetail
}

const proxy = computed<HotCornerConfig>(() => {
  return cfg.value.HotCorner ? cfg.value.HotCorner : {
    Open: false,
    TopLeft: {},
    TopRight: {},
    BottomLeft: {},
    BottomRight: {}
  }
})

const corner_data = computed<CornerDataItem[]>(() => {
  const result: CornerDataItem[] = []
  const location = ['TopLeft', 'TopRight', 'BottomLeft', 'BottomRight']
  for (const loc of location) {
    const cornerData = proxy.value[loc as keyof HotCornerConfig] as HotCornerDetail | undefined
    result.push({
      Location: loc,
      Valid: cornerData?.Valid || false,
      Name: cornerData?.Name || '',
      Actions: (cornerData?.Actions || []) as string[][]
    })
  }
  return result
})

function getLocationType (location: string): string {
  const types: Record<string, string> = {
    'TopLeft': 'primary',
    'TopRight': 'success',
    'BottomLeft': 'warning',
    'BottomRight': 'info'
  }
  return types[location] || 'info'
}

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

function oncheck (Location: string, value: boolean): void {
  const row = proxy.value[Location as keyof HotCornerConfig] as HotCornerDetail
  if (row) {
    row.Valid = value
  }
}

function modify (Location: string): void {
  modal.editing = true
  modal.Location = Location
  const row = proxy.value[Location as keyof HotCornerConfig] as HotCornerDetail
  modal.title = t('corner_tips2')
  modal.Name = row?.Name || ''
  modal.Actions = row?.Actions || []
  modal.NewActions = row?.Actions || []
}

function on_modify (): void {
  modal.editing = false
  const Location = modal.Location
  if (Location) {
    const row = proxy.value[Location as keyof HotCornerConfig] as HotCornerDetail
    if (row) {
      row.Name = modal.Name
      row.Actions = modal.NewActions
    }
  }
}
</script>

<style lang="less" scoped>
.corner-page {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
