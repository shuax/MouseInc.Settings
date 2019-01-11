<template>
  <div>
    <p>默认配置下，画手势Z可以添加程序到列表中</p>
    <p><b>当前排除程序列表：</b></p>
    <div style="padding: 5px 0px" v-for="(exclude,index) in cfg.Excludes" :key="exclude" >
      <card shadow :padding="8" style="width: 180px">
        <span>
        {{exclude}}
          <Button type="primary" size="small" shape="circle" icon="md-close" style="display: inline-block;position:absolute;right: 8px;transform: translateY(-50%);top: 50%;" @click="remove(index)"></Button>
        </span>
      </card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'exclude',
  computed: {
    ...mapGetters([
      'cfg'
    ])
  },
  methods: {
    remove (index) {
      this.cfg.Excludes.splice(index, 1)
    }
  }
}
</script>
