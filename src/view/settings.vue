<template>
  <div>
    <Form :label-width="100" @submit.native.prevent>
      <FormItem :label="$t('open_label')">
        <i-switch v-model="proxy.Open" />
      </FormItem>
      <FormItem :label="$t('addmode_label')">
        <i-switch v-model="proxy.AddMode" />
        <br />
        {{$t('addmode_tip')}}
      </FormItem>
      <FormItem :label="$t('drawcolor_label')">
        <ColorPicker v-model="proxy.DrawColor" recommend size="large"/>
      </FormItem>
      <FormItem :label="$t('drawresult_label')">
        <i-switch v-model="proxy.DrawResult" />
      </FormItem>
      <FormItem :label="$t('drawtrace_label')">
        <i-switch v-model="proxy.DrawTrace" />
      </FormItem>
      <FormItem :label="$t('tracearrow_label')">
        <i-switch v-model="proxy.TraceArrow" />
      </FormItem>
      <FormItem :label="$t('tracewidth_label')">
        <Slider v-model="proxy.TraceWidth" :min="1" :max="10" style="width: 300px"></Slider>
      </FormItem>
    <Collapse>
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
