<template>
  <div class="gesture-list-page fade-in">
    <!-- Tips Alert -->
    <div class="alerts-section">
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
    </div>

    <!-- Gesture Grid -->
    <div class="gesture-grid" v-if="cfg.Gestures && cfg.Gestures.length > 0">
      <div
        v-for="(info, i) in cfg.Gestures"
        :key="info.Sign"
        class="gesture-card"
        :class="{ 'is-dragging': draggingIndex === i }"
        @mouseenter="hoverIndex = i"
        @mouseleave="hoverIndex = -1"
      >
        <div class="card-visual">
          <div class="gesture-preview">
            <el-image :src="imgsrc(info)" fit="contain" class="gesture-image" lazy />
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

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { Delete } from '@element-plus/icons-vue'
import type { Config } from '@/types/index.ts'

interface GestureInfo {
  Sign: string
  [key: string]: unknown
}

interface DeleteDialog {
  visible: boolean
  info: GestureInfo | null
  pattern: string
}

const store = useStore()
const cfg = computed<Config>(() => store.getters.cfg)
const gestures = computed<Record<string, string>>(() => store.getters.gestures)

const hoverIndex = ref(-1)
const draggingIndex = ref(-1)
const deleteDialog = ref<DeleteDialog>({
  visible: false,
  info: null,
  pattern: ''
})

function imgsrc (info: GestureInfo): string {
  return gestures.value[info.Sign] ? gestures.value[info.Sign] : gestures.value['placeholder']
}

function change (info: GestureInfo, value: string) {
  gestures.value[value] = gestures.value[info.Sign]
  delete gestures.value[info.Sign]
  info.Sign = value
}

function confirmDelete (info: GestureInfo) {
  deleteDialog.value.info = info
  deleteDialog.value.pattern = info.Sign
  deleteDialog.value.visible = true
}

function executeDelete () {
  const info = deleteDialog.value.info
  if (info) {
    delete gestures.value[info.Sign]
    const index = cfg.value.Gestures?.findIndex((item: unknown) => (item as GestureInfo).Sign === info.Sign)
    if (index !== undefined && index !== -1) {
      cfg.value.Gestures?.splice(index, 1)
    }
    deleteDialog.value.visible = false
  }
}
</script>

<style lang="less" scoped>
.gesture-list-page {
  &:extend(.page-container);
}

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
</style>
