/* globals Docute */

new Docute({
  layout: 'narrow',
  target: '#docute',
  sourcePath: './docs/',
  editLinkBase: '',
  nav: [
    {
      title: '返回软件页',
      link: 'https://shuax.com/project/mouseinc/'
    }
  ],
  sidebar: [
    {
      links: [
        {
          title: '入门指引',
          link: '/'
        },
        {
          title: '功能介绍',
          link: '/feature'
        },
        {
          title: '配置文件',
          link: '/config'
        },
        {
          title: '动作列表',
          link: '/action'
        },
        {
          title: '常见问题',
          link: '/faq'
        },
        {
          title: '更新日志',
          link: '/update'
        }
      ]
    }
  ]
})
