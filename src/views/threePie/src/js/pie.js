import * as d3 from "d3";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

// 场景初始化构造器引入
import ThreeInit from "@/three/initScence/index.js"
// 灯光引入
import { allLights } from "@/three/light/index.js"

// 场景辅助引入
import { allHelper } from '@/three/helpers/index.js'


export default class InitPie {
    constructor(canvas, data) {
        // 实例化场景
        this.pie = new ThreeInit(canvas, true)

        // 重新设置相机位置
        this.pie.camera.position.set(6, 6, 8); // 设置相机位置
        this.pie.camera.lookAt(new THREE.Vector3(0, 0, 0)); // 设置相机看先中心点
        this.pie.camera.up = new THREE.Vector3(0, 1, 0); // 设置相机自身方向

        // 构建并添加空组
        const groupPie = new THREE.Group();
        this.pie.scene.add(groupPie)

        // 添加svg对象
        this.addSvg(groupPie, data)

        this.pie.addObject(...allLights)  // 添加光线
        this.pie.addObject(...allHelper)   // 添加辅助

        // 鼠标事件添加
        this.mouseEvent(groupPie)
        // console.log('!!', this.pie)
    }

    // 添加svg构建对象至场景种
    addSvg(groupPie, data) {
        const { pieSvgDataUri } = this.initSvgPie(data);
        this.loadSvgPie(groupPie, pieSvgDataUri, data);
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
    initSvgPie(data) {
        const { pieSvgDataUri, arcs, arcGenerator } = this.makePie(data)
        arcs.forEach(ele => {
            ele.path = arcGenerator(ele)
        })
        return { pieSvgDataUri };
    }
    // 构建材质并添加对象
    loadSvgPie(group, pieSvgDataUri, data) {
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
                    color: data[i].color,
                    roughness: 0.3,
                    metalness: 0.3
                });
                const mesh = new THREE.Mesh(shape3d, material);
                mesh.rotateX(-Math.PI / 2);//绕x轴旋转π/4
                mesh.rotateZ(-Math.PI / 4);//绕x轴旋转π/4
                group.add(mesh);
            }
        })
    }

    // 鼠标事件
    mouseEvent(group) {
        /**
         * 光线投射，发射一个特定方向的射线，来检测是否有物体与这个射线相交
         * 
         * 检测物体是否在鼠标后面：发射一个从相机位置到鼠标方向的射线
         * */
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        let selectedObject = null;
        // 鼠标移动事件
        const onPointerMove = (event) => {
            if (selectedObject) {
                selectedObject.scale.set(1, 1, 1)
                selectedObject = null;
            }

            pointer.x = (event.layerX / window.innerWidth) * 2 - 1;
            pointer.y = - (event.layerY / window.innerHeight) * 2 + 1;
            /**
             * .setFromCamera ( coords : Vector2, camera : Camera ) 
             * coords —— 在标准化设备坐标中鼠标的二维坐标 —— X分量与Y分量应当在-1到1之间。
             * camera —— 射线所来源的摄像机
             * */
            raycaster.setFromCamera(pointer, this.pie.camera);

            // 添加检测对象数组
            const intersects = raycaster.intersectObject(group, true);

            if (intersects.length > 0) {
                const res = intersects.filter(function (res) {
                    return res && res.object;
                })[0];
                if (res && res.object) {
                    selectedObject = res.object;
                    selectedObject.scale.set(1, 1, 2)
                }
            }
        }
        // 监听鼠标移动事件
        document.addEventListener('pointermove', onPointerMove);
    }

    // 对象销毁
    destroyed() {
        if (this.pie.renderer) {
            this.pie.renderer.forceContextLoss()
            this.pie.renderer.dispose()
            this.pie.renderer.domElement = null
            this.pie.renderer = null
        }
        // window.removeEventListener('resize', this.resizeEventHandle)
    }
}