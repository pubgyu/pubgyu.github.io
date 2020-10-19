---
title: "[JS] RAF Scroll - V1.0"
layout: post
---

## 원리
------


기존 scroll event 만으로 동작하지 않고<br>
**<u>requestAnimationFrame</u>** 속성을 사용하여 scroll event를 동작
## 퍼포먼스
------

기존 scroll은 **task que**에 stack이 쌓이는 쌓임<br>
RAF 은 **animation frame que**에 stack이 쌓임<br>
브라우져의 초당 렌더링 횟수(60fps) 을 맞추기 위해 스스로 조절함

## 사용법
------

1.raf scroll 함수 import
```javascript
import { rafScroll } from 'raf-scroll.mjs';
```
<br>
2.scroll event안에 넣어주고 callback 함수와 ease 값 넣기
```javascript
//첫번째 인자 callback, 두번째 인자 ease 값
window.addEventListener('scroll', rafScroll(callback, ease));
$(window).on('scroll', rafScroll(callback, ease));
```
<br>
3.ease 사용법
```javascript
//ease 값은 0~1 소수점으로 넣음
//easing을 뺄땐 0 또는 생략가능
$(window).on('scroll', rafScroll(callback, 0~1));
```
<br>
4.ease scroll top
```javascript
function callback (st) {
//첫번째 인자 값이 scrollTop 값
}
```
## V1.0 이슈
- ease의 모션이 하나밖에 없음



<br>
[예시 보기](/html/00_canvas/raf-scroll.html)
