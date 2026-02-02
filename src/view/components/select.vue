<template>
  <div>
    <el-select :value="value" :filterable="true" style="width:200px" @change='onchange'>
      <el-option v-for="(gesture,index) in validGestures" :key="index" :value="index" :label="index">

        <div style="display:flex;justify-content:space-between;align-items:Center;">
          <span v-if="index!='WheelSwitchUp' && index!='WheelSwitchDown'" ><img :src="gesture" style="marginTop: 2px;width: 32px;height: 32px" /></span>
          <span style="float:right;align-items:flex-end;color:#ccc">{{index}}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const props = defineProps<{
  value: string
}>()

const emit = defineEmits<{
  (e: 'input', value: string): void
}>()

const store = useStore()

const gestures = computed(() => store.getters.gestures)

const validGestures = computed(() => {
  const result: Record<string, string> = {}
  for (const k in gestures.value) {
    if (k !== 'placeholder') {
      result[k] = gestures.value[k]
    }
  }
  return result
})

const onchange = (val: string) => {
  emit('input', val)
}
</script>
