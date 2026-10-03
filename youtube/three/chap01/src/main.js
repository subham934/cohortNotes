import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



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

//  material
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// mesh
const cube = new THREE.Mesh(geometry, material);

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

// renderer

// first get the canvas from the document
const canvas = document.getElementById('webgl');

// create a renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});

// size of the renderer
renderer.setSize(size.width, size.height);



const controls = new OrbitControls(camera, renderer.domElement)



window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  
  // camera
  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()

  // renderer
  renderer.setSize(size.width, size.height);
});


// render the scene

function animate() {
  timer.update();
  controls.update()
  const delta = timer.getDelta();
  cube.rotation.y += delta;
  cube.rotation.x += delta;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
