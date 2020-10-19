// console logo
let logoImage = new Image();
logoImage.src = '/assets/images/logo.png';
export function logoShow() {
	logoImage.onload = function () {
		let imgStyle = [
			'padding: ' + this.height * .3 + 'px ' + this.width * .3 + 'px;',
			'background: url('+ logoImage.src +');',
			'background-size: 100%;',
			'border-radius: 100%;'
		].join(' ');
		console.log('%c ', imgStyle);
		
		let txtStyle = [
			'width: ' + this.width * .3 + 'px;',
			'font-size: 20px;',
			'font-weight: bold'
		].join(' ');
		console.log('%cPubgyu Motion Reference', txtStyle);
	};
}