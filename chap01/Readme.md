# 첫 세팅 

### Three.js 설치 
<a href= "https://zeroco.tistory.com/117"> 설치방법 </a> <br>

### => npm 방식으로 설치한 것으로 실습을 진행

```
/*
3D 모델 보여줄떄 필수품
    1. 카메라
    2. 조명
    3. 배경 
*/

//1. 장면만들고
//2. 브라우저에 렌더링 해주세요.

let scene = new THREE.Scene();                  //1. 장면만들고
//scene.add(); //여기에 그림을 그릴 수 있음.

const renderer = new THREE.WebGLRenderer({
    antialias : true,
    canvas : document.querySelector("#canvas")
});

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000 ); //PerspectiveCamera (원근법 O), OrthographicCamer (원근법 X)
camera.position.set(0,0,150);
//const controls = new THREE.OrbitControls(camera);

// controls.rotateSpeed = 1.0; // 마우스로 카메라를 회전시킬 속도입니다. 기본값(Float)은 1입니다.        
// controls.zoomSpeed = 1.2;    // 마우스 휠로 카메라를 줌 시키는 속도 입니다. 기본값(Float)은 1입니다.

scene.background = new THREE.Color('white');
let light = new THREE.DirectionalLight(0xffffff,10); //조명 
scene.add(light);

let loader = new GLTFLoader(); //gltf 파일은 GLTFLoader 로 가져와야됨

loader.load('/gltf/logo.gltf', function(gltf){
    scene.add(gltf.scene);
    function animate(){
        requestAnimationFrame(animate) //1초에 60번 실행됨.

        //회전
        gltf.scene.rotation.y += 0.010;
        renderer.render(scene,camera);  
    }
    animate();
}); //로그 할떄 시간이 좀 걸림 콜백 필요 , parametr 에 들어가 있음. 

//마우스 사용해서 컨트롤 => orbitControls

```
