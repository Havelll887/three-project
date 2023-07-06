<template>
    <div class="mapContent" ref="mapContent">
        <div id="provinceInfo"></div>
    </div>
</template>
  
<script>
import lineMap from './map'
export default {
    name: "threeMap",
    props: {
        tagData: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            ThreeEngine: null,
            mapObj: null
        };
    },
    watch: {
        tagData(v) {
            this.mapObj.setTag(v)
        }
    },
    mounted() {
        // this.ThreeEngine = new ThreeEngine(this.$refs.mapContent);

        // this.ThreeEngine.addObject(...allLights)  // 添加光线
        // this.ThreeEngine.addObject(...allHelper)   // 添加辅助

        this.init();
    },
    beforeDestroy() {
        this.mapObj.destroyed()
    },
    methods: {
        init() {
            this.mapObj = new lineMap(
                this.$refs.mapContent,
                document.querySelector('#provinceInfo'),
                {
                    tagClick: this.tagClick.bind(this)
                }
            );
            this.mapObj.init();
            this.mapObj.setTag(this.tagData)
        },
        tagClick(v) {
            this.$emit('tagClick', v)
        }
    },
};
</script>
  
<style lang="scss" scoped>
.mapContent {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #d6eaff;

    #provinceInfo {
        position: absolute;
        color: #fff;
        user-select: none;
    }
}
</style>
  