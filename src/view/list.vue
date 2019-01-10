<template>
  <div>
    {{settings.Gestures}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'list',
  computed: {
    ...mapGetters([
      'settings'
    ])
  }
}
</script>
