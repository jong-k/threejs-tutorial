import "../index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import Stats from "three/addons/libs/stats.module.js";

const scene = new THREE.Scene();

new RGBELoader().load("img/venice_sunset_1k.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture;
  scene.backgroundBlurriness = 0.5;
});

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(0, 0, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const raycaster = new THREE.Raycaster();
// raycaster 와 접하는지 확인할 오브젝트들이 속하는 배열
const pickables: THREE.Mesh[] = [];
const mouse = new THREE.Vector2();

const arrowHelper = new THREE.ArrowHelper();
arrowHelper.setLength(0.5);
scene.add(arrowHelper);

renderer.domElement.addEventListener("mousemove", (e) => {
  console.log(e.clientY / renderer.domElement.clientHeight);

  // 정중앙을 0, 0 으로 놓고 2차원 좌표평명에서 벡터를 계산
  // 우상향 할수록 1, 1
  // 좌상향 할수록 -1, -1
  // e.clientX: 전체 화면에서의 좌표
  // renderer.domElement.clientWidth: renderer의 너비 (고정값)
  // e.clientX / renderer.domElement.clientWidth: 0 ~ 1 <- 여기에 곱하기 2 하면 0 ~ 2
  // 다시 0 ~ 2 에서 -1 하면 -1 ~ 1
  mouse.set(
    (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -(e.clientY / renderer.domElement.clientHeight) * 2 + 1,
  );

  raycaster.setFromCamera(mouse, camera);

  // pickables 에 있는 오브젝트들과 ray 와의 교차점 정보를 담은 객체들
  const intersects = raycaster.intersectObjects(pickables, false);

  if (intersects.length) {
    // console.log(intersects.length); // 교차점의 갯수
    //console.log(intersects[0].point)
    // console.log(intersects[0].object.name + " " + intersects[0].distance);
    //console.log((intersects[0].face as THREE.Face).normal)

    const n = new THREE.Vector3();
    n.copy((intersects[0].face as THREE.Face).normal);
    //n.transformDirection(intersects[0].object.matrixWorld)

    arrowHelper.setDirection(n);
    arrowHelper.position.copy(intersects[0].point);
  }
});

renderer.domElement.addEventListener("dblclick", (e) => {
  mouse.set(
    (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -(e.clientY / renderer.domElement.clientHeight) * 2 + 1,
  );

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(pickables, false);

  if (intersects.length) {
    const n = new THREE.Vector3();
    n.copy((intersects[0].face as THREE.Face).normal);
    //n.transformDirection(intersects[0].object.matrixWorld)

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.2),
      new THREE.MeshStandardMaterial(),
    );
    cube.lookAt(n);
    cube.position.copy(intersects[0].point);
    // 이 코드 없으면 더블클릭 시 생기는 큐브가 정중앙과 면에 접함 (일부 잘림)
    cube.position.addScaledVector(n, 0.1);
    cube.castShadow = true;

    scene.add(cube);
    // 이 코드 없으면 큐브 더블클릭 시 큐브 옆에 큐브가 겹쳐서 생겨버림
    // 새로 생긴 큐브도 ray 와 접하는지 비교할 대상에 추가해줌
    pickables.push(cube);
  }
});

new GLTFLoader().load("models/suzanne_scene2.glb", (gltf) => {
  const suzanne = gltf.scene.getObjectByName("Suzanne") as THREE.Mesh;
  suzanne.castShadow = true;
  (
    (suzanne.material as THREE.MeshStandardMaterial).map as THREE.Texture
  ).colorSpace = THREE.LinearSRGBColorSpace;
  pickables.push(suzanne);

  const plane = gltf.scene.getObjectByName("Plane") as THREE.Mesh;
  plane.receiveShadow = true;
  pickables.push(plane);

  const spotLight = gltf.scene.getObjectByName("Spot") as THREE.SpotLight;
  spotLight.intensity /= 500;
  spotLight.castShadow = true;
  // pickables.push(spotLight); // 에러 -> spotLight 는 메시가 아니라서

  scene.add(gltf.scene);
});

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);

  stats.update();
}

animate();
