<template>
  <div>
    <div @click="OpenEdit">{{value}} <Icon type="md-create" /></div>
  </div>
</template>
<script>
export default {
  name: 'text_edit',
  data () {
    return {
      content: this.value
    }
  },
  props: {
    value: String
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
        title: '编辑文字',
        icon: 'info',
        showCancel: true,
        onRemove: () => {
          instance = null
        },
        onOk: () => {
          this.$emit('on-input', this.content)
        },
        onCancel: () => {
          this.content = this.value
        }
      }
      instance.show(options)
    }
  }
}
</script>
