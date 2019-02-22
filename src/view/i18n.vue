<template>
  <div>
    {{$t('LanguageSelect')}}：
    <Select v-model="cfg.Language" style="width:200px">
        <Option v-for="item in Languages" :value="item" :key="item">{{$t(item)}}</Option>
    </Select>
    <Tabs size="small">
      <TabPane v-for="(item,lang) in cfg.Locales" :label="lang" :name="lang" :key="lang">
        <Table size="small" :columns="lang_col" :data="LangTable(item)">

          <template slot-scope="{ row, index }" slot="value">
            <TextEdit :value="row.value" @on-input="change(row.key, lang, $event)"></TextEdit>
            <!-- <Input :value="row.value" @on-change="change(row.key, lang, $event)" type="textarea" :autosize="true"/> -->
          </template>
        </Table>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import TextEdit from './components/text.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'i18n',
  components: {
    TextEdit
    // SelectEdit,
    // GestureEdit
  },
  data () {
    return {
      lang_col: [
        {
          title: 'key',
          key: 'key',
          width: 200
        },
        {
          title: 'value',
          slot: 'value',
          ellipsis: true
          // renderHeader: (h, params) => {
          //   return h('div', [
          //     h('em', 'value'),
          //     h('Icon', {
          //       props: {
          //         type: 'md-create'
          //       }
          //     })
          //   ])
          // },
          // render: (h, params) => {
          //   var row = this.cfg.Locales[params.row.lang]
          //   return h(TextEdit, {
          //     props: { value: row[params.row.key] },
          //     on: { input: (value) => { row[params.row.key] = value } }
          //   })
          // }
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'cfg'
    ]),
    Languages () {
      var list = ['auto']
      for (var k in this.cfg.Locales) {
        list.push(k)
      }
      return list
    }
  },
  methods: {
    LangTable (data) {
      var result = []
      for (var k in data) {
        result.push({
          key: k,
          value: data[k]
        })
      }
      return result
    },
    change (key, lang, value) {
      var row = this.cfg.Locales[lang]
      row[key] = value
    }
  }
}
</script>
