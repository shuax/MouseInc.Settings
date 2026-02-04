<template>
  <div class="side-menu-wrapper">
    <slot></slot>
    <el-menu
      ref="menuRef"
      :default-active="activeName"
      :default-openeds="openedNames"
      :collapse="collapsed"
      :collapse-transition="true"
      :unique-opened="accordion"
      :background-color="theme === 'dark' ? '#191a23' : '#fff'"
      :text-color="textColor"
      :active-text-color="theme === 'dark' ? '#2d8cf0' : '#2d8cf0'"
      style="width: 100%; border-right: none"
      @select="handleSelect"
    >
      <template v-for="item in menuList" :key="`menu-${item.name}`">
        <template v-if="item.children && item.children.length === 1">
          <side-menu-item
            v-if="showChildren(item)"
            :parent-item="item"
            :collapsed="collapsed"
            @on-select="handleSelect"
          />
          <el-menu-item v-else :index="getNameOrHref(item, true)">
            <el-icon v-if="item.children[0].meta?.icon" :size="iconSize">
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
            <el-icon v-if="item.meta?.icon" :size="iconSize">
              <component :is="getIcon(item.meta?.icon)" />
            </el-icon>
            <template #title>
              <span>{{ getTitle(item) }}</span>
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
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
import { getUnion } from '@/libs/tools'
import { showTitle } from '@/libs/util'
import config from '@/config'
import SideMenuItem from './side-menu-item.vue'
import type { MenuItem, RouteMeta } from '@/types'
import './side-menu.less'

const props = defineProps({
  menuList: {
    type: Array as () => MenuItem[],
    default: () => []
  },
  collapsed: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    default: 'light'
  },
  rootIconSize: {
    type: Number,
    default: 20
  },
  iconSize: {
    type: Number,
    default: 16
  },
  accordion: {
    type: Boolean,
    default: false
  },
  activeName: {
    type: String,
    default: ''
  },
  openNames: {
    type: Array as () => string[],
    default: () => []
  }
})

const emit = defineEmits(['on-select'])

const route = useRoute()
const { t } = useI18n()
const menuRef = ref<HTMLElement | null>(null)
const openedNames = ref<string[]>([])

const textColor = computed(() => {
  return props.theme === 'dark' ? '#b4b8bc' : '#515a6e'
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

const getTitle = (item: MenuItem) => {
  return showTitle(item, { $t: t })
}

const handleSelect = (name: string) => {
  emit('on-select', name)
}

const getOpenedNamesByActiveName = (name: string): string[] => {
  return route.matched.map(item => item.name as string).filter(item => item !== name)
}

const updateOpenName = (name: string) => {
  if (name === config.homeName) {
    openedNames.value = []
  } else {
    openedNames.value = getOpenedNamesByActiveName(name)
  }
}

// 暴露方法给父组件
defineExpose({
  updateOpenName
})

watch(
  () => props.activeName,
  (name: string) => {
    if (props.accordion) {
      openedNames.value = getOpenedNamesByActiveName(name)
    } else {
      openedNames.value = getUnion(openedNames.value, getOpenedNamesByActiveName(name))
    }
  },
  { immediate: true }
)

watch(
  () => props.openNames,
  (newNames: string[]) => {
    openedNames.value = newNames
  }
)

watch(
  openedNames,
  () => {
    nextTick(() => {
      // Element Plus el-menu 会自动处理展开状态
    })
  }
)
</script>
