import Main from '@/components/main'
import SwitchView from '@/view/switch.vue'
import ExcludeView from '@/view/exclude.vue'
import SettingsView from '@/view/settings.vue'
import ListView from '@/view/list.vue'
import MatchView from '@/view/match.vue'
import CustomMatchView from '@/view/custom_match.vue'
import DemoView from '@/view/demo.vue'
import EdgeView from '@/view/edge.vue'
import CornerView from '@/view/corner.vue'
import CopyView from '@/view/copy.vue'
import HotkeyView from '@/view/hotkey.vue'
import KeycastView from '@/view/keycast.vue'
import I18nView from '@/view/i18n.vue'

export default [
  {
    path: '/',
    name: 'index',
    redirect: '/switch',
    component: Main,
    meta: {
      icon: 'HomeFilled',
      title: 'index'
    },
    children: [
      {
        path: '/switch',
        name: 'switch',
        meta: {
          title: 'switch',
          icon: 'Lightning'
        },
        component: SwitchView
      },
      {
        path: 'exclude',
        name: 'exclude',
        meta: {
          icon: 'WarningFilled',
          title: 'exclude'
        },
        component: ExcludeView
      }
    ]
  },
  {
    path: '/gesture',
    name: 'gesture',
    meta: {
      icon: 'Setting',
      title: 'gesture'
    },
    component: Main,
    children: [
      {
        path: 'settings',
        name: 'settings',
        meta: {
          icon: 'Brush',
          title: 'settings'
        },
        component: SettingsView
      },
      {
        path: 'list',
        name: 'list',
        meta: {
          icon: 'Grid',
          title: 'list'
        },
        component: ListView
      },
      {
        path: 'global',
        name: 'global',
        meta: {
          icon: 'Box',
          title: 'global'
        },
        component: MatchView
      },
      {
        path: 'custom',
        name: 'custom',
        meta: {
          icon: 'EditPen',
          title: 'custom'
        },
        component: CustomMatchView
      },
      {
        path: 'demo',
        name: 'demo',
        meta: {
          icon: 'Opportunity',
          title: 'demo'
        },
        component: DemoView
      }
    ]
  },
  {
    path: '/other',
    name: 'other',
    meta: {
      icon: 'Operation',
      title: 'other'
    },
    component: Main,
    children: [
      {
        path: 'edge',
        name: 'edge',
        meta: {
          icon: 'Monitor',
          title: 'edge'
        },
        component: EdgeView
      },
      {
        path: 'corner',
        name: 'corner',
        meta: {
          icon: 'FullScreen',
          title: 'corner'
        },
        component: CornerView
      },
      {
        path: 'copy',
        name: 'copy',
        meta: {
          icon: 'Link',
          title: 'copy'
        },
        component: CopyView
      },
      {
        path: 'hotkey',
        name: 'hotkey',
        meta: {
          icon: 'Key',
          title: 'hotkey'
        },
        component: HotkeyView
      },
      {
        path: 'keycast',
        name: 'keycast',
        meta: {
          icon: 'View',
          title: 'keycast'
        },
        component: KeycastView
      },
      {
        path: 'i18n',
        name: 'i18n',
        meta: {
          icon: 'Microphone',
          title: 'i18n'
        },
        component: I18nView
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'error_404',
    redirect: '/switch'
  }
]
