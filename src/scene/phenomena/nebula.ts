/**
 * 03 — Square Nebula (MWC 922)
 * Ported from design/Cosmic_Portfolio.dc.html:561-607 (_buildNebula).
 */

import * as THREE from 'three';
import { PALETTE } from '../palette';
import { g, points, sprite } from '../helpers';
import type { PhenomenonContext, PhenomenonResult } from './types';

export function buildNebula(ctx: PhenomenonContext): PhenomenonResult {
  const { density } = ctx;
  const P = PALETTE.phenomena.nebula;
  const group = new THREE.Group();
  group.position.set(0, 0, P.z);
  group.rotation.z = P.rotation.z;
  const anims: Array<(t: number, dt: number) => void> = [];

  const H = P.halfSize;
  const cA = new THREE.Color(P.colors.a);
  const cB = new THREE.Color(P.colors.b);
  const n = Math.floor(P.particleCount * density);
  const pos: number[] = [];
  const col: number[] = [];
  for (let i = 0; i < n; i++) {
    let x: number;
    let y: number;
    let frame = false;
    if (Math.random() < P.frameEdgeBias) {
      frame = true;
      const e = Math.floor(Math.random() * 4);
      const t = (Math.random() * 2 - 1) * H;
      if (e === 0) {
        x = t;
        y = H;
      } else if (e === 1) {
        x = t;
        y = -H;
      } else if (e === 2) {
        x = H;
        y = t;
      } else {
        x = -H;
        y = t;
      }
      x += g() * 1.3;
      y += g() * 1.3;
    } else {
      x = (Math.random() * 2 - 1) * H * 0.95;
      y = (Math.random() * 2 - 1) * H * 0.95;
    }
    pos.push(x, y, g() * (frame ? 2.2 : 2.8));
    const c = cA.clone().lerp(cB, Math.random());
    const f = (frame ? 0.5 : 0.28) + Math.random() * 0.4;
    col.push(c.r * f, c.g * f, c.b * f);
  }
  const cloud = points(pos, col, P.pointSize, P.pointOpacity);
  group.add(cloud);

  // Square outlines at H and H*1.18. design/Cosmic_Portfolio.dc.html:588
  const sqs = [H, H * P.outlineScale];
  for (let j = 0; j < sqs.length; j++) {
    const s = sqs[j];
    const pts = [
      new THREE.Vector3(-s, -s, 0),
      new THREE.Vector3(s, -s, 0),
      new THREE.Vector3(s, s, 0),
      new THREE.Vector3(-s, s, 0),
    ];
    const loop = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0xb48af8, transparent: true, opacity: j === 0 ? 0.5 : 0.18 })
    );
    group.add(loop);
  }

  const dg = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-H * 1.18, -H * 1.18, 0),
    new THREE.Vector3(H * 1.18, H * 1.18, 0),
    new THREE.Vector3(-H * 1.18, H * 1.18, 0),
    new THREE.Vector3(H * 1.18, -H * 1.18, 0),
  ]);
  group.add(
    new THREE.LineSegments(dg, new THREE.LineBasicMaterial({ color: P.colors.a, transparent: true, opacity: 0.12 }))
  );

  const star = sprite('rgba(245,240,255,1)', 'rgba(170,130,245,0.3)', 5, 0.9);
  group.add(star);
  anims.push((t) => {
    const s = 5 + Math.sin(t * 2.1) * 0.4;
    star.scale.set(s, s, 1);
  });

  const halo = sprite('rgba(140,100,235,0.5)', 'rgba(90,70,190,0.12)', 30, 0.16);
  group.add(halo);

  anims.push((t) => {
    group.rotation.z = P.rotation.z + Math.sin(t * P.rotation.zOscillationFrequency) * P.rotation.zOscillationAmplitude;
  });

  return { group, anims };
}
