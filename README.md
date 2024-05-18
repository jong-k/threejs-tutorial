# Three.js 튜토리얼

## 목차

### Stats Panel
- 프레임(fps), ms(렌더링 소요 시간), mb(할당된 메모리) 및 커스텀 지표를 좌측 탭에 표시 가능

### Dat GUI
- 3D 오브젝트 및 카메라의 위치, 회전 등을 간편하게 조작할 수 있는 탭을 제공하는 서드파티 라이브러리
- 설치: `yarn add -D dat.gui @types/dat.gui`

## 0. Intro
> intro-01.ts

Three.js 에서 화면에 무언가를 띄우려면 최소 3가지가 필요하다
- Scene
- Camera
- Renderer

## 1. Scene
3D 좌표로 Three.js 가 렌더링할 대상을 설정할 수 있다

구성요소
### background: 배경 색 (null 이면 black)
- 이미지를 배경으로 설정할 수도 있음
- 큐브 모양으로 이미지를 설정하여 3차원으로 보이게 할 수도 있음
- backgroundBlurriness: 배경을 흐리게 설정 가능

여러개의 독립된 씬을 만드는 것도 가능

GUI 에서 씬을 변경할 수 있음
- active scene 변경 함수들의 객체를 만들고 그 객체와 property name, gut button name 을 gui에 전달
- gui control 객체 구성요소 타입 별 UI
  - 함수: 버튼
  - int/float: 슬라이더
  - boolean: 체크박스
  - 문자열: text input

## 2. Camera
메서드
- lookAt(x, y, z): 오브젝트가 x, y, z 를 바라보게 회전 

### Perspective Camera (원근)
> perspectiveCamera-02.ts

- 사람의 눈이 보는 방식을 모방
- 3D 렌더링 시 매우 일반적인 투영 방법

생성자 함수 인수
- fov: field of view (vertical)
  - view point 에서 오브젝트까지의 거리 (z의 크기)
- aspect: 가로 / 세로 비율
- near: 카메라가 보기 시작하는 지점
- far: 카메라가 최대로 볼 수 있는 지점

### Orthographic Camera (직교)
> orthographicCamera-03.ts

- 카메라로부터의 거리에 관계 없이 원근이 일정하게 유지되는(정육면체 처럼) 투영 방법
- 원근법이 없는 2D 화면에서 주로 사용

생성자 함수 인수
- perspective 와 다르게 fov, aspect 없고 left, right, top, bottom 추가됨

## 3. Renderer
Three.js는 기본적으로 WebGLRenderer 를 사용
- WebGL 사용
  - GPU 가속을 통한 이미지와 이펙트 처리
- WebGLRenderer는 HTML Canvas 엘리먼트에 씬과 카메라를 페인트

생성자 함수 인수
- canvas: 렌더러를 위치시킬 canvas 엘리먼트를 직접 지정할 수 있다
- antialias: true값을 주면 안티 앨리어싱을 활성화해 픽셀을 부드럽게 움직일 수 있다

## 4. Animation Loop
리렌더링을 트리거하는 재귀 함수
- 모니터의 Hz에 따라 함수 호출 빈도가 달라짐
  - 예) 60Hz -> 60FPS (1초에 60번 리렌더링)
  - FPS : frame per second
  - delta time: 바로 직전 프레임을 수행하는데 걸린 시간
    - 60FPS 의 경우 1/60 초

성능 향상을 위해, 인터랙션(resize, orbit control 변화)이 있을 때만 리렌더링을 할 수 있다
animate 함수 호출 대신, render 함수를 이벤트 핸들러에서 호출

## 5. Object3D
다양한 오브젝트들의 기본 클래스
- 3D 공간에서 오브젝트들을 조작하는 메서드와 프로퍼티들을 제공
- Camera, Renderer도 Object3D의 자식 클래스에 해당

조작 가능한 프로퍼티 (Object3D Transform)
- Rotation
- Position
- Scale
- Visibility

### Object3D Hierarchy
Scene 하위의 Object3D
- Scene에 다른 Object3D 인스턴스들을 추가할 수 있는데 (add 메서드 사용)
- 이 Scene 또한 Object3D 클래스를 상속받고 있음
- 그리고 이 Scene 을 rotate 하거나 scale 하면, Scene에 포함된 모든 Object3D 인스턴스에도 효과가 똑같이 적용된다

