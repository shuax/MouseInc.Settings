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

<script setup>
import { useI18n } from 'vue-i18n'
import { showTitle as utilShowTitle } from '@/libs/util'
import './custom-bread-crumb.less'

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  fontSize: {
    type: Number,
    default: 14
  }
})

const { t } = useI18n()

const getIconComponent = (iconName) => {
  // 直接使用传入的图标名，默认为 HomeFilled
  return iconName || 'HomeFilled'
}

const showTitle = (item) => {
  return utilShowTitle(item, { $t: t })
}
</script>

<style scoped>
:deep(.el-breadcrumb__item) {
  display: inline-flex;
  align-items: center;
}
</style>
