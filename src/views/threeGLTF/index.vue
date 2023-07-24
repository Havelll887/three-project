<template>
    <div class="three-model-container">
        <canvas id="threeGLTF" @mousemove="move"></canvas>
        <div id="msgPlane">
            <p>机柜名称：{{ itemMsg?.name }}</p>
            <p>机柜温度：{{ itemMsg?.temperature }}°</p>
            <p>
                使用情况：{{ itemMsg?.count }}/{{ itemMsg?.capacity }}
            </p>
        </div>
    </div>
</template>
<script>
import MachineRoom from './src/js/gltf'
import { getCabinetByName } from '@/api/index'
export default {
    name: 'threeGLTF',
    data() {
        return {
            threeGLTF: null,
            path: {},
            itemMsg: {},
            targetItem: {}
        }
    },
    mounted() {
        let mapModelsBaseUrl = `${location.origin}${location.pathname}/static/model/`;
        let canvas = document.getElementById('threeGLTF')
        this.path = {
            modelPath: mapModelsBaseUrl + 'machineRoom.gltf',
            imgPath: mapModelsBaseUrl
        }
        this.threeGLTF = new MachineRoom(canvas, this.path)
    },
    methods: {
        move(event) {
            let item = this.threeGLTF.selectObject(event)
            if (!item) {
                let panel = document.getElementById('msgPlane')
                panel.style.display = 'none'
                return
            } else {
                if (this.targetItem.name !== item.name) {
                    this.targetItem = item
                    getCabinetByName(this.targetItem.name).then(res => {
                        this.itemMsg = res
                        let panel = document.getElementById('msgPlane')
                        panel.style.left = event.layerX + 'px'
                        panel.style.top = event.layerY + 'px'
                        panel.style.display = 'block'
                    })
                }
            }
        }
    },
    beforeDestroy() {
        // 图形销毁
        this.threeGLTF.destroyed()
    }
}
</script>
<style lang="scss" scoped>
.three-model-container {
    width: 100%;
    height: 100%;
}

#msgPlane {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    padding: 0 18px;
    transform: translate(12px, -100%);
    display: none;
    z-index: 999;
}
</style>