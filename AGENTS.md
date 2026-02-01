# AGENTS.md - MouseInc Settings

## 项目概述
MouseInc 配置界面的 Vue 2.x 项目。基于 iview-admin 框架构建。
使用 ViewUI（前身为 iView）组件库和 Vuex 进行状态管理。

## 构建/开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器（自动打开浏览器）
npm run dev

# 生产环境构建
npm run build

# 运行代码检查（ESLint，使用 Vue 标准配置）
npm run lint

# 运行单元测试（Mocha + Chai）
npm run test:unit

# 运行端到端测试（Cypress）
npm run test:e2e
```

### 运行单个测试
单元测试使用 Mocha。运行特定测试文件：
```bash
# 运行匹配的测试
npm run test:unit -- --grep "测试名称模式"

# 运行特定文件中的测试
npm run test:unit tests/unit/HelloWorld.spec.js
```

## 代码风格指南

### 格式规范
- 缩进：2 个空格（在 .editorconfig 中配置）
- 换行符：LF
- 字符集：UTF-8
- 自动去除行尾空格：启用
- 文件末尾插入空行：启用

### JavaScript/Vue 风格
- ESLint：`plugin:vue/essential` + `@vue/standard`
- 解析器：babel-eslint
- 分号：可选（标准风格）
- 引号：优先使用单引号
- 尾随逗号：不要求

### 命名规范
- 组件：PascalCase（例如 `HelloWorld.vue`）
- 文件：camelCase 或 kebab-case（例如 `list.vue`、`error-content.vue`）
- 变量：camelCase
- 常量：UPPER_SNAKE_CASE 或 camelCase
- 方法：camelCase（建议使用 动词-名词 格式）
- Vuex getters/mapGetters：camelCase

### 导入规范
- 顺序：先外部库，再内部别名
- 使用 `@/` 别名导入 src 目录
- 使用 `_c` 别名导入 src/components 目录
- 示例：
```javascript
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Component from '@/components/Component'
```

### Vue 组件结构
```vue
<template>
  <!-- 模板内容 -->
</template>

<script>
export default {
  name: 'ComponentName',
  props: {},
  data () {
    return {}
  },
  computed: {},
  methods: {}
}
</script>

<style lang="less">
/* 组件特定样式 */
</style>
```

### 错误处理
- 使用 Vue 的错误处理模式
- 仅在开发环境输出控制台错误（通过 `process.env.NODE_ENV` 检查生产环境）
- 组件错误：异步操作使用 try-catch
- Vuex actions：在 actions 内部处理错误，需要时提交错误状态

### ESLint 规则（例外情况）
- `generator-star-spacing`：禁用（用于 async-await）
- `no-debugger`：生产环境报错，开发环境关闭
- `vue/no-parsing-error`：允许无效结束标签
- `no-undef`：禁用
- `camelcase`：禁用（允许 snake_case 用于外部 API）

## 项目结构

```
src/
├── components/       # 可复用的 Vue 组件
├── view/            # 页面级组件
│   ├── components/  # 视图特定组件
│   ├── single-page/ # 单页面视图
│   └── error-page/  # 错误页面组件
├── router/          # Vue Router 配置
├── locale/          # i18n 翻译（zh-CN、zh-TW、en-US）
├── libs/            # 工具库
├── config/          # 配置文件
├── store/           # Vuex 状态管理
├── App.vue          # 根组件
└── main.js          # 应用入口点

tests/
├── unit/            # 单元测试（Mocha + Chai）
└── e2e/             # 端到端测试（Cypress）
```

## 主要依赖
- Vue 2.6.x
- Vue Router 3.x
- Vuex 3.x
- ViewUI（iView）4.x
- Axios 0.21.x
- Vue i18n 7.x
- CodeMirror 5.x

## 预提交钩子
- lint-staged 在提交前对 *.js 和 *.vue 文件运行 ESLint
- 自动修复并暂存更改

## 别名
- `@/` -> `src/`
- `_c/` -> `src/components/`

## 测试说明
- 单元测试使用 Mocha + Chai + @vue/test-utils
- 端到端测试使用 Cypress
- 测试文件遵循 `*.spec.js` 命名约定
- 位于 `tests/unit/` 和 `tests/e2e/`

## 调试
按住 SHIFT 键同时打开 MouseInc 设置，可以打开 localhost 开发版本进行调试。

## CI/CD
- 已配置 Travis CI（.travis.yml）
- 推送到 master 分支时自动构建
