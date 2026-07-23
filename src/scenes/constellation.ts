import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  SphereGeometry,
  Vector2,
  Vector3,
} from 'three';

import { createStage, prefersReducedMotion, supportsWebGL } from '@/lib/three/stage';
import type { Skill } from '@/lib/types';

export interface ConstellationGroup {
  title: string;
  skills: Skill[];
}

interface Node {
  skill: Skill;
  groupIndex: number;
  mesh: Mesh;
  /** Position on the unit sphere, scaled at render time. */
  home: Vector3;
}

const LEVEL_SCALE: Record<Skill['level'], number> = {
  beginner: 0.5,
  intermediate: 0.72,
  advanced: 1,
};

/**
 * Distributes n points evenly over a sphere. Sequential angles would cluster at the
 * poles; the golden angle avoids that without needing a relaxation pass.
 */
const fibonacciSphere = (index: number, total: number): Vector3 => {
  const y = 1 - (index / Math.max(total - 1, 1)) * 2;
  const radius = Math.sqrt(Math.max(1 - y * y, 0));
  const theta = index * Math.PI * (3 - Math.sqrt(5));
  return new Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
};

export const mountConstellation = (
  canvas: HTMLCanvasElement,
  groups: ConstellationGroup[],
  ui: {
    fallback: HTMLElement;
    hint: HTMLElement;
    label: HTMLElement;
    legend: HTMLElement;
  },
) => {
  if (!supportsWebGL()) {
    canvas.hidden = true;
    ui.fallback.hidden = false;
    return () => {};
  }

  const stage = createStage(canvas, { fov: 50 });
  const { scene, camera, palette } = stage;

  camera.position.set(0, 0, 15);

  // A hue ramp between the site's two accents — teal through to burnt orange.
  // Interpolating in HSL keeps every step saturated; the RGB path between these two
  // runs through a muddy olive, and offsetting lightness instead pushed the darker
  // groups close to black against the cream background.
  const groupColors: Color[] = groups.map((_, index) => {
    const t = groups.length === 1 ? 0 : index / (groups.length - 1);
    return palette.accent.clone().lerpHSL(palette.accentWarm, t);
  });

  const root = new Group();
  scene.add(root);

  const flat = groups.flatMap((group, groupIndex) =>
    group.skills.map((skill) => ({ skill, groupIndex })),
  );

  const nodes: Node[] = flat.map(({ skill, groupIndex }, index) => {
    const home = fibonacciSphere(index, flat.length).multiplyScalar(6);
    const radius = 0.16 + LEVEL_SCALE[skill.level] * 0.2;

    const mesh = new Mesh(
      new SphereGeometry(radius, 20, 16),
      new MeshBasicMaterial({ color: groupColors[groupIndex] }),
    );
    mesh.position.copy(home);
    root.add(mesh);

    return { skill, groupIndex, mesh, home };
  });

  // Link each node to the nearest few in its own group. Linking everything turns the
  // cluster into a ball of wool; nearest-neighbour keeps the structure legible.
  const linkPositions: number[] = [];
  for (const node of nodes) {
    const siblings = nodes
      .filter((other) => other !== node && other.groupIndex === node.groupIndex)
      .sort((a, b) => a.home.distanceTo(node.home) - b.home.distanceTo(node.home))
      .slice(0, 2);

    for (const sibling of siblings) {
      linkPositions.push(node.home.x, node.home.y, node.home.z);
      linkPositions.push(sibling.home.x, sibling.home.y, sibling.home.z);
    }
  }

  const linkGeometry = new BufferGeometry();
  linkGeometry.setAttribute('position', new Float32BufferAttribute(linkPositions, 3));
  const links = new LineSegments(
    linkGeometry,
    new LineBasicMaterial({ color: palette.muted, transparent: true, opacity: 0.25 }),
  );
  root.add(links);

  // Legend, built from the same colours the spheres use.
  ui.legend.innerHTML = groups
    .map(
      (group, index) =>
        `<span class="inline-flex items-center gap-2 text-xs text-muted">
           <span class="h-2.5 w-2.5 rounded-full" style="background:#${groupColors[index]!.getHexString()}"></span>
           ${group.title}
         </span>`,
    )
    .join('');

  // --- interaction -------------------------------------------------------------

  const raycaster = new Raycaster();
  const pointer = new Vector2();
  let hovered: Node | null = null;
  let pointerInside = false;

  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let velocityX = 0;
  let velocityY = 0;
  let targetRotationX = 0;

  const reduced = prefersReducedMotion();
  const idleSpin = reduced ? 0 : 0.12;

  const setLabel = (node: Node | null) => {
    if (!node) {
      ui.label.innerHTML = '<span class="text-muted">Hover a node</span>';
      return;
    }
    const group = groups[node.groupIndex];
    const level = node.skill.level;
    ui.label.innerHTML =
      `<span class="font-medium text-foreground">${node.skill.tech}</span>` +
      `<span class="text-muted"> · ${group?.title ?? ''} · ${level}</span>`;
  };
  setLabel(null);

  const onPointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    pointerInside = true;

    if (dragging) {
      velocityY = (event.clientX - lastX) * 0.005;
      velocityX = (event.clientY - lastY) * 0.005;
      lastX = event.clientX;
      lastY = event.clientY;
    }
  };

  const onPointerDown = (event: PointerEvent) => {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
    ui.hint.style.opacity = '0';
  };

  const onPointerUp = (event: PointerEvent) => {
    dragging = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  };

  const onPointerLeave = () => {
    pointerInside = false;
    dragging = false;
  };

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointerleave', onPointerLeave);

  // Keyboard access: the canvas is focusable and arrow keys rotate it.
  canvas.tabIndex = 0;
  const onKeyDown = (event: KeyboardEvent) => {
    const step = 0.15;
    if (event.key === 'ArrowLeft') velocityY = -step;
    else if (event.key === 'ArrowRight') velocityY = step;
    else if (event.key === 'ArrowUp') velocityX = -step;
    else if (event.key === 'ArrowDown') velocityX = step;
    else return;
    event.preventDefault();
  };
  canvas.addEventListener('keydown', onKeyDown);

  stage.onFrame((delta) => {
    if (!dragging) {
      // Ease the flick velocity out rather than stopping dead.
      velocityX *= 0.94;
      velocityY *= 0.94;
      targetRotationX += idleSpin * delta;
    }

    root.rotation.y += velocityY + (dragging ? 0 : idleSpin * delta);
    root.rotation.x = Math.max(-0.9, Math.min(0.9, root.rotation.x + velocityX));

    // Hover test — skipped while dragging so the label doesn't flicker.
    if (pointerInside && !dragging) {
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(nodes.map((node) => node.mesh), false)[0];
      const next = hit ? (nodes.find((node) => node.mesh === hit.object) ?? null) : null;

      if (next !== hovered) {
        if (hovered) hovered.mesh.scale.setScalar(1);
        hovered = next;
        if (hovered) hovered.mesh.scale.setScalar(1.6);
        setLabel(hovered);
        canvas.style.cursor = hovered ? 'pointer' : 'grab';
      }
    }
  });

  stage.start();

  // Nudge the user that the thing is interactive, then get out of the way.
  window.setTimeout(() => (ui.hint.style.opacity = '1'), 600);
  window.setTimeout(() => (ui.hint.style.opacity = '0'), 5000);

  return () => {
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointerleave', onPointerLeave);
    canvas.removeEventListener('keydown', onKeyDown);
    stage.dispose();
  };
};
