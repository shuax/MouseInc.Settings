<template>
  <div>
    <p style="padding-bottom: 10px;">这里列出所有手势的形状和名称，打开 <router-link to="settings">添加模式</router-link> 后可以添加未识别的手势</p>
    <Row :gutter="10">
      <Col span="6" v-for="(info, i) in cfg.Gestures" :key="`info-${i}`" style="padding-bottom: 10px;">
        <Card shadow>
          <tooltip content="删除" style="float: right; color: red; cursor: pointer"><Icon type="md-close" @click="remove(info)" /></tooltip>
          <div style="text-align:center" class="gestures">
            <img :src="imgsrc(info)" style="width: 48px;height: 48px;">
            <Input :value="info.Sign" @on-change="change(info, $event)" />
          </div>
        </Card>
      </Col>
    </Row>
    <!-- {{gestures}} -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'list',
  methods: {
    imgsrc (info) {
      return this.gestures[info.Sign] ? this.gestures[info.Sign] : this.gestures['placeholder']
    },
    change (info, event) {
      var value = event.target.value
      this.gestures[value] = this.gestures[info.Sign]
      delete this.gestures[info.Sign]
      info.Sign = value
    },
    remove (info) {
      delete this.gestures[info.Sign]
      this.cfg.Gestures.splice(this.cfg.Gestures.findIndex(item => item.Sign === info.Sign), 1)
    }
  },
  computed: {
    ...mapGetters([
      'cfg',
      'gestures'
    ])
  }
}
</script>

<style>
.gestures input { text-align:center }
</style>
