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
                path: '/threePie',
                name: 'threePie',
                component: () => import('@/views/chartsDemo/threePie.vue')
            },
            {
                path: '/threeMap',
                name: 'threeMap',
                component: () => import('@/views/mapDemo/threeMap.vue')
            },
            {
                path: 'map',
                name: 'map',
                component: () => import('@/views/threeMap/index.vue')
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
