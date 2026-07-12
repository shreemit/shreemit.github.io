import * as THREE from "three";
import { gsap, isMobile } from "../core/motion";

/**
 * Single shared WebGL stage: one renderer, one scene, one camera whose
 * frustum maps 1 world unit to 1 CSS pixel at z=0, so DOM-synced planes
 * can be positioned straight from getBoundingClientRect.
 */
export class Stage {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  readonly cameraZ = 600;
  private updaters: Array<(t: number, dt: number) => void> = [];

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 10, 2000);
    this.camera.position.z = this.cameraZ;

    this.resize();
    window.addEventListener("resize", () => this.resize());

    gsap.ticker.add((time, deltaTime) => {
      const dt = Math.min(deltaTime / 1000, 1 / 30);
      for (const fn of this.updaters) fn(time, dt);
      this.renderer.render(this.scene, this.camera);
    });
  }

  resize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.fov =
      (2 * Math.atan(h / 2 / this.cameraZ) * 180) / Math.PI;
    this.camera.updateProjectionMatrix();
  }

  onFrame(fn: (t: number, dt: number) => void): void {
    this.updaters.push(fn);
  }

  /** Convert a DOM rect to world-space center coordinates. */
  rectToWorld(rect: DOMRect): { x: number; y: number } {
    return {
      x: rect.left + rect.width / 2 - window.innerWidth / 2,
      y: -(rect.top + rect.height / 2 - window.innerHeight / 2),
    };
  }
}
