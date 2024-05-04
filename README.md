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

## To do
- github pages 로 배포