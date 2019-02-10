<template>
  <div>
    <Select :value="value" :filterable="true" :clearable="true" style="width:200px" @on-change='onchange'>
      <Option v-for="(gesture,index) in gestures" :key="index" :value="index" :label="index">
        <div style="display:flex;justify-content:space-between;align-items:Center;">
          <span><img :src="gesture" style="marginTop: 2px;width: 32px;height: 32px" /></span>
          <span style="float:right;align-items:flex-end;color:#ccc">{{index}}</span>
        </div>
      </Option>
    </Select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'g-select',
  props: {
    value: String
  },
  computed: {
    ...mapGetters([
      'gestures'
    ])
  },
  methods: {
    onchange (value) {
      this.$emit('input', value)
    }
  }

}
</script>
