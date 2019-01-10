<template>
  <div>
    <p>开启 <i-switch v-model="proxy.Open" /></p><br/>
    <Table :columns="hotkey_col" :data="proxy.Menu"></Table>
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
          key: 'Name',
          width: 200
        },
        {
          title: '禁用',
          key: 'Disable',
          width: 200,
          render: (h, params) => {
            var row = this.proxy.Menu[params.index]
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
