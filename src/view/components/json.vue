<template>
  <div class="json-editor-container">
    <el-tabs v-model="tab" type="border-card" class="editor-tabs" lazy>
      <el-tab-pane :label="$t('ui') || 'UI'" name="0">
        <div class="ui-editor">
          <el-scrollbar max-height="240px">
            <el-collapse v-model="collapseIndex" accordion class="modern-collapse">
              <el-collapse-item
                v-for="(item, index) in cloneValue"
                :key="index"
                :name="String(index)"
              >
                <template #title>
                  <div class="collapse-header">
                    <span class="action-name">{{ item[0] }}</span>
                    <el-button
                      type="danger"
                      link
                      :icon="Delete"
                      class="delete-action-btn"
                      @click.stop="removeAction(index)"
                    />
                  </div>
                </template>
                
                <div class="args-list">
                  <div class="args-header" v-if="item.length > 1">
                    <span>{{ $t('parameters') || 'Parameters' }}</span>
                  </div>
                  
                  <template v-for="(arg, argIndex) in item">
                    <div v-if="argIndex !== 0" :key="argIndex" class="arg-item">
                      <el-input v-model="item[argIndex]" placeholder="Value" @change="updateContentFromUI">
                        <template #append>
                          <el-button :icon="Delete" @click="removeArg(item, argIndex)" />
                        </template>
                      </el-input>
                    </div>
                  </template>

                  <div class="add-arg-row">
                    <el-input
                      v-model="args"
                      :placeholder="$t('add_parameter') || 'Add parameter'"
                      class="add-arg-input"
                      @keyup.enter="addArgs(item)"
                    >
                      <template #append>
                        <el-button type="primary" :icon="Plus" @click="addArgs(item)" />
                      </template>
                    </el-input>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-scrollbar>
          
          <div class="actions-toolbar">
            <el-cascader
              v-model="selectActions"
              :options="actions"
              :props="{ checkStrictly: true }"
              filterable
              placeholder="Select Action"
              class="action-cascader"
            />
            <el-button type="primary" :icon="Plus" @click="addAction">
              {{ $t('add') }}
            </el-button>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane :label="$t('raw') || 'Raw'" name="1">
        <div class="raw-editor">
          <!-- 动态工具栏 -->
          <div class="raw-toolbar" :class="{ 'has-repair': isRepairable }">
            <div class="status-box">
              <el-tag v-if="!errorMsg && !isRepairable" type="success" size="small" effect="plain">
                <el-icon><Check /></el-icon> {{ $t('json_format_ok') }}
              </el-tag>
              <el-tag v-if="isRepairable" type="warning" size="small" effect="dark" class="blink">
                <el-icon><MagicStick /></el-icon> {{ $t('json_repairable') }}
              </el-tag>
            </div>
            <el-button 
              v-if="isRepairable" 
              size="small" 
              type="primary" 
              @click="forceRepair"
              class="repair-btn"
            >
              {{ $t('json_repair_btn') }}
            </el-button>
          </div>

          <div class="code-editor-wrapper">
            <div class="highlight-overlay" v-html="highlightedCode" ref="overlayRef"></div>
            <textarea
              v-model="content"
              class="code-input"
              spellcheck="false"
              ref="textareaRef"
              @scroll="syncScroll"
              @input="handleRawInput"
              @blur="onBlur"
            ></textarea>
          </div>
          
          <!-- 仅在不能修复时显示错误详情 -->
          <div v-if="errorMsg && !isRepairable" class="error-container fade-in">
            <el-alert :title="errorMsg" type="error" :closable="false" show-icon />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { js_beautify } from 'js-beautify/js/lib/beautify.js'
import { Plus, Delete, MagicStick, Check } from '@element-plus/icons-vue'
import { jsonrepair } from 'jsonrepair'

const props = defineProps<{ 
  value: string[][]
  editing: boolean
}>()

