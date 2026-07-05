/**
 * 02 — Einstein Ring (gravitational lensing)
 * Ported from design/Cosmic_Portfolio.dc.html:524-559 (_buildRing).
 */

import * as THREE from 'three';
import { PALETTE } from '../palette';
import { g, points, sprite } from '../helpers';
import type { PhenomenonContext, PhenomenonResult } from './types';

export function buildRing(ctx: PhenomenonContext): PhenomenonResult {
  const { density, config } = ctx;
  const P = PALETTE.phenomena.ring;
  const group = new THREE.Group();
  group.position.set(0, 0, P.z);
  const anims: Array<(t: number, dt: number) => void> = [];

  const lens = sprite('rgba(240,244,255,0.95)', 'rgba(150,170,240,0.2)', P.lensScale, P.lensOpacity);
  group.add(lens);
  anims.push((t) => {
    const s = P.lensScale + Math.sin(t * 1.3) * 0.35;
    lens.scale.set(s, s, 1);
  });

  const n = Math.floor(P.ringParticleCount * density);
  const pos: number[] = [];
  const col: number[] = [];
  const cA = new THREE.Color(P.colors.particle[0]);
  const cB = new THREE.Color(P.colors.particle[1]);
  for (let i = 0; i < n; i++) {
    const th = Math.random() * Math.PI * 2;
    const r = P.ringRadius + g() * 0.55;
    pos.push(Math.cos(th) * r, Math.sin(th) * r, g() * 0.4);
    const f = 0.3 + 0.7 * Math.pow(Math.abs(Math.sin(th)), 3);
    const c = cA.clone().lerp(cB, Math.random());
    col.push(c.r * f, c.g * f, c.b * f);
  }
  const ring = points(pos, col, 0.5, 0.95);
  group.add(ring);
  anims.push((_t, dt) => {
    ring.rotation.z += dt * P.ringSpeed * config.speed;
  });

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(P.torusRadius, P.torusThickness, P.torusRadialSegments, P.torusTubularSegments),
    new THREE.MeshBasicMaterial({
      color: P.colors.torus,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  group.add(torus);

  // Partial-arc torus geometry (thickness/segments/arc-length): design/Cosmic_Portfolio.dc.html:548
  for (const off of P.arcOffsets) {
    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(P.torusRadius, 0.16, 8, 80, 1.1),
      new THREE.MeshBasicMaterial({
        color: P.colors.arc,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    arc.rotation.z = off;
    group.add(arc);
    anims.push((_t, dt) => {
      arc.rotation.z += dt * P.arcSpeed * config.speed;
    });
  }

  for (let i = 0; i < P.backgroundGlows; i++) {
    const s = sprite('rgba(220,230,255,0.8)', 'rgba(120,140,220,0.15)', 2 + Math.random() * 3, 0.45);
    s.position.set((Math.random() - 0.5) * 76, (Math.random() - 0.5) * 42, -22 - Math.random() * 40);
    group.add(s);
  }

  return { group, anims };
}
