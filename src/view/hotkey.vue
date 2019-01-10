<template>
  <div>
    <Table :columns="hotkey_col" :data="settings.Hotkeys"></Table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'hotkey',
  data () {
    return {
      hotkey_col: [
        {
          title: '快捷键',
          key: 'Keys',
          width: 200
        },
        {
          title: '禁用',
          key: 'Disable',
          width: 200,
          render: (h, params) => {
            var row = this.settings.Hotkeys[params.index]
            return h('Checkbox', {
              props: { value: row.Disable },
              on: { 'on-change': (value) => {
                row.Disable = value
              } }
            })
          }
        },
        {
          title: '操作',
          key: 'Actions'
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
