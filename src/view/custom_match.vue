<template>
  <div>
    <p>这里的手势会对匹配成功的程序生效</p>
    <Tabs>
      <TabPane v-for="(item,index) in cfg.MatchCustom" :label="item.Name" :key="index">
        <Table size="small" :columns="match_col" :data="MatchTable(item.List, index)"></Table>
        <div style="padding: 10px 0px">
          <b>匹配程序：</b>
        </div>
        <div style="padding: 5px 0px" v-for="(match,match_index) in item.Match" :key="match" >
          <card shadow :padding="8" style="width: 300px">
            <span>
            {{match}}
              <Button type="primary" size="small" shape="circle" icon="md-close" style="display: inline-block;position:absolute;right: 8px;transform: translateY(-50%);top: 50%;" @click="remove(index, match_index)"></Button>
            </span>
          </card>
        </div>
        <div style="width: 300px;padding: 5px 0px">
          <Input v-model="value" search enter-button="添加" placeholder="Photoshop.exe" @on-search="add(index, match_index)" />
        </div>
      </TabPane>
    </Tabs>
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
      value: '',
      match_col: [
        {
          title: '有效',
          key: 'Valid',
          width: 60,
          render: (h, params) => {
            var row = this.cfg.MatchCustom[params.row.index].List[params.index]
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
            var row = this.cfg.MatchCustom[params.row.index].List[params.index]
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
            var row = this.cfg.MatchCustom[params.row.index].List[params.index]
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
            var row = this.cfg.MatchCustom[params.row.index].List[params.index]
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
            var row = this.cfg.MatchCustom[params.row.index].List[params.index]
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  shape: 'circle',
                  icon: 'md-copy'
                },
                on: { click: () => { this.cfg.MatchCustom[params.row.index].List.push(row) } }
              }),
              h('Button', {
                props: {
                  type: 'text',
                  shape: 'circle',
                  icon: 'md-trash'
                },
                on: { click: () => { this.cfg.MatchCustom[params.row.index].List.splice(params.index, 1) } }
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
  },
  methods: {
    remove (index, match_index) {
      this.cfg.MatchCustom[index].Match.splice(match_index, 1)
    },
    add (index, match_index) {
      this.cfg.MatchCustom[index].Match.push(this.value)
      this.value = ''
    },
    MatchTable (data, index) {
      var result = []
      for (var k in data) {
        result.push({
          Valid: data[k].Valid,
          Sign: data[k].Sign,
          Name: data[k].Name,
          Actions: data[k].Actions,
          index: index
        })
      }
      return result
    }
  }
}
</script>
