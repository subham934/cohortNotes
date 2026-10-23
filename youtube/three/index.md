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

Ususally its 60 FPS. 

requestAnimationFrame(animation) function hai jo har frame pr call hota hain, it will call the animation function again and again. 
-> This function runs with our system's refresh rate ( Usually 60 FPS).
-> if your system is of 60HZ , then it will call the animation function 60 times per second.


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


function animate() {
    requestAnimationFrame(animate);
    
    // cube animation
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    // renderer ko on kardo
    renderer.render(scene, camera);
}

animate();


here, for cube animation we hve given finite number of rotation value, eg:

cube.rotation.x += 0.01;

but if the user's system is of 120HZ, then it will rotate faster than our system's which is 60HZ. So, to make it independent of the system's refresh rate, we will use the time parameter. 

//======================
three/chap02/src/main.js
//======================

import './style.css';
import * as THREE from 'three';

// scene
const scene = new THREE.Scene();


const clock = new THREE.Clock();

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


function animate() {
  
  const delta = clock.getElapsedTime()

  // cube animation
  cube.rotation.x = delta * 0.2;
  cube.rotation.y = delta * 0.2;
  
  // renderer ko on kardo
  renderer.render(scene, camera);
  
  requestAnimationFrame(animate);
}

animate();



# Three.js — Understanding Clock and Delta

## 1. What is THREE.Clock?

```javascript
const clock = new THREE.Clock();
```

- `THREE.Clock` is a utility provided by Three.js to measure time.
- Think of it as a stopwatch.
- By default, the clock starts automatically when it is created.
- The clock measures time; it does not animate objects by itself.

## 2. What does `clock.getElapsedTime()` do?

In our code, we have:

```javascript
const delta = clock.getElapsedTime();
```

- `getElapsedTime()` returns the total time in seconds since the clock started.
- We store this value in a variable called `delta`.
- The value of `delta` increases as time passes.
- Example: 1 second, 2 seconds, 3 seconds, etc.

**Important:** In our code, `delta` represents total elapsed time, not the time difference between two frames.

Example:

| Time Passed | Value of `delta` |
|---|---:|
| 1 second | 1.0 |
| 2 seconds | 2.0 |
| 3 seconds | 3.0 |
| 4 seconds | 4.0 |
| 5 seconds | 5.0 |

These are illustrative values; actual readings may contain decimals.

## 3. How does `delta` rotate the cube?

Our code:

```javascript
cube.rotation.x = delta * 0.2;
cube.rotation.y = delta * 0.2;
```

- `delta` represents the total time passed.
- `0.2` controls the rotation speed in radians per second.
- `cube.rotation.x` controls rotation around the X-axis.
- `cube.rotation.y` controls rotation around the Y-axis.

Example:

| Value of `delta` | Rotation Angle (`delta × 0.2`) |
|---|---:|
| 1 second | 0.2 radians |
| 2 seconds | 0.4 radians |
| 3 seconds | 0.6 radians |
| 5 seconds | 1.0 radian |

As `delta` increases, the rotation angle increases.

**Does the cube become faster over time?**

No. The rotational speed remains constant because the angle increases linearly with time. Every additional second adds approximately 0.2 radians to the rotation angle.

The angle changes, but the speed remains constant.

## 4. What is the role of `requestAnimationFrame()`?

```javascript
function animate() {
  const delta = clock.getElapsedTime();

  cube.rotation.x = delta * 0.2;
  cube.rotation.y = delta * 0.2;

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

animate();
```

The animation works as follows:

1. `animate()` is called initially to start the animation.
2. `getElapsedTime()` reads the total elapsed time and stores it in `delta`.
3. The cube's rotation angles are calculated using `delta`.
4. `renderer.render(scene, camera)` draws the updated scene.
5. `requestAnimationFrame(animate)` asks the browser to schedule `animate()` again for a future frame.

This process repeats continuously.

The browser controls frame scheduling. On a 60 Hz display, the callback may run approximately 60 times per second under suitable conditions.

The clock measures time; it does not calculate or control the number of frames.

## 5. Why does the cube maintain a constant speed?

Our code uses:

```javascript
cube.rotation.y = delta * 0.2;
```

This calculates the current rotation directly from total elapsed time.

For example:

- At 1 second, the angle is 0.2 radians.
- At 2 seconds, the angle is 0.4 radians.
- At 3 seconds, the angle is 0.6 radians.

Every additional second adds 0.2 radians to the angle.

Even if the frame rate changes, the rotation angle at the same elapsed time remains approximately the same.

For example, at 60 FPS, the browser may produce approximately 60 frames per second. At 120 FPS, it may produce approximately 120 frames per second.

The higher frame rate gives us more frequent visual updates, but our time-based formula keeps the rotational speed approximately constant.

## 6. Key Takeaways

- `THREE.Clock` measures time.
- `clock.getElapsedTime()` returns the total time since the clock started.
- `delta` stores that total elapsed time in our code.
- The value of `delta` increases as time passes.
- `delta * 0.2` calculates the current rotation angle.
- The rotation angle increases, but the rotational speed remains constant.
- `requestAnimationFrame()` schedules the next animation callback.
- The browser controls the frame rate; the clock does not.
- Using elapsed time allows us to create time-based animations instead of relying on a fixed rotation increment per frame.



ThreeJS says not to use clock , instead use timer for that we use ::

const timer = new THREE.Timer()

//======================
three/chap02/src/main.js
//======================



