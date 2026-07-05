/**
 * HUD chrome updates: telemetry labels + scroll progress bar.
 * Ported from design/Cosmic_Portfolio.dc.html:747-750 (inside _tick).
 * Labels/coordinates come from src/scene/palette.ts (SCENE.hud.telemetry).
 */

import { SCENE } from '../scene/palette';

export interface HudElements {
  sectionLabel: HTMLElement;
  coordinate: HTMLElement;
  progressFill: HTMLElement;
}

export function updateTelemetry(elements: Pick<HudElements, 'sectionLabel' | 'coordinate'>, activeSection: number): void {
  const entry = SCENE.hud.telemetry[activeSection];
  if (!entry) return;
  elements.sectionLabel.textContent = entry.label;
  elements.coordinate.textContent = entry.coordinate;
}

export function updateProgress(elements: Pick<HudElements, 'progressFill'>, fraction: number): void {
  elements.progressFill.style.width = `${(fraction * 100).toFixed(1)}%`;
}
