<template>
  <div>
    <div @click="OpenEdit">
      <div style="display:flex;justify-content:space-between;align-items:Center;">
        <img :src="src" style="margin: 5px;width: 48px;height: 48px" />
        <span style="float:right;align-items:flex-end;color:#ccc">{{content}}</span>
      </div>
    </div>
<!--     <div @click="editing=true">
      <div style="display:flex;justify-content:space-between;align-items:Center;">
        <img :src="src" style="margin: 5px;width: 48px;height: 48px" />
        <span style="float:right;align-items:flex-end;color:#ccc">{{content}}</span>
      </div>
    </div>
    <Modal v-model="editing" @on-cancel="oncancel">
        <p slot="header" style="text-align:center">
            <span>选择手势</span>
        </p>
        <div>
          手势列表：
          <Select size="large" v-model="content" style="width:200px">
            <Option v-for="(gesture,index) in gestures" :key="index" :value="index" :label="index">
              <div style="display:flex;justify-content:space-between;align-items:Center;">
                <span><img :src="gesture" style="marginTop: 5px;width: 32px;height: 32px" /></span>
                <span style="float:right;align-items:flex-end;color:#ccc">{{index}}</span>
              </div>
            </Option>
          </Select>
        </div>
        <div slot="footer">
            <Button type="primary" size="large" long @click="save">确定</Button>
        </div>
    </Modal> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'gesture_edit',
  data () {
    return {
      editing: false,
      content: this.value
    }
  },
  props: {
    value: String
  },
  computed: {
    ...mapGetters([
      'gestures'
    ]),
    src () {
      return this.gestures[this.value] ? this.gestures[this.value] : this.gestures['placeholder']
    }
  },
  methods: {
    OpenEdit () {
      let instance = this.$Modal.newInstance({
        closable: false,
        maskClosable: false,
        footerHide: true,
        render: (h) => {
          let options = []
          for (var i in this.gestures) {
            options.push(
              h('Option', { props: { value: i, label: i } },
                [h('div', {
                  style: {
                    'display': 'flex',
                    'justify-content': 'space-between',
                    'align-items': 'Center'
                  }
                }, [
                  h('img', {
                    domProps: { src: this.gestures[i] },
                    style: {
                      marginTop: '5px',
                      width: '32px',
                      height: '32px'
                    }
                  }),
                  h('span', {
                    style: {
                      'float': 'right',
                      'align-items': 'flex-end',
                      'color': '#ccc'
                    }
                  }, i)
                ])]
                // h('div', "66666666666666")
                // h('div', [
                //   h('img', {
                //     // props: {value: params.row.endMonth, disabled: this.disabled},
                //   }, i),

                //   h('span', {
                //     // props: {value: params.row.endMonth, disabled: this.disabled},
                //   }, i)
                // ])
              )
            )
          }
          return h('Select', {
            props: {
              // type: 'textarea',
              // autosize: true,
              size: 'large',
              value: this.content
            },
            style:
            {
              // width:'300px'
            },
            on: {
              input: (val) => {
                this.content = val
              }
            }
          }, options)
        }
      })
      let options = {
        width: 350,
        title: '选择手势',
        icon: 'info',
        showCancel: true,
        onRemove: () => {
          instance = null
        },
        onOk: () => {
          this.$emit('input', this.content)
        },
        onCancel: () => {
          this.content = this.value
        }
      }
      instance.show(options)
    },
    save (val) {
      this.editing = false
      this.$emit('input', this.content)
    },
    oncancel () {
      // this.content = this.value
    }
  }
}
</script>
