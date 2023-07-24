import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 场景初始化构造器引入
import ThreeInit from "@/three/initScence/index.js"
// 灯光引入
import { allLights } from "@/three/light/index.js"

// 机柜集合列表
let cabinetsList = []
let curCabinet

export default class MachineRoom {
    constructor(canvas, path) {
        this.machineRoom = new ThreeInit(canvas)
        // 重设相机位置
        this.machineRoom.camera.position.set(0, 10, 15);
        this.machineRoom.camera.lookAt(0, 0, 0);

        // 纹理集合
        this.maps = new Map();

        // 加载gltf模型
        this.loadGLTF(path.modelPath, path.imgPath)

        // 添加光照
        // this.machineRoom.addObject(...allLights)

        // 选择事件添加
        // this.selectObject()
        // document.addEventListener('mousemove', this.selectObject);

        this.initTexture("cabinet-hover.jpg", path.imgPath);
        // this.initTexture("chassis.jpg", path.imgPath);

    }

    // 加载GLTF模型
    loadGLTF(modelPath, imgPath) {
        // GLTF 模型加载器
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(modelPath, ({ scene: { children } }) => {
            children.forEach((obj) => {
                const { map, color } = obj.material
                this.changeMaterial(obj, map, color, imgPath)
                // 模型分组创建的时候，包含‘cabinet’命名的是机柜
                if (obj.name.includes("cabinet")) {
                    cabinetsList.push(obj);
                }
            })
            this.machineRoom.scene.add(...children);
        })
    }

    // 修改材质
    changeMaterial(obj, map, color, baseUrl) {
        if (map) {
            obj.material = new THREE.MeshBasicMaterial({
                map: this.initTexture(map.name, baseUrl),
            })
        } else {
            obj.material = new THREE.MeshBasicMaterial({ color });
        }
    }

    // 创建纹理
    initTexture(img, baseUrl) {
        let curTexture = this.maps.get(img);
        if (!curTexture) {
            curTexture = new THREE.TextureLoader().load(baseUrl + img);  // 图像源是ImageBitmap 类型
            curTexture.flipY = false;   // flipY为false，即不对图像的y轴做翻转
            curTexture.wrapS = 1000;    // wrapS 纹理横向重复
            curTexture.wrapT = 1000;    // wrapT 纹理纵向重复
            this.maps.set(img, curTexture);
        }
        return curTexture;
    }

    // 对象选择
    selectObject(event) {
        //射线投射器，可基于鼠标点和相机，在世界坐标系内建立一条射线，用于选中模型
        const raycaster = new THREE.Raycaster();
        //鼠标在裁剪空间中的点位
        const pointer = new THREE.Vector2();
        // 鼠标的canvas坐标转裁剪坐标
        pointer.x = (event.layerX / window.innerWidth) * 2 - 1;
        pointer.y = - (event.layerY / window.innerHeight) * 2 + 1;
        // 基于鼠标点的裁剪坐标位和相机设置射线投射器
        raycaster.setFromCamera(pointer, this.machineRoom.camera);

        // 选择机柜
        const intersect = raycaster.intersectObjects(cabinetsList)[0];
        let intersectObj = intersect ? (intersect.object) : null;
        // 若之前已有机柜被选择，且不等于当前所选择的机柜，取消之前选择的机柜的高亮
        if (curCabinet && curCabinet !== intersectObj) {
            const material = curCabinet.material;
            material.map = this.maps.get("cabinet.jpg")
        }
        // 选中效果
        if (intersectObj) {
            if (intersectObj !== curCabinet) {
                curCabinet = intersectObj;
                const material = intersectObj.material
                material.map = this.maps.get("cabinet-hover.jpg")
            }
            return curCabinet
        } else {
            curCabinet = null
        }
    }

    // 对象销毁
    destroyed() {
        // console.log('!@@', this.pie)
        if (this.machineRoom.renderer) {
            this.machineRoom.renderer.forceContextLoss()
            this.machineRoom.renderer.dispose()
            this.machineRoom.renderer.domElement = null
            this.machineRoom.renderer = null
        }
        // window.removeEventListener('resize', this.resizeEventHandle)
    }
}