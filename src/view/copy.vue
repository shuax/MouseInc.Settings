<template>
  <div>
    <div style="padding-bottom: 10px;">
      <b>
        {{$t('open_label')}}
        <i-switch v-model="proxy.Open" />
      </b>
    </div>
    <p style="padding-bottom: 10px;">{{$t('copy_tips1')}}</p>
    <Table border size="small" :columns="hotkey_col" :data="proxy.Menu" :draggable="true" @on-drag-drop="ondrag">

      <template slot-scope="{ row, index }" slot="valid">
        <Checkbox :value="row.Valid" @on-change="oncheck(index, $event)"></Checkbox>
      </template>

      <template slot-scope="{ row, index }" slot="operate">
        <a @click="modify(index)">{{$t('modify')}}</a>
<!--         <Divider type="vertical" />
        <a @click="clone(index)">{{$t('clone')}}</a> -->
        <Divider type="vertical" />
        <Poptip
            confirm
            :title="$t('match_warning')"
            :transfer="true"
            @on-ok="remove(index)">
            <a>{{$t('delete')}}</a>
        </Poptip>
        <br>

      </template>
    </Table>

    <div style="padding-top: 10px">
        <Button type="primary" @click="create">{{$t('create')}}</Button>
    </div>

    <Modal v-model="modal.editing">
      <p slot="header" style="text-align:center">
          <span>{{modal.title}}</span>
      </p>
      <div>
        <Form :label-width="80" @submit.native.prevent>
          <FormItem :label="$t('name')">
            <Input v-model="modal.Name" style="width:200px"/>
          </FormItem>
          <FormItem :label="$t('actions')">
            <JsonEdit :value="modal.Actions" @on-input="modal.NewActions=$event"></JsonEdit>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
          <Button :type="modal.btn" long @click="on_modify">{{$t('ok')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import JsonEdit from './components/json.vue'
// import TextEdit from './text_edit.vue'
import { mapGetters } from 'vuex'
// import Sortable from 'sortablejs'
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
          title: this.$t('valid'),
          width: 65,
          align: 'center',
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
          title: this.$t('name'),
          key: 'Name',
          width: 140
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
          title: this.$t('actions'),
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
          title: this.$t('operate'),
          slot: 'operate',
          align: 'center',
          fixed: 'right',
          width: 110
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
      this.modal.title = this.$t('modify_menu')
      this.modal.btn = 'primary'
      this.modal.Name = row.Name
      this.modal.Actions = row.Actions
      this.modal.NewActions = row.Actions
    },
    create () {
      this.modal.editing = true
      this.modal.index = undefined
      this.modal.title = this.$t('add_menu')
      this.modal.btn = 'success'
      this.modal.Name = ''
      var actions = [['action', 'args']]
      this.modal.Actions = actions
      this.modal.NewActions = actions
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
    ondrag (index1, index2) {
      const row = this.proxy.Menu.splice(index1, 1)[0]
      this.proxy.Menu.splice(index2, 0, row)
    }
  },
  mounted () {
    // const el = document.querySelectorAll('.ivu-table-tbody')[0]
    // this.sortable = Sortable.create(el, {
    //   // ghostClass: 'sortable-ghost',
    //   onEnd: (/** Event */ evt) => {
    //     const targetRow = this.proxy.Menu.splice(evt.oldIndex, 1)[0]
    //     this.proxy.Menu.splice(evt.newIndex, 0, targetRow)
    //   },
    //   onMove: (/** Event */ evt, /** Event */ originalEvent) => {
    //     // Example: http://jsbin.com/tuyafe/1/edit?js,output
    //     // console.log(evt, originalEvent)
    //   }
    // })
  }
}
</script>
