// 全局类型定义

// Vuex Store 类型
export interface RootState {
  app: AppState
  settings: SettingsState
}

export interface AppState {
  cachePage: string[]
  lang: string
}

export interface SettingsState {
  cfg: Config
}

// MouseInc 配置类型
export interface Config {
  MouseGesture?: MouseGestureConfig
  WheelEdge?: WheelEdgeConfig
  HotCorner?: HotCornerConfig
  ClipboardManager?: ClipboardManagerConfig
  Keycast?: KeycastConfig
  AltDrag: boolean
  WheelAltControl: boolean
  VolumeControlSound: boolean
  KeySound: boolean
  ShowIme: boolean
  QuickJump: boolean
  IgnoreFullScreen: boolean
  ShowTrayIcon: boolean
  CapsLockLed: boolean
  CapsUnlock: boolean
  WheelThrough: boolean
  WheelNatural: boolean
  AutoClip: boolean
  FastPaste: boolean
  Administrator: boolean
  VolumeSoundIndex: number
  KeySoundIndex: number
  OcrService: number
  Language?: string
  Gesture?: GestureItem[]
  HotKey?: HotKeyItem[]
  WheelEdgeList?: WheelEdgeItem[]
  HotCornerList?: HotCornerItem[]
  ExcludeList?: string[]
  Copy?: CopyItem[]
  CustomMatch?: CustomMatchItem[]
}

export interface MouseGestureConfig {
  Open: boolean
  StartDistance: number
  Timeout: number
  RestoreEvent: boolean
  AddMode: boolean
  RandColor: boolean
  FailColor: string
  DrawColor: string
  DrawResult: boolean
  DrawTrace: boolean
  TraceWidth: number
  FontSize: number
  Offset: number
  TraceArrow: boolean
  Sensitive: number
  WheelSwitch: boolean
}

export interface WheelEdgeConfig {
  Open: boolean
}

export interface HotCornerConfig {
  Open: boolean
}

export interface ClipboardManagerConfig {
  Open: boolean
}

export interface KeycastConfig {
  Open: boolean
}

// 手势配置项
export interface GestureItem {
  command: string
  gesture: string
  name: string
}

// 热键配置项
export interface HotKeyItem {
  command: string
  key: string
  name: string
}

// 边缘滚动配置项
export interface WheelEdgeItem {
  command: string
  name: string
}

// 触发角配置项
export interface HotCornerItem {
  command: string
  name: string
}

// 快捷菜单配置项
export interface CopyItem {
  name: string
  value: string
}

// 自定义匹配配置项
export interface CustomMatchItem {
  exe: string
  config: Partial<Config>
}

// 切换项配置
export interface SwitchItem {
  title: string
  label: string
  model: keyof Config
  disabledFn?: (_proxy: Config) => boolean
  beforeChange?: () => boolean | Promise<void>
}

// 选择项配置
export interface SelectOption {
  value: number | string
  label: string
}

// 组件 Props 类型
export interface TextComponentProps {
  modelValue: string
  label?: string
}

export interface SelectComponentProps {
  modelValue: string
  label?: string
  options: string[]
}

export interface JsonComponentProps {
  modelValue: string
}

export interface GestureComponentProps {
  modelValue: string
}

// 路由元信息
export interface RouteMeta {
  title?: string
  icon?: string
  hideInMenu?: boolean
  showAlways?: boolean
}

// 菜单项
export interface MenuItem {
  name: string
  meta?: RouteMeta
  children?: MenuItem[]
  path?: string
  href?: string
  params?: Record<string, unknown>
  query?: Record<string, unknown>
  to?: unknown
}

// 路由项
export interface AppRoute {
  path: string
  name?: string
  meta?: RouteMeta
  redirect?: string
  children?: AppRoute[]
  component?: unknown
}

// 标题显示选项
export interface ShowTitleOptions {
  $t: (_key: string) => string
}
