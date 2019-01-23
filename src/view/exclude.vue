<template>
  <div>
    <p>默认配置下，画手势Z可以添加程序到列表中</p>
    <p>在列表中的程序不会启用鼠标手势等功能，忽略大小写。</p>
    <p><b>当前排除程序列表：</b></p>
    <div style="padding: 5px 0px" v-for="(exclude,index) in cfg.Excludes" :key="exclude" >
      <card shadow :padding="8" style="width: 300px">
        <span>
        {{exclude}}
          <Button type="error" size="small" shape="circle" icon="md-close" style="display: inline-block;position:absolute;right: 8px;transform: translateY(-50%);top: 50%;" @click="remove(index)" ghost></Button>
        </span>
      </card>
    </div>
    <div style="width: 300px;padding: 5px 0px">
      <Input v-model="value" search enter-button="添加" placeholder="Photoshop.exe" @on-search="add" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'exclude',
  data () {
    return {
      value: ''
    }
  },
  computed: {
    ...mapGetters([
      'cfg'
    ])
  },
  methods: {
    remove (index) {
      this.cfg.Excludes.splice(index, 1)
    },
    add () {
      this.cfg.Excludes.push(this.value)
      this.value = ''
    }
  }
}
</script>
