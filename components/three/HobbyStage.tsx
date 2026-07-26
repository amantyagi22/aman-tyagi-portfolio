"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* Hero scene: the three things that happen away from the keyboard — gym,
   badminton, swimming. Detailed materials rather than the desk's flat
   Lambert look: physical shading, bevelled forms, real shadows.

   Objects rest on a shared plinth and rotate slowly as one rig, so the scene
   reads as a considered still life rather than three props in a row. */

const EMBER = 0xe8590c;

/** slow orbit; the scene is ambient, not a carousel demanding attention */
const ORBIT_SPEED = 0.00011;

function mat(options: THREE.MeshPhysicalMaterialParameters) {
  return new THREE.MeshPhysicalMaterial(options);
}

/** Rounded box — bevels are most of what separates "realistic" from "primitive". */
function roundedBox(w: number, h: number, d: number, r: number, seg = 3) {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: d - r * 2,
    bevelEnabled: true,
    bevelThickness: r,
    bevelSize: r,
    bevelSegments: seg,
    curveSegments: 8,
  });
  geo.center();
  return geo;
}

/** Dumbbell: knurled steel handle, rubber-coated hex plates. */
function buildDumbbell() {
  const g = new THREE.Group();

  const steel = mat({
    color: 0xb8bcc4,
    metalness: 0.95,
    roughness: 0.28,
  });
  const rubber = mat({
    color: 0x1a1a1e,
    metalness: 0.05,
    roughness: 0.85,
    clearcoat: 0.25,
    clearcoatRoughness: 0.6,
  });
  const emberMat = mat({
    color: EMBER,
    metalness: 0.3,
    roughness: 0.45,
    emissive: EMBER,
    emissiveIntensity: 0.12,
  });

  const bar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.075, 1.5, 24),
    steel
  );
  bar.rotation.z = Math.PI / 2;
  bar.castShadow = true;
  g.add(bar);

  // knurling: rings of grooves where the hands actually go
  const knurl = new THREE.InstancedMesh(
    new THREE.TorusGeometry(0.078, 0.006, 6, 20),
    steel,
    28
  );
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(0, Math.PI / 2, 0)
  );
  const scl = new THREE.Vector3(1, 1, 1);
  for (let i = 0; i < 28; i++) {
    m4.compose(new THREE.Vector3(-0.34 + i * 0.025, 0, 0), q, scl);
    knurl.setMatrixAt(i, m4);
  }
  g.add(knurl);

  // hex plates, two per side — the outer slightly smaller, as they stack
  for (const side of [-1, 1]) {
    for (const [dx, r, w] of [
      [0.52, 0.44, 0.2],
      [0.72, 0.36, 0.16],
    ] as const) {
      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(r, r, w, 6),
        rubber
      );
      plate.rotation.z = Math.PI / 2;
      plate.position.x = side * dx;
      plate.castShadow = true;
      plate.receiveShadow = true;
      g.add(plate);

      // collar detail catches the light and breaks up the black mass
      const collar = new THREE.Mesh(
        new THREE.CylinderGeometry(r * 0.3, r * 0.3, w + 0.012, 20),
        side * dx > 0.6 ? emberMat : steel
      );
      collar.rotation.z = Math.PI / 2;
      collar.position.x = side * dx;
      g.add(collar);
    }
  }

  return g;
}

