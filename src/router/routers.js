import Main from '@/components/main'
// import switch2 from '@/view/switch'
// import exclude from '@/view/exclude'
// import settings from '@/view/settings'
// import list from '@/view/list'
// import match from '@/view/match'
// import custom_match from '@/view/custom_match'
// import edge from '@/view/edge'
// import copy from '@/view/copy'
// import hotkey from '@/view/hotkey'
// import keycast from '@/view/keycast'
// import i18n from '@/view/i18n'
// import e404 from '@/view/error-page/404.vue'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  // {
  //   path: '/login',
  //   name: 'login',
  //   meta: {
  //     title: 'Login - 登录',
  //     hideInMenu: true
  //   },
  //   component: () => import('@/view/login/login.vue')
  // },
  // {
  //   path: '/doc',
  //   name: 'doc',
  //   meta: {
  //     title: 'doc',
  //     href: 'https://docs.shuax.com/MouseInc/#/',
  //     icon: 'md-book'
  //   }
  // },
  {
    path: '/',
    name: 'index',
    redirect: '/switch',
    component: Main,
    meta: {
      icon: 'HomeFilled',
      title: 'index'
      // hideInMenu: true,
      // notCache: true
    },
    children: [
      {
        path: '/switch',
        name: 'switch',
        meta: {
          // hideInMenu: true,
          title: 'switch',
          // notCache: true,
          icon: 'Lightning'
        },
        component: () => import('@/view/switch.vue')
        // component: switch2
      },
      {
        path: 'exclude',
        name: 'exclude',
        meta: {
          icon: 'WarningFilled',
          title: 'exclude'
        },
        component: () => import('@/view/exclude.vue')
        // component: exclude// () => import('@/view/exclude')
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
        component: () => import('@/view/settings.vue')
        // component: settings// () => import('@/view/settings')
      },
      {
        path: 'list',
        name: 'list',
        meta: {
          icon: 'Grid',
          title: 'list'
        },
        component: () => import('@/view/list.vue')
        // component: list// () => import('@/view/list')
      },
      {
        path: 'global',
        name: 'global',
        meta: {
          icon: 'Box',
          title: 'global'
        },
        component: () => import('@/view/match.vue')
        // component: match// () => import('@/view/match')
      },
      {
        path: 'custom',
        name: 'custom',
        meta: {
          icon: 'EditPen',
          title: 'custom'
        },
        component: () => import('@/view/custom_match.vue')
        // component: custom_match// () => import('@/view/custom_match')
      },
      {
        path: 'demo',
        name: 'demo',
        meta: {
          icon: 'Opportunity',
          title: 'demo'
        },
        component: () => import('@/view/demo.vue')
        // component: custom_match// () => import('@/view/custom_match')
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
        component: () => import('@/view/edge.vue')
        // component: edge// () => import('@/view/edge')
      },
      {
        path: 'corner',
        name: 'corner',
        meta: {
          icon: 'FullScreen',
          title: 'corner'
        },
        component: () => import('@/view/corner.vue')
        // component: edge// () => import('@/view/edge')
      },
      {
        path: 'copy',
        name: 'copy',
        meta: {
          icon: 'Link',
          title: 'copy'
        },
        component: () => import('@/view/copy.vue')
        // component: copy// () => import('@/view/copy')
      },
      {
        path: 'hotkey',
        name: 'hotkey',
        meta: {
          icon: 'Key',
          title: 'hotkey'
        },
        component: () => import('@/view/hotkey.vue')
        // component: hotkey// () => import('@/view/hotkey')
      },
      {
        path: 'keycast',
        name: 'keycast',
        meta: {
          icon: 'View',
          title: 'keycast'
        },
        component: () => import('@/view/keycast.vue')
        // component: keycast// () => import('@/view/keycast')
      },
      {
        path: 'i18n',
        name: 'i18n',
        meta: {
          icon: 'Microphone',
          title: 'i18n'
        },
        component: () => import('@/view/i18n.vue')
        // component: i18n// () => import('@/view/i18n')
      // },
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
    // component: e404
  }
]
