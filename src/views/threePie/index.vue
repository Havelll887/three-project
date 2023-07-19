<template>
    <div class="three-pie-container">
        <canvas id="three3dPie"></canvas>
    </div>
</template>
<script>
import Pie from "./src/js/pie"
import { tempData } from "./src/data/index"
export default {
    name: 'threePie',
    data() {
        return {
            threePie: null
        }
    },
    mounted() {
        let canvas = document.getElementById('three3dPie')
        this.threePie = new Pie(canvas, tempData)
    },
    beforeDestroy() {
        // 图形销毁
        this.threePie.destroyed()
    }
}
</script>
<style lang="scss" scoped>
.three-pie-container {
    width: 100%;
    height: 100%;
}
</style>