import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";
import { Box, boxCollusion, destroyGameObject } from "./geometrys";
import { keys } from "./controlEvents";
import { endGame } from "./endGame";

// initialize pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

const cube = new Box({
  width: 5,
  height: 5,
  depth: 5,
  color: 0x00ff00,
  // color: 0xffffff,
  velocity: { x: 0, y: -0.01, z: 0 },
  position: { x: 0, y: 0, z: 0 },
  texturePaths: {
    albedo:
      "static/textures/carbon-fiber-smooth-bl/carbon-fiber_smooth_albedo.png",
    normal:
      "static/textures/carbon-fiber-smooth-bl/carbon-fiber_smooth_normal-ogl.png",
    ao: "static/textures/carbon-fiber-smooth-bl/carbon-fiber_smooth_ao.png",
    roughness:
      "static/textures/carbon-fiber-smooth-bl/carbon-fiber_smooth_roughness.png",
    metallic:
      "static/textures/carbon-fiber-smooth-bl/carbon-fiber_smooth_metallic.png",
    apply: true,
  },
});
cube.castShadow = true;

const enemies = [];

enemies.forEach;

const ground = new Box({
  width: 25,
  height: 0.5,
  depth: 500,
  // color: "#0369a1",
  color: "white",
  position: { x: 0, y: -5, z: -220 },
  texturePaths: {
    albedo: "static/textures/rough-wet-cobble-bl/rough-wet-cobble-albedo.png",
    normal:
      "static/textures/rough-wet-cobble-bl/rough-wet-cobble-normal-ogl.png",
    ao: "static/textures/rough-wet-cobble-bl/rough-wet-cobble-ao.png",
    roughness:
      "static/textures/rough-wet-cobble-bl/rough-wet-cobble-roughness.png",
    metallic:
      "static/textures/rough-wet-cobble-bl/rough-wet-cobble-metallic.png",
    apply: true,
  },
  stretch: true,
});
ground.receiveShadow = true;
scene.add(ground, cube, new THREE.AmbientLight("white", 0.2));

// lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 3, 2);
light.castShadow = true;
scene.add(light);

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  300
);
// camera.position.z = 12.5;
// camera.position.y = 10;
// camera.position.x = 0;

// camera.position.set(0, 10, 12.5);
camera.position.set(0, 13, 17);
camera.lookAt(0, -15, -15);
// console.log(
//   cube.position.x - camera.position.x,
//   cube.position.y - camera.position.y,
//   cube.position.z - camera.position.z
// );

const f1 = pane.addFolder({ title: "Camera Properties" });
f1.addInput(camera.position, "x", {
  min: -500,
  max: 500,
  step: 1,
  label: "X",
});
f1.addInput(camera.position, "y", {
  min: -500,
  max: 500,
  step: 1,
  label: "Y",
});
f1.addInput(camera.position, "z", {
  min: -500,
  max: 500,
  step: 1,
  label: "Z",
});
f1.expanded = false;

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
canvas.focus();
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.maxDistance = 20;
// controls.minDistance = 20;

// add resize listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let frame = 0,
  spawnRate = 150,
  gameEnd = false;

const maxJumpHeight = cube.height / 1.6;

// render loop
const renderloop = () => {
  cube.update(ground, camera);

  cube.velocity.x = 0;
  cube.velocity.z = 0;
  if (keys.left.pressed) cube.velocity.x = -0.1;
  else if (keys.right.pressed) cube.velocity.x = 0.1;
  if (keys.up.pressed) {
    if (cube.position.y > maxJumpHeight) cube.position.y = maxJumpHeight;
    else cube.velocity.y = 0.1;
  } else if (keys.down.pressed) cube.velocity.y = -0.1;
  if (keys.front.pressed) cube.velocity.z = -0.1;
  else if (keys.back.pressed) cube.velocity.z = 0.1;

  // controls.update();
  renderer.render(scene, camera);
  const animationId = window.requestAnimationFrame(renderloop);
  frame++;

  // if (boxCollusion(cube, ground)) {
  //   window.cancelAnimationFrame(animationId);
  // }

  enemies.forEach((enemy, index) => {
    enemy.update(ground);
    if (boxCollusion(cube, enemy) || cube.position.y < -50) {
      window.cancelAnimationFrame(animationId);
      if (!gameEnd) {
        gameEnd = true;
        endGame();
      }
    }

    const isDestroyed = destroyGameObject(enemy, scene);
    if (isDestroyed) enemies.splice(index, 1);
  });

  if (frame % spawnRate === 0) {
    spawnRate > 50 && (spawnRate -= 5);
    const enemy = new Box({
      width: 5,
      height: 5,
      depth: 5,
      // color: 0xff0000,
      color: "black",
      velocity: { x: 0, y: 0, z: 0.05 },
      position: {
        x: ((Math.random() * 50) % 10) * (Math.random() > 0.5 ? -1 : 1),
        y: 0,
        z: -100,
      },
      zAcceleration: true,
    });
    cube.castShadow = true;
    scene.add(enemy);
    enemies.push(enemy);
    const performanceData = window.performance;
    console.log(performanceData);
    // console.log(enemies.length);
  }
};

renderloop();
