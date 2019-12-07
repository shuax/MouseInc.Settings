<template>
  <div>
    <p style="padding-bottom: 10px;">{{$t('exclude_tips1')}}</p>
    <p style="padding-bottom: 10px;">{{$t('exclude_tips2')}}</p>
    <List :header="$t('exclude_tips3')" item-layout="vertical" size="small">
        <ListItem v-for="(exclude,index) in cfg.Excludes" :key="exclude">
          {{exclude}}
          <template slot="extra">
            <li>
                <a @click="remove(index)">{{$t('delete')}}</a>
            </li>
          </template>
        </ListItem>
        <ListItem>
          <Input v-model="value" search :enter-button="$t('add')" placeholder="Photoshop.exe" @on-search="add" />
        </ListItem>
    </List>
<!--     <div style="padding: 5px 0px" v-for="(exclude,index) in cfg.Excludes" :key="exclude" >
      <card shadow :padding="8" style="width: 300px">
        <span>
        {{exclude}}
          <Button type="error" size="small" shape="circle" icon="md-close" style="display: inline-block;position:absolute;right: 8px;transform: translateY(-50%);top: 50%;" @click="remove(index)" ghost></Button>
        </span>
      </card>
    </div>
    <div style="width: 400px;padding: 5px 0px">
      <Input v-model="value" search :enter-button="$t('add')" placeholder="Photoshop.exe" @on-search="add" />
    </div> -->
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
      if (this.value.indexOf('.') === -1) {
        this.$Message.error(this.$t('exclude_warning'))
        return
      }
      this.cfg.Excludes.push(this.value)
      this.value = ''
    }
  }
}
</script>
