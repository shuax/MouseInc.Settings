import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 图标映射表 - 支持直接传入 Element Plus 图标名
const iconMap = {}

// 将所有 Element Plus 图标注册到映射表
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  iconMap[key] = component
}

export const getIconByName = (name) => {
  if (!name) return null
  // 直接返回对应的图标组件，如果没有找到则返回 null（不显示图标）
  return iconMap[name] || null
}

export default iconMap
