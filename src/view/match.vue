<template>
  <div>
    <p style="padding-bottom: 10px;">{{$t('match_tips')}}</p>
    <Table border :columns="match_col" :data="cfg.MatchGlobal">

      <template slot-scope="{ row, index }" slot="valid">
        <Checkbox :value="row.Valid" @on-change="oncheck(index, $event)"></Checkbox>
      </template>

      <template slot-scope="{ row, index }" slot="sign">
        <GestureEdit :value="row.Sign"></GestureEdit>
      </template>

      <template slot-scope="{ row, index }" slot="operate">
        <a @click="modify(index)">{{$t('modify')}}</a>
        <Divider type="vertical" />
        <a @click="clone(index)">{{$t('clone')}}</a>
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

    <Modal v-model="modal.editing">
        <p slot="header" style="text-align:center">
            <span>{{modal.title}}</span>
        </p>
        <div>
          <Form :label-width="80" @submit.native.prevent>
            <FormItem :label="$t('sign')">
              <SelectEdit v-model="modal.sign"></SelectEdit>
            </FormItem>
            <FormItem :label="$t('name')">
              <Input v-model="modal.name" style="width:200px"/>
            </FormItem>
            <FormItem :label="$t('actions')">
              <JsonEdit :value="modal.actions" @on-input="modal.new_actions=$event"></JsonEdit>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
            <Button :type="modal.btn" size="large" long @click="on_modify">{{$t('ok')}}</Button>
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
          title: this.$t('valid'),
          width: 65,
          align: 'center',
          slot: 'valid'
        },
        {
          title: this.$t('sign'),
          slot: 'sign',
          align: 'center',
          width: 180
        },
        {
          title: this.$t('name'),
          key: 'Name',
          width: 130
        },
        {
          title: this.$t('actions'),
          key: 'Actions',
          ellipsis: true
        },
        {
          title: this.$t('operate'),
          slot: 'operate',
          align: 'center',
          fixed: 'right',
          width: 155
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
      this.modal.title = this.$t('modify_gesture')
      this.modal.btn = 'primary'
      this.modal.sign = row.Sign
      this.modal.name = row.Name
      this.modal.actions = row.Actions
      this.modal.new_actions = row.Actions
    },
    clone (index) {
      this.modal.editing = true
      this.modal.index = undefined
      var row = this.cfg.MatchGlobal[index]
      this.modal.title = this.$t('add_gesture')
      this.modal.btn = 'success'
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
