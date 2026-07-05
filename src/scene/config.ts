/**
 * Cosmic Portfolio — Scene Configuration
 *
 * Tweakable parameters exposed by the prototype's editor props.
 * Source: design/README.md:177-186 ("State / Props")
 * Source: design/Cosmic_Portfolio.dc.html:202 (data-props)
 */

import { SCENE } from './palette';

export type Tone = (typeof SCENE.props.tone.options)[number];

export interface SceneConfig {
  /** CSS/typography variant — applied via <html data-tone>, not read by the 3D scene. */
  tone: Tone;
  /** Global multiplier on all phenomena rotation/animation speeds. design/README.md:184 */
  speed: number;
  /** Mouse-parallax strength multiplier. design/README.md:185 */
  parallax: number;
  /** Particle-count multiplier (requires a scene rebuild to take effect). design/README.md:186 */
  density: number;
}

export const DEFAULT_SCENE_CONFIG: SceneConfig = {
  tone: SCENE.props.tone.default,
  speed: SCENE.props.speed.default,
  parallax: SCENE.props.parallax.default,
  density: SCENE.props.density.default,
};
