<template>
  <div>
    <p>直接使用快捷键绑定动作</p>
    <Table size="small" :columns="hotkey_col" :data="cfg.Hotkeys"></Table>
  </div>
</template>

<script>
import JsonEdit from './json_edit.vue'
import TextEdit from './text_edit.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'hotkey',
  data () {
    return {
      hotkey_col: [
        {
          title: '有效',
          key: 'Valid',
          width: 60,
          render: (h, params) => {
            var row = this.cfg.Hotkeys[params.index]
            return h('Checkbox', {
              props: { value: row.Valid },
              on: { 'on-change': (value) => { row.Valid = value } }
            })
          }
        },
        {
          title: '快捷键',
          key: 'Keys',
          width: 120,
          renderHeader: (h, params) => {
            return h('div', [
              h('em', '快捷键'),
              h('Icon', {
                props: {
                  type: 'md-create'
                }
              })
            ])
          },
          render: (h, params) => {
            var row = this.cfg.Hotkeys[params.index]
            return h(TextEdit, {
              props: { value: row.Keys },
              on: { input: (value) => { row.Keys = value } }
            })
          }
        },
        {
          title: '动作',
          key: 'Actions',
          ellipsis: true,
          renderHeader: (h, params) => {
            return h('div', [
              h('em', '动作'),
              h('Icon', {
                props: {
                  type: 'md-create'
                }
              })
            ])
          },
          render: (h, params) => {
            var row = this.cfg.Hotkeys[params.index]
            return h(JsonEdit, {
              props: { value: row.Actions },
              on: { input: (value) => { row.Actions = value } }
            })
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'cfg'
    ])
  }
}
</script>
