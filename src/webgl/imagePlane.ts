import * as THREE from "three";
import { Stage } from "./stage";
import { getImageRevealProgress } from "./imageReveal";

const vertexShader = /* glsl */ `
uniform float uHover;
uniform float uTime;

varying vec2 vUv;

void main() {
  vec3 pos = position;

  // hover bulge
  pos.z += sin(uv.x * 3.14159) * sin(uv.y * 3.14159) * uHover * 26.0;

  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform sampler2D uTexture;
uniform float uHover;
uniform float uReveal;
uniform float uTime;
uniform vec2 uPlaneSize;
uniform vec2 uImageSize;

varying vec2 vUv;

vec2 coverUv(vec2 uv) {
  float planeAspect = uPlaneSize.x / uPlaneSize.y;
  float imageAspect = uImageSize.x / uImageSize.y;
  vec2 scale = (planeAspect > imageAspect)
    ? vec2(1.0, imageAspect / planeAspect)
    : vec2(planeAspect / imageAspect, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  vec2 uv = coverUv(vUv);

  // hover wave distortion
  float wave = sin(uv.y * 12.0 + uTime * 3.0) * 0.014 * uHover;
  uv.x += wave;
  uv.y += cos(uv.x * 10.0 + uTime * 2.0) * 0.01 * uHover;

  // rgb shift on hover only
  float shift = 0.008 * uHover;
  float r = texture2D(uTexture, uv + vec2(shift, 0.0)).r;
  float g = texture2D(uTexture, uv).g;
  float b = texture2D(uTexture, uv - vec2(shift, 0.0)).b;

  gl_FragColor = vec4(r, g, b, uReveal);
}
`;

/** WebGL plane that tracks a DOM element and replaces its img with a shader-distorted version. */
export function attachImagePlane(stage: Stage, container: HTMLElement): void {
  const img = container.querySelector("img");
  if (!img) return;

  const loader = new THREE.TextureLoader();
  loader.load(img.currentSrc || img.src, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTexture: { value: texture },
        uHover: { value: 0 },
        uReveal: { value: 0 },
        uTime: { value: 0 },
        uPlaneSize: { value: new THREE.Vector2(1, 1) },
        uImageSize: {
          value: new THREE.Vector2(
            texture.image.naturalWidth || texture.image.width,
            texture.image.naturalHeight || texture.image.height
          ),
        },
      },
    });

    const geometry = new THREE.PlaneGeometry(1, 1, 24, 24);
    const mesh = new THREE.Mesh(geometry, material);
    stage.scene.add(mesh);

    // hide DOM image once GL version is live (kept in DOM for a11y/SEO)
    img.style.opacity = "0";

    let hoverTarget = 0;
    container.addEventListener("pointerenter", () => (hoverTarget = 1));
    container.addEventListener("pointerleave", () => (hoverTarget = 0));

    stage.onFrame((t, dt) => {
      const rect = container.getBoundingClientRect();
      const visible =
        rect.bottom > -100 &&
        rect.top < window.innerHeight + 100 &&
        rect.right > -100 &&
        rect.left < window.innerWidth + 100;
      mesh.visible = visible;
      if (!visible) return;

      const { x, y } = stage.rectToWorld(rect);
      mesh.position.set(x, y, 0);
      mesh.scale.set(rect.width, rect.height, 1);

      const u = material.uniforms;
      u.uTime.value = t;
      u.uPlaneSize.value.set(rect.width, rect.height);
      u.uHover.value += (hoverTarget - u.uHover.value) * (1 - Math.pow(0.0001, dt));

      const target = getImageRevealProgress(container);
      u.uReveal.value += (target - u.uReveal.value) * (1 - Math.pow(0.0001, dt));
    });
  });
}
