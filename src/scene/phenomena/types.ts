/**
 * Cosmic Portfolio — Phenomenon Module Contract
 *
 * Each phenomenon module exposes a single `build(ctx) => { group, anims }`.
 * Source: docs/architecture.md (移植ポリシー)
 */

import type * as THREE from 'three';
import type { SceneConfig } from '../config';

export interface PhenomenonContext {
  /** Particle-count multiplier baked in at build time (rebuild to change). */
  density: number;
  /** Live scene config — read `.speed` inside per-frame anims for dynamic speed control. */
  config: SceneConfig;
}

export interface PhenomenonResult {
  group: THREE.Object3D;
  anims: Array<(t: number, dt: number) => void>;
}

export type BuildFn = (ctx: PhenomenonContext) => PhenomenonResult;
