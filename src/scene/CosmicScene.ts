/**
 * Cosmic Portfolio — 3D Scene Orchestrator
 *
 * Owns the renderer/camera/fog, the scroll-driven camera fly-through, idle sway,
 * FOV warp, mouse parallax, resize handling, and full teardown.
 * Ported from design/Cosmic_Portfolio.dc.html:214-441, 712-751
 * (componentDidMount/componentWillUnmount, _init, _buildAll, _rebuild, _onScroll,
 * _onMouse, _onResize, _tick).
 */

import * as THREE from 'three';
import { PALETTE, SCENE } from './palette';
import type { SceneConfig } from './config';
import { disposeObject } from './helpers';
import type { PhenomenonContext, PhenomenonResult } from './phenomena/types';
import { buildStorm } from './phenomena/storm';
import { buildRing } from './phenomena/ring';
import { buildNebula } from './phenomena/nebula';
import { buildSpiral } from './phenomena/spiral';
import { buildWeb } from './phenomena/web';
import { buildStars } from './phenomena/stars';
import { buildComets } from './phenomena/comets';

interface Waypoint {
  x: number;
  y: number;
  z: number;
}

export interface CosmicSceneCallbacks {
  /** Fired when the rounded scroll segment (0-4) changes. design/Cosmic_Portfolio.dc.html:744-749 */
  onActiveSection?: (index: number) => void;
  /** Fired every frame with the eased 0-1 page-scroll progress. design/Cosmic_Portfolio.dc.html:750 */
  onProgress?: (fraction: number) => void;
}

export class CosmicScene {
  private readonly container: HTMLElement;
  private readonly config: SceneConfig;
  private readonly callbacks: CosmicSceneCallbacks;
  private readonly reducedMotion: boolean;

  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;

  private groups: THREE.Object3D[] = [];
  private anims: Array<(t: number, dt: number) => void> = [];

  private raf = 0;
  private last = 0;
  private alive = false;

  private way: Waypoint[] = [];
  private look: Waypoint[] = [];

  /* Scroll-driven segment (0-4) and page progress (0-1): target + eased. */
  private seg = 0;
  private segT = 0;
  private p = 0;
  private pT = 0;

  /* Mouse parallax: target + eased. */
  private mx = 0;
  private my = 0;
  private mxT = 0;
  private myT = 0;

  private active = -1;

