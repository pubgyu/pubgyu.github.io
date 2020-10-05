var threeMotion = function (el, option) {
	const $el = $(el);
	
	const $scene = new THREE.Scene(); // 공간

	// 카메라 1번 시야각, 종횡비, 가까워지기 한계, 멀어지기 한계
	const $camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000); // 카메라
	const $renderer = new THREE.WebGLRenderer({ antialias: true }); // 렌더러
	$renderer.shadowMap.enabled = true;
	
	var renderCalls = [];

	// stats
	const stats = new Stats();

	// init
	var _init = function () {
		console.log('three.js init!!!!');
		
		////////////////////////////////////////////////////////// 렌더러 설정

		$renderer.setClearColor(new THREE.Color('#ffffff'));
		$renderer.setPixelRatio( window.devicePixelRatio );
		$renderer.setSize(window.innerWidth,window.innerHeight);
		
		$el.find('.stats-wrap')[0].appendChild(stats.domElement);
		$el[0].appendChild($renderer.domElement);
		////////////////////////////////////////////////////////// 렌더러 설정


		////////////////////////////////////////////////////////// 도움선 설정
		var $helper = new THREE.AxesHelper(50);
		$helper.position.set(0,0,0);
		////////////////////////////////////////////////////////// 도움선 설정

		var sphereTexture = new THREE.TextureLoader();
		
		////////////////////////////////////////////////////////// 바닥 설정
		var floorTexture = new THREE.TextureLoader();
		floorTexture.load(
			'./images/floor-texture.jpg',
			function (texture) {
				var _floorGeo = new THREE.PlaneBufferGeometry(100, 100, 1, 1 );
				var _floorMesh = new THREE.MeshStandardMaterial({map:texture,shininess: 150});

				_floorMesh.map.repeat.x=30;
				_floorMesh.map.repeat.y=30;
				_floorMesh.map.wrapS=THREE.RepeatWrapping;
				_floorMesh.map.wrapT=THREE.RepeatWrapping;
				var $floor = new THREE.Mesh(_floorGeo, _floorMesh);
				$floor.rotation.x = - Math.PI / 2;
				$floor.receiveShadow = true; //그림자 받을때
				$scene.add($floor);
			}
		);
		////////////////////////////////////////////////////////// 바닥 설정

		////////////////////////////////////////////////////////// 카메라 설정
		$camera.position.set(-3,5,5);
		$camera.lookAt($scene.position);
		////////////////////////////////////////////////////////// 카메라 설정

		// 씬에 오브젝트 놓기
		$scene.add($helper);

		_draw();
		_render();
		_cameraMoving();

		// test
		$scene.add( new THREE.AmbientLight( 0x505050 ) );
	};

	// 애니메이션 렌더 (움직임 관성 쓰기위해 사용 사용 안할거면 그냥 렌더링으로 처리)
	var _render = function () {
		requestAnimationFrame(_render);
		renderCalls.forEach(function(callback) {
			callback();
		});
	}

	// 그리기 함수
	var _draw = function () {
		function renderScene() { 
			$renderer.render($scene,$camera);
			stats.update();
		}
		renderCalls.push(renderScene); // 움직임 관성 쓰기 위한 event
	};

	// 카메라 무빙
	var _cameraMoving = function () {
		var _controls = new THREE.OrbitControls($camera, $renderer.domElement);

		_controls.rotateSpeed = 0.1;

		_controls.autoRotate = false; // 자동 rotate _controls.update()이거 사용해야 한다
		_controls.autoRotateSpeed = 0.008; //자동 rotate 속도
		_controls.enableZoom = false; // zoom 활성화
		_controls.enableKeys = false; // 키보드 이동 활성화
		_controls.enableDamping = true; // 움직임 관성 이거 쓰려면 _controls.update()이거 사용해야 한다
		_controls.enablePan = false; // 오른쪽 드래그로 카메라 축 바뀌는 거

		_controls.minPolarAngle = 0; // 수직으로 공전할 수 있는 거리 min
		_controls.maxPolarAngle = Math.PI /2; // 수직으로 공전할수 있는 거리 max

		_controls.dampingFactor = 0.05; //댐핑 관성

		// 움직임 관성 쓰기 위한 event
		renderCalls.push(function(){
		  _controls.update();
		});
	};

	return {
		init : _init
	}
};