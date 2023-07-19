<template>
    <div class="three-model-container">
        <canvas id="threeGLTF"></canvas>
    </div>
</template>
<script>
import MachineRoom from './src/js/gltf'
export default {
    name: 'threeGLTF',
    data() {
        return {
            threeGLTF: null
        }
    },
    mounted() {
        let mapModelsBaseUrl = `${location.origin}${location.pathname}/static/model/`;
        let canvas = document.getElementById('threeGLTF')
        this.threeGLTF = new MachineRoom(canvas, mapModelsBaseUrl + 'machineRoom.gltf')
    },
    beforeDestroy() {
        // 图形销毁
        // this.threeGLTF.destroyed()
    }
}
</script>
<style lang="scss" scoped>
.three-model-container {
    width: 100%;
    height: 100%;
}
</style>