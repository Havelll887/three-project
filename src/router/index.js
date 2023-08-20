import Vue from 'vue'
import VueRouter from 'vue-router'
import EleLayout from '@/layout'

Vue.use(VueRouter)

// 解决导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const routes = [
    {
        path: '/',
        component: EleLayout,
        children: [

            {
                path: '/map',
                name: 'map',
                component: () => import('@/views/threeMap/index.vue')
            },
            {
                path: '/pie',
                name: 'pie',
                component: () => import('@/views/threePie/index.vue')
            },
            {
                path: '/fake3d',
                name: 'fake3d',
                component: () => import('@/views/threeFake3d/index.vue')
            },
            {
                path: '/gltf',
                name: 'gltf',
                component: () => import('@/views/threeGLTF/index.vue')
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
