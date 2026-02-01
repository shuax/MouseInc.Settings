<template>
  <el-sub-menu :index="parentName">
    <template #title>
      <el-icon v-if="parentItem.icon">
        <component :is="getIcon(parentItem.icon)" />
      </el-icon>
      <span>{{ showTitle(parentItem) }}</span>
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
          <el-icon v-if="item.children[0].icon">
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
          <el-icon v-if="item.icon">
            <component :is="getIcon(item.icon)" />
          </el-icon>
          <template #title>
            <span>{{ showTitle(item) }}</span>
          </template>
        </el-menu-item>
      </template>
    </template>
  </el-sub-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { showTitle } from '@/libs/util'
import { getIconByName } from './icons'

const props = defineProps({
  parentItem: {
    type: Object,
    default: () => ({})
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

const getTitle = (item) => {
  return showTitle(item, { $t: t })
}
</script>
