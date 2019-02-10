<template>
  <div>
    <div style="display:flex;justify-content:space-between;align-items:Center;">
      <img :src="src" style="margin: 5px;width: 48px;height: 48px" />
      <span style="float:right;align-items:flex-end;color:#ccc">{{value}}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'gesture',
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
  }
}
</script>
