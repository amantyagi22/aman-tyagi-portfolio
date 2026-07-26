"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { ChapterScene } from "@/lib/data";

const GRAY = 0x8a8a92;
const EMBER = 0xe8590c;

interface SceneSpec {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** outer group the hook rotates on drag */
  rig: THREE.Group;
  update: (t: number) => void;
}

/* renderer lifecycle: rAF only while on screen, one static frame if reduced
   motion, drag-to-rotate with inertia on every scene */
function useThree(builder: (w: number, h: number) => SceneSpec) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !el.clientWidth) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    const spec = builder(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    let raf = 0;
    let running = false;
    let dragging = false;
    let lastX = 0;
    let vel = 0;

    const loop = (t: number) => {
      if (!dragging && Math.abs(vel) > 0.0001) {
        spec.rig.rotation.y += vel;
        vel *= 0.94;
      }
      spec.update(t);
      renderer.render(spec.scene, spec.camera);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    spec.update(0);
    renderer.render(spec.scene, spec.camera);

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      spec.rig.rotation.y += dx * 0.006;
      vel = dx * 0.006;
      if (reduced) renderer.render(spec.scene, spec.camera);
    };
    const up = () => {
      dragging = false;
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.05 }
    );
    io.observe(el);

    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      spec.camera.aspect = w / h;
      spec.camera.updateProjectionMatrix();
      if (!running) renderer.render(spec.scene, spec.camera);
    });
    ro.observe(el);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      spec.scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => m?.dispose?.());
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [builder]);

  return ref;
}

function baseScene(w: number, h: number, camPos: [number, number, number], lookAt: [number, number, number]) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 100);
  camera.position.set(...camPos);
  camera.lookAt(...lookAt);
  scene.add(new THREE.AmbientLight(0xffffff, 0.85));
  const sun = new THREE.DirectionalLight(0xffffff, 0.7);
  sun.position.set(3, 5, 4);
  scene.add(sun);
  const rig = new THREE.Group();
  scene.add(rig);
  const group = new THREE.Group();
  rig.add(group);
  return { scene, camera, rig, group };
}

const lambert = (color: number) => new THREE.MeshLambertMaterial({ color });

/* --- chapter 01: real-time analytics, bars that never sit still ------------- */

function buildRealtime(w: number, h: number): SceneSpec {
  const { scene, camera, rig, group } = baseScene(w, h, [0, 1.3, 5.0], [0, 0.3, 0]);

  const N = 9;
  const bars: THREE.Mesh[] = [];
  for (let i = 0; i < N; i++) {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 1, 0.24),
      i === 4 ? lambert(EMBER) : lambert(0x4a4a52)
    );
    bar.position.x = (i - (N - 1) / 2) * 0.4;
    group.add(bar);
    bars.push(bar);
  }
  const base = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-1.9, -0.52, 0),
    new THREE.Vector3(1.9, -0.52, 0),
  ]);
  group.add(
    new THREE.Line(
      base,
      new THREE.LineBasicMaterial({ color: GRAY, transparent: true, opacity: 0.4 })
    )
  );

  return {
    scene,
    camera,
    rig,
    update: (t) => {
      group.rotation.y = Math.sin(t * 0.0002) * 0.2;
      bars.forEach((bar, i) => {
        const hgt = 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(t * 0.0013 + i * 1.15));
        bar.scale.y = hgt;
        bar.position.y = hgt / 2 - 0.5;
      });
    },
  };
}

/* --- chapter 02: the hot path — latency collapsing, a request racing it ----- */

function buildHotpath(w: number, h: number): SceneSpec {
  const { scene, camera, rig, group } = baseScene(w, h, [0, 1.2, 5.2], [0, 0.4, 0]);

  const heights = [1.7, 1.05, 0.62, 0.3, 0.12];
  const tops: [number, number][] = [];
  heights.forEach((hgt, i) => {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, hgt, 0.34),
      i === heights.length - 1 ? lambert(EMBER) : lambert(0x4a4a52)
    );
    const x = (i - 2) * 0.62;
    bar.position.set(x, hgt / 2 - 0.5, 0);
    group.add(bar);
    tops.push([x, hgt - 0.5]);
  });

  const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), lambert(EMBER));
  group.add(pulse);

  return {
    scene,
    camera,
    rig,
    update: (t) => {
      group.rotation.y = Math.sin(t * 0.0002) * 0.2;
      // the request speeds up as latency drops
      const u = ((t % 2400) / 2400) ** 0.7 * (tops.length - 1);
      const i = Math.min(Math.floor(u), tops.length - 2);
      const f = u - i;
      const x = tops[i][0] + (tops[i + 1][0] - tops[i][0]) * f;
      const y = tops[i][1] + (tops[i + 1][1] - tops[i][1]) * f;
      pulse.position.set(x, y + 0.18, 0);
    },
  };
}

/* --- chapter 03: a platform — layers, tenants isolated on top --------------- */

function buildPlatform(w: number, h: number): SceneSpec {
  const { scene, camera, rig, group } = baseScene(w, h, [0, 2.0, 5.2], [0, 0.5, 0]);

  const shades = [0x33333a, 0x44444c, 0x55555e];
  shades.forEach((shade, i) => {
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(2.5 - i * 0.25, 0.1, 1.6 - i * 0.18),
      lambert(shade)
    );
    slab.position.y = i * 0.48;
    group.add(slab);
  });
  const spots: [number, number][] = [
    [-0.65, -0.3],
    [-0.22, 0.28],
    [0.3, -0.25],
    [0.72, 0.22],
  ];
  spots.forEach(([x, z], i) => {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.26, 0.26),
      i === 1 ? lambert(EMBER) : lambert(0x8b8b93)
    );
    cube.position.set(x, 2 * 0.48 + 0.05 + 0.13, z);
    group.add(cube);
  });

  return {
    scene,
    camera,
    rig,
    update: (t) => {
      group.rotation.y = t * 0.0002;
    },
  };
}

const CHAPTER_BUILDERS: Record<ChapterScene, (w: number, h: number) => SceneSpec> = {
  realtime: buildRealtime,
  hotpath: buildHotpath,
  platform: buildPlatform,
};

const canvasClass =
  "w-full cursor-grab touch-pan-y select-none active:cursor-grabbing";

export function ChapterVisual({ kind }: { kind: ChapterScene }) {
  const ref = useThree(CHAPTER_BUILDERS[kind]);
  return <div ref={ref} aria-hidden="true" className={`${canvasClass} h-56 md:h-72`} />;
}
