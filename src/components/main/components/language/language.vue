<template>
  <div>
    <el-dropdown trigger="click" @command="selectLang">
      <a href="javascript:void(0)" style="display: flex; align-items: center; color: #606266; text-decoration: none; padding: 0 8px; border-radius: 4px; transition: all 0.3s;">
        <el-icon :size="18"><ChatLineRound /></el-icon>
        <span style="margin: 0 8px; font-weight: 500;">{{ title }}</span>
        <el-icon :size="14"><ArrowDown /></el-icon>
      </a>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(value, key) in localList"
            :command="key"
            :key="`lang-${key}`"
          >
            {{ value }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChatLineRound, ArrowDown } from '@element-plus/icons-vue'

const props = defineProps({
  lang: {
    type: String,
    default: 'zh-CN'
  }
})

const emit = defineEmits(['on-lang-change'])

const { locale: i18nLocale } = useI18n()

const langList = {
  'zh-CN': '语言',
  'zh-TW': '語言',
  'en-US': 'Lang'
}

const localList = {
  'zh-CN': '中文简体',
  'zh-TW': '中文繁体',
  'en-US': 'English'
}

const title = computed(() => {
  return langList[props.lang] || '语言'
})

watch(
  () => props.lang,
  (newLang) => {
    i18nLocale.value = newLang
  }
)

const selectLang = (name) => {
  emit('on-lang-change', name)
}
</script>

<style scoped>
a:hover {
  color: #409eff;
}
</style>
