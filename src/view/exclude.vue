<template>
  <div>
    <!-- {{proxy.MouseGesture.Open}} -->
    <p>在这里填入程序名称，例如：<code>Photoshop.exe</code></p>
    <p v-for="exclude in settings.Excludes" :key="exclude">{{exclude}}</p>
    {{settings.Excludes}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'exclude',
  computed: {
    ...mapGetters([
      'settings'
    ])
  }
}
</script>
