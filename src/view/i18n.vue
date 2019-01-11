<template>
  <div>
    {{$t('LanguageSelect')}}：
    <Select v-model="settings.Language" style="width:200px">
        <Option v-for="item in Languages" :value="item" :key="item">{{$t(item)}}</Option>
    </Select>
    <Tabs>
      <TabPane v-for="(item,lang) in settings.Locales" :label="lang" :name="lang" :key="lang">
        <Table size="small" :columns="lang_col" :data="LangTable(item, lang)"></Table>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import TextEdit from './text_edit.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'i18n',
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
          key: 'value',
          render: (h, params) => {
            var row = this.settings.Locales[params.row.lang]
            return h(TextEdit, {
              props: { value: row[params.row.key] },
              on: { input: (value) => { row[params.row.key] = value } }
            })
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    Languages () {
      var list = ['auto']
      for (var k in this.settings.Locales) {
        list.push(k)
      }
      return list
    }
  },
  methods: {
    LangTable (data, lang) {
      var result = []
      for (var k in data) {
        result.push({
          key: k,
          lang: lang
        })
      }
      return result
    }
  }
}
</script>
