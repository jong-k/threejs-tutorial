import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import RAPIER from "@dimforge/rapier3d-compat";

await RAPIER.init(); // This line is only needed if using the compat version
// 중력 가속도를 설정하여 rigid body 와 plane 간 충돌 발생시키기 위함
const gravity = new RAPIER.Vector3(0.0, -9.81, 0.0);
const world = new RAPIER.World(gravity);
const dynamicBodies: [THREE.Object3D, RAPIER.RigidBody][] = [];

const scene = new THREE.Scene();

const light1 = new THREE.SpotLight(undefined, Math.PI * 10);
light1.position.set(2.5, 5, 5);
light1.angle = Math.PI / 3;
light1.penumbra = 0.5;
light1.castShadow = true;
light1.shadow.blurSamples = 10;
light1.shadow.radius = 5;
scene.add(light1);

// 모든 정보 입력 대신 clone
const light2 = light1.clone();
light2.position.set(-2.5, 5, 5);
scene.add(light2);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.y = 1;

// Cuboid Collider
const cubeMesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshNormalMaterial(),
);
cubeMesh.castShadow = true;
scene.add(cubeMesh);

// rigid body에 위치 등을 설정
// 0,0,0 에서 y축으로 +5 위치에 생성 -> dynamic 덕분에 자연스럽게 0,0,0 으로 낙하
// fixed 였으면 움직이지 않음
// setCanSleep 아예 없으면 1번의 물리 행위 후 재 실행 불가
const cubeBody = world.createRigidBody(
  RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5, 0).setCanSleep(false),
);
// rigid body에 물리 설정 (부피, 질량 등)
const cubeShape = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
  .setMass(1) // 질량. 0이면 질량이 0이라 중력 영향 안받음
  .setRestitution(1.1); // 복원력. 0이면 바운스 안함
// threejs에서 scene에 추가하는 것과 비슷
world.createCollider(cubeShape, cubeBody);
dynamicBodies.push([cubeMesh, cubeBody]);

// Ball Collider
const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(),
  new THREE.MeshNormalMaterial(),
);
sphereMesh.castShadow = true;
scene.add(sphereMesh);
const sphereBody = world.createRigidBody(
  RAPIER.RigidBodyDesc.dynamic().setTranslation(-2, 5, 0).setCanSleep(false),
);
const sphereShape = RAPIER.ColliderDesc.ball(1).setMass(1).setRestitution(1.1);
world.createCollider(sphereShape, sphereBody);
dynamicBodies.push([sphereMesh, sphereBody]);

// Cylinder Collider
const cylinderMesh = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 2, 16),
  new THREE.MeshNormalMaterial(),
);
cylinderMesh.castShadow = true;
scene.add(cylinderMesh);
const cylinderBody = world.createRigidBody(
  RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5, 0).setCanSleep(false),
);
const cylinderShape = RAPIER.ColliderDesc.cylinder(1, 1)
  .setMass(1)
  .setRestitution(1.1);
world.createCollider(cylinderShape, cylinderBody);
dynamicBodies.push([cylinderMesh, cylinderBody]);

// ConvexHull Collider
const icosahedronMesh = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1, 0),
  new THREE.MeshNormalMaterial(),
);
icosahedronMesh.castShadow = true;
scene.add(icosahedronMesh);
const icosahedronBody = world.createRigidBody(
  RAPIER.RigidBodyDesc.dynamic().setTranslation(2, 5, 0).setCanSleep(false),
);
// 공간 복잡도를 줄이기 위해 실수를 8바이트가 아닌 4바이트에 저장하는 배열
const points = new Float32Array(
  icosahedronMesh.geometry.attributes.position.array,
);
const icosahedronShape = (
  RAPIER.ColliderDesc.convexHull(points) as RAPIER.ColliderDesc
)
  .setMass(1)
  .setRestitution(1.1);
world.createCollider(icosahedronShape, icosahedronBody);
dynamicBodies.push([icosahedronMesh, icosahedronBody]);

// Trimesh Collider
const torusKnotMesh = new THREE.Mesh(
  new THREE.TorusKnotGeometry(),
  new THREE.MeshNormalMaterial(),
);
torusKnotMesh.castShadow = true;
scene.add(torusKnotMesh);
const torusKnotBody = world.createRigidBody(
  RAPIER.RigidBodyDesc.dynamic().setTranslation(4, 5, 0),
);
// vertex 복수형
const vertices = new Float32Array(
  torusKnotMesh.geometry.attributes.position.array,
);
// index 복수형
const indices = new Uint32Array(
  (torusKnotMesh.geometry.index as THREE.BufferAttribute).array,
);
const torusKnotShape = (
  RAPIER.ColliderDesc.trimesh(vertices, indices) as RAPIER.ColliderDesc
)
  .setMass(1)
  .setRestitution(1.1);
world.createCollider(torusKnotShape, torusKnotBody);
dynamicBodies.push([torusKnotMesh, torusKnotBody]);

// 오브젝트를 바닥과 충돌시키기 위해 만든 floor
const floorMesh = new THREE.Mesh(
  new THREE.BoxGeometry(100, 1, 100),
  new THREE.MeshPhongMaterial(),
);
floorMesh.receiveShadow = true;
floorMesh.position.y = -1;
scene.add(floorMesh);
const floorBody = world.createRigidBody(
  RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1, 0),
);
const floorShape = RAPIER.ColliderDesc.cuboid(50, 0.5, 50);
world.createCollider(floorShape, floorBody);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// 클릭하면 그곳으로 raycaster 조사
renderer.domElement.addEventListener("click", (e) => {
  mouse.set(
    (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -(e.clientY / renderer.domElement.clientHeight) * 2 + 1,
  );

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(
    [cubeMesh, sphereMesh, cylinderMesh, icosahedronMesh, torusKnotMesh],
    false,
  );

  // raycaster 와 겹치면(클릭되면) 충격(y +10) 부여
  if (intersects.length) {
    dynamicBodies.forEach((b) => {
      b[0] === intersects[0].object &&
        b[1].applyImpulse(new RAPIER.Vector3(0, 10, 0), true);
    });
  }
});

const stats = new Stats();
document.body.appendChild(stats.dom);

const gui = new GUI();

const physicsFolder = gui.addFolder("Physics");
physicsFolder.add(world.gravity, "x", -10.0, 10.0, 0.1);
physicsFolder.add(world.gravity, "y", -10.0, 10.0, 0.1);
physicsFolder.add(world.gravity, "z", -10.0, 10.0, 0.1);

const clock = new THREE.Clock();
let delta;

function animate() {
  requestAnimationFrame(animate);

  delta = clock.getDelta();
  // 모니터 프레임에 상관없이 일정하게 프레임을 유지
  world.timestep = Math.min(delta, 0.1);
  world.step();

  for (let i = 0, n = dynamicBodies.length; i < n; i++) {
    // dynamicBodies: [THREE.Object3D, RAPIER.RigidBody][]
    // rigid body -> three obejct 업데이트
    dynamicBodies[i][0].position.copy(dynamicBodies[i][1].translation());
    dynamicBodies[i][0].quaternion.copy(dynamicBodies[i][1].rotation());
  }

  controls.update();

  renderer.render(scene, camera);

  stats.update();
}

animate();
