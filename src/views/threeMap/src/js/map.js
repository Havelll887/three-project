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
const HIGHT_COLOR = '#06266f'

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

// 当前选择的目标
let curTarget
let lastColor

export default class InitMap {
    constructor(canvas) {
        this.initMap = new ThreeInit(canvas, true)
        this.initMap.camera.position.set(0, 20, 0);

        this.createLabelRender()

        // 加载json数据
        this.loadMapData()
        this.animates()

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
                let icons = this.createIcon(center, depth)
                let lines = this.createLine(points, depth)
                province.add(...lines);
                province.add(labels);
                province.add(icons);
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
        // 重绘中心点
        this.setCenter()
    }

    // 创建材质
    creatMesh(shape, color, depth) {
        // ExtrudeGeometry  ————  从一个二维图形创建出一个三维图形
        const geometry = new THREE.ExtrudeGeometry(shape, { ...extrudeSettings, depth });

        // MeshStandardMaterial
        const materialPlane = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide, opacity: 0.6 });

        const materialAround = new THREE.MeshBasicMaterial({ color: color, opacity: 0.6 });

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
    animates() {
        if (!this.initMap.renderer) return
        this.labelRenderer.render(this.initMap.scene, this.initMap.camera);
        this.initMap.renderer.render(this.initMap.scene, this.initMap.camera);
        requestAnimationFrame(() => {
            this.animates();
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

    // 添加图标
    createIcon(point, depth) {
        const url = require('@/views/threeMap/src/img/icon.png')

        const map = new THREE.TextureLoader().load(url);
        const material = new THREE.SpriteMaterial({
            map: map,
            transparent: true,
        });

        // Sprite ———— 永远面向相机的平面
        const sprite = new THREE.Sprite(material);
        const [x, y] = projection(point);
        sprite.position.set(x - 0.1, -y + 0.2, depth + 0.2);
        sprite.scale.set(0.3, 0.3, 0.3);

        sprite.renderOrder = 1;

        return sprite;
    }

    // 中心点设置
    setCenter() {
        this.mapGroup.rotation.x = -Math.PI / 2;

        // 使用包围盒设定中心点
        const box = new THREE.Box3().setFromObject(this.mapGroup);
        // 获取包围盒的中心点坐标
        const center = box.getCenter(new THREE.Vector3());

        const offset = [0, 0];
        this.mapGroup.position.x = this.mapGroup.position.x - center.x - offset[0];
        this.mapGroup.position.z = this.mapGroup.position.z - center.z - offset[1];
    }

    // 鼠标事件
    setRaycaster(event) {
        //射线投射器，可基于鼠标点和相机，在世界坐标系内建立一条射线，用于选中模型
        const raycaster = new THREE.Raycaster();
        //鼠标在裁剪空间中的点位
        const pointer = new THREE.Vector2();
        // 鼠标的canvas坐标转裁剪坐标
        pointer.x = (event.layerX / window.innerWidth) * 2 - 1;
        pointer.y = - (event.layerY / window.innerHeight) * 2 + 1;
        // 基于鼠标点的裁剪坐标位和相机设置射线投射器
        raycaster.setFromCamera(pointer, this.initMap.camera);
        const intersects = raycaster
            .intersectObjects(this.mapGroup.children)
            .filter((item) => item.object.type !== "Line");

        let intersectObj = intersects[0] ? (intersects[0].object) : null;



        if (intersectObj && intersectObj.type === "Mesh") {

            if (curTarget && curTarget !== intersectObj) {
                const material = curTarget.material;
                // material.color.set(HIGHT_COLOR);
                // material[0].color = lastColor;
                // material[1].color = lastColor;
                material[0].color.set(lastColor);
                material[1].color.set(lastColor);

            }

            if (intersectObj) {
                if (intersectObj !== curTarget) {
                    curTarget = intersectObj;
                    const material = intersectObj.material
                    lastColor = material[0].color.getStyle()

                    material[0].color.set(HIGHT_COLOR);
                    material[1].color.set(HIGHT_COLOR);

                   
                }
                return curTarget
            } else {
                return null
            }
        } else if (intersectObj && intersectObj.type === "Sprite") {
            console.log('@@', intersectObj)
            return null
        } else {
            if (curTarget) {
                const material = curTarget.material;
                material[0].color.set(lastColor);
                material[1].color.set(lastColor);
                curTarget = null
            }
            return null
        }
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