import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(5, 10, 7.5);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
scene.add(sunLight);

const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.castShadow = true;
player.position.y = 2;
scene.add(player);

const platforms = [];
function createPlatform(x, y, z, w, h, d) {
  const geometry = new THREE.BoxGeometry(w, h, d);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const platform = new THREE.Mesh(geometry, material);
  platform.position.set(x, y, z);
  platform.receiveShadow = true;
  scene.add(platform);
  platforms.push(platform);
}

createPlatform(0, 0, 0, 10, 1, 10);
createPlatform(0, 2, -12, 5, 1, 5);
createPlatform(8, 4, -12, 5, 1, 5);
createPlatform(8, 6, 0, 5, 1, 5);
createPlatform(0, 8, 0, 5, 1, 5);

const goalGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const goalMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const goal = new THREE.Mesh(goalGeometry, goalMaterial);
goal.position.set(0, 9, 0);
scene.add(goal);

const keys = {};
window.addEventListener('keydown', (e) => { keys[e.code] = true; });
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

let velocityY = 0;
let isGrounded = false;
const gravity = -0.01;
const jumpForce = 0.2;
const moveSpeed = 0.1;

let score = 0;
const scoreElement = document.getElementById('score');

function checkCollision(box1, box2) {
  const b1 = new THREE.Box3().setFromObject(box1);
  const b2 = new THREE.Box3().setFromObject(box2);
  return b1.intersectsBox(b2);
}

function update() {
  if (keys['KeyW']) player.position.z -= moveSpeed;
  if (keys['KeyS']) player.position.z += moveSpeed;
  if (keys['KeyA']) player.position.x -= moveSpeed;
  if (keys['KeyD']) player.position.x += moveSpeed;

  velocityY += gravity;
  player.position.y += velocityY;

  isGrounded = false;
  for (const platform of platforms) {
    if (checkCollision(player, platform)) {
      if (velocityY < 0 && player.position.y > platform.position.y) {
        player.position.y = platform.position.y + 0.5 + (platform.geometry.parameters.height / 2);
        velocityY = 0;
        isGrounded = true;
      }
    }
  }

  if (keys['Space'] && isGrounded) {
    velocityY = jumpForce;
    isGrounded = false;
  }

  if (checkCollision(player, goal)) {
    score++;
    scoreElement.textContent = `Score: ${score}`;
    player.position.set(0, 2, 0);
    velocityY = 0;
  }

  if (player.position.y < -10) {
    player.position.set(0, 2, 0);
    velocityY = 0;
  }

  camera.position.set(player.position.x, player.position.y + 5, player.position.z + 10);
  camera.lookAt(player.position);
}

function animate() {
  requestAnimationFrame(animate);
  update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
