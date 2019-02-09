<template>
  <div>
    <div @click="OpenEdit">{{value}}</div>
  </div>
</template>
<script>
import jsBeautify from 'js-beautify/js/lib/beautify'
function stringify (data) {
  return jsBeautify.js_beautify(JSON.stringify(data), {
    indent_size: 4,
    indent_with_tabs: true,
    eol: '\r\n'
  })
}
// import 'codemirror/theme/monokai.css'
export default {
  name: 'json_edit',
  data () {
    return {
      content: stringify(this.value),
      option: {
        lineNumbers: true,
        lineWrapping: true,
        styleActiveLine: true,
        tabSize: 4,
        indentUnit: 4,
        indentWithTabs: true,
        // line: true,
        mode: {
          name: 'javascript',
          json: true
        }
        // keyMap: 'sublime',
        // theme: 'default'
      }
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
          return h('codemirror', {
            // style: {
            //   width: '550px'
            // },
            props: {
              options: this.option,
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
        width: '600',
        showCancel: true,
        onRemove: () => {
          instance = null
        },
        onOk: () => {
          try {
            let val = JSON.parse(this.content)
            this.$emit('input', val)
          } catch (e) {
            this.content = stringify(this.value)
            this.$Message.error({
              content: e.message,
              duration: 30,
              closable: true
            })
          }
        },
        onCancel: () => {
          this.content = stringify(this.value)
        }
      }
      instance.show(options)
    }
  }
}
</script>
<style>
.cm-tab {
   background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAMCAYAAAAkuj5RAAAAAXNSR0IArs4c6QAAAGFJREFUSMft1LsRQFAQheHPowAKoACx3IgEKtaEHujDjORSgWTH/ZOdnZOcM/sgk/kFFWY0qV8foQwS4MKBCS3qR6ixBJvElOobYAtivseIE120FaowJPN75GMu8j/LfMwNjh4HUpwg4LUAAAAASUVORK5CYII=);
   background-position: right;
   background-repeat: no-repeat;
   opacity: .6;
}
</style>
