import { mountConstellation, type ConstellationGroup } from './constellation';

/**
 * Wires a ConstellationView's DOM up to the Three.js scene. Everything is found by
 * data-attribute within `root`, so the same markup works both as a standalone page and
 * inside a modal, and multiple instances never collide on ids.
 *
 * Returns a disposer, or undefined if the required elements or data are missing.
 */
export const initConstellation = (root: ParentNode): (() => void) | undefined => {
  const canvas = root.querySelector<HTMLCanvasElement>('canvas[data-scene-canvas]');
  const fallback = root.querySelector<HTMLElement>('[data-scene-fallback]');
  const hint = root.querySelector<HTMLElement>('[data-scene-hint]');
  const legend = root.querySelector<HTMLElement>('[data-constellation-legend]');
  const dataEl = root.querySelector('[data-constellation-data]');

  if (!canvas || !fallback || !hint || !legend || !dataEl) return undefined;

  const groups: ConstellationGroup[] = JSON.parse(dataEl.textContent ?? '[]');
  if (!groups.length) return undefined;

  return mountConstellation(canvas, groups, { fallback, hint, legend });
};
