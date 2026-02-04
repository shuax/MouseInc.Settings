<template>
  <el-dropdown
    :class="hideTitle ? '' : 'collased-menu-dropdown'"
    :placement="placement"
    trigger="hover"
    @command="handleClick"
  >
    <a
      class="drop-menu-a"
      type="text"
      @mouseenter="handleMouseenter($event, children)"
      :style="{ textAlign: !hideTitle ? 'left' : '' }"
    >
      <el-icon :size="rootIconSize" :color="textColor">
        <component :is="getIcon(parentItem.icon)" />
      </el-icon>
      <span class="menu-title" v-if="!hideTitle">{{ getTitle(parentItem) }}</span>
      <el-icon style="float: right; margin-top: 2px" v-if="!hideTitle" :size="16">
        <ArrowRight />
      </el-icon>
    </a>
    <template #dropdown>
      <el-dropdown-menu>
        <template v-for="child in children" :key="`drop-${child.name}`">
          <collapsed-menu
            v-if="showChildren(child)"
            :icon-size="iconSize"
            :parent-item="child"
            @on-click="handleClick"
          />
          <el-dropdown-item v-else :command="child.name">
            <el-icon v-if="child.icon" :size="iconSize" style="margin-right: 5px">
              <component :is="getIcon(child.icon)" />
            </el-icon>
            <span class="menu-title">{{ getTitle(child) }}</span>
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ArrowRight,
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
  theme: {
    type: String,
    default: 'light'
  },
  iconSize: {
    type: Number,
    default: 16
  },
  rootIconSize: {
    type: Number,
    default: 20
  },
  hideTitle: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['on-click'])

const { t } = useI18n()
const placement = ref('right-end')

const children = computed(() => {
  return props.parentItem.children || []
})

const textColor = computed(() => {
  return props.theme === 'dark' ? '#b4b8bc' : '#515a6e'
})

const showChildren = (item: MenuItem): boolean => {
  return !!(item.children && (item.children.length > 1 || (item.meta && (item.meta as RouteMeta).showAlways)))
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

const handleClick = (name: string) => {
  emit('on-click', name)
}

const handleMouseenter = (event: MouseEvent, children: MenuItem[]) => {
  const { clientY } = event
  const height = children.length * 38
  const isOverflow = clientY + height < window.innerHeight
  placement.value = isOverflow ? 'right-start' : 'right-end'
}

const getTitle = (item: MenuItem) => {
  return showTitle(item, { $t: t })
}
</script>
