<template>
  <div>
    <Form :label-width="100" @submit.native.prevent>
      <FormItem :label="$t('open_label')">
        <i-switch v-model="proxy.Open" />
      </FormItem>
      <FormItem :label="$t('ignoresingle_label')">
        <i-switch v-model="proxy.IgnoreSingle" />
      </FormItem>
      <FormItem :label="$t('backgroundcolor_label')">
        <ColorPicker v-model="proxy.BackgroundColor" recommend size="large"/>
      </FormItem>
      <FormItem :label="$t('textshadowcolor_label')">
        <ColorPicker v-model="proxy.TextShadowColor" recommend size="large"/>
      </FormItem>
      <FormItem :label="$t('textcolor_label')">
        <ColorPicker v-model="proxy.TextColor" recommend size="large"/>
      </FormItem>
    <Collapse>
        <Panel>
            {{$t('more_setting')}}
            <p slot="content">
      <FormItem :label="$t('x_label')">
        <InputNumber v-model="proxy.X" style="width: 300px"></InputNumber>
        <br />
        {{$t('x_tips')}}
      </FormItem>
      <FormItem :label="$t('y_label')">
        <InputNumber v-model="proxy.Y" style="width: 300px"></InputNumber>
        <br />
        {{$t('y_tips')}}
      </FormItem>
      <FormItem :label="$t('space_label')">
        <InputNumber v-model="proxy.Space" style="width: 300px"></InputNumber>
      </FormItem>
      <FormItem :label="$t('fontsize_label')">
        <Slider v-model="proxy.FontSize" :step="4" :min="8" :max="72" style="width: 300px"></Slider>
      </FormItem>
      <FormItem :label="$t('fade_label')">
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
