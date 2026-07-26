"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const GRAY = 0x8a8a92;
const DARK = 0x1c1c20;
const EMBER = 0xe8590c;

/* camera keyframes the scroll interpolates between.
   beat 0 opens tight on the monitor; the last beat pulls out over the desk. */
const SHOTS: { pos: [number, number, number]; look: [number, number, number] }[] = [
  { pos: [3.4, 2.2, 5.6], look: [0.6, 0.9, -0.8] },
  { pos: [-3.6, 2.4, 7.0], look: [0.2, 0.5, -0.4] },
  { pos: [4.6, 3.0, 7.4], look: [0.3, 0.3, -0.3] },
  { pos: [0.4, 5.0, 9.4], look: [0, 0.05, -0.2] },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

function buildDesk(group: THREE.Group) {
  const lambert = (color: number) => new THREE.MeshLambertMaterial({ color });
  const M = {
    white: lambert(0xe9e9ec),
    dark: lambert(DARK),
    gray: lambert(0x55555c),
    mat: lambert(0x23262e),
    cream: lambert(0xd8d3c6),
    ember: lambert(EMBER),
    green: lambert(0x5f7a5f),
    screen: new THREE.MeshBasicMaterial({ color: 0x0a0a0c }),
  };

  const box = (
    bw: number, bh: number, bd: number,
    mat: THREE.Material,
    x: number, y: number, z: number,
    ry = 0
  ) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.y = ry;
    group.add(mesh);
    return mesh;
  };
  const cyl = (r: number, ch: number, mat: THREE.Material, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, ch, 20), mat);
    mesh.position.set(x, y, z);
    group.add(mesh);
    return mesh;
  };

  box(5.8, 0.14, 2.7, M.white, 0, -0.07, 0);
  for (const x of [-2.45, 2.45]) {
    box(0.16, 1.6, 0.16, M.gray, x, -0.95, 0);
    box(0.22, 0.08, 1.9, M.gray, x, -1.78, 0);
  }
  box(2.7, 0.02, 1.25, M.mat, -0.1, 0.02, 0.55);

  box(1.3, 0.1, 0.65, M.gray, 0.25, 0.05, -1.0);
  box(0.4, 0.5, 0.25, M.dark, 0.25, 0.32, -1.0);
  box(2.5, 1.45, 0.07, M.dark, 0.25, 1.25, -1.0);
  box(2.36, 1.32, 0.02, M.screen, 0.25, 1.25, -0.955);

  const emberLine = new THREE.MeshBasicMaterial({ color: EMBER });
  const grayLine = new THREE.MeshBasicMaterial({ color: GRAY });
  const SCREEN_LEFT = 0.25 - 2.36 / 2 + 0.18;
  const SCREEN_TOP = 1.25 + 1.32 / 2 - 0.22;
  const termLines: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const lw = 0.55 + ((i * 47) % 80) / 80;
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(lw, 0.045, 0.01),
      i % 3 === 0 ? emberLine : grayLine
    );
    line.position.set(SCREEN_LEFT + lw / 2, SCREEN_TOP - i * 0.16, -0.945);
    group.add(line);
    termLines.push(line);
  }
  const cursor = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.055, 0.01),
    new THREE.MeshBasicMaterial({ color: EMBER, transparent: true })
  );
  group.add(cursor);

  const stand = box(0.5, 0.04, 0.55, M.gray, 1.7, 0.32, -0.7);
  stand.rotation.x = -0.9;
  const laptop = box(1.05, 0.05, 0.72, M.dark, 1.7, 0.42, -0.72);
  laptop.rotation.x = -0.9;
  box(1.1, 0.05, 0.78, M.dark, -2.15, 0.05, -0.6, 0.18);

  cyl(0.15, 0.52, M.dark, -1.15, 0.28, -0.5);
  cyl(0.155, 0.02, M.ember, -1.15, 0.55, -0.5);
  cyl(0.13, 0.6, M.dark, -1.65, 0.32, -0.72);
  cyl(0.13, 0.18, M.white, -0.5, 0.11, -0.9);
  const leaves = new THREE.Mesh(new THREE.IcosahedronGeometry(0.19, 0), M.green);
  leaves.position.set(-0.5, 0.34, -0.9);
  group.add(leaves);

  box(1.5, 0.07, 0.52, M.white, -0.15, 0.07, 0.55);
  const ROWS = 4;
  const COLS = 14;
  const keys = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.082, 0.035, 0.082),
    new THREE.MeshLambertMaterial({ color: 0xffffff }),
    ROWS * COLS + 1
  );
  const cream = new THREE.Color(0xd8d3c6);
  const mint = new THREE.Color(0x9db8a4);
  const grayKey = new THREE.Color(0x8b8b90);
  const m4 = new THREE.Matrix4();
  let idx = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      m4.identity();
      m4.setPosition(-0.15 - 0.65 + c * 0.098, 0.12, 0.55 - 0.19 + r * 0.1);
      keys.setMatrixAt(idx, m4);
      keys.setColorAt(
        idx,
        c === 0 || c === COLS - 1 ? grayKey : (r + c) % 11 === 0 ? mint : cream
      );
      idx++;
    }
  }
  m4.makeScale(3.4, 1, 1);
  m4.setPosition(-0.25, 0.12, 0.55 + 0.21);
  keys.setMatrixAt(idx, m4);
  keys.setColorAt(idx, mint);
  group.add(keys);
  cyl(0.035, 0.05, M.ember, 0.53, 0.13, 0.36);

  box(0.18, 0.08, 0.3, M.cream, 0.85, 0.06, 0.62, 0.2);
  box(0.72, 0.03, 0.95, M.white, 2.1, 0.04, 0.45, -0.2);
  box(0.4, 0.025, 0.025, M.ember, 1.5, 0.03, 0.1, 0.5);
  box(0.26, 0.07, 0.26, M.dark, -0.9, 0.06, 0.25, 0.3);
  box(0.26, 0.012, 0.26, M.ember, -0.9, 0.1, 0.25, 0.3);

  return { termLines, cursor, SCREEN_LEFT, SCREEN_TOP };
}

