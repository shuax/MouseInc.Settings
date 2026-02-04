<template>
  <div class="custom-bread-crumb">
    <el-breadcrumb :style="{ fontSize: `${fontSize}px` }">
      <el-breadcrumb-item
        v-for="item in list"
        :key="`bread-crumb-${item.name}`"
        :to="item.to"
      >
        <el-icon v-if="item.meta && item.meta.icon" style="margin-right: 4px; vertical-align: middle">
          <component :is="getIconComponent(item.meta.icon)" />
        </el-icon>
        <span style="vertical-align: middle">{{ showTitle(item) }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { showTitle as utilShowTitle } from '@/libs/util'
import type { MenuItem } from '@/types'
import {
  HomeFilled,
  Lightning,
  WarningFilled,
  Setting,
  Brush,
  Grid,
  Box,
  EditPen,
  Opportunity,
  Operation,
  Monitor,
  FullScreen,
  Link,
  Key,
  View,
  Microphone
} from '@element-plus/icons-vue'
import './custom-bread-crumb.less'

defineProps({
  list: {
    type: Array as () => MenuItem[],
    default: () => []
  },
  fontSize: {
    type: Number,
    default: 14
  }
})

const { t } = useI18n()

// 图标映射表（与侧边栏保持一致）
const iconMap = {
  HomeFilled,
  Lightning,
  WarningFilled,
  Setting,
  Brush,
  Grid,
  Box,
  EditPen,
  Opportunity,
  Operation,
  Monitor,
  FullScreen,
  Link,
  Key,
  View,
  Microphone
}

const getIconComponent = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || HomeFilled
}

const showTitle = (item: MenuItem) => {
  return utilShowTitle(item, { $t: t })
}
</script>

<style scoped>
:deep(.el-breadcrumb__item) {
  display: inline-flex;
  align-items: center;
}
</style>
