/**
 * Cosmic Portfolio — entry point.
 * Wires the 3D scene, HUD, scroll-reveal, click-burst, and loading overlay,
 * and exposes a single destroy() path (mirrors componentWillUnmount in
 * design/Cosmic_Portfolio.dc.html:229-239).
 */

import { CosmicScene } from './scene/CosmicScene';
import { DEFAULT_SCENE_CONFIG } from './scene/config';
import { setupReveal } from './ui/reveal';
import { updateTelemetry, updateProgress } from './ui/hud';
import { setupBurst } from './ui/burst';
import { setupLoader } from './ui/loader';

function start(): () => void {
  const config = { ...DEFAULT_SCENE_CONFIG };
  document.documentElement.dataset.tone = config.tone;

  const canvasHolder = document.getElementById('canvas-holder');
  const loaderEl = document.getElementById('loader');
  const sectionLabel = document.getElementById('hud-sec-label');
  const coordinate = document.getElementById('hud-coord');
  const progressFill = document.getElementById('progress-fill');

  if (!canvasHolder || !loaderEl || !sectionLabel || !coordinate || !progressFill) {
    throw new Error('Cosmic Portfolio: required DOM anchors are missing.');
  }

  const loader = setupLoader(loaderEl);

  const scene = new CosmicScene(canvasHolder, config, {
    onActiveSection: (index) => updateTelemetry({ sectionLabel, coordinate }, index),
    onProgress: (fraction) => updateProgress({ progressFill }, fraction),
  });
  loader.notifySceneReady();

  const reveal = setupReveal(document);
  const disposeBurst = setupBurst(window);

  return () => {
    scene.destroy();
    reveal.disconnect();
    disposeBurst();
    loader.dispose();
  };
}

const destroy = start();

if (import.meta.hot) {
  import.meta.hot.dispose(() => destroy());
}