const emit = defineEmits<{ 
  (_e: 'on-input', _value: string[][]): void 
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const overlayRef = ref<HTMLDivElement | null>(null)

const stringify = (data: string[][]): string => {
  return js_beautify(JSON.stringify(data), {
    indent_size: 4,
    indent_with_tabs: false,
    eol: '\r\n'
  })
}

const args = ref('')
const tab = ref('0')
const collapseIndex = ref<string>('0')
const selectActions = ref<string[]>(['SendKeys'])
const errorMsg = ref('')
const isRepairable = ref(false)
const cloneValue = ref<string[][]>([])
const content = ref('')

// DIY 高亮逻辑
const highlightedCode = computed(() => {
  if (!content.value) return ''
  
  // 1. 先进行基础 HTML 转义
  const escaped = content.value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 2. 单次正则分词匹配
  const regex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|([\{\}\[\]]|[,:]))/g

  let result = escaped.replace(regex, (match) => {
    let cls = 'hl-punc'
    if (match.startsWith('"')) {
      if (match.endsWith(':')) {
        return `<span class="hl-key">${match.slice(0, -1)}</span><span class="hl-punc">:</span>`
      }
      cls = 'hl-val'
    } else if (/true|false/.test(match)) {
      cls = 'hl-bool'
    } else if (match === 'null') {
      cls = 'hl-null'
    } else if (/[0-9]/.test(match)) {
      cls = 'hl-num'
    } else if (/[\[\]\{\}]/.test(match)) {
      cls = 'hl-bracket'
    }
    return `<span class="${cls}">${match}</span>`
  })

  // 修复 textarea 最后的换行显示问题
  if (result.endsWith('\n')) result += ' '
  return result
})

const syncScroll = () => {
  if (textareaRef.value && overlayRef.value) {
    overlayRef.value.scrollTop = textareaRef.value.scrollTop
    overlayRef.value.scrollLeft = textareaRef.value.scrollLeft
  }
}

const initData = () => {
  cloneValue.value = JSON.parse(JSON.stringify(props.value || []))
  content.value = stringify(cloneValue.value)
}

onMounted(initData)

watch(() => props.editing, (val) => {
  if (val) {
    initData()
    tab.value = '0'
    collapseIndex.value = '0'
    errorMsg.value = ''
    isRepairable.value = false
  }
})

watch(() => props.value, (newVal) => {
  if (JSON.stringify(newVal) !== JSON.stringify(cloneValue.value)) {
    cloneValue.value = JSON.parse(JSON.stringify(newVal || []))
    content.value = stringify(cloneValue.value)
  }
}, { deep: true })

const updateContentFromUI = () => {
  content.value = stringify(cloneValue.value)
  emit('on-input', cloneValue.value)
}

const removeAction = (index: number) => {
  cloneValue.value.splice(index, 1)
  updateContentFromUI()
}

const removeArg = (item: string[], index: number) => {
  item.splice(index, 1)
  updateContentFromUI()
}

const addArgs = (item: string[]) => {
  if (args.value) {
    item.push(args.value)
    args.value = ''
    updateContentFromUI()
  }
}

const addAction = () => {
  if (selectActions.value.length > 0) {
    cloneValue.value.push([...selectActions.value])
    updateContentFromUI()
  }
}

const handleRawInput = () => {
  const rawValue = content.value
  if (!rawValue.trim()) {
    errorMsg.value = ''
    isRepairable.value = false
    return
  }

  try {
    const parsed = JSON.parse(rawValue)
    errorMsg.value = ''
    isRepairable.value = false
    if (JSON.stringify(parsed) !== JSON.stringify(cloneValue.value)) {
      cloneValue.value = parsed
      emit('on-input', parsed)
    }
  } catch (origErr) {
    // 原生解析失败，尝试修复
    try {
      const repaired = jsonrepair(rawValue)
      JSON.parse(repaired) // 验证修复后是否真的有效
      isRepairable.value = true
      errorMsg.value = (origErr as Error).message
    } catch {
      // 修复也失败，显示具体错误
      isRepairable.value = false
      errorMsg.value = (origErr as Error).message
    }
  }
}

const forceRepair = () => {
  try {
    const repaired = jsonrepair(content.value)
    const parsed = JSON.parse(repaired)
    content.value = stringify(parsed)
    cloneValue.value = parsed
    emit('on-input', parsed)
    errorMsg.value = ''
    isRepairable.value = false
  } catch {
    // keep current
  }
}

const onBlur = () => {
  if (isRepairable.value) {
    forceRepair()
  }
}

