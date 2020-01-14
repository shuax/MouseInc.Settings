<template>
  <div>
    <p style="padding-bottom: 10px;">{{$t('hotkey_tips1')}}</p>
    <Table border size="small" :columns="hotkey_col" :data="cfg.Hotkeys">

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
          <FormItem :label="$t('keys')">
            <Input v-model="modal.Keys" style="width:200px"/>
          </FormItem>
          <FormItem :label="$t('actions')">
            <JsonEdit :value="modal.Actions" :editing="modal.editing" @on-input="modal.NewActions=$event"></JsonEdit>
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
          title: this.$t('valid'),
          slot: 'valid',
          align: 'center',
          width: 65
          // render: (h, params) => {
          //   var row = this.cfg.Hotkeys[params.index]
          //   return h('Checkbox', {
          //     props: { value: row.Valid },
          //     on: { 'on-change': (value) => { row.Valid = value } }
          //   })
          // }
        },
        {
          title: this.$t('keys'),
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
          //   var row = this.cfg.Hotkeys[params.index]
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
      this.modal.title = this.$t('modify_keys')
      this.modal.btn = 'primary'
      this.modal.Keys = row.Keys
      this.modal.Actions = row.Actions
      this.modal.NewActions = row.Actions
    },
    create () {
      this.modal.editing = true
      this.modal.index = undefined
      // var row = this.cfg.Hotkeys[index]
      this.modal.title = this.$t('add_keys')
      this.modal.btn = 'success'
      this.modal.Keys = ''
      var actions = []
      this.modal.Actions = actions
      this.modal.NewActions = actions
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
