<template>
  <div>
    <p>这里是手势的形状和名称，打开添加模式后可以添加未识别的手势</p>
    <Table size="small" :columns="list_col" :data="cfg.Gestures"></Table>
    <!-- {{gestures}} -->
  </div>
</template>

<script>
import TextEdit from './text_edit.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'list',
  data () {
    return {
      list_col: [
        {
          title: '手势',
          key: '',
          align: 'center',
          width: 120,
          render: (h, params) => {
            // console.log(h, params.row.Sign, this.gestures[params.row.Sign])
            // var row = this.proxy.Menu[params.index]
            return h('img', {
              domProps: { src: this.gestures[params.row.Sign] ? this.gestures[params.row.Sign] : this.gestures['placeholder'] },
              style: {
                marginTop: '5px',
                width: '48px',
                height: '48px'
              }
            })
          }
        },
        {
          title: '名称',
          key: '',
          renderHeader: (h, params) => {
            return h('div', [
              h('em', '名称'),
              h('Icon', {
                props: {
                  type: 'md-create'
                }
              })
            ])
          },
          render: (h, params) => {
            var row = this.cfg.Gestures[params.index]
            return h(TextEdit, {
              props: { value: row.Sign },
              on: {
                input: (value) => {
                  this.gestures[value] = this.gestures[row.Sign]
                  delete this.gestures[row.Sign]
                  row.Sign = value
                }
              }
            })
          }
        }
      ]
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
