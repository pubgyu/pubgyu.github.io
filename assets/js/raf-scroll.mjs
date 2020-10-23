// raf scroll
export function rafScroll(cb, _ease) {
	_ease = (!_ease) ? 0 : _ease;
	let esScroller = {
		ease : (1-_ease),
		endY : 0,
		y : 0,
		scrolled : true
	}
	let rafTimeout = null;
	window.cancelAnimationFrame(esUpdate);

	function esUpdate(){
		let scrollY = $(window).scrollTop();
		esScroller.endY = scrollY;
		esScroller.y += (scrollY - esScroller.y) * esScroller.ease;

		if(Math.abs(scrollY - esScroller.y) < esScroller.ease) {
			esScroller.y = scrollY;
			esScroller.scrolled = false;
		}
		rafTimeout = (esScroller.scrolled) ? requestAnimationFrame(esUpdate) : null;

		cb(esScroller.y);
	}

	return function () {
		esScroller.scrolled = true;
		if(!rafTimeout) rafTimeout = requestAnimationFrame(esUpdate);
	}
}