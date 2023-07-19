import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 场景初始化构造器引入
import ThreeInit from "@/three/initScence/index.js"

export default class MachineRoom {
    constructor(canvas, modelPath) {
        this.machineRoom = new ThreeInit(canvas)
        this.loadGLTF(modelPath)

    }

    // 加载GLTF模型
    loadGLTF(modelPath) {
        // GLTF 模型加载器
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(modelPath, ({ scene: { children } }) => {
            console.log(children)
            this.machineRoom.scene.add(...children);
        })
    }
}