/** Full-bleed desk. `progress` (0→1) flies the camera through SHOTS. */
export function DeskStage({ progressRef }: { progressRef: React.RefObject<number> }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !el.clientWidth) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const sun = new THREE.DirectionalLight(0xffffff, 0.7);
    sun.position.set(3, 5, 4);
    scene.add(sun);

    const camera = new THREE.PerspectiveCamera(40, el.clientWidth / el.clientHeight, 0.1, 100);
    const group = new THREE.Group();
    scene.add(group);
    const { termLines, cursor, SCREEN_LEFT, SCREEN_TOP } = buildDesk(group);

    const look = new THREE.Vector3();
    const applyShot = (p: number) => {
      // widen the framing on narrow screens so the desk never clips
      const aspect = el.clientWidth / el.clientHeight;
      const pull = aspect < 1.3 ? Math.min(1.3 / aspect, 2.6) : 1;
      const u = Math.min(Math.max(p, 0), 1) * (SHOTS.length - 1);
      const i = Math.min(Math.floor(u), SHOTS.length - 2);
      const f = easeInOut(u - i);
      const a = SHOTS[i];
      const b = SHOTS[i + 1];
      camera.position.set(
        lerp(a.pos[0], b.pos[0], f) * pull,
        lerp(a.pos[1], b.pos[1], f) * (1 + (pull - 1) * 0.5),
        lerp(a.pos[2], b.pos[2], f) * pull
      );
      look.set(
        lerp(a.look[0], b.look[0], f),
        lerp(a.look[1], b.look[1], f),
        lerp(a.look[2], b.look[2], f)
      );
      camera.lookAt(look);
    };

    let shown = 0;
    const drawTerminal = (t: number) => {
      const cycle = (t % 7000) / 7000;
      shown = Math.min(Math.floor(cycle * 9), termLines.length);
      termLines.forEach((line, i) => (line.visible = i < shown));
      cursor.position.set(SCREEN_LEFT + 0.025, SCREEN_TOP - shown * 0.16, -0.945);
      (cursor.material as THREE.MeshBasicMaterial).opacity =
        Math.floor(t / 500) % 2 === 0 ? 1 : 0;
    };

    let current = progressRef.current ?? 0;
    let raf = 0;
    let running = false;
    const loop = (t: number) => {
      const target = progressRef.current ?? 0;
      current += (target - current) * 0.12; // damp the scroll so the camera glides
      applyShot(current);
      drawTerminal(t);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };

    if (reduced) {
      applyShot(1);
      termLines.forEach((line) => (line.visible = true));
      cursor.visible = false;
      renderer.render(scene, camera);
    } else {
      running = true;
      raf = requestAnimationFrame(loop);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduced) return;
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(el);

    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      applyShot(reduced ? 1 : current);
      if (!running) renderer.render(scene, camera);
    });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => m?.dispose?.());
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progressRef]);

  return <div ref={ref} aria-hidden="true" className="h-full w-full" />;
}
