<template>
  <div>
    <div style="padding: 0px 0px 10px 0px">
      <b>
        {{$t('open_label')}}
        <i-switch v-model="proxy.Open" />
      </b>
    </div>
    <p style="padding-bottom: 10px;">{{$t('corner_tips1')}}</p>
    <Table border size="small" :columns="corner_col" :data="corner_data">

      <template slot-scope="{ row, index }" slot="valid">
        <Checkbox :value="row.Valid" @on-change="oncheck(row.Location, $event)"></Checkbox>
      </template>

      <template slot-scope="{ row, index }" slot="location">
        <span>{{$t(row.Location)}}</span>
      </template>

      <template slot-scope="{ row, index }" slot="operate">
        <a @click="modify(row.Location)">{{$t('modify')}}</a>
      </template>

    </Table>

    <Modal v-model="modal.editing" :styles="{top: '10px'}">
        <p slot="header" style="text-align:center">
            <span>{{modal.title}}</span>
        </p>
        <div>
          <Form :label-width="80" @submit.native.prevent>
            <FormItem :label="$t('name')">
              <Input v-model="modal.Name" style="width:200px"/>
            </FormItem>
            <FormItem :label="$t('actions')">
              <JsonEdit :value="modal.Actions" :editing="modal.editing" @on-input="modal.NewActions=$event"></JsonEdit>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
            <Button type="primary" long @click="on_modify">{{$t('ok')}}</Button>
        </div>
    </Modal>

    <!-- {{this.cfg.HotCorner}} -->
  </div>
</template>

<script>
import JsonEdit from './components/json.vue'
// import TextEdit from './text_edit.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'corner',
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
      corner_col: [
        {
          title: this.$t('valid'),
          width: 65,
          align: 'center',
          slot: 'valid'
        },
        {
          title: this.$t('location'),
          slot: 'location',
          width: 120
        },
        {
          title: this.$t('name'),
          key: 'Name',
          width: 120
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
          width: 70
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'cfg'
    ]),
    proxy () {
      return this.cfg.HotCorner ? this.cfg.HotCorner : {
        // temporary: true,
        Open: false,
        TopLeft: {},
        TopRight: {},
        BottomLeft: {},
        BottomRight: {}
      }
    },
    corner_data () {
      var result = []
      var location = ['TopLeft', 'TopRight', 'BottomLeft', 'BottomRight']
      for (var k in location) {
        var Location = location[k]
        result.push({
          Location: Location,
          Valid: this.proxy[Location].Valid,
          Name: this.proxy[Location].Name,
          Actions: this.proxy[Location].Actions
        })
      }
      return result
    }
  },
  methods: {
    oncheck (Location, value) {
      var row = this.proxy[Location]
      row.Valid = value
    },
    modify (Location) {
      this.modal.editing = true
      this.modal.Location = Location
      var row = this.proxy[Location]
      this.modal.title = this.$t('corner_tips2')
      this.modal.Name = row.Name
      this.modal.Actions = row.Actions
      this.modal.NewActions = row.Actions
    },
    on_modify () {
      this.modal.editing = false
      var Location = this.modal.Location
      // 修改
      var row = this.proxy[Location]
      row.Name = this.modal.Name
      row.Actions = this.modal.NewActions
    }
  }
}
</script>
