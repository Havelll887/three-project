import { WebGLRenderer, Scene, PerspectiveCamera, Vector3, MOUSE } from "three";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { addGeoObject, initSVGObject } from "./svgGraphic";
import Stats from "three/addons/libs/stats.module.js";

export class ThreeEngine {
    container = null; // 挂载的 DOM
    scene = null; // 场景
    constructor(container) {
        // 创建渲染器
        let renderer = new WebGLRenderer({
            antialias: true, // 开启抗锯齿
        });
        container.appendChild(renderer.domElement); // 将渲染器挂载到dom
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.offsetWidth, container.offsetHeight, true);
        let scene = new Scene(); // 实例化场景
        // 实例化相机
        let camera = new PerspectiveCamera(
            45,
            container.offsetWidth / container.offsetHeight,
            1,
            1000
        );
        camera.position.set(6, 6, 8); // 设置相机位置
        camera.lookAt(new Vector3(0, 0, 0)); // 设置相机看先中心点
        camera.up = new Vector3(0, 1, 0); // 设置相机自身方向
        // camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        const group = new THREE.Group();
        scene.add(group);


        let selectedObject = null;
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        this.container = container;
        this.scene = scene;
        this.group = group;

        let orbitControls = new OrbitControls(camera, renderer.domElement);

        let stats = new Stats();
        container.appendChild(stats.dom);

        renderer.render(scene, camera); // 渲染器渲染场景和相机
        renderer.setClearColor(0x1f2937, 1); //设置背景颜色
        let onWindowResize = () => {
            // console.log('dede',window)
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", onWindowResize);

        let onPointerMove = (event) => {


            if (selectedObject) {

                selectedObject.scale.set(1, 1, 1)
                selectedObject = null;
            }

            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(pointer, camera);

            const intersects = raycaster.intersectObject(group, true);

            if (intersects.length > 0) {

                const res = intersects.filter(function (res) {
                    return res && res.object;
                })[0];

                if (res && res.object) {
                    console.log('dedede', res)

                    selectedObject = res.object;
                    selectedObject.scale.set(2, 2, 2)

                }

            }
        }

        document.addEventListener('pointermove', onPointerMove);

        // 逐帧渲染threejs
        let animate = () => {
            renderer.render(scene, camera); // 渲染器渲染场景和相机
            requestAnimationFrame(animate);
            stats.update();
        };
        animate();
    }
    /**
     * 向场景中添加模型
     * @param  {...any} object 模型列表
     */
    addObject(...object) {
        object.forEach((elem) => {
            this.scene.add(elem); // 场景添加模型
        });
    }
    addSvg() {
        const { arcs, pieSvgDataUri } = initSVGObject();
        addGeoObject(this.group, arcs, pieSvgDataUri);
    }
}