const actions = ref([
  {
    value: 'SendKeys',
    label: 'SendKeys',
    children: [
      { value: 'Ctrl+C', label: 'Ctrl+C' },
      { value: 'Ctrl+V', label: 'Ctrl+V', children: [{ value: 'NOACTIVATE', label: 'NOACTIVATE' }] }
    ]
  }, {
    value: 'Execute',
    label: 'Execute',
    children: [
      { value: 'calc.exe', label: 'calc.exe' },
      { value: 'notepad.exe', label: 'notepad.exe', children: [
        { value: 'hide', label: 'hide' },
        { value: 'admin', label: 'admin' },
        { value: 'wait', label: 'wait' },
        { value: 'admin|wait', label: 'admin|wait' }
      ]}
    ]
  }, {
    value: 'Execute2',
    label: 'Execute2',
    children: [
      { value: 'calc.exe', label: 'calc.exe' },
      { value: 'notepad.exe', label: 'notepad.exe' }
    ]
  }, {
    value: 'Window',
    label: 'Window',
    children: [
      { value: 'Maximize', label: 'Maximize' },
      { value: 'Minimize', label: 'Minimize' },
      { value: 'Top', label: 'Top' },
      { value: 'Center', label: 'Center' },
      { value: 'Close', label: 'Close' },
      { value: 'CloseSimilar', label: 'CloseSimilar' },
      { value: 'HideTray', label: 'HideTray' },
      { value: 'ShowTray', label: 'ShowTray' },
      { value: 'ToggleTray', label: 'ToggleTray' }
    ]
  }, {
    value: 'Internal',
    label: 'Internal',
    children: [
      { value: 'Exit', label: 'Exit' },
      { value: 'Pause', label: 'Pause' },
      { value: 'Icon', label: 'Icon' },
      { value: 'ClipboardMenu', label: 'ClipboardMenu' },
      { value: 'Exclude', label: 'Exclude' },
      { value: 'Reload', label: 'Reload' },
      { value: 'Config', label: 'Config', children: [{ value: 'Keycast.Open', label: 'Keycast.Open', children: [{ value: 'true', label: 'true' }] }] },
      { value: 'Settings', label: 'Settings' },
      { value: 'Delay', label: 'Delay', children: [{ value: '1000', label: '1000' }] },
      { value: 'Print', label: 'Print', children: [{ value: '%fullpath%', label: '%fullpath%' }] },
      { value: 'ShowTips', label: 'ShowTips', children: [
        { value: '%clipboard%', label: '%clipboard%' },
        { value: 'Title', label: 'Title', children: [{ value: '%clipboard%', label: '%clipboard%' }] }
      ]}
    ]
  }, {
    value: 'Screenshot',
    label: 'Screenshot',
    children: [
      { value: 'ToClipboard', label: 'ToClipboard' },
      { value: 'ToFile', label: 'ToFile' },
      { value: 'Stick', label: 'Stick' },
      { value: 'PiP', label: 'PiP' },
      { value: 'OCR', label: 'OCR' }
    ]
  }, {
    value: 'Snapshot',
    label: 'Snapshot',
    children: [
      { value: 'ToClipboard', label: 'ToClipboard' },
      { value: 'ToFile', label: 'ToFile' },
      { value: 'Stick', label: 'Stick' },
      { value: 'PiP', label: 'PiP' },
      { value: 'OCR', label: 'OCR' }
    ]
  }, {
    value: 'GetClipboard',
    label: 'GetClipboard',
    children: [
      { value: 'ToFile', label: 'ToFile' },
      { value: 'Stick', label: 'Stick' },
      { value: 'OCR', label: 'OCR' }
    ]
  }, {
    value: 'ScreenshotHQ',
    label: 'ScreenshotHQ',
    children: [
      { value: 'ToClipboard', label: 'ToClipboard', children: [
        { value: 'DrawCursor', label: 'DrawCursor' },
        { value: 'TransparencyGrid', label: 'TransparencyGrid' },
        { value: 'DrawCursor|TransparencyGrid', label: 'DrawCursor|TransparencyGrid' }
      ]},
      { value: 'ToFile', label: 'ToFile', children: [
        { value: 'DrawCursor', label: 'DrawCursor' },
        { value: 'TransparencyGrid', label: 'TransparencyGrid' },
        { value: 'DrawCursor|TransparencyGrid', label: 'DrawCursor|TransparencyGrid' }
      ]}
    ]
  }, {
    value: 'Algorithm',
    label: 'Algorithm',
    children: [
      { value: 'b64decode', label: 'b64decode', children: [{ value: '%clipboard%', label: '%clipboard%' }] },
      { value: 'b64encode', label: 'b64encode', children: [{ value: '%clipboard%', label: '%clipboard%' }] },
      { value: 'urlencode', label: 'urlencode', children: [{ value: '%clipboard%', label: '%clipboard%' }] },
      { value: 'urldecode', label: 'urldecode', children: [{ value: '%clipboard%', label: '%clipboard%' }] },
      { value: 'md5', label: 'md5', children: [{ value: '%clipboard%', label: '%clipboard%' }] },
      { value: 'sha1', label: 'sha1', children: [{ value: 'sha1', label: 'sha1' }] },
      { value: 'sha256', label: 'sha256', children: [{ value: '%clipboard%', label: '%clipboard%' }] },
      { value: 'qrcode', label: 'qrcode', children: [{ value: '%clipboard%', label: '%clipboard%' }] },
      { value: 'CyberChef', label: 'CyberChef', children: [{ value: '%clipboard%', label: '%clipboard%' }] }
    ]
  }, {
    value: 'Explorer',
    label: 'Explorer',
    children: [
      { value: 'select', label: 'select', children: [{ value: '%fullpath%', label: '%fullpath%' }] },
      { value: 'recyclebin', label: 'recyclebin', children: [
        { value: 'noconfirmation', label: 'noconfirmation' },
        { value: 'noprogressui', label: 'noprogressui' },
        { value: 'noconfirmation|noprogressui', label: 'noconfirmation|noprogressui' }
      ]},
      { value: 'turnoffmonitor', label: 'turnoffmonitor' }
    ]
  }, {
    value: 'SetBrightness',
    label: 'SetBrightness',
    children: [{ value: 'UP', label: 'UP' }, { value: 'DOWN', label: 'DOWN' }, { value: 'DEFAULT', label: 'DEFAULT' }]
  }, {
    value: 'PostMessage',
    label: 'PostMessage',
    children: [{ value: '272', label: '272', children: [{ value: '40022', label: '40022' }] }]
  }, {
    value: 'SendKeyDown',
    label: 'SendKeyDown',
    children: [{ value: 'Ctrl', label: 'Ctrl' }]
  }, {
    value: 'SendKeyUp',
    label: 'SendKeyUp',
    children: [{ value: 'Ctrl', label: 'Ctrl' }]
  }, {
    value: 'SendClick',
    label: 'SendClick',
    children: [{ value: 'left', label: 'left' }, { value: 'right', label: 'right' }, { value: 'middle', label: 'middle' }]
  }, {
    value: 'MouseMove',
    label: 'MouseMove',
    children: [{ value: 'start_x', label: 'start_x', children: [{ value: 'start_y', label: 'start_y' }] }]
  }, {
    value: 'SetClipboard',
    label: 'SetClipboard',
    children: [{ value: 'text123', label: 'text123' }]
  }, {
    value: 'RegSet',
    label: 'RegSet',
    children: [{ value: 'HKEY_CURRENT_USER\\SOFTWARE', label: 'HKEY_CURRENT_USER\\SOFTWARE', children: [{ value: 'Test', label: 'Test', children: [{ value: '0', label: '0' }] }] }]
  }, {
    value: 'Activate',
    label: 'Activate'
}])
</script>

