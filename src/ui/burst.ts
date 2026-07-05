/**
 * Click-burst particle effect.
 * Ported from design/Cosmic_Portfolio.dc.html:291-305 (_onClick).
 */

import { SCENE } from '../scene/palette';

function onBurstClick(e: MouseEvent): void {
  const { colors, count, sizeMin, sizeMax, durationMin, durationMax, spreadDistance, ease } = SCENE.clickBurst;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = sizeMin + Math.random() * (sizeMax - sizeMin);
    const col = colors[i % colors.length];
    p.style.cssText =
      `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;` +
      `margin:-${size / 2}px;border-radius:50%;pointer-events:none;z-index:50;` +
      `background:${col};box-shadow:0 0 8px ${col}`;
    document.body.appendChild(p);
    const ang = Math.random() * Math.PI * 2;
    const dist = spreadDistance.min + Math.random() * (spreadDistance.max - spreadDistance.min);
    const duration = (durationMin + Math.random() * (durationMax - durationMin)) * 1000;
    p.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(ang) * dist}px,${Math.sin(ang) * dist - 14}px) scale(0)`, opacity: 0 },
      ],
      { duration, easing: ease }
    ).onfinish = () => p.remove();
  }
}

/** Wires the click-burst effect and returns a cleanup function. */
export function setupBurst(target: EventTarget = window): () => void {
  target.addEventListener('click', onBurstClick as EventListener);
  return () => target.removeEventListener('click', onBurstClick as EventListener);
}
