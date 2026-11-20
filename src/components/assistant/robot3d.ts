import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { brandLogo } from "../../lib/brand";
import type { RobotMood, RobotPose } from "./MecaRobot";

/**
 * MECA in real 3D (three.js). A transparent canvas pinned to the bottom-right of
 * the viewport, with an orthographic camera in pixel units, so "x px left of
 * home" in the script is exactly x px on screen.
 *
 * The script (MecaAssistant) only writes `state`; every frame this module eases
 * the body, head, arms and legs toward the pose, turns the body toward `yaw`,
 * draws the screen face, and keeps the click overlay over the robot.
 */

export const FACING = { front: 0, left: -Math.PI / 2, right: Math.PI / 2 } as const;

export interface RobotState {
  pose: RobotPose;
  mood: RobotMood;
  /** Target body yaw in radians: 0 faces the viewer, -π/2 walks left, π/2 walks right. Unwrapped, so += 2π spins. */
  yaw: number;
  /** Scripted head turn (radians, relative to the body); null = automatic (follows the cursor, looks around). */
  headYaw: number | null;
  /** Pixels walked left of home. */
  x: number;
  /** Jetpack height in robot units (0 = on the ground). */
  altitude: number;
  carrying: boolean;
  placed: boolean;
  /** Ground box, px left of home; null = none. */
  box: number | null;
  bug: { x: number; squashed: boolean } | null;
  hovered: boolean;
  /** Carrying the closed "preview" laptop the visitor put away. */
  holdingLaptop: boolean;
  /** Pointer is on the held laptop: lift it up to show the visitor. */
  presenting: boolean;
  /** In the "sign" pose: shake the board side to side. */
  signShake: boolean;
}

export interface RobotScene {
  state: RobotState;
  /** True when the viewport point is on the laptop MECA is holding. */
  hitsLaptop(clientX: number, clientY: number): boolean;
  dispose(): void;
}

/** Robot units -> px. The robot is ~2.35 units (~75px) tall. */
const S = 45;
const CANVAS_HEIGHT = 310;
/** Half the robot's on-screen width (px): home is this far in from the right margin. */
const HALF_WIDTH = 42;
const PITCH = 0.17;
const CYAN = "#7df9ff";

const damp = (from: number, to: number, rate: number, dt: number) => from + (to - from) * (1 - Math.exp(-rate * dt));
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function canvasTexture(width: number, height: number, draw: (g: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext("2d")!);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return { canvas, texture };
}

