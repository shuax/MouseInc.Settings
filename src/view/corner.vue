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

    <!-- Info Alert -->
    <el-alert :title="$t('corner_tips1')" type="info" :closable="false" class="modern-alert" show-icon />

    <!-- Visual Layout -->
    <div class="corner-visual" :class="{ disabled: !proxy.Open }">
      <div class="screen-preview">
        <div class="screen-content">
          <div class="corner-grid">
            <div
              v-for="corner in corner_data"
              :key="corner.Location"
              :class="['corner-zone', corner.Location.toLowerCase(), { active: corner.Valid }]"
              @click="modify(corner.Location)"
            >
              <div class="zone-content">
                <div class="zone-info">
                  <div class="zone-name">{{ $t(corner.Location) }}</div>
                  <div class="zone-action" v-if="corner.Valid">{{ corner.Name }}</div>
                  <div class="zone-status" v-else>{{ $t('disabled') }}</div>
                </div>
              </div>
              <div class="zone-toggle">
                <el-switch
                  v-model="corner.Valid"
                  size="small"
                  @change="oncheck(corner.Location, $event)"
                  @click.stop
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="table-card" :class="{ disabled: !proxy.Open }">
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
            <span class="actions-text" :title="formatActions(row.Actions)">
              {{ formatActions(row.Actions) }}
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

<script>
import JsonEdit from './components/json.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'corner',
  components: {
    JsonEdit
  },
  data () {
    return {
      modal: {
        editing: false,
        title: '',
        Name: '',
        Actions: [],
        NewActions: []
      }
    }
  },
  computed: {
    ...mapGetters(['cfg']),
    proxy () {
      return this.cfg.HotCorner ? this.cfg.HotCorner : {
        Open: false,
        TopLeft: {},
        TopRight: {},
        BottomLeft: {},
        BottomRight: {}
      }
    },
    corner_data () {
      var result = []
      var location = ['TopLeft', 'TopRight', 'BottomLeft', 'BottomRight']
      for (var k in location) {
        var Location = location[k]
        result.push({
          Location: Location,
          Valid: this.proxy[Location].Valid,
          Name: this.proxy[Location].Name,
          Actions: this.proxy[Location].Actions
        })
      }
      return result
    }
  },
  methods: {
    getLocationType (location) {
      const types = {
        'TopLeft': 'primary',
        'TopRight': 'success',
        'BottomLeft': 'warning',
        'BottomRight': 'info'
      }
      return types[location] || 'info'
    },
    formatActions (actions) {
      if (!actions || !Array.isArray(actions)) return ''
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
      this.modal.title = this.$t('corner_tips2')
      this.modal.Name = row.Name
      this.modal.Actions = row.Actions
      this.modal.NewActions = row.Actions
    },
    on_modify () {
      this.modal.editing = false
      var Location = this.modal.Location
      var row = this.proxy[Location]
      row.Name = this.modal.Name
      row.Actions = this.modal.NewActions
    }
  }
}
</script>

<style lang="less" scoped>
.corner-page {
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
}

// Corner Visual
.corner-visual {
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

.corner-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
  padding: 20px;
}

.corner-zone {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--border-light);
    transform: scale(1.02);
  }

  &.active {
    border-color: var(--primary-color);
    background: rgba(102, 126, 234, 0.08);
  }
}

.zone-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.zone-info {
  .zone-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
  }

  .zone-action {
    font-size: 12px;
    color: var(--accent-green);
  }

  .zone-status {
    font-size: 12px;
    color: var(--text-muted);
  }
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
  .corner-grid {
    grid-template-columns: 1fr;
  }

  .screen-preview {
    padding: 20px;
  }
}
</style>
