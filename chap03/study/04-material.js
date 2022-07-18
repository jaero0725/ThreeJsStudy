import * as THREE from 'three'
import {OrbitControls} from 'OrbitControls'
import { Sprite } from 'three';

class App{
    constructor(){
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;  //다른 메서드에서 참조 할 수 있도록 함.

        // [STEP 1] Renderer 세팅
        const renderer = new THREE.WebGLRenderer({
            // 생성할때 다양한 옵션을 설정할 수 있음. 
            antialias : true        // antialias : true => 경계선의 계단현상을 없애줌
        });
        renderer.setPixelRatio(window.devicePiexelRatio);
        divContainer.appendChild(renderer.domElement);  //canvas타입의 DOM 객체 
        
        this._renderer = renderer; // renderer를 다른 메서드에서 참조 할 수 있도록 정의

        // [STEP 2] Scene 객체 생성 
        const scene = new THREE.Scene();    
        this._scene = scene;    // scene을 다른 메서드에서 참조 할 수 있도록 정의

        // [STEP 3] Camera 객체 생성 
        this._setupCamera();

        // [STEP 4] Ligth 객체 생성 
        this._setupLight();

        // [STEP 5] 3차원 모델 객체 생성 
        this._setupModel();

        // 마우스 움직이는대로 
        this._setupControls();

        window.onresize = this.resize.bind(this);
        this.resize();
        requestAnimationFrame(this.render.bind(this));
    }
    
    _setupCamera(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        
        const camera = new THREE.PerspectiveCamera(
            75, 
            width / height,
            0.1,
            100
        );
        camera.position.z = 7;
        this._camera = camera;
    }

    _setupLight(){
        const color = 0xffffff; 
        const intensity = 1    
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }

    _setupControls(){
        new OrbitControls(this._camera, this._divContainer);
    }

    _setupModel(){
       const vertices = [];
       for (let i = 0; i<10000; i++){
            const x = THREE.MathUtils.randFloatSpread(5);
            const y = THREE.MathUtils.randFloatSpread(5);
            const z = THREE.MathUtils.randFloatSpread(5);

            vertices.push(x,y,z);
       }

       const geometry = new THREE.BufferGeometry();
       geometry.setAttribute(
         "position",
          new THREE.Float32BufferAttribute(vertices, 3)
       );

        const spirte = new THREE.TextureLoader().load(
            // "/study/img/snow.jpg"
            //"/study/img/snow-particle.png"
            "/study/img/moon.png"
            //"/study/img/earth02.png"
            //"/study/img/earth.jfif"
           );

        console.log("spirte" + JSON.stringify(spirte));
        const material = new THREE.PointsMaterial({
            map : spirte,
            alphaTest : 0.5,
            //color : 0xff0000,
            size : 0.1,
            sizeAttenuation : true  //거리에 따라 qusrud  
        });

       const points = new THREE.Points(geometry, material);
       this._scene.add(points);

    }

    resize(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(width, height);
    }

    render(time){
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    update(time){
        time *= 0.001; 
    }
}

window.onload = function(){
    new App();
};