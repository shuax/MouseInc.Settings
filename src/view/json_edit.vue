<template>
  <div>
    <div @click="editing=true">{{value}}</div>
      <Modal v-model="editing" @on-cancel="oncancel">
          <p slot="header" style="text-align:center">
              <span>修改操作</span>
          </p>
          <div>
            <Input v-model="content" type="textarea" :rows="linecount" @on-change="onchange" />
            {{error_msg}}
          </div>
          <div slot="footer">
              <Button type="success" size="large" long @click="save" :disabled="error">保存</Button>
          </div>
      </Modal>
  </div>
</template>
<script>
export default {
  name: 'json_edit',
  data () {
    return {
      editing: false,
      error: false,
      error_msg: '',
      content: JSON.stringify(this.value, null, 4),
      linecount: JSON.stringify(this.value, null, 4).split(/\r\n|\r|\n/).length
    }
  },
  computed: {
  },
  props: {
    value: Array
  },
  methods: {
    save (val) {
      this.editing = false
      this.$emit('input', JSON.parse(this.content))
    },
    oncancel () {
      this.error = false
      this.error_msg = ''
      this.content = JSON.stringify(this.value, null, 4)
    },
    onchange () {
      try {
        JSON.parse(this.content)
        this.error = false
        this.error_msg = ''
      } catch (e) {
        this.error_msg = e.message
        this.error = true
      }
    }
  }
}
</script>
