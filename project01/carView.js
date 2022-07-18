import * as THREE from 'three';
import {GLTFLoader} from 'GLTFLoader';

console.log(THREE);
console.log(GLTFLoader);

class App{
    constructor(){
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer; 

        const renderer = new THREE.WebGLRenderer({
            antialias : true       
        });
        renderer.setPixelRatio(window.devicePiexelRatio);
        divContainer.appendChild(renderer.domElement);  
        
        this._renderer = renderer;

        const scene = new THREE.Scene();    
        scene.background.color = '0xffffff';
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

    _setupControls(){

    }

    _setupModel(){
        const gltfLoader = new GLTFLoader();
        const url = 'gltf/bike.gltf';
        gltfLoader.load(
            url,
            //화살표함수써야지 
            (gltf) => {
                this._scene.add(gltf.scene);
            }
        )
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