Object3D 하위의 Object3D
- 이미 Scene에 추가된 Object3D 인스턴스에 또 Object3D 인스턴스를 추가할 수 있다 (갯수 제한 없음)
- Object3D 는 오직 하나의 부모만 가질 수 있다
- 그리고 특정 Object3D 의 부모를 동적으로 변경할 수도 있다 (add 메서드)
  - Object 3D 부모를 변경하면, 새로운 부모 Object3D 를 기준으로 position, scale, rotation 등이 업데이트된다

## 6. Geometries (기하학)
다양한 종류의 Geometries 존재
- BoxGeometry (직육면체)
- CircleGeometry (원)
- SphereGeometry (구)

동적으로 Mesh의 Geometry 변경 가능 (GUI 등을 통해서)
- 이 때, animate 를 통해 리렌더링해도 geometry 는 갱신되지 않기 때문에, mesh의 geometry 에 변경내용을 새로 할당해줘야 함
- transform 변경사항만 animate 때 적용됨

## 7. Materials
동적으로 Mesh의 Material 변경 가능 (GUI)
- 이 때, material에 onChange 이벤트 핸들러 부착 필요 
  - change 후 material 의 needUpdate 프로퍼티를 true로 해줘야 업데이트됨

side
- front side: 앞에서만 보임 (디폴트)
- back side: 앞에서 오브젝트의 내용물이 투시되서 다 보임 (뒷면까지 보임)
- double side: 앞 뒤에서 front side 처럼 보임

### Common Materials
자주 쓰는 4가지 머티리얼 알아보기

1)MeshBasicMaterial
- solid color
  - 따라서 가끔 씬에서 안보이는 듯한 느낌을 받을 수 있음 (바닥이나 벽과 색이 동일할 경우)
- 유일하게 flat shading 불가
- 렌더링 비용 하

2)MeshNormalMaterial
- shading: 카메라와 조명의 위치에 따라 polygon이 차지하는 각 픽셀의 색이 달라짐
  - 예) 좌상단은 항상 블루 우하단은 항상 퍼플
- MeshBasicMaterial이 씬에서 사라지는 듯한 문제를 해결해줌
- 렌더링 비용 중

3)MeshPhongMaterial
- 보다 효과적인 렌더링을 위해 조명이 필요
- 렌더링 비용 중상

4)MeshStandardMaterial
- Physically Based Rendering: MeshPhongMaterial 방식보다 더 정교한 방식
- 보다 효과적인 렌더링을 위해 조명이 필요
  - 추가적으로 scene 에 environment 를 더 활용할 수 있음
  - 즉, Phong은 조명이 없으면 안되지만, Standard는 조명 없어도 environment 있으면 렌더링 가능
- 렌더링 비용 상

## 8. lil-gui
다소 오래된 dat-gui 를 대체하는 추세 (게다가 TS로 만들어짐)
- Three.js 에 내장되어 별도 설치 불필요

## 9. Lights
주요 Light
- AmbientLight: 모든 방향에서 전체 scene을 비춤
- DirectionalLight: 한 방향에서 전체 scene을 비춤
- PointLight: 3D 위치(x,y,z)에서 모든 방향으로 조명을 비춤. distance와 decay 관리 가능
  - distance: 0 는 Infinity 와 같음
- SpotLight: 3D 위치에서 한 방향으로 조명을 비춤. distance, decay, angle, penumbra, target 관리 가능
  - 예) 태양(광원)이 지구(피사체) 비춘다고 할 때 (광원의 크기가 피사체보다 클 때)
  - umbra: 피사체 바로 뒤의 짙은 그림자
  - penumbra: umbra 양 옆으로 생기는 umbra 보다 옅은 그림자 (광원이 피사체보다 커서 생김)

## 10. Shadows
- Light 설정이 `castShadows=true` 일 경우 그림자가 생긴다
- PointLight 와 SpotLight 의 경우 (광원이 3D 위치) PerspectiveCamera frustum 을 사용하여 그림자를 계산
- DirectionalLight 의 경우 OrthographicCamera frustum 을 사용하여 그림자를 계산

### 그림자를 사용하려면1
renderer 의 shadowMap 프로퍼티를 enable 시켜야 함
- `renderer.shadowMap.enabled = true`
- 추가로 shadow map 타입도 설정 가능
 
