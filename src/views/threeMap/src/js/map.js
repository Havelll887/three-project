import * as THREE from "three";
import * as d3 from "d3";

import ThreeInit from "@/three/initScence/index.js"


// 颜色数组
const COLOR_ARR = ['#e83c62', '#ab2385', '#214897', '#f5d1b9', '#ff914b', '#d25131']
// 高亮颜色
const HIGHT_COLOR = '#ffff00'

// 墨卡托投影转换
const projection = d3.geoMercator().center([104.0, 37.5]).scale(80).translate([0, 0]);
export default class InitMap {
    constructor(canvas) {
        this.initMap = new ThreeInit(canvas, true)
        // 加载json数据
        this.loadMapData()
    }
    loadMapData() {
        let jsonData = require('@/views/threeMap/src/json/china.json')
        // 地图数据初始化并构建模型
        this.initMapData(jsonData)
    }

    initMapData(json) {
        // 建一个空组存放对象
        this.chinaMapGroup = new THREE.Group();

        json.features.forEach((ele, index) => {
            // 为每一个省份构建3D对象
            const province = new THREE.Object3D();
            // 每个省份的坐标信息
            const coordinates = ele.geometry.coordinates;
            // 选择颜色
            const color = COLOR_ARR[index % COLOR_ARR.length]

            coordinates.forEach(multiPolygon => {
                multiPolygon.forEach(polygon => {
                    const shape = new THREE.Shape();
                    for (let i = 0; i < polygon.length; i++) {
                        let [x, y] = projection(polygon[i]);

                        if (i === 0) {
                            shape.moveTo(x, -y);
                        }
                        shape.lineTo(x, -y);
                    }
                    const extrudeSettings = {
                        // depth: 4,
                        // bevelEnabled: true,
                        // bevelSegments: 1,
                        // bevelThickness: 0.2,
                        curveSegments: 256,
                        steps: 2,
                        depth: 1,
                        bevelEnabled: true,
                        bevelThickness: 0.01,
                        bevelSize: 0.01,
                        bevelOffset: 0.0,
                        bevelSegments: 1,
                    };

                    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);


                    const material = new THREE.MeshStandardMaterial({
                        // clearcoat: 3.0,
                        metalness: 1,
                        color: color,
                    });

                    const material1 = new THREE.MeshStandardMaterial({
                        // clearcoat: 3.0,
                        metalness: 1,
                        roughness: 1,
                        color: color,
                    });

                    const mesh = new THREE.Mesh(geometry, [
                        material,
                        material1
                    ]);
                    if (index % 2 === 0) {
                        mesh.scale.set(1, 1, 1.2);
                    }
                    mesh.castShadow = true
                    mesh.receiveShadow = true
                    mesh._color = color
                    province.add(mesh);
                })
            })
            // 将geo的属性放到省份模型中
            province.properties = ele.properties;
            if (ele.properties.centorid) {
                const [x, y] = projection(ele.properties.centorid);
                province.properties._centroid = [x, y];
            }
            this.chinaMapGroup.add(province);
        });
        this.initMap.scene.add(this.chinaMapGroup)
    }

    setLight() {

        let ambientLight = new THREE.AmbientLight(0xffffff, 1); // 环境光

        const light = new THREE.DirectionalLight(0xffffff, 0.5); // 平行光
        light.position.set(20, -50, 20);

        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;


        // 半球光
        let hemiLight = new THREE.HemisphereLight('#80edff', '#75baff', 0.3)
        // 这个也是默认位置
        hemiLight.position.set(20, -50, 0)
        this.initMap.scene.add(hemiLight)
        this.initMap.scene.add(light);
        this.initMap.scene.add(ambientLight);


        const pointLight = new THREE.PointLight(0xffffff, 0.5)
        pointLight.position.set(20, -50, 50);

        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 1024;
        pointLight.shadow.mapSize.height = 1024;


        const pointLight2 = new THREE.PointLight(0xffffff, 0.5)
        pointLight2.position.set(50, -50, 20);
        pointLight2.castShadow = true;
        pointLight2.shadow.mapSize.width = 1024;
        pointLight2.shadow.mapSize.height = 1024;

        const pointLight3 = new THREE.PointLight(0xffffff, 0.5)
        pointLight3.position.set(-50, -50, 20);
        pointLight3.castShadow = true;
        pointLight3.shadow.mapSize.width = 1024;
        pointLight3.shadow.mapSize.height = 1024;

        this.initMap.scene.add(ambientLight);
        this.initMap.scene.add(light);
        this.initMap.scene.add(pointLight);
        this.initMap.scene.add(pointLight2);
        this.initMap.scene.add(pointLight3);
    }
    // 图形销毁
    destroyed() {
        // if (this.initMap.renderer) {
        //     this.initMap.renderer.forceContextLoss()
        //     this.initMap.renderer.dispose()
        //     this.initMap.renderer.domElement = null
        //     this.initMap.renderer = null
        // }
        // window.removeEventListener('resize', this.initMap.winResize)
    }
}