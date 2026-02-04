<template>
  <div class="gesture-select">
    <el-select
      :model-value="modelValue"
      :filterable="true"
      class="full-width"
      @change="onchange"
    >
      <el-option
        v-for="(gesture, index) in validGestures"
        :key="index"
        :value="index"
        :label="index"
      >
        <div class="option-container">
          <div class="gesture-preview" v-if="index !== 'WheelSwitchUp' && index !== 'WheelSwitchDown'">
            <img :src="gesture" class="gesture-img" />
          </div>
          <span class="gesture-name">{{ index }}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (_e: 'update:modelValue', _value: string): void
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
  emit('update:modelValue', val)
}
</script>

<style lang="less" scoped>
.gesture-select {
  width: 100%;
}

.option-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  height: 100%;
}

.gesture-preview {
  display: flex;
  align-items: center;
  
  .gesture-img {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }
}

.gesture-name {
  color: var(--text-secondary);
  font-family: monospace;
  font-size: 13px;
}

.full-width {
  width: 100%;
}
</style>