import './style.css';
import * as THREE from 'three';

// scene
const scene = new THREE.Scene();


// const clock = new THREE.Clock();
const timer = new THREE.Timer()

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


function animate() {
  timer.update()
  const delta = timer.getDelta()

  // cube animation
  cube.rotation.x += delta * 0.2;
  cube.rotation.y += delta * 0.2;
  
  // renderer ko on kardo
  renderer.render(scene, camera);
  
  requestAnimationFrame(animate);
}

animate();



# Three.js — Understanding Timer, Delta and Animation

## 1. Why are we using THREE.Timer instead of THREE.Clock?

In newer Three.js versions, `THREE.Clock` is deprecated, and `THREE.Timer` is the recommended alternative.

We create a timer using:

```javascript
const timer = new THREE.Timer();
```

Think of `THREE.Timer` as a stopwatch that helps us measure time for animations.

- It keeps track of time.
- We can use it to calculate how much time has passed between animation updates.
- We use that time information to control the movement or rotation of 3D objects.

**Important:** The timer measures time. It does not rotate the cube by itself.

## 2. What does `timer.update()` do?

Inside our animation function, we have:

```javascript
timer.update();
```

This updates the timer's time measurement.

We call it inside `animate()` because we want the timer to update as the animation loop runs.

The next line is:

```javascript
const delta = timer.getDelta();
```

`getDelta()` returns the time in seconds since the previous delta reading.

For example, suppose approximately 16 milliseconds have passed between two readings:

```javascript
delta = 0.016;
```

On another frame, the time difference might be:

```javascript
delta = 0.017;
```

These are illustrative values. The actual delta depends on how much time passes between updates.

**Remember:** In this code, `delta` is the time difference between readings, not the total time since the animation started.

## 3. How does delta rotate the cube?

Our code:

```javascript
cube.rotation.x += delta * 0.2;
cube.rotation.y += delta * 0.2;
```

Let's understand each part.

- `delta` represents the time elapsed since the previous delta reading.
- `0.2` represents the rotation speed in radians per second.
- `cube.rotation.x` controls rotation around the X-axis.
- `cube.rotation.y` controls rotation around the Y-axis.
- `+=` adds the new rotation increment to the existing rotation.

### Example

Suppose:

```javascript
delta = 0.016;
```

The rotation increment is:

```javascript
delta * 0.2
= 0.016 * 0.2
= 0.0032; // radians
```

Therefore, the cube's rotation increases by approximately `0.0032` radians during that frame.

On the next frame, another delta value is measured, and another rotation increment is added.

Over many frames, these small increments accumulate, making the cube rotate continuously.

## 4. Why do we use `+=` instead of `=`?

Compare these two statements:

```javascript
cube.rotation.y = delta * 0.2;
```

```javascript
cube.rotation.y += delta * 0.2;
```

### Using `=`

This replaces the existing rotation with the calculated value.

### Using `+=`

This adds the calculated rotation increment to the existing rotation.

In our current code, we use `+=` because `delta` represents only the time elapsed since the previous reading. We want to add the rotation for that time interval to the cube's existing rotation.

## 5. How does delta help maintain consistent rotation speed?

Suppose the display is running at approximately 60 FPS.

Each frame takes around:

```javascript
1 / 60 = 0.0167 seconds;
```

The rotation increment per frame is approximately:

```javascript
0.0167 * 0.2 = 0.00334 radians;
```

Now suppose the display runs at 120 FPS.

Each frame takes around:

```javascript
1 / 120 = 0.0083 seconds;
```

The rotation increment per frame becomes approximately:

```javascript
0.0083 * 0.2 = 0.00166 radians;
```

At 120 FPS, the cube rotates by a smaller amount per frame, but there are more frames per second.

As a result, the cube's rotational speed remains approximately the same across different frame rates, provided the animation loop keeps running normally.

## 6. What is the role of requestAnimationFrame()?

Our animation function ends with:

```javascript
requestAnimationFrame(animate);
```

This asks the browser to schedule the `animate()` function for a future animation frame.

The animation loop works like this:

1. `animate()` starts.
2. `timer.update()` updates the timer's time measurement.
3. `timer.getDelta()` obtains the time since the previous delta reading.
4. The cube's rotation is updated using delta.
5. `renderer.render(scene, camera)` draws the updated scene.
6. `requestAnimationFrame(animate)` schedules the next frame.

This process repeats continuously.

The browser controls frame scheduling. The timer measures time; it does not decide how many frames are rendered per second.

## 7. Complete Animation Function

```javascript
function animate() {
  // Update the timer's time measurement
  timer.update();

  // Get the time elapsed since the previous delta reading
  const delta = timer.getDelta();

  // Rotate the cube according to the elapsed time
  cube.rotation.x += delta * 0.2;
  cube.rotation.y += delta * 0.2;

  // Render the updated scene
  renderer.render(scene, camera);

  // Schedule the next animation frame
  requestAnimationFrame(animate);
}

animate();
```

## 8. Key Takeaways

- `THREE.Timer` measures time for our animation.
- `timer.update()` updates the timer's time measurement.
- `timer.getDelta()` returns the time since the previous delta reading, in seconds.
- `delta * 0.2` calculates the rotation increment for the current frame.
- `+=` adds that increment to the existing rotation.
- Small rotation increments accumulate over many frames, creating continuous animation.
- `renderer.render()` draws the updated scene.
- `requestAnimationFrame()` schedules the next animation callback.
- Delta-based animation helps maintain a consistent rotational speed across different frame rates.

