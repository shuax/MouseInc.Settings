import Main from '@/components/main'
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
  {
    path: '/',
    name: 'index',
    redirect: '/switch',
    component: Main,
    meta: {
      icon: 'md-flash',
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
          icon: 'ios-settings'
        },
        component: () => import('@/view/single-page/home')
      },
      {
        path: 'exclude',
        name: 'exclude',
        meta: {
          icon: 'md-remove-circle',
          title: 'exclude'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/gesture',
    name: 'gesture',
    meta: {
      icon: 'md-color-wand',
      title: 'gesture'
    },
    component: Main,
    children: [
      {
        path: 'settings',
        name: 'gesture_settings',
        meta: {
          icon: 'md-brush',
          title: 'gesture_settings'
        },
        component: () => import('@/view/single-page/home')
      },
      {
        path: 'list',
        name: 'gesture_list',
        meta: {
          icon: 'md-apps',
          title: 'gesture_list'
        },
        component: () => import('@/view/single-page/home')
      },
      {
        path: 'match',
        name: 'gesture_match',
        meta: {
          icon: 'md-paper-plane',
          title: 'gesture_match'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/other',
    name: 'other',
    meta: {
      icon: 'md-options',
      title: 'other'
    },
    component: Main,
    children: [
      {
        path: 'settings',
        name: 'other_edge',
        meta: {
          icon: 'md-desktop',
          title: 'other_edge'
        },
        component: () => import('@/view/single-page/home')
      },
      {
        path: 'list',
        name: 'other_copy',
        meta: {
          icon: 'md-link',
          title: 'other_copy'
        },
        component: () => import('@/view/single-page/home')
      },
      {
        path: 'match',
        name: 'other_hotkey',
        meta: {
          icon: 'md-key',
          title: 'other_hotkey'
        },
        component: () => import('@/view/single-page/home')
      },
      {
        path: 'match',
        name: 'other_keycast',
        meta: {
          icon: 'md-eye',
          title: 'other_keycast'
        },
        component: () => import('@/view/single-page/home')
      },
      {
        path: 'i18n',
        name: 'i18n',
        meta: {
          icon: 'md-globe',
          title: 'i18n'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
