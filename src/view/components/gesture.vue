<template>
  <div>
    <div style="display:flex;justify-content:space-between;align-items:Center;">
      <img v-if="value!='WheelSwitchUp' && value!='WheelSwitchDown'" :src="src" style="margin: 5px;width: 48px;height: 48px" />
      <span style="float:right;align-items:flex-end;color:#ccc">{{value}}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const props = defineProps<{
  value: string
}>()

const store = useStore()

const gestures = computed(() => store.getters.gestures)

const src = computed(() => {
  return gestures.value[props.value] ? gestures.value[props.value] : gestures.value['placeholder']
})
</script>
