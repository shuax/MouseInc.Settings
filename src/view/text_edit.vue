<template>
  <div>
    <div @click="editing=true">{{value}}</div>
    <Modal v-model="editing" @on-cancel="oncancel">
        <p slot="header" style="text-align:center">
            <span>编辑</span>
        </p>
        <div>
          <Input v-model="content" type="textarea" :rows="linecount" />
        </div>
        <div slot="footer">
            <Button type="primary" size="large" long @click="save">保存</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'text_edit',
  data () {
    return {
      editing: false,
      content: this.value,
      linecount: this.value.split(/\r\n|\r|\n/).length
    }
  },
  props: {
    value: String
  },
  methods: {
    save (val) {
      this.editing = false
      this.$emit('input', this.content)
    },
    oncancel () {
      this.content = this.value
    }
  }
}
</script>
