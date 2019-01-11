<template>
  <div>
    <Form :label-width="100">
      <FormItem label="开启">
        <i-switch v-model="proxy.Open" />
      </FormItem>
      <FormItem label="触发距离">
        <InputNumber v-model="proxy.StartDistance" style="width: 300px"></InputNumber>
        （像素）
      </FormItem>
      <FormItem label="停顿超时">
        <InputNumber v-model="proxy.Timeout" style="width: 300px"></InputNumber>
        （毫秒）
      </FormItem>
      <FormItem label="还原事件">
        <i-switch v-model="proxy.RestoreEvent" />
      </FormItem>
      <FormItem label="失败颜色">
        <ColorPicker v-model="proxy.FailColor" recommend size="large"/>
      </FormItem>
      <FormItem label="手势颜色">
        <ColorPicker v-model="proxy.DrawColor" recommend size="large"/>
      </FormItem>
      <FormItem label="显示识别结果">
        <i-switch v-model="proxy.DrawResult" />
      </FormItem>
      <FormItem label="显示鼠标轨迹">
        <i-switch v-model="proxy.DrawTrace" />
      </FormItem>
      <FormItem label="显示轨迹箭头">
        <i-switch v-model="proxy.TraceArrow" />
      </FormItem>
      <FormItem label="轨迹宽度">
        <Slider v-model="proxy.TraceWidth" :min="1" :max="10" style="width: 300px"></Slider>
      </FormItem>
      <FormItem label="灵敏度">
        <Slider v-model="proxy.Sensitive" :step="5" :max="100" style="width: 300px"></Slider>
      </FormItem>
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
