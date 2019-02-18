<template>
  <div>
    <Form :label-width="100">
      <FormItem label="开启">
        <i-switch v-model="proxy.Open" />
      </FormItem>
      <FormItem label="添加模式">
        <i-switch v-model="proxy.AddMode" />
        <br />
        开启后画出未识别的手势将会打开添加界面
      </FormItem>
      <FormItem label="手势颜色">
        <ColorPicker v-model="proxy.DrawColor" recommend size="large"/>
      </FormItem>
      <FormItem label="显示操作">
        <i-switch v-model="proxy.DrawResult" />
      </FormItem>
      <FormItem label="显示轨迹">
        <i-switch v-model="proxy.DrawTrace" />
      </FormItem>
      <FormItem label="轨迹箭头">
        <i-switch v-model="proxy.TraceArrow" />
      </FormItem>
      <FormItem label="轨迹宽度">
        <Slider v-model="proxy.TraceWidth" :min="1" :max="10" style="width: 300px"></Slider>
      </FormItem>
    <Collapse>
        <Panel>
            更多设置
            <p slot="content">
      <FormItem label="失败颜色">
        <ColorPicker v-model="proxy.FailColor" recommend size="large"/>
      </FormItem>
      <FormItem label="触发距离">
        <InputNumber v-model="proxy.StartDistance" style="width: 300px"></InputNumber>
        （像素）
        <br />
        按下鼠标右键以后移动超过这个距离才会开启手势
      </FormItem>
      <FormItem label="停顿超时">
        <InputNumber v-model="proxy.Timeout" style="width: 300px"></InputNumber>
        （毫秒）
        <br />
        鼠标超过这个时间未移动，会中断手势
      </FormItem>
      <FormItem label="还原事件">
        <i-switch v-model="proxy.RestoreEvent" />
        <br />
        手势失效时是否还原鼠标按下事件
      </FormItem>
      <FormItem label="识别灵敏度">
        <Slider v-model="proxy.Sensitive" :step="5" :max="100" style="width: 300px"></Slider>
      </FormItem>
            </p>
        </Panel>
    </Collapse>
    </Form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'cfg',
  computed: {
    ...mapGetters([
      'cfg'
    ]),
    proxy () {
      return this.cfg.MouseGesture ? this.cfg.MouseGesture : {
        // temporary: true,
        Open: false,
        StartDistance: 10,
        Timeout: 1000,
        RestoreEvent: false,
        AddMode: false,
        FailColor: '#CAD0D3',
        DrawColor: '#E47542',
        DrawResult: true,
        DrawTrace: true,
        TraceWidth: 3,
        TraceArrow: true,
        Sensitive: 50
      }
    }
  }
}
</script>
