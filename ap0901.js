//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G384382023 近藤咲梧
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { GUI } from "ili-gui";

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
    50, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(1,2,3);
  camera.lookAt(0,0,0);

  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, innerHeight);
  renderer.setClearColor(0x102040)
  document.getElementById("output").appendChild(renderer.domElement);


  // // 背景の設定
  // let renderTarget;
  // function setBackground() {
  //   const loader=new THREE.TextureLoader();
  //   const texture=loader.load(
  //     "https://img.pikbest.com/wp/202347/cosmic-starry-sky-stunning-backdrop-a-glorious-with-3d-rendered-galaxy-and-stars_9767831.jpg!w700wp",
  //     ()=>{
  //       renderTarget
  //       =new THREE.WebGLCubeRenderTarget(texture.image.height);
  //       renderTarget.fromEquirectangularTexture(renderer,texture);
  //       scene.background=renderTarget.texture;
  //       render();
  //     }
  //   )
  // }
  // テクスチャの読み込み
  const textureLoader=new THREE.TextureLoader();
  const testTexture=textureLoader.load("p110b_050.png");
  // 球体の作成
  const SphereGeometry = new THREE.SphereGeometry(1,24,24);
  const SphereMaterial = new THREE.MeshLambertMaterial();
  const sphere =new THREE.Mesh(SphereGeometry,SphereMaterial);
  SphereMaterial.map=testTexture;
  scene.add(sphere);

  // 自動操縦コースの設定
  // 制御点
  // const controlPoints = [
  //   [0, 0, 0],
  //   [0, 5, 40],
  //   [40, 5, 40],
  //   [40, 10, -20],
  //   [-40, 10, -20],
  //   [-40, 0, 20],
  //   [40, -3, 20],
  //   [40, -3, -40],
  //   [0, 0, -40],
  // ]
  // // コースの補間
  // const p0 = new THREE.Vector3();
  // const p1 = new THREE.Vector3();
  // const course = new THREE.CatmullRomCurve3(
  //   controlPoints.map((p, i) => {
  //     p0.set(...p);
  //     p1.set(...controlPoints[(i + 1) % controlPoints.length]);
  //     return [
  //       (new THREE.Vector3()).copy(p0),
  //       (new THREE.Vector3()).lerpVectors(p0, p1, 1 / 3),
  //       (new THREE.Vector3()).lerpVectors(p0, p1, 2 / 3),
  //     ];
  //   }).flat(), true
  // );


  // 描画処理
  // 描画のための変数
  // const clock = new THREE.Clock();
  // const xwingPosition = new THREE.Vector3();
  // const xwingTarget = new THREE.Vector3();
  // const cameraPosition = new THREE.Vector3();
  // // 描画関数
  // function render() {
    // xwing の位置と向きの設定
  //   const elapsedTime = clock.getElapsedTime() / 30;
  //   course.getPointAt(elapsedTime % 1, xwingPosition);
  //   xwing.position.copy(xwingPosition);
  //   course.getPointAt((elapsedTime + 0.01) % 1, xwingTarget);
  //   xwing.lookAt(xwingTarget);
  // }

  // 光源の作成
  const dirLight1 = new THREE.DirectionalLight(0xFFFFFF, 2);
  dirLight1.position.set(3, 6, 8);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xC0C0C0, 2);
  dirLight2.position.set(-3, -6, -8);
  scene.add(dirLight2);

  const ambLight = new THREE.AmbientLight(0x808080, 2);
  scene.add(ambLight);
  
  // 描画関数
  function render() {
    sphere.children.forEach((sphere) => {
      sphere.rotation.y
        = (sphere.rotation.y + 0.01) % (2 * Math.PI);
        sphere.position.y=Math.sin(sphere.rotation.y);
    });
    // 座標軸の表示
    axes.visible = param.axes;
    // 描画
    renderer.render(scene, camera);
    // 次のフレームでの描画要請
    requestAnimationFrame(render);
  }

  // 描画開始
  render();
}

init();