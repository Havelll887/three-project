<template>
    <div class="three-map-container" id="mapContainer">
        <canvas id="three3dMap"></canvas>
    </div>
</template>
<script>
import InitMap from "./src/js/map"
export default {
    name: 'threeMap',
    data() {
        return {
            threeMap: null
        }
    },
    mounted() {
        let canvas = document.getElementById('three3dMap')
        this.threeMap = new InitMap(canvas)
    },
    beforeDestroy() {
        // 图形销毁
        this.threeMap.destroyed()
    }
}
</script>
<style lang="scss" scoped>
.three-map-container {
    width: 100%;
    height: 100%;
}
</style>