<template>
  <div>
    <!-- {{value}} -->
    <Tabs v-model="tab" size="small">
    <TabPane label="Raw">
        <codemirror
        :value="content"
        @input="input"
        :options="option">
        </codemirror>
        <div v-if="error_msg" style="padding-top: 10px;">
          <Alert type="error" show-icon>{{error_msg}}</Alert>
        </div>
    </TabPane>
    <TabPane label="Preview">
        <Collapse accordion simple1>
            <Panel v-for="(item,index) in this.value" :key="index">
                {{item[0]}}
                <p slot="content">
                <List item-layout="vertical" size="small" :split='false'>
                    <template  v-for="(args,args_index) in item" >
                        <ListItem v-if="args_index != 0"  :key="args">{{args}}</ListItem>
                    </template>
                </List>
                </p>
            </Panel>
        </Collapse>
    </TabPane>
    </Tabs>
  </div>
</template>

<script>
// import jsBeautify from 'js-beautify/js/lib/beautify'
import beautify from 'js-beautify'
function stringify (data) {
  return beautify.js(JSON.stringify(data), {
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
        // keyMap: 'sublime',
        mode: {
          name: 'javascript',
          json: true
        }
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
