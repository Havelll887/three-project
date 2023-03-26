import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/chartsDemo/threePie',
    name: 'threePie',
    component: () => import('@/views/chartsDemo/threePie.vue')
  },
  {
    path: '/testPage',
    name: 'testPage',
    component: () => import('@/views/testPage.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
