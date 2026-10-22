import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from "lil-gui"


const gui = new GUI()


const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// scene
const scene = new THREE.Scene();

// const clock = new THREE.Clock();
const timer = new THREE.Timer();

// 3D object - Mesh

// Geometry:
const geometry = new THREE.BoxGeometry(1, 1, 1);
// const geometry = new THREE.SphereGeometry( 15, 32, 16 );
// const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
// const geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );

// const geometry = new THREE.BufferGeometry();

// const count = 50;

// // Array of positions
// const positionsArray = new Float32Array(count * 3 * 3);

// // Loop to add random positions
// for (let i = 0; i < count * 3 * 3; i++) {
//   positionsArray[i] = (Math.random() - 0.5) * 10; // our range is -5 to 5 , 3 d space mai.
// }

// geometry.setAttribute(
//   'position',
//   new THREE.BufferAttribute(positionsArray, 3)
// );

// Material:
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  // wireframe: true
});

// Mesh:
const cube = new THREE.Mesh(geometry, material);

gui.add(cube.position, "x").min(-3).max(3).step(0.01).name("Position X")
gui.add(cube.position, "y").min(-3).max(3).step(0.01).name("Position Y")
gui.add(cube.position, "z").min(-3).max(3).step(0.01).name("Position Z")


// Add mesh to scene:
scene.add(cube);

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100
);



camera.position.z = 3;
camera.lookAt(0,0,0);
// renderer
const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({
  canvas,
});

// renderer size
renderer.setSize(size.width, size.height);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;


window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  // update camera
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(size.width, size.height);
});

function animate() {
  timer.update();
  // orbit controls update
  controls.update();
  const delta = timer.getDelta();

  // cube animation
  cube.rotation.x += delta * 0.2;
  cube.rotation.y += delta * 0.2;

  // renderer ko on kardo
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

animate();
