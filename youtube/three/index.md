//============================================
// Chapter 1
//============================================

Web GL is complex, we must know maths, matrics, vactors, for a simple cube , we atleast need to write 100+ line of code, and it is very difficult for the developer and user to work with it.
ThreeJS is the solution , it is a library that help us to work with Web GL easily.

Threejs uses the WebGL API, it provide us the simplier API to work with Web GL.
We can create scenes, add objects, camera, lights and many more.

. Scene: A container jaha pe saare objects rehte hain, jaise ek room , jisme saare objects rakhe huye hain.
. Camera: Jaha se hum scene ko dekhte hain.
. Renderer: RenderObject jo screen pr scene ko render karta hain.
. Mesh (Geometry + Material ): Objects which are visible in the scene.
. Orbitcontrols: Helps us to control the scene (move around the scene).

Install threejs::
npm i three

create a canvas tag::

<div id="app">
      <canvas id="webgl"></canvas>
</div>

with this below code , we can generate a cube on the screen.

//=====================================
three/chap02/src/main.js
//=====================================

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



//============================================
// Chapter 2
//============================================

Transformation of Object: Koi bhi 3D object, apne 3D space main teen cheez karta hain.
1. Move
2. Rotate
3. Scale

we the below code can control the object:

cube.position.x = 3;
cube.position.y = 1;
cube.position.z = -2;

cube.position.set(3, 1, -2);
cube.position.set(1, 2, -1);

cube.scale.x = 2;
cube.scale.y = 0.5;
cube.scale.z = 0.5;

cube.scale.set(2,2,2);

cube.rotation.x = Math.PI * 0.25;
cube.rotation.y = Math.PI * 0.25;
cube.rotation.z = Math.PI * 0.25;
cube.rotation.set(Math.PI * 0.25, Math.PI * 0.25, Math.PI * 0.25);


I've used the code in my main.js

//=====================================
three/chap02/src/main.js
//=====================================


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

//=====================================
Chapter 3
//=====================================


Animation: ek continuously moving object, jo time ke saath apna position, rotation, scale change karta hain.


FPS: FPS means Frames Per Second. Iska mtlb hain ki 1 second main kitne frames render honge. Jitna zyada FPS hoga, utna zyada smooth animation hoga.  