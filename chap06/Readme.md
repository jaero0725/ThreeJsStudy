### Material
<a href="https://zeroco.tistory.com/127">블로그글로</a>
<br><br>
이번에는 기본적인 Three.js 의 Material에 대해서 알아보겠다.

Material은 Geometry와 함께 Obejct3D를 이루기 위한 필수 요소이다.

참고로 Obejct3D에는 Points, Line, Mesh 라는 파생 클래스가 있다.

공식문서에서 확인하면 Material 클래스는 아래와 같이 있는 것을 알 수 있다. 모든 Material관련 클래스는 Material을 상속받은 클래스이다. 

Material들이 앞에 단어가 Line, Mesh, Points 등이 있는데 각 Object3D의 파생클래스인 Points, Line, Mesh와 관련 있다는 것을 알 수 있다. 

상황에 맞게 공식문서의 예시를 확인하면서 필요한 Material을 사용하면 될 것이다. 
    

<img src="https://user-images.githubusercontent.com/55049159/179455206-d2bf3b4a-fd5b-48f6-a4f9-3e995904eaf3.png">



다음은 PointsMaterial을 사용하여, TextureLoader을 적용하여 img를 적용시킨 예제이다. 

이미지는 두개를 사용하였다. 

```  javascript
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

        //1. 
       const vertices01 = [];
       for (let i = 0; i<5000; i++){
            const x = THREE.MathUtils.randFloatSpread(5);
            const y = THREE.MathUtils.randFloatSpread(5);
            const z = THREE.MathUtils.randFloatSpread(5);
            vertices01.push(x,y,z);
       }
       const geometry01 = new THREE.BufferGeometry();
       geometry01.setAttribute(
         "position",
          new THREE.Float32BufferAttribute(vertices01, 3)
       );
       const spirte01 = new THREE.TextureLoader().load(
          "/study/img/moon.png"
       );
       const material01 = new THREE.PointsMaterial({
            map : spirte01,
            alphaTest : 0.5,
            //color : 0xff0000,
            size : 0.1,
            sizeAttenuation : true  //거리에 따라 
        });
        const points01 = new THREE.Points(geometry01, material01);
        this._scene.add(points01);

        //2. 
        const vertices02 = [];
        for (let i = 0; i<5000; i++){
            const x = THREE.MathUtils.randFloatSpread(5);
            const y = THREE.MathUtils.randFloatSpread(5);
            const z = THREE.MathUtils.randFloatSpread(5);
            vertices02.push(x,y,z);
        }
        const geometry02 = new THREE.BufferGeometry();
        geometry02.setAttribute(
          "position",
           new THREE.Float32BufferAttribute(vertices02, 3)
        );
        const spirte02 = new THREE.TextureLoader().load(
            "/study/img/snow-particle.png"
        );
        const material02 = new THREE.PointsMaterial({
            map : spirte02,
            alphaTest : 0.5,
            //color : 0xff0000,
            size : 0.1,
            sizeAttenuation : true  //거리에 따라 
        });
        const points02 = new THREE.Points(geometry02, material02);
        this._scene.add(points02);
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
```

![image](https://user-images.githubusercontent.com/55049159/179455255-e9997c47-78ff-4800-ba14-a1456171a299.png)

---
