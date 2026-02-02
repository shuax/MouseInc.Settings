<template>
  <div>
    <!-- {{value}} -->
    <el-tabs v-model="tab" type="card" size="small">
    <el-tab-pane label="UI">
        <el-collapse :accordion="true" v-model='collapseIndex'>
            <el-collapse-item v-for="(item,index) in cloneValue" :key="index" :title="item[0]">
                <div class="list-container">
                    <template v-for="(args,argsIndex) in item" >
                        <div v-if="argsIndex != 0" :key="argsIndex" class="list-item">
                            <el-input v-model="item[argsIndex]">
                                <template v-slot:append>
<el-button type="primary" @click="remove(item, argsIndex)">
                                    <el-icon><Close /></el-icon>
                                </el-button>
</template>
                            </el-input>
                        </div>
                    </template>
                    <div class="list-item">
                        <el-input v-model="args">
                            <template v-slot:append>
<el-button type="primary" @click="addArgs(item)">
                                    <el-icon><Plus /></el-icon>
                                </el-button>
</template>
                        </el-input>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
        <el-row style="padding-top: 10px;">
            <el-col :span="18">
                <el-cascader :options="actions" v-model="selectActions" :props="{ checkStrictly: true }" filterable></el-cascader>
            </el-col>
            <el-col :span="6">
                <el-button @click="addAction" style='width:90px;float:right'>{{$t('add')}}</el-button>
            </el-col>
        </el-row>
        </el-tab-pane>
    <el-tab-pane label="Raw">
        <codemirror
        :value="content"
        @input="input"
        :options="option">
        </codemirror>
        <div v-if="errorMsg" style="padding-top: 10px;">
          <el-alert :title="errorMsg" type="error" :closable="false" show-icon></el-alert>
        </div>
    </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import beautify from 'js-beautify'

interface ActionOption {
  value: string
  label: string
  children?: ActionOption[]
}

const props = defineProps<{
  value: string[][]
  editing: boolean
}>()

const emit = defineEmits<{
  (e: 'on-input', value: string[][]): void
}>()

const stringify = (data: string[][]): string => {
  return beautify.js(JSON.stringify(data), {
    indent_size: 4,
    indent_with_tabs: true,
    eol: '\r\n'
  })
}

