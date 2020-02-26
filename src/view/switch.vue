<template>
  <div>
    <Row :gutter="10">
    <Col :md="24" :lg="12" style="margin: 5px 0px">
      <Card dis-hover :padding="0">
        <CellGroup>
          <Cell :title="$t('mousegesture')" :label="$t('mousegesture_label')">
            <i-switch v-model="proxy.MouseGesture.Open" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <Col :md="24" :lg="12" style="margin: 5px 0px">
      <Card dis-hover :padding="0">
        <CellGroup>
          <Cell :title="$t('wheelswitch')" :label="$t('wheelswitch_label')">
            <i-switch v-model="proxy.MouseGesture.WheelSwitch" slot="extra" :disabled="!proxy.MouseGesture.Open"/>
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <Col :md="24" :lg="12" style="margin: 5px 0px">
      <Card dis-hover :padding="0">
        <CellGroup>
          <Cell :title="$t('wheeledge')" :label="$t('wheeledge_label')">
            <i-switch v-model="proxy.WheelEdge.Open" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <Col :md="24" :lg="12" style="margin: 5px 0px">
      <Card dis-hover :padding="0">
        <CellGroup>
          <Cell :title="$t('keycast')" :label="$t('keycast_label')">
            <i-switch v-model="proxy.Keycast.Open" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <Col :md="24" :lg="12" style="margin: 5px 0px">
      <Card dis-hover :padding="0">
        <CellGroup>
          <Cell :title="$t('clipboardmanager')" :label="$t('clipboardmanager_label')">
            <i-switch v-model="proxy.ClipboardManager.Open" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <Col :md="24" :lg="12" style="margin: 5px 0px">
      <Card dis-hover :padding="0">
        <CellGroup>
          <Cell :title="$t('autoclip')" :label="$t('autoclip_label')">
            <i-switch v-model="proxy.AutoClip" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <Col :md="24" :lg="12" style="margin: 5px 0px">
      <Card dis-hover :padding="0">
        <CellGroup>
          <Cell :title="$t('capslockled')" :label="$t('capslockled_label')">
            <i-switch v-model="proxy.CapsLockLed" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <Col :md="24" :lg="12" style="margin: 5px 0px">
      <Card dis-hover :padding="0">
        <CellGroup>
          <Cell :title="$t('capsunlock')" :label="$t('capsunlock_label')">
            <i-switch v-model="proxy.CapsUnlock" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <Col :md="24" :lg="12" style="margin: 5px 0px">
      <Card dis-hover :padding="0">
        <CellGroup>
          <Cell :title="$t('altdrag')" :label="$t('altdrag_label')">
            <i-switch v-model="proxy.AltDrag" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <Col :md="24" :lg="12" style="margin: 5px 0px">
      <Card dis-hover :padding="0">
        <CellGroup>
          <Cell :title="$t('wheelaltcontrol')" :label="$t('wheelaltcontrol_label')">
            <i-switch v-model="proxy.WheelAltControl" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <Col :md="24" :lg="12" style="margin: 5px 0px">
      <Card dis-hover :padding="0">
        <CellGroup>
          <Cell :title="$t('volumecontrolsound')" :label="$t('volumecontrolsound_label')">
            <i-switch v-model="proxy.VolumeControlSound" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <Col :md="24" :lg="12" style="margin: 5px 0px">
      <Card dis-hover :padding="0">
        <CellGroup>
          <Cell :title="$t('keysound')" :label="$t('keysound_label')">
            <i-switch v-model="proxy.KeySound" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <Col :md="24" :lg="12" style="margin: 5px 0px">
      <Card dis-hover :padding="0">
        <CellGroup>
          <Cell :title="$t('ignorefullscreen')" :label="$t('ignorefullscreen_label')">
            <i-switch v-model="proxy.IgnoreFullScreen" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <Col :md="24" :lg="12" style="margin: 5px 0px">
      <Card dis-hover :padding="0">
        <CellGroup>
          <Cell :title="$t('showtrayicon')" :label="$t('showtrayicon_label')">
            <i-switch v-model="proxy.ShowTrayIcon" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <Col :md="24" :lg="12" style="margin: 5px 0px">
      <Card dis-hover :padding="0">
        <CellGroup>
          <Cell :title="$t('wheelthrough')" :label="$t('wheelthrough_label')">
            <i-switch v-model="proxy.WheelThrough" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <Col :md="24" :lg="12" style="margin: 5px 0px">
      <Card dis-hover :padding="0">
        <CellGroup>
          <Cell :title="$t('wheelnatural')" :label="$t('wheelnatural_label')">
            <i-switch v-model="proxy.WheelNatural" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <!-- {{proxy.MouseGesture.Open}} -->
    <!-- {{cfg.MouseGesture.Open}} -->
    </Row>
  </div>
</template>

<style>
.ivu-cell-title
{
    font-size: 16px;
    padding: 8px 0px 10px 0px;
}
</style>

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
        AltDrag: true,
        VolumeControlSound: false,
        WheelEdge: { Open: false },
        ClipboardManager: { Open: false },
        IgnoreFullScreen: false,
        WheelThrough: false,
        WheelNatural: false,
        ShowTrayIcon: true
      }
      return ret
    }
  }
}
</script>
