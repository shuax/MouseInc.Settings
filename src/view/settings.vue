<template>
  <div>
    <Form :label-width="100" @submit.native.prevent>
      <FormItem :label="$t('open_label')">
        <i-switch v-model="proxy.Open" />
      </FormItem>
    </Form>
    <Form :label-width="100" @submit.native.prevent :disabled="!proxy.Open">
      <FormItem :label="$t('addmode_label')">
        <i-switch v-model="proxy.AddMode" />
        <br />
        {{$t('addmode_tip')}}
      </FormItem>
      <FormItem :label="$t('drawcolor_label')">
        <ColorPicker v-model="proxy.DrawColor" recommend size="large" :disabled="proxy.RandColor"/>
        <span style="padding: 0px 0px 0px 20px">
          {{$t('randcolor_label')}}
          <i-switch v-model="proxy.RandColor" />
        </span>
      </FormItem>
      <FormItem :label="$t('drawtrace_label')">
        <i-switch v-model="proxy.DrawTrace" />
      </FormItem>
      <FormItem :label="$t('tracearrow_label')">
        <i-switch v-model="proxy.TraceArrow" :disabled="!proxy.DrawTrace"/>
      </FormItem>
      <FormItem :label="$t('tracewidth_label')">
        <Slider v-model="proxy.TraceWidth" :min="1" :max="10" style="width: 300px" :marks="TraceWidthMarks" :disabled="!proxy.DrawTrace"></Slider>
      </FormItem>
      <FormItem :label="$t('drawresult_label')">
        <i-switch v-model="proxy.DrawResult" />
      </FormItem>
      <FormItem :label="$t('fontsize_label')">
        <Slider v-model="proxy.FontSize" :step="2" :min="8" :max="72" style="width: 300px" :marks="FontSizeMarks" :disabled="!proxy.DrawResult"></Slider>
      </FormItem>
      <FormItem :label="$t('offset_label')">
        <InputNumber v-model="proxy.Offset" style="width: 300px" :disabled="!proxy.DrawResult"></InputNumber>
        {{$t('offset_tip')}}
      </FormItem>
    <Collapse @on-change="handleCollpasedChange">
        <Panel>
            {{$t('more_setting')}}
            <p slot="content">
      <FormItem :label="$t('failcolor_label')">
        <ColorPicker v-model="proxy.FailColor" recommend size="large"/>
      </FormItem>
      <FormItem :label="$t('startdistance_label')">
        <InputNumber v-model="proxy.StartDistance" style="width: 300px"></InputNumber>
        {{$t('startdistance_unit')}}
        <br />
        {{$t('startdistance_tip')}}
      </FormItem>
      <FormItem :label="$t('timeout_label')">
        <InputNumber v-model="proxy.Timeout" style="width: 300px"></InputNumber>
        {{$t('timeout_unit')}}
        <br />
        {{$t('timeout_tip')}}
      </FormItem>
      <FormItem :label="$t('restoreevent_label')">
        <i-switch v-model="proxy.RestoreEvent" />
        <br />
        {{$t('restoreevent_tip')}}
      </FormItem>
      <FormItem :label="$t('sensitive_label')">
        <Slider v-model="proxy.Sensitive" :step="5" :max="100" style="width: 300px" :marks="SensitiveMarks"></Slider>
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
  data () {
    return {
      FontSizeMarks: {
        26: '默认'
      },
      TraceWidthMarks: {
        3: '默认'
      },
      SensitiveMarks: {
        0: '低',
        50: '默认',
        100: '高'
      }
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
    }
  },
  computed: {
    ...mapGetters([
      'cfg'
    ]),
    proxy () {
      var default_cfg = {
        // temporary: true,
        Open: false,
        StartDistance: 10,
        Timeout: 1000,
        RestoreEvent: false,
        AddMode: false,
        RandColor: false,
        FailColor: '#CAD0D3',
        DrawColor: '#E47542',
        DrawResult: true,
        DrawTrace: true,
        TraceWidth: 3,
        FontSize: 26,
        Offset: 150,
        TraceArrow: true,
        Sensitive: 50
      }
      if (!this.cfg.MouseGesture) return default_cfg
      var cfg = this.cfg.MouseGesture
      for (var k in default_cfg) {
        if (!cfg.hasOwnProperty(k)) {
          cfg[k] = default_cfg[k]
        }
      }
      return cfg
    }
  }
}
</script>
