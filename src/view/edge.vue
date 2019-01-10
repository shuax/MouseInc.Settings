<template>
  <div>
    <p>开启 <i-switch v-model="proxy.Open" /></p><br/>
    <Table :columns="edge_col" :data="edge_data"></Table>
    <!-- {{this.settings.WheelEdge}} -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'edge',
  data () {
    return {
      edge_col: [
        {
          title: '有效',
          key: 'Valid',
          width: 60,
          render: (h, params) => {
            var row = this.proxy[params.row.Location]
            return h('Checkbox', {
              props: { value: row.Valid },
              on: { 'on-change': (value) => {
                row.Valid = value
              } }
            })
          }
        },
        {
          title: '位置',
          key: 'Location',
          width: 80
        },
        {
          title: '备注',
          key: 'Name',
          width: 120
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
          Valid: this.proxy[Location].Valid,
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
