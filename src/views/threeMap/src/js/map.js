import * as THREE from "three";
import * as d3 from "d3";

import ThreeInit from "@/three/initScence/index.js"
import {
    CSS2DRenderer,
    CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";


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

        this.createLabelRender()
        this.animate()

        // 加载json数据
        this.loadMapData()
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
            const { center, name } = ele.properties;


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
                    // if (index % 2 === 0) {
                    //     mesh.scale.set(1, 1, 1.2);
                    // }
                    // if (index % 3 === 0) {
                    //     mesh.scale.set(1, 1, 1.5);
                    // }

                    // 使灯光投掷阴影
                    mesh.castShadow = true
                    // 使物体接受阴影
                    mesh.receiveShadow = true
                    mesh._color = color

                    province.add(mesh);
                })
                let labels = this.createLabel(name, center, depth)
                let lines = this.createLine(points, depth)
                province.add(...lines);
                console.log('!!@', labels, lines)
                province.add(labels);
            })
            // 将geo的属性放到省份模型中
            province.properties = ele.properties;
            // if (ele.properties.centorid) {
            //     const [x, y] = projection(ele.properties.centorid);
            //     province.properties._centroid = [x, y];
            // }

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

    // 绘制边界线
    createLine(points, depth) {
        // 边界图形实例化
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

        // 上边界线
        const uplineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const upLine = new THREE.Line(lineGeometry, uplineMaterial);
        upLine.position.z = depth + 0.02;

        // 下边界线
        const downlineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const downLine = new THREE.Line(lineGeometry, downlineMaterial);
        downLine.position.z = -0.02;

        return [upLine, downLine];
    }

    // 标签绘制
    createLabel(name, point, depth) {
        const div = document.createElement("div");
        div.style.color = "#fff";
        div.style.fontSize = "14px";
        div.style.textShadow = "1px 1px 2px #047cd6";
        div.textContent = name;
        const label = new CSS2DObject(div);

        const [x, y] = projection(point);
        label.position.set(x, -y, depth);

        return label;
    }



    // 连续渲染
    animate() {
        this.labelRenderer.render(this.initMap.scene, this.initMap.camera);
        requestAnimationFrame(() => {
            this.animate();
        });
    }


    // 构建标签渲染器
    createLabelRender() {
        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.domElement.style.position = "absolute";
        this.labelRenderer.domElement.style.top = "0px";
        this.labelRenderer.domElement.style.pointerEvents = "none";
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("mapContainer").appendChild(this.labelRenderer.domElement);
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