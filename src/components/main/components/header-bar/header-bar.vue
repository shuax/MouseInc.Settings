<template>
  <div class="header-bar">
    <sider-trigger :collapsed="collapsed" @on-change="handleCollpasedChange" />
    <custom-bread-crumb show-icon style="margin-left: 20px" :list="breadCrumbList" />
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import siderTrigger from './sider-trigger'
import customBreadCrumb from './custom-bread-crumb'
import type { MenuItem } from '@/types'
import './header-bar.less'

defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['on-coll-change'])

const store = useStore()

const breadCrumbList = computed<MenuItem[]>(() => store.getters.breadCrumbList)

const handleCollpasedChange = (state: boolean) => {
  emit('on-coll-change', state)
}
</script>
