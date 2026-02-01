<template>
  <div>
    <el-select :value="value" :filterable="true" style="width:200px" @change='onchange'>
      <el-option v-for="(gesture,index) in valid_gestures" :key="index" :value="index" :label="index">

        <div style="display:flex;justify-content:space-between;align-items:Center;">
          <span v-if="index!='WheelSwitchUp' && index!='WheelSwitchDown'" ><img :src="gesture" style="marginTop: 2px;width: 32px;height: 32px" /></span>
          <span style="float:right;align-items:flex-end;color:#ccc">{{index}}</span>
        </div>
      </el-option>
    </el-select>
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
    ]),
    valid_gestures () {
      var result = {}
      for (var k in this.gestures) {
        if (k !== 'placeholder') {
          result[k] = this.gestures[k]
        }
      }
      return result
    }
  },
  methods: {
    onchange (value) {
      this.$emit('input', value)
    }
  }

}
</script>
