import * as THREE from "three";
import * as d3 from "d3";

export const allBaseObject = []; // 返回所有基础模型

// allBaseObject.push(box); // 添加到模型数组

const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(5, 15, 20, 32, 30, false, 10, 1.5),
  new THREE.MeshStandardMaterial({
    color: "rgb(36, 172, 242)", // 设置材质的颜色
    metalness: 0, // 金属度 （1 最像金属，0 最不想金属）
    roughness: 1, // 粗糙度（0 最光滑，1 最粗糙）
  })
);
cylinder.position.set(20, 20, 20);
cylinder.userData = {
  name: "统计圆",
};
allBaseObject.push(cylinder); // 添加到模型数组

const length = 12,
  width = 8;

const shape = new THREE.Shape();
shape.moveTo(0, 0);
shape.lineTo(0, width);
shape.lineTo(length, width);
shape.lineTo(length, 0);
shape.lineTo(0, 0);

const extrudeSettings = {
  curveSegments: 256,
  steps: 2,
  depth: 1, // should be 1 for our scaling to wokr
  bevelEnabled: true,
  bevelThickness: 0.01,
  bevelSize: 0.01,
  bevelOffset: 0.0,
  bevelSegments: 1,
};

const extrudeGeometry = new THREE.Mesh(
  new THREE.ExtrudeGeometry(shape, extrudeSettings),
  new THREE.MeshStandardMaterial({ color: 0x00ff00 })
);

allBaseObject.push(extrudeGeometry); // 添加到模型数组
// let text = new d3.pie()
// console.log( THREE,d3)

// addGeoObject( group, obj );