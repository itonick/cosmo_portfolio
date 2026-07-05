/**
 * Scroll-reveal for section content.
 *
 * Scope per docs/architecture.md: IntersectionObserver(threshold 0.12) drives a
 * `.visible` class toggle; elements already in the viewport at setup time are
 * shown immediately (no fade-in). Actual opacity/transform states live in
 * src/styles/sections.css (.reveal-item / .reveal-item.visible).
 * Ported from design/Cosmic_Portfolio.dc.html:332-367 (_setupReveal), scoped down
 * to the three behaviors architecture.md calls out (no scroll-fallback polling).
 */

const REVEAL_THRESHOLD = 0.12; // design/README.md:89, src/styles/tokens.css --reveal-threshold
const REVEAL_STAGGER_S = 0.13; // design/README.md:89, src/styles/tokens.css --reveal-stagger

export interface RevealHandle {
  disconnect(): void;
}

export function setupReveal(root: ParentNode = document): RevealHandle {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: REVEAL_THRESHOLD }
  );

  const vh = window.innerHeight || 1;
  for (const section of root.querySelectorAll('section')) {
    let i = 0;
    for (const el of Array.from(section.children)) {
      if (el.hasAttribute('data-hud')) continue;
      const item = el as HTMLElement;
      item.classList.add('reveal-item');
      item.style.transitionDelay = `${i * REVEAL_STAGGER_S}s`;
      const r = item.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        item.classList.add('visible');
      } else {
        observer.observe(item);
      }
      i++;
    }
  }

  return {
    disconnect: () => observer.disconnect(),
  };
}
