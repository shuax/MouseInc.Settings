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
      <span class="menu-title" v-if="!hideTitle">{{ showTitle(parentItem) }}</span>
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
            <span class="menu-title">{{ showTitle(child) }}</span>
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowRight } from '@element-plus/icons-vue'
import { showTitle } from '@/libs/util'
import { getIconByName } from './icons'

const props = defineProps({
  parentItem: {
    type: Object,
    default: () => ({})
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

const showChildren = (item) => {
  return item.children && (item.children.length > 1 || (item.meta && item.meta.showAlways))
}

const getIcon = (iconName) => {
  return getIconByName(iconName)
}

const handleClick = (name) => {
  emit('on-click', name)
}

const handleMouseenter = (event, children) => {
  const { clientY } = event
  const height = children.length * 38
  const isOverflow = clientY + height < window.innerHeight
  placement.value = isOverflow ? 'right-start' : 'right-end'
}

const getTitle = (item) => {
  return showTitle(item, { $t: t })
}

import { computed } from 'vue'
</script>
