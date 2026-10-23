import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { mix } from 'three/src/nodes/math/MathNode.js';

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

const matcapTexture = textureLoader.load('./image.png');

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

const gltfLoader = new GLTFLoader();

let mixer;

gltfLoader.load(
  './newModel.glb',
  (gltf) => {
    const model = gltf.scene;

    if(gltf.animations && gltf.animations.length > 0) {
      console.log("Animation", gltf.animations)
      mixer = new THREE.AnimationMixer(model);
      
      const action = mixer.clipAction(gltf.animations[6]);
      // action.play();

      // to play animation with name

      const deathAnimation =  THREE.AnimationClip.findByName(gltf.animations, "Death")

      if(deathAnimation){
        const deathAction = mixer.clipAction(deathAnimation);
        deathAction.play();
      }
    }

    scene.add(model);
    // we can scale the model to fit our scene appropriately
    model.scale.set(0.3, 0.3, 0.3);

    // console.log('GLTF model loaded successfully', gltf);
    console.log('GLTF model loaded successfully');
  },
  () => {
    console.log('GLTF model loading in progress...');
  },
  (error) => {
    console.error('Error loading GLTF model:', error);
  }
);

// scene
const scene = new THREE.Scene();

// const clock = new THREE.Clock();
const timer = new THREE.Timer();

// Lights

// // Ambient Light
// in the parameter of the light, we can set the color and intensity of the light.
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// Spot Light: It is a light that is emitted from a single point in a specific direction, and it can be used to create a spotlight effect. The parameters of the light are color, intensity, distance, angle, penumbra, and decay. The position of the light can be set using the position property.
// const spotLight = new THREE.SpotLight(0x0000ff, 100, 3, Math.PI *0.2, 0.5, 2);
// spotLight.position.set(0, 2, 1);
// scene.add(spotLight);
// spotLight.target.position.set(0, 0, 0);
// scene.add(spotLight.target);
// // with the help of the helper, we can see the direction of the light and the position of the light in the scene.
// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

// Hemisphere Light
const hemisphereLight = new THREE.HemisphereLight(0x2222ff, 0x22ff22, 1000);
scene.add(hemisphereLight);

const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.3
);
scene.add(hemisphereLightHelper);

// 3D object - Mesh

// Geometry:
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Material:
// const material = new THREE.MeshBasicMaterial({
//   color: 0xff0000,
//   // wireframe: true,
//   // map: texture,
//   // map: texture,
// });

// const material = new THREE.MeshMatcapMaterial({
//   matcap: matcapTexture,
// });

const material = new THREE.MeshStandardMaterial({
  color: 0xff0000,
});

// Mesh:
const cube = new THREE.Mesh(geometry, material);

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
// scene.add(cube);

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

  if (mixer) mixer.update(delta);
  // cube animation
  // cube.rotation.x += delta * 0.2;
  // cube.rotation.y += delta * 0.2;

  // renderer ko on kardo
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

animate();
