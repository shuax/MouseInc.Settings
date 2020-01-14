<template>
  <div>
    <div style="padding: 0px 0px 10px 0px">
      <b>
        {{$t('open_label')}}
        <i-switch v-model="proxy.Open" />
      </b>
    </div>
    <p style="padding-bottom: 10px;">{{$t('edge_tips1')}}</p>
    <Table border size="small" :columns="edge_col" :data="edge_data">

      <template slot-scope="{ row, index }" slot="valid">
        <Checkbox :value="row.Valid" @on-change="oncheck(row.Location, $event)"></Checkbox>
      </template>

      <template slot-scope="{ row, index }" slot="location">
        <span>{{$t(row.Location)}}</span>
      </template>

      <template slot-scope="{ row, index }" slot="operate">
        <a @click="modify(row.Location)">{{$t('modify')}}</a>
      </template>

    </Table>

    <Modal v-model="modal.editing" :styles="{top: '10px'}">
        <p slot="header" style="text-align:center">
            <span>{{modal.title}}</span>
        </p>
        <div>
          <Form :label-width="80" @submit.native.prevent>
            <FormItem :label="$t('name')">
              <Input v-model="modal.Name" style="width:200px"/>
            </FormItem>
            <FormItem :label="$t('upactions')">
              <JsonEdit :value="modal.UpActions" :editing="modal.editing" @on-input="modal.NewUpActions=$event"></JsonEdit>
            </FormItem>
            <FormItem :label="$t('downactions')">
              <JsonEdit :value="modal.DownActions" :editing="modal.editing" @on-input="modal.NewDownActions=$event"></JsonEdit>
            </FormItem>
            <FormItem :label="$t('pressactions')">
              <JsonEdit :value="modal.PressActions" :editing="modal.editing" @on-input="modal.NewPressActions=$event"></JsonEdit>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
            <Button type="primary" long @click="on_modify">{{$t('ok')}}</Button>
        </div>
    </Modal>

    <!-- {{this.cfg.WheelEdge}} -->
  </div>
</template>

<script>
import JsonEdit from './components/json.vue'
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
          title: this.$t('valid'),
          width: 65,
          align: 'center',
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
          title: this.$t('location'),
          slot: 'location',
          width: 70
          // render: (h, params) => {
          //   return h('span', this.$t(params.row.Location))
          // }
        },
        {
          title: this.$t('name'),
          key: 'Name',
          width: 120
          // renderHeader: (h, params) => {
          //   return h('div', [
          //     h('em', '名称'),
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
          title: this.$t('upactions'),
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
          title: this.$t('downactions'),
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
          title: this.$t('pressactions'),
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
          title: this.$t('operate'),
          slot: 'operate',
          align: 'center',
          fixed: 'right',
          width: 70
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
      this.modal.title = this.$t('edge_tips2') + this.$t(Location) + this.$t('edge_tips3')
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
