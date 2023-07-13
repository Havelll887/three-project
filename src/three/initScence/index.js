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
        // 控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    // 连续渲染
    animate() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => {
            this.animate();
        });
    }
}