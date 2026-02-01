# AGENTS.md - MouseInc Settings

## 项目概述
MouseInc 配置界面的 Vue 3.x 项目。基于 Vite 构建工具，使用 Element Plus 组件库和 Pinia 状态管理。

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

# 预览生产构建
npm run preview
```

## 技术栈

### 主要依赖
- Vue 3.5.x
- Vue Router 4.x
- Pinia 2.x
- Element Plus 2.x
- Vue I18n 10.x
- Vite 5.x
- Axios 0.21.x
- js-beautify 1.x

### 开发工具
- ESLint + @vue/eslint-config-standard
- Stylelint + stylelint-config-standard

## 代码风格指南

### 格式规范
- 缩进：2 个空格（在 .editorconfig 中配置）
- 换行符：LF
- 字符集：UTF-8
- 自动去除行尾空格：启用
- 文件末尾插入空行：启用

### JavaScript/Vue 风格
- ESLint：`@vue/eslint-config-standard`
- 分号：可选（标准风格）
- 引号：优先使用单引号
- 尾随逗号：不要求

### 命名规范
- 组件：PascalCase（例如 `HelloWorld.vue`）
- 文件：camelCase 或 kebab-case（例如 `list.vue`、`error-content.vue`）
- 变量：camelCase
- 常量：UPPER_SNAKE_CASE 或 camelCase
- 方法：camelCase（建议使用 动词-名词 格式）
- Pinia store：camelCase

### 导入规范
- 顺序：先外部库，再内部别名
- 使用 `@/` 别名导入 src 目录
- 示例：
```javascript
import { ref, computed } from 'vue'
import { useStore } from '@/store'
import Component from '@/components/Component.vue'
```

### Vue 组件结构（Composition API）
```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({})
const emit = defineEmits([])

const data = ref(null)
const computedValue = computed(() => data.value)
</script>

<style lang="less" scoped>
/* 组件特定样式 */
</style>
```

### 错误处理
- 使用 Vue 的 errorHandler
- 组件错误：异步操作使用 try-catch
- Pinia actions：在 actions 内部处理错误

### ESLint 规则
- 遵循 Vue 3 和 Standard 规范
- 关闭的规则：
  - `vue/multi-word-component-names`（允许单名单文件组件）
  - `vue/no-reserved-component-names`（允许使用保留名称）
  - `camelcase`（允许 snake_case 用于外部 API）

## 项目结构

```
src/
├── components/       # 可复用的 Vue 组件
│   ├── main/        # 主布局组件
│   │   ├── components/  # 布局子组件
│   │   │   ├── header-bar/
│   │   │   ├── language/
│   │   │   └── side-menu/
│   │   └── main.vue
│   └── error-content/
├── view/            # 页面级组件
│   ├── components/  # 视图特定组件
│   ├── demo.vue
│   ├── settings.vue      # 手势设置
│   ├── hotkey.vue        # 全局热键
│   ├── list.vue          # 手势列表
│   ├── corner.vue        # 触发角
│   ├── edge.vue          # 边缘滚动
│   ├── switch.vue        # 功能开关
│   ├── exclude.vue       # 排除列表
│   ├── keycast.vue       # 按键回显
│   ├── copy.vue          # 快捷菜单
│   ├── match.vue         # 手势动作
│   ├── custom_match.vue  # 自定义匹配
│   ├── i18n.vue          # 多语言
│   └── error-page/       # 错误页面组件
├── router/          # Vue Router 配置
│   └── router.js
├── locale/          # i18n 翻译文件
│   ├── index.js
│   └── lang/
│       ├── zh-CN.js
│       ├── zh-TW.js
│       └── en-US.js
├── libs/            # 工具库
│   └── util.js
├── config/          # 配置文件
│   └── index.js
├── store/           # Pinia 状态管理
│   ├── index.js
│   ├── app.js
│   └── user.js
├── index.less       # 全局样式
├── App.vue          # 根组件
└── main.js          # 应用入口点

tests/
├── unit/            # 单元测试
└── e2e/             # 端到端测试（Cypress）

public/              # 静态资源
├── logo.png
└── gestures/        # 手势图标资源
```

## 版本号说明
版本号由 MouseInc 主程序通过 WebSocket 连接动态提供，显示在侧边栏底部。当无法连接到主程序时，版本号区域不显示。

## 别名
- `@/` -> `src/`

## 调试
按住 SHIFT 键同时打开 MouseInc 设置，可以打开 localhost 开发版本进行调试。

## CI/CD
- 已配置 GitHub Actions（.github/workflows/）
- 推送到 main 分支时自动构建

## 最近更新记录

### 2025-02-01
- 完成 UI 现代化改造：迁移到 Vue 3 + Element Plus + Vite
- 添加自适应系统深色/浅色主题
- 重构所有设置页面为现代化卡片设计
- 统一页面布局宽度为 1200px
- 优化开关组件样式，在白色背景下清晰可见
- 修复保存按钮状态检测逻辑
- 修复多语言默认选择问题
- 添加缺失的多语言翻译键值
- 优化手势列表显示（移除编号、保留图案）
- 自定义程序匹配列表支持折叠展开
- 鼠标手势页面采用酷炫 Hero 设计