const actions = ref<ActionOption[]>([{
  value: 'SendKeys',
  label: 'SendKeys',
  children: [
    {
      value: 'Ctrl+C',
      label: 'Ctrl+C'
    },
    {
      value: 'Ctrl+V',
      label: 'Ctrl+V',
      children: [
        {
          value: 'NOACTIVATE',
          label: 'NOACTIVATE'
        }
      ]
    }
  ]
}, {
  value: 'Execute',
  label: 'Execute',
  children: [
    {
      value: 'calc.exe',
      label: 'calc.exe'
    },
    {
      value: 'notepad.exe',
      label: 'notepad.exe',
      children: [
        {
          value: 'hide',
          label: 'hide'
        },
        {
          value: 'admin',
          label: 'admin'
        },
        {
          value: 'wait',
          label: 'wait'
        },
        {
          value: 'admin|wait',
          label: 'admin|wait'
        }
      ]
    }
  ]
}, {
  value: 'Execute2',
  label: 'Execute2',
  children: [
    {
      value: 'calc.exe',
      label: 'calc.exe'
    },
    {
      value: 'notepad.exe',
      label: 'notepad.exe'
    }
  ]
}, {
  value: 'Window',
  label: 'Window',
  children: [
    {
      value: 'Maximize',
      label: 'Maximize'
    },
    {
      value: 'Minimize',
      label: 'Minimize'
    },
    {
      value: 'Top',
      label: 'Top'
    },
    {
      value: 'Center',
      label: 'Center'
    },
    {
      value: 'Close',
      label: 'Close'
    },
    {
      value: 'CloseSimilar',
      label: 'CloseSimilar'
    },
    {
      value: 'HideTray',
      label: 'HideTray'
    },
    {
      value: 'ShowTray',
      label: 'ShowTray'
    },
    {
      value: 'ToggleTray',
      label: 'ToggleTray'
    }
  ]
}, {
  value: 'Internal',
  label: 'Internal',
  children: [
    {
      value: 'Exit',
      label: 'Exit'
    },
    {
      value: 'Pause',
      label: 'Pause'
    },
    {
      value: 'Icon',
      label: 'Icon'
    },
    {
      value: 'ClipboardMenu',
      label: 'ClipboardMenu'
    },
    {
      value: 'Exclude',
      label: 'Exclude'
    },
    {
      value: 'Reload',
      label: 'Reload'
    },
    {
      value: 'Config',
      label: 'Config',
      children: [
        {
          value: 'Keycast.Open',
          label: 'Keycast.Open',
          children: [
            {
              value: 'true',
              label: 'true'
            }
          ]
        }
      ]
    },
    {
      value: 'Settings',
      label: 'Settings'
    },
    {
      value: 'Delay',
      label: 'Delay',
      children: [
        {
          value: '1000',
          label: '1000'
        }
      ]
    },
    {
      value: 'Print',
      label: 'Print',
      children: [
        {
          value: '%fullpath%',
          label: '%fullpath%'
        }
      ]
    },
    {
      value: 'ShowTips',
      label: 'ShowTips',
      children: [
        {
          value: '%clipboard%',
          label: '%clipboard%'
        },
        {
          value: 'Title',
          label: 'Title',
          children: [
            {
              value: '%clipboard%',
              label: '%clipboard%'
            }
          ]
        }
      ]
    }
  ]
}, {
  value: 'Screenshot',
  label: 'Screenshot',
  children: [
    {
      value: 'ToClipboard',
      label: 'ToClipboard'
    },
    {
      value: 'ToFile',
      label: 'ToFile'
    },
    {
      value: 'Stick',
      label: 'Stick'
    },
    {
      value: 'PiP',
      label: 'PiP'
    },
    {
      value: 'OCR',
      label: 'OCR'
    }
  ]
}, {
  value: 'Snapshot',
  label: 'Snapshot',
  children: [
    {
      value: 'ToClipboard',
      label: 'ToClipboard'
    },
    {
      value: 'ToFile',
      label: 'ToFile'
    },
    {
      value: 'Stick',
      label: 'Stick'
    },
    {
      value: 'PiP',
      label: 'PiP'
    },
    {
      value: 'OCR',
      label: 'OCR'
    }
  ]
}, {
  value: 'GetClipboard',
  label: 'GetClipboard',
  children: [
    {
      value: 'ToFile',
      label: 'ToFile'
    },
    {
      value: 'Stick',
      label: 'Stick'
    },
    {
      value: 'OCR',
      label: 'OCR'
    }
  ]
}, {
  value: 'ScreenshotHQ',
  label: 'ScreenshotHQ',
  children: [
    {
      value: 'ToClipboard',
      label: 'ToClipboard',
      children: [
        {
          value: 'DrawCursor',
          label: 'DrawCursor'
        },
        {
          value: 'TransparencyGrid',
          label: 'TransparencyGrid'
        },
        {
          value: 'DrawCursor|TransparencyGrid',
          label: 'DrawCursor|TransparencyGrid'
        }
      ]
    },
    {
      value: 'ToFile',
      label: 'ToFile',
      children: [
        {
          value: 'DrawCursor',
          label: 'DrawCursor'
        },
        {
          value: 'TransparencyGrid',
          label: 'TransparencyGrid'
        },
        {
          value: 'DrawCursor|TransparencyGrid',
          label: 'DrawCursor|TransparencyGrid'
        }
      ]
    }
  ]
}, {
  value: 'Algorithm',
  label: 'Algorithm',
  children: [
    {
      value: 'b64decode',
      label: 'b64decode',
      children: [
        {
          value: '%clipboard%',
          label: '%clipboard%'
        }
      ]
    },
    {
      value: 'b64encode',
      label: 'b64encode',
      children: [
        {
          value: '%clipboard%',
          label: '%clipboard%'
        }
      ]
    },
    {
      value: 'urlencode',
      label: 'urlencode',
      children: [
        {
          value: '%clipboard%',
          label: '%clipboard%'
        }
      ]
    },
    {
      value: 'urldecode',
      label: 'urldecode',
      children: [
        {
          value: '%clipboard%',
          label: '%clipboard%'
        }
      ]
    },
    {
      value: 'md5',
      label: 'md5',
      children: [
        {
          value: '%clipboard%',
          label: '%clipboard%'
        }
      ]
    },
    {
      value: 'sha1',
      label: 'sha1',
      children: [
        {
          value: '%clipboard%',
          label: '%clipboard%'
        }
      ]
    },
    {
      value: 'sha256',
      label: 'sha256',
      children: [
        {
          value: '%clipboard%',
          label: '%clipboard%'
        }
      ]
    },
    {
      value: 'qrcode',
      label: 'qrcode',
      children: [
        {
          value: '%clipboard%',
          label: '%clipboard%'
        }
      ]
    },
    {
      value: 'CyberChef',
      label: 'CyberChef',
      children: [
        {
          value: '%clipboard%',
          label: '%clipboard%'
        }
      ]
    }
  ]
}, {
  value: 'Explorer',
  label: 'Explorer',
  children: [
    {
      value: 'select',
      label: 'select',
      children: [
        {
          value: '%fullpath%',
          label: '%fullpath%'
        }
      ]
    },
    {
      value: 'recyclebin',
      label: 'recyclebin',
      children: [
        {
          value: 'noconfirmation',
          label: 'noconfirmation'
        },
        {
          value: 'noprogressui',
          label: 'noprogressui'
        },
        {
          value: 'noconfirmation|noprogressui',
          label: 'noconfirmation|noprogressui'
        }
      ]
    },
    {
      value: 'turnoffmonitor',
      label: 'turnoffmonitor'
    }
  ]
}, {
  value: 'SetBrightness',
  label: 'SetBrightness',
  children: [
    {
      value: 'UP',
      label: 'UP'
    },
    {
      value: 'DOWN',
      label: 'DOWN'
    },
    {
      value: 'DEFAULT',
      label: 'DEFAULT'
    }
  ]
}, {
  value: 'PostMessage',
  label: 'PostMessage',
  children: [
    {
      value: '272',
      label: '272',
      children: [
        {
          value: '40022',
          label: '40022'
        }
      ]
    }
  ]
}, {
  value: 'SendKeyDown',
  label: 'SendKeyDown',
  children: [
    {
      value: 'Ctrl',
      label: 'Ctrl'
    }
  ]
}, {
  value: 'SendKeyUp',
  label: 'SendKeyUp',
  children: [
    {
      value: 'Ctrl',
      label: 'Ctrl'
    }
  ]
}, {
  value: 'SendClick',
  label: 'SendClick',
  children: [
    {
      value: 'left',
      label: 'left'
    },
    {
      value: 'right',
      label: 'right'
    },
    {
      value: 'middle',
      label: 'middle'
    }
  ]
}, {
  value: 'MouseMove',
  label: 'MouseMove',
  children: [
    {
      value: 'start_x',
      label: 'start_x',
      children: [
        {
          value: 'start_y',
          label: 'start_y'
        }
      ]
    }
  ]
}, {
  value: 'SetClipboard',
  label: 'SetClipboard',
  children: [
    {
      value: 'text123',
      label: 'text123'
    }
  ]
}, {
  value: 'RegSet',
  label: 'RegSet',
  children: [
    {
      value: 'HKEY_CURRENT_USER\\SOFTWARE',
      label: 'HKEY_CURRENT_USER\\SOFTWARE',
      children: [
        {
          value: 'Test',
          label: 'Test',
          children: [
            {
              value: '0',
              label: '0'
            }
          ]
        }
      ]
    }
  ]
}, {
  value: 'Activate',
  label: 'Activate'
}])