**The main concept:** The timer measures time, delta tells us how much time has passed between readings, and we use that time to calculate how much the cube should rotate.



//================================
Chapter 4 (Camera)
//================================

There are two types of camera,
1. PerspectiveCamera: It mimics human vision and creates realistic depth perception. Objects appear smaller when they are further away.
PerspectiveCamera(fov, aspect, near, far)
  fov: Field of view (vertical angle of the viewing frustum)
  aspect: Aspect ratio (width / height)
  near: Near clipping plane
  far: Far clipping plane
2. OrthographicCamera: Objects maintain their size regardless of their distance from the camera. It is often used in 2D games and technical drawings.
OrthographicCamera(left, right, top, bottom, near, far)


const camera = new THREE.OrthographicCamera(
    -2, 2, 2, -2, 0.1, 100
);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

There are some other changes thats need to be done, like if I try to change the size of my screen , the position of the cube dont change, the cube looks same but its get cut off from top & bottom or left & right, so we need to change the aspect ratio of the camera.


import './style.css';
import * as THREE from 'three';


const size = {
  width: window.innerWidth,
  height: window.innerHeight
}

// scene
const scene = new THREE.Scene();


// const clock = new THREE.Clock();
const timer = new THREE.Timer()

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
  size.width / size.height,
  0.1,
  100
);

// const camera = new THREE.OrthographicCamera(
//     -2, 2, 2, -2, 0.1, 100
// );

camera.position.z = 3;

// renderer
const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({
  canvas,
});

// renderer size
renderer.setSize(size.width, size.height);

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
  timer.update()
  const delta = timer.getDelta()

  // cube animation
  cube.rotation.x += delta * 0.2;
  cube.rotation.y += delta * 0.2;
  
  // renderer ko on kardo
  renderer.render(scene, camera);
  
  requestAnimationFrame(animate);
}

animate();




### Resize Event

```js
window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  renderer.setSize(size.width, size.height);
});
```

- `window.addEventListener('resize', ...)`: Runs the callback whenever the browser window is resized.
- `size.width` and `size.height`: Update the window's current width and height.
- `camera.aspect`: Updates the camera's aspect ratio to match the new dimensions.
- `camera.updateProjectionMatrix()`: Recalculates the camera's projection so the scene displays correctly.
- `renderer.setSize()`: Resizes the canvas to match the new window dimensions.

**In short:** This event makes the Three.js scene responsive when the browser window is resized.



OrbitControl: It allows us to control the camera with the mouse. It is a class that we can use to control the camera with the mouse.

How to use:

```js

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
  size.width / size.height,
  0.1,
  100
);

// const camera = new THREE.OrthographicCamera(
//     -2, 2, 2, -2, 0.1, 100
// );

camera.position.z = 3;
// we are telling camera that look at this cube position no matter where the camera moves, it will always look at the cube
camera.lookAt(0,0,0);


// renderer
const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({
  canvas,
});

// renderer size
renderer.setSize(size.width, size.height);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// It gives a smooth transition when we stop controlling, we can check similar effects using orbit-controls
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




```

//================================
Chapter 5 (Geometry)
//================================

There are multiple geometries that can be used to create 3D objects. Some of the most common geometries are:

- BoxGeometry: Creates a cube
- SphereGeometry: Creates a sphere
- PlaneGeometry: Creates a plane
- CircleGeometry: Creates a circle
- ConeGeometry: Creates a cone
- CylinderGeometry: Creates a cylinder
- TorusGeometry: Creates a torus

How to use:

```js

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

// 3D object - Mesh

// Geometry:
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const geometry = new THREE.SphereGeometry( 15, 32, 16 );
// const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );

// Material:
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true
});

// Mesh:
const cube = new THREE.Mesh(geometry, material);

// Add mesh to scene:
scene.add(cube);

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100
);

// const camera = new THREE.OrthographicCamera(
//     -2, 2, 2, -2, 0.1, 100
// );
// camera position and lookAt function is used to set the camera position and the point it is looking at. In this case, we are setting the camera position to (0, 0, 3) and making it look at the origin (0, 0, 0).
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
// It gives a smooth transition when we stop controlling, we can check similar effects using orbit-controls
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
  // cube.rotation.x += delta * 0.2;
  // cube.rotation.y += delta * 0.2;

  // renderer ko on kardo
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

animate();

```


// To create our own custom geometry , we need to do the following things::

```js

const geometry = new THREE.BufferGeometry();

const count = 50;

// Array of positions
const positionsArray = new Float32Array(count * 3 * 3);

// Loop to add random positions
for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 10; // our range is -5 to 5 , 3 d space mai.
}

geometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positionsArray, 3)
);
```


the entire code is as below::

```js

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

// 3D object - Mesh

// Geometry:
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const geometry = new THREE.SphereGeometry( 15, 32, 16 );
// const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
// const geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );

const geometry = new THREE.BufferGeometry();

const count = 50;

// Array of positions
const positionsArray = new Float32Array(count * 3 * 3);

// Loop to add random positions
for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 10; // our range is -5 to 5 , 3 d space mai.
}

geometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positionsArray, 3)
);

// Material:
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true
});

// Mesh:
const cube = new THREE.Mesh(geometry, material);

// Add mesh to scene:
scene.add(cube);

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100
);

// const camera = new THREE.OrthographicCamera(
//     -2, 2, 2, -2, 0.1, 100
// );

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
  // cube.rotation.x += delta * 0.2;
  // cube.rotation.y += delta * 0.2;

  // renderer ko on kardo
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

animate();
```


