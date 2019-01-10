<template>
  <div>
    {{settings.MatchCustom}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'match',
  computed: {
    ...mapGetters([
      'settings'
    ]),
    proxy () {
      var ret = this.settings.MouseGesture ? this.settings : {
        // temporary: true,
        MouseGesture: { Open: false, WheelSwitch: false },
        Keycast: { Open: false },
        WheelAltControl: false,
        VolumeControlSound: false,
        WheelEdge: { Open: false },
        ClipboardManager: { Open: false },
        IgnoreFullScreen: false,
        WheelThrough: false,
        WheelNatural: false
      }
      return ret
    }
  }
}
</script>
