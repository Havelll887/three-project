import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/chartsDemo/threePie.vue')
  },
  {
    path: '/chartsDemo/threePie',
    name: 'threePie',
    component: () => import('@/views/chartsDemo/threePie.vue')
  },
  {
    path: '/mapDemo/threeMap',
    name: 'threePie',
    component: () => import('@/views/mapDemo/threeMap.vue')
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
