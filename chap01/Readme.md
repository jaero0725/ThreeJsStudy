## ๐ ๋ชฉํ : Three.js ์ธํํ๊ณ , gltf ํ์ผ ๋ก๋ฉํ๊ธฐ

![logo](https://user-images.githubusercontent.com/55049159/178149204-6d6de703-475b-4623-830c-cf6e4aa0f138.gif)

### Three.js ์ค์น 
<a href= "https://zeroco.tistory.com/117"> ์ค์น๋ฐฉ๋ฒ </a> <br>
<p> ๋ฐฉ์์ผ๋ก ๋ค์ด๋ฐ์์ ์ค์นํ ๊ฒ์ผ๋ก ์ค์ต์ ์งํ </p>

```javascript
/*
3D ๋ชจ๋ธ ๋ณด์ฌ์ค๋ ํ์ํ
    1. ์นด๋ฉ๋ผ
    2. ์กฐ๋ช
    3. ๋ฐฐ๊ฒฝ 
*/

//1. ์ฅ๋ฉด๋ง๋ค๊ณ 
//2. ๋ธ๋ผ์ฐ์ ์ ๋ ๋๋ง ํด์ฃผ์ธ์.

let scene = new THREE.Scene();                  //1. ์ฅ๋ฉด๋ง๋ค๊ณ 
//scene.add(); //์ฌ๊ธฐ์ ๊ทธ๋ฆผ์ ๊ทธ๋ฆด ์ ์์.

const renderer = new THREE.WebGLRenderer({
    antialias : true,
    canvas : document.querySelector("#canvas")
});

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000 ); //PerspectiveCamera (์๊ทผ๋ฒ O), OrthographicCamer (์๊ทผ๋ฒ X)
camera.position.set(0,0,150);
//const controls = new THREE.OrbitControls(camera);

// controls.rotateSpeed = 1.0; // ๋ง์ฐ์ค๋ก ์นด๋ฉ๋ผ๋ฅผ ํ์ ์ํฌ ์๋์๋๋ค. ๊ธฐ๋ณธ๊ฐ(Float)์ 1์๋๋ค.        
// controls.zoomSpeed = 1.2;    // ๋ง์ฐ์ค ํ ๋ก ์นด๋ฉ๋ผ๋ฅผ ์ค ์ํค๋ ์๋ ์๋๋ค. ๊ธฐ๋ณธ๊ฐ(Float)์ 1์๋๋ค.

scene.background = new THREE.Color('white');
let light = new THREE.DirectionalLight(0xffffff,10); //์กฐ๋ช 
scene.add(light);

let loader = new GLTFLoader(); //gltf ํ์ผ์ GLTFLoader ๋ก ๊ฐ์ ธ์์ผ๋จ

loader.load('/gltf/logo.gltf', function(gltf){
    scene.add(gltf.scene);
    function animate(){
        requestAnimationFrame(animate) //1์ด์ 60๋ฒ ์คํ๋จ.

        //ํ์ 
        gltf.scene.rotation.y += 0.010;
        renderer.render(scene,camera);  
    }
    animate();
}); //๋ก๊ทธ ํ ๋ ์๊ฐ์ด ์ข ๊ฑธ๋ฆผ ์ฝ๋ฐฑ ํ์ , parametr ์ ๋ค์ด๊ฐ ์์. 

//๋ง์ฐ์ค ์ฌ์ฉํด์ ์ปจํธ๋กค => orbitControls

```
