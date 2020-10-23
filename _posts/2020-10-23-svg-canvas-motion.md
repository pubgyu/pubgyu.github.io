---
title: "[Motion] SVG Canvas Motion - V1.0"
layout: post
---

## 원리
------

svg 과 일반 이미지로 cabvas - globalCompositeOperation 속성을 이용하여 mask animation을 보여줌

## 사용법
------

1.script import
```javascript
import { _svgCanvasMotion } from 'svg-canvas-motion.mjs';
```
<br>
2.html 소스상에 canvas 태그가 있어야 한다

<br>
3.함수 선언해주고 인자 넣기
```javascript
//첫번째 인자 node는 canvas를 타겟으로 한다
const canvasMotionFn = new _svgCanvasMotion(Canvas Node, Options);
```
<br>
4.자동재생은 무조건 **autoPlay:true** 옵션을 넣어야하고<br>
스크롤 모션은 무조건 **moveNode:node** 옵션을 넣어야 한다
<br>

## 함수
------

```javascript
canvasMotionFn.init() //함수 init
canvasMotionFn.scroll() //스크롤시 호출
canvasMotionFn.play() //자동재생시
canvasMotionFn.pause() //정지시
canvasMotionFn.resize() //리사이즈 할시
canvasMotionFn.destroy() //함수 파괴
```

## 옵션
------

**기본 옵션**

| 옵션명 | 내용 | 기본값 |
|---|:---:|---:|
| `svgSrc` | SVG 이미지 경로| `''` |
| `bgImgSrc` | 배경 이미지 경로| `''` |
| `minScale` | 최소 스케일 사이즈| `1` |
| `maxScale` | 최대 스케일 사이즈| `1` |
| `moveX` | 스크롤이나 플레이시 이동하려고 하는 X 좌표| `0` |
| `moveY` | 스크롤이나 플레이시 이동하려고 하는 Y 좌표| `0` |
| `bgFadeIn` | 배경 fade in 유/무| `false` |
| `bgFadeOut` | 배경 fade out 유/무| `false` |
| `reverse` | 반대로 모션할지 유/무| `false` |
| `speed` |스피드 값| `0.01` |
| `bgColor` |배경 색| `#000000` |

**자동재생 옵션**

| 옵션명 | 내용 | 기본값 |
|---|:---:|---:|
| `autoPlay` | 자동재생 가능 유/무 | `false` |

**스크롤 옵션**

| 옵션명 | 내용 | 기본값 | 예시 |
|---|:---:|---:|
| `moveNode` | 스크롤 이동되는 거리를 가진 부모 노드 | `null` |`$('.parent')` |

**callback**

| 옵션명 | 내용 | 인자 |
|---|:---:|---:|
| `startEvent` | 오토플레이 - 모션 시작하자마자 한번 실행 | |
| `endEvent` | 오토플레이 / 스크롤 - 모션이 완료된 후 실행 | |
| `scrollEvent` | 스크롤 - 스크롤 진행 시 실행 | |

<br>
[예시 보기](/html/00_canvas/svg-canvas-motion.html){: target="_blank"}
