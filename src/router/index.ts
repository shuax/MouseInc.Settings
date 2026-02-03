import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routers'
import { ElLoading } from 'element-plus'
import { setTitle } from '@/libs/util'
import { nextTick } from 'vue'

let loadingInstance = null

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  loadingInstance = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(255, 255, 255, 0.7)'
  })
  next()
})

router.afterEach((to) => {
  setTitle(to, null)
  nextTick(() => {
    if (loadingInstance) {
      loadingInstance.close()
    }
  })
  
  const content = document.querySelector('.content-wrapper')
  if (content && content.scrollTop) {
    content.scrollTo(0, 0)
  }
})

export default router