# Three.js — Custom Geometry Using BufferGeometry

### 1. Create Geometry
```js
const geometry = new THREE.BufferGeometry();
```
- Creates an empty geometry.
- We manually define its vertices instead of using built-in geometries like `BoxGeometry`.

### 2. Define Triangle Count
```js
const count = 50;
```
- We want to create 50 triangles.
- Each triangle has 3 vertices.
- Each vertex has 3 coordinates: `x`, `y`, and `z`.

**Total coordinates = 50 × 3 × 3 = 450**

### 3. Create the Positions Array
```js
const positionsArray = new Float32Array(count * 3 * 3);
```
- Creates an array containing 450 floating-point numbers.
- `Float32Array` stores numerical data efficiently for Three.js and the GPU.
- Initially, all elements are `0`.

### 4. Generate Random Positions
```js
for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 10;
}
```
- `i = 0`: Starts at the first array index.
- `i < 450`: Runs until all 450 elements are filled.
- `i++`: Increases the index by 1 after each iteration.
- `positionsArray[i]`: Stores a random number at the current index.

**Random number formula:**
```js
(Math.random() - 0.5) * 10
```
- `Math.random()` generates a value from `0` (inclusive) to `1` (exclusive).
- Subtracting `0.5` shifts the range around zero.
- Multiplying by `10` produces values from `-5` (inclusive) to `5` (exclusive).

This gives each coordinate a random position in 3D space.

### 5. Assign Positions to Geometry
```js
geometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positionsArray, 3)
);
```
- `'position'`: Tells Three.js that this attribute contains vertex coordinates.
- `positionsArray`: Supplies the 450 coordinate values.
- `3`: Specifies that each vertex has 3 components: `x`, `y`, and `z`.

### 6. How Triangles Are Formed

Three.js groups the array values in two stages:

1. Every 3 numbers → 1 vertex (`x`, `y`, `z`).
2. Every 3 vertices → 1 triangle.

Example:
```js
[
  1, 2, 3,  // Vertex 1
  4, 5, 6,  // Vertex 2
  7, 8, 9   // Vertex 3
]
```
These 9 numbers represent 3 vertices, which form 1 triangle.

Therefore:
- 450 numbers ÷ 3 = 150 vertices.
- 150 vertices ÷ 3 = 50 triangles.

### Complete Flow

`BufferGeometry` → Create array → Generate random coordinates → Assign the `position` attribute → Three.js renders triangles using consecutive groups of 3 vertices.

**Important:** The loop generates coordinates; it does not create triangles itself. The vertices' order determines which three vertices form each triangle. To display the geometry, create a mesh with a material and add it to the scene.




//==================================
Chapter 6 - Debug UI
//==================================

// Bina code ko chere , hum debug kar sakte hain apne UI ko, it is like remote console that controls our UI.

npm i lil-gui


The changes we have made are as below::
```js

import GUI from "lil-gui"
const gui = new GUI()



gui.add(cube.position, "x").min(-3).max(3).step(0.01).name("Position X")
gui.add(cube.position, "y").min(-3).max(3).step(0.01).name("Position Y")
gui.add(cube.position, "z").min(-3).max(3).step(0.01).name("Position Z")


```


with this above code, we can control the position of the cube using the GUI. We can change the position of the cube in real time by moving the sliders in the GUI.

```js 
 cube.position.set(0.7, -0.6, 1);

```
with this above code, we can set the initial position of the cube. The GUI will still work and we can change the position of the cube in real time by moving the sliders in the GUI.


```js 
gui.add(cube, "visible").name("Visible")

```
this above code will add a checkbox in the GUI, which will allow us to toggle the visibility of the cube. If we uncheck the checkbox, the cube will disappear from the scene. If we check the checkbox, the cube will reappear in the scene.


```js 
gui.add(material, "wireframe").name("Wireframe")

```
this above code will add a checkbox in the GUI, which will allow us to toggle the wireframe mode of the cube. If we check the checkbox, the cube will be rendered in wireframe mode. If we uncheck the checkbox, the cube will be rendered in solid mode.



```js 

const property = {
  color: "#ff0000",
}

gui.addColor(property, "color").onChange(() => {
  material.color.set(property.color)
}).name("Color")

```
Iss code main pehle maine ak object banaya, kyunki GUI ke liye humein ek object chahiye hota hain, jismein hum apne properties ko define karte hain. Yahan maine ek property banayi hain "color" jismein initial value "#ff0000" (red) set kiya hain. Phir jab hum GUI ke through color change karte hain, to hum onChange event ke through material.color.set() function ko call karte hain, jismein hum property.color ko pass karte hain. Isse humare cube ka color change ho jaata hain jo color humne select kiya hain.



```js 

const positionFolder = gui.addFolder("Position")
positionFolder.add(cube.position, "x").min(-3).max(3).step(0.1).name("Position X")
positionFolder.add(cube.position, "y").min(-3).max(3).step(0.1).name("Position Y")
positionFolder.add(cube.position, "z").min(-3).max(3).step(0.1).name("Position Z")

const rotationFolder = gui.addFolder("Rotation")
rotationFolder.add(cube.rotation, "x").min(-Math.PI).max(Math.PI).step(0.01).name("Rotation X")
rotationFolder.add(cube.rotation, "y").min(-Math.PI).max(Math.PI).step(0.01).name("Rotation Y")
rotationFolder.add(cube.rotation, "z").min(-Math.PI).max(Math.PI).step(0.01).name("Rotation Z")

const materialFolder = gui.addFolder("Material")
materialFolder.add(cube, "visible").name("Visible")
materialFolder.add(material, "wireframe").name("Wireframe")
materialFolder.addColor(property, "color").onChange(() => {
  material.color.set(property.color)
}).name("Color")

```

