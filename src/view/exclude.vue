<template>
  <div class="exclude-page fade-in">
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

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'

const store = useStore()
const { t } = useI18n()
const value = ref('')

const cfg = computed(() => store.getters.cfg)

const remove = (index: number) => {
  if (cfg.value.Excludes) {
    cfg.value.Excludes.splice(index, 1)
  }
}

const add = () => {
  if (value.value.indexOf('.') === -1) {
    ElMessage.error(t('exclude_warning'))
    return
  }
  if (!cfg.value.Excludes) {
    cfg.value.Excludes = []
  }
  cfg.value.Excludes.push(value.value)
  value.value = ''
}
</script>

<style lang="less" scoped>
.exclude-page {
  &:extend(.page-container);
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
</style>
