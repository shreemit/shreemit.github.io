import * as THREE from "three";
import { Stage } from "./stage";
import { mouse } from "../core/cursor";
import { isMobile } from "../core/motion";
import { scrollState } from "../core/scroll";

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uScroll;
uniform vec2 uMouse;
uniform float uVelocity;
uniform vec2 uViewport;

attribute float aSeed;

varying float vAlpha;
varying float vTwinkle;

// simplex-ish cheap 3d noise
vec3 hash3(vec3 p) {
  p = vec3(
    dot(p, vec3(127.1, 311.7, 74.7)),
    dot(p, vec3(269.5, 183.3, 246.1)),
    dot(p, vec3(113.5, 271.9, 124.6))
  );
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(
      mix(dot(hash3(i + vec3(0,0,0)), f - vec3(0,0,0)),
          dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
      mix(dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0)),
          dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
    mix(
      mix(dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1)),
          dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
      mix(dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1)),
          dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y), u.z);
}

void main() {
  vec3 pos = position;
  float t = uTime * 0.42;

  // strong organic drift so the field never reads as static
  float n1 = noise(vec3(pos.xy * 0.0016, t + aSeed * 4.0));
  float n2 = noise(vec3(pos.yx * 0.0013, t * 1.3 - aSeed * 4.0));
  pos.x += n1 * 190.0;
  pos.y += n2 * 190.0;
  pos.z += noise(vec3(pos.xy * 0.001, t * 0.7)) * 160.0;

  // slow global swirl
  float ang = uTime * 0.05 + aSeed * 0.4;
  float ca = cos(ang * 0.12);
  float sa = sin(ang * 0.12);
  pos.xy = mat2(ca, -sa, sa, ca) * pos.xy;

  // constant upward current, wrapped within the field
  pos.y = mod(pos.y + uTime * (14.0 + aSeed * 26.0) + uViewport.y, uViewport.y * 1.4) - uViewport.y * 0.7;

  // mouse repulsion (mouse in world px)
  vec2 m = uMouse * uViewport * 0.5;
  vec2 toMouse = pos.xy - m;
  float d = length(toMouse);
  float radius = 260.0;
  if (d < radius) {
    float force = (1.0 - d / radius);
    pos.xy += normalize(toMouse) * force * force * 150.0;
  }

  // scroll dissolve: explode outward + push back in z
  float burst = uScroll * (1.0 + aSeed * 0.6);
  pos.xy *= 1.0 + burst * 1.6;
  pos.z -= burst * 500.0;

  // scroll velocity stretch
  pos.y += uVelocity * aSeed * 14.0;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float size = (1.6 + aSeed * 3.2);
  gl_PointSize = size * (300.0 / -mv.z);

  vTwinkle = 0.55 + 0.45 * sin(uTime * (1.5 + aSeed * 3.5) + aSeed * 40.0);
  vAlpha = (0.12 + aSeed * 0.28) * (1.0 - uScroll);
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uAccent;
varying float vAlpha;
varying float vTwinkle;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float glow = smoothstep(0.5, 0.0, d);
  // a fraction of particles read as accent-colored sparks
  vec3 col = mix(uColor, uAccent, step(0.82, vAlpha));
  gl_FragColor = vec4(col, glow * vAlpha * vTwinkle);
}
`;

export function initParticles(stage: Stage): void {
  const count = isMobile ? 2500 : 7000;
  const spreadX = Math.max(window.innerWidth, 1200) * 1.2;
  const spreadY = Math.max(window.innerHeight, 800) * 1.2;

  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spreadX;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 350;
    seeds[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uVelocity: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uViewport: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uColor: { value: new THREE.Color("#f0efe6") },
      uAccent: { value: new THREE.Color("#ccff00") },
    },
  });

  const points = new THREE.Points(geometry, material);
  points.position.z = -120;
  stage.scene.add(points);

  const smoothedMouse = new THREE.Vector2(0, 0);

  stage.onFrame((t, dt) => {
    const u = material.uniforms;
    u.uTime.value = t;
    smoothedMouse.lerp(new THREE.Vector2(mouse.nx, mouse.ny), 1 - Math.pow(0.001, dt));
    u.uMouse.value.copy(smoothedMouse);
    u.uVelocity.value += (scrollState.velocity - u.uVelocity.value) * 0.08;
    u.uViewport.value.set(window.innerWidth, window.innerHeight);

    // dissolve as the hero scrolls away
    const hero = document.getElementById("hero")!;
    const heroRect = hero.getBoundingClientRect();
    const leave = Math.min(Math.max(-heroRect.top / (heroRect.height * 0.9), 0), 1);
    u.uScroll.value = leave;
    points.visible = leave < 0.999;
  });
}
