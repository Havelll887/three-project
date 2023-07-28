import * as THREE from "three";
import * as d3 from "d3";

import ThreeInit from "@/three/initScence/index.js"


// 颜色数组
const COLOR_ARR = ['#e83c62', '#ab2385', '#214897', '#f5d1b9', '#ff914b', '#d25131']

// 高亮颜色
const HIGHT_COLOR = '#ffff00'

// 墨卡托投影转换
const projection = d3.geoMercator().center([115.892, 28.6765]).scale(80).translate([0, 0]);

// ExtrudeGeometry类型物体的设置参数
const extrudeSettings = {
    // 曲线上点的数量，默认值是12。
    // curveSegments: 256,
    // 用于沿着挤出样条的深度细分的点的数量，默认值为1。
    steps: 2,
    // 挤出的形状的深度，默认值为1。
    // depth: 0.8,
    // 对挤出的形状应用是否斜角，默认值为true。
    bevelEnabled: true,
    // 设置原始形状上斜角的厚度。默认值为0.2。
    bevelThickness: 0.01,
    // 斜角与原始形状轮廓之间的延伸距离，默认值为bevelThickness-0.1。
    bevelSize: 0.01,
    // Distance from the shape outline that the bevel starts. Default is 0.
    bevelOffset: 0.0,
    // 斜角的分段层数，默认值为3。
    bevelSegments: 1,
};


export default class InitMap {
    constructor(canvas) {
        this.initMap = new ThreeInit(canvas, true)
        this.initMap.camera.position.set(0, -10, 14);
        // 加载json数据
        this.loadMapData()
        // 添加灯光
        // this.setLight()
    }

    // 加载地图数据
    loadMapData() {
        let jsonData = require('@/views/threeMap/src/json/jiangxi.json')
        // 地图数据初始化并构建模型
        this.initMapData(jsonData)
    }

    // 处理地图数据
    initMapData(json) {
        // 建一个空组存放对象
        this.mapGroup = new THREE.Group();

        json.features.forEach((ele, index) => {
            // 为每一个省份构建3D对象
            const province = new THREE.Object3D();
            // 每个省份的坐标信息
            const coordinates = ele.geometry.coordinates;
            // 选择颜色
            // const color = COLOR_ARR[index % COLOR_ARR.length]

            const color = new THREE.Color(`hsl(
                ${233},
                ${Math.random() * 30 + 55}%,
                ${Math.random() * 30 + 55}%)`).getHex();
            const depth = Math.random() * 0.3 + 0.3;

            coordinates.forEach(multiPolygon => {
                const points = []
                multiPolygon.forEach(polygon => {

                    const shape = new THREE.Shape();
                    for (let i = 0; i < polygon.length; i++) {
                        let [x, y] = projection(polygon[i]);
                        // 插入边界坐标
                        points.push(new THREE.Vector3(x, -y, 0))
                        if (i === 0) {
                            shape.moveTo(x, -y);
                        }
                        shape.lineTo(x, -y);
                    }

                    // 材质获取
                    let mesh = this.creatMesh(shape, color, depth)

                    // 区分模型高度
                    if (index % 2 === 0) {
                        mesh.scale.set(1, 1, 1.2);
                    }
                    if (index % 3 === 0) {
                        mesh.scale.set(1, 1, 1.5);
                    }

                    // 使灯光投掷阴影
                    mesh.castShadow = true
                    // 使物体接受阴影
                    mesh.receiveShadow = true
                    mesh._color = color

                    province.add(mesh);
                })
                let lines = this.createLine(points, depth)
                province.add(...lines);
            })
            // 将geo的属性放到省份模型中
            province.properties = ele.properties;
            if (ele.properties.centorid) {
                const [x, y] = projection(ele.properties.centorid);
                province.properties._centroid = [x, y];
            }

            this.mapGroup.add(province);
        });
        this.initMap.scene.add(this.mapGroup)
    }

    // 创建材质
    creatMesh(shape, color, depth) {
        // ExtrudeGeometry  ————  从一个二维图形创建出一个三维图形
        const geometry = new THREE.ExtrudeGeometry(shape, { ...extrudeSettings, depth });

        // MeshStandardMaterial
        const materialPlane = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });

        const materialAround = new THREE.MeshBasicMaterial({ color: color, });

        const mesh = new THREE.Mesh(geometry, [
            materialPlane,
            materialAround
        ]);

        return mesh
    }

    createLine(points, depth) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const uplineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const downlineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const upLine = new THREE.Line(lineGeometry, uplineMaterial);
        const downLine = new THREE.Line(lineGeometry, downlineMaterial);
        downLine.position.z = -0.02;
        upLine.position.z = depth + 0.3;
        console.log([upLine, downLine])
        return [upLine, downLine];

    }
    // https://juejin.cn/post/7247027696822304827#heading-7

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
        if (this.initMap.renderer) {
            this.initMap.renderer.forceContextLoss()
            this.initMap.renderer.dispose()
            this.initMap.renderer.domElement = null
            this.initMap.renderer = null
        }
        // window.removeEventListener('resize', this.initMap.winResize)
    }
}