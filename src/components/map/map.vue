<template>
    <div class="mapContent" ref="mapContent"></div>
  </template>
  
  <script>
  import { ThreeEngine } from "@/assets/js/initThree";

  import { allLights} from "@/assets/js/light"
  import { allHelper } from '@/assets/js/helper'
  export default {
    name: "threeMap",
    data() {
      return {
        ThreeEngine: null,
      };
    },
    mounted() {
      this.ThreeEngine = new ThreeEngine(this.$refs.mapContent);

      this.ThreeEngine.addObject(...allLights)  // 添加光线
    //   this.ThreeEngine.addObject(...allHelper)   // 添加辅助
    },
  };
  </script>
  
  <style>
  .mapContent {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #d6eaff;
  }
  </style>
  