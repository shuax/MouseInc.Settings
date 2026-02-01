<template>
  <div class="gesture-list-page fade-in">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h2>{{ $t('gesture_list') }}</h2>
        <p>{{ $t('gesture_list_desc') }}</p>
      </div>
    </div>

    <!-- Tips Alert -->
    <el-alert type="info" :closable="false" class="modern-alert" show-icon>
      <template #title>
        <div class="alert-content">
          <span>{{ $t('list_tips1') }}</span>
          <router-link to="settings">
            <el-link type="primary">{{ $t('list_tips2') }}</el-link>
          </router-link>
          <span>{{ $t('list_tips3') }}</span>
        </div>
      </template>
    </el-alert>

    <!-- Gesture Grid -->
    <div class="gesture-grid" v-if="cfg.Gestures && cfg.Gestures.length > 0">
      <div
        v-for="(info, i) in cfg.Gestures"
        :key="`gesture-${i}`"
        class="gesture-card"
        :class="{ 'is-dragging': draggingIndex === i }"
        @mouseenter="hoverIndex = i"
        @mouseleave="hoverIndex = -1"
      >
        <div class="card-visual">
          <div class="gesture-preview">
            <el-image :src="imgsrc(info)" fit="contain" class="gesture-image" />
          </div>
        </div>

        <div class="card-content">
          <el-input
            v-model="info.Sign"
            size="small"
            @change="(val) => change(info, val)"
            class="pattern-input"
          />
        </div>

        <div class="card-actions" :class="{ visible: hoverIndex === i }">
          <el-button
            type="danger"
            :icon="Delete"
            circle
            size="small"
            @click="confirmDelete(info)"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <h3>{{ $t('no_gestures') }}</h3>
      <p>{{ $t('no_gestures_desc') }}</p>
      <el-button type="primary" @click="$router.push('settings')">
        {{ $t('enable_gesture') }}
      </el-button>
    </div>

    <!-- Delete Confirmation Dialog -->
    <el-dialog
      v-model="deleteDialog.visible"
      width="400px"
      align-center
      :show-close="false"
      class="modern-dialog"
    >
      <template #header>
        <div class="dialog-header-danger">
          <span>{{ $t('confirm_delete') }}</span>
        </div>
      </template>

      <div class="dialog-body">
        <p class="delete-text">
          {{ $t('delete_gesture_confirm', { pattern: deleteDialog.pattern }) }}
        </p>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteDialog.visible = false">
            {{ $t('cancel') }}
          </el-button>
          <el-button type="danger" @click="executeDelete">
            {{ $t('delete') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Delete } from '@element-plus/icons-vue'

export default {
  name: 'GestureList',
  setup () {
    return {
      Delete
    }
  },
  data () {
    return {
      hoverIndex: -1,
      draggingIndex: -1,
      deleteDialog: {
        visible: false,
        info: null,
        pattern: ''
      }
    }
  },
  computed: {
    ...mapGetters(['cfg', 'gestures'])
  },
  methods: {
    imgsrc (info) {
      return this.gestures[info.Sign] ? this.gestures[info.Sign] : this.gestures['placeholder']
    },
    change (info, value) {
      this.gestures[value] = this.gestures[info.Sign]
      delete this.gestures[info.Sign]
      info.Sign = value
    },
    confirmDelete (info) {
      this.deleteDialog.info = info
      this.deleteDialog.pattern = info.Sign
      this.deleteDialog.visible = true
    },
    executeDelete () {
      const info = this.deleteDialog.info
      delete this.gestures[info.Sign]
      this.cfg.Gestures.splice(this.cfg.Gestures.findIndex(item => item.Sign === info.Sign), 1)
      this.deleteDialog.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.gesture-list-page {
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
  margin-bottom: 24px;
  border-radius: 12px;
  border: 1px solid rgba(88, 166, 255, 0.2);
  background: rgba(88, 166, 255, 0.08);

  .alert-content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;

    span {
      color: var(--text-primary);
    }

    .el-link {
      font-weight: 500;
    }
  }
}

// Gesture Grid
.gesture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

// Gesture Card
.gesture-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px;
  transition: all 0.3s ease;
  cursor: default;

  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(102, 126, 234, 0.2);
    transform: translateY(-4px);

    .card-number {
      color: var(--primary-color);
      background: rgba(102, 126, 234, 0.15);
    }
  }

  &.is-dragging {
    opacity: 0.5;
    transform: scale(0.95);
  }
}

.card-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
}

.gesture-preview {
  width: 80px;
  height: 80px;
  background: var(--bg-tertiary);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);

  .gesture-image {
    width: 56px;
    height: 56px;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  }
}

  .card-actions {
    position: absolute;
    top: 12px;
    right: 16px;
    opacity: 0;
    transition: opacity 0.2s ease;

    &.visible {
      opacity: 1;
    }

    .el-button {
      background: rgba(248, 81, 73, 0.1);
      border: 1px solid rgba(248, 81, 73, 0.3);
      color: var(--accent-red);

      &:hover {
        background: var(--accent-red);
        color: white;
        border-color: var(--accent-red);
      }
    }
  }

  // Empty State
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);

  h3 {
    margin: 0 0 8px;
    font-size: 18px;
    color: var(--text-primary);
  }

  p {
    margin: 0 0 24px;
    font-size: 14px;
    color: var(--text-secondary);
  }
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

.dialog-header-danger {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--accent-red);
  font-size: 18px;
  font-weight: 600;
}

.dialog-body {
  .delete-text {
    font-size: 14px;
    color: var(--text-primary);
    margin: 0;
    text-align: center;

    strong {
      color: var(--accent-orange);
      font-family: 'Courier New', monospace;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

// Responsive
@media (max-width: 768px) {
  .gesture-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }

  .gesture-card {
    padding: 16px;
  }

  .gesture-preview {
    width: 60px;
    height: 60px;

    .gesture-image {
      width: 44px;
      height: 44px;
    }
  }
}
</style>
