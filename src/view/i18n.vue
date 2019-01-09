<template>
  <div>
    {{$t('LanguageSelect')}}：
    <Select v-model="settings.LanguageSelect" style="width:200px">
        <Option v-for="item in Languages" :value="item" :key="item">{{ $t(item) }}</Option>
    </Select>
    <Tabs>
      <TabPane v-for="(item,lang) in settings.Language" :label="lang" :name="lang" :key="lang">
        <Table :columns="lang_col" :data="LangTable(item)"></Table>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
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
          key: 'value'
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
      for (var k in this.settings.Language) {
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
    }
  }
}
</script>
