import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let innerLight;
let glowSprite;

export function initThreeScene() {
  const canvas = document.querySelector("#bg-3d");
  if (!canvas) return;

  const isMobile = window.innerWidth < 768;
  const scene = new THREE.Scene();
  const geometry = new THREE.IcosahedronGeometry(1.2, isMobile ? 0 : 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00f0ff, wireframe: true, emissive: 0x00f0ff, emissiveIntensity: 0.2 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Glow Effect
  const canvasGlow = document.createElement('canvas');
  canvasGlow.width = 128; canvasGlow.height = 128;
  const ctx = canvasGlow.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.15, 'rgba(255, 230, 0, 1)');
  gradient.addColorStop(0.4, 'rgba(255, 160, 0, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
  const glowTexture = new THREE.CanvasTexture(canvasGlow);
  const spriteMaterial = new THREE.SpriteMaterial({ map: glowTexture, blending: THREE.AdditiveBlending, transparent: true });
  glowSprite = new THREE.Sprite(spriteMaterial);
  glowSprite.scale.set(3.8, 3.8, 1);
  glowSprite.visible = false;
  mesh.add(glowSprite);
  innerLight = new THREE.PointLight(0xffaa00, 0, 6);
  mesh.add(innerLight);

  // Particles
  const particlesCount = isMobile ? 200 : 800;
  const posArray = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 15;
  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMaterial = new THREE.PointsMaterial({ size: 0.02, color: 0x00f0ff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Lights
  scene.add(new THREE.PointLight(0xffffff, 2).position.set(2, 3, 4));
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  // Camera & Renderer
  const sizes = { width: window.innerWidth, height: window.innerHeight };
  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
  camera.position.z = 4;
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const heroStartX = isMobile ? 0 : 2.5;
  mesh.position.x = heroStartX;
  particlesMesh.position.x = heroStartX * 0.3;
  const basePos = { x: 1.5, y: 0 };

  let isDragging = false, prevPos = { x: 0, y: 0 }, targetRot = { x: 0, y: 0 };
  canvas.style.touchAction = 'none';
  canvas.addEventListener('pointerdown', (e) => { isDragging = true; prevPos = { x: e.clientX, y: e.clientY }; });
  window.addEventListener('pointermove', (e) => {
    if (isDragging) {
      const dx = e.clientX - prevPos.x, dy = e.clientY - prevPos.y;
      targetRot.x += dy * 0.005; targetRot.y += dx * 0.005;
      prevPos = { x: e.clientX, y: e.clientY };
    }
  });
  window.addEventListener('pointerup', () => { isDragging = false; });

  gsap.to(basePos, { x: 2.5, scrollTrigger: { trigger: ".about-section", start: "top bottom", end: "center center", scrub: 1 } });
  gsap.to(basePos, { x: 0, scrollTrigger: { trigger: ".projects-section", start: "top bottom", end: "center center", scrub: 1 } });
  gsap.to(basePos, { x: -2.5, scrollTrigger: { trigger: ".contact-section", start: "top bottom", end: "center center", scrub: 1 } });

  const clock = new THREE.Clock();
  const tick = () => {
    const elapsed = clock.getElapsedTime();
    mesh.rotation.x += 0.05 * (targetRot.x - mesh.rotation.x);
    mesh.rotation.y += 0.05 * (targetRot.y - mesh.rotation.y);
    targetRot.y += 0.002;
    particlesMesh.rotation.y = -0.05 * elapsed;
    mesh.position.x += 0.06 * (basePos.x - mesh.position.x);
    particlesMesh.position.x += 0.015 * (basePos.x * 0.3 - particlesMesh.position.x);
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth; sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix(); renderer.setSize(sizes.width, sizes.height);
  });
}

export function toggleLight() {
  if (innerLight && glowSprite) {
    const isOff = !glowSprite.visible;
    glowSprite.visible = isOff;
    innerLight.intensity = isOff ? 10 : 0;
    return isOff;
  }
  return false;
}