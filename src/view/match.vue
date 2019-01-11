<template>
  <div>
    <Table size="small" :columns="hotkey_col" :data="settings.MatchGlobal"></Table>
  </div>
</template>

<script>
import JsonEdit from './json_edit.vue'
import TextEdit from './text_edit.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'match',
  data () {
    return {
      hotkey_col: [
        {
          title: '有效',
          key: 'Valid',
          width: 60,
          render: (h, params) => {
            var row = this.settings.MatchGlobal[params.index]
            return h('Checkbox', {
              props: { value: row.Valid },
              on: { 'on-change': (value) => { row.Valid = value } }
            })
          }
        },
        {
          title: '手势',
          key: 'Sign',
          width: 160
        },
        {
          title: '名称',
          key: 'Name',
          width: 180,
          render: (h, params) => {
            var row = this.settings.MatchGlobal[params.index]
            return h(TextEdit, {
              props: { value: row.Name },
              on: { input: (value) => { row.Name = value } }
            })
          }
        },
        {
          title: '操作',
          key: 'Actions',
          render: (h, params) => {
            var row = this.settings.MatchGlobal[params.index]
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
