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
          <Cell :title="$t('corner')" :label="$t('corner_tips1')">
            <i-switch v-model="proxy.HotCorner.Open" slot="extra" />
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
          <Cell :title="$t('keycast')" :label="$t('keycast_label')">
            <i-switch v-model="proxy.Keycast.Open" slot="extra" />
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
          <Cell title="输入法状态显示" label="显示当前窗口输入法的中英文状态">
            <i-switch v-model="proxy.ShowIme" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <Col :md="24" :lg="12" style="margin: 5px 0px">
      <Card dis-hover :padding="0">
        <CellGroup>
          <Cell title="快速跳转" label="打开/保存对话框自动使用最近资源管理器目录">
            <i-switch v-model="proxy.QuickJump" slot="extra" />
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
            <i-switch v-model="proxy.ShowTrayIcon" slot="extra" :before-change="BeforeShowTrayIconChange" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <!-- {{proxy.MouseGesture.Open}} -->
    <!-- {{cfg.MouseGesture.Open}} -->
    </Row>
    <Collapse style="margin-top: 10px;" @on-change="handleCollpasedChange">
        <Panel>
            {{$t('more_setting')}}
            <p slot="content">
    <Row :gutter="10">
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
          <Cell :title="$t('fastpaste')" :label="$t('fastpaste_label')">
            <i-switch v-model="proxy.FastPaste" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    <Col :md="24" :lg="12" style="margin: 5px 0px">
      <Card dis-hover :padding="0">
        <CellGroup>
          <Cell :title="$t('administrator')" :label="$t('administrator_label')">
            <i-switch v-model="proxy.Administrator" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </Col>
    </Row>
    <Form style="width:50%;padding: 5px;margin-top: 10px;" label-position="top">
      <FormItem :label="$t('volumecontrolsound')">
        <Select v-model="proxy.VolumeSoundIndex">
            <Option v-for="item in VolumeSoundList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem :label="$t('keysound')">
        <Select v-model="proxy.KeySoundIndex">
            <Option v-for="item in KeySoundList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem :label="$t('ocrapi')">
        <Select v-model="proxy.OcrService">
            <Option v-for="item in OcrApiList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
    </Form>
            </p>
        </Panel>
    </Collapse>
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
  data () {
    return {
    }
  },
  methods: {
    handleCollpasedChange (state) {
      if (state.length) {
        setTimeout(() => {
          var content = document.querySelector('.content-wrapper')
          content.scrollTo({
            top: content.scrollHeight - content.clientHeight,
            behavior: 'smooth'
          })
        }, 250)
      }
    },
    BeforeShowTrayIconChange () {
      if (!this.proxy.ShowTrayIcon) return true

      return new Promise((resolve) => {
        this.$Modal.confirm({
          title: this.$t('warning'),
          content: this.$t('icon_warning'),
          onOk: () => {
            resolve()
          }
        })
      })
    }
  },
  computed: {
    ...mapGetters([
      'cfg'
    ]),
    VolumeSoundList () {
      return [{
        value: 0,
        label: this.$t('volume0')
      },
      {
        value: 1,
        label: this.$t('volume1')
      }]
    },
    KeySoundList () {
      return [{
        value: 0,
        label: this.$t('key0')
      },
      {
        value: 1,
        label: this.$t('key1')
      },
      {
        value: 2,
        label: this.$t('key2')
      },
      {
        value: 3,
        label: this.$t('key3')
      },
      {
        value: 4,
        label: this.$t('key4')
      }]
    },
    OcrApiList () {
      return [
        {
          value: 0,
          label: this.$t('自有')
        }, {
          value: 1,
          label: this.$t('有道')
        },
        {
          value: 2,
          label: this.$t('飞桨')
        }]
    },
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
        HotCorner: { Open: false },
        ShowTrayIcon: true,
        OcrService: 0
      }
      return ret
    }
  }
}
</script>
