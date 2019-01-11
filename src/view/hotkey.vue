<template>
  <div>
    <Table size="small" :columns="hotkey_col" :data="settings.Hotkeys"></Table>
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
            var row = this.settings.Hotkeys[params.index]
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
          render: (h, params) => {
            var row = this.settings.Hotkeys[params.index]
            return h(TextEdit, {
              props: { value: row.Keys },
              on: { input: (value) => { row.Keys = value } }
            })
          }
        },
        {
          title: '操作',
          key: 'Actions',
          render: (h, params) => {
            var row = this.settings.Hotkeys[params.index]
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
      'settings'
    ])
  }
}
</script>
