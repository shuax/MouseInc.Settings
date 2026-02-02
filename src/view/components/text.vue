<template>
  <div>
    <div @click="openEdit" style="cursor: pointer;">{{value}} <el-icon><Edit /></el-icon></div>
    <el-dialog v-model="dialogVisible" title="编辑文字" width="400px">
      <el-input v-model="content" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">{{$t('cancel')}}</el-button>
          <el-button type="primary" @click="onOk">{{$t('ok')}}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { Edit } from '@element-plus/icons-vue'

const props = defineProps<{
  value: string
}>()

const emit = defineEmits<{
  (e: 'on-input', value: string): void
}>()

const content = ref(props.value)
const dialogVisible = ref(false)

watch(() => props.value, (newVal) => {
  content.value = newVal
})

const openEdit = () => {
  content.value = props.value
  dialogVisible.value = true
}

const onOk = () => {
  emit('on-input', content.value)
  dialogVisible.value = false
}

const onCancel = () => {
  content.value = props.value
  dialogVisible.value = false
}
</script>
