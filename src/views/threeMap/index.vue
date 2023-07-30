<template>
    <div class="three-map-container" id="mapContainer">
        <canvas id="three3dMap" @mousemove="move"></canvas>
       
    </div>
</template>
<script>
import InitMap from "./src/js/map"
import { getCabinetByName } from '@/api/index'
export default {
    name: 'threeMap',
    data() {
        return {
            threeMap: null,
            itemMsg:{}
        }
    },
    mounted() {
        let canvas = document.getElementById('three3dMap')
        this.threeMap = new InitMap(canvas)
    },
    methods: {
        move(event) {
            this.threeMap.setRaycaster(event)
        }
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