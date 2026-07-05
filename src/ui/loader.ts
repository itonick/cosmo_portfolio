/**
 * Loading overlay: fades out shortly after the scene is ready, with a hard
 * timeout fallback so it never gets stuck if WebGL/Three fails to load.
 * Ported from design/Cosmic_Portfolio.dc.html:223,283-289,423 (_hideLoader
 * and its two call sites).
 */

import { SCENE } from '../scene/palette';

/** Extra delay after the CSS opacity transition before setting display:none. */
const POST_FADE_CLEANUP_MS = 900; // design/Cosmic_Portfolio.dc.html:288

export interface LoaderHandle {
  /** Call once the 3D scene has finished its first build. */
  notifySceneReady(): void;
  /** Clears any pending timeouts (call on teardown). */
  dispose(): void;
}

export function setupLoader(loaderEl: HTMLElement): LoaderHandle {
  let hidden = false;
  let sceneReadyTimeout: ReturnType<typeof setTimeout> | undefined;
  let cleanupTimeout: ReturnType<typeof setTimeout> | undefined;

  const hide = (): void => {
    if (hidden) return;
    hidden = true;
    loaderEl.style.opacity = '0';
    loaderEl.style.pointerEvents = 'none';
    cleanupTimeout = setTimeout(() => {
      loaderEl.style.display = 'none';
    }, POST_FADE_CLEANUP_MS);
  };

  const hardTimeout = setTimeout(hide, SCENE.loader.hardTimeoutDuration);

  return {
    notifySceneReady: () => {
      sceneReadyTimeout = setTimeout(hide, SCENE.loader.visibleDuration);
    },
    dispose: () => {
      clearTimeout(hardTimeout);
      if (sceneReadyTimeout) clearTimeout(sceneReadyTimeout);
      if (cleanupTimeout) clearTimeout(cleanupTimeout);
    },
  };
}
