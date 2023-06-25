<template>
    <div class="layout-body-total">
        <div class="layout-panel">
            <div>环形图</div>
            <div @click="showOther('threePie')">环形图</div>
            <div @click="showOther('threeMap')">地图</div>
        </div>
        <div class="layout-router-canvas">
            <router-view />
        </div>
    </div>
</template>
<script>
export default {
    name: "EleLayout",
    // components: { RouterView }
    methods: {
        showOther(type) {
            switch (type) {
                case 'threePie': console.log(type); break;
                case 'threeMap': console.log(type); break;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.layout-body-total {
    width: 100vw;
    height: 100vh;
    display: flex;
}

.layout-panel {
    width: 10vw;
    display: flex;
    flex-direction: column;
}

.layout-router-canvas {
    width: 90vw;
}
</style>