const _svgPathMotion = function(el, option) {
	let svg = el;
	let pathLength = svg.find('path').length;
	let pathTotalLength = [];
	
	let autoIdx = 0;
	let autoPercent = 0;
	let autoRAF;

	const defaults = {
		autoPlay : false,
		speed : 0.01,
		moveNode : null
	}
	const options = $.extend(defaults, option);

	let 
	onStartEvent = option.startEvent,
	onEndEvent = option.endEvent;

	const _init = () => {
		svg.find('path').each(function (i) {
			pathTotalLength.push($(this)[0].getTotalLength());

			$(this).css({
				'stroke-dasharray' : pathTotalLength[i],
				'stroke-dashoffset' : pathTotalLength[i]
			});
		});
	}
	const _draw = (_this, _percent) => {
		_this.css({ 'stroke-dashoffset' : pathTotalLength[_this.index()]*(1-_percent) });
	}
	const _scroll = (_easing) => {
		svg.find('path').each(function (i) {
			let st = (typeof(_easing) == 'number') ? _easing : $(window).scrollTop();
			
			let _scrollTop = st - options.moveNode.offset().top;
			let _moveArea = options.moveNode.height() - $(window).height();
			let areaDivision = (_moveArea/pathLength);
			
			let _percent = Math.min(1, (_scrollTop-(i*areaDivision)) / areaDivision );
			_percent = Math.min(1, Math.max(0, _percent));

			_draw($(this), _percent);
		});
	}
	const _play = () => {
		if (autoIdx == 0 && autoPercent == 0) onStartEvent && onStartEvent.call();
		
		if (autoIdx <= pathLength-1) {
			if (autoPercent <= 1) {
				autoPercent += options.speed;
			}else {
				autoPercent = 0;
				autoIdx += 1;
			}
			
			let _percent = Math.min(1, autoPercent);
			_draw(svg.find('path').eq(autoIdx), _percent);
			autoRAF = window.requestAnimationFrame(_play);
		}else {
			window.cancelAnimationFrame(autoRAF);
			onEndEvent && onEndEvent.call();
		}
	}
	const _pause = () => {
		window.cancelAnimationFrame(autoRAF);
	}
	const _reset = () => {
		autoIdx = 0;
		autoPercent = 0;
		_init();
		_pause();
	}
	_init();

	return {
		scroll : _scroll,
		play : _play,
		pause : _pause,
		reset : _reset
	}
}
export {_svgPathMotion}