everything is organized in folders, so we can easily find the properties we want to change. We have three folders, Position, Rotation and Material. Each folder contains the properties related to that folder. For example, the Position folder contains the properties related to the position of the cube, the Rotation folder contains the properties related to the rotation of the cube and the Material folder contains the properties related to the material of the cube.


The final code is as below::

```js

import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from "lil-gui"


const gui = new GUI()

const property = {
  color: "#ff0000",
}

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


// Material:
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  // wireframe: true
});

// Mesh:
const cube = new THREE.Mesh(geometry, material);

// gui.add(cube.position, "x").min(-3).max(3).step(0.1).name("Position X")
// gui.add(cube.position, "y").min(-3).max(3).step(0.1).name("Position Y")
// gui.add(cube.position, "z").min(-3).max(3).step(0.1).name("Position Z")


// gui.add(cube, "visible").name("Visible")
// gui.add(material, "wireframe").name("Wireframe")
// gui.addColor(property, "color").onChange(() => {
//   material.color.set(property.color)
// }).name("Color")


const positionFolder = gui.addFolder("Position")
positionFolder.add(cube.position, "x").min(-3).max(3).step(0.1).name("Position X")
positionFolder.add(cube.position, "y").min(-3).max(3).step(0.1).name("Position Y")
positionFolder.add(cube.position, "z").min(-3).max(3).step(0.1).name("Position Z")

const rotationFolder = gui.addFolder("Rotation")
rotationFolder.add(cube.rotation, "x").min(-Math.PI).max(Math.PI).step(0.01).name("Rotation X")
rotationFolder.add(cube.rotation, "y").min(-Math.PI).max(Math.PI).step(0.01).name("Rotation Y")
rotationFolder.add(cube.rotation, "z").min(-Math.PI).max(Math.PI).step(0.01).name("Rotation Z")

const materialFolder = gui.addFolder("Material")
materialFolder.add(cube, "visible").name("Visible")
materialFolder.add(material, "wireframe").name("Wireframe")
materialFolder.addColor(property, "color").onChange(() => {
  material.color.set(property.color)
}).name("Color")


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


```

//==================================
Chapter 7 - Textures
//==================================
Texture is wrapper around geometry, it is like a skin that we can put on the geometry to make it look more realistic. It is an image that we can apply to the surface of a 3D object. It can be used to add color, patterns, and details to the surface of a 3D object. It can also be used to create special effects such as bump mapping, normal mapping, and displacement mapping.


There are different types of textures that we can use in Three.js, some of them are:

1. Color Texture: It is a texture that is used to add color to the surface of a 3D object. It is an image that is applied to the surface of a 3D object to give it color.
2. Metalness Texture: It is a texture that is used to add metalness to the surface of a 3D object. It is an image that is applied to the surface of a 3D object to give it metalness.
3. Roughness Texture: It is a texture that is used to add roughness to the surface of a 3D object. It is an image that is applied to the surface of a 3D object to give it roughness.
4. Normal Texture: It is a texture that is used to add normal mapping to the surface of a 3D object. It is an image that is applied to the surface of a 3D object to give it normal mapping.
5. Displacement Texture: It is a texture that is used to add displacement mapping to the surface of a 3D object. It is an image that is applied to the surface of a 3D object to give it displacement mapping.
6. Ambient Occlusion Texture: It is a texture that is used to add ambient occlusion to the surface of a 3D object. It is an image that is applied to the surface of a 3D object to give it ambient occlusion.


How to apply textures:: Texture ko load karna padega, threejs humko ak textureLoader karke ek cheez deta hain, textureLoader main URL pass karte hain and ye humko ak texture object return karta hain, jisko hum material main pass karte hain. 

```js

const textureLoader = new THREE.TextureLoader();

const texture = textureLoader.load("https://images.unsplash.com/photo-1597295014940-4145b62fdf41?q=80&w=1375&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D");

// Material:
const material = new THREE.MeshBasicMaterial({
  // color: 0xff0000,
  // wireframe: true,
  map: texture,
});

```
=> with this above code, we can apply the texture to the cube. The texture will be applied to the surface of the cube and it will look more realistic. We can also use different types of textures to create different effects on the surface of the cube.



```js
const texture = textureLoader.load("https://images.unsplash.com/photo-1597295014940-4145b62fdf41?q=80&w=1375&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", () => {
  console.log("Texture loaded successfully");
}, ()=>{
  console.log("Texture loading in progress...");
}, (error) => {
  console.error("Error loading texture:", error);
});

```

textureLoader.load() function takes four arguments:
1. URL of the texture image.
2. onLoad callback function: This function is called when the texture is loaded successfully.
3. onProgress callback function: This function is called while the texture is loading.  
4. onError callback function: This function is called if there is an error while loading the texture.



