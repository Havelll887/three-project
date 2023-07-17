import * as THREE from "three";
import * as d3 from "d3";

import ThreeInit from "@/three/initScence/index.js"


// 墨卡托投影转换
const projection = d3.geoMercator().center([104.0, 37.5]).scale(80).translate([0, 0]);

export default class initMap {
    constructor(canvas) {
        this.initMap = new ThreeInit(canvas)

        this.loadMapData()
    }
    loadMapData() {
        let jsonData = require('@/views/threeMap/src/json/china.json')
        this.initMapData(jsonData)
    }
    initMapData(json) {
        console.log('json', json)
    }
}