<template>
  <div>
    <p>开启 <i-switch v-model="proxy.Open" /></p><br/>
    <Table :columns="edge_col" :data="edge_data"></Table>
    {{this.settings.WheelEdge}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'keycast',
  data () {
    return {
      edge_col: [
        {
          title: '位置',
          key: 'Location',
          width: 200
        },
        {
          title: '禁用',
          key: 'Disable',
          width: 200,
          render: (h, params) => {
            var row = this.proxy[params.row.Location]
            return h('Checkbox', {
              props: { value: row.Disable },
              on: { 'on-change': (value) => {
                row.Disable = value
              } }
            })
          }
        },
        {
          title: '备注',
          key: 'Name'
        },
        {
          title: '向上操作',
          key: 'UpActions'
        },
        {
          title: '向下操作',
          key: 'DownActions'
        },
        {
          title: '按下操作',
          key: 'PressActions'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    proxy () {
      return this.settings.WheelEdge ? this.settings.WheelEdge : {
        // temporary: true,
        Open: false,
        Left: {},
        Top: {},
        Right: {},
        Bottom: {}
      }
    },
    edge_data () {
      var result = []
      var location = ['Left', 'Top', 'Right', 'Bottom']
      for (var k in location) {
        var Location = location[k]
        result.push({
          Location: Location,
          Disable: this.proxy[Location].Disable,
          Name: this.proxy[Location].Name,
          UpActions: this.proxy[Location].UpActions,
          DownActions: this.proxy[Location].DownActions,
          PressActions: this.proxy[Location].PressActions
        })
      }
      return result
    }
  }
}
</script>
