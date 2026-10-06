import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

const gui = new GUI();

const property = {
  color: '#ff0000',
};

const loadingManager = new THREE.LoadingManager();
// loadingManager.onStart = () => {
//   console.log("Loading Started");
// }

loadingManager.onLoad = () => {
  console.log('All Texture is loaded');
};

// loadingManager.onError = () => {
//   console.log("Loading Error");
// }

const textureLoader = new THREE.TextureLoader(loadingManager);

const texture = textureLoader.load(
  'https://images.unsplash.com/photo-1778534075150-8a5c0636b1b0?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  () => {
    console.log('Texture Loaded');
  },
  () => {
    console.log('Texture Loading');
  },
  () => {
    console.log('Texture Error');
  }
);

const texture2 = textureLoader.load(
  'https://images.unsplash.com/photo-1790619451922-feced14b555c?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
);

const rockTextureColor = textureLoader.load('./texture.jpg');

rockTextureColor.colorSpace = THREE.SRGBColorSpace;

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// scene
const scene = new THREE.Scene();

// const clock = new THREE.Clock();

const timer = new THREE.Timer();

// 3d object - mesh

// geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);
// const geometry = new THREE.SphereGeometry( 15, 32, 16 );
// const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);

// ===================================== Custom Geometry
// const geometry = new THREE.BufferGeometry();

// const count = 50;

// const positionArray = new Float32Array(count * 3 * 3);

// for (let i = 0; i < count * 3 * 3; i++) {
//   positionArray[i] = (Math.random() - 0.5) * 4;
// }

// geometry.setAttribute(
//   'position',
//   new THREE.BufferAttribute(positionArray, 3)
// );
// =====================================

//  material
const material = new THREE.MeshBasicMaterial({
  // color: 0xff0000,
  // wireframe: true,
  // map: texture2,
  map: texture,
});

// mesh
const cube = new THREE.Mesh(geometry, material);

// gui.add(cube.position, 'x').min(-3).max(3).step(0.01).name("Position X")
// gui.add(cube.position, 'y').min(-3).max(3).step(0.01).name("Position Y")
// gui.add(cube.position, 'z').min(-3).max(3).step(0.01).name("Position Z")

// // cube.position.set(2, 1, -1)

// gui.add(cube, 'visible')
// gui.add(material, "wireframe").name("Wireframe")
// // gui.addColor(material, "color").name("Color")
// gui.addColor(property, "color").name("Color").onChange(() => {
//   material.color.set(property.color)
// })

const positionFolder = gui.addFolder('Position');
const rotationFolder = gui.addFolder('Rotation');

positionFolder
  .add(cube.position, 'x')
  .min(-3)
  .max(3)
  .step(0.01)
  .name('Position X');
positionFolder
  .add(cube.position, 'y')
  .min(-3)
  .max(3)
  .step(0.01)
  .name('Position Y');
positionFolder
  .add(cube.position, 'z')
  .min(-3)
  .max(3)
  .step(0.01)
  .name('Position Z');

rotationFolder
  .add(cube.rotation, 'x')
  .min(-3)
  .max(3)
  .step(0.01)
  .name('Rotation X');
rotationFolder
  .add(cube.rotation, 'y')
  .min(-3)
  .max(3)
  .step(0.01)
  .name('Rotation Y');
rotationFolder
  .add(cube.rotation, 'z')
  .min(-3)
  .max(3)
  .step(0.01)
  .name('Rotation Z');

// cube.position.z = -5;
// cube.position.z = -1
// cube.position.set(0,1,1)
// cube.scale.x = 2
// cube.scale.y = 2
// cube.scale.z = 2
// cube.scale.set(2,2,2)

// cube.rotation.x = Math.PI / 4;
// cube.rotation.y = Math.PI / 4;
// cube.rotation.z = Math.PI / 4;
// cube.rotation.set(Math.PI / 3, 0, Math.PI / 4);

// cube.position.z = -3

// add object to the scene
scene.add(cube);

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100
);

// const camera = new THREE.OrthographicCamera(
//   -2,
//    2,
//    2,
//   -2,
//   0.1,
//   100
// );

camera.position.z = 3;
camera.lookAt(0, 0, 0);

// renderer

// first get the canvas from the document
const canvas = document.getElementById('webgl');

// create a renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});

// size of the renderer
renderer.setSize(size.width, size.height);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  // camera
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  // renderer
  renderer.setSize(size.width, size.height);
});

// render the scene

function animate() {
  timer.update();
  controls.update();
  const delta = timer.getDelta();
  // cube.rotation.y += delta;
  // cube.rotation.x += delta;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
