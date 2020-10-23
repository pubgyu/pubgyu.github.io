const _svgCanvasMotion = function(el, option) {
	let canvas;
	let ctx;
	let drawSvg = new Image();
	let endEventTrue = true;

	let svgOrientation;
	let svgHorizonRatio;
	let svgVerticalRatio;
	let svgW;
	let svgH;
	let minSvgW;
	let minSvgH;

	let autoPercent = 0;
	let autoRAF;
	let maxAutoPercent = 0;

	const defaults = {
		svgSrc : '',
		bgImgSrc : '',
		moveNode : '',
		autoPlay : false,
		minScale : 1,
		maxScale : 1,
		moveX : 0,
		moveY : 0,
		bgFadeIn : false,
		bgFadeOut : false,
		reverse : false,
		speed : 0.01,
		bgColor : '#000'
	}
	const options = $.extend(defaults, option);

	let 
	onScrollEvent = option.scrollEvent,
	onStartEvent = option.startEvent,
	onEndEvent = option.endEvent;

	const _init = () => {
		canvas = el[0];
		ctx = canvas.getContext('2d');
		_destroy();

		drawSvg.src = options.svgSrc;

		el.parent().append('<div class="svg-bg" />');
		el.parent().find('.svg-bg').css({
			'position' : 'absolute',
			'top' : 0,
			'left' : 0,
			'width' : '100%',
			'height' : '100%',
			'background-image' : 'url('+options.bgImgSrc+')',
			'background-size':'cover',
			'background-position' : 'center center'
		});

		drawSvg.onload = () => {
			_resize();
			_draw(0);
		}
	}
	const _draw = (_percent) => {
		canvas.width = window.innerWidth;
		let scalePercent = (options.reverse) ? (1-_percent) : _percent;
		let svgCenterL = (canvas.width/2) - (((svgW*scalePercent)+minSvgW)/2) + (options.moveX*scalePercent);
		let svgCenterT = (canvas.height/2) - (((svgH*scalePercent)+minSvgH)/2) + (options.moveY*scalePercent);

		ctx.beginPath();
		ctx.drawImage(drawSvg,svgCenterL,svgCenterT,(svgW*scalePercent)+minSvgW,(svgH*scalePercent)+minSvgH);
		ctx.closePath();

		ctx.globalCompositeOperation = 'source-out';

		ctx.beginPath();
		ctx.fillStyle = options.bgColor;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.closePath();

		if(options.bgFadeIn) el.parent().find('.svg-bg').css('opacity', _percent);
		if(options.bgFadeOut) el.parent().find('.svg-bg').css('opacity', 1-_percent);


		if(!options.autoPlay) onScrollEvent && onScrollEvent.call();
		
		if (_percent == 1 && endEventTrue) {
			endEventTrue = false;
			onEndEvent && onEndEvent.call();
		}else if (_percent != 1 && !endEventTrue){
			endEventTrue = true;
		}
	}
	const _scroll = (_easing) => {
		let st = (typeof(_easing) == 'number') ? _easing : $(window).scrollTop();

		let _scrollTop = st - options.moveNode.offset().top;
		let _moveArea = options.moveNode.height() - $(window).height();
		
		let _percent = Math.min(1, _scrollTop / _moveArea );
		_percent = Math.min(1, Math.max(0, _percent));

		_draw(_percent);
	}
	const _play = () => {
		if (autoPercent == 0) onStartEvent && onStartEvent.call();

		if (autoPercent <= 1) {
			autoPercent += options.speed;
			maxAutoPercent = Math.min(1, autoPercent);
			_draw(maxAutoPercent);
			autoRAF = window.requestAnimationFrame(_play);
		}else {
			autoPercent = 0;
			window.cancelAnimationFrame(autoRAF);
		}
	}
	const _pause = () => {
		window.cancelAnimationFrame(autoRAF);
	}
	const _resize = () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		svgOrientation = drawSvg.width>=drawSvg.height;
		svgHorizonRatio = (drawSvg.height/drawSvg.width);
		svgVerticalRatio = (drawSvg.width/drawSvg.height);
		svgW = (canvas.width*options.maxScale);
		svgH = svgW*svgHorizonRatio;

		if(svgOrientation) {
			minSvgW = Math.min(drawSvg.width*options.minScale, drawSvg.width*(canvas.width/drawSvg.width));
			minSvgH = minSvgW*svgHorizonRatio;
		}else {
			minSvgH = Math.min(drawSvg.height*options.minScale, drawSvg.height*(canvas.height/drawSvg.height));
			minSvgW = minSvgH*svgVerticalRatio;
		}

		if(!options.autoPlay) {
			_scroll();
		}else {
			_draw(maxAutoPercent);
		}
	}
	const _destroy = () => {
		canvas.width = '';
		canvas.height = '';
		autoPercent = 0;
		maxAutoPercent = 0;
		window.cancelAnimationFrame(autoRAF);
		el.parent().find('.svg-bg').remove();
	}
	_init();
	
	return {
		init : _init,
		scroll : _scroll,
		play : _play,
		pause : _pause,
		resize : _resize,
		destroy : _destroy
	}
}
export {_svgCanvasMotion}