/**
 * Comets / shooting stars streaking across random depths.
 * Ported from design/Cosmic_Portfolio.dc.html:369-401 (_buildComets / _resetComet).
 */

import * as THREE from 'three';
import { PALETTE } from '../palette';
import { sprite } from '../helpers';
import type { PhenomenonContext, PhenomenonResult } from './types';

interface Comet {
  s: THREE.Sprite;
  v: THREE.Vector3;
  life: number;
  max: number;
}

function resetComet(c: Comet, first: boolean): void {
  const P = PALETTE.comets;
  const dir = Math.random() < 0.5 ? -1 : 1;
  c.s.position.set(-dir * (40 + Math.random() * 60), 14 + Math.random() * 26, 30 - Math.random() * 720);
  c.v.set(dir * (16 + Math.random() * 18), -(7 + Math.random() * 9), 0);
  c.max = P.lifeMin + Math.random() * (P.lifeMax - P.lifeMin);
  c.life = first ? Math.random() * c.max : 0;
  c.s.scale.set(P.scale.x, P.scale.y, 1);
  c.s.material.opacity = 0;
}

/** `ctx` is accepted for interface parity with the other phenomena but unused —
 *  comet count/behavior does not scale with density or speed in the original. */
export function buildComets(_ctx: PhenomenonContext): PhenomenonResult {
  const P = PALETTE.comets;
  const group = new THREE.Group();
  const anims: Array<(t: number, dt: number) => void> = [];
  const comets: Comet[] = [];

  for (let i = 0; i < P.count; i++) {
    const s = sprite('rgba(255,255,255,1)', 'rgba(150,190,255,0.4)', 2, 0.9);
    const c: Comet = { s, v: new THREE.Vector3(), life: 0, max: 1 };
    resetComet(c, true);
    group.add(s);
    comets.push(c);
  }

  anims.push((_t, dt) => {
    for (const c of comets) {
      c.life += dt;
      c.s.position.x += c.v.x * dt;
      c.s.position.y += c.v.y * dt;
      const k = Math.sin(Math.PI * Math.min(1, c.life / c.max));
      c.s.material.opacity = k * 0.85;
      if (c.life >= c.max) resetComet(c, false);
    }
  });

  return { group, anims };
}
