<template>
    <div class="three-map-container">
        <canvas id="three3dMap"></canvas>
    </div>
</template>
<script>
import initMap from "./src/js/map"
export default {
    name: 'threeMap',
    data() {
        return {
            threeMap: null
        }
    },
    mounted() {
        let canvas = document.getElementById('three3dMap')
        this.threeMap = new initMap(canvas)

    }
}
</script>
<style lang="scss" scoped>
.three-map-container {
    width: 100%;
    height: 100%;
}
</style>