/** Badminton racket: strung oval head, tapered shaft, gripped handle. */
function buildRacket() {
  const g = new THREE.Group();

  const frame = mat({
    color: 0x2a2d35,
    metalness: 0.7,
    roughness: 0.3,
    clearcoat: 0.6,
  });
  const emberFrame = mat({
    color: EMBER,
    metalness: 0.4,
    roughness: 0.35,
    clearcoat: 0.5,
  });
  const stringMat = new THREE.MeshBasicMaterial({
    color: 0xdadde3,
    transparent: true,
    opacity: 0.5,
  });
  const grip = mat({ color: 0x15161a, roughness: 0.95, metalness: 0 });

  const HEAD_RX = 0.42;
  const HEAD_RY = 0.52;
  const HEAD_Y = 1.12;

  // oval head, swept as a tube so it has real thickness
  const oval = new THREE.EllipseCurve(0, 0, HEAD_RX, HEAD_RY, 0, Math.PI * 2);
  const headPts = oval.getPoints(72).map((p) => new THREE.Vector3(p.x, p.y, 0));
  const head = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(headPts, true),
      120,
      0.028,
      10,
      true
    ),
    frame
  );
  head.position.y = HEAD_Y;
  head.castShadow = true;
  g.add(head);

  // strings, clipped to the ellipse so they stop at the frame
  const strings = new THREE.Group();
  const STEP = 0.075;
  for (let x = -HEAD_RX; x <= HEAD_RX; x += STEP) {
    const k = 1 - (x / HEAD_RX) ** 2;
    if (k <= 0.02) continue;
    const half = HEAD_RY * Math.sqrt(k);
    const s = new THREE.Mesh(
      new THREE.BoxGeometry(0.006, half * 2, 0.006),
      stringMat
    );
    s.position.set(x, 0, 0);
    strings.add(s);
  }
  for (let y = -HEAD_RY; y <= HEAD_RY; y += STEP) {
    const k = 1 - (y / HEAD_RY) ** 2;
    if (k <= 0.02) continue;
    const half = HEAD_RX * Math.sqrt(k);
    const s = new THREE.Mesh(
      new THREE.BoxGeometry(half * 2, 0.006, 0.006),
      stringMat
    );
    s.position.set(0, y, 0);
    strings.add(s);
  }
  strings.position.y = HEAD_Y;
  g.add(strings);

  // throat: two struts converging from the head into the shaft
  for (const side of [-1, 1]) {
    const strut = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.03, 0.42, 12),
      frame
    );
    strut.position.set(side * 0.13, HEAD_Y - HEAD_RY - 0.16, 0);
    strut.rotation.z = side * 0.34;
    strut.castShadow = true;
    g.add(strut);
  }

  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.032, 0.042, 0.56, 14),
    emberFrame
  );
  shaft.position.y = 0.29;
  shaft.castShadow = true;
  g.add(shaft);

  const handle = new THREE.Mesh(roundedBox(0.11, 0.46, 0.085, 0.03), grip);
  handle.position.y = -0.2;
  handle.castShadow = true;
  g.add(handle);

  // overgrip wrap — a spiral of thin torus slices
  const wrap = new THREE.InstancedMesh(
    new THREE.TorusGeometry(0.062, 0.009, 6, 16),
    grip,
    12
  );
  const wm = new THREE.Matrix4();
  const wq = new THREE.Quaternion();
  const one = new THREE.Vector3(1, 1, 1);
  for (let i = 0; i < 12; i++) {
    wq.setFromEuler(new THREE.Euler(Math.PI / 2, 0, i * 0.22));
    wm.compose(new THREE.Vector3(0, -0.4 + i * 0.037, 0), wq, one);
    wrap.setMatrixAt(i, wm);
  }
  g.add(wrap);

  const butt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.062, 0.058, 0.035, 16),
    emberFrame
  );
  butt.position.y = -0.44;
  g.add(butt);

  return g;
}

