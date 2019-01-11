<template>
  <div>
    <p>开启 <i-switch v-model="proxy.Open" /></p><br/>
    <Table size="small" :columns="hotkey_col" :data="proxy.Menu"></Table>
  </div>
</template>

<script>
import JsonEdit from './json_edit.vue'
import TextEdit from './text_edit.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'copy',
  data () {
    return {
      hotkey_col: [
        {
          title: '有效',
          key: 'Valid',
          width: 60,
          render: (h, params) => {
            var row = this.proxy.Menu[params.index]
            return h('Checkbox', {
              props: { value: row.Valid },
              on: { 'on-change': (value) => { row.Valid = value } }
            })
          }
        },
        {
          title: '名称',
          key: 'Name',
          width: 160,
          render: (h, params) => {
            var row = this.proxy.Menu[params.index]
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
            var row = this.proxy.Menu[params.index]
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
    ]),
    proxy () {
      return this.settings.ClipboardManager ? this.settings.ClipboardManager : {
        // temporary: true,
        Open: false,
        Menu: []
      }
    }
  }
}
</script>
