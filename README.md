# MouseInc.Settings

MouseInc 配置界面 - 基于 Vue 3 + Vite 的现代化设置面板

[![Build Status](https://github.com/shuax/MouseInc.Settings/actions/workflows/build.yml/badge.svg)](https://github.com/shuax/MouseInc.Settings/actions)

## 简介

MouseInc.Settings 是 [MouseInc](https://github.com/shuax/MouseInc) 鼠标手势软件的配置界面，采用现代化的前端技术栈构建，提供直观、美观的设置体验。

## 技术栈

- **Vue 3.5.x** - 渐进式 JavaScript 框架
- **Vite 5.x** - 下一代前端构建工具
- **Element Plus 2.x** - 基于 Vue 3 的组件库
- **Vuex 4.x** - 状态管理
- **Vue Router 4.x** - 路由管理
- **Vue I18n 10.x** - 国际化支持

## 功能特性

- 🎨 自适应系统深色/浅色主题
- 📱 响应式现代化卡片设计
- 🌐 多语言支持（简体中文、繁体中文、英文）
- ⚡ 快速的热更新开发体验
- 🖱️ 鼠标手势配置
- ⌨️ 全局热键设置
- 🎯 触发角和边缘滚动配置
- 📋 快捷菜单和按键回显

## 开发环境

### 前置要求

- [Node.js](https://nodejs.org/) (推荐 v22+)
- npm (随 Node.js 安装)

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/shuax/MouseInc.Settings.git
cd MouseInc.Settings

# 安装依赖
npm install

# 启动开发服务器（自动打开浏览器）
npm run dev
```

### 调试模式

按住 **SHIFT** 键同时打开 MouseInc 设置，可以打开 localhost 开发版本进行调试。

## 构建命令

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

## 代码质量检查

项目集成了 ESLint 进行代码质量检查，帮助维护代码规范和发现潜在问题。

### 运行代码检查

```bash
# 检查代码质量
npm run lint

# 自动修复可修复的问题
npm run lint:fix
```

### ESLint 配置特点

- 基于 Vue 3 和 TypeScript 的最佳实践
- 允许开发环境使用 `console.log` 和 `debugger`
- 对未使用变量提供警告而非错误
- 支持以下划线开头的变量作为有意未使用的标识
- TypeScript 中 `any` 类型使用会给出警告提示

### 代码规范要点

- 使用 2 个空格缩进
- 优先使用单引号
- 组件采用 PascalCase 命名
- 变量和函数采用 camelCase 命名
- 未使用的变量建议添加下划线前缀（如 `_unusedVar`）

## 项目结构

```
src/
├── components/       # 可复用组件
├── view/            # 页面级组件
├── router/          # 路由配置
├── store/           # Vuex 状态管理
├── locale/          # 国际化文件
├── libs/            # 工具库
└── config/          # 配置文件
```

## CI/CD

项目已配置 GitHub Actions，推送到 main 分支时自动构建。

## 许可证

本项目基于 MouseInc 开源项目，遵循相应许可证。
