<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="200" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
<!--         <div class="logo-con">
          <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div> -->
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <!-- <user :message-unread-count="unreadCount" :user-avator="userAvator"/> -->
          <language v-if="$config.useI18n" @on-lang-change="setLocal" :lang="local"/>
          <div>
            <Button icon="md-undo" type="error" style="margin-right: 10px" @click="reset_warning = true">{{$t('reset')}}</Button>
          </div>
          <div>
            <Button icon="md-download" type="success" style="margin-right: 15px;" :disabled="!modified" :loading="save_loading" @click="save">{{$t('save')}}</Button>
          </div>
          <Modal v-model="reset_warning" width="360">
              <p slot="header" style="color:#f60;text-align:center">
                  <Icon type="ios-information-circle"></Icon>
                  <span>{{$t('warning')}}</span>
              </p>
              <div style="text-align:center">
                  <p>{{$t('reset_tips1')}}</p>
                  <p>{{$t('reset_tips2')}}</p>
              </div>
              <div slot="footer">
                  <Button type="error" size="large" long :loading="reset_loading" @click="reset">{{$t('reset')}}</Button>
              </div>
          </Modal>
          <!-- <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader" :has-read="hasReadErrorPage" :count="errorCount"></error-store> -->
          <!-- <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/> -->
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
<!--           <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div> -->
          <Content class="content-wrapper">
              <router-view/>
<!--             <keep-alive :include="cacheList">
            </keep-alive> -->
            <!-- <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop> -->
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
// import TagsNav from './components/tags-nav'
// import User from './components/user'
// import ABackTop from './components/a-back-top'
// import Fullscreen from './components/fullscreen'
import Language from './components/language'
// import ErrorStore from './components/error-store'
import { mapMutations, mapGetters } from 'vuex'
// import { routeEqual } from '@/libs/util'
// import routers from '@/router/routers'
// import minLogo from '@/assets/images/logo-min.jpg'
// import maxLogo from '@/assets/images/logo.jpg'
import { LoadSettings, SaveSettings, ResetSettings, Ping } from '@/api/data'
// import { js as beautify_js } from 'js-beautify'
// import jsBeautify from 'js-beautify/js/lib/beautify'
import beautify from 'js-beautify'
// import JsonEdit from '@/view/components/json.vue'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    // JsonEdit,
    Language
    // TagsNav,
    // Fullscreen,
    // ErrorStore,
    // User,
    // ABackTop
  },
  data () {
    return {
      init: false,
      modified: false,
      collapsed: false,
      loading: 'Loading',
      reset_warning: false,
      reset_loading: false,
      save_loading: false
      // minLogo,
      // maxLogo,
      // isFullscreen: false
    }
  },
  computed: {
    ...mapGetters([
      'cfg'
    ]),
    // ...mapGetters([
    //   'errorCount'
    // ]),
    // tagNavList () {
    //   return this.$store.state.app.tagNavList
    // },
    // tagRouter () {
    //   return this.$store.state.app.tagRouter
    // },
    // userAvator () {
    //   return this.$store.state.user.avatorImgPath
    // },
    // cacheList () {
    //   const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
    //   return list
    // },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    }
    // hasReadErrorPage () {
    //   return this.$store.state.app.hasReadErrorPage
    // },
    // unreadCount () {
    //   return this.$store.state.user.unreadCount
    // }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      // 'setTagNavList',
      // 'addTag',
      'setLocal',
      'setSettings'
      // 'setHomeRoute',
      // 'closeTag'
    ]),
    // ...mapActions([
    //   'handleLogin',
    //   'getUnreadMessageCount'
    // ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    reset () {
      this.reset_loading = true

      ResetSettings().then(response => {
        this.init = false
        this.modified = false
        this.setSettings(response.data)
        this.$Message.success(this.$t('reset_ok'))
      }).catch(error => {
        this.$Message.error(error.message)
      }).then(() => {
        this.reset_loading = false
        this.reset_warning = false
      })
    },
    save () {
      this.save_loading = true
      this.$Loading.start()
      // let cfg = JSON.stringify(this.cfg, function (key, value) {
      //   if (value instanceof Array && key === 'Data') {
      //     return JSON.stringify(value)
      //   }
      //   return value
      // }, 4)
      // cfg = cfg.replace(/"Data": "(.*)",/g, '"Data": $1,')
      var cfg = beautify.js(JSON.stringify(this.cfg), {
        indent_size: 4,
        indent_with_tabs: true,
        eol: '\r\n'
      })
      SaveSettings(cfg).then(response => {
        this.init = false
        this.modified = false
        this.setSettings(response.data)
        this.$Message.success(this.$t('save_ok'))
        this.$Loading.finish()
      }).catch(error => {
        this.$Message.error(error.message)
        this.$Loading.error()
      }).then(() => {
        this.save_loading = false
      })
    },
    heartbeat () {
      // console.log('heartbeat')
      Ping().then(response => {

      }).catch(() => {
        clearInterval(this.timer)
        // this.loading = 'Network connection is down'
        // this.$Message.error({content:'Network connection is down', duration: 999999})

        this.$Spin.show({
          render: (h) => {
            return h('div', '设置连接通道错误，可能是MouseInc主程序已经退出')
          }
        })
      }).then(() => {

      })
    }
    // handleCloseTag (res, type, route) {
    //   if (type !== 'others') {
    //     if (type === 'all') {
    //       this.turnToPage(this.$config.homeName)
    //     } else {
    //       if (routeEqual(this.$route, route)) {
    //         this.closeTag(route)
    //       }
    //     }
    //   }
    //   // this.setTagNavList(res)
    // },
    // handleClick (item) {
    //   this.turnToPage(item)
    // }
  },
  watch: {
    '$route' (newRoute) {
      // const { name, query, params, meta } = newRoute
      // this.addTag({
      //   route: { name, query, params, meta },
      //   type: 'push'
      // })
      this.setBreadCrumb(newRoute)
      // this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    },
    '$store.state.settings.cfg': {
      // handler:(val, oldVal)=>
      handler (val) {
        if (this.init) {
          // console.log(this.init, 'watch', val)
          this.modified = true
        }
        this.init = true
      },
      deep: true
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    // this.setTagNavList()
    // this.setHomeRoute(routers)
    // this.addTag({
    //   route: this.$store.state.app.homeRoute
    // })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)

    this.$Spin.show({
      render: (h) => {
        return h('div', [
          h('Icon', {
            'class': 'demo-spin-icon-load',
            props: {
              type: 'ios-loading',
              size: 32
            }
          }),
          h('div', this.loading)
        ])
      }
    })
    LoadSettings().then(response => {
      this.$Spin.hide()
      this.init = false
      this.modified = false
      this.setSettings(response.data)

      this.timer = setInterval(this.heartbeat, 1000)
      // console.log(this.$config)
    }).catch(error => {
      // this.$Spin.hide();
      // console.log(error)
      this.loading = error.message
      // this.$Message.error(error.message)
    })
    // 如果当前打开页面不在标签栏中，跳到homeName页
    // if (!this.tagNavList.find(item => item.name === this.$route.name)) {
    //   this.$router.push({
    //     name: this.$config.homeName
    //   })
    // }
    // 获取未读消息条数
    // this.getUnreadMessageCount()
  }
}
</script>
<style>
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
</style>
