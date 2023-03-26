import * as THREE from "three";

/**
 * 光线
 */
export const allLights = [];

// 添加环境光（自然光），设置自然光的颜色，设置自然光的强度（0 最暗， 1 最强）
export const ambientLight = new THREE.AmbientLight("rgb(255,255,255)", 1);
allLights.push(ambientLight);

// 点光源
export const pointLight = new THREE.PointLight("rgb(255,255,255)", 1);
pointLight.position.set(10, 15, 10); // 设置点光源位置 (x,y,z)

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
directionalLight.position.set( 10, 15, 1.0 ).normalize();
// allLights.push( directionalLight );

allLights.push(pointLight); // 将点光源添加到光源列表抛出
