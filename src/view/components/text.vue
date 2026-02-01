<template>
  <div>
    <div @click="OpenEdit" style="cursor: pointer;">{{value}} <el-icon><Edit /></el-icon></div>
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
<script>
import { Edit } from '@element-plus/icons-vue'
export default {
  name: 'text_edit',
  components: {
    Edit
  },
  data () {
    return {
      content: this.value,
      dialogVisible: false
    }
  },
  props: {
    value: String
  },
  watch: {
    value (newVal) {
      this.content = newVal
    }
  },
  methods: {
    OpenEdit () {
      this.content = this.value
      this.dialogVisible = true
    },
    onOk () {
      this.$emit('on-input', this.content)
      this.dialogVisible = false
    },
    onCancel () {
      this.content = this.value
      this.dialogVisible = false
    }
  }
}
</script>
