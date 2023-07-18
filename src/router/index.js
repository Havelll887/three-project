import Vue from 'vue'
import VueRouter from 'vue-router'
import EleLayout from '@/layout'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: EleLayout,
        children: [
            {
                path: '/threeMap',
                name: 'threeMap',
                component: () => import('@/views/mapDemo/threeMap.vue')
            },
            {
                path: '/map',
                name: 'map',
                component: () => import('@/views/threeMap/index.vue')
            },
            {
                path: '/pie',
                name: 'pie',
                component: () => import('@/views/threePie/index.vue')
            }
        ]
    },
]

const router = new VueRouter({
    //   mode: 'history',
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router
