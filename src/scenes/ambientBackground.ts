/**
 * An animated backdrop for the home hero. Deliberately dependency-free — the home page
 * otherwise ships no JavaScript, and loading Three.js (~128KB gzipped) onto the landing
 * page for decoration would be a poor trade. This is a single full-screen fragment
 * shader in raw WebGL, a few KB in total.
 *
 * It degrades quietly: with no WebGL or prefers-reduced-motion it never mounts, leaving
 * the static CSS gradient already in the markup.
 *
 * Three behaviours, chosen with the `mode` option:
 *   'drift'     — moves on its own, ignores the cursor.
 *   'cursor'    — the whole wash shifts toward the pointer (parallax).
 *   'spotlight' — a soft warm glow follows the pointer.
 */

export type AmbientMode = 'drift' | 'cursor' | 'spotlight';

const MODE_ID: Record<AmbientMode, number> = { drift: 0, cursor: 1, spotlight: 2 };

export const isAmbientMode = (value: string | null): value is AmbientMode =>
  value === 'drift' || value === 'cursor' || value === 'spotlight';

export interface AmbientOptions {
  mode?: AmbientMode;
  /** Single knob for overall strength. 1 = the tuned "gentle but noticeable" default. */
  intensity?: number;
}

const VERTEX_SRC = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT_SRC = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform int u_mode;
uniform float u_intensity;
uniform vec3 u_background;
uniform vec3 u_surface;
uniform vec3 u_accent;
uniform vec3 u_accentWarm;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float total = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    total += noise(p) * amplitude;
    p *= 2.0;
    amplitude *= 0.5;
  }
  return total;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv;
  p.x *= aspect;

  // In cursor and spotlight modes the whole field shifts toward the pointer. Drift mode
  // leaves it centred and moving only under time.
  vec2 drift = vec2(0.0);
  if (u_mode == 1 || u_mode == 2) {
    drift = (u_pointer - 0.5) * 0.35;
  }
  float t = u_time * 0.05;

  // Domain warp: sample the field through an offset that is itself noise.
  vec2 q = vec2(fbm(p + drift + t), fbm(p + vec2(5.2, 1.3) - t));
  float field = fbm(p + q * 1.5 + drift);

  // A second, independent field places cool (teal) versus warm (peach) regions so the
  // two accents read as separate drifting clouds rather than one muddy tint.
  float hueField = fbm(p * 0.8 + q - vec2(2.7, 8.1) - t * 0.7);

  // fbm here lands in roughly 0.2..0.66; normalise both fields onto 0..1 from that
  // measured range so the thresholds below actually fire.
  float fieldN = clamp((field - 0.28) / 0.34, 0.0, 1.0);
  float hueN = clamp((hueField - 0.2) / 0.32, 0.0, 1.0);

  vec3 color = mix(u_background, u_surface, fieldN);

  // Soft accent clouds. Teal reads stronger than peach against cream, so peach is given
  // a wider area (lower threshold) to keep the two roughly balanced.
  float cool = smoothstep(0.62, 1.0, hueN) * 0.18 * u_intensity;
  float warm = smoothstep(0.42, 1.0, 1.0 - hueN) * 0.16 * u_intensity;
  color = mix(color, u_accent, cool);
  color = mix(color, u_accentWarm, warm);

  // Spotlight: a soft warm glow tracking the pointer, brightening the wash around it.
  if (u_mode == 2) {
    vec2 pc = u_pointer;
    pc.x *= aspect;
    float glow = smoothstep(0.5, 0.0, distance(p, pc)) * 0.2 * u_intensity;
    color = mix(color, u_accentWarm, glow * 0.5);
    color += glow * 0.12;
  }

  gl_FragColor = vec4(color, 1.0);
}`;

const toRgb = (styles: CSSStyleDeclaration, name: string, fallback: [number, number, number]) => {
  const value = styles.getPropertyValue(name).trim();
  const match = /^#([0-9a-f]{6})$/i.exec(value);
  if (!match) return fallback;
  const hex = parseInt(match[1]!, 16);
  return [(hex >> 16) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255] as [number, number, number];
};

const compile = (gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

export const mountAmbientBackground = (
  canvas: HTMLCanvasElement,
  options: AmbientOptions = {},
): (() => void) => {
  const mode = options.mode ?? 'cursor';
  const intensity = options.intensity ?? 1;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // alpha:true so that before the first frame — or if the loop is paused — the canvas is
  // transparent and the page's own cream background shows through, never a black flash.
  const gl = canvas.getContext('webgl', { antialias: false, alpha: true });
  if (reduced || !gl) return () => {};

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SRC);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  if (!vertex || !fragment) return () => {};

  const program = gl.createProgram();
  if (!program) return () => {};
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return () => {};
  gl.useProgram(program);

  // A single full-screen triangle pair.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const u = {
    resolution: gl.getUniformLocation(program, 'u_resolution'),
    time: gl.getUniformLocation(program, 'u_time'),
    pointer: gl.getUniformLocation(program, 'u_pointer'),
    mode: gl.getUniformLocation(program, 'u_mode'),
    intensity: gl.getUniformLocation(program, 'u_intensity'),
    background: gl.getUniformLocation(program, 'u_background'),
    surface: gl.getUniformLocation(program, 'u_surface'),
    accent: gl.getUniformLocation(program, 'u_accent'),
    accentWarm: gl.getUniformLocation(program, 'u_accentWarm'),
  };

  const styles = getComputedStyle(document.documentElement);
  gl.uniform1i(u.mode, MODE_ID[mode]);
  gl.uniform1f(u.intensity, intensity);
  gl.uniform3fv(u.background, toRgb(styles, '--color-background', [0.984, 0.968, 0.945]));
  gl.uniform3fv(u.surface, toRgb(styles, '--color-surface', [0.945, 0.905, 0.855]));
  gl.uniform3fv(u.accent, toRgb(styles, '--color-accent', [0.247, 0.424, 0.388]));
  gl.uniform3fv(u.accentWarm, toRgb(styles, '--color-accent-warm', [0.788, 0.482, 0.18]));

  // The pointer target eases toward the real cursor so the drift never snaps.
  const pointer = { x: 0.5, y: 0.5 };
  const target = { x: 0.5, y: 0.5 };
  const onPointerMove = (event: PointerEvent) => {
    target.x = event.clientX / window.innerWidth;
    target.y = 1 - event.clientY / window.innerHeight;
  };
  if (mode !== 'drift') window.addEventListener('pointermove', onPointerMove, { passive: true });

  const dpr = Math.min(window.devicePixelRatio, 1.5);
  const resize = () => {
    const width = Math.floor(canvas.clientWidth * dpr);
    const height = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width === width && canvas.height === height) return;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.uniform2f(u.resolution, width, height);
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  let running = false;
  let raf = 0;
  const start = performance.now();

  const draw = (now: number) => {
    // Faster easing than a background usually needs, so the cursor link is obvious.
    pointer.x += (target.x - pointer.x) * 0.08;
    pointer.y += (target.y - pointer.y) * 0.08;
    gl.uniform1f(u.time, (now - start) / 1000);
    gl.uniform2f(u.pointer, pointer.x, pointer.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const render = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(render);
    draw(now);
  };

  // Paint one frame immediately so a paused or backgrounded tab still shows the wash
  // rather than nothing until the animation loop first runs.
  draw(start);

  const play = () => {
    if (running || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(render);
  };
  const pause = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const onVisibility = () => (document.hidden ? pause() : play());
  document.addEventListener('visibilitychange', onVisibility);
  play();

  return () => {
    pause();
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('visibilitychange', onVisibility);
    resizeObserver.disconnect();
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
  };
};
