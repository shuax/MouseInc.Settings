<template>
  <div>
    <div @click="editing=true">
      <div style="display:flex;justify-content:space-between;align-items:Center;">
        <img :src="src" style="margin: 5px;width: 48px;height: 48px" />
        <span style="float:right;align-items:flex-end;color:#ccc">{{content}}</span>
      </div>
    </div>
    <Modal v-model="editing" @on-cancel="oncancel">
        <p slot="header" style="text-align:center">
            <span>选择手势</span>
        </p>
        <div>
          手势列表：
          <Select size="large" v-model="content" style="width:200px">
            <Option v-for="(gesture,index) in gestures" :key="index" :value="index" :label="index">
              <div style="display:flex;justify-content:space-between;align-items:Center;">
                <span><img :src="gesture" style="marginTop: 5px;width: 32px;height: 32px" /></span>
                <span style="float:right;align-items:flex-end;color:#ccc">{{index}}</span>
              </div>
            </Option>
          </Select>
        </div>
        <div slot="footer">
            <Button type="primary" size="large" long @click="save">确定</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'gesture_edit',
  data () {
    return {
      editing: false,
      content: this.value
    }
  },
  props: {
    value: String
  },
  computed: {
    ...mapGetters([
      'gestures'
    ]),
    src () {
      return this.gestures[this.value] ? this.gestures[this.value] : this.gestures['placeholder']
    }
  },
  methods: {
    save (val) {
      this.editing = false
      this.$emit('input', this.content)
    },
    oncancel () {
      // this.content = this.value
    }
  }
}
</script>
