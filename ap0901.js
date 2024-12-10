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
    //follow: false,//追跡
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "axes").name("座標軸");
  //gui.add(param, "follow").name("追跡");

  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);

  // カメラの作成
  const camera = new THREE.PerspectiveCamera(
    50, 3/6, 0.1, 1000);
  camera.position.set(-15,15,-30);
  camera.lookAt(0,0,0);
  camera.aspect = 8/5;
  camera.updateProjectionMatrix();
  // 第2のカメラ
  const camera2 = new THREE.PerspectiveCamera(
    20, 2/10, 0.1, 10);
  //camera2.position.copy(camera2Position);
  camera2.up.set(0,1,0);
  // 第1のレンダラ
  const nameHeight = document.getElementById("output1").clientHeight;
  const renderer = new THREE.WebGLRenderer();
  {
    renderer.setClearColor(0x204060);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(
      0.8 * window.innerWidth,
      0.5 * window.innerWidth);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.zIndex = 1;
    renderer.domElement.style.top = nameHeight;
  }
  // 第2のレンダラ
  const renderer2 = new THREE.WebGLRenderer();
  {
    renderer2.setClearColor(0x207070);
    renderer2.setPixelRatio(window.devicePixelRatio);
    renderer2.setSize(
      0.2 * window.innerWidth,
      0.6 * window.innerWidth);
    renderer2.domElement.style.position = "absolute";
    renderer2.domElement.style.zIndex = 1;
    renderer2.domElement.style.top = nameHeight;
  }
const orbitControls=new OrbitControls(camera,renderer.domElement);
orbitControls.listenToKeyEvents(window);
orbitControls.enableDamping=true;

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
  const SphereGeometry = new THREE.SphereGeometry(10,12,14);
  const SphereMaterial = new THREE.MeshLambertMaterial();
  const sphere =new THREE.Mesh(SphereGeometry,SphereMaterial);
  SphereMaterial.map=testTexture;
  scene.add(sphere);

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

  // レンダラーの配置
  document.getElementById("output1").appendChild(renderer.domElement);
  document.getElementById("output2").appendChild(renderer2.domElement);


  // 描画処理
  // 描画のための変数
  //const camera2Position=new THREE.Vector3();
  // 描画関数
  // function render() {
  //   //xwing の位置と向きの設定
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
  // function render() {
  //   //xwing動き
  //     //xwing.position.x=10*Math.cos(theta);
  //     //xwing.position.z=10*Math.sin(theta);
  //     //xwing.translation.z=-10;//*Math.cos(theta);
  //     theta=(theta + 0.01)%(2 * Math.PI);
  //     xwing.rotateOnWorldAxis(vec,0.1);
  //     //xwingModel.rotateOnAxis(vec,-0.1);
  //     //console.log(theta);
  //   // 飛行機の軌道運動
  //   theta += 0.03; // 飛行機の回転速度
  //   xwing.position.x = -orbitRadius * Math.cos(theta);
  //   xwing.position.z = orbitRadius * Math.sin(theta);
  //   xwing.lookAt(sphere.position); // 飛行機が常に地球を向く


  // sphere.children.forEach((sphere) => {
  //   sphere.rotation.y
  //     = (sphere.rotation.y + 0.01) % (2 * Math.PI);
  //     sphere.position.y=Math.sin(sphere.rotation.y);
  // });
  // //xwingの後方
  // // camera2Position.lerpVectors(xwingTarget, xwingPosition, -10);
  // // camera2Position.y +=2.5;
  // // camera2.position.copy(camera2Position);
  // // camera2.lookAt(xwing.position);//飛行機を見る
  // // camera2.up.set(0,1,0);
  //   // 座標軸の表示
  //   axes.visible = param.axes;
  //   //カメラ
  //   orbitControls.update();
  //   // 描画
  //   renderer.render(scene, camera);
  //   renderer2.render(scene,camera2);
  //   // 次のフレームでの描画要請
  //   requestAnimationFrame(render);
  // }
  // 描画関数
function render() {
  // xwingの動き
  theta += 0.03; // 飛行機の回転速度
  xwing.position.x = -orbitRadius * Math.cos(theta);
  xwing.position.z = orbitRadius * Math.sin(theta);
  xwing.lookAt(sphere.position); // xwingが常に地球を向く

  // xwingの後方にカメラ2を配置
  const offset = new THREE.Vector3(0, 2, -5); // xwing後方オフセット (後方5, 上2)
  const quaternion = new THREE.Quaternion();
  xwing.getWorldQuaternion(quaternion); // xwingの向きを取得
  const camera2Position = offset.applyQuaternion(quaternion).add(xwing.position); // オフセットを適用

  camera2.position.copy(camera2Position); // カメラ2の位置を更新
  camera2.lookAt(xwing.position); // カメラ2がxwingを注視する

  // if (param.follow) {
  //   //xwingの後方
  //   camera2Position.lerpVectors(xwingTarget, xwingPosition, 4);
  //   camera2Position.y += 2.5;
  //   camera.position.copy(cameraPosition);
  //   camera.lookAt(xwing.position);//飛行機を見る
  //   camera.up.set(0,1,0);
  // }

  // 地球の回転
  sphere.rotation.y = (sphere.rotation.y + 0.01) % (2 * Math.PI);

  // 座標軸の表示
  axes.visible = param.axes;

  // カメラ1の操作（OrbitControls）
  orbitControls.update();

  // 描画
  renderer.render(scene, camera); // メインビュー描画
  renderer2.render(scene, camera2); // 飛行機追尾ビュー描画

  // 次のフレームでの描画をリクエスト
  requestAnimationFrame(render);
}


  // 描画開始
}

init();
