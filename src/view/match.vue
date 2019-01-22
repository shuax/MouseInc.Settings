<template>
  <div>
    <p>这里的手势会对全部程序生效</p>
    <Table size="small" :columns="match_col" :data="cfg.MatchGlobal"></Table>
  </div>
</template>

<script>
import JsonEdit from './json_edit.vue'
import TextEdit from './text_edit.vue'
import GestureEdit from './gesture_edit.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'match',
  data () {
    return {
      match_col: [
        {
          title: '有效',
          key: 'Valid',
          width: 60,
          render: (h, params) => {
            var row = this.cfg.MatchGlobal[params.index]
            return h('Checkbox', {
              props: { value: row.Valid },
              on: { 'on-change': (value) => { row.Valid = value } }
            })
          }
        },
        {
          title: '手势',
          key: '',
          align: 'center',
          width: 180,
          renderHeader: (h, params) => {
            return h('div', [
              h('em', '手势'),
              h('Icon', {
                props: {
                  type: 'md-create'
                }
              })
            ])
          },
          render: (h, params) => {
            var row = this.cfg.MatchGlobal[params.index]
            return h(GestureEdit, {
              props: { value: row.Sign },
              on: { input: (value) => { row.Sign = value } }
            })
          }
        },
        {
          title: '名称',
          key: 'Name',
          width: 140,
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
            var row = this.cfg.MatchGlobal[params.index]
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
            var row = this.cfg.MatchGlobal[params.index]
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
            var row = this.cfg.MatchGlobal[params.index]
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  shape: 'circle',
                  icon: 'md-copy'
                },
                on: { click: () => { this.cfg.MatchGlobal.push(row) } }
              }),
              h('Button', {
                props: {
                  type: 'text',
                  shape: 'circle',
                  icon: 'md-trash'
                },
                on: { click: () => { this.cfg.MatchGlobal.splice(params.index, 1) } }
              })
            ])
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'cfg',
      'gestures'
    ])
  }
}
</script>
