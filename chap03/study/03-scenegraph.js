import * as THREE from 'three'
import {OrbitControls} from 'OrbitControls'
import { CameraHelper, Texture } from 'three';

class App{
    constructor(){
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;  //다른 메서드에서 참조 할 수 있도록 함.

        // [STEP 1] Renderer 세팅
        const renderer = new THREE.WebGLRenderer({
            antialias : true        
        });
        renderer.setPixelRatio(window.devicePiexelRatio);
        divContainer.appendChild(renderer.domElement);  //canvas타입의 DOM 객체 
        
        this._renderer = renderer; // renderer를 다른 메서드에서 참조 할 수 있도록 정의

        // [STEP 2] Scene 객체 생성 
        const scene = new THREE.Scene();    
        this._scene = scene;    

        this._setupCamera();
        this._setupLight();
        this._setupModel();
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
        camera.position.set(0,0,25);
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

        /*
        ### SceneGraph 
        solarSystem (Object3D)
                                - sunMesh(Mesh)
                                - earthOrbit(Object3D)   -  earthMesh(Mesh)
                                                         -  moonOrbit(Object3D)   - moonMesh(Mesh)

        */

        //1. solarSystem (Object3D)
        const solarSystem = new THREE.Object3D();
        this._scene.add(solarSystem);

        //2-1. sunMesh(Mesh) - geometry (계속사용할 구 geometry)
        const radius= 1;
        const widthSegements = 12;
        const heightSegements = 12;
        const sphereGeometry = new THREE.SphereGeometry(radius,widthSegements,heightSegements);

        //2-2. sunMesh(Mesh) - material
        const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00, flatShading : true});

        //2-3. sunMesh
        const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
        sunMesh.scale.set(3,3,3);
        solarSystem.add(sunMesh);

        //3. earthOrbit 
        const earthOrbit = new THREE.Object3D();
        solarSystem.add(earthOrbit);

        //3-1. earthMesh
        const earthMaterial = new THREE.MeshPhongMaterial({
            color : 0x2233ff, emissive :0x112244 , flatShading : true
        });
        const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
        earthOrbit.position.x =10;  //10만큼 떨어지게 배치함. 
        earthOrbit.add(earthMesh);

        //3-2 moonOrbit
        const moonOrbit = new THREE.Object3D();
        moonOrbit.position.x =2;
        earthOrbit.add(moonOrbit);
        const moonMaterial = new THREE.MeshPhongMaterial({
            color:0x888888, emissive :0x222222, flatShading:true
        });
        const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
        moonMesh.scale.set(0.5,0.5,0.5);
        moonOrbit.add(moonMesh);

        //다른 곳에서 사용할 수 있도록
        this._solarSystem = solarSystem;
        this._earthOrbit = earthOrbit;
        this._moonOrbit = moonOrbit;
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
        this._solarSystem.rotation.y = time / 2;
        this._earthOrbit.rotation.y  = time * 2; 
        this._moonOrbit.rotation.y = time * 5;
    }
}

window.onload = function(){
    new App();
};