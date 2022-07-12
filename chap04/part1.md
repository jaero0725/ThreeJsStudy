<a href="https://zeroco.tistory.com/123">블로그글</a><br>
Three.js에서 제공하는 기본 Geometry에 대해서 알아보겠다. 

Geometry는 앞선 포스팅에서 처럼 Mesh에 들어가는 요소 Geometry, Material 중에 형상을 의미하는 거라고 설명했다.

아래 그림은 Three.js 에서 제공하는 BufferGeometry 를 상속받아 사용할 수 있는 Geometry를 보여준다.

보라색글씨로 쓰여진 Geometry객체들이 자주 쓰이는 Geometry들이며, 본 포스팅에서 예시를 통해 알아 보겠다. 

![geometry](https://user-images.githubusercontent.com/55049159/178503028-9815100f-dc92-4b40-9efa-449f9cbdfb56.png)


Geometry는 3차원 객체 형상을 정의한다. Geometry의 형상을 정의하기 위한 데이터는 아래 그림과 같다. 
![image](https://user-images.githubusercontent.com/55049159/178502924-4e8c9f56-b25d-4ca7-af53-60a312a38c90.png)


**1\. 정점(Vertex)  : x,y,z 축의 대한 좌표**

**2\. 정점 인덱스(Vertex Index) : 면을 구성**

**3\. 수직 벡터(Normal Vector) : 정점에 대한 수직 벡터**

**4\. 정점 색상(Vertex Color) :정점에 대한 색상**

**5\. 텍스쳐 맵핑을 위한 UV 좌표**

**6\. 사용자 정의 데이터 : 사용자가 임의로 정의한 데이터** 

\=> 3차원으로 시각화 될때 GPU가 작동하여 보여줌. 

---

그러면, 코드를 통해서 알아보겠다. 

다음 예시는 BoxGeometry와 WireFrameGeometry를 사용하는 것이다.

먼저 BoxGeometry는 가로, 세로, 깊이 각각에 대한 분할 수로 정의된다. 이 분할 수 Default는 1이다. 

이 값을 변경하면 segement가 분할되게 된다. 

 _html_ 

``` html
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>geometry</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel='stylesheet' type='text/css' media='screen' href='02-geometry.css'>
    <script type="importmap">
        {
            "imports": {
                "three": "/node_modules/three/build/three.module.js",
                "OrbitControls" : "/node_modules/three/examples/jsm/controls/OrbitControls.js"
            }
        }
    </script>
    <script src='02-geometry.js' type="module" defer></script>
</head>
<body>
    <!--3차원 그래픽 캔버스 요소가 추가될 예정.-->
    <div id="webgl-container">
    </div>
</body>
</html>
```

_js_

```javascript
import * as THREE from 'three'
import {OrbitControls} from 'OrbitControls'

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
        camera.position.z = 2;
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
        // ## BoxGeometry
        // ## wireFrameGeometry 

        // 1. 회색색상의 Material을 이용
        const geometry = new THREE.BoxGeometry(1,1,1);  //가로 세로 깊이 

        const fillMaterial = new THREE.MeshPhongMaterial({
            color : 0x515151 // 회색
        });
        const cube = new THREE.Mesh(geometry, fillMaterial);

        // 2. 선의 재질 만들어 Line 타입의 Object를 만듦. 
        const lineMaterial = new THREE.LineBasicMaterial({ color : 0xffff00});
        const line = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry), // WireFrame으로 만들기 위해 
            lineMaterial
        );

        // 3. 하나의 객체로 만들기 위해 Group으로 묶음. 
        const group = new THREE.Group();    
        group.add(cube);
        group.add(line);
        
        // Scene에 담음. 
        this._scene.add(group);
        this._cube = group;
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

\_setupModel() 함수를 잘 살펴보자.

```javascript
_setupModel(){
        // ## BoxGeometry
        // ## wireFrameGeometry 

        // 1. 회색색상의 Material을 이용
        const geometry = new THREE.BoxGeometry(1,1,1);  //가로 세로 깊이 

        const fillMaterial = new THREE.MeshPhongMaterial({
            color : 0x515151 // 회색
        });
        const cube = new THREE.Mesh(geometry, fillMaterial);

        // 2. 선의 재질 만들어 Line 타입의 Object를 만듦. 
        const lineMaterial = new THREE.LineBasicMaterial({ color : 0xffff00});
        const line = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry), // WireFrame으로 만들기 위해 
            lineMaterial
        );

        // 3. 하나의 객체로 만들기 위해 Group으로 묶음. 
        const group = new THREE.Group();    
        group.add(cube);
        group.add(line);
        
        // Scene에 담음. 
        this._scene.add(group);
        this._cube = group;
    }
```

---

![groupCube](https://user-images.githubusercontent.com/55049159/178503091-0487b0ae-ec4a-4af2-a5fe-2b614d90206f.gif)


---

Ref

https://threejs.org/docs/#api/en/core/BufferGeometry <br>
https://www.youtube.com/channel/UCgaxgVio7J9JgZrONkwiSEQ/videos
