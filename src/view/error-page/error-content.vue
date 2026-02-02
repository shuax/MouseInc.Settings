<template>
  <div class="error-page">
    <div class="content-con">
      <img :src="src" :alt="code">
      <div class="text-con">
        <h4>{{ code }}</h4>
        <h5>{{ desc }}</h5>
      </div>
      <back-btn-group class="back-btn-group"></back-btn-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import './error.less'
import backBtnGroup from './back-btn-group.vue'

defineProps({
  code: String,
  desc: String,
  src: String
})
</script>
