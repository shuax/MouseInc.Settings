<template>
  <div class="edge-page fade-in">
    <!-- Page Header -->
    <div class="page-header" :class="{ active: proxy.Open }">
      <div class="header-content">
        <div class="header-info">
          <h2>{{ $t('wheeledge') }}</h2>
          <p>{{ $t('wheeledge_desc') }}</p>
        </div>
        <div class="header-action">
          <el-switch v-model="proxy.Open" size="large" />
        </div>
      </div>
      <div class="header-glow" v-if="proxy.Open"></div>
    </div>

    <!-- Alerts Section -->
    <div class="alerts-section">
      <el-alert :title="$t('edge_tips1')" type="info" :closable="false" class="modern-alert" show-icon />
    </div>

    <!-- Data Table -->
    <div class="table-card">
      <el-table :data="edge_data" stripe class="modern-table" style="width: 100%">
        <el-table-column :label="$t('valid')" width="70" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.Valid" size="small" @change="oncheck(row.Location, $event)" />
          </template>
        </el-table-column>

        <el-table-column :label="$t('location')" width="80">
          <template #default="{ row }">
            <el-tag size="small" effect="dark" :type="getLocationType(row.Location)">
              {{ $t(row.Location) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column :label="$t('name')" prop="Name" width="140">
          <template #default="{ row }">
            <span class="name-text">{{ row.Name }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('upactions')" prop="UpActions" width="300">
          <template #default="{ row }">
            <span class="actions-text" v-html="highlightJSON(formatActions(row.UpActions))" :title="formatActions(row.UpActions)"></span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('downactions')" prop="DownActions" width="300">
          <template #default="{ row }">
            <span class="actions-text" v-html="highlightJSON(formatActions(row.DownActions))" :title="formatActions(row.DownActions)"></span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('pressactions')" prop="PressActions" width="300">
          <template #default="{ row }">
            <span class="actions-text" v-html="highlightJSON(formatActions(row.PressActions))" :title="formatActions(row.PressActions)"></span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('operate')" align="center" fixed="right" width="100">
          <template #default="{ row }">
            <div class="operate-cell">
              <el-button type="primary" link size="small" @click="modify(row.Location)">
                {{ $t('modify') }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Edit Dialog -->
    <el-dialog
      v-model="modal.editing"
      :title="modal.title"
      width="720px"
      align-center
      destroy-on-close
      class="modern-dialog"
    >
      <div class="dialog-body">
        <el-form label-position="top" @submit.prevent>
          <el-form-item :label="$t('name')">
            <el-input v-model="modal.Name" size="large" :placeholder="$t('enter_name')" />
          </el-form-item>

          <div class="actions-sections">
            <div class="action-section">
              <div class="section-label">
                <span>{{ $t('upactions') }}</span>
              </div>
              <div class="json-editor-wrapper">
                <JsonEdit
                  :value="modal.UpActions"
                  :editing="modal.editing"
                  @on-input="modal.NewUpActions = $event"
                />
              </div>
            </div>

            <div class="action-section">
              <div class="section-label">
                <span>{{ $t('downactions') }}</span>
              </div>
              <div class="json-editor-wrapper">
                <JsonEdit
                  :value="modal.DownActions"
                  :editing="modal.editing"
                  @on-input="modal.NewDownActions = $event"
                />
              </div>
            </div>

            <div class="action-section">
              <div class="section-label">
                <span>{{ $t('pressactions') }}</span>
              </div>
              <div class="json-editor-wrapper">
                <JsonEdit
                  :value="modal.PressActions"
                  :editing="modal.editing"
                  @on-input="modal.NewPressActions = $event"
                />
              </div>
            </div>
          </div>
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

interface EdgeDataItem {
  Location: string
  Valid: boolean
  Name: string
  UpActions: string[][]
  DownActions: string[][]
  PressActions: string[][]
}

interface EdgeDetail {
  Valid?: boolean
  Name?: string
  UpActions?: string[][]
  DownActions?: string[][]
  PressActions?: string[][]
}

interface WheelEdgeConfigFull {
  Open: boolean
  Left: EdgeDetail
  Top: EdgeDetail
  Right: EdgeDetail
  Bottom: EdgeDetail
}

interface ModalState {
  editing: boolean
  title: string
  Name: string
  UpActions: string[][]
  DownActions: string[][]
  PressActions: string[][]
  NewUpActions: string[][]
  NewDownActions: string[][]
  NewPressActions: string[][]
  Location?: string
}

const modal = reactive<ModalState>({
  editing: false,
  title: '',
  Name: '',
  UpActions: [],
  DownActions: [],
  PressActions: [],
  NewUpActions: [],
  NewDownActions: [],
  NewPressActions: []
})

const proxy = computed<WheelEdgeConfigFull>(() => {
  return cfg.value.WheelEdge ? cfg.value.WheelEdge as WheelEdgeConfigFull : {
    Open: false,
    Left: {},
    Top: {},
    Right: {},
    Bottom: {}
  }
})

const edge_data = computed<EdgeDataItem[]>(() => {
  const result: EdgeDataItem[] = []
  const location = ['Left', 'Top', 'Right', 'Bottom']
  for (const loc of location) {
    const edgeData = proxy.value[loc as keyof WheelEdgeConfigFull] as EdgeDetail
    result.push({
      Location: loc,
      Valid: edgeData?.Valid || false,
      Name: edgeData?.Name || '',
      UpActions: (edgeData?.UpActions || []) as string[][],
      DownActions: (edgeData?.DownActions || []) as string[][],
      PressActions: (edgeData?.PressActions || []) as string[][]
    })
  }
  return result
})

function getLocationType (location: string): string {
  const types: Record<string, string> = {
    'Left': 'primary',
    'Right': 'success',
    'Top': 'warning',
    'Bottom': 'info'
  }
  return types[location] || 'info'
}

function formatActions (actions: string[][]): string {
  if (!actions || !Array.isArray(actions)) return t('no_actions')
  return (actions as unknown as unknown[]).map(a => {
    if (typeof a === 'string') return a
    const obj = a as Record<string, unknown>
    if (obj.cmd) return `cmd: ${obj.cmd}`
    if (obj.key) return `key: ${obj.key}`
    return JSON.stringify(a)
  }).join(' → ')
}

function oncheck (Location: string, value: boolean): void {
  const row = proxy.value[Location as keyof WheelEdgeConfigFull] as EdgeDetail
  if (row) {
    row.Valid = value
  }
}

function modify (Location: string): void {
  modal.editing = true
  modal.Location = Location
  const row = proxy.value[Location as keyof WheelEdgeConfigFull] as EdgeDetail
  modal.title = t('edge_tips2')
  modal.Name = row?.Name || ''
  modal.UpActions = row?.UpActions || []
  modal.DownActions = row?.DownActions || []
  modal.PressActions = row?.PressActions || []
  modal.NewUpActions = row?.UpActions || []
  modal.NewDownActions = row?.DownActions || []
  modal.NewPressActions = row?.PressActions || []
}

function on_modify (): void {
  modal.editing = false
  const Location = modal.Location
  if (Location) {
    const row = proxy.value[Location as keyof WheelEdgeConfigFull] as EdgeDetail
    if (row) {
      row.Name = modal.Name
      row.UpActions = modal.NewUpActions
      row.DownActions = modal.NewDownActions
      row.PressActions = modal.NewPressActions
    }
  }
}
</script>

<style lang="less" scoped>
.edge-page {
  &:extend(.page-container);
}
</style>