/** Swim goggles: tinted lenses, soft gaskets, strap looping behind. */
function buildGoggles() {
  const g = new THREE.Group();

  const lens = mat({
    color: 0x2f6f86,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.75,
    thickness: 0.35,
    ior: 1.45,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    transparent: true,
  });
  const gasket = mat({
    color: 0x14151a,
    roughness: 0.9,
    metalness: 0,
    clearcoat: 0.2,
  });
  const strapMat = mat({ color: EMBER, roughness: 0.75, metalness: 0.05 });

  for (const side of [-1, 1]) {
    const cup = new THREE.Mesh(
      new THREE.TorusGeometry(0.2, 0.062, 14, 32),
      gasket
    );
    cup.position.set(side * 0.23, 0, 0);
    cup.castShadow = true;
    g.add(cup);

    const glass = new THREE.Mesh(new THREE.SphereGeometry(0.19, 28, 20), lens);
    glass.scale.set(1, 1, 0.42);
    glass.position.set(side * 0.23, 0, 0.01);
    g.add(glass);
  }

  // nose bridge
  const bridge = new THREE.Mesh(
    new THREE.TorusGeometry(0.07, 0.017, 8, 20, Math.PI),
    gasket
  );
  bridge.rotation.z = Math.PI;
  bridge.position.y = -0.015;
  g.add(bridge);

  // strap sweeping back around an implied head
  const strapCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.42, 0.03, 0),
    new THREE.Vector3(-0.52, 0.06, -0.3),
    new THREE.Vector3(-0.3, 0.02, -0.62),
    new THREE.Vector3(0, -0.02, -0.72),
    new THREE.Vector3(0.3, 0.02, -0.62),
    new THREE.Vector3(0.52, 0.06, -0.3),
    new THREE.Vector3(0.42, 0.03, 0),
  ]);
  const strap = new THREE.Mesh(
    new THREE.TubeGeometry(strapCurve, 60, 0.022, 8, false),
    strapMat
  );
  strap.castShadow = true;
  g.add(strap);

  return g;
}

/** Mechanical keyboard: milled case, sculpted keycaps, a few ember accents. */
function buildKeyboard() {
  const g = new THREE.Group();

  const caseMat = mat({
    color: 0x26282f,
    metalness: 0.75,
    roughness: 0.35,
    clearcoat: 0.4,
  });
  const plate = mat({ color: 0x0e0f12, roughness: 0.7, metalness: 0.3 });

  const ROWS = 4;
  const COLS = 13;
  const PITCH = 0.115;
  const W = COLS * PITCH + 0.11;
  const D = ROWS * PITCH + 0.11;

  const body = new THREE.Mesh(roundedBox(W, 0.11, D, 0.022), caseMat);
  body.castShadow = true;
  body.receiveShadow = true;
  g.add(body);

  const inset = new THREE.Mesh(
    new THREE.BoxGeometry(W - 0.06, 0.02, D - 0.06),
    plate
  );
  inset.position.y = 0.05;
  g.add(inset);

  // keycaps as one instanced mesh — 53 draw calls would be silly
  const capGeo = roundedBox(0.095, 0.045, 0.095, 0.014, 2);
  const caps = new THREE.InstancedMesh(
    capGeo,
    mat({ color: 0xffffff, roughness: 0.62, metalness: 0.05 }),
    ROWS * COLS + 1
  );
  caps.castShadow = true;
  const light = new THREE.Color(0xd9dae0);
  const dark = new THREE.Color(0x4a4d57);
  const ember = new THREE.Color(EMBER);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const one = new THREE.Vector3(1, 1, 1);
  const x0 = -((COLS - 1) * PITCH) / 2;
  const z0 = -((ROWS - 1) * PITCH) / 2;
  let i = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      m4.compose(
        new THREE.Vector3(x0 + c * PITCH, 0.085, z0 + r * PITCH),
        q,
        one
      );
      caps.setMatrixAt(i, m4);
      // modifiers dark, escape ember, the rest light — reads as a real board
      const modifier = c === 0 || c === COLS - 1 || (r === ROWS - 1 && c < 2);
      caps.setColorAt(i, r === 0 && c === 0 ? ember : modifier ? dark : light);
      i++;
    }
  }
  // spacebar: same cap, scaled wide
  m4.compose(
    new THREE.Vector3(0, 0.085, z0 + ROWS * PITCH),
    q,
    new THREE.Vector3(5.2, 1, 1)
  );
  caps.setMatrixAt(i, m4);
  caps.setColorAt(i, dark);
  g.add(caps);

  const cable = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.02, -D / 2),
        new THREE.Vector3(0.05, 0.06, -D / 2 - 0.28),
        new THREE.Vector3(-0.12, 0.01, -D / 2 - 0.6),
        new THREE.Vector3(0.1, 0.015, -D / 2 - 0.92),
      ]),
      40,
      0.017,
      8,
      false
    ),
    mat({ color: EMBER, roughness: 0.8, metalness: 0.05 })
  );
  cable.castShadow = true;
  g.add(cable);

  return g;
}

