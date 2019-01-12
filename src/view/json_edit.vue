<template>
  <div>
    <div @click="OpenEdit">{{value}}</div>
  </div>
</template>
<script>
export default {
  name: 'json_edit',
  data () {
    return {
      editing: false,
      content: JSON.stringify(this.value, null, 4)
    }
  },
  props: {
    value: Array
  },
  methods: {
    OpenEdit () {
      let instance = this.$Modal.newInstance({
        closable: false,
        maskClosable: false,
        footerHide: true,
        render: (h) => {
          return h('Input', {
            props: {
              type: 'textarea',
              autosize: true,
              value: this.content
            },
            on: {
              input: (val) => {
                this.content = val
              }
            }
          })
        }
      })
      let options = {
        title: '编辑JSON',
        icon: 'info',
        showCancel: true,
        onRemove: () => {
          instance = null
        },
        onOk: () => {
          try {
            let val = JSON.parse(this.content)
            this.$emit('input', val)
          } catch (e) {
            this.content = JSON.stringify(this.value, null, 4)
            this.$Message.error({
              content: e.message,
              duration: 30,
              closable: true
            })
          }
        },
        onCancel: () => {
          this.content = JSON.stringify(this.value, null, 4)
        }
      }
      instance.show(options)
    }
  }
}
</script>
