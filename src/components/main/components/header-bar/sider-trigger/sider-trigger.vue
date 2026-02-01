<template>
  <a
    @click="handleChange"
    type="text"
    :class="['sider-trigger-a', collapsed ? 'collapsed' : '']"
  >
    <el-icon :size="size">
      <Fold v-if="!collapsed" />
      <Expand v-else />
    </el-icon>
  </a>
</template>

<script setup>
import { Fold, Expand } from '@element-plus/icons-vue'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  },
  size: {
    type: Number,
    default: 26
  }
})

const emit = defineEmits(['on-change'])

const handleChange = () => {
  emit('on-change', !props.collapsed)
}
</script>

<style lang="less">
@import './sider-trigger.less';
</style>
