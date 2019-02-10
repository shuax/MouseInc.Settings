<template>
  <div>
    <div style="padding: 0px 0px 10px 0px">
      <b>
        开启
        <i-switch v-model="proxy.Open" />
      </b>
    </div>
    <p>选中文字快速按下两次Ctrl+C后，会弹出快捷操作菜单。空白名称代表分割线</p>
    <Table size="small" :columns="hotkey_col" :data="proxy.Menu">

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
        <br>

        <a @click="up(index)">上移</a>
        <Divider type="vertical" />
        <a @click="down(index)">下移</a>

      </template>
    </Table>

    <Modal v-model="modal.editing">
      <p slot="header" style="text-align:center">
          <span>{{modal.title}}</span>
      </p>
      <div>
        <Form :label-width="80">
          <FormItem label="名称">
            <Input v-model="modal.Name" style="width:200px"/>
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
  name: 'copy',
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
        Actions: []
      },
      hotkey_col: [
        {
          title: '有效',
          width: 60,
          slot: 'valid'
          // render: (h, params) => {
          //   var row = this.proxy.Menu[params.index]
          //   return h('Checkbox', {
          //     props: { value: row.Valid },
          //     on: { 'on-change': (value) => { row.Valid = value } }
          //   })
          // }
        },
        {
          title: '名称',
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
          //   var row = this.proxy.Menu[params.index]
          //   return h(TextEdit, {
          //     props: { value: row.Name },
          //     on: { input: (value) => { row.Name = value } }
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
          //   var row = this.proxy.Menu[params.index]
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
        //     var row = this.proxy.Menu[params.index]
        //     return h('div', [
        //       h('Button', {
        //         props: {
        //           type: 'text',
        //           shape: 'circle',
        //           icon: 'md-copy'
        //         },
        //         on: { click: () => { this.proxy.Menu.push(JSON.parse(JSON.stringify(row))) } }
        //       }),
        //       h('Button', {
        //         props: {
        //           type: 'text',
        //           shape: 'circle',
        //           icon: 'md-trash'
        //         },
        //         on: { click: () => { this.proxy.Menu.splice(params.index, 1) } }
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
    ]),
    proxy () {
      return this.cfg.ClipboardManager ? this.cfg.ClipboardManager : {
        // temporary: true,
        Open: false,
        Menu: []
      }
    }
  },
  methods: {
    oncheck (index, value) {
      var row = this.proxy.Menu[index]
      row.Valid = value
    },
    modify (index) {
      this.modal.editing = true
      this.modal.index = index
      var row = this.proxy.Menu[index]
      this.modal.title = '修改菜单项'
      this.modal.Name = row.Name
      this.modal.Actions = row.Actions
      this.modal.NewActions = row.Actions
    },
    clone (index) {
      this.modal.editing = true
      this.modal.index = undefined
      var row = this.proxy.Menu[index]
      this.modal.title = '添加菜单项'
      this.modal.Name = row.Name
      this.modal.Actions = row.Actions
      this.modal.NewActions = row.Actions
    },
    on_modify () {
      this.modal.editing = false
      var index = this.modal.index
      if (index !== undefined) {
        // 修改
        var row = this.proxy.Menu[index]
        row.Name = this.modal.Name
        row.Actions = this.modal.NewActions
      } else {
        // 克隆
        var new_row = {
          Valid: true,
          Name: this.modal.Name,
          Actions: this.modal.NewActions
        }
        this.proxy.Menu.push(new_row)
      }
    },
    remove (index) {
      this.proxy.Menu.splice(index, 1)
    },
    up (index) {
      if (index > 0) {
        var row = this.proxy.Menu.splice(index, 1)[0]
        this.proxy.Menu.splice(index - 1, 0, row)
      }
    },
    down (index) {
      if (index < this.proxy.Menu.length) {
        var row = this.proxy.Menu.splice(index, 1)[0]
        this.proxy.Menu.splice(index + 1, 0, row)
      }
    }
  }
}
</script>
