<template>
  <el-sub-menu :index="parentName">
    <template #title>
      <el-icon v-if="parentItem.meta?.icon">
        <component :is="getIcon(parentItem.meta?.icon)" />
      </el-icon>
      <span>{{ getTitle(parentItem) }}</span>
    </template>
    <template v-for="item in children" :key="`menu-${item.name}`">
      <template v-if="item.children && item.children.length === 1">
        <side-menu-item
          v-if="showChildren(item)"
          :parent-item="item"
          :collapsed="collapsed"
          @on-select="handleSelect"
        />
        <el-menu-item v-else :index="getNameOrHref(item, true)">
          <el-icon v-if="item.children[0].meta?.icon">
            <component :is="getIcon(item.children[0].meta?.icon)" />
          </el-icon>
          <template #title>
            <span>{{ getTitle(item.children[0]) }}</span>
          </template>
        </el-menu-item>
      </template>
      <template v-else>
        <side-menu-item
          v-if="showChildren(item)"
          :parent-item="item"
          :collapsed="collapsed"
          @on-select="handleSelect"
        />
        <el-menu-item v-else :index="getNameOrHref(item)">
          <el-icon v-if="item.meta?.icon">
            <component :is="getIcon(item.meta?.icon)" />
          </el-icon>
          <template #title>
            <span>{{ getTitle(item) }}</span>
          </template>
        </el-menu-item>
      </template>
    </template>
  </el-sub-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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
import { showTitle } from '@/libs/util'
import type { MenuItem, RouteMeta } from '@/types'

const props = defineProps({
  parentItem: {
    type: Object as () => MenuItem,
    default: () => ({} as MenuItem)
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['on-select'])

const { t } = useI18n()

const parentName = computed(() => {
  return props.parentItem.name || ''
})

const children = computed(() => {
  return props.parentItem.children || []
})

const showChildren = (item: MenuItem): boolean => {
  return !!(item.children && (item.children.length > 1 || (item.meta && (item.meta as RouteMeta).showAlways)))
}

const getNameOrHref = (item: MenuItem, children0?: boolean): string => {
  return item.href ? `isTurnByHref_${item.href}` : (children0 && item.children ? item.children[0].name : item.name)
}

// 图标映射表
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

const getIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || null
}

const handleSelect = (name: string) => {
  emit('on-select', name)
}

const getTitle = (item: MenuItem) => {
  return showTitle(item, { $t: t })
}
</script>
