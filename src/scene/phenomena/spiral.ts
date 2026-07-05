/**
 * 04 — Golden Spiral Galaxy (logarithmic spiral, φ)
 * Ported from design/Cosmic_Portfolio.dc.html:609-649 (_buildSpiral).
 */

import * as THREE from 'three';
import { PALETTE } from '../palette';
import { g, points, sprite } from '../helpers';
import type { PhenomenonContext, PhenomenonResult } from './types';

export function buildSpiral(ctx: PhenomenonContext): PhenomenonResult {
  const { density, config } = ctx;
  const P = PALETTE.phenomena.spiral;
  const group = new THREE.Group();
  group.position.set(0, 0, P.z);
  group.rotation.x = P.rotation.x;
  const anims: Array<(t: number, dt: number) => void> = [];

  const PHI = (1 + Math.sqrt(5)) / 2;
  const a = P.a;
  const b = Math.log(PHI) / (Math.PI / 2);
  const thMax = P.thetaMax;
  const cCore = new THREE.Color(P.colors.core);
  const cGold = new THREE.Color(P.colors.gold);
  const cBlue = new THREE.Color(P.colors.blue);

  for (const arm of P.armOffsets) {
    const n = Math.floor(P.armParticleCount * density);
    const pos: number[] = [];
    const col: number[] = [];
    for (let i = 0; i < n; i++) {
      const th = Math.pow(Math.random(), 0.7) * thMax;
      const r = a * Math.exp(b * th);
      const spread = 0.25 + r * 0.1;
      pos.push(Math.cos(th + arm) * r + g() * spread, Math.sin(th + arm) * r + g() * spread, g() * (0.3 + r * 0.02));
      const t = Math.min(1, r / 16.5);
      const c = t < 0.35 ? cCore.clone().lerp(cGold, t / 0.35) : cGold.clone().lerp(cBlue, (t - 0.35) / 0.65);
      const f = 0.4 + Math.random() * 0.6;
      col.push(c.r * f, c.g * f, c.b * f);
    }
    group.add(points(pos, col, P.pointSize, P.pointOpacity));
  }

  const bn = Math.floor(P.bulgeParticleCount * density);
  const bpos: number[] = [];
  const bcol: number[] = [];
  for (let i = 0; i < bn; i++) {
    bpos.push(g() * 1.9, g() * 1.9, g() * 1.1);
    const f = 0.5 + Math.random() * 0.5;
    bcol.push(cCore.r * f, cCore.g * f, cCore.b * f);
  }
  group.add(points(bpos, bcol, 0.42, 0.95));

  const spts: THREE.Vector3[] = [];
  for (let th = 0; th <= thMax; th += 0.05) {
    const r = a * Math.exp(b * th);
    spts.push(new THREE.Vector3(Math.cos(th) * r, Math.sin(th) * r, 0.2));
  }
  group.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(spts),
      new THREE.LineBasicMaterial({ color: P.colors.gold, transparent: true, opacity: 0.45 })
    )
  );

  const glow = sprite('rgba(255,240,215,0.95)', 'rgba(224,184,102,0.25)', 9, 0.8);
  group.add(glow);

  anims.push((_t, dt) => {
    group.rotation.z += dt * P.speed * config.speed;
  });

  return { group, anims };
}
