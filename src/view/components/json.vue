<template>
  <div>
    <!-- {{value}} -->
    <el-tabs v-model="tab" type="card" size="small">
    <el-tab-pane label="UI">
        <el-collapse :accordion="true" v-model='collapse_index'>
            <el-collapse-item v-for="(item,index) in this.clone_value" :key="index" :title="item[0]">
                <div class="list-container">
                    <template v-for="(args,args_index) in item" >
                        <div v-if="args_index != 0" :key="args_index" class="list-item">
                            <el-input v-model="item[args_index]">
                                <template v-slot:append>
<el-button type="primary" @click="remove(item, args_index)">
                                    <el-icon><Close /></el-icon>
                                </el-button>
</template>
                            </el-input>
                        </div>
                    </template>
                    <div class="list-item">
                        <el-input v-model="args">
                            <template v-slot:append>
<el-button type="primary" @click="add_args(item)">
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
                <el-cascader :options="actions" v-model="select_actions" :props="{ checkStrictly: true }" filterable></el-cascader>
            </el-col>
            <el-col :span="6">
                <el-button @click="add_action" style='width:90px;float:right'>{{$t('add')}}</el-button>
            </el-col>
        </el-row>
        </el-tab-pane>
    <el-tab-pane label="Raw">
        <codemirror
        :value="content"
        @input="input"
        :options="option">
        </codemirror>
        <div v-if="error_msg" style="padding-top: 10px;">
          <el-alert :title="error_msg" type="error" :closable="false" show-icon></el-alert>
        </div>
    </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import jsBeautify from 'js-beautify/js/lib/beautify'
import beautify from 'js-beautify'
function stringify (data) {
  return beautify.js(JSON.stringify(data), {
    indent_size: 4,
    indent_with_tabs: true,
    eol: '\r\n'
  })
}
// import 'codemirror/theme/monokai.css'
export default {
  name: 'json',
  computed: {
    content () {
      // console.log('content')
      return stringify(this.clone_value)
    }
  },
  data () {
    return {
      clone_value: [],
      actions: [{
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
      }],
      args: '',
      tab: 0,
      collapse_index: ['0'],
      select_actions: ['SendKeys'],
      error_msg: '',
      option: {
        lineNumbers: true,
        lineWrapping: true,
        styleActiveLine: true,
        tabSize: 4,
        indentUnit: 4,
        indentWithTabs: true,
        // line: true,
        // keyMap: 'sublime',
        mode: {
          name: 'javascript',
          json: true
        }
        // theme: 'default'
      }
    }
  },
  props: {
    value: Array,
    editing: Boolean
  },
  watch: {
    editing (val) {
      // console.log('editing',val, this.collapse_index, this.tab)
      this.clone_value = JSON.parse(JSON.stringify(this.value))
      this.args = ''
      this.tab = 0
      this.collapse_index = ['0']
    // },
    // value(val){
    //     console.log('value')
    }
  },
  methods: {
    remove (item, index) {
      item.splice(index, 1)
    },
    add_args (item) {
      item.push(this.args)
      this.args = ''
    },
    add_action () {
      this.clone_value.push(this.select_actions)
      // this.select_actions = ['Window']
    },
    input (value) {
      try {
        let val = JSON.parse(value)
        this.$emit('on-input', val)
        this.error_msg = ''
      } catch (e) {
        this.error_msg = e.message
      }
    }
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
