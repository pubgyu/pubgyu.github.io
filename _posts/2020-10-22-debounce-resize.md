---
title: "[JS] Debounce Resize - V1.0"
layout: post
---

![](/assets/images/gif/debounce-resize.gif)
## 원리
------

기존 resize event 만으로 동작하지 않고<br>
**<u>settimeout</u>** 속성을 사용하여 마지막으로 함수가 호출된 시점에서 특정 시간이 지난 후 하나의 이벤트만 발생하도록 하는 기술

## 퍼포먼스
------

기존 resize는 호출될때마다 계속 호출이 되며
debounce 방식은 마지막 함수 호출 기준으로 한번의 호출만 허용

시각적으로는 기존 resize는 바뀌는 과정이 계속 보이지만
debounce 방식은 바뀌는 과정에선 resize가 안먹히는 것처럼 보일수 있음

## 사용법
------

1.debounce resize 함수 import
```javascript
import { dbResize } from 'debounce-resize.mjs';
```
<br>
2.resize event안에 넣어주고 callback 함수와 milliseconds 값 넣기
```javascript
//첫번째 인자 callback, 두번째 인자 milliseconds 값
window.addEventListener('resize', dbResize(callback, ms));
$(window).on('resize', dbResize(callback, ms));
```
