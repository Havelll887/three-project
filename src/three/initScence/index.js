import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class threeInit {
    constructor(canvas) {
        // 渲染器
        this.renderer = new THREE.WebGLRenderer({ canvas });
        // 场景
        this.scene = new THREE.Scene();
        // 相机
        this.camera = new THREE.PerspectiveCamera(
            90,
            canvas.width / canvas.height,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 5.5);
        this.camera.lookAt(new Vector3(0, 0, 0)); // 设置相机看先中心点
        this.camera.up = new Vector3(0, 1, 0); // 设置相机自身方向
        this.camera.updateProjectionMatrix();
        // 控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        window.addEventListener("resize",this.winResize);
    }

    winResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
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
}