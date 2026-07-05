/**
 * 01 — Hexagonal Storm (Saturn's north-pole hexagon)
 * Ported from design/Cosmic_Portfolio.dc.html:483-522 (_buildStorm).
 */

import * as THREE from 'three';
import { PALETTE } from '../palette';
import { g, hexShape, points, sprite } from '../helpers';
import type { PhenomenonContext, PhenomenonResult } from './types';

export function buildStorm(ctx: PhenomenonContext): PhenomenonResult {
  const { density, config } = ctx;
  const P = PALETTE.phenomena.storm;
  const group = new THREE.Group();
  group.position.set(0, 0, P.z);
  group.rotation.x = P.rotation.x;
  const anims: Array<(t: number, dt: number) => void> = [];

  const cIn = new THREE.Color(P.colors.inner);
  const cMid = new THREE.Color(P.colors.mid);
  const cOut = new THREE.Color(P.colors.outer);

  for (const b of P.bands) {
    const n = Math.floor(b.n * density);
    const pos: number[] = [];
    const col: number[] = [];
    for (let i = 0; i < n; i++) {
      const th = Math.random() * Math.PI * 2;
      const rr = b.r0 + Math.random() * (b.r1 - b.r0);
      const r = rr * (1 + b.hex * (hexShape(th) - 1));
      pos.push(Math.cos(th) * r, Math.sin(th) * r, g() * 0.7);
      const t = rr / 15.6;
      const c = t < 0.4 ? cIn.clone().lerp(cMid, t / 0.4) : cMid.clone().lerp(cOut, (t - 0.4) / 0.6);
      const f = 0.55 + Math.random() * 0.45;
      col.push(c.r * f, c.g * f, c.b * f);
    }
    const p = points(pos, col, P.pointSize, P.pointOpacity);
    group.add(p);
    anims.push((_t, dt) => {
      p.rotation.z += dt * b.speed * config.speed;
    });
  }

  const rads = P.hexOutlines.radii;
  for (let j = 0; j < rads.length; j++) {
    const pts: THREE.Vector3[] = [];
    for (let k = 0; k <= 6; k++) {
      const a = (k * Math.PI) / 3;
      pts.push(new THREE.Vector3(Math.cos(a) * rads[j], Math.sin(a) * rads[j], 0));
    }
    // Hex outline colors: design/Cosmic_Portfolio.dc.html:514 (outer ring matches P.colors.outer)
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({
        color: j === 0 ? 0x6ab0f0 : P.colors.outer,
        transparent: true,
        opacity: j === 0 ? 0.45 : 0.16,
      })
    );
    group.add(line);
    anims.push((_t, dt) => {
      line.rotation.z += dt * P.hexOutlines.speed * config.speed;
    });
  }

  // Central pulsing glow. design/Cosmic_Portfolio.dc.html:518-520
  const glow = sprite('rgba(235,242,255,0.9)', 'rgba(88,140,235,0.25)', 13, 0.75);
  group.add(glow);
  anims.push((t) => {
    const s = 13 + Math.sin(t * 0.8) * 0.8;
    glow.scale.set(s, s, 1);
  });

  return { group, anims };
}
