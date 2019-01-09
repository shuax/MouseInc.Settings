<template>
  <div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 500px">
        <CellGroup>
          <Cell title="鼠标手势" label="按住鼠标右键持续移动画出形状，放开右键即可触发对应动作">
            <i-switch v-model="proxy.MouseGesture.Open" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 500px">
        <CellGroup>
          <Cell title="滚轮切换" label="按住鼠标右键时，滚动滚轮可以进行切换标签页操作">
            <i-switch v-model="proxy.MouseGesture.WheelSwitch" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 500px">
        <CellGroup>
          <Cell title="按键回显" label="在屏幕上显示键盘按键，方便录制教程">
            <i-switch v-model="proxy.Keycast.Open" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 500px">
        <CellGroup>
          <Cell title="快速音量调节" label="按住Alt时滚动滚轮调节音量大小，按下滚轮禁音">
            <i-switch v-model="proxy.WheelAltControl" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 500px">
        <CellGroup>
          <Cell title="音效回馈" label="音量调节时播放音效">
            <i-switch v-model="proxy.VolumeControlSound" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 500px">
        <CellGroup>
          <Cell title="边缘滚动" label="鼠标滚轮在屏幕四个边滚动、按下时触发的功能">
            <i-switch v-model="proxy.WheelEdge.Open" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 500px">
        <CellGroup>
          <Cell title="复制增强" label="选中文字快速按两次Ctrl+C即可呼出快捷菜单">
            <i-switch v-model="proxy.ClipboardManager.Open" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 500px">
        <CellGroup>
          <Cell title="忽略全屏" label="当前程序如果是一个全屏程序，会自动暂停MouseInc功能">
            <i-switch v-model="proxy.IgnoreFullScreen" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 500px">
        <CellGroup>
          <Cell title="滚轮穿透" label="不在焦点的窗口可以自由滚动，WIN10自带">
            <i-switch v-model="proxy.WheelThrough" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <div style="padding: 0px 0px 20px 0px">
      <Card shadow :padding="0" style="width: 100%;max-width: 500px">
        <CellGroup>
          <Cell title="自然滚动" label="滚轮反向，和Mac OS X一致">
            <i-switch v-model="proxy.WheelNatural" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <!-- {{proxy.MouseGesture.Open}} -->
    <!-- {{settings.MouseGesture.Open}} -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'sw',
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
