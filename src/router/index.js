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
    },
]

const router = new VueRouter({
    //   mode: 'history',
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router
