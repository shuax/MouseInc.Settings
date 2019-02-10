<template>
  <div>
    <div style="padding: 0px 0px 10px 0px">
      <b>
        开启
        <i-switch v-model="proxy.Open" />
      </b>
    </div>
    <p>鼠标在屏幕四个边滚动时触发的功能。</p>
    <Table size="small" :columns="edge_col" :data="edge_data">

      <template slot-scope="{ row, index }" slot="valid">
        <Checkbox :value="row.Valid" @on-change="oncheck(row.Location, $event)"></Checkbox>
      </template>

      <template slot-scope="{ row, index }" slot="location">
        <span>{{$t(row.Location)}}</span>
      </template>

      <template slot-scope="{ row, index }" slot="action">
        <a @click="modify(row.Location)">修改</a>
      </template>

    </Table>

    <Modal v-model="modal.editing">
        <p slot="header" style="text-align:center">
            <span>{{modal.title}}</span>
        </p>
        <div>
          <Form :label-width="80">
            <FormItem label="备注">
              <Input v-model="modal.Name" style="width:200px"/>
            </FormItem>
            <FormItem label="向上动作">
              <JsonEdit :value="modal.UpActions" @on-input="modal.NewUpActions=$event"></JsonEdit>
            </FormItem>
            <FormItem label="向下动作">
              <JsonEdit :value="modal.DownActions" @on-input="modal.NewDownActions=$event"></JsonEdit>
            </FormItem>
            <FormItem label="按下动作">
              <JsonEdit :value="modal.PressActions" @on-input="modal.NewPressActions=$event"></JsonEdit>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
            <Button type="primary" size="large" long @click="on_modify">确定</Button>
        </div>
    </Modal>

    <!-- {{this.cfg.WheelEdge}} -->
  </div>
</template>

<script>
import JsonEdit from './components/json.vue'
// import JsonEdit from './json_edit.vue'
// import TextEdit from './text_edit.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'edge',
  components: {
    JsonEdit
    // SelectEdit,
    // GestureEdit
  },
  data () {
    return {
      modal: {
        editing: false,
        title: '',
        Name: '',
        UpActions: [],
        DownActions: [],
        PressActions: []
      },
      edge_col: [
        {
          title: '有效',
          width: 60,
          slot: 'valid'
          // key: 'Valid',
          // render: (h, params) => {
          //   var row = this.proxy[params.row.Location]
          //   return h('Checkbox', {
          //     props: { value: row.Valid },
          //     on: { 'on-change': (value) => { row.Valid = value } }
          //   })
          // }
        },
        {
          title: '位置',
          slot: 'location',
          width: 60
          // render: (h, params) => {
          //   return h('span', this.$t(params.row.Location))
          // }
        },
        {
          title: '备注',
          key: 'Name',
          width: 100
          // renderHeader: (h, params) => {
          //   return h('div', [
          //     h('em', '备注'),
          //     h('Icon', {
          //       props: {
          //         type: 'md-create'
          //       }
          //     })
          //   ])
          // },
          // render: (h, params) => {
          //   var row = this.proxy[params.row.Location]
          //   return h(TextEdit, {
          //     props: { value: row.Name },
          //     on: { input: (value) => { row.Name = value } }
          //   })
          // }
        },
        {
          title: '向上动作',
          key: 'UpActions',
          ellipsis: true
          // renderHeader: (h, params) => {
          //   return h('div', [
          //     h('em', '向上动作'),
          //     h('Icon', {
          //       props: {
          //         type: 'md-create'
          //       }
          //     })
          //   ])
          // },
          // render: (h, params) => {
          //   var row = this.proxy[params.row.Location]
          //   return h(JsonEdit, {
          //     props: { value: row.UpActions },
          //     on: { input: (value) => { row.UpActions = value } }
          //   })
          // }
        },
        {
          title: '向下动作',
          key: 'DownActions',
          ellipsis: true
          // renderHeader: (h, params) => {
          //   return h('div', [
          //     h('em', '向下动作'),
          //     h('Icon', {
          //       props: {
          //         type: 'md-create'
          //       }
          //     })
          //   ])
          // },
          // render: (h, params) => {
          //   var row = this.proxy[params.row.Location]
          //   return h(JsonEdit, {
          //     props: { value: row.DownActions },
          //     on: { input: (value) => { row.DownActions = value } }
          //   })
          // }
        },
        {
          title: '按下动作',
          key: 'PressActions',
          ellipsis: true
          // renderHeader: (h, params) => {
          //   return h('div', [
          //     h('em', '按下动作'),
          //     h('Icon', {
          //       props: {
          //         type: 'md-create'
          //       }
          //     })
          //   ])
          // },
          // render: (h, params) => {
          //   var row = this.proxy[params.row.Location]
          //   return h(JsonEdit, {
          //     props: { value: row.PressActions },
          //     on: { input: (value) => { row.PressActions = value } }
          //   })
          // }
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          width: 60
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
  },
  methods: {
    oncheck (Location, value) {
      var row = this.proxy[Location]
      row.Valid = value
    },
    modify (Location) {
      this.modal.editing = true
      this.modal.Location = Location
      var row = this.proxy[Location]
      this.modal.title = '修改屏幕' + this.$t(Location) + '边缘滚动功能'
      this.modal.Name = row.Name
      this.modal.UpActions = row.UpActions
      this.modal.DownActions = row.DownActions
      this.modal.PressActions = row.PressActions
      this.modal.NewUpActions = row.UpActions
      this.modal.NewDownActions = row.DownActions
      this.modal.NewPressActions = row.PressActions
    },
    on_modify () {
      this.modal.editing = false
      var Location = this.modal.Location
      // 修改
      var row = this.proxy[Location]
      row.Name = this.modal.Name
      row.UpActions = this.modal.NewUpActions
      row.DownActions = this.modal.NewDownActions
      row.PressActions = this.modal.NewPressActions
    }
  }
}
</script>
