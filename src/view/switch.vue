<template>
  <div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 750px">
        <CellGroup>
          <Cell :title="$t('mousegesture')" :label="$t('mousegesture_label')">
            <i-switch v-model="proxy.MouseGesture.Open" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 750px">
        <CellGroup>
          <Cell :title="$t('wheelswitch')" :label="$t('wheelswitch_label')">
            <i-switch v-model="proxy.MouseGesture.WheelSwitch" slot="extra" :disabled="!proxy.MouseGesture.Open"/>
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 750px">
        <CellGroup>
          <Cell :title="$t('keycast')" :label="$t('keycast_label')">
            <i-switch v-model="proxy.Keycast.Open" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 750px">
        <CellGroup>
          <Cell :title="$t('wheelaltcontrol')" :label="$t('wheelaltcontrol_label')">
            <i-switch v-model="proxy.WheelAltControl" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 750px">
        <CellGroup>
          <Cell :title="$t('volumecontrolsound')" :label="$t('volumecontrolsound_label')">
            <i-switch v-model="proxy.VolumeControlSound" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 750px">
        <CellGroup>
          <Cell :title="$t('wheeledge')" :label="$t('wheeledge_label')">
            <i-switch v-model="proxy.WheelEdge.Open" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 750px">
        <CellGroup>
          <Cell :title="$t('clipboardmanager')" :label="$t('clipboardmanager_label')">
            <i-switch v-model="proxy.ClipboardManager.Open" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 750px">
        <CellGroup>
          <Cell :title="$t('ignorefullscreen')" :label="$t('ignorefullscreen_label')">
            <i-switch v-model="proxy.IgnoreFullScreen" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 750px">
        <CellGroup>
          <Cell :title="$t('wheelthrough')" :label="$t('wheelthrough_label')">
            <i-switch v-model="proxy.WheelThrough" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 750px">
        <CellGroup>
          <Cell :title="$t('wheelnatural')" :label="$t('wheelnatural_label')">
            <i-switch v-model="proxy.WheelNatural" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <!-- {{proxy.MouseGesture.Open}} -->
    <!-- {{cfg.MouseGesture.Open}} -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'fast-switch',
  computed: {
    ...mapGetters([
      'cfg'
    ]),
    proxy () {
      var ret = this.cfg.MouseGesture ? this.cfg : {
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
