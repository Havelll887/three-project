<template>
    <div class="three-map-container">
        <canvas id="three3dPie"></canvas>
    </div>
</template>
<script>
import pie from "./src/js/pie"
export default {
    name: 'threePie',
    data() {
        return {
            threePie: null
        }
    },
    mounted() {
        let canvas = document.getElementById('three3dPie')
        this.threePie = new pie(canvas)
    },
    beforeDestroy() {
        // 图形销毁
        this.threePie.destroyed()
    }
}
</script>
<style lang="scss" scoped>
.three-map-container {
    width: 100%;
    height: 100%;
}
</style>