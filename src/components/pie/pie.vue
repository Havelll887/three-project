<template>
  <div class="pieContent" ref="pieContent"></div>
</template>

<script>
import { ThreeEngine } from "@/assets/js/initThree";
import { allBaseObject } from "@/assets/js/baseObject";
import { allLights} from "@/assets/js/light"
import { allHelper } from '@/assets/js/helper'
export default {
  name: "pieCharts",
  data() {
    return {
      ThreeEngine: null,
    };
  },
  mounted() {
    this.ThreeEngine = new ThreeEngine(this.$refs.pieContent);
    // this.ThreeEngine.addObject(...allBaseObject); // 添加基础模型
    this.ThreeEngine.addObject(...allLights)  // 添加光线
    this.ThreeEngine.addObject(...allHelper)   // 添加辅助
  },
};
</script>

<style>
.pieContent {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #d6eaff;
}
</style>