  constructor(container: HTMLElement, config: SceneConfig, callbacks: CosmicSceneCallbacks = {}) {
    this.container = container;
    this.config = config;
    this.callbacks = callbacks;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.renderer = new THREE.WebGLRenderer({ antialias: PALETTE.renderer.antialias });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, PALETTE.renderer.pixelRatio));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.style.display = 'block';
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(PALETTE.fog.color);
    this.scene.fog = new THREE.FogExp2(PALETTE.fog.color, PALETTE.fog.coefficient);

    this.camera = new THREE.PerspectiveCamera(
      PALETTE.camera.fov,
      window.innerWidth / window.innerHeight,
      PALETTE.camera.near,
      PALETTE.camera.far
    );
    this.camera.position.set(PALETTE.camera.initialPosition.x, PALETTE.camera.initialPosition.y, PALETTE.camera.initialPosition.z);

    this.buildAll();

    this.alive = true;
    this.last = performance.now();
    this.onScroll();
    document.addEventListener('scroll', this.onScroll, { capture: true, passive: true });
    window.addEventListener('mousemove', this.onMouse);
    window.addEventListener('resize', this.onResize);
    this.tick();
  }

  /** Swaps the density multiplier and rebuilds all phenomena (particle counts are baked in). */
  setDensity(density: number): void {
    this.config.density = density;
    this.rebuild();
  }

  private buildAll(): void {
    const rawDensity = this.reducedMotion ? 0.6 : this.config.density;
    const density = Math.max(
      SCENE.props.density.internalMin,
      Math.min(SCENE.props.density.internalMax, rawDensity)
    );

    const Z = PALETTE.sceneLayout.z;
    const X = PALETTE.sceneLayout.x;
    this.way = Z.map((z, i) => ({
      x: X[i],
      y: i === 0 ? PALETTE.sceneLayout.waypointY : 0,
      z: z + PALETTE.sceneLayout.waypointZOffset,
    }));
    this.look = Z.map((z, i) => ({ x: X[i], y: 0, z }));

    const ctx: PhenomenonContext = { density, config: this.config };
    const results: PhenomenonResult[] = [
      buildStorm(ctx),
      buildRing(ctx),
      buildNebula(ctx),
      buildSpiral(ctx),
      buildWeb(ctx),
      buildStars(ctx),
    ];
    // Reduced motion: stop comets entirely. design/README.md:193-194
    if (!this.reducedMotion) results.push(buildComets(ctx));

    for (const r of results) {
      this.scene.add(r.group);
      this.groups.push(r.group);
      this.anims.push(...r.anims);
    }
  }

  private rebuild(): void {
    this.anims = [];
    for (const gr of this.groups) {
      this.scene.remove(gr);
      disposeObject(gr);
    }
    this.groups = [];
    this.buildAll();
  }

  private onScroll = (): void => {
    const vh = window.innerHeight || 1;
    const bodyRect = document.body.getBoundingClientRect();
    const y = -bodyRect.top;
    this.pT = Math.min(1, Math.max(0, y / Math.max(1, bodyRect.height - vh)));

    const secs = [1, 2, 3, 4, 5].map((k) => document.getElementById(`sec${k}`));
    if (secs.some((s) => !s)) {
      this.segT = this.pT * 4;
      return;
    }
    const a = (secs as HTMLElement[]).map((s) => s.offsetTop + s.offsetHeight / 2 - vh / 2);
    let seg: number;
    if (y <= a[0]) seg = 0;
    else if (y >= a[4]) seg = 4;
    else {
      let i = 0;
      while (i < 3 && y >= a[i + 1]) i++;
      seg = i + (y - a[i]) / Math.max(1, a[i + 1] - a[i]);
    }
    this.segT = seg;
  };

  private onMouse = (e: MouseEvent): void => {
    this.mxT = (e.clientX / window.innerWidth - 0.5) * 2;
    this.myT = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  private onResize = (): void => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  };

  private tick = (): void => {
    if (!this.alive) return;
    this.raf = requestAnimationFrame(this.tick);
    const now = performance.now();
    let dt = (now - this.last) / 1000;
    this.last = now;
    if (dt > PALETTE.easing.dt_clamp) dt = PALETTE.easing.dt_clamp;
    const t = now / 1000;

    this.seg += (this.segT - this.seg) * PALETTE.easing.segmentFactor;
    this.p += (this.pT - this.p) * PALETTE.easing.progressFactor;
    this.mx += (this.mxT - this.mx) * PALETTE.easing.mouseFactor;
    this.my += (this.myT - this.my) * PALETTE.easing.mouseFactor;

    const seg = Math.min(3.999, Math.max(0, this.seg));
    const i = Math.floor(seg);
    const f = seg - i;
    const s = f * f * (3 - 2 * f);
    const w0 = this.way[i];
    const w1 = this.way[i + 1];
    const l0 = this.look[i];
    const l1 = this.look[i + 1];
    const par = this.config.parallax * PALETTE.parallax.coefficient;

    const swx = this.reducedMotion ? 0 : Math.sin(t * PALETTE.idleSway.xFrequency) * PALETTE.idleSway.xAmplitude;
    const swy = this.reducedMotion ? 0 : Math.cos(t * PALETTE.idleSway.yFrequency) * PALETTE.idleSway.yAmplitude;

    this.camera.position.set(
      w0.x + (w1.x - w0.x) * s + this.mx * par + swx,
      w0.y + (w1.y - w0.y) * s - this.my * par * PALETTE.parallax.yDamping + swy,
      w0.z + (w1.z - w0.z) * s
    );
    this.camera.lookAt(
      l0.x + (l1.x - l0.x) * s + this.mx * par * PALETTE.parallax.lookAtXDamping,
      l0.y + (l1.y - l0.y) * s - this.my * par * PALETTE.parallax.lookAtYDamping,
      l0.z + (l1.z - l0.z) * s
    );
    if (!this.reducedMotion) {
      this.camera.rotation.z += Math.sin(t * PALETTE.idleSway.rollFrequency) * PALETTE.idleSway.rollAmplitude;
    }

    const vel = Math.abs(this.segT - this.seg);
    const fov = PALETTE.fovWarp.baseFov + Math.min(PALETTE.fovWarp.maxWarp, vel * PALETTE.fovWarp.warpCoefficient);
    if (Math.abs(fov - this.camera.fov) > 0.05) {
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
    }

    for (const fn of this.anims) fn(t, dt);
    this.renderer.render(this.scene, this.camera);

    const act = Math.max(0, Math.min(4, Math.round(this.seg)));
    if (act !== this.active) {
      this.active = act;
      this.callbacks.onActiveSection?.(act);
    }
    this.callbacks.onProgress?.(this.p);
  };

  /** Cancels the RAF loop, removes all listeners, and disposes every Three.js resource. */
  destroy(): void {
    this.alive = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    document.removeEventListener('scroll', this.onScroll, { capture: true });
    window.removeEventListener('mousemove', this.onMouse);
    window.removeEventListener('resize', this.onResize);

    for (const gr of this.groups) {
      this.scene.remove(gr);
      disposeObject(gr);
    }
    this.groups = [];
    this.anims = [];

    this.renderer.dispose();
    const canvas = this.renderer.domElement;
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  }
}