<style lang="less" scoped>
.json-editor-container {
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-card);
  width: 100% !important;
}

.editor-tabs {
  border: none;
  box-shadow: none;
  width: 100% !important;

  :deep(.el-tabs__header) {
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 0;

    .el-tabs__item {
      height: 40px;
      line-height: 40px;
      color: var(--text-secondary);
      border: none;
      
      &.is-active {
        color: var(--primary-color);
        background: var(--bg-card);
        font-weight: 500;
        border-right: 1px solid var(--border-color);
        border-left: 1px solid var(--border-color);
        
        &:first-child {
          border-left: none;
        }
      }
    }
  }

  :deep(.el-tabs__content) {
    padding: 0 !important;
    width: 100% !important;
  }
}

.ui-editor {
  padding: 16px;
  background: var(--bg-card);
  width: 100%;
  box-sizing: border-box;
}

.modern-collapse {
  border: none;
  margin-bottom: 16px;

  :deep(.el-collapse-item__header) {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    margin-bottom: 8px;
    padding: 0 16px;
    height: 44px;
    transition: all 0.2s ease;

    &.is-active {
      border-bottom-color: transparent;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      background: var(--bg-active);
    }
  }

  :deep(.el-collapse-item__wrap) {
    background: transparent;
    border: 1px solid var(--border-color);
    border-top: none;
    border-radius: 0 0 8px 8px;
    margin-top: -8px;
    margin-bottom: 8px;
  }

  :deep(.el-collapse-item__content) {
    padding: 16px;
  }
}