const args = ref('')
const tab = ref('0')
const collapseIndex = ref<string[]>(['0'])
const selectActions = ref<string[]>(['SendKeys'])
const errorMsg = ref('')
const cloneValue = ref<string[][]>([])

const option = ref({
  lineNumbers: true,
  lineWrapping: true,
  styleActiveLine: true,
  tabSize: 4,
  indentUnit: 4,
  indentWithTabs: true,
  mode: {
    name: 'javascript',
    json: true
  }
})

const content = computed(() => stringify(cloneValue.value))

watch(() => props.editing, (val) => {
  cloneValue.value = JSON.parse(JSON.stringify(props.value))
  args.value = ''
  tab.value = '0'
  collapseIndex.value = ['0']
})

const remove = (item: string[], index: number) => {
  item.splice(index, 1)
}

const addArgs = (item: string[]) => {
  item.push(args.value)
  args.value = ''
}

const addAction = () => {
  cloneValue.value.push([...selectActions.value])
}

const input = (value: string) => {
  try {
    const val = JSON.parse(value)
    emit('on-input', val)
    errorMsg.value = ''
  } catch (e) {
    errorMsg.value = (e as Error).message
  }
}
</script>

<style>
.CodeMirror {
  height: auto;
  line-height: 2;
}
.cm-tab {
   background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAMCAYAAAAkuj5RAAAAAXNSR0IArs4c6QAAAGFJREFUSMft1LsRQFAQheHPowAKoACx3IgEKtaEHujDjORSgWTH/ZOdnZOcM/sgk/kFFWY0qV8foQwS4MKBCS3qR6ixBJvElOobYAtivseIE120FaowJPN75GMu8j/LfMwNjh4HUpwg4LUAAAAASUVORK5CYII=);
   background-position: right;
   background-repeat: no-repeat;
   opacity: .8;
}
.list-container {
  padding: 8px 0;
}
.list-item {
  margin-bottom: 8px;
}
.list-item:last-child {
  margin-bottom: 0;
}
</style>