/** Monitor on a stand, running a terminal. Returns the bits that animate. */
function buildMonitor() {
  const g = new THREE.Group();

  const shell = mat({
    color: 0x1e2026,
    metalness: 0.8,
    roughness: 0.3,
    clearcoat: 0.5,
  });
  const W = 1.62;
  const H = 1.0;

  const panel = new THREE.Mesh(roundedBox(W, H, 0.07, 0.02), shell);
  panel.position.y = 0.86;
  panel.castShadow = true;
  g.add(panel);

  // emissive screen so it glows without needing its own light
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(W - 0.09, H - 0.09),
    new THREE.MeshBasicMaterial({ color: 0x0a0b0d })
  );
  screen.position.set(0, 0.86, 0.037);
  g.add(screen);

  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.062, 0.42, 16),
    shell
  );
  neck.position.y = 0.16;
  neck.castShadow = true;
  g.add(neck);

  const foot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.38, 0.035, 32),
    shell
  );
  foot.position.y = -0.04;
  foot.castShadow = true;
  g.add(foot);

  // terminal output: rows of varying width, ember on every third
  const LEFT = -(W - 0.09) / 2 + 0.08;
  const TOP = 0.86 + (H - 0.09) / 2 - 0.1;
  const grayLine = new THREE.MeshBasicMaterial({ color: 0x8a8f9a });
  const emberLine = new THREE.MeshBasicMaterial({ color: EMBER });
  const lines: THREE.Mesh[] = [];
  for (let i = 0; i < 7; i++) {
    const w = 0.28 + ((i * 53) % 70) / 70;
    const line = new THREE.Mesh(
      new THREE.PlaneGeometry(w, 0.035),
      i % 3 === 0 ? emberLine : grayLine
    );
    line.position.set(LEFT + w / 2, TOP - i * 0.105, 0.04);
    g.add(line);
    lines.push(line);
  }

  const cursor = new THREE.Mesh(
    new THREE.PlaneGeometry(0.04, 0.042),
    new THREE.MeshBasicMaterial({ color: EMBER, transparent: true })
  );
  g.add(cursor);

  return { group: g, lines, cursor, LEFT, TOP };
}

interface Rig {
  pivot: THREE.Group;
  dumbbell: THREE.Group;
  racket: THREE.Group;
  goggles: THREE.Group;
  keyboard: THREE.Group;
  monitor: ReturnType<typeof buildMonitor>;
}

