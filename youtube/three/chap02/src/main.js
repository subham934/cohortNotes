import './style.css';
import * as THREE from 'three';

// scene
const scene = new THREE.Scene();

// 3D object - Mesh

// Geometry:
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Material:
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
});

// Mesh:
const cube = new THREE.Mesh(geometry, material);

// cube.position.x = 3;
// cube.position.y = 1;
// cube.position.z = -2;

// cube.position.set(3, 1, -2);
// cube.position.set(1, 2, -1);

// cube.scale.x = 2;
// cube.scale.y = 2;
// cube.scale.z = 1;
// cube.scale.set(2,2,2);

// cube.rotation.x = Math.PI * 0.25;
// cube.rotation.y = Math.PI * 0.25;
// cube.rotation.z = Math.PI * 0.25;
// cube.rotation.set(Math.PI * 0.25, Math.PI * 0.25, Math.PI * 0.25);

// Add mesh to scene:
scene.add(cube);

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.z = 3;

// renderer
const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({
  canvas,
});

// renderer size
renderer.setSize(window.innerWidth, window.innerHeight);

// renderer ko on kardo
renderer.render(scene, camera);
