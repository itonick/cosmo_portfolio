/**
 * Scroll-reveal for section content.
 *
 * Scope per docs/architecture.md: IntersectionObserver(threshold 0.12) drives a
 * `.visible` class toggle; elements already in the viewport at setup time are
 * shown immediately (no fade-in). Actual opacity/transform states live in
 * src/styles/sections.css (.reveal-item / .reveal-item.visible).
 * Ported from design/Cosmic_Portfolio.dc.html:332-367 (_setupReveal), plus the
 * scroll-driven fallback (.dc.html:256-263): IntersectionObserver can be
 * throttled in background tabs, so pending items are also swept on scroll —
 * nothing stays permanently at opacity:0.
 */

const REVEAL_THRESHOLD = 0.12; // design/README.md:89, src/styles/tokens.css --reveal-threshold
const REVEAL_STAGGER_S = 0.13; // design/README.md:89, src/styles/tokens.css --reveal-stagger

export interface RevealHandle {
  disconnect(): void;
}

export function setupReveal(root: ParentNode = document): RevealHandle {
  const pending = new Set<HTMLElement>();

  const reveal = (item: HTMLElement) => {
    item.classList.add('visible');
    observer.unobserve(item);
    pending.delete(item);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target as HTMLElement);
      }
    },
    { threshold: REVEAL_THRESHOLD }
  );

  const inViewport = (item: HTMLElement, vh: number) => {
    const r = item.getBoundingClientRect();
    return r.bottom > 0 && r.top < vh;
  };

  const vh = window.innerHeight || 1;
  for (const section of root.querySelectorAll('section')) {
    let i = 0;
    for (const el of Array.from(section.children)) {
      if (el.hasAttribute('data-hud')) continue;
      const item = el as HTMLElement;
      item.classList.add('reveal-item');
      item.style.transitionDelay = `${i * REVEAL_STAGGER_S}s`;
      if (inViewport(item, vh)) {
        item.classList.add('visible');
      } else {
        pending.add(item);
        observer.observe(item);
      }
      i++;
    }
  }

  const onScroll = () => {
    const h = window.innerHeight || 1;
    for (const item of pending) {
      if (inViewport(item, h)) reveal(item);
    }
    if (!pending.size) document.removeEventListener('scroll', onScroll, true);
  };
  document.addEventListener('scroll', onScroll, { capture: true, passive: true });

  return {
    disconnect: () => {
      observer.disconnect();
      document.removeEventListener('scroll', onScroll, true);
    },
  };
}