.collapse-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 8px;

  .action-name {
    font-weight: 600;
    color: var(--primary-color);
    font-family: monospace;
  }

  .delete-action-btn {
    opacity: 0.6;
    &:hover {
      opacity: 1;
    }
  }
}

.args-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.args-header {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 4px;
  text-transform: uppercase;
  font-weight: 600;
}

.arg-item {
  width: 100%;
}

.add-arg-row {
  margin-top: 4px;
}

.actions-toolbar {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);

  .action-cascader {
    flex: 1;
  }
}

// DIY Code Editor Styles
.raw-editor {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-top: none;
}

.raw-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
  height: 36px;
  transition: all 0.3s ease;

  &.has-repair {
    background: #fffaf0;
    @media (prefers-color-scheme: dark) {
      background: #2c2100;
    }
  }
}

.status-box {
  display: flex;
  align-items: center;
  gap: 8px;
  
  :deep(.el-tag) {
    border: none;
    height: 24px;
    padding: 0 8px;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    
    .el-tag__content {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    .el-icon {
      margin-right: 4px;
      font-size: 14px;
    }
  }
}

.repair-btn {
  height: 24px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  animation: glow-pulse 2s infinite;
}

@keyframes glow-pulse {
  0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(102, 126, 234, 0); }
  100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
}

.code-editor-wrapper {
  position: relative;
  height: 200px;
  background: var(--bg-card);
  overflow: hidden;
}

.code-input, .highlight-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 16px;
  margin: 0;
  border: none;
  box-sizing: border-box;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre;
  word-wrap: normal;
  overflow: auto;
  tab-size: 4;
}

.code-input {
  background: transparent;
  color: transparent;
  caret-color: var(--text-primary);
  resize: none;
  outline: none;
  z-index: 2;
  
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
}

.highlight-overlay {
  z-index: 1;
  pointer-events: none;
  color: var(--text-primary);
  
  &::-webkit-scrollbar {
    display: none;
  }
}

// 语法高亮 - 浅色模式
:deep(.hl-key) { color: #204a87; font-weight: 600; }
:deep(.hl-val) { color: #4e9a06; }
:deep(.hl-num) { color: #ad7fa8; }
:deep(.hl-bool) { color: #c4a000; font-weight: bold; }
:deep(.hl-null) { color: #babdb6; font-style: italic; }
:deep(.hl-bracket) { color: #2e3436; font-weight: bold; }
:deep(.hl-punc) { color: #888a85; }

// 语法高亮 - 深色模式适配
@media (prefers-color-scheme: dark) {
  :deep(.hl-key) { color: #79c0ff; }
  :deep(.hl-val) { color: #a5d6ff; }
  :deep(.hl-num) { color: #d2a8ff; }
  :deep(.hl-bool) { color: #ffab70; }
  :deep(.hl-null) { color: #8b949e; }
  :deep(.hl-bracket) { color: #e6edf3; }
  :deep(.hl-punc) { color: #8b949e; }
}

.code-input {
  background: transparent;
  color: transparent;
  caret-color: var(--text-primary);
  resize: none;
  outline: none;
  z-index: 2;
  
  &::selection {
    background: rgba(102, 126, 234, 0.35);
    color: transparent;
  }
}

.error-container {
  padding: 8px 16px;
  background: rgba(255, 0, 0, 0.05);
  border-top: 1px solid rgba(255, 0, 0, 0.1);
}

.blink {
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>