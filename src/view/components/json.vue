<template>
  <div>
    <!-- {{value}} -->
    <Tabs v-model="tab" size="small">
    <TabPane label="UI">
        <Collapse simple accordion v-model='collapse_index'>
            <Panel v-for="(item,index) in this.clone_value" :key="index">
                {{item[0]}}
                <p slot="content">
                <List item-layout="vertical" size="small" :split='false'>
                    <template v-for="(args,args_index) in item" >
                        <ListItem v-if="args_index != 0" :key="args_index">
                            <Input v-model="item[args_index]">
                                <Button slot="append" type="primary" icon="md-close" @click="remove(item, args_index)"></Button>
                            </Input>
                        </ListItem>
                    </template>
                    <ListItem>
                        <Input v-model="args">
                            <Button slot="append" type="primary" icon="md-add" @click="add_args(item)"></Button>
                        </Input>
                    </ListItem>
                </List>
                </p>
            </Panel>
        </Collapse>
        <Row style="padding-top: 10px;">
            <Col span="18">
                <Cascader :data="actions" v-model="select_actions" :transfer='true' change-on-select filterable></Cascader>
            </Col>
            <Col span="6">
                <Button @click="add_action" style='width:90px;float:right'>{{$t('add')}}</Button>
            </Col>
        </Row>
        </TabPane>
    <TabPane label="Raw">
        <codemirror
        :value="content"
        @input="input"
        :options="option">
        </codemirror>
        <div v-if="error_msg" style="padding-top: 10px;">
          <Alert type="error" show-icon>{{error_msg}}</Alert>
        </div>
    </TabPane>
    </Tabs>
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
</style>
