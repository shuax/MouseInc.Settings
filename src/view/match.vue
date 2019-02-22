<template>
  <div>
    <p style="padding-bottom: 10px;">这里的手势会对全部程序生效</p>
    <Table size="small" :columns="match_col" :data="cfg.MatchGlobal">

      <template slot-scope="{ row, index }" slot="valid">
        <Checkbox :value="row.Valid" @on-change="oncheck(index, $event)"></Checkbox>
      </template>

      <template slot-scope="{ row, index }" slot="sign">
        <GestureEdit :value="row.Sign"></GestureEdit>
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
            <Button type="primary" size="large" long @click="on_modify">确定</Button>
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
  methods: {
    oncheck (index, value) {
      var row = this.cfg.MatchGlobal[index]
      row.Valid = value
    },
    modify (index) {
      this.modal.editing = true
      this.modal.index = index
      var row = this.cfg.MatchGlobal[index]
      this.modal.title = '修改手势'
      this.modal.sign = row.Sign
      this.modal.name = row.Name
      this.modal.actions = row.Actions
      this.modal.new_actions = row.Actions
    },
    clone (index) {
      this.modal.editing = true
      this.modal.index = undefined
      var row = this.cfg.MatchGlobal[index]
      this.modal.title = '添加手势'
      this.modal.sign = row.Sign
      this.modal.name = row.Name
      this.modal.actions = row.Actions
      this.modal.new_actions = row.Actions
    },
    on_modify () {
      this.modal.editing = false
      var index = this.modal.index
      if (index !== undefined) {
        // 修改
        var row = this.cfg.MatchGlobal[index]
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
        this.cfg.MatchGlobal.push(new_row)
      }
    },
    remove (index) {
      this.cfg.MatchGlobal.splice(index, 1)
    }
  },
  computed: {
    ...mapGetters([
      'cfg'
    ])
  }
}
</script>
