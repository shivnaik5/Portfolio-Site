import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

import { readPalette, type ScenePalette } from './palette';

/**
 * Shared bootstrap for every 3D scene on the site. Handles the things that are easy
 * to get wrong once per scene: device pixel ratio, resizing, pausing when off-screen
 * or backgrounded, and tearing down GPU resources.
 */

export interface Stage {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  palette: ScenePalette;
  /** Register a per-frame callback. Receives seconds since the last frame. */
  onFrame: (fn: (delta: number, elapsed: number) => void) => void;
  start: () => void;
  stop: () => void;
  dispose: () => void;
}

export interface StageOptions {
  /** Vertical field of view in degrees. */
  fov?: number;
  /** Cap the device pixel ratio. Above 2 the cost is real and the gain is not. */
  maxPixelRatio?: number;
  /** Render with a transparent clear colour so the page background shows through. */
  transparent?: boolean;
}

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Cheap feature test — creating a throwaway context is the only reliable check. */
export const supportsWebGL = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    );
  } catch {
    return false;
  }
};

export const createStage = (canvas: HTMLCanvasElement, options: StageOptions = {}): Stage => {
  const { fov = 45, maxPixelRatio = 2, transparent = false } = options;

  const palette = readPalette();

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: transparent,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));

  const scene = new Scene();
  if (!transparent) scene.background = palette.background.clone();

  const camera = new PerspectiveCamera(fov, 1, 0.1, 200);

  const frameCallbacks: ((delta: number, elapsed: number) => void)[] = [];
  const onFrame = (fn: (delta: number, elapsed: number) => void) => {
    frameCallbacks.push(fn);
  };

  const resize = () => {
    const { clientWidth, clientHeight } = canvas;
    if (clientWidth === 0 || clientHeight === 0) return;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  let running = false;
  let raf = 0;
  let last = 0;
  let elapsed = 0;

  const tick = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(tick);

    // Clamp so a backgrounded tab returning does not jump the simulation forward.
    const delta = Math.min((now - last) / 1000, 1 / 20);
    last = now;
    elapsed += delta;

    for (const fn of frameCallbacks) fn(delta, elapsed);
    renderer.render(scene, camera);
  };

  const run = () => {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const halt = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  // Three independent conditions gate the loop: the caller wants it running, the canvas
  // is on screen, and the tab is in the foreground. Tracking them separately matters —
  // resuming on one while another still applies would render a canvas nobody can see.
  let wanted = false;
  let onScreen = false;
  let tabVisible = !document.hidden;
  const sync = () => (wanted && onScreen && tabVisible ? run() : halt());

  const start = () => {
    wanted = true;
    sync();
  };

  const stop = () => {
    wanted = false;
    sync();
  };

  const visibility = new IntersectionObserver(
    ([entry]) => {
      onScreen = entry?.isIntersecting ?? false;
      sync();
    },
    { threshold: 0 },
  );
  visibility.observe(canvas);

  const onVisibilityChange = () => {
    tabVisible = !document.hidden;
    sync();
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  const dispose = () => {
    stop();
    resizeObserver.disconnect();
    visibility.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    scene.traverse((object) => {
      const mesh = object as { geometry?: { dispose: () => void }; material?: unknown };
      mesh.geometry?.dispose();
      const material = mesh.material;
      if (Array.isArray(material)) material.forEach((m) => (m as { dispose: () => void }).dispose());
      else (material as { dispose?: () => void } | undefined)?.dispose?.();
    });
    renderer.dispose();
  };

  return { scene, camera, renderer, palette, onFrame, start, stop, dispose };
};
