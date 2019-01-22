<template>
  <div>
    <div style="padding: 0px 0px 10px 0px">
      <b>
        开启
        <i-switch v-model="proxy.Open" />
      </b>
    </div>
    <p>选中文字快速按下两次Ctrl+C后，会弹出快捷操作菜单。空白名称代表分割线</p>
    <Table size="small" :columns="hotkey_col" :data="proxy.Menu"></Table>
  </div>
</template>

<script>
import JsonEdit from './json_edit.vue'
import TextEdit from './text_edit.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'copy',
  data () {
    return {
      hotkey_col: [
        {
          title: '有效',
          key: 'Valid',
          width: 60,
          render: (h, params) => {
            var row = this.proxy.Menu[params.index]
            return h('Checkbox', {
              props: { value: row.Valid },
              on: { 'on-change': (value) => { row.Valid = value } }
            })
          }
        },
        {
          title: '名称',
          key: 'Name',
          width: 160,
          renderHeader: (h, params) => {
            return h('div', [
              h('em', '名称'),
              h('Icon', {
                props: {
                  type: 'md-create'
                }
              })
            ])
          },
          render: (h, params) => {
            var row = this.proxy.Menu[params.index]
            return h(TextEdit, {
              props: { value: row.Name },
              on: { input: (value) => { row.Name = value } }
            })
          }
        },
        {
          title: '动作',
          key: 'Actions',
          ellipsis: true,
          renderHeader: (h, params) => {
            return h('div', [
              h('em', '动作'),
              h('Icon', {
                props: {
                  type: 'md-create'
                }
              })
            ])
          },
          render: (h, params) => {
            var row = this.proxy.Menu[params.index]
            return h(JsonEdit, {
              props: { value: row.Actions },
              on: { input: (value) => { row.Actions = value } }
            })
          }
        },
        {
          title: '克隆 / 删除',
          key: '',
          fixed: 'right',
          width: 100,
          render: (h, params) => {
            var row = this.proxy.Menu[params.index]
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  shape: 'circle',
                  icon: 'md-copy'
                },
                on: { click: () => { this.proxy.Menu.push(row) } }
              }),
              h('Button', {
                props: {
                  type: 'text',
                  shape: 'circle',
                  icon: 'md-trash'
                },
                on: { click: () => { this.proxy.Menu.splice(params.index, 1) } }
              })
            ])
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
      return this.cfg.ClipboardManager ? this.cfg.ClipboardManager : {
        // temporary: true,
        Open: false,
        Menu: []
      }
    }
  }
}
</script>
