<template>
  <div>
    <p>直接使用快捷键绑定动作</p>
    <Table size="small" :columns="hotkey_col" :data="cfg.Hotkeys">

      <template slot-scope="{ row, index }" slot="valid">
        <Checkbox :value="row.Valid" @on-change="oncheck(index, $event)"></Checkbox>
      </template>

      <template slot-scope="{ row, index }" slot="action">
        <a @click="modify(index)">修改</a>
        <Divider type="vertical" />
        <a @click="clone(index)">克隆</a>
        <Divider type="vertical" />
        <Poptip
            confirm
            title="确定删除此项吗？"
            :transfer="true"
            @on-ok="remove(index)">
            <a>删除</a>
        </Poptip>
      </template>
    </Table>

    <Modal v-model="modal.editing">
      <p slot="header" style="text-align:center">
          <span>{{modal.title}}</span>
      </p>
      <div>
        <Form :label-width="80">
          <FormItem label="快捷键">
            <Input v-model="modal.Keys" style="width:200px"/>
          </FormItem>
          <FormItem label="动作">
            <JsonEdit :value="modal.Actions" @on-input="modal.NewActions=$event"></JsonEdit>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
          <Button type="primary" size="large" long @click="on_modify">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import JsonEdit from './components/json.vue'
// import JsonEdit from './json_edit.vue'
// import TextEdit from './text_edit.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'hotkey',
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
        Keys: '',
        Actions: []
      },
      hotkey_col: [
        {
          title: '有效',
          slot: 'valid',
          width: 60
          // render: (h, params) => {
          //   var row = this.cfg.Hotkeys[params.index]
          //   return h('Checkbox', {
          //     props: { value: row.Valid },
          //     on: { 'on-change': (value) => { row.Valid = value } }
          //   })
          // }
        },
        {
          title: '快捷键',
          key: 'Keys',
          width: 120
          // renderHeader: (h, params) => {
          //   return h('div', [
          //     h('em', '快捷键'),
          //     h('Icon', {
          //       props: {
          //         type: 'md-create'
          //       }
          //     })
          //   ])
          // },
          // render: (h, params) => {
          //   var row = this.cfg.Hotkeys[params.index]
          //   return h(TextEdit, {
          //     props: { value: row.Keys },
          //     on: { input: (value) => { row.Keys = value } }
          //   })
          // }
        },
        {
          title: '动作',
          key: 'Actions',
          ellipsis: true
          // renderHeader: (h, params) => {
          //   return h('div', [
          //     h('em', '动作'),
          //     h('Icon', {
          //       props: {
          //         type: 'md-create'
          //       }
          //     })
          //   ])
          // },
          // render: (h, params) => {
          //   var row = this.cfg.Hotkeys[params.index]
          //   return h(JsonEdit, {
          //     props: { value: row.Actions },
          //     on: { input: (value) => { row.Actions = value } }
          //   })
          // }
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          width: 150
        }
        // {
        //   title: '克隆 / 删除',
        //   key: '',
        //   fixed: 'right',
        //   width: 100,
        //   render: (h, params) => {
        //     var row = this.cfg.Hotkeys[params.index]
        //     return h('div', [
        //       h('Button', {
        //         props: {
        //           type: 'text',
        //           shape: 'circle',
        //           icon: 'md-copy'
        //         },
        //         on: { click: () => { this.cfg.Hotkeys.push(JSON.parse(JSON.stringify(row))) } }
        //       }),
        //       h('Button', {
        //         props: {
        //           type: 'text',
        //           shape: 'circle',
        //           icon: 'md-trash'
        //         },
        //         on: { click: () => { this.cfg.Hotkeys.splice(params.index, 1) } }
        //       })
        //     ])
        //   }
        // }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'cfg'
    ])
  },
  methods: {
    oncheck (index, value) {
      var row = this.cfg.Hotkeys[index]
      row.Valid = value
    },
    modify (index) {
      this.modal.editing = true
      this.modal.index = index
      var row = this.cfg.Hotkeys[index]
      this.modal.title = '修改快捷键'
      this.modal.Keys = row.Keys
      this.modal.Actions = row.Actions
      this.modal.NewActions = row.Actions
    },
    clone (index) {
      this.modal.editing = true
      this.modal.index = undefined
      var row = this.cfg.Hotkeys[index]
      this.modal.title = '添加快捷键'
      this.modal.Keys = row.Keys
      this.modal.Actions = row.Actions
      this.modal.NewActions = row.Actions
    },
    on_modify () {
      this.modal.editing = false
      var index = this.modal.index
      if (index !== undefined) {
        // 修改
        var row = this.cfg.Hotkeys[index]
        row.Keys = this.modal.Keys
        row.Actions = this.modal.NewActions
      } else {
        // 克隆
        var new_row = {
          Valid: true,
          Keys: this.modal.Keys,
          Actions: this.modal.NewActions
        }
        this.cfg.Hotkeys.push(new_row)
      }
    },
    remove (index) {
      this.cfg.Hotkeys.splice(index, 1)
    }
  }
}
</script>
