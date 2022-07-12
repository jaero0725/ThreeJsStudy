## 🔖 목표 : Three.js Orbit Control 사용하고 ZoomFit 개념을 이용 모델을 한 화면에 꽉 채우기


### 개념
<p>  모델을 화면에 꽉 채우기 위한 적당한 거리 = 모델 크기의 절반 / tan(카메라의 fov의 절반) </p>

```javascript

import * as THREE from 'three'
import { GLTFLoader } from "/node_modules/three/examples/jsm/loaders/GLTFLoader.js"
import {OrbitControls} from "/node_modules/three/examples/jsm/controls/OrbitControls.js"

// 1. OrbitControls을 이용 gltf 객체 핸들링
// 2. Zoom 을 이용해 광원을 카메라의 회전에 맞추어 회전시킴.

class App{
    constructor(){
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);

        this._renderer = renderer;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('white');
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls(){

        //camera, 
        new OrbitControls(this._camera, this._divContainer);
    }

    _setupModel(){
        //GLTF Object를 가져온다.
        const gltfLoader = new GLTFLoader();
        const url = 'gltf/logo.gltf';
        gltfLoader.load(
            url,
            (gltf) => { 
                const root = gltf.scene;
                this._scene.add(root);

                //zoomFit
                this._zoomFit(root, this._camera);
            }
        )
    }

    /*
         모델을 화면에 꽉 채우기 위한 적당한 거리 = 모델 크기의 절반 / tan(카메라의 fov의 절반)
         
    */
    // 화면에 가득찰 3D 객체와 camera 객체를 받음
    _zoomFit(object3D, camera){
        //모뎀ㄹ의 경계 박스
        const box = new THREE.Box3().setFromObject(object3D);

        // 모델의 경계 박스 대각 길이
        const sizeBox = box.getSize(new THREE.Vector3()).length();

        // 모델의 경계 박스 중심 위치 
        const centerBox = box.getCenter(new THREE.Vector3());

        // 모델 크기의 절반값
        const halfSizeModel = sizeBox * 0.9;

        // 카메라의 fov의 절반값
        const halfFov = THREE.MathUtils.degToRad(camera.fov *.5);

        // 모델을 화면에 꽉 채우기 위한 적당한 거리
        const distance = halfSizeModel / Math.tan(halfFov);

        // 모델 중심에서 카메라 위치로 향하는 방향 단위 벡터 계산
        const direction = (new THREE.Vector3()).subVectors(
        camera.position, centerBox).normalize();

        // "단위 방향 벡터" 방향으로 모델 종심 위치에서 distance 거리에 대한 위치
        const position = direction.multiplyScalar(distance).add(centerBox);
            camera.position.copy(position);

        // 모델의 크기에 맞춰 카메라의 near, far 값을 대략적으로 조정
        camera.near = sizeBox / 100;
        camera.far = sizeBox * 100;

        // 카메라 기본 속성 변경에 따른 투영행렬 업데이트
        camera.updateProjectionMatrix();

        // 카메라가 모델의 중심을 바라 보도록 함
        camera.lookAt(centerBox.x, centerBox.y, centerBox.z);
    }

    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );

        //camera 위치를 조정 => 적당한값을 받기위한 방법?
        
        camera.position.set(0,0,10);
        this._camera = camera;

        this._scene.add(this._camera);
    }

    _setupLight(){
        const color = 0xffffff;
        const intensity = 1.6;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
       
         //this._scene.add(light);
        //빛을 Scene에다 넣지않고 camera에다가 넣어서 광원이 바뀌게 해준다.     
        this._camera.add(light);
    }

    update(time) {
        time *= 0.001; // second unit
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);   
        this.update(time);

        requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        
        this._renderer.setSize(width, height);
    }
}

window.onload = function () {
    new App();
}

```
<hr>

## REF

https://threejs.org/docs/#examples/ko/controls/OrbitControls
