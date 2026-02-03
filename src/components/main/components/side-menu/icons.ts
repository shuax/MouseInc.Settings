import {
  HomeFilled,
  Lightning,
  WarningFilled,
  Setting,
  Brush,
  Grid,
  Box,
  EditPen,
  Opportunity,
  Operation,
  Monitor,
  FullScreen,
  Link,
  Key,
  View,
  Microphone
} from '@element-plus/icons-vue'

// 图标映射表 - 仅包含项目中实际使用的图标
const iconMap = {
  HomeFilled,
  Lightning,
  WarningFilled,
  Setting,
  Brush,
  Grid,
  Box,
  EditPen,
  Opportunity,
  Operation,
  Monitor,
  FullScreen,
  Link,
  Key,
  View,
  Microphone
}

export const getIconByName = (name) => {
  if (!name) return null
  return iconMap[name] || null
}

export default iconMap