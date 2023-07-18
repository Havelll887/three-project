import * as d3 from "d3";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

// 场景初始化构造器引入
import ThreeInit from "@/three/initScence/index.js"
// 灯光引入
import { allLights } from "@/three/light/index.js"

// 场景辅助引入
import { allHelper } from '@/three/helpers/index.js'

// 临时数据
const tempData = [
    {
        color: '#3b82f6',
        height: 0.5,
        value: 1.5,
    },
    {
        color: '#f43f5e',
        height: 0.5,
        value: 0.8,
    },
    {
        color: '#f97316',
        height: 0.5,
        value: 1,
    },
    {
        color: '#22c55e',
        height: 0.5,
        value: 0.3,
    },
]
export default class initPie {
    constructor(canvas) {
        // 实例化场景
        this.pie = new ThreeInit(canvas)

        // 重新设置相机位置
        this.pie.camera.position.set(6, 6, 8); // 设置相机位置
        this.pie.camera.lookAt(new THREE.Vector3(0, 0, 0)); // 设置相机看先中心点
        this.pie.camera.up = new THREE.Vector3(0, 1, 0); // 设置相机自身方向

        // 构建并添加空组
        const groupPie = new THREE.Group();
        this.pie.scene.add(groupPie)

        // 添加svg对象
        this.addSvg(groupPie)

        this.pie.addObject(...allLights)  // 添加光线
        this.pie.addObject(...allHelper)   // 添加辅助
    }

    // 添加svg构建对象至场景种
    addSvg(groupPie) {
        const { pieSvgDataUri } = this.initSvgPie();
        this.loadSvgPie(groupPie, pieSvgDataUri);
    }

    // 获取pie的svg数据
    makePie(data) {
        const arcs = d3.pie().value((d) => d.value)(data);
        const arcGenerator = d3
            .arc()
            .innerRadius(60) // 2
            .outerRadius(100) // 100
            .cornerRadius(5) // 0
            .padAngle(0.01); // 0.05

        const pieSvgDataUri = `
            data:image/svg+xml;base64,${btoa(`
                <g transform="scale(0.02)">
                    ${arcs.map((arcData, i) => {
            return `<path d="${arcGenerator(arcData)}" />`;
        })}
                </g>
            </svg>
            `)}`;

        return { pieSvgDataUri, arcs, arcGenerator };
    }
    // 初始化svg对象
    initSvgPie() {
        const { pieSvgDataUri, arcs, arcGenerator } = this.makePie(tempData)
        arcs.forEach(ele => {
            ele.path = arcGenerator(ele)
        })
        return { pieSvgDataUri };
    }
    // 构建材质并添加对象
    loadSvgPie(group, pieSvgDataUri) {
        const loadedr = new SVGLoader();
        loadedr.load(pieSvgDataUri, (loadedSvgData) => {
            const shapes = loadedSvgData.paths.map((shapePath) => shapePath.toShapes())
            for (let i = 0; i < shapes.length; i++) {
                const shape3d = new THREE.ExtrudeGeometry(shapes[i], {
                    curveSegments: 256,
                    steps: 2,
                    depth: 1,
                    bevelEnabled: true,
                    bevelThickness: 0.01,
                    bevelSize: 0.01,
                    bevelOffset: 0.0,
                    bevelSegments: 1,
                });
                const material = new THREE.MeshStandardMaterial({
                    color: tempData[i].color,
                    roughness: 0.5,
                    metalness: 0.5
                });
                const mesh = new THREE.Mesh(shape3d, material);
                mesh.rotateX(-Math.PI / 2);//绕x轴旋转π/4
                mesh.rotateZ(-Math.PI / 4);//绕x轴旋转π/4
                group.add(mesh);
            }
        })
    }
    // 对象销毁
    destroyed() {
        console.log('!@@', this.pie)
    }
}