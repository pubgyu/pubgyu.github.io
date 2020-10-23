---
title: "[Motion] SVG Path Motion - V1.0"
layout: post
---

![](/assets/images/gif/svg-path-motion.gif)
## 원리
------

svg path 값을 이용하여 자동 모션과 스크롤 기반 모션을 줄수 있음

## 사용법
------

1.script import
```javascript
import { _svgPathMotion } from 'svg-path-motion.mjs';
```
<br>
2.html 소스상에 svg 태그가 있어야 한다

<br>
3.함수 선언해주고 인자 넣기
```javascript
//첫번째 인자 node는 svg를 타겟으로 한다
const svgMotionFn = new _svgPathMotion(Svg Node, Options);
```
<br>
4.자동재생은 무조건 **autoPlay:true** 옵션을 넣어야하고<br>
스크롤 모션은 무조건 **moveNode:node** 옵션을 넣어야 한다
<br>

## 함수
------

```javascript
svgMotionFn.scroll() //스크롤시 호출
svgMotionFn.play() //자동재생시
svgMotionFn.pause() //정지시
svgMotionFn.reset() //리셋
```


## 옵션
------

**자동재생 옵션**

| 옵션명 | 내용 | 기본값 |
|---|:---:|---:|
| `autoPlay` | 자동재생 가능 유/무 | `false` |
| `speed` | 자동재생 스피드 (0~1) | `0.01` |

**스크롤 옵션**

| 옵션명 | 내용 | 기본값 | 예시 |
|---|:---:|---:|
| `moveNode` | 스크롤 이동되는 거리를 가진 부모 노드 | `null` |`$('.parent')` |

**callback**

| 옵션명 | 내용 | 인자 |
|---|:---:|---:|
| `startEvent` | 모션 시작하자마자 한번 실행 | |
| `endEvent` | 모션이 완료된 후 실행 | |


<br>
[예시 보기](/html/00_canvas/svg-path-motion.html){: target="_blank"}
