<template>
  <div>
    <Table :columns="hotkey_col" :data="settings.MatchGlobal"></Table>
  </div>
</template>

<script>
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
              on: { 'on-change': (value) => {
                row.Valid = value
              } }
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
          width: 180
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
