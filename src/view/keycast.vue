<template>
  <div>
    <Form :label-width="100">
      <FormItem label="开启">
        <i-switch v-model="proxy.Open" />
      </FormItem>
      <FormItem label="忽略单字符">
        <i-switch v-model="proxy.IgnoreSingle" />
      </FormItem>
      <FormItem label="X偏移">
        <InputNumber v-model="proxy.X" style="width: 300px"></InputNumber>
      </FormItem>
      <FormItem label="Y偏移">
        <InputNumber v-model="proxy.Y" style="width: 300px"></InputNumber>
      </FormItem>
      <FormItem label="间距">
        <InputNumber v-model="proxy.Space" style="width: 300px"></InputNumber>
      </FormItem>
      <FormItem label="字体大小">
        <InputNumber v-model="proxy.FontSize" style="width: 300px"></InputNumber>
      </FormItem>
      <FormItem label="消失时间">
        <InputNumber v-model="proxy.Fade" style="width: 300px"></InputNumber>
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