export function createRobotScene(
  canvas: HTMLCanvasElement,
  overlay: HTMLElement,
  opts: { reducedMotion: boolean; /** Mouse moved onto (true) or off (false) the held laptop. */ onLaptopHover?: (over: boolean) => void },
): RobotScene {
  const motion = !opts.reducedMotion;

  const state: RobotState = {
    pose: "idle",
    mood: "normal",
    yaw: FACING.front,
    headYaw: null,
    x: 0,
    altitude: 0,
    carrying: false,
    placed: false,
    box: null,
    bug: null,
    hovered: false,
    holdingLaptop: false,
    presenting: false,
    signShake: false,
  };

  /* ---------- Renderer, camera, lights ---------- */

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  // The canvas spans the full width (MECA can walk anywhere along the bottom), so cap the resolution
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 4000);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8d95a5, 1.7));
  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(-0.55, 1, 0.9);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffe2dc, 1.1);
  rim.position.set(0.9, 0.5, -1);
  scene.add(rim);

  const layout = { width: 0, margin: 12, homeX: 0 };

  function resize() {
    layout.margin = window.innerWidth >= 640 ? 20 : 12;
    layout.width = window.innerWidth;
    layout.homeX = -(layout.margin + HALF_WIDTH);
    renderer.setSize(layout.width, CANVAS_HEIGHT);

    const w = layout.width;
    const h = CANVAS_HEIGHT;
    camera.left = -w / 2;
    camera.right = w / 2;
    camera.top = h / 2;
    camera.bottom = -h / 2;
    camera.updateProjectionMatrix();

    // Look slightly down, then slide the camera so the ground line sits `margin` px above the canvas bottom
    camera.position.set(-w / 2, 0, 1500);
    camera.rotation.set(-PITCH, 0, 0);
    camera.updateMatrixWorld();
    const ground = new THREE.Vector3(-w / 2, 0, 0).project(camera);
    const wanted = -1 + (2 * layout.margin) / h;
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    camera.position.addScaledVector(up, ((ground.y - wanted) * h) / 2);
    camera.updateMatrixWorld();
    dirty = true;
  }

  /* ---------- Materials ---------- */

  const shell = new THREE.MeshStandardMaterial({ color: 0xf1f3f7, roughness: 0.32, metalness: 0.05 });
  const ink = new THREE.MeshStandardMaterial({ color: 0x161a23, roughness: 0.45, metalness: 0.25 });
  const red = new THREE.MeshStandardMaterial({ color: 0xd40800, roughness: 0.38, metalness: 0.1 });
  const glow = new THREE.MeshStandardMaterial({ color: 0xff2a1a, emissive: 0xff1505, emissiveIntensity: 1 });
  const cardboard = new THREE.MeshStandardMaterial({ color: 0xc98d4f, roughness: 0.85 });
  const tape = new THREE.MeshStandardMaterial({ color: 0xecc690, roughness: 0.6 });
  const grey = new THREE.MeshStandardMaterial({ color: 0xb8c0cc, roughness: 0.4, metalness: 0.4 });
  const lidMat = new THREE.MeshStandardMaterial({ color: 0x2b3242, roughness: 0.35, metalness: 0.5 });
  const batteryFill = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.4 });
  const bugGreen = new THREE.MeshStandardMaterial({ color: 0x18a957, roughness: 0.3, metalness: 0.1 });
  const flameOuter = new THREE.MeshBasicMaterial({ color: 0xffa31a, transparent: true, opacity: 0.95 });
  const flameInner = new THREE.MeshBasicMaterial({ color: 0xfff3b0 });

  const disposables: { dispose(): void }[] = [renderer, shell, ink, red, glow, cardboard, tape, grey, lidMat, batteryFill, bugGreen, flameOuter, flameInner];
  const geo = <T extends THREE.BufferGeometry>(g: T) => (disposables.push(g), g);
  const mesh = (g: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0) => {
    const o = new THREE.Mesh(g, m);
    o.position.set(x, y, z);
    return o;
  };

  /* ---------- Face (screen) ---------- */

  const face = canvasTexture(256, 72, () => {});
  disposables.push(face.texture);
  let faceKey = "";

  function drawFace(mood: RobotMood, blink: boolean, lx: number, ly: number) {
    const keyNow = `${mood}|${blink}|${lx.toFixed(0)}|${ly.toFixed(0)}`;
    if (keyNow === faceKey) return;
    faceKey = keyNow;
    const g = face.canvas.getContext("2d")!;
    // Visor slit: dark glass with scanlines and a glare streak
    g.fillStyle = "#07090d";
    g.fillRect(0, 0, 256, 72);
    g.fillStyle = "rgba(125,249,255,0.06)";
    for (let y = 1; y < 72; y += 5) g.fillRect(0, y, 256, 2);
    g.fillStyle = "rgba(255,255,255,0.12)";
    g.fillRect(10, 8, 60, 4);

    g.save();
    g.shadowColor = CYAN;
    g.shadowBlur = 14;
    g.fillStyle = CYAN;
    g.strokeStyle = CYAN;
    g.lineCap = "square";
    g.lineJoin = "miter";
    g.lineWidth = 7;
    const L = 80 + lx;
    const R = 176 + lx;
    const Y = 36 + ly * 0.6;
    const bar = (cx: number, cy: number, w: number, h: number) => g.fillRect(cx - w / 2, cy - h / 2, w, h);
    const chevron = (cx: number, cy: number, up: boolean) => {
      g.beginPath();
      g.moveTo(cx - 22, cy + (up ? 7 : -5));
      g.lineTo(cx, cy + (up ? -8 : 6));
      g.lineTo(cx + 22, cy + (up ? 7 : -5));
      g.stroke();
    };

    switch (mood) {
      case "normal":
        bar(L, Y, 48, blink ? 4 : 18);
        bar(R, Y, 48, blink ? 4 : 18);
        break;
      case "happy":
        chevron(L, Y, true);
        chevron(R, Y, true);
        break;
      case "sleep":
        bar(L, Y + 6, 48, 4);
        bar(R, Y + 6, 48, 4);
        break;
      case "focus":
        bar(L, Y + 4, 50, blink ? 3 : 8);
        bar(R, Y + 4, 50, blink ? 3 : 8);
        break;
      case "wow":
        if (blink) {
          bar(L, Y, 48, 4);
          bar(R, Y, 48, 4);
        } else {
          g.lineWidth = 5;
          g.strokeRect(L - 20, Y - 14, 40, 28);
          g.strokeRect(R - 20, Y - 14, 40, 28);
          bar(L, Y, 12, 12);
          bar(R, Y, 12, 12);
        }
        break;
    }
    g.restore();
    face.texture.needsUpdate = true;
  }

  const badge = canvasTexture(80, 64, (g) => {
    g.fillStyle = "#e10600";
    g.beginPath();
    g.roundRect(0, 0, 80, 64, 16);
    g.fill();
    g.strokeStyle = "#fff";
    g.lineWidth = 8;
    g.lineCap = "round";
    g.lineJoin = "round";
    g.beginPath();
    g.moveTo(20, 48);
    g.lineTo(20, 16);
    g.lineTo(40, 34);
    g.lineTo(60, 16);
    g.lineTo(60, 48);
    g.stroke();
  });
  disposables.push(badge.texture);

  const shadowTex = canvasTexture(64, 64, (g) => {
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(11,13,18,0.5)");
    grd.addColorStop(1, "rgba(11,13,18,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
  });
  disposables.push(shadowTex.texture);
  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex.texture, transparent: true, depthWrite: false });
  disposables.push(shadowMat);

  /* ---------- Robot ---------- */

  const root = new THREE.Group();
  root.scale.setScalar(S);
  scene.add(root);

  const body = new THREE.Group();
  root.add(body);

  const boxGeo = geo(new RoundedBoxGeometry(0.62, 0.44, 0.4, 2, 0.03));
  const tapeGeo = geo(new THREE.BoxGeometry(0.11, 0.445, 0.405));
  const makeBox = () => {
    const g = new THREE.Group();
    g.add(mesh(boxGeo, cardboard), mesh(tapeGeo, tape));
    return g;
  };

  // Mech parts: chrome for pistons, red/white hazard stripes, bolts
  const chrome = new THREE.MeshStandardMaterial({ color: 0xdfe3ea, roughness: 0.22, metalness: 0.65 });
  const hazard = canvasTexture(128, 32, (g) => {
    g.fillStyle = "#f1f3f7";
    g.fillRect(0, 0, 128, 32);
    g.fillStyle = "#e10600";
    for (let x = -32; x < 160; x += 24) {
      g.beginPath();
      g.moveTo(x, 32);
      g.lineTo(x + 12, 32);
      g.lineTo(x + 44, 0);
      g.lineTo(x + 32, 0);
      g.closePath();
      g.fill();
    }
  });
  const hazardMat = new THREE.MeshStandardMaterial({ map: hazard.texture, roughness: 0.5 });
  disposables.push(chrome, hazard.texture, hazardMat);
  const boltGeo = geo(new THREE.CylinderGeometry(0.022, 0.022, 0.02, 10));
  const bolt = (parent: THREE.Object3D, x: number, y: number, z: number) => {
    const b = mesh(boltGeo, chrome, x, y, z);
    b.rotation.x = Math.PI / 2;
    parent.add(b);
  };

  // Legs: hip -> armoured thigh -> cylinder knee -> shin plate -> ankle -> heavy boot
  const thighGeo = geo(new RoundedBoxGeometry(0.17, 0.22, 0.19, 2, 0.02));
  const kneeGeo = geo(new THREE.CylinderGeometry(0.075, 0.075, 0.22, 18));
  const shinGeo = geo(new RoundedBoxGeometry(0.21, 0.2, 0.23, 2, 0.025));
  const ankleGeo = geo(new THREE.CylinderGeometry(0.05, 0.06, 0.08, 14));
  const bootGeo = geo(new RoundedBoxGeometry(0.36, 0.17, 0.5, 2, 0.03));
  const toeGeo = geo(new RoundedBoxGeometry(0.37, 0.09, 0.14, 2, 0.02));
  const soleGeo = geo(new THREE.BoxGeometry(0.38, 0.05, 0.52));
  const makeLeg = (x: number) => {
    const hip = new THREE.Group();
    hip.position.set(x, 0.69, 0);
    hip.add(mesh(thighGeo, ink, 0, -0.1, 0));
    const knee = new THREE.Group();
    knee.position.set(0, -0.22, 0);
    const joint = mesh(kneeGeo, grey);
    joint.rotation.z = Math.PI / 2;
    knee.add(joint, mesh(shinGeo, shell, 0, -0.12, 0.01));
    bolt(knee, 0, -0.08, 0.13);
    knee.add(mesh(ankleGeo, chrome, 0, -0.25, 0));
    knee.add(mesh(bootGeo, red, 0, -0.34, 0.06), mesh(toeGeo, ink, 0, -0.36, 0.26), mesh(soleGeo, ink, 0, -0.44, 0.06));
    hip.add(knee);
    body.add(hip);
    return { hip, knee };
  };
  const legL = makeLeg(-0.2);
  const legR = makeLeg(0.2);

  // Pelvis with a hazard-striped belt
  body.add(mesh(geo(new RoundedBoxGeometry(0.56, 0.16, 0.38, 2, 0.03)), ink, 0, 0.74, 0));
  body.add(mesh(geo(new THREE.PlaneGeometry(0.5, 0.07)), hazardMat, 0, 0.74, 0.192));

  // Armoured chest: shell, red chest plate, the Mecatronix logo on a dark plate, bolts
  body.add(mesh(geo(new RoundedBoxGeometry(0.92, 0.58, 0.58, 2, 0.05)), shell, 0, 1.09, 0));
  body.add(mesh(geo(new RoundedBoxGeometry(0.66, 0.36, 0.05, 2, 0.015)), red, 0, 1.12, 0.29));
  body.add(mesh(geo(new RoundedBoxGeometry(0.3, 0.32, 0.03, 2, 0.012)), ink, 0, 1.12, 0.315));
  // The simple "M" badge shows until the logo image has loaded
  const badgeMat = new THREE.MeshStandardMaterial({ map: badge.texture, transparent: true, emissive: 0xff2010, emissiveIntensity: 0.15, roughness: 0.4 });
  disposables.push(badgeMat);
  const logoHeight = 0.27;
  body.add(mesh(geo(new THREE.PlaneGeometry(logoHeight * (brandLogo.width / brandLogo.height), logoHeight)), badgeMat, 0, 1.12, 0.332));
  new THREE.TextureLoader().load(brandLogo.src, (logo) => {
    logo.colorSpace = THREE.SRGBColorSpace;
    logo.anisotropy = 4;
    disposables.push(logo);
    badgeMat.map = logo;
    // A soft self-glow so the red mark reads clearly on the dark plate
    badgeMat.emissiveMap = logo;
    badgeMat.emissive.set(0xffffff);
    badgeMat.emissiveIntensity = 0.35;
    badgeMat.needsUpdate = true;
    dirty = true;
  });
  for (const [bx, by] of [[-0.29, 1.26], [0.29, 1.26], [-0.29, 0.98], [0.29, 0.98]]) bolt(body, bx, by, 0.318);
  body.add(mesh(geo(new THREE.PlaneGeometry(0.92, 0.06)), hazardMat, 0, 0.86, 0.292));
  body.add(mesh(geo(new THREE.CylinderGeometry(0.12, 0.14, 0.1, 18)), ink, 0, 1.42, 0));

  // Back unit with exhaust stacks; flames come out of its nozzles
  body.add(mesh(geo(new RoundedBoxGeometry(0.58, 0.46, 0.22, 2, 0.03)), ink, 0, 1.08, -0.39));
  body.add(mesh(geo(new THREE.PlaneGeometry(0.56, 0.06)), hazardMat, 0, 0.9, -0.502).rotateY(Math.PI));
  const stackGeo = geo(new THREE.CylinderGeometry(0.055, 0.055, 0.34, 16));
  const stackCapGeo = geo(new THREE.CylinderGeometry(0.07, 0.07, 0.05, 16));
  const nozzleGeo = geo(new THREE.CylinderGeometry(0.06, 0.085, 0.12, 16));
  const flameGeo = geo(new THREE.ConeGeometry(0.075, 0.34, 12));
  const flameInnerGeo = geo(new THREE.ConeGeometry(0.04, 0.2, 10));
  const flames: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    body.add(mesh(stackGeo, chrome, side * 0.2, 1.4, -0.42), mesh(stackCapGeo, red, side * 0.2, 1.58, -0.42));
    body.add(mesh(nozzleGeo, grey, side * 0.15, 0.8, -0.41));
    const flame = new THREE.Group();
    flame.position.set(side * 0.15, 0.74, -0.41);
    const outer = mesh(flameGeo, flameOuter, 0, -0.17, 0);
    const inner = mesh(flameInnerGeo, flameInner, 0, -0.1, 0);
    outer.rotation.x = inner.rotation.x = Math.PI;
    flame.add(outer, inner);
    flame.visible = false;
    flames.push(flame);
    body.add(flame);
  }

  // Head: compact helmet, glowing visor slit, grille jaw, red crest, side antennas
  const head = new THREE.Group();
  head.position.set(0, 1.46, 0);
  body.add(head);
  head.add(mesh(geo(new RoundedBoxGeometry(0.8, 0.56, 0.66, 3, 0.07)), shell, 0, 0.32, 0));
  head.add(mesh(geo(new RoundedBoxGeometry(0.74, 0.22, 0.05, 2, 0.02)), ink, 0, 0.38, 0.318));
  const faceMat = new THREE.MeshBasicMaterial({ map: face.texture });
  disposables.push(faceMat);
  head.add(mesh(geo(new THREE.PlaneGeometry(0.68, 0.17)), faceMat, 0, 0.38, 0.345));
  head.add(mesh(geo(new RoundedBoxGeometry(0.44, 0.13, 0.08, 2, 0.02)), ink, 0, 0.13, 0.31));
  const slatGeo = geo(new THREE.BoxGeometry(0.3, 0.016, 0.02));
  for (const y of [0.1, 0.13, 0.16]) head.add(mesh(slatGeo, grey, 0, y, 0.352));
  head.add(mesh(geo(new RoundedBoxGeometry(0.07, 0.13, 0.52, 2, 0.02)), red, 0, 0.64, -0.02));
  const podGeo = geo(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 18));
  const rodGeo = geo(new THREE.CylinderGeometry(0.015, 0.015, 0.3, 8));
  const tipGeo = geo(new THREE.SphereGeometry(0.04, 12, 10));
  for (const side of [-1, 1]) {
    const pod = mesh(podGeo, grey, side * 0.43, 0.32, 0);
    pod.rotation.z = Math.PI / 2;
    head.add(pod);
    const rod = mesh(rodGeo, ink, side * 0.47, 0.5, -0.1);
    rod.rotation.set(-0.5, 0, side * -0.25);
    head.add(rod, mesh(tipGeo, glow, side * 0.51, 0.63, -0.17));
  }

  // Battery (recharging), floats above the head
  const battery = new THREE.Group();
  battery.position.set(0, 1.02, 0);
  battery.add(mesh(geo(new RoundedBoxGeometry(0.52, 0.27, 0.2, 2, 0.03)), shell));
  battery.add(mesh(geo(new THREE.BoxGeometry(0.05, 0.1, 0.1)), ink, 0.285, 0, 0));
  const fillGeo = geo(new THREE.BoxGeometry(0.42, 0.17, 0.21));
  fillGeo.translate(0.21, 0, 0);
  const fill = mesh(fillGeo, batteryFill, -0.21, 0, 0);
  battery.add(fill);
  battery.visible = false;
  head.add(battery);

  // Arms: red shoulder plate -> piston upper arm -> cylinder elbow -> chrome rod + housing -> claw
  const padGeo = geo(new RoundedBoxGeometry(0.34, 0.2, 0.38, 2, 0.05));
  const padStripeGeo = geo(new THREE.PlaneGeometry(0.3, 0.05));
  const upperArmGeo = geo(new THREE.CylinderGeometry(0.075, 0.07, 0.16, 16));
  const pistonGeo = geo(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 10));
  const elbowGeo = geo(new THREE.CylinderGeometry(0.07, 0.07, 0.17, 16));
  const housingGeo = geo(new RoundedBoxGeometry(0.16, 0.15, 0.17, 2, 0.025));
  const palmGeo = geo(new RoundedBoxGeometry(0.15, 0.06, 0.13, 2, 0.015));
  const fingerGeo = geo(new RoundedBoxGeometry(0.045, 0.1, 0.09, 2, 0.012));
  const makeArm = (x: number) => {
    const side = Math.sign(x);
    const shoulder = new THREE.Group();
    shoulder.position.set(x, 1.27, 0);
    const pad = mesh(padGeo, red, side * 0.03, 0.06, 0);
    shoulder.add(pad);
    const stripe = mesh(padStripeGeo, hazardMat, side * 0.03, 0.06, 0.192);
    shoulder.add(stripe);
    bolt(shoulder, side * 0.03, 0.12, 0.192);
    shoulder.add(mesh(upperArmGeo, ink, 0, -0.1, 0), mesh(pistonGeo, chrome, 0, -0.19, 0.04));
    const elbow = new THREE.Group();
    elbow.position.set(0, -0.25, 0);
    const joint = mesh(elbowGeo, grey);
    joint.rotation.z = Math.PI / 2;
    elbow.add(joint, mesh(pistonGeo, chrome, 0, -0.08, 0), mesh(housingGeo, shell, 0, -0.18, 0));
    elbow.add(mesh(palmGeo, ink, 0, -0.28, 0), mesh(fingerGeo, red, -0.045, -0.34, 0.01), mesh(fingerGeo, red, 0.045, -0.34, 0.01));
    shoulder.add(elbow);
    body.add(shoulder);
    return { shoulder, elbow };
  };
  const armL = makeArm(-0.6);
  const armR = makeArm(0.6);

  // The closed "preview" laptop, carried in the left claw like a folder
  const heldLaptop = new THREE.Group();
  heldLaptop.position.set(-0.1, -0.47, 0.06);
  heldLaptop.rotation.set(0.08, -0.6, 0);
  heldLaptop.add(mesh(geo(new RoundedBoxGeometry(0.5, 0.34, 0.035, 2, 0.012)), grey));
  heldLaptop.add(mesh(geo(new RoundedBoxGeometry(0.49, 0.33, 0.022, 2, 0.01)), lidMat, 0, 0, 0.026));
  heldLaptop.add(mesh(geo(new THREE.CircleGeometry(0.045, 20)), glow, 0, 0.01, 0.038));
  // Invisible target a little larger than the laptop (but clear of MECA's body) so it's easy to point at
  const laptopHitMat = new THREE.MeshBasicMaterial({ visible: false });
  disposables.push(laptopHitMat);
  heldLaptop.add(mesh(geo(new THREE.BoxGeometry(0.62, 0.46, 0.14)), laptopHitMat));
  heldLaptop.visible = false;

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function hitsLaptop(clientX: number, clientY: number) {
    if (!state.holdingLaptop || !heldLaptop.visible) return false;
    const r = canvas.getBoundingClientRect();
    if (clientX < r.left || clientX > r.right || clientY < r.top || clientY > r.bottom) return false;
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    return raycaster.intersectObject(heldLaptop, true).length > 0;
  }
  let overLaptop = false;
  armL.elbow.add(heldLaptop);

  // Props in hand
  const carried = makeBox();
  carried.position.set(0, 0.95, 0.56);
  carried.visible = false;
  body.add(carried);

  const laptop = new THREE.Group();
  laptop.position.set(0, 0.9, 0.5);
  laptop.add(mesh(geo(new THREE.BoxGeometry(0.72, 0.035, 0.46)), grey));
  const lid = new THREE.Group();
  lid.position.set(0, 0.02, 0.22);
  lid.rotation.x = 0.28;
  lid.add(mesh(geo(new THREE.BoxGeometry(0.72, 0.42, 0.03)), lidMat, 0, 0.21, 0));
  lid.add(mesh(geo(new THREE.CircleGeometry(0.055, 24)), glow, 0, 0.22, 0.017));
  laptop.add(lid);
  laptop.visible = false;
  body.add(laptop);

  // Box set down at its feet (on the ground, so it stays put when MECA jumps)
  const placed = makeBox();
  placed.position.set(0, 0.22, 0.62);
  placed.visible = false;
  root.add(placed);

  const shadow = mesh(geo(new THREE.PlaneGeometry(1, 1)), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.5;
  scene.add(shadow);

  /* ---------- Ground box + bug ---------- */

  const groundBox = makeBox();
  groundBox.scale.setScalar(S);
  groundBox.visible = false;
  scene.add(groundBox);

  const bug = new THREE.Group();
  bug.scale.setScalar(S);
  bug.visible = false;
  scene.add(bug);
  const bugShell = mesh(geo(new THREE.SphereGeometry(0.2, 24, 16)), bugGreen, 0.02, 0.13, 0);
  bugShell.scale.set(1.15, 0.62, 0.8);
  bug.add(bugShell);
  bug.add(mesh(geo(new THREE.SphereGeometry(0.085, 16, 12)), ink, -0.23, 0.11, 0));
  const bugLegs: THREE.Mesh[] = [];
  const bugLegGeo = geo(new THREE.CylinderGeometry(0.013, 0.013, 0.17, 6));
  for (const x of [-0.1, 0.02, 0.14]) {
    for (const side of [-1, 1]) {
      const leg = mesh(bugLegGeo, ink, x, 0.06, side * 0.15);
      leg.rotation.x = side * 0.9;
      bug.add(leg);
      bugLegs.push(leg);
    }
  }

  /* ---------- Pointer (head + eyes follow the cursor) ---------- */

  const pointer = { x: 0, y: 0, known: false };
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.known = true;
    dirty = true;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  /* ---------- Animation ---------- */

  const REST = { bodyY: 0, lean: 0, sway: 0, twist: 0, legL: 0, legR: 0, kneeL: 0, kneeR: 0, armLx: 0, armLz: -0.12, armRx: 0, armRz: 0.12, elbowL: -0.22, elbowR: -0.22, headYaw: 0, headPitch: 0, headRoll: 0 };
  const J = { ...REST };
  type Joints = typeof J;
  const T: Joints = { ...J };
  let yaw = state.yaw;
  let phase = 0;
  let lastX = 0;
  let scriptPose: RobotPose = state.pose;
  let scriptClock = 0;
  let boxClock = 0;
  let boxWas: number | null = null;
  let bugClock = 0;
  let bugLastX = 0;
  let nextBlink = 2;
  let dirty = true;
  let lastHovered = false;
  let raf = 0;
  let last = performance.now();
  let time = 0;

  window.addEventListener("resize", resize);
  resize();

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (!motion) {
      if (state.hovered !== lastHovered) dirty = true;
      lastHovered = state.hovered;
      if (!dirty) return;
    }
    dirty = false;
    time += dt;
    const t = motion ? time : 0;

    if (state.pose !== scriptPose) {
      scriptPose = state.pose;
      scriptClock = 0;
    }
    if (!state.hovered) scriptClock += dt;

    const flying = state.pose === "fly";
    // Keeps holding the board up when hovered
    const greet = state.hovered && !flying && state.pose !== "sign";
    const pose: RobotPose = greet ? (state.carrying ? "hold" : state.holdingLaptop && state.presenting ? "present" : "wave") : state.pose;
    const targetYaw = greet ? nearest(yaw, 0) : state.yaw;
    yaw = motion ? damp(yaw, targetYaw, 7, dt) : targetYaw;
    // Facing in (-π, π], for head turns relative to the viewer (yaw itself is unwrapped so spins work)
    const facing = Math.atan2(Math.sin(yaw), Math.cos(yaw));

    // Walk cycle follows the distance actually travelled, so feet don't slide
    const moved = Math.abs(state.x - lastX);
    lastX = state.x;
    phase += moved * ((Math.PI * 2) / (pose === "run" ? 56 : 42));

    // Head screen position, for looking at the cursor
    const headX = window.innerWidth - (layout.margin + HALF_WIDTH) - state.x;
    const headY = window.innerHeight - layout.margin - 1.9 * S - J.bodyY * S;
    const dx = pointer.x - headX;
    const dy = pointer.y - headY;
    const near = pointer.known && Math.hypot(dx, dy) < 600;

    // Pose targets (knees bend back with +, elbows bend forward with -)
    Object.assign(T, REST);
    let followCursor = false;
    switch (pose) {
      case "idle":
        T.bodyY = Math.sin(t * 2) * 0.02;
        T.armLz = -0.12 - Math.sin(t * 2) * 0.05;
        T.armRz = 0.12 + Math.sin(t * 2) * 0.05;
        T.elbowL = T.elbowR = -0.22 - Math.sin(t * 2) * 0.06;
        followCursor = true;
        if (!near) T.headYaw = Math.sin(t * 0.6) * 0.45;
        break;
      case "walk":
      case "carry":
      case "run": {
        const run = pose === "run";
        const s = Math.sin(phase);
        const c = Math.cos(phase);
        T.legL = s * (run ? 0.8 : 0.55);
        T.legR = -T.legL;
        // The knee folds while that leg swings forward
        T.kneeL = Math.max(0, -c) * (run ? 1.1 : 0.75);
        T.kneeR = Math.max(0, c) * (run ? 1.1 : 0.75);
        T.bodyY = Math.abs(c) * (run ? 0.06 : 0.04) - (run ? 0.03 : 0.015);
        T.lean = run ? 0.22 : 0.08;
        if (pose === "carry") {
          T.armLx = T.armRx = -1.0;
          T.elbowL = T.elbowR = -0.55;
          T.armLz = 0.3;
          T.armRz = -0.3;
        } else {
          T.armLx = -T.legL * 0.8;
          T.armRx = -T.legR * 0.8;
          T.elbowL = T.elbowR = run ? -1.2 : -0.4;
        }
        // Every few seconds, glance at the viewer while walking
        if (Math.sin(t * 0.8) > 0.6) T.headYaw = clamp(-facing * 0.8, -1.1, 1.1);
        break;
      }
      case "present":
        // Laptop lifted up in front, the other hand pointing at it
        T.armLx = -1.2;
        T.armLz = 0.34;
        T.elbowL = -0.5;
        T.armRx = -0.55;
        T.armRz = -0.2;
        T.elbowR = -0.35;
        T.headRoll = 0.06;
        followCursor = true;
        break;
      case "hold":
        T.armLx = T.armRx = -1.0;
        T.elbowL = T.elbowR = -0.55;
        T.armLz = 0.3;
        T.armRz = -0.3;
        followCursor = true;
        break;
      case "crouch":
        T.bodyY = -0.1;
        T.lean = 0.3;
        T.legL = T.legR = -0.45;
        T.kneeL = T.kneeR = 0.85;
        T.armLx = T.armRx = -0.9;
        T.elbowL = T.elbowR = -0.4;
        T.armLz = 0.3;
        T.armRz = -0.3;
        T.headPitch = 0.2;
        break;
      case "jump": {
        const f = (scriptClock % 0.5) / 0.5;
        const air = Math.sin(Math.PI * f);
        T.bodyY = air * 0.7;
        T.armLz = -2.5;
        T.armRz = 2.5;
        T.elbowL = T.elbowR = -0.15;
        T.legL = T.legR = -air * 0.45;
        T.kneeL = T.kneeR = air * 0.9;
        break;
      }
      case "wave":
        // Arm up, forearm waving from the elbow
        T.armRz = 2.6;
        T.elbowR = -0.55 + Math.sin(t * 12) * 0.45;
        T.headRoll = -0.12;
        followCursor = true;
        break;
      case "type":
        T.armLx = -0.25;
        T.armRx = -0.25;
        T.elbowL = -1.25 + Math.sin(t * 26) * 0.1;
        T.elbowR = -1.25 - Math.sin(t * 26) * 0.1;
        T.armLz = 0.15;
        T.armRz = -0.15;
        T.headPitch = 0.32;
        T.headYaw = Math.sin(t * 1.3) * 0.12;
        break;
      case "dance": {
        const b = Math.sin(t * 8);
        T.bodyY = Math.abs(b) * 0.06 - 0.03;
        T.sway = Math.sin(t * 4) * 0.18;
        T.twist = Math.sin(t * 4) * 0.35;
        T.armLz = -(1.3 + Math.sin(t * 4) * 1.2);
        T.armRz = 1.3 - Math.sin(t * 4) * 1.2;
        T.elbowL = T.elbowR = -1.1;
        T.legL = Math.max(0, b) * -0.5;
        T.legR = Math.max(0, -b) * -0.5;
        T.kneeL = Math.max(0, b) * 0.9;
        T.kneeR = Math.max(0, -b) * 0.9;
        T.headRoll = Math.sin(t * 8) * 0.16;
        break;
      }
      case "sleep":
        T.bodyY = -0.06 + Math.sin(t * 1.4) * 0.015;
        T.headPitch = 0.42;
        T.headRoll = 0.26;
        T.armLz = -0.05;
        T.armRz = 0.05;
        T.elbowL = T.elbowR = -0.08;
        T.legL = T.legR = -0.12;
        T.kneeL = T.kneeR = 0.25;
        T.lean = 0.06;
        break;
      case "fly":
        T.bodyY = state.altitude + (state.altitude > 0.2 ? Math.sin(t * 3) * 0.08 : 0);
        T.sway = Math.sin(t * 2) * 0.1;
        T.armLz = -1.05;
        T.armRz = 1.05;
        T.elbowL = T.elbowR = -0.3;
        T.legL = T.legR = -0.2;
        T.kneeL = T.kneeR = state.altitude > 0.2 ? 0.6 : 0;
        T.lean = 0.14;
        break;
      case "sign": {
        // Both arms straight up holding the board overhead; shaking swings arms and body together
        const shake = state.signShake && !state.hovered && motion ? Math.sin(t * 16) : 0;
        T.armLz = -2.98 + shake * 0.12;
        T.armRz = 2.98 + shake * 0.12;
        T.elbowL = T.elbowR = -0.18;
        T.sway = shake * 0.06;
        T.bodyY = Math.abs(shake) * 0.03;
        T.headPitch = -0.12;
        T.headRoll = shake * 0.08;
        followCursor = !state.signShake;
        break;
      }
      case "charge":
        T.bodyY = Math.sin(t * 4) * 0.015;
        T.armLz = -0.3;
        T.armRz = 0.3;
        T.elbowL = T.elbowR = -0.35;
        T.headPitch = -0.28;
        break;
    }

    if (state.headYaw !== null) T.headYaw = state.headYaw;
    else if (followCursor && near && motion) {
      // Turn the head toward the cursor (relative to where the body is facing)
      T.headYaw = clamp(Math.atan2(dx, 260) - facing, -1.1, 1.1);
      T.headPitch = clamp(dy / 320, -0.35, 0.3);
    }

    const rate = motion ? 14 : 1000;
    for (const k of Object.keys(J) as (keyof Joints)[]) J[k] = damp(J[k], T[k], k === "bodyY" ? 20 : rate, motion ? dt : 1);

    // Apply
    root.position.x = layout.homeX - state.x;
    root.rotation.y = yaw + J.twist;
    body.position.y = J.bodyY;
    body.rotation.x = J.lean;
    body.rotation.z = J.sway;
    legL.hip.rotation.x = J.legL;
    legR.hip.rotation.x = J.legR;
    legL.knee.rotation.x = J.kneeL;
    legR.knee.rotation.x = J.kneeR;
    armL.shoulder.rotation.set(J.armLx, 0, J.armLz);
    armR.shoulder.rotation.set(J.armRx, 0, J.armRz);
    armL.elbow.rotation.x = J.elbowL;
    armR.elbow.rotation.x = J.elbowR;
    head.rotation.set(J.headPitch, J.headYaw, J.headRoll);

    carried.visible = state.carrying;
    placed.visible = state.placed;
    laptop.visible = pose === "type";
    // Both hands are on the board in the "sign" pose
    heldLaptop.visible = state.holdingLaptop && pose !== "type" && pose !== "sign";
    // Presenting: turn the laptop to face the viewer (undoing the raised forearm); otherwise carry it at the side
    const presenting = pose === "present";
    heldLaptop.rotation.x = damp(heldLaptop.rotation.x, presenting ? 1.7 : 0.08, 10, motion ? dt : 1);
    heldLaptop.rotation.y = damp(heldLaptop.rotation.y, presenting ? 0 : -0.6, 10, motion ? dt : 1);
    heldLaptop.position.x = damp(heldLaptop.position.x, presenting ? 0.08 : -0.1, 10, motion ? dt : 1);
    battery.visible = pose === "charge";
    for (const f of flames) {
      f.visible = pose === "fly";
      if (f.visible) f.scale.set(1, 0.8 + Math.random() * 0.45, 1);
    }
    if (battery.visible) {
      const level = clamp(scriptClock / 3, 0.05, 1);
      fill.scale.x = level;
      batteryFill.color.setHSL(0.08 + level * 0.3, 0.85, 0.5);
      batteryFill.emissive.copy(batteryFill.color);
    }
    glow.emissiveIntensity = motion ? 0.7 + Math.sin(t * 4) * 0.4 : 1;

    // Shadow shrinks as MECA leaves the ground
    const lift = Math.max(0, J.bodyY);
    shadow.position.x = root.position.x;
    shadow.scale.setScalar(Math.max(14, 40 - lift * 16));
    shadowMat.opacity = Math.max(0.25, 1 - lift * 0.5);

    // Face: blink every few seconds, eyes drift toward the cursor
    if (motion && t > nextBlink + 0.13) nextBlink = t + 2.5 + Math.random() * 3;
    const blink = motion && t > nextBlink && state.mood !== "sleep";
    const mood: RobotMood = state.hovered ? "happy" : state.mood;
    const look = followCursor && near && motion;
    drawFace(mood, blink, look ? clamp(dx / 40, -10, 10) : 0, look ? clamp(dy / 50, -6, 8) : 0);

    // Ground box drops in from above
    if (state.box !== boxWas) {
      boxWas = state.box;
      boxClock = 0;
      groundBox.rotation.y = (Math.random() - 0.5) * 0.6;
    }
    groundBox.visible = state.box !== null;
    if (state.box !== null) {
      boxClock += dt;
      const f = boxClock;
      const y = f < 0.55 ? 200 * (1 - (f / 0.55) ** 2) : f < 0.8 ? Math.sin((Math.PI * (f - 0.55)) / 0.25) * 8 : 0;
      groundBox.position.set(layout.homeX - state.box, y + 0.22 * S, 6);
      groundBox.rotation.z = f < 0.55 ? (1 - f / 0.55) * 0.5 : 0;
    }

    // Bug scuttles; squashes flat when stomped
    bug.visible = state.bug !== null;
    if (state.bug) {
      const moving = Math.abs(state.bug.x - bugLastX) > 0.01;
      bugLastX = state.bug.x;
      bug.position.set(layout.homeX - state.bug.x, 0, 8);
      bug.rotation.y = 0;
      bugLegs.forEach((leg, i) => (leg.rotation.z = moving ? Math.sin(t * 40 + i * 1.7) * 0.5 : 0));
      if (state.bug.squashed) {
        bugClock += dt;
        bug.scale.set(S * (1 + Math.min(bugClock, 0.15) * 2), S * Math.max(0.12, 1 - bugClock * 6), S);
        if (bugClock > 0.7) bug.scale.setScalar(S * Math.max(0.001, 1 - (bugClock - 0.7) * 3));
      } else {
        bugClock = 0;
        bug.scale.setScalar(S);
      }
    }

    // Keep the click target (and speech bubble) over the robot
    overlay.style.transform = `translate(${-state.x}px, ${-(flying ? lift : 0) * S}px)`;

    renderer.render(scene, camera);

    // Tell the page when the mouse moves onto or off the laptop in MECA's hand. While it is being
    // shown (lifted to the chest) anywhere on MECA counts, so moving the laptop doesn't flicker the card.
    const groundY = window.innerHeight - layout.margin;
    const nearRobot = Math.abs(pointer.x - headX) < 70 && pointer.y > groundY - 2.6 * S - J.bodyY * S && pointer.y < groundY + 12;
    const over = pointer.known && (hitsLaptop(pointer.x, pointer.y) || (state.presenting && nearRobot));
    if (over !== overLaptop) {
      overLaptop = over;
      opts.onLaptopHover?.(over);
    }
  }

  raf = requestAnimationFrame(frame);

  return {
    state,
    hitsLaptop,
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      for (const d of disposables) d.dispose();
    },
  };
}

/** The angle equivalent to `target` (mod 2π) closest to `from`. */
function nearest(from: number, target: number) {
  const turn = Math.PI * 2;
  return target + Math.round((from - target) / turn) * turn;
}