function buildScene(scene: THREE.Scene): Rig {
  const pivot = new THREE.Group();
  scene.add(pivot);

  // plinth: catches the shadows so the objects sit in space rather than float
  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(2.35, 2.35, 0.08, 64),
    mat({ color: 0x202127, roughness: 0.85, metalness: 0.1 })
  );
  plinth.position.y = -0.92;
  plinth.receiveShadow = true;
  pivot.add(plinth);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.35, 0.008, 8, 96),
    new THREE.MeshBasicMaterial({ color: EMBER, transparent: true, opacity: 0.4 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.88;
  pivot.add(ring);

  /* Arrangement: the work sits at the back as the anchor — monitor and
     keyboard, the day job — with the three hobbies staged in front of it.
     Reads left to right as lift, play, swim, with code behind all of it. */

  const monitor = buildMonitor();
  monitor.group.position.set(-0.06, -0.88, -1.34);
  monitor.group.rotation.y = 0.12;
  pivot.add(monitor.group);

  const keyboard = buildKeyboard();
  keyboard.position.set(0.02, -0.83, -0.42);
  keyboard.rotation.set(0, 0.1, 0);
  pivot.add(keyboard);

  const dumbbell = buildDumbbell();
  dumbbell.scale.setScalar(0.5);
  dumbbell.position.set(-1.3, -0.72, 0.92);
  dumbbell.rotation.set(0, 0.42, 0.06);
  pivot.add(dumbbell);

  const racket = buildRacket();
  racket.scale.setScalar(0.7);
  racket.position.set(1.3, -0.6, 0.34);
  racket.rotation.set(-0.16, -0.5, 0.16);
  pivot.add(racket);

  const goggles = buildGoggles();
  goggles.scale.setScalar(0.68);
  goggles.position.set(0.2, -0.8, 1.16);
  goggles.rotation.set(-0.95, 0.24, 0.1);
  pivot.add(goggles);

  return { pivot, dumbbell, racket, goggles, keyboard, monitor };
}

/** Hero still life of the three hobbies. Rotates slowly; parallaxes to pointer. */
export function HobbyStage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !el.clientWidth) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // three-point-ish rig: key throws the shadows, rim separates the dark
    // rubber from the dark background, fill keeps the shadow side readable
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(3.4, 5.2, 3.6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 18;
    key.shadow.camera.left = -4;
    key.shadow.camera.right = 4;
    key.shadow.camera.top = 4;
    key.shadow.camera.bottom = -4;
    key.shadow.bias = -0.0012;
    scene.add(key);

    const rim = new THREE.DirectionalLight(EMBER, 1.5);
    rim.position.set(-4, 1.6, -3.4);
    scene.add(rim);

    const fill = new THREE.DirectionalLight(0x9fb4d0, 0.5);
    fill.position.set(-2.4, 1.2, 4);
    scene.add(fill);

    const camera = new THREE.PerspectiveCamera(
      36,
      el.clientWidth / el.clientHeight,
      0.1,
      100
    );
    const rig = buildScene(scene);

    const frame = () => {
      // pull back on narrow panels so nothing clips at the edges
      const aspect = el.clientWidth / el.clientHeight;
      const pull = aspect < 1.2 ? Math.min(1.2 / aspect, 2.2) : 1;
      camera.position.set(0.5 * pull, 2.35 + (pull - 1) * 1.1, 7.1 * pull);
      camera.lookAt(0, -0.1, -0.1);
    };
    frame();

    // pointer parallax, damped — the scene leans toward the cursor
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    const onPointer = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 0.4;
      targetY = (event.clientY / window.innerHeight - 0.5) * 0.22;
    };
    if (!reduced) window.addEventListener("pointermove", onPointer);

    // the monitor types itself out, then clears and starts over
    const { lines, cursor, LEFT, TOP } = rig.monitor;
    const drawTerminal = (t: number) => {
      const shown = Math.min(Math.floor(((t % 8000) / 8000) * 10), lines.length);
      lines.forEach((line, i) => (line.visible = i < shown));
      cursor.position.set(LEFT + 0.02, TOP - shown * 0.105, 0.041);
      (cursor.material as THREE.MeshBasicMaterial).opacity =
        Math.floor(t / 500) % 2 === 0 ? 1 : 0;
    };

    let raf = 0;
    let running = false;
    const loop = (t: number) => {
      curX += (targetX - curX) * 0.045;
      curY += (targetY - curY) * 0.045;
      rig.pivot.rotation.y = t * ORBIT_SPEED + curX;
      rig.pivot.rotation.x = curY * 0.5;

      // each object breathes on its own period so the rig never looks rigid
      rig.dumbbell.position.y = -0.72 + Math.sin(t * 0.0009) * 0.025;
      rig.racket.rotation.z = 0.16 + Math.sin(t * 0.0007) * 0.045;
      rig.goggles.position.y = -0.8 + Math.sin(t * 0.0011 + 1.7) * 0.028;

      drawTerminal(t);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };

    if (reduced) {
      // static: full terminal output, no blinking cursor
      rig.monitor.lines.forEach((line) => (line.visible = true));
      rig.monitor.cursor.visible = false;
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
      frame();
      if (!running) renderer.render(scene, camera);
    });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
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
  }, []);

  return <div ref={ref} aria-hidden="true" className="h-full w-full" />;
}
