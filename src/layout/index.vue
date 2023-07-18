<template>
    <div class="layout-body-total flex-row">
        <div class="layout-panel flex-column flex-justify-center">
            <div class="layout-switch-btn" @click="showOther('threePie')">环形图</div>
            <div class="layout-switch-btn" @click="showOther('threeMap')">地图</div>
            <div class="layout-switch-btn" @click="showOther('threeMap')">单张图片伪3d</div>
            <div class="layout-switch-btn" @click="showOther('threeMap')">gltf模型</div>
        </div>
        <div class="layout-router-canvas">
            <router-view />
        </div>
    </div>
</template>
<script>
export default {
    name: "EleLayout",

    watch: {
        $route: {
            handler(newV, oldV) {
                // 当前页面路由path
                console.log('==-=-=', newV, oldV)
            },
            // 深度观察监听
            deep: true
        }
    },
    methods: {
        showOther(type) {
            switch (type) {
                case 'threePie':
                    this.$router.push({
                        path: '/pie'
                    });
                    break;
                case 'threeMap':
                    this.$router.push({
                        path: '/map'
                    });
                    break;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.layout-body-total {
    width: 100vw;
    height: 100vh;

    .layout-panel {
        flex: 1;
        width: 10%;
        height: 100%;
        position: relative;
        z-index: 10;
        border-right: 1px solid #000;
    }

    .layout-switch-btn {
        font-size: 16px;
        padding: 5px 10px;

        &:hover {
            cursor: pointer;
            background-color: aliceblue;
        }
    }

    .layout-router-canvas {
        flex: 9;
        width: 90%;
        height: 100%;
        position: relative;
        z-index: 1;
        overflow: hidden;
    }
}
</style>