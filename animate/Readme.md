gltf 파일을 Animate 하기 

```javascript

import * as THREE from 'three'
import { GLTFLoader } from "/node_modules/three/examples/jsm/loaders/GLTFLoader.js"
import {OrbitControls} from 'OrbitControls'


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
        scene.background = new THREE.Color(0xffffff);
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
            window.innerWidth / window.innerHeight,
            0.01,
            1000
        );
        camera.position.set(0,50,200);
        this._camera = camera;

        this._scene.add(this._camera);
    }

    _setupLight(){
        const color = 0xffffff; 
        const intensity = 1;    
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(1,0,1);
        this._scene.add(light);
    }

    _setupControls(){
        new OrbitControls(this._camera, this._divContainer);
    }

    changeAnimation(animationName) {
        const previousAnimationAction = this._currentAnimationAction;
        this._currentAnimationAction = this._animationsMap[animationName];

        if(previousAnimationAction !== this._currentAnimationAction) {
            previousAnimationAction.fadeOut(0.5);
            this._currentAnimationAction.reset().fadeIn(0.5).play();
        }
    }
    
    _setupAnimations(gltf){
        const model = gltf.scene;
        const mixer = new THREE.AnimationMixer(model);
        const gltfAnimations = gltf.animations;
        const domControls = document.querySelector("#controls");
        const animationsMap = {};

        gltfAnimations.forEach(animationClip => {
            const name = animationClip.name;
            console.log(name);

            const domButton = document.createElement("div");
            domButton.classList.add("button");
            domButton.innerText = name;
            domControls.appendChild(domButton);

            domButton.addEventListener("click", () => {
                const animationName = domButton.innerHTML;
                this.changeAnimation(animationName);
            });

            const animationAction = mixer.clipAction(animationClip);
            animationsMap[name] = animationAction;
        });
        this._mixer = mixer;
        this._animationsMap = animationsMap;
        this._currentAnimationAction =  this._animationsMap["Angry"];
        this._currentAnimationAction.play();
    }
    
    _setupModel(){
        new GLTFLoader().load('model.glb', 
            (gltf) => {
                const model = gltf.scene;
                console.log(model);
                this._scene.add(model);

                this._setupAnimations(gltf);
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
        time *= 0.001; // second unit

        if(this._mixer) {
            const deltaTime = time - this._previousTime;
            this._mixer.update(deltaTime);
        }
        this._previousTime = time;

    }
}

window.onload = function(){
    new App();
};

```
