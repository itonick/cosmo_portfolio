/**
 * Cosmic Portfolio — Shared 3D Scene Helpers
 *
 * Ported almost verbatim from design/Cosmic_Portfolio.dc.html.
 */

import * as THREE from 'three';

/**
 * Gaussian-ish bell-curve spread: sum of three uniform randoms.
 * design/Cosmic_Portfolio.dc.html:247 (_g)
 */
export function g(): number {
  return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
}

/**
 * Builds a radial-gradient glow texture used by glow sprites.
 * design/Cosmic_Portfolio.dc.html:451-460 (_glowTex)
 */
export function glowTexture(inner: string, outer: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.35, outer);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

/**
 * Additive-blended glow sprite built from glowTexture().
 * design/Cosmic_Portfolio.dc.html:462-467 (_sprite)
 */
export function sprite(inner: string, outer: string, scale: number, opacity: number): THREE.Sprite {
  const s = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture(inner, outer),
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  s.scale.set(scale, scale, 1);
  return s;
}

/**
 * Additive-blended, vertex-colored point cloud.
 * design/Cosmic_Portfolio.dc.html:469-475 (_points)
 */
export function points(
  pos: number[],
  col: number[],
  size: number,
  opacity: number
): THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial> {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      size,
      vertexColors: true,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
}

/**
 * Hexagon-warp radial function: bends a circle towards a hexagon outline.
 * design/Cosmic_Portfolio.dc.html:477-481 (_hexShape)
 */
export function hexShape(th: number): number {
  const P3 = Math.PI / 3;
  const m = ((th % P3) + P3) % P3;
  return Math.cos(Math.PI / 6) / Math.cos(m - Math.PI / 6);
}

/**
 * Shared disposal walk: frees geometries/materials/textures on an Object3D subtree.
 * design/Cosmic_Portfolio.dc.html:443-449 (_dispose)
 */
export function disposeObject(obj: THREE.Object3D): void {
  obj.traverse((o) => {
    const withGeometry = o as THREE.Object3D & { geometry?: THREE.BufferGeometry };
    if (withGeometry.geometry) withGeometry.geometry.dispose();
    const withMaterial = o as THREE.Object3D & { material?: THREE.Material | THREE.Material[] };
    if (withMaterial.material) {
      const materials = Array.isArray(withMaterial.material) ? withMaterial.material : [withMaterial.material];
      for (const mat of materials) {
        const map = (mat as THREE.Material & { map?: THREE.Texture | null }).map;
        if (map) map.dispose();
        mat.dispose();
      }
    }
  });
}