// if we want to load a different type of texture, we can use the following code:
```js
const texture2 = textureLoader.load("https://images.unsplash.com/photo-1499195333224-3ce974eecb47?q=80&w=1051&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", () => {
  console.log("Texture loaded successfully");
}, ()=>{
  console.log("Texture loading in progress...");
}, (error) => {
  console.error("Error loading texture:", error);
});


const material = new THREE.MeshBasicMaterial({
  // color: 0xff0000,
  // wireframe: true,
  // map: texture,
  map: texture2,
});


```
=> with the help of one textureLoader, we can load multiple textures and apply them


-> we have 6 different types of textures, to load all of them onto the cube we will need 6 different images. we need to load all the textures using the textureLoader and then apply them to the material. So, to load all the textures, use the onLoad, onProgress and onError callbacks, which is tiring, we can use the following code:

```js
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log("Loading started");
};

loadingManager.onLoad = () => {
  console.log("All textures loaded successfully");
};

loadingManager.onError = (url) => {
  console.error(`Error loading: ${url}`);
};

const textureLoader = new THREE.TextureLoader(loadingManager);


const texture = textureLoader.load("https://images.unsplash.com/photo-1597295014940-4145b62fdf41?q=80&w=1375&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D");

// Material:
const material = new THREE.MeshBasicMaterial({
  // color: 0xff0000,
  // wireframe: true,
  map: texture,
});

```
=> check out console, it will show the loading status of the texture. It will show "Loading started" when the loading starts, "All textures loaded successfully" when all the textures are loaded successfully and "Error loading: URL" if there is an error while loading the texture.


To find texture images, we can use the following websites:
1. https://polyhaven.com/ on top we'll see textures, click on it and we'll see a lot of textures, we can download them for free. As of now, i'll just download the diffuse texture, which is the color texture. The other textures are optional, we can use them if we want to create more realistic materials. For now, i'll just use the diffuse texture.

download the texture and put it in the public folder of our project. Now, we can use the texture in our code. The path to the texture will be relative to the public folder. So, if we put the texture in the public folder, we can use it like this:






```js
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log("Loading started");
};

loadingManager.onLoad = () => {
  console.log("All textures loaded successfully");
};

loadingManager.onError = (url) => {
  console.error(`Error loading: ${url}`);
};

const textureLoader = new THREE.TextureLoader(loadingManager);


const rockTextureColor = textureLoader.load("./texture.jpg")

//this is done to make sure that the texture is displayed correctly on the screen, as the default color space is linear, which can cause the texture to look washed out or too dark. By setting the color space to sRGB, we ensure that the colors are displayed correctly and look more natural.
rockTextureColor.colorSpace = THREE.SRGBColorSpace


// Material:
const material = new THREE.MeshBasicMaterial({
  // color: 0xff0000,
  // wireframe: true,
  map: rockTextureColor,
});



```

use all the textures that we have downloaded from polyhaven.com, and apply them to the cube by self.


=> To repeat the texture on the cube, we can use the following code:
```js

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log("Loading started");
};

loadingManager.onLoad = () => {
  console.log("All textures loaded successfully");
};

loadingManager.onError = (url) => {
  console.error(`Error loading: ${url}`);
};

const textureLoader = new THREE.TextureLoader(loadingManager);


const texture = textureLoader.load(
  'https://images.unsplash.com/photo-1597295014940-4145b62fdf41?q=80&w=1375&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D'
);
// here, we said to repeat the texture 3 times in the x direction and 2 times in the y direction. It will not repeat the texture by default, so we need to set the wrapS and wrapT properties to THREE.RepeatWrapping. This will make the texture repeat in both directions.
texture.repeat.x = 3;
texture.repeat.y = 2;
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
// MirroredRepeatWrapping will make the texture repeat in a mirrored way, so that the texture will be flipped every time it repeats. This can be useful for creating seamless textures.
// texture.wrapT = THREE.MirroredRepeatWrapping;
// texture.wrapS = THREE.MirroredRepeatWrapping;

// texture.offset.x = 0.5; and texture.offset.y = 0.5 // this will offset the texture by 0.5 in the x and y direction, so that the texture will start from the middle of the texture image. This can be useful for creating seamless textures.
texture.offset.x = 0.5;
texture.offset.y = 0.5;

const rockTextureColor = textureLoader.load("./texture.jpg")

//this is done to make sure that the texture is displayed correctly on the screen, as the default color space is linear, which can cause the texture to look washed out or too dark. By setting the color space to sRGB, we ensure that the colors are displayed correctly and look more natural.
rockTextureColor.colorSpace = THREE.SRGBColorSpace
texture.colorSpace = THREE.SRGBColorSpace


// Material:
const material = new THREE.MeshBasicMaterial({
  // color: 0xff0000,
  // wireframe: true,
  map: texture,
});



```

Filtering: The pixels of texture dont match with the pixels of the geometry, so we need to filter the texture to make it look better. There are two types of filtering:
1. Linear Filtering: It is the default filtering method, it will make the texture look smooth, but it will also make the texture look blurry when we zoom in. It is good for textures that are not too detailed.
2. Nearest Filtering: It will make the texture look pixelated, but it will also make the texture look sharp when we zoom in. It is good for textures that are very detailed.

Minification: It is the process of reducing the size of the texture when it is far away from the camera. It is done to improve performance, as it will reduce the number of pixels that need to be rendered. There are two types of minification:
1. Linear Minification: It is the default minification method, it will make the texture look smooth, but it will also make the texture look blurry when we zoom out. It is good for textures that are not too detailed.
2. Nearest Minification: It will make the texture look pixelated, but it will also make the texture look sharp when we zoom out. It is good for textures that are very detailed.

