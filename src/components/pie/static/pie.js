import * as d3 from "d3";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";


function makePie(data) {
    const arcs = d3.pie().value((d) => d.value)(data);
    const arcGenerator = d3
        .arc()
        .innerRadius(60) // 2
        .outerRadius(100) // 100
        .cornerRadius(5) // 0
        .padAngle(0.01); // 0.05
    const pieSvgDataUri = `data:image/svg+xml;base64,${btoa(`
    <g transform="scale(0.02)">
      ${arcs.map((arcData, i) => {
        // console.log(arcGenerator(arcData))
        return `<path d="${arcGenerator(arcData)}" />`;
    })}
      </g>
    </svg>
  `)}`;

    return { pieSvgDataUri, arcs, arcGenerator };
}


const datas = [
    {
        color: '#3b82f6',
        height: 0.5,
        value: 1.5,
    },
    {
        color: '#f43f5e',
        height: 0.5,
        value: 0.8,
    },
    {
        color: '#f97316',
        height: 0.5,
        value: 1,
    },
    {
        color: '#22c55e',
        height: 0.5,
        value: 0.3,
    },
]


export function initSVGObject() {

    const { pieSvgDataUri, arcs, arcGenerator } = makePie(datas)

    arcs.forEach(ele => {
        ele.path = arcGenerator(ele)
    })

    return { arcs, pieSvgDataUri };
}



export function addGeoObject(group, svgObject, pieSvgDataUri) {
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
                color: datas[i].color,
                roughness: 0.5,
                metalness: 0.5
            });
            const mesh = new THREE.Mesh(shape3d, material);
            mesh.rotateX(-Math.PI / 2);//绕x轴旋转π/4
            mesh.rotateZ(-Math.PI / 4);//绕x轴旋转π/4
            group.add(mesh);
        }
    });
}
