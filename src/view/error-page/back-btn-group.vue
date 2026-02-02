<template>
  <div>
    <Button size="large" type="text" @click="backHome">返回首页</Button>
    <Button size="large" type="text" @click="backPrev">返回上一页({{ second }}s)</Button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import config from '@/config'
import './error.less'

const router = useRouter()
const second = ref(5)
let timer: ReturnType<typeof setInterval> | null = null

const backHome = () => {
  router.replace({
    name: config.homeName
  })
}

const backPrev = () => {
  router.go(-1)
}

onMounted(() => {
  timer = setInterval(() => {
    if (second.value === 0) backPrev()
    else second.value--
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>
