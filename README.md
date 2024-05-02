# Three.js 튜토리얼

## 목차

### Stats Panel
- 프레임(fps), ms(렌더링 소요 시간), mb(할당된 메모리) 및 커스텀 지표를 좌측 탭에 표시 가능

### Dat GUI
- 3D 오브젝트 및 카메라의 위치, 회전 등을 간편하게 조작할 수 있는 탭을 제공하는 서드파티 라이브러리
- 설치: `yarn add -D dat.gui @types/dat.gui`

## 0. Intro
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

## To do
- github pages 로 배포