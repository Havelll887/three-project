import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class ThreeInit {
    constructor(
        canvas,
        camera = {

        }
    ) {
        // 渲染器
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true, // 开启抗锯齿
        });
        // 设置像素比，
        // this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        // this.renderer.setSize(window.innerWidth, window.innerHeight, true);

        // this.renderer.shadowMap.enabled = true; // 开启阴影
        /**
         * 阴影类型 - PCFSoftShadowMap
         * Percentage-Closer Filtering (PCF) 算法过滤阴影映射
         */
        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        /**
         * 色调映射 tone mapping
         * 曝光度 toneMappingExposure  
        */
        // this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        // this.renderer.toneMappingExposure = 1;

        // 场景
        this.scene = new THREE.Scene();
        // 相机
        this.camera = new THREE.PerspectiveCamera(
            45,
            canvas.width / canvas.height,
            0.1,
            5000
        );
        this.camera.position.set(0, -40, 70);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // 设置相机看先中心点
        // this.camera.up = new THREE.Vector3(0, 1, 0); // 设置相机自身方向
        // 手动更新相机的投影矩阵
        this.camera.updateProjectionMatrix();  // 更新相机矩阵

        // 窗口变化监听
        window.addEventListener("resize", this.winResize(this.camera, this.renderer));
        // 鼠标移动事件
        document.addEventListener('pointermove', this.onPointerMove);
        //设置背景颜色
        this.renderer.setClearColor(0x1f2937, 1);
        // 渲染
        this.animate();
        // 控制器
        this.setController()
        // this.setRaycaster()

    }

    // 设置控制器
    setController() {
        this.controller = new OrbitControls(this.camera, this.renderer.domElement);
        this.controller.update();
    }

    // 窗口边界变化
    winResize(camera, renderer) {
        // update camera
        camera.aspect = window.innerWidth / window.innerHeight;
        // 手动更新相机的投影矩阵
        camera.updateProjectionMatrix();
        // update renderer
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    // 连续渲染
    animate() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => {
            this.animate();
        });
    }

    /**
    * 向场景中添加模型
    */
    addObject(...object) {
        object.forEach((elem) => {
            this.scene.add(elem); // 场景添加模型
        });
    }

    // 鼠标移动事件
    onPointerMove() {

    }

    // 鼠标
    setRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.eventOffset = {};
        const _this = this
        function onMouseMove(event) {
            // let { top, left, width, height } = _this.can.getBoundingClientRect()
            let clientX = event.clientX
            let clientY = event.clientY

            // _this.mouse.x = (clientX / width) * 2 - 1;
            // _this.mouse.y = -(clientY / height) * 2 + 1;

            _this.mouse.x = clientX;
            _this.mouse.y = clientY;

            // _this.eventOffset.x = clientX;
            // _this.eventOffset.y = clientY;
            // _this.provinceInfo.style.left = _this.eventOffset.x + 10 + 'px';
            // _this.provinceInfo.style.top = _this.eventOffset.y - 20 + 'px';
            console.log('!@@!@!1223', event)
        }
        window.addEventListener('mousemove', onMouseMove, false);

        // const onMouseMove = (event) = >{
        // document.addEventListener('pointermove', onPointerMove);
        // }
    }
}