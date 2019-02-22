<template>
  <div>
    <Form :label-width="100" @submit.native.prevent>
      <FormItem label="开启">
        <i-switch v-model="proxy.Open" />
      </FormItem>
      <FormItem label="忽略单字符">
        <i-switch v-model="proxy.IgnoreSingle" />
      </FormItem>
      <FormItem label="背景颜色">
        <ColorPicker v-model="proxy.BackgroundColor" recommend size="large"/>
      </FormItem>
      <FormItem label="阴影颜色">
        <ColorPicker v-model="proxy.TextShadowColor" recommend size="large"/>
      </FormItem>
      <FormItem label="文字颜色">
        <ColorPicker v-model="proxy.TextColor" recommend size="large"/>
      </FormItem>
    <Collapse>
        <Panel>
            更多设置
            <p slot="content">
      <FormItem label="X偏移">
        <InputNumber v-model="proxy.X" style="width: 300px"></InputNumber>
        <br />
        窗口相对屏幕左边偏移，如果是负数则相对右边
      </FormItem>
      <FormItem label="Y偏移">
        <InputNumber v-model="proxy.Y" style="width: 300px"></InputNumber>
        <br />
        窗口相对屏幕顶部偏移，如果是负数则相对底部
      </FormItem>
      <FormItem label="间距">
        <InputNumber v-model="proxy.Space" style="width: 300px"></InputNumber>
      </FormItem>
      <FormItem label="字体大小">
        <Slider v-model="proxy.FontSize" :step="4" :min="8" :max="72" style="width: 300px"></Slider>
      </FormItem>
      <FormItem label="消失时间">
        <Slider v-model="proxy.Fade" :min="1" :max="10" style="width: 300px"></Slider>
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
  name: 'keycast',
  computed: {
    ...mapGetters([
      'cfg'
    ]),
    proxy () {
      // return Object.assign({}, this.cfg.Keycast)
      return this.cfg.Keycast ? this.cfg.Keycast : {
        // temporary: true,
        IgnoreSingle: false,
        Open: false,
        Fade: 5,
        FontSize: 32,
        Space: 50,
        Y: 84,
        X: 40,
        TextColor: '#FFFFFF',
        TextShadowColor: '#141414',
        BackgroundColor: '#353535'
      }
    }
  }
}
</script>
