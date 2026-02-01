<template>
  <div class="header-bar">
    <sider-trigger :collapsed="collapsed" @on-change="handleCollpasedChange" />
    <custom-bread-crumb show-icon style="margin-left: 20px" :list="breadCrumbList" />
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import siderTrigger from './sider-trigger'
import customBreadCrumb from './custom-bread-crumb'
import './header-bar.less'

export default {
  name: 'HeaderBar',
  components: {
    siderTrigger,
    customBreadCrumb
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['breadCrumbList'])
  },
  methods: {
    handleCollpasedChange (state) {
      this.$emit('on-coll-change', state)
    }
  }
}
</script>
