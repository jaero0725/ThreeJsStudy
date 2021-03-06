## ๐ ๋ชฉํ : OrbitControls ์ฌ์ฉํ๊ณ  ZoomFit ๊ฐ๋์ ์ด์ฉ ๋ชจ๋ธ์ ํ ํ๋ฉด์ ๊ฝ ์ฑ์ฐ๊ธฐ
<div align="center">
<img src="https://user-images.githubusercontent.com/55049159/178419745-49e79cdc-1c35-4d73-8c31-3a5b46e8cc94.gif" align="center">
</div>

### ๊ฐ๋
<p>  ๋ชจ๋ธ์ ํ๋ฉด์ ๊ฝ ์ฑ์ฐ๊ธฐ ์ํ ์ ๋นํ ๊ฑฐ๋ฆฌ = ๋ชจ๋ธ ํฌ๊ธฐ์ ์ ๋ฐ / tan(์นด๋ฉ๋ผ์ fov์ ์ ๋ฐ) </p>

```javascript

import * as THREE from 'three'
import { GLTFLoader } from "/node_modules/three/examples/jsm/loaders/GLTFLoader.js"
import {OrbitControls} from "/node_modules/three/examples/jsm/controls/OrbitControls.js"

// 1. OrbitControls์ ์ด์ฉ gltf ๊ฐ์ฒด ํธ๋ค๋ง
// 2. Zoom ์ ์ด์ฉํด ๊ด์์ ์นด๋ฉ๋ผ์ ํ์ ์ ๋ง์ถ์ด ํ์ ์ํด.

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
        //GLTF Object๋ฅผ ๊ฐ์ ธ์จ๋ค.
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
         ๋ชจ๋ธ์ ํ๋ฉด์ ๊ฝ ์ฑ์ฐ๊ธฐ ์ํ ์ ๋นํ ๊ฑฐ๋ฆฌ = ๋ชจ๋ธ ํฌ๊ธฐ์ ์ ๋ฐ / tan(์นด๋ฉ๋ผ์ fov์ ์ ๋ฐ)
         
    */
    // ํ๋ฉด์ ๊ฐ๋์ฐฐ 3D ๊ฐ์ฒด์ camera ๊ฐ์ฒด๋ฅผ ๋ฐ์
    _zoomFit(object3D, camera){
        //๋ชจ๋ใน์ ๊ฒฝ๊ณ ๋ฐ์ค
        const box = new THREE.Box3().setFromObject(object3D);

        // ๋ชจ๋ธ์ ๊ฒฝ๊ณ ๋ฐ์ค ๋๊ฐ ๊ธธ์ด
        const sizeBox = box.getSize(new THREE.Vector3()).length();

        // ๋ชจ๋ธ์ ๊ฒฝ๊ณ ๋ฐ์ค ์ค์ฌ ์์น 
        const centerBox = box.getCenter(new THREE.Vector3());

        // ๋ชจ๋ธ ํฌ๊ธฐ์ ์ ๋ฐ๊ฐ
        const halfSizeModel = sizeBox * 0.9;

        // ์นด๋ฉ๋ผ์ fov์ ์ ๋ฐ๊ฐ
        const halfFov = THREE.MathUtils.degToRad(camera.fov *.5);

        // ๋ชจ๋ธ์ ํ๋ฉด์ ๊ฝ ์ฑ์ฐ๊ธฐ ์ํ ์ ๋นํ ๊ฑฐ๋ฆฌ
        const distance = halfSizeModel / Math.tan(halfFov);

        // ๋ชจ๋ธ ์ค์ฌ์์ ์นด๋ฉ๋ผ ์์น๋ก ํฅํ๋ ๋ฐฉํฅ ๋จ์ ๋ฒกํฐ ๊ณ์ฐ
        const direction = (new THREE.Vector3()).subVectors(
        camera.position, centerBox).normalize();

        // "๋จ์ ๋ฐฉํฅ ๋ฒกํฐ" ๋ฐฉํฅ์ผ๋ก ๋ชจ๋ธ ์ข์ฌ ์์น์์ distance ๊ฑฐ๋ฆฌ์ ๋ํ ์์น
        const position = direction.multiplyScalar(distance).add(centerBox);
            camera.position.copy(position);

        // ๋ชจ๋ธ์ ํฌ๊ธฐ์ ๋ง์ถฐ ์นด๋ฉ๋ผ์ near, far ๊ฐ์ ๋๋ต์ ์ผ๋ก ์กฐ์ 
        camera.near = sizeBox / 100;
        camera.far = sizeBox * 100;

        // ์นด๋ฉ๋ผ ๊ธฐ๋ณธ ์์ฑ ๋ณ๊ฒฝ์ ๋ฐ๋ฅธ ํฌ์ํ๋ ฌ ์๋ฐ์ดํธ
        camera.updateProjectionMatrix();

        // ์นด๋ฉ๋ผ๊ฐ ๋ชจ๋ธ์ ์ค์ฌ์ ๋ฐ๋ผ ๋ณด๋๋ก ํจ
        camera.lookAt(centerBox.x, centerBox.y, centerBox.z);
    }

    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );

        //camera ์์น๋ฅผ ์กฐ์  => ์ ๋นํ๊ฐ์ ๋ฐ๊ธฐ์ํ ๋ฐฉ๋ฒ?
        
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
        //๋น์ Scene์๋ค ๋ฃ์ง์๊ณ  camera์๋ค๊ฐ ๋ฃ์ด์ ๊ด์์ด ๋ฐ๋๊ฒ ํด์ค๋ค.     
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
