import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import Stats from "three/addons/libs/stats.module.js";

const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);
// 아래도 loadAsync 로 바꿀 수 있음
new RGBELoader().load("img/venice_sunset_1k.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture;
  scene.backgroundBlurriness = 1.0;
});

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(2, 1, -2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.y = 0.75;
controls.enableDamping = true;

// 방법3) 함수로 분리
const loadCar = async () => {
  const loader = new GLTFLoader();
  const [...model] = await Promise.all([
    loader.loadAsync("models/suv_body.glb"),
    loader.loadAsync("models/suv_wheel.glb"),
  ]);
  const suvBody = model[0].scene;
  const wheels = [
    model[1].scene,
    model[1].scene.clone(),
    model[1].scene.clone(),
    model[1].scene.clone(),
  ];

  wheels[0].position.set(-0.65, 0.2, -0.77);
  wheels[1].position.set(0.65, 0.2, -0.77);
  wheels[1].rotateY(Math.PI);
  wheels[2].position.set(-0.65, 0.2, 0.57);
  wheels[3].position.set(0.65, 0.2, 0.57);
  wheels[3].rotateY(Math.PI);
  suvBody.add(...wheels);

  scene.add(suvBody);
};
await loadCar();

// 방법2) loadAsync 를 사용하여 순서를 보장할 수 있다
// const loader = new GLTFLoader();
// let suvBody: THREE.Object3D;
// await loader.loadAsync("models/suv_body.glb").then((gltf) => {
//   suvBody = gltf.scene;
// });
// await loader.loadAsync("models/suv_wheel.glb").then((gltf) => {
//   const wheels = [
//     gltf.scene, // 좌전륜
//     gltf.scene.clone(), // 우전륜
//     gltf.scene.clone(), // 좌후륜
//     gltf.scene.clone(), // 우후륜
//   ];
//   // 좌전륜
//   wheels[0].position.set(-0.65, 0.2, -0.77);
//   // 우전륜
//   wheels[1].position.set(0.65, 0.2, -0.77);
//   wheels[1].rotateY(Math.PI);
//   // 좌후륜
//   wheels[2].position.set(-0.65, 0.2, 0.57);
//   // 우후륜
//   wheels[3].position.set(0.65, 0.2, 0.57);
//   wheels[3].rotateY(Math.PI);
//   suvBody.add(...wheels);
//   scene.add(suvBody);
// });
// 방법1) 동기적 방법
/*
loader.load("models/suv_body.glb", (gltf) => {
  suvBody = gltf.scene;
  // 로딩을 한 번만 하고 복사해서 사용하는 방식
  loader.load("models/suv_wheel.glb", (gltf) => {
    const wheels = [
      gltf.scene, // 좌전륜
      gltf.scene.clone(), // 우전륜
      gltf.scene.clone(), // 좌후륜
      gltf.scene.clone(), // 우후륜
    ];
    // 좌전륜
    wheels[0].position.set(-0.65, 0.2, -0.77);
    // 우전륜
    wheels[1].position.set(0.65, 0.2, -0.77);
    wheels[1].rotateY(Math.PI);
    // 좌후륜
    wheels[2].position.set(-0.65, 0.2, 0.57);
    // 우후륜
    wheels[3].position.set(0.65, 0.2, 0.57);
    wheels[3].rotateY(Math.PI);
    suvBody.add(...wheels);
  });
  // 일일이 로드해서 사용할 수도 있지만, 비동기적으로 실행되기 때문에 속도가 느릴 수 있음


  // 좌전륜
  // loader.load("models/suv_wheel.glb", (gltf) => {
  //   // 포지션 세팅안하면 차체 바로 정가운데 아래에 배치됨
  //   gltf.scene.position.set(-0.65, 0.2, -0.77);
  //   suvBody.add(gltf.scene);
  // });
  // // 우전륜
  // loader.load("models/suv_wheel.glb", (gltf) => {
  //   gltf.scene.position.set(0.65, 0.2, -0.77);
  //   gltf.scene.rotateY(Math.PI);
  //   suvBody.add(gltf.scene);
  // });
  // // 좌후륜
  // loader.load("models/suv_wheel.glb", (gltf) => {
  //   gltf.scene.position.set(-0.65, 0.2, 0.57);
  //   suvBody.add(gltf.scene);
  // });
  // // 우후륜
  // loader.load("models/suv_wheel.glb", (gltf) => {
  //   gltf.scene.position.set(0.65, 0.2, 0.57);
  //   gltf.scene.rotateY(Math.PI);
  //   suvBody.add(gltf.scene);
  // });

  scene.add(suvBody);
});
*/
const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);

  stats.update();
}

animate();
