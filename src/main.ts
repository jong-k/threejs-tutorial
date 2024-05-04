import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 1.5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

// new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial({ wireframe: true });

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const stats = new Stats();
document.body.appendChild(stats.dom);

// const clock = new THREE.Clock();

// 매번 렌더링시키지 않고 orbit control에 따라 리렌더링하려면
// + orbit control 에 따라 stats 도 업데이트
const orbitControls = new OrbitControls(camera, renderer.domElement);

renderer.render(scene, camera);
orbitControls.addEventListener("change", () => {
  renderer.render(scene, camera);
});
//
function animate() {
  //   // window 내장 함수 + animate 재귀 호출
  requestAnimationFrame(animate);
  //
  //   const deltaTime = clock.getDelta();
  //
  //   // delta time 을 곱해서 모니터의 프레임마다 속도가 달라지는 것을 보정해줌
  //   cube.rotation.x += 1 * deltaTime;
  //   cube.rotation.y += 1 * deltaTime;
  //
  //   renderer.render(scene, camera);
  //
  stats.update();
}
//
animate();
