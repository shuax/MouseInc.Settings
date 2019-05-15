<template>
  <div>
    <p style="padding-bottom: 10px;">这里对指定程序设置的手势会优先于通用手势响应。</p>
    <Tabs size="small" v-model="tab">
      <TabPane v-for="(item,index) in cfg.MatchCustom" :label="item.Name" :key="index">
        <Table size="small" :columns="match_col" :data="MatchTable(item.List, index)">

          <template slot-scope="{ row, index }" slot="valid">
            <Checkbox :value="row.Valid" @on-change="oncheck(row.index, index, $event)"></Checkbox>
          </template>

          <template slot-scope="{ row, index }" slot="sign">
            <GestureEdit :value="row.Sign"></GestureEdit>
          </template>

          <template slot-scope="{ row, index }" slot="action">
            <a @click="modify(row.index, index)">修改</a>
            <Divider type="vertical" />
            <a @click="clone(row.index, index)">克隆</a>
            <Divider type="vertical" />
            <Poptip
                confirm
                title="确定删除此项吗？"
                :transfer="true"
                @on-ok="remove(row.index, index)">
                <a>删除</a>
            </Poptip>
          </template>

        </Table>
        <div style="padding: 10px 0px">
          <b>程序列表：</b>
        </div>
        <div style="padding: 5px 0px" v-for="(match,match_index) in item.Match" :key="match" >
          <card shadow :padding="8" style="width: 300px">
            <span>
            {{match}}
              <Button type="error" size="small" shape="circle" icon="md-close" style="display: inline-block;position:absolute;right: 8px;transform: translateY(-50%);top: 50%;" @click="removematch(index, match_index)" ghost></Button>
            </span>
          </card>
        </div>
        <div style="width: 300px;padding: 5px 0px">
          <Input v-model="value" search enter-button="添加" placeholder="Photoshop.exe" @on-search="addmatch(index)" />
        </div>
      </TabPane>
      <div slot="extra">
        <a @click="modtab">修改</a>
        <Divider type="vertical" />
        <a @click="addtab">克隆</a>
        <Divider type="vertical" />
            <Poptip
                confirm
                title="确定删除此分组？"
                :transfer="true"
                @on-ok="removetab">
                <a>删除</a>
            </Poptip>
      </div>
    </Tabs>
    <Modal v-model="modal.editing">
      <p slot="header" style="text-align:center">
          <span>{{modal.title}}</span>
      </p>
      <div>
        <Form :label-width="80" @submit.native.prevent>
          <FormItem label="手势">
            <SelectEdit v-model="modal.sign"></SelectEdit>
          </FormItem>
          <FormItem label="名称">
            <Input v-model="modal.name" style="width:200px"/>
          </FormItem>
          <FormItem label="动作">
            <JsonEdit :value="modal.actions" @on-input="modal.new_actions=$event"></JsonEdit>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
          <Button :type="modal.btn" size="large" long @click="on_modify">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import JsonEdit from './components/json.vue'
import SelectEdit from './components/select.vue'
import GestureEdit from './components/gesture.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'match',
  components: {
    JsonEdit,
    SelectEdit,
    GestureEdit
  },
  data () {
    return {
      tab: 0,
      name: '',
      value: '',
      modal: {
        editing: false,
        title: '',
        sign: '',
        name: '',
        actions: []
      },
      match_col: [
        {
          title: '有效',
          width: 60,
          slot: 'valid'
        },
        {
          title: '手势',
          slot: 'sign',
          align: 'center',
          width: 180
        },
        {
          title: '名称',
          key: 'Name',
          width: 120
        },
        {
          title: '动作',
          key: 'Actions',
          ellipsis: true
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          width: 150
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'cfg'
    ])
  },
  methods: {

    oncheck (index, match_index, value) {
      var row = this.cfg.MatchCustom[index].List[match_index]
      row.Valid = value
    },
    modify (index, match_index) {
      this.modal.editing = true
      this.modal.index = index
      this.modal.match_index = match_index
      var row = this.cfg.MatchCustom[index].List[match_index]
      this.modal.title = '修改手势'
      this.modal.btn = 'primary'
      this.modal.sign = row.Sign
      this.modal.name = row.Name
      this.modal.actions = row.Actions
      this.modal.new_actions = row.Actions
    },
    clone (index, match_index) {
      this.modal.editing = true
      this.modal.index = index
      this.modal.match_index = undefined
      var row = this.cfg.MatchCustom[index].List[match_index]
      this.modal.title = '添加手势'
      this.modal.btn = 'success'
      this.modal.sign = row.Sign
      this.modal.name = row.Name
      this.modal.actions = row.Actions
      this.modal.new_actions = row.Actions
    },
    on_modify () {
      this.modal.editing = false
      var index = this.modal.index
      var match_index = this.modal.match_index
      if (match_index !== undefined) {
        // 修改
        var row = this.cfg.MatchCustom[index].List[match_index]
        row.Sign = this.modal.sign
        row.Name = this.modal.name
        row.Actions = this.modal.new_actions
      } else {
        // 克隆
        var new_row = {
          Valid: true,
          Sign: this.modal.sign,
          Name: this.modal.name,
          Actions: this.modal.new_actions
        }
        this.cfg.MatchCustom[index].List.push(new_row)
      }
    },
    remove (index, match_index) {
      this.cfg.MatchCustom[index].List.splice(match_index, 1)
    },
    removematch (index, match_index) {
      this.cfg.MatchCustom[index].Match.splice(match_index, 1)
    },
    addmatch (index) {
      if (this.value.indexOf('.') === -1) {
        this.$Message.error('请输入正确的程序名')
        return
      }
      this.cfg.MatchCustom[index].Match.push(this.value)
      this.value = ''
    },
    modtab () {
      this.name = this.cfg.MatchCustom[this.tab].Name
      let instance = this.$Modal.newInstance({
        closable: false,
        maskClosable: false,
        footerHide: true,
        render: (h) => {
          return h('Input', {
            props: {
              type: 'textarea',
              autosize: true,
              value: this.name
            },
            on: {
              input: (val) => {
                this.name = val
              }
            }
          })
        }
      })
      let options = {
        title: '编辑分组名称',
        icon: 'info',
        showCancel: true,
        onRemove: () => {
          instance = null
        },
        onOk: () => {
          this.cfg.MatchCustom[this.tab].Name = this.name
        }
      }
      instance.show(options)
    },
    addtab () {
      this.cfg.MatchCustom.push(JSON.parse(JSON.stringify(this.cfg.MatchCustom[this.tab])))
    },
    removetab () {
      this.cfg.MatchCustom.splice(this.tab, 1)
      this.tab = Math.min(this.tab, this.cfg.MatchCustom.length - 1)
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
