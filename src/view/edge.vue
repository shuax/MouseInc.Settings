<template>
  <div>
    <div style="padding: 0px 0px 10px 0px">
      <b>
        开启
        <i-switch v-model="proxy.Open" />
      </b>
    </div>
    <p>鼠标在屏幕四个边滚动时触发的功能。</p>
    <Table size="small" :columns="edge_col" :data="edge_data"></Table>
    <!-- {{this.cfg.WheelEdge}} -->
  </div>
</template>

<script>
import JsonEdit from './json_edit.vue'
import TextEdit from './text_edit.vue'
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
              on: { 'on-change': (value) => { row.Valid = value } }
            })
          }
        },
        {
          title: '位置',
          key: 'Location',
          width: 80,
          render: (h, params) => {
            return h('span', this.$t(params.row.Location))
          }
        },
        {
          title: '备注',
          key: 'Name',
          ellipsis: true,
          width: 100,
          renderHeader: (h, params) => {
            return h('div', [
              h('em', '备注'),
              h('Icon', {
                props: {
                  type: 'md-create'
                }
              })
            ])
          },
          render: (h, params) => {
            var row = this.proxy[params.row.Location]
            return h(TextEdit, {
              props: { value: row.Name },
              on: { input: (value) => { row.Name = value } }
            })
          }
        },
        {
          title: '向上动作',
          key: 'UpActions',
          ellipsis: true,
          renderHeader: (h, params) => {
            return h('div', [
              h('em', '向上动作'),
              h('Icon', {
                props: {
                  type: 'md-create'
                }
              })
            ])
          },
          render: (h, params) => {
            var row = this.proxy[params.row.Location]
            return h(JsonEdit, {
              props: { value: row.UpActions },
              on: { input: (value) => { row.UpActions = value } }
            })
          }
        },
        {
          title: '向下动作',
          key: 'DownActions',
          ellipsis: true,
          renderHeader: (h, params) => {
            return h('div', [
              h('em', '向下动作'),
              h('Icon', {
                props: {
                  type: 'md-create'
                }
              })
            ])
          },
          render: (h, params) => {
            var row = this.proxy[params.row.Location]
            return h(JsonEdit, {
              props: { value: row.DownActions },
              on: { input: (value) => { row.DownActions = value } }
            })
          }
        },
        {
          title: '按下动作',
          key: 'PressActions',
          ellipsis: true,
          renderHeader: (h, params) => {
            return h('div', [
              h('em', '按下动作'),
              h('Icon', {
                props: {
                  type: 'md-create'
                }
              })
            ])
          },
          render: (h, params) => {
            var row = this.proxy[params.row.Location]
            return h(JsonEdit, {
              props: { value: row.PressActions },
              on: { input: (value) => { row.PressActions = value } }
            })
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'cfg'
    ]),
    proxy () {
      return this.cfg.WheelEdge ? this.cfg.WheelEdge : {
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
