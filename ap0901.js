//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G384382023 近藤咲梧
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { GUI } from "ili-gui";
import { OrbitControls } from "three/addons";
import { GLTFLoader } from "three/addons";


// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    axes: true, // 座標軸
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "axes").name("座標軸");

  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);

  // カメラの作成
  const camera = new THREE.PerspectiveCamera(
    50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(40,10,40);
  camera.lookAt(0,0,0);
  
  // 第1のレンダラ
  const renderer = new THREE.WebGLRenderer();
  
    renderer.setClearColor(0x204060);
    renderer.setSize(window.innerWidth,innerHeight);

const orbitControls=new OrbitControls(camera,renderer.domElement);
orbitControls.listenToKeyEvents(window);
orbitControls.enableDamping=true;
  // レンダラーの配置
  document.getElementById("output1").appendChild(renderer.domElement);

  // 背景の設定
  let renderTarget;
  function setBackground() {
    const loader=new THREE.TextureLoader();
    const texture=loader.load(
      "cosmic-starry-sky-stunning-backdrop-a-glorious-with-3d-rendered-galaxy-and-stars_9767831.jpg!w700wp.webp",
      ()=>{
        renderTarget
        =new THREE.WebGLCubeRenderTarget(texture.image.height);
        renderTarget.fromEquirectangularTexture(renderer,texture);
        scene.background=renderTarget.texture;
        render();
      }
    )
  }
  // テクスチャの読み込み
  const textureLoader=new THREE.TextureLoader();
  const testTexture=textureLoader.load("earthmap1k.jpg");
  // 球体の作成
  const SphereGeometry = new THREE.SphereGeometry(10,64,64);
  const SphereMaterial = new THREE.MeshLambertMaterial();
  const sphere =new THREE.Mesh(SphereGeometry,SphereMaterial);
  SphereMaterial.map=testTexture;
  scene.add(sphere);

  //月
  const moontex = textureLoader.load("moonmap1k.jpg");
  const moonGeometry = new THREE.SphereGeometry(2, 64, 64);
  const moonMaterial = new THREE.MeshLambertMaterial();
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMaterial.map = moontex;
  scene.add(moon);

  // モデルの読み込み
  const xwing=new THREE.Group(); // モデルを格納する変数
  let xwingModel;
  let theta = Math.random();
  const orbitRadius = 1; // 地球を中心とする飛行機の軌道半径
  function loadModel() { // モデル読み込み関数の定義
    const loader = new GLTFLoader();
    loader.load(
      "xwing.glb", //モデルのファイル
      (gltf) => { //読み込み終わりに実行する関数
        xwingModel= gltf.scene;//取り出す
        xwingModel.position.set(-11,0,-1);
        xwing.add(xwingModel);
        
        scene.add(xwing);
       
        //render(); // 描画開始
        setBackground();
      }
    );
  }
  loadModel(); // モデル読み込み実行

  // 光源の作成
  const dirLight1 = new THREE.DirectionalLight(0xFFFFFF, 2);
  dirLight1.position.set(3, 6, 8);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xC0C0C0, 2);
  dirLight2.position.set(-3, -6, -8);
  scene.add(dirLight2);

  const ambLight = new THREE.AmbientLight(0x808080, 2);
  scene.add(ambLight);

  let moontheta=0;
  const moonradius=25;
  
  // 描画関数
function render() {
  // xwingの動き
  theta += 0.03; // 飛行機の回転速度
  xwing.position.x = -orbitRadius * Math.cos(theta);
  xwing.position.z = orbitRadius * Math.sin(theta);
  xwing.lookAt(sphere.position); // xwingが常に地球を向く

  moontheta = (moontheta - 0.03) % (2 * Math.PI);
    moon.position.x = sphere.position.x + moonradius * Math.cos(moontheta);
    moon.position.y = 20 * Math.cos(moontheta);
    moon.position.z = sphere.position.z + moonradius * Math.sin(moontheta);
    moon.rotation.y = (moon.rotation.y + 0.07) % (2 * Math.PI);
  // 座標軸の表示
  axes.visible = param.axes;

  // カメラ1の操作（OrbitControls）
  orbitControls.update();

  // 描画
  renderer.render(scene, camera); // メインビュー描画
 

  // 次のフレームでの描画をリクエスト
  requestAnimationFrame(render);
}


  // 描画開始
}

init();