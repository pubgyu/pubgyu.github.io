export function dbResize(cb, ms) {
	let debounceCheck;
	return function () {
		clearTimeout(debounceCheck);
		debounceCheck = setTimeout(() => {
			cb();
		},ms);
	}
}