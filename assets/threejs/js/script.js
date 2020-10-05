Physijs.scripts.worker = '/assets/threejs/js/three/engine/physijs_worker.js';
Physijs.scripts.ammo = '/assets/threejs/js/three/engine/ammo.js';

var threeMotion = function (el, option) {
	const $el = $(el);
	// const $scene = new THREE.Scene(); // 공간
	const $scene = new Physijs.Scene;
	$scene.setGravity(new THREE.Vector3( 0, -100, 0 )); //중력

	const $camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,500); // 카메라 1번 시야각, 종횡비, 가까워지기 한계, 멀어지기 한계
	const $renderer = new THREE.WebGLRenderer({ antialias: true }); // 렌더러
	const clock = new THREE.Clock();
	const renderCalls = [];
	const _keyboard = new THREEx.KeyboardState();
	const stats = new Stats(); // stats

	const $asciiEffect = new THREE.AsciiEffect( $renderer ); // 아스키 이펙트
	const $composerEffect = new THREE.EffectComposer( $renderer ); // Composer 이펙트
	const renderPass = new THREE.RenderPass($scene,$camera);
	
	let _controls;
	let $object;
	let $floor;
	let renderDom;
	let renderEffect;
	let _gltfFrame = 0;
	let speed = 1;
	let treeArray = [];
	let rockArray = [];
	let hurdleArray = [];
	
	// 자동차 모델링 변수
	let carFrame;
	let wheelFL;
	let wheelFR;
	let wheelBL;
	let wheelBR;
	let wheelFLC;
	let wheelFRC;
	let wheelBLC;
	let wheelBRC;

	$renderer.shadowMap.enabled = true; // 그림자 허용
	$composerEffect.addPass(renderPass);

	const defaults = {
		src : '',
		scale : 1,
		objX : 0,
		objY : 0,
		objZ : 0,
		cameraX : 0,
		cameraY : 0,
		cameraZ : 0,
		guideline : false,
		bgColor : '#000000',
		effect : 'default',
		treeNum : 0
	}
	const options = $.extend(defaults, option);

	// pixel effect
	if(options.effect == 'pixel') {
		var copyPass = new THREE.ShaderPass(THREE.CopyShader);
		$composerEffect.addPass(copyPass);
	}

	if(options.effect == 'bloom') {
		var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2( window.innerWidth, window.innerHeight ), 1, 1, 0.3);

		$composerEffect.addPass(bloomPass);
	}

	// 1번 나무
	// 2번 돌
	const mapArray = [
		[0,1,2,1,2,2,2,2,0,0],
		[0,0,0,1,0,0,0,0,0,0],
		[0,0,0,1,0,0,0,0,0,0],
		[0,0,0,1,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0]
	];
	const _mapW = mapArray[0].length;
	const _mapH = mapArray.length;
	const _mapBlockW = 20;

	// init
	const _init = () => {
		console.log('three.js init!!!!');
		
		////////////////////////////////////////////////////////// 렌더러 설정
		// 일반
		if(options.effect == 'default') {
			renderEffect = $renderer;
			renderDom = $renderer;
		}
		// 아스키
		if(options.effect == 'ascii') {
			renderEffect = $asciiEffect;
			renderDom = $asciiEffect;
		}
		// pixel
		if(options.effect == 'pixel') {
			renderEffect = $composerEffect;
			renderDom = $renderer;
		}

		if(options.effect == 'bloom') {
			renderEffect = $renderer;
			renderDom = $renderer;
		}

		$renderer.setClearColor(new THREE.Color(options.bgColor));
		$renderer.setPixelRatio( window.devicePixelRatio );
		renderEffect.setSize(window.innerWidth,window.innerHeight);
		
		$el.find('.stats-wrap')[0].appendChild(stats.domElement);
		$el[0].appendChild(renderDom.domElement);
		////////////////////////////////////////////////////////// 렌더러 설정


		////////////////////////////////////////////////////////// 도움선 설정
		var $helper = new THREE.AxesHelper(50);
		$helper.position.set(0,0,0);
		////////////////////////////////////////////////////////// 도움선 설정
		
		////////////////////////////////////////////////////////// 바닥 설정
		const groundSetting = () => {
			var $glTFModel = new THREE.GLTFLoader();

			let NoiseGen = new SimplexNoise;

			groundMaterial = Physijs.createMaterial(new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('/assets/threejs/images/floor-texture.jpg')}));
			groundMaterial.map.wrapS = groundMaterial.map.wrapT = THREE.RepeatWrapping;
			groundMaterial.map.repeat.set(_mapBlockW,_mapBlockW);
			
			groundGeo = new THREE.PlaneGeometry(200, 200, 10, 10);
			
			for ( var i = 0; i < groundGeo.vertices.length; i++ ) {
				var vertex = groundGeo.vertices[i];
				vertex.z = NoiseGen.noise( vertex.x/5, vertex.y/5 ) * 2;
			}
			groundGeo.computeFaceNormals();
			groundGeo.computeVertexNormals();
			
			//gltf
			// groundModel = new Physijs.BoxMesh(
			groundModel = new Physijs.HeightfieldMesh(
				groundGeo,
				// groundMaterial,
				100,
				0 // mass
			);

			groundModel.rotation.x = -Math.PI/2;
			groundModel.receiveShadow = true;

			var test1 = new Physijs.BoxMesh(
				new THREE.CubeGeometry(70,70,3),
				// new THREE.MeshStandardMaterial({color: 0x42a517}),
				100,
				0
			);
			test1.position.set(8,-20,0);
			groundModel.add(test1);

			$glTFModel.load('/assets/threejs/images/ground/scene.gltf', function(data){
				var aaaa = data.scene;
				aaaa.position.set(0,0,7.8);
				aaaa.rotation.x = Math.PI /2;
				aaaa.scale.set(0.01,0.01,0.01);
				groundModel.add(aaaa);
			});
			$scene.add(groundModel);
		}
		groundSetting();
		////////////////////////////////////////////////////////// 바닥 설정

		////////////////////////////////////////////////////////// 하늘 설정
		const skySetting = () => {
			var _skyGeo = new THREE.SphereGeometry(100,100,100,1);
			var _skyMesh = new THREE.MeshStandardMaterial({
				map: new THREE.TextureLoader().load('/assets/threejs/images/sky-texture.jpg'),
				side: THREE.BackSide
			});
			var $sky = new THREE.Mesh(_skyGeo, _skyMesh);
			$sky.position.y = 0;

			$scene.add($sky);
		}
		skySetting();
		////////////////////////////////////////////////////////// 하늘 설정

		////////////////////////////////////////////////////////// glTF-오브젝트 설정
		const modeling = () => {
			var carGeo = new THREE.CubeGeometry(15,5,5);
			var carMesh = new THREE.MeshStandardMaterial({color: 0x2863ff, shininess: 150});
			var carMaterial = Physijs.createMaterial(carMesh, 0.9, 0.9);
			
			// 차뼈대		
			carFrame = new Physijs.BoxMesh(carGeo,100);
			carFrame.position.set(options.objX, 20, options.objZ);
			carFrame.scale.set(options.scale, options.scale, options.scale);

			// 차디자인
			var $glTFModel = new THREE.GLTFLoader();
			$glTFModel.crossOrigin = true;
			$glTFModel.load(options.src, function(data){
				var carBody = data.scene;
				carBody.position.set(0, 0, 0);
				carBody.rotation.y = Math.PI/2;
				carBody.scale.set(0.05,0.05,0.05);
				carFrame.add(carBody);
			});

			// 차조명
			var carLight1 = new THREE.SpotLight(0xffffff);
			var carLight1Guideline = new THREE.SpotLightHelper(carLight1);
			carLight1.position.set(0,5,0);
			carLight1.rotation.z = -Math.PI/2;
			carLight1.angle = 1;

			// carFrame.add(carLight1);
			// carFrame.add(carLight1Guideline);

			$scene.add(carFrame);

			// 바퀴
			var wheelGeo = new THREE.CylinderGeometry(2.5,2.5,2,100);
			var wheelMesh = new THREE.MeshStandardMaterial({color: 0x151515});

			wheelFL = new Physijs.CylinderMesh(wheelGeo,wheelMesh,1000);
			wheelFR = new Physijs.CylinderMesh(wheelGeo,wheelMesh,1000);
			wheelBL = new Physijs.CylinderMesh(wheelGeo,wheelMesh,1000);
			wheelBR = new Physijs.CylinderMesh(wheelGeo,wheelMesh,1000);
			
			let wheelSetting = (wheel,x,y,z) => {
				wheel.rotation.x = Math.PI/2;
				wheel.position.set(x,y,z)
				$scene.add(wheel);
			}
			wheelSetting(wheelFL,-7.5,19.5,5.2);
			wheelSetting(wheelFR,-7.5,19.5,-4);
			wheelSetting(wheelBL,8.2,19.5,5.2);
			wheelSetting(wheelBR,8.2,19.5,-4);

			wheelFLC = new Physijs.DOFConstraint(wheelFL,carFrame,new THREE.Vector3(-7.5,19.5,5.2));
			wheelFRC = new Physijs.DOFConstraint(wheelFR,carFrame,new THREE.Vector3(-7.5,19.5,-4));
			wheelBLC = new Physijs.DOFConstraint(wheelBL,carFrame,new THREE.Vector3(8.2,19.5,5.2));
			wheelBRC = new Physijs.DOFConstraint(wheelBR,carFrame,new THREE.Vector3(8.2,19.5,-4));
			
			$scene.addConstraint(wheelFLC);
			$scene.addConstraint(wheelFRC);
			$scene.addConstraint(wheelBLC);
			$scene.addConstraint(wheelBRC);
			
			wheelFLC.setAngularLowerLimit({ x: 0, y: -Math.PI / 8, z: 1 });
			wheelFLC.setAngularUpperLimit({ x: 0, y: Math.PI / 8, z: 0 });
			wheelFRC.setAngularLowerLimit({ x: 0, y: -Math.PI / 8, z: 1 });
			wheelFRC.setAngularUpperLimit({ x: 0, y: Math.PI / 8, z: 0 });
			wheelBLC.setAngularLowerLimit({x:0,y:0,z:0});
			wheelBLC.setAngularUpperLimit({x:0,y:0,z:0});
			wheelBRC.setAngularLowerLimit({x:0,y:0,z:0});
			wheelBRC.setAngularUpperLimit({x:0,y:0,z:0});
		}
		modeling();
		
		const backgroundObjSetting = () => {
			var $glTFModel = new THREE.GLTFLoader();
			let treeLoadCnt = 0;
			let rockLoadCnt = 0;
			
			for (var i = 0; i < mapArray.length; i++) {
				for (var j = 0; j < mapArray[i].length; j++) {
					if (mapArray[i][j] == 1) {
						treeArray.push([i,j]);
						$glTFModel.load('/assets/threejs/images/tree/scene.gltf', function (data) {
							var tree = data.scene;
							tree.position.set( (treeArray[treeLoadCnt][1]*5),0,(treeArray[treeLoadCnt][0]*5) );
							tree.scale.set(options.scale/40, options.scale/40, options.scale/40);
							// tree.rotation.y = Math.PI/(Math.random()*10);
							$scene.add(tree);
							treeLoadCnt += 1;
						});
					}
					if (mapArray[i][j] == 2) {
						rockArray.push([i,j]);
						$glTFModel.load('/assets/threejs/images/rock/scene.gltf', function (data) {
							var rock = data.scene;
							rock.position.set( (rockArray[rockLoadCnt][1]*5),0,(rockArray[rockLoadCnt][0]*5) );
							rock.scale.set(options.scale/10, options.scale/10, options.scale/10);
							// rock.rotation.x = Math.PI/(Math.random()*10);
							$scene.add(rock);
							rockLoadCnt += 1;
						});
					}

					if (mapArray[i][j] != 0) {
						var hurdle = i+', '+j;
						hurdleArray.push(hurdle);
					}
				}
			}
		}
		// backgroundObjSetting();
		////////////////////////////////////////////////////////// glTF-오브젝트 설정


		////////////////////////////////////////////////////////// 카메라 설정
		$camera.position.set(options.cameraX,options.cameraY,options.cameraZ);
		$camera.lookAt($scene.position);
		////////////////////////////////////////////////////////// 카메라 설정

		// 씬에 오브젝트 놓기
		if (options.guideline) $scene.add($helper);

		_draw();
		_render();
		_cameraMoving();

		// test
		$scene.add( new THREE.AmbientLight(0x505050) );


		var spotLight = new THREE.SpotLight(0xffa019);
		spotLight.position.set(50.7,30.7,3);
		spotLight.intensity = 1.1;
		spotLight.distance = 88;
		spotLight.angle = 1;
		spotLight.penumbra = 0;
		spotLight.decay = 1;
		spotLight.castShadow = true;
		spotLight.shadow.camera.near = 3;
		spotLight.shadow.camera.far = 10;
		spotLight.shadow.mapSize.width = 1024;
		spotLight.shadow.mapSize.height = 1024;

		$scene.add( spotLight );
		

		var spotLight2 = new THREE.SpotLight(0xffe7cd);
		spotLight2.position.set(2,137.4,0);
		spotLight2.intensity = 2;
		spotLight2.distance = 300;
		spotLight2.angle = 0.6;
		spotLight2.penumbra = 0;
		spotLight2.decay = 1.4;
		spotLight2.castShadow = true;
		spotLight2.shadow.camera.near = 3;
		spotLight2.shadow.camera.far = 10;
		spotLight2.shadow.mapSize.width = 1024;
		spotLight2.shadow.mapSize.height = 1024;

		$scene.add( spotLight );
		$scene.add( spotLight2 );
	};

	// 애니메이션 렌더 (움직임 관성 쓰기위해 사용 사용 안할거면 그냥 렌더링으로 처리)
	const _render = () => {
		requestAnimationFrame(_render);
		renderCalls.forEach(function(callback) {
			callback();
		});
	}

	// 그리기 함수
	const _draw = () => {
		function renderScene() { 
			var delta = clock.getDelta();
			stats.update();
			
			_objectMoving(delta);
			if(_controls) _controls.update();
			
			carFrame.__dirtyPosition = true; //오브젝트 움직여도 물리엔진 최신
			$scene.simulate(); //물리엔진 run

			$camera.lookAt(carFrame.position);
			renderEffect.render($scene,$camera);
		}
		renderCalls.push(renderScene); // 움직임 관성 쓰기 위한 event
	};

	// 맵 표시
	const _mapShow = () => {
		$el.prepend('<div class="map" />');
		$el.find('.map').prepend('<span class="user" style="width:'+_mapBlockW+'px;height:'+_mapBlockW+'px;" />');
		$el.find('.map').css({
			'width' : _mapW * _mapBlockW,
			'height' : _mapH * _mapBlockW
		});

		for (var i = 0; i < mapArray.length; i++) {
			for (var j = 0; j < mapArray[i].length; j++) {
				if (mapArray[i][j] == 1) {
					$el.find('.map').prepend('<i class="tree" style="top:'+(i*_mapBlockW)+';left:'+(j*_mapBlockW)+';width:'+_mapBlockW+'px;height:'+_mapBlockW+'px;" />');
				}
				if (mapArray[i][j] == 2) {
					$el.find('.map').prepend('<i class="rock" style="top:'+(i*_mapBlockW)+';left:'+(j*_mapBlockW)+';width:'+_mapBlockW+'px;height:'+_mapBlockW+'px;" />');
				}
			}
		}	
	}

	// 빛 추가 함수
	const _lightAdd = () => {
		// light event
		var $mainLight = new THREE.SpotLight(0xffffff,1);
		var $mainLightGuideline = new THREE.SpotLightHelper($mainLight);

		$mainLight.position.set(2,3,3); // light position
		$mainLight.angle = Math.PI / 3; // light 영역 크기
		$mainLight.penumbra = 0; // light 그라데이션
		$mainLight.decay = 1; // light 연하기
		$mainLight.distance = 150; // light 거리

		$mainLight.castShdow = true; // 그림자 보낼때
		$mainLight.shadow.camera.near = 3;
		$mainLight.shadow.camera.far = 10;
		$mainLight.shadow.mapSize.width = 1024;
		$mainLight.shadow.mapSize.height = 1024;

		$scene.add($mainLight);
		if (options.guideline) $scene.add($mainLightGuideline);

		_guiControl($mainLight); //gui control
	}

	// 빛 추출
	const _WEBGLGenerater = () => {
		console.log('-------------------------------- lightGenerater --------------------------------');

		_lightRender();
	}
	const _lightRender = () => {
		var _x;
		var _y;
		var _z;
		$('.gui-wrap .dg').each(function () {
			console.log('--------------------------------');
			console.log('조명 번호 : ' + ($(this).index()+1));
			
			$(this).find('li').each(function () {
				var _this = $(this);
				var type = _this.find('.property-name').html();

				if (type == 'x') _x = _this.find('input').val();
				if (type == 'y') _y = _this.find('input').val();
				if (type == 'z') {
					_z = _this.find('input').val();
					console.log('조명.position.set('+_x+','+_y+','+_z+');');
				}
				if (type != 'x' && type != 'y' && type != 'z') console.log('조명.'+type+' = ' + _this.find('input').val() + ';');
			});
			console.log('--------------------------------');
		});
	}

	// 카메라 무빙
	const _cameraMoving = () => {
		_controls = new THREE.OrbitControls($camera, renderEffect.domElement);

		_controls.rotateSpeed = 0.05;

		_controls.autoRotate = false; // 자동 rotate _controls.update()이거 사용해야 한다
		_controls.autoRotateSpeed = 0.008; //자동 rotate 속도
		_controls.enableZoom = true; // zoom 활성화
		_controls.enableKeys = false; // 키보드 이동 활성화
		_controls.enableDamping = true; // 움직임 관성 이거 쓰려면 _controls.update()이거 사용해야 한다
		_controls.enablePan = false; // 오른쪽 드래그로 카메라 축 바뀌는 거

		_controls.minPolarAngle = 0; // 수직으로 공전할 수 있는 거리 min
		_controls.maxPolarAngle = Math.PI/2 - 0.2; // 수직으로 공전할수 있는 거리 max

		_controls.dampingFactor = 0.05; //댐핑 관성
	};

	const _guiControl = _this => {
		var gui = new dat.GUI({
			autoPlace : false
		});
		$el.find('.gui-wrap').append($(gui.domElement));

		var lightControl = {
			'light color' : _this.color.getHex(),
			x : _this.position.x,
			y : _this.position.y,
			z : _this.position.z,
			intensity: _this.intensity,
			distance: _this.distance,
			angle: _this.angle,
			penumbra: _this.penumbra,
			decay: _this.decay
		}

		gui.addColor(lightControl, 'light color').onChange(function (val){ _this.color.setHex(val); });
		gui.add(lightControl, 'x', -500, 500).onChange(function (val){ _this.position.x = val; });
		gui.add(lightControl, 'y', -500, 500).onChange(function (val){ _this.position.y = val; });
		gui.add(lightControl, 'z', -500, 500).onChange(function (val){ _this.position.z = val; });
		gui.add(lightControl, 'intensity', 0, 2).onChange(function (val){ _this.intensity = val; });
		gui.add(lightControl, 'distance', 0, 10000).onChange(function (val){ _this.distance = val; });
		gui.add(lightControl, 'angle', 0, Math.PI/3).onChange(function (val){ _this.angle = val; });
		gui.add(lightControl, 'penumbra', 0, 2).onChange(function (val){ _this.penumbra = val; });
		gui.add(lightControl, 'decay', 1, 2).onChange(function (val){ _this.decay = val; });
		gui.open();
	}
	
	const _objectMoving = delta => {
		_gltfFrame = 0;

		wheelFLC.configureAngularMotor( 1, 0, 0, 1, 200 );
		wheelFRC.configureAngularMotor( 1, 0, 0, 1, 200 );

		wheelFLC.disableAngularMotor( 1 );
		wheelFRC.disableAngularMotor( 1 );
		wheelBLC.disableAngularMotor( 2 );
		wheelBRC.disableAngularMotor( 2 );

		if (_keyboard.pressed("W")) {	
			wheelBLC.configureAngularMotor(2, 1, 0, 5, 10000);
			wheelBLC.enableAngularMotor(2);
			wheelBRC.configureAngularMotor(2, 1, 0, 5, 10000);
			wheelBRC.enableAngularMotor(2);
		}
		if (_keyboard.pressed("D")) {
			wheelFLC.configureAngularMotor( 1, -Math.PI / 4, Math.PI / 4, -1, 200 );
			wheelFRC.configureAngularMotor( 1, -Math.PI / 4, Math.PI / 4, -1, 200 );
			wheelFLC.enableAngularMotor( 1 );
			wheelFRC.enableAngularMotor( 1 );
		}
		if (_keyboard.pressed("A")) {
			wheelFLC.configureAngularMotor( 1, -Math.PI / 4, Math.PI / 4, 5, 200 );
			wheelFRC.configureAngularMotor( 1, -Math.PI / 4, Math.PI / 4, 5, 200 );
			wheelFLC.enableAngularMotor( 1 );
			wheelFRC.enableAngularMotor( 1 );
		}
		if (_keyboard.pressed("S")) {
			wheelBLC.configureAngularMotor(2, 1, 0, -5, 10000);
			wheelBLC.enableAngularMotor(2);
			wheelBRC.configureAngularMotor(2, 1, 0, -5, 10000);
			wheelBRC.enableAngularMotor(2);
		}
		if (_keyboard.pressed("space")) {
			wheelBLC.configureAngularMotor(2, 1, 0, 0, 10000);
			wheelBRC.configureAngularMotor(2, 1, 0, 0, 10000);
			wheelBLC.enableAngularMotor(2);
			wheelBRC.enableAngularMotor(2);
		}

		// camera object 바라보기
		if ($object) {
		// 	var relativeCameraOffset = new THREE.Vector3(0,30,80);
		// 	var cameraOffset = relativeCameraOffset.applyMatrix4( $object.matrixWorld );

			// $camera.position.x = cameraOffset.x;
		// 	$camera.position.y = cameraOffset.y;
		// 	$camera.position.z = cameraOffset.z;
			// $camera.lookAt( $object.position );
		}
	}

	return {
		init : _init,
		mapShow : _mapShow,
		lightAdd : _lightAdd,
		WEBGLGenerater : _WEBGLGenerater
	}
};