대표적인 shadow map
- BasicShadowMap: 필터링되지 않은 shadow map. 가장 빠르지만 저품질
- PCFShadowMap (디폴트): PCF(Percentage-Closer Filtering) 알고리즘을 사용하여 shadow 필터링
- PCFSoftShadowMap: PCSS(Percentage-Closer Soft Shadows) 알고리즘을 사용
- VSMShadowMap: VSM(Variant Shadow Map) 알고리즘을 사용. 모든 shadow receiver 들이 shadow 를 casting 하게 됨

### 그림자를 사용하려면2
light 의 castShadow 프로퍼티를 true로 설정
- `directionalLight.castShadow = true`

추가로 그림자를 표시할 mesh 에도 castShadow, receiveShadow 프로퍼티를 true로 설정해야 함
- `box.castShadow = true`
- `ground.receiveShadow = true`

## 11. Environment Maps
PBR(물리 기반 렌더링) materials 의 경우 씬에 light 대신 Environment Map을 설정할 수 있다
- MeshStandardMaterial
- MeshPhysicalMaterial

environment map 을 설정하면 cast, receive shadow 사용 불가 

map 이미지
- map 에 사용될 이미지 형식은 HDR(High Dynamic Range)이 권장됨
- HDR은 PNG 나 JPEG 보다 더 정교하고 파일 용량이 큼

### 성능 비교
environment map
- 초기 렌더링이 느림 (일반적으로 다운로드된 이미지에서 생성되므로)
- 매 프레임마다 추가적인 연산 불필요하여 light 보다 더 빠르게 렌더링됨

light
- 초기 렌더링이 빠르고 쉽게 씬에 추가 가능
- light 갯수가 많아질 수록 매 프레임마다 필요한 연산이 증가

## 12. Loading Assets
Three.js 깃허브의 example object 사용하기
- 오브젝트 파일 URL(github~ 로 시작하는)을 그대로 프로젝트에서 사용하여 가져오면 CORS 에러 발생
  - 깃허브에서 스크립트에서 파일을 다운받지 못하게 차단했기 때문에
  - CDN을 사용하면 된다
- jsdelivr 사용하여 Github 주소 입력하여 CDN 링크 받기

ES6 Import 방식으로 static asset 불러오기 (복잡)
- 확장자가 다른 파일의 경우, TS에게 이것이 모듈임을 알려줘야 함
  - type 선언 필요 (root에 index.d.ts 처럼 만들기)
- 예시
```ts
declare module "*.png"
declare module "*.hdr"
declare module "*.glb"
```
- 파일들을 src 아래로 위치 시킴 (함께 번들링)
- 이후 vite 설정파일에서 확장자들을 등록해줘야 함
- 예시
```js
import { defineConfig } from 'vite'

export default defineConfig({
  // png 는 따로 추가 안해도 됨
  assetsInclude: ['**/*.hdr', '**/*.glb'],
})
```

## 13. Loading Assets
Three.js 의 모든 Loader 들은 THREE.Loader 클래스에 기반함 (예 GLTFLoader)
- THREE.Loader 는 THREE.LoadingManager 객체를 가지며 아래 정보들을 갖고 있음
  - 리소스 로딩 시작 시점
  - 로딩 완료 시점: onLoad 콜백
  - 다운로드 진행 상황: onProgress
  - 리소스 다운로드 시도 중 오류가 발생했는지 여부: onError

clone 메서드를 사용하여 이미 로딩한 오브젝트를 복사해서 사용할 수 있다
- 이 경우, 여러번 비동기적으로 로딩할 필요가 없어서 더 효율적이다

loadAsync 메서드를 사용하여 로더의 순서를 보장할 수 있다
- 로딩 보장이 선결되어야 하는 경우 유용하다

## 14. glTF Loader
> Three.js scene에 glTF 모델을 추가하기 위한 로더

glTF
- 3D 씬과 모델의 효율적인 전송 및 로딩을 위한 스펙
- 3D 에셋의 크기와 해당 에셋의 압축을 풀고 사용하는 데 필요한 런타임 처리를 최소화
- glTF 파일에는 다음의 요소들이 하나 이상 포함되어 있음 
  - scenes
  - meshes
  - materials
  - textures
  - skins
  - skeletons
  - morph targets
  - animations
  - lights
  - cameras
- 확장자는 2가지가 있음
  - .gltf: JSON
  - .glb: Binary


## To do
- github pages 로 배포