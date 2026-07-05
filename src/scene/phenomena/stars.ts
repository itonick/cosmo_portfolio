/**
 * Ambient starfield spanning the whole depth of the voyage.
 * Ported from design/Cosmic_Portfolio.dc.html:699-710 (_buildStars).
 */

import { PALETTE } from '../palette';
import { points } from '../helpers';
import type { PhenomenonContext, PhenomenonResult } from './types';

export function buildStars(ctx: PhenomenonContext): PhenomenonResult {
  const { density } = ctx;
  const P = PALETTE.starfield;
  const n = Math.floor(P.count * density);
  const pos: number[] = [];
  const col: number[] = [];
  for (let i = 0; i < n; i++) {
    pos.push((Math.random() - 0.5) * 260, (Math.random() - 0.5) * 200, P.zMin - Math.random() * (P.zMin - P.zMax));
    const f = 0.25 + Math.random() * 0.55;
    const blue = Math.random() * 0.15;
    col.push(f, f, Math.min(1, f + blue));
  }
  const p = points(pos, col, P.pointSize, P.pointOpacity);
  const anims: Array<(t: number, dt: number) => void> = [
    (t) => {
      p.material.opacity =
        P.baseLuminance + Math.sin(t * P.twinkle1Frequency) * P.twinkle1Amplitude + Math.sin(t * P.twinkle2Frequency) * P.twinkle2Amplitude;
    },
  ];
  return { group: p, anims };
}