Magnification: It is the process of increasing the size of the texture when it is close to the camera. It is done to improve performance, as it will reduce the number of pixels that need to be rendered. There are two types of magnification:
1. Linear Magnification: It is the default magnification method, it will make the texture look smooth, but it will also make the texture look blurry when we zoom in. It is good for textures that are not too detailed.
2. Nearest Magnification: It will make the texture look pixelated, but it will also make the texture look sharp when we zoom in. It is good for textures that are very detailed.

```js
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.NearestFilter;
```



The entire code is as below::

```js
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

const gui = new GUI();

const property = {
  color: '#ff0000',
};

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log('Loading started');
};

loadingManager.onLoad = () => {
  console.log('All textures loaded successfully');
};

loadingManager.onError = (url) => {
  console.error(`Error loading: ${url}`);
};

const textureLoader = new THREE.TextureLoader(loadingManager);

// const texture = textureLoader.load("https://images.unsplash.com/photo-1597295014940-4145b62fdf41?q=80&w=1375&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", () => {
//   console.log("Texture loaded successfully");
// }, ()=>{
//   console.log("Texture loading in progress...");
// }, (error) => {
//   console.error("Error loading texture:", error);
// });

// const texture2 = textureLoader.load("https://images.unsplash.com/photo-1499195333224-3ce974eecb47?q=80&w=1051&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D", () => {
//   console.log("Texture loaded successfully");
// }, ()=>{
//   console.log("Texture loading in progress...");
// }, (error) => {
//   console.error("Error loading texture:", error);
// });

const texture = textureLoader.load(
  'https://images.unsplash.com/photo-1597295014940-4145b62fdf41?q=80&w=1375&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D'
);



// texture.repeat.x = 3;
// texture.repeat.y = 2;
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;
// // texture.wrapT = THREE.MirroredRepeatWrapping;
// // texture.wrapS = THREE.MirroredRepeatWrapping;
// texture.offset.x = 0.5;
// texture.offset.y = 0.5;

texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.NearestFilter;

const rockTextureColor = textureLoader.load('./texture.jpg');

//this is done to make sure that the texture is displayed correctly on the screen, as the default color space is linear, which can cause the texture to look washed out or too dark. By setting the color space to sRGB, we ensure that the colors are displayed correctly and look more natural.
rockTextureColor.colorSpace = THREE.SRGBColorSpace;
texture.colorSpace = THREE.SRGBColorSpace;

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

// Material:
const material = new THREE.MeshBasicMaterial({
  // color: 0xff0000,
  // wireframe: true,
  // map: texture,
  map: texture,
});

// Mesh:
const cube = new THREE.Mesh(geometry, material);

// gui.add(cube.position, "x").min(-3).max(3).step(0.1).name("Position X")
// gui.add(cube.position, "y").min(-3).max(3).step(0.1).name("Position Y")
// gui.add(cube.position, "z").min(-3).max(3).step(0.1).name("Position Z")

// gui.add(cube, "visible").name("Visible")
// gui.add(material, "wireframe").name("Wireframe")
// gui.addColor(property, "color").onChange(() => {
//   material.color.set(property.color)
// }).name("Color")

const positionFolder = gui.addFolder('Position');
positionFolder
  .add(cube.position, 'x')
  .min(-3)
  .max(3)
  .step(0.1)
  .name('Position X');
positionFolder
  .add(cube.position, 'y')
  .min(-3)
  .max(3)
  .step(0.1)
  .name('Position Y');
positionFolder
  .add(cube.position, 'z')
  .min(-3)
  .max(3)
  .step(0.1)
  .name('Position Z');

const rotationFolder = gui.addFolder('Rotation');
rotationFolder
  .add(cube.rotation, 'x')
  .min(-Math.PI)
  .max(Math.PI)
  .step(0.01)
  .name('Rotation X');
rotationFolder
  .add(cube.rotation, 'y')
  .min(-Math.PI)
  .max(Math.PI)
  .step(0.01)
  .name('Rotation Y');
rotationFolder
  .add(cube.rotation, 'z')
  .min(-Math.PI)
  .max(Math.PI)
  .step(0.01)
  .name('Rotation Z');

const materialFolder = gui.addFolder('Material');
materialFolder.add(cube, 'visible').name('Visible');
materialFolder.add(material, 'wireframe').name('Wireframe');
materialFolder
  .addColor(property, 'color')
  .onChange(() => {
    material.color.set(property.color);
  })
  .name('Color');

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
camera.lookAt(0, 0, 0);
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

```
Mipmapping: It is a technique used to improve the performance and quality of textures when they are viewed at a distance. It works by creating multiple versions of the texture at different resolutions, and using the appropriate version based on the distance from the camera. This reduces aliasing and improves performance, as lower resolution textures require less memory and processing power.

Texture Optimization: It is important to optimize textures for performance. Large textures can slow down rendering and increase memory usage. Here are some tips for optimizing textures:
1. Use compressed texture formats (like JPEG or PNG) to reduce file size.
2. Keep the size of textures as small as possible while maintaining quality. keep it at power of 2 (like 256x256, 512x512, 1024x1024, etc.) for better performance.



//==================================
Chapter 8 - Materials
//==================================


till now, we have only seen MeshBasicMaterial, which is a material that does not react to light. It is a simple material that is used for basic rendering. It is not affected by lights in the scene, and it does not cast or receive shadows. It is useful for creating simple objects that do not require lighting effects.


