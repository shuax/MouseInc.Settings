<template>
  <div class="exclude-page fade-in">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h2>{{ $t('exclude') }}</h2>
        <p>{{ $t('exclude_tips3') }}</p>
      </div>
    </div>

    <!-- Info Alerts -->
    <div class="alerts-section">
      <el-alert :title="$t('exclude_tips1')" type="info" :closable="false" show-icon class="modern-alert" />
      <el-alert :title="$t('exclude_tips2')" type="warning" :closable="false" show-icon class="modern-alert warning" />
    </div>

    <!-- Main Card -->
    <div class="content-card">
      <div class="card-header-custom">
        <div class="header-left">
          <span>{{ $t('exclude_tips3') }}</span>
        </div>
        <el-tag type="info" effect="dark" size="small">{{ (cfg.Excludes || []).length }} {{ $t('items') }}</el-tag>
      </div>

      <!-- Empty State -->
      <div v-if="!(cfg.Excludes && cfg.Excludes.length)" class="empty-state">
        <p>{{ $t('no_data') }}</p>
      </div>

      <!-- Exclude List -->
      <div v-else class="exclude-list">
        <div
          v-for="(exclude, index) in cfg.Excludes"
          :key="exclude"
          class="exclude-item"
        >
          <div class="item-content">
            <span class="item-text">{{ exclude }}</span>
          </div>
          <el-button
            type="danger"
            :icon="Delete"
            circle
            size="small"
            class="delete-btn"
            @click="remove(index)"
          />
        </div>
      </div>

      <!-- Add Section -->
      <div class="add-section">
        <div class="add-input-wrapper">
          <el-input
            v-model="value"
            :placeholder="$t('placeholder_exclude') || 'Photoshop.exe'"
            @keyup.enter="add"
            clearable
            class="add-input"
          />
        </div>
        <el-button type="primary" :icon="Plus" @click="add" class="add-btn">
          {{ $t('add') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'

export default {
  name: 'exclude',
  setup () {
    return {
      Plus,
      Delete
    }
  },
  data () {
    return {
      value: ''
    }
  },
  computed: {
    ...mapGetters([
      'cfg'
    ])
  },
  methods: {
    remove (index) {
      if (this.cfg.Excludes) {
        this.cfg.Excludes.splice(index, 1)
      }
    },
    add () {
      if (this.value.indexOf('.') === -1) {
        ElMessage.error(this.$t('exclude_warning'))
        return
      }
      if (!this.cfg.Excludes) {
        this.cfg.Excludes = []
      }
      this.cfg.Excludes.push(this.value)
      this.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.exclude-page {
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

// Alerts Section
.alerts-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.modern-alert {
  border-radius: 10px;
  border: 1px solid rgba(88, 166, 255, 0.2);
  background: rgba(88, 166, 255, 0.08);

  &.warning {
    border-color: rgba(248, 81, 73, 0.2);
    background: rgba(248, 81, 73, 0.08);
  }

  :deep(.el-alert__content) {
    color: var(--text-primary);
  }
}

// Content Card
.content-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.card-header-custom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    color: var(--text-primary);
  }
}

// Empty State
.empty-state {
  padding: 60px 20px;
  text-align: center;

  p {
    color: var(--text-secondary);
    margin: 0;
    font-size: 14px;
  }
}

// Exclude List
.exclude-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
}

.exclude-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  transition: all 0.25s ease;

  &:hover {
    border-color: var(--border-light);
    transform: translateX(4px);
  }

  .item-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .item-text {
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

// Add Section
.add-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: var(--bg-tertiary);
  border-top: 1px solid var(--border-color);
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

.add-btn {
  background: var(--primary-gradient);
  border: none;
  font-weight: 500;

  &:hover {
    box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
    transform: translateY(-1px);
  }
}

// Responsive
@media (max-width: 768px) {
  .add-section {
    flex-direction: column;
    align-items: stretch;
  }

  .add-btn {
    width: 100%;
  }
}
</style>
