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
            <el-icon v-if="item.children[0].icon" :size="iconSize">
              <component :is="getIcon(item.children[0].icon)" />
            </el-icon>
            <template #title>
              <span>{{ showTitle(item.children[0]) }}</span>
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
            <el-icon v-if="item.icon" :size="iconSize">
              <component :is="getIcon(item.icon)" />
            </el-icon>
            <template #title>
              <span>{{ showTitle(item) }}</span>
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getUnion } from '@/libs/tools'
import { showTitle, hasChild } from '@/libs/util'
import config from '@/config'
import SideMenuItem from './side-menu-item.vue'
import { getIconByName } from './icons'
import './side-menu.less'

const props = defineProps({
  menuList: {
    type: Array,
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
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['on-select'])

const route = useRoute()
const { t } = useI18n()
const menuRef = ref(null)
const openedNames = ref([])

const textColor = computed(() => {
  return props.theme === 'dark' ? '#b4b8bc' : '#515a6e'
})

const showChildren = (item) => {
  return item.children && (item.children.length > 1 || (item.meta && item.meta.showAlways))
}

const getNameOrHref = (item, children0) => {
  return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name)
}

const getIcon = (iconName) => {
  return getIconByName(iconName)
}

const handleSelect = (name) => {
  emit('on-select', name)
}

const getOpenedNamesByActiveName = (name) => {
  return route.matched.map(item => item.name).filter(item => item !== name)
}

const updateOpenName = (name) => {
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
  (name) => {
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
  (newNames) => {
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
