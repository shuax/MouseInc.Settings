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

    <!-- Info Alert -->
    <el-alert :title="$t('edge_tips1')" type="info" :closable="false" class="modern-alert" show-icon />

    <!-- Visual Layout -->
    <div class="edge-visual" :class="{ disabled: !proxy.Open }">
      <div class="screen-preview">
        <div class="screen-content">
          <div class="edge-zone left" :class="{ active: proxy.Left?.Valid }" @click="modify('Left')">
            <div class="zone-indicator">
              <span>{{ $t('Left') }}</span>
            </div>
            <el-switch v-model="proxy.Left.Valid" size="small" @click.stop @change="oncheck('Left', $event)" />
          </div>
          <div class="edge-zone top" :class="{ active: proxy.Top?.Valid }" @click="modify('Top')">
            <div class="zone-indicator">
              <span>{{ $t('Top') }}</span>
            </div>
            <el-switch v-model="proxy.Top.Valid" size="small" @click.stop @change="oncheck('Top', $event)" />
          </div>
          <div class="edge-zone right" :class="{ active: proxy.Right?.Valid }" @click="modify('Right')">
            <div class="zone-indicator">
              <span>{{ $t('Right') }}</span>
            </div>
            <el-switch v-model="proxy.Right.Valid" size="small" @click.stop @change="oncheck('Right', $event)" />
          </div>
          <div class="edge-zone bottom" :class="{ active: proxy.Bottom?.Valid }" @click="modify('Bottom')">
            <div class="zone-indicator">
              <span>{{ $t('Bottom') }}</span>
            </div>
            <el-switch v-model="proxy.Bottom.Valid" size="small" @click.stop @change="oncheck('Bottom', $event)" />
          </div>
          <div class="center-hint">{{ $t('click_zone_to_edit') }}</div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="table-card" :class="{ disabled: !proxy.Open }">
      <el-table :data="edge_data" stripe class="modern-table">
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

        <el-table-column :label="$t('upactions')" prop="UpActions" min-width="180">
          <template #default="{ row }">
            <span class="actions-text" :title="formatActions(row.UpActions)">
              {{ formatActions(row.UpActions) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('downactions')" prop="DownActions" min-width="180">
          <template #default="{ row }">
            <span class="actions-text" :title="formatActions(row.DownActions)">
              {{ formatActions(row.DownActions) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('pressactions')" prop="PressActions" min-width="180">
          <template #default="{ row }">
            <span class="actions-text" :title="formatActions(row.PressActions)">
              {{ formatActions(row.PressActions) }}
            </span>
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

<script>
import JsonEdit from './components/json.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'edge',
  components: {
    JsonEdit
  },
  data () {
    return {
      modal: {
        editing: false,
        title: '',
        Name: '',
        UpActions: [],
        DownActions: [],
        PressActions: [],
        NewUpActions: [],
        NewDownActions: [],
        NewPressActions: []
      }
    }
  },
  computed: {
    ...mapGetters(['cfg']),
    proxy () {
      return this.cfg.WheelEdge ? this.cfg.WheelEdge : {
        Open: false,
        Left: {},
        Top: {},
        Right: {},
        Bottom: {}
      }
    },
    edge_data () {
      var result = []
      var location = ['Left', 'Top', 'Right', 'Bottom']
      for (var k in location) {
        var Location = location[k]
        result.push({
          Location: Location,
          Valid: this.proxy[Location].Valid,
          Name: this.proxy[Location].Name,
          UpActions: this.proxy[Location].UpActions,
          DownActions: this.proxy[Location].DownActions,
          PressActions: this.proxy[Location].PressActions
        })
      }
      return result
    }
  },
  methods: {
    getLocationType (location) {
      const types = {
        'Left': 'primary',
        'Right': 'success',
        'Top': 'warning',
        'Bottom': 'info'
      }
      return types[location] || 'info'
    },
    formatActions (actions) {
      if (!actions || !Array.isArray(actions)) return this.$t('no_actions')
      return actions.map(a => {
        if (typeof a === 'string') return a
        if (a.cmd) return `cmd: ${a.cmd}`
        if (a.key) return `key: ${a.key}`
        return JSON.stringify(a)
      }).join(' → ')
    },
    oncheck (Location, value) {
      var row = this.proxy[Location]
      row.Valid = value
    },
    modify (Location) {
      this.modal.editing = true
      this.modal.Location = Location
      var row = this.proxy[Location]
      this.modal.title = this.$t('edge_tips2')
      this.modal.Name = row.Name
      this.modal.UpActions = row.UpActions
      this.modal.DownActions = row.DownActions
      this.modal.PressActions = row.PressActions
      this.modal.NewUpActions = row.UpActions
      this.modal.NewDownActions = row.DownActions
      this.modal.NewPressActions = row.PressActions
    },
    on_modify () {
      this.modal.editing = false
      var Location = this.modal.Location
      var row = this.proxy[Location]
      row.Name = this.modal.Name
      row.UpActions = this.modal.NewUpActions
      row.DownActions = this.modal.NewDownActions
      row.PressActions = this.modal.NewPressActions
    }
  }
}
</script>

<style lang="less" scoped>
.edge-page {
  max-width: 1200px;
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
}

// Edge Visual
.edge-visual {
  margin-bottom: 24px;

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.screen-preview {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 40px;

  .screen-content {
    aspect-ratio: 16 / 10;
    background: var(--bg-tertiary);
    border: 2px dashed var(--border-color);
    border-radius: 12px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.edge-zone {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--border-light);
    transform: scale(1.05);
  }

  &.active {
    border-color: var(--primary-color);
    background: rgba(102, 126, 234, 0.15);

    .zone-indicator {
      color: var(--primary-color);
    }
  }

  &.left {
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
  }

  &.right {
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
  }

  &.top {
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
  }

  &.bottom {
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
  }

  &.left:hover, &.right:hover {
    transform: translateY(-50%) scale(1.05);
  }

  &.top:hover, &.bottom:hover {
    transform: translateX(-50%) scale(1.05);
  }
}

.zone-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.center-hint {
  font-size: 12px;
  color: var(--text-muted);
  pointer-events: none;
}

// Table Card
.table-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px;
  overflow: hidden;

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

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

.name-text {
  font-size: 14px;
  color: var(--text-primary);
}

.actions-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// Dialog
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

  .actions-sections {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .action-section {
    .section-label {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
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
  .screen-preview {
    padding: 20px;
  }

  .edge-zone {
    padding: 6px 8px;

    .zone-indicator span {
      display: none;
    }
  }
}
</style>
