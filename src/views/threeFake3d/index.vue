<template>
    <div class="three-fake3d-container">
        <canvas id="three3dPicture"></canvas>
    </div>
</template>
<script>

import FakePic from './src/js/faker'

export default {
    name: 'threeFake3d',
    data() {
        return {
            threePic: null
        }
    },
    mounted() {
        let canvas = document.getElementById('three3dPicture')
        let pic = {
            img: require('@/views/threeFake3d/src/img/cat.jpg'),
            imgDep: require('@/views/threeFake3d/src/img/cat_depth.jpg'),
        }
        this.threePic = new FakePic(canvas, pic)
    },
    beforeDestroy() {
        // 图形销毁
        this.threePic.destroyed()
    }
}
</script>

<style lang="scss" scoped>
.three-fake3d-container {
    width: 100%;
    height: 100%;
}
</style>