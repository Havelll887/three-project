
import * as THREE from "three";

// 场景初始化构造器引入
import ThreeInit from "@/three/initScence/index.js"


export default class FakePic {
    constructor(canvas, data) {
        // 实例化场景
        this.fakePic = new ThreeInit(canvas, false);

        // 重新设置相机位置
        this.fakePic.camera.position.set(0, 0, 15); // 设置相机位置
        this.fakePic.camera.lookAt(new THREE.Vector3(0, 0, 0)); // 设置相机看先中心点
        this.fakePic.camera.up = new THREE.Vector3(0, 0, 0); // 设置相机自身方向

        // 鼠标坐标
        this.mouse = new THREE.Vector2();

        // 添加平面
        this.addPlane(data.img, data.imgDep)

        // 鼠标移动监听
        window.addEventListener("mousemove", (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            // this.moveByPoints(event)
        });
    }

    // 加载纹理
    loadTexture(imgURL) {
        // 纹理加载器
        let textureLoader = new THREE.TextureLoader();
        const img = textureLoader.load(imgURL);
        return img
    }
    // 加载材质
    loadMaterial(img, imgDep) {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: this.loadTexture(img) },
                uDepthTexture: { value: this.loadTexture(imgDep) },
                uMouse: { value: this.mouse },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
              `,
            fragmentShader: `
                uniform sampler2D uTexture;
                uniform sampler2D uDepthTexture;
                uniform vec2 uMouse;
                varying vec2 vUv;
                void main() {
                  vec4 color = texture2D(uTexture, vUv);
                  vec4 depth = texture2D(uDepthTexture, vUv);
                  float depthValue = depth.r;
                  float x = vUv.x + (uMouse.x) * 0.01 * depthValue;
                  float y = vUv.y + (uMouse.y) * 0.01 * depthValue;
                  vec4 newColor = texture2D(uTexture, vec2(x, y));
                  gl_FragColor = newColor;
                }
              `,
        })
        return material
    }

    // 摄像机随鼠标移动增加3d效果
    // moveByPoints(mouseEvent) {
    //     let x = mouseEvent.clientX - window.innerWidth / 2
    //     let y = mouseEvent.clientY - window.innerHeight / 2;
    //     // mouseX = ( event.clientX - windowHalfX );
    //     // mouseY = ( event.clientY - windowHalfY );
    //     this.fakePic.camera.position.x += (this.mouse.x - this.fakePic.camera.position.x) * 0.05;
    //     this.fakePic.camera.position.y += (- this.mouse.y - this.fakePic.camera.position.y) * 0.05;
    //     this.fakePic.camera.lookAt(this.fakePic.scene.position);

    //     this.fakePic.renderer.render(this.fakePic.scene, this.fakePic.camera);
    // }

    // 添加平面
    addPlane(img, imgDep) {
        const geo = new THREE.PlaneGeometry(19.2, 12);
        const plane = new THREE.Mesh(geo, this.loadMaterial(img, imgDep));
        this.fakePic.scene.add(plane);
    }

    // 对象销毁
    destroyed() {
        if (this.fakePic.renderer) {
            this.fakePic.renderer.forceContextLoss()
            this.fakePic.renderer.dispose()
            this.fakePic.renderer.domElement = null
            this.fakePic.renderer = null
        }
        // window.removeEventListener('resize', this.resizeEventHandle)
    }

}