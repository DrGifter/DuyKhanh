const rotatingContainer = document.getElementById('rotatingContainer');
const galaxy = document.getElementById('galaxy');

const messages = [
  "Chúc chị học giỏi 🥳",
  "Chúc mừng sinh nhật chị mai 🥳",
  "Chúc chị ngày càng đẹp gái ❤️",
  "Chúc chị có người yêu 💵",
  "Kiếm được nhiều tiền🥰",
  "Chúc chị mạnh khoẻ 🥰",
  "10 - 10 - 2025",
  // "Ngày đúng là ngày 5/9/2025 nhé",
  "I love you 😘",
  "Happy Birthday 🎉🎂🎊",
  
];
const imageURLs = [];
for (let i = 1; i <= 17; i++) {
  imageURLs.push(`style/img/Anh (${i}).jpg`);
}
const icons = ["❤️", "⭐", "🍀","🌸"];
const maxParticles = 120;
const activeParticles = new Set();

function createParticle(type = 'text') {
  if (activeParticles.size >= maxParticles) return;

  const el = type === 'text' ? document.createElement('div') : document.createElement('img');
  if (type === 'text') {
    const isIcon = Math.random() < 0.3;
    el.className = 'text-particle';
    el.textContent = isIcon ? icons[Math.floor(Math.random() * icons.length)] : messages[Math.floor(Math.random() * messages.length)];
    el.style.fontSize = (isIcon ? 20 : 18) + Math.random() * 10 + 'px';
  } else {
    el.className = 'image-particle';
    el.src = imageURLs[Math.floor(Math.random() * imageURLs.length)];
  }
  el.style.opacity = 0;
  rotatingContainer.appendChild(el);

  const w = el.offsetWidth || 40;
  el.style.left = Math.random() * (window.innerWidth - w) + 'px';

  const z = -Math.random() * 300;
  const startY = -50;
  const endY = window.innerHeight + 50;
  const duration = 7000 + Math.random() * 4000;
  const t0 = performance.now();

  function animate(t) {
    const p = (t - t0) / duration;
    if (p >= 1) {
      el.remove();
      activeParticles.delete(el);
    } else {
      const y = startY + p * (endY - startY);
      const op = p < 0.1 ? p * 10 : (p > 0.9 ? (1 - p) * 10 : 1);
      el.style.opacity = op;
      el.style.transform = `translate3d(0, ${y}px, ${z}px)`;
      requestAnimationFrame(animate);
    }
  }

  activeParticles.add(el);
  requestAnimationFrame(animate);
}

function loopParticles() {
  let last = 0;
  function tick(t) {
    if (t - last > 300) {
      createParticle('text');
      if (Math.random() < 0.5) createParticle('image');
      last = t;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function startStars() {
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);
camera.position.z = 150;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
galaxy.appendChild(renderer.domElement);

const starsCount = 500;
const positions = new Float32Array(starsCount * 3);
const sizes = new Float32Array(starsCount);

for (let i = 0; i < starsCount; i++) {
positions[i * 3] = (Math.random() - 0.5) * 400;
positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
sizes[i] = Math.random() * 1.5 + 0.5; 
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const starTexture = new THREE.TextureLoader().load(
"https://threejs.org/examples/textures/sprites/disc.png"
);
const material = new THREE.PointsMaterial({
color: 0xffffff,
size: 1,
map: starTexture,
transparent: true,
alphaTest: 0.5,
depthWrite: false
});

const stars = new THREE.Points(geometry, material);
scene.add(stars);

function animate() {
requestAnimationFrame(animate);
const time = Date.now() * 0.002;
material.size = 1 + Math.sin(time) * 0.5;

renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
});
}


function initRotation() {
  function updateRotation(x, y) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const rotY = ((x - cx) / cx) * 10;
    const rotX = (-(y - cy) / cy) * 10;
    rotatingContainer.style.transform = `translate(-50%, -50%) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }

  document.addEventListener('mousemove', e => updateRotation(e.clientX, e.clientY));
  document.addEventListener('touchmove', e => {
    if (e.touches.length > 0) {
      const t = e.touches[0];
      updateRotation(t.clientX, t.clientY);
    }
  }, { passive: true });
}

function setupMusic() {
  let started = false;
  document.body.addEventListener('click', () => {
    if (started) return;
    const audio = new Audio('style/Happy Birthday to You.mp3');
    audio.loop = true;
    audio.currentTime = 10;
    audio.play().catch(() => console.log("Không thể phát nhạc tự động."));
    started = true;
  });
}

window.addEventListener('DOMContentLoaded', () => {
  startStars();
  loopParticles();
  initRotation();
  setupMusic();

});
