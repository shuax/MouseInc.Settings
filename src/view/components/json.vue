<template>
  <div>
    <codemirror
    :value="content"
    @input="input"
    :options="option">
    </codemirror>
    <div v-if="error_msg" style="padding-top: 10px;">
      <Alert type="error" show-icon>{{error_msg}}</Alert>
    </div>
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
  name: 'json',
  computed: {
    content () {
      return stringify(this.value)
    }
  },
  data () {
    return {
      error_msg: '',
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
    input (value) {
      try {
        let val = JSON.parse(value)
        this.$emit('on-input', val)
        this.error_msg = ''
      } catch (e) {
        this.error_msg = e.message
      }
    }
  }
}
</script>

<style>
.CodeMirror {
  height: auto;
  line-height: 2;
}
.cm-tab {
   background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAMCAYAAAAkuj5RAAAAAXNSR0IArs4c6QAAAGFJREFUSMft1LsRQFAQheHPowAKoACx3IgEKtaEHujDjORSgWTH/ZOdnZOcM/sgk/kFFWY0qV8foQwS4MKBCS3qR6ixBJvElOobYAtivseIE120FaowJPN75GMu8j/LfMwNjh4HUpwg4LUAAAAASUVORK5CYII=);
   background-position: right;
   background-repeat: no-repeat;
   opacity: .8;
}
</style>