type `material` on docs and read it.

MeshBasicMaterial
MeshDepthMaterial
MeshDistanceMaterial
MeshLembertMaterial
MeshMatCapMaterial
MeshStandardMaterial
ShaderMaterial

go to google and type `matcap textures`, select a texture, download it and put it in the public folder of your project. Now, we can use the texture in our code. The path to the texture will be relative to the public folder. So, if we put the texture in the public folder, we can use it like this:

just now, we have how to load a texture and apply it to a material. Now, we will see how to use different types of materials in Three.js. We will start with MeshMatCapMaterial, which is a material that uses a matcap texture to simulate lighting and shading effects. It is a simple material that is used for basic rendering. It is not affected by lights in the scene, and it does not cast or receive shadows. It is useful for creating simple objects that do not require lighting effects.




```js

const matcapTexture = textureLoader.load('./image.png');

const material = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture,
});

```

//==================================
Chapter 9 - Lighting
//==================================

Lighting is the only thing that can make our scene realistic.

Ambient Light: It is a light that illuminates all objects in the scene equally. It does not cast shadows and does not have a direction. It is useful for creating a base level of lighting in the scene.

Directional Light: It is  a light that illuminates all objects in the scene from a specific direction. It casts shadows and has a direction. It is useful for creating sunlight or other directional light sources.

Point Light: It is a light that illuminates all objects in the scene from a specific point in space. It casts shadows and has a direction. It is useful for creating light sources like lamps or candles.

Spot Light: It is a light that illuminates all objects in the scene from a specific point in space, but it has a cone shape. It casts shadows and has a direction. It is useful for creating light sources like flashlights or spotlights.

Hamisphere Light: It is a light that illuminates all objects in the scene from a specific point in space, but it has a gradient shape. It casts shadows and has a direction. It is useful for creating light sources like the sky or the sun.

RectAreaLight: It is a light that illuminates all objects in the scene from a specific area in space. It casts shadows and has a direction. It is useful for creating light sources like windows or screens.


jaise humne cube ko scene k andar add kiya, waise hi hum light ko bhi scene k andar add karte hain. 
Humne, MashStandardMaterial ka use kiya hain, jo ki light ke saath react karta hain. Agar humne MeshBasicMaterial ka use kiya hota, to light ka koi effect nahi dikhta.

```js
// Lights
// in the parameter of the light, we can set the color and intensity of the light. 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const material = new THREE.MeshStandardMaterial({
  color: 0xff0000,
});

```

=> We can increase the intensity of the ambient light to make the cube brighter. We can also change the color of the ambient light to make the cube look different. We can also add more lights to the scene to create different effects.


=> Now, lets see how to add a directional light to the scene. 
```js
// in the parameter of the light, we can set the color and intensity of the light. 
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(-2, -4, 2);
scene.add(directionalLight);


// with the help of the helper, we can see the direction of the light and the position of the light in the scene.
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.5);
scene.add(directionalLightHelper);


const material = new THREE.MeshStandardMaterial({
  color: 0xff0000,
});

```


=> Now, lets see how to add a point light to the scene.

```js
// Point Light
// in the parameter of the light, we can set the color, intensity and distance of the light. The 4th parameter is the decay, which is the amount of light that is lost over distance. The higher the decay, the faster the light will fade away. The default value is 1, which means that the light will fade away at a normal rate. If we set it to 2, the light will fade away faster, and if we set it to 0.5, the light will fade away slower.
const pointLight = new THREE.PointLight(0x00ff00, 300, 6, 2);
pointLight.position.set(1,2,3);
scene.add(pointLight);

// with the help of the helper, we can see the direction of the light and the position of the light in the scene.
const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);

const material = new THREE.MeshStandardMaterial({
  color: 0xff0000,
});
```


```js


// Spot Light: It is a light that is emitted from a single point in a specific direction, and it can be used to create a spotlight effect. The parameters of the light are color, intensity, distance, angle, penumbra, and decay. The position of the light can be set using the position property.


const spotLight = new THREE.SpotLight(0x0000ff, 150, 10, Math.PI *0.2, 0.5, 2);
spotLight.position.set(0, 2, 1);
scene.add(spotLight);

// we can set the target of the spotlight to a specific position in the scene. The spotlight will point towards the target position. By default, the target position is (0, 0, 0), but we can change it to any position we want. In this case, we are setting the target position to (0, 0, 0), which is the center of the scene. This means that the spotlight will point towards the center of the scene.
spotLight.target.position.set(0, 0, 0);
scene.add(spotLight.target);


// with the help of the helper, we can see the direction of the light and the position of the light in the scene.
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);



const material = new THREE.MeshStandardMaterial({
  color: 0xff0000,
});


// we will also need to update the spotlight helper in the animation loop, because the spotlight helper is not automatically updated when the spotlight is moved or rotated. We need to call the update() method of the spotlight helper in the animation loop to update its position and orientation based on the current position and orientation of the spotlight.



function animate() {
  timer.update();
  // update the spot light helper to reflect the changes in the spot light's position and direction
  spotLightHelper.update();
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


```





```js

```
```js

```
```js

```
```js

```
```js

```
```js

```
```js

```
```js

```
```js

```
```js

```
```js

```
```js

```
//==================================
Chapter 6 - Debug UI
//==================================

//==================================
Chapter 6 - Debug UI
//==================================
