import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    rules: {
      // 关闭 Vue 多根元素检查（Vue 3 支持多根）
      'vue/no-multiple-template-root': 'off',
      // 关闭组件名多词检查（项目遗留单文件组件）
      'vue/multi-word-component-names': 'off',
      // TypeScript 使用 any 警告但不报错
      '@typescript-eslint/no-explicit-any': 'warn',
      // 未使用变量警告
      '@typescript-eslint/no-unused-vars': ['warn', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_'
      }],
      // 允许使用 require
      '@typescript-eslint/no-require-imports': 'off',
      // 允许未使用表达式（某些行内逻辑需要）
      '@typescript-eslint/no-unused-expressions': 'off',
      // 允许未使用参数（以下划线开头的参数）
      'no-unused-vars': ['warn', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_'
      }],
      // 允许 console.log 在开发环境中
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      // 允许 debugger 在开发环境中
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    }
  }
)
