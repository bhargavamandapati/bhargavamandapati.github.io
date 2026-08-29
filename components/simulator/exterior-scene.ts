import * as THREE from 'three'
import type { SimState } from '@/data/simulator'

/**
 * Top-down exterior view.
 *
 * Looking straight down is the only angle where door and boot state is
 * unambiguous, which is what this panel is for — the interior view cannot show
 * you that the rear left door is open.
 */

const BODY = 0x2f6f8f
const BODY_DARK = 0x235a76
const PANEL = 0x1d4b63
const ROAD = 0x141922

export type ExteriorScene = {
  update: (state: SimState, delta: number, elapsed: number) => void
  render: () => void
  resize: (w: number, h: number) => void
  dispose: () => void
}

function box(w: number, h: number, d: number, color: number, extra: THREE.MeshStandardMaterialParameters = {}) {
  return new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.15, ...extra }),
  )
}

export function createExteriorScene(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): ExteriorScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height, false)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()

  // Orthographic keeps the car the same size wherever it sits in frame.
  const FRUSTUM = 7.0
  const aspect = width / height
  const camera = new THREE.OrthographicCamera(
    (-FRUSTUM * aspect) / 2,
    (FRUSTUM * aspect) / 2,
    FRUSTUM / 2,
    -FRUSTUM / 2,
    0.1,
    60,
  )
  camera.up.set(0, 0, 1)
  camera.position.set(0, 14, 0)
  camera.lookAt(0, 0, 0)

  const hemi = new THREE.HemisphereLight(0xcfe4ff, 0x0b0f16, 1.4)
  scene.add(hemi)
  const key = new THREE.DirectionalLight(0xffffff, 2.2)
  key.position.set(4, 12, 5)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  const cam = key.shadow.camera as THREE.OrthographicCamera
  cam.left = -6
  cam.right = 6
  cam.top = 6
  cam.bottom = -6
  scene.add(key)

  // ---- Road ---------------------------------------------------------------
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({ color: ROAD, roughness: 0.98 }),
  )
  road.rotation.x = -Math.PI / 2
  road.receiveShadow = true
  scene.add(road)

  const dashMat = new THREE.MeshBasicMaterial({ color: 0x8ea3bd })
  const dashes: THREE.Mesh[] = []
  const dashGeo = new THREE.PlaneGeometry(0.16, 1.5)
  for (let i = 0; i < 14; i++) {
    for (const x of [-2.3, 2.3]) {
      const d = new THREE.Mesh(dashGeo, dashMat)
      d.rotation.x = -Math.PI / 2
      d.position.set(x, 0.01, -9 + i * 3)
      dashes.push(d)
      scene.add(d)
    }
  }

  // ---- Car ----------------------------------------------------------------
  const car = new THREE.Group()
  scene.add(car)

  // Nose points +Z throughout this project.
  const body = box(1.94, 0.5, 4.36, BODY)
  body.position.y = 0.62
  body.castShadow = true
  car.add(body)

  const bonnet = box(1.8, 0.1, 1.16, BODY_DARK)
  bonnet.position.set(0, 0.88, 1.5)
  car.add(bonnet)

  // Semi-transparent so occupants and seats read as being inside the cabin.
  const roof = box(1.62, 0.12, 1.9, PANEL, { transparent: true, opacity: 0.45 })
  roof.position.set(0, 0.94, -0.3)
  car.add(roof)

  const windscreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 0.66),
    new THREE.MeshStandardMaterial({ color: 0x0b1622, roughness: 0.1, metalness: 0.5 }),
  )
  windscreen.rotation.x = -Math.PI / 2
  windscreen.position.set(0, 0.9, 0.78)
  car.add(windscreen)

  // ---- Doors --------------------------------------------------------------
  // Hinged at the FRONT edge. The panel extends backwards from the hinge, so
  // a positive rotation on the right side and a negative one on the left both
  // swing the trailing edge away from the body — outwards.
  function makeDoor(side: 1 | -1, frontEdge: number, length: number) {
    const hinge = new THREE.Group()
    hinge.position.set(side * 0.98, 0.68, frontEdge)
    const panel = box(0.08, 0.44, length, BODY_DARK)
    panel.position.z = -length / 2
    panel.castShadow = true
    hinge.add(panel)
    // A window strip so an open door reads clearly from above.
    const glass = box(0.05, 0.02, length * 0.8, 0x0b1622)
    glass.position.set(side * 0.03, 0.24, -length / 2)
    hinge.add(glass)
    car.add(hinge)
    return hinge
  }
  const doors = {
    frontLeft: makeDoor(1, 0.82, 1.02),
    frontRight: makeDoor(-1, 0.82, 1.02),
    rearLeft: makeDoor(1, -0.26, 0.96),
    rearRight: makeDoor(-1, -0.26, 0.96),
  }

  // Boot hinges at its front edge and lifts up and back.
  const boot = new THREE.Group()
  boot.position.set(0, 0.92, -1.22)
  const bootPanel = box(1.7, 0.1, 1.0, BODY_DARK)
  bootPanel.position.z = -0.5
  bootPanel.castShadow = true
  boot.add(bootPanel)
  car.add(boot)

  // ---- Wheels -------------------------------------------------------------
  const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.26, 20)
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x232a35, roughness: 0.85 })
  const wheels: { group: THREE.Group; mesh: THREE.Mesh; steers: boolean }[] = []
  const warnings: { ring: THREE.Mesh; key: keyof SimState }[] = []
  const layout: [number, number, boolean, keyof SimState][] = [
    [0.96, 1.4, true, 'tyreFrontLeft'],
    [-0.96, 1.4, true, 'tyreFrontRight'],
    [0.96, -1.4, false, 'tyreRearLeft'],
    [-0.96, -1.4, false, 'tyreRearRight'],
  ]
  for (const [x, z, steers, key] of layout) {
    const group = new THREE.Group()
    group.position.set(x, 0.4, z)
    const mesh = new THREE.Mesh(wheelGeo, wheelMat)
    mesh.rotation.z = Math.PI / 2
    mesh.castShadow = true
    const spoke = box(0.06, 0.46, 0.06, 0xb8c6d8)
    spoke.rotation.z = Math.PI / 2
    mesh.add(spoke)
    group.add(mesh)
    car.add(group)
    wheels.push({ group, mesh, steers })

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.5, 0.05, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0 }),
    )
    ring.rotation.x = -Math.PI / 2
    ring.position.set(x, 0.82, z)
    car.add(ring)
    warnings.push({ ring, key })
  }

  // ---- Lights -------------------------------------------------------------
  function lamp(x: number, z: number, w: number, d: number, color: number) {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(w, 0.06, d),
      new THREE.MeshBasicMaterial({ color }),
    )
    m.position.set(x, 0.9, z)
    car.add(m)
    return m
  }
  const noseFlash = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.05, 0.42),
    new THREE.MeshBasicMaterial({ color: 0x2f6f8f }),
  )
  noseFlash.position.set(0, 0.9, 1.92)
  noseFlash.rotation.y = Math.PI / 4
  car.add(noseFlash)

  const headlamps = [lamp(-0.6, 2.14, 0.5, 0.16, 0x4a4f57), lamp(0.6, 2.14, 0.5, 0.16, 0x4a4f57)]
  const taillamps = [lamp(-0.6, -2.14, 0.5, 0.14, 0x3a1f1e), lamp(0.6, -2.14, 0.5, 0.14, 0x3a1f1e)]
  const indicators = {
    left: [lamp(0.92, 2.05, 0.14, 0.3, 0x4a3a20), lamp(0.92, -2.05, 0.14, 0.3, 0x4a3a20)],
    right: [lamp(-0.92, 2.05, 0.14, 0.3, 0x4a3a20), lamp(-0.92, -2.05, 0.14, 0.3, 0x4a3a20)],
  }
  const reverse = [lamp(-0.3, -2.14, 0.22, 0.12, 0x4a4f57), lamp(0.3, -2.14, 0.22, 0.12, 0x4a4f57)]

  // Beam pools on the road, so headlights read from directly above.
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xfff3d6,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const beams = [-0.6, 0.6].map((x) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 5.5), beamMat)
    m.rotation.x = -Math.PI / 2
    m.position.set(x * 1.5, 0.02, 5.2)
    scene.add(m)
    return m
  })

  // Side windows — from above these are glass strips that clear as they lower.
  const windowMat = () =>
    new THREE.MeshStandardMaterial({ color: 0x0b1622, roughness: 0.1, metalness: 0.5, transparent: true })
  const windows = {
    left: (() => {
      const m = box(0.06, 0.02, 0.9, 0x0b1622)
      m.material = windowMat()
      m.position.set(0.99, 0.86, 0.32)
      car.add(m)
      return m
    })(),
    right: (() => {
      const m = box(0.06, 0.02, 0.9, 0x0b1622)
      m.material = windowMat()
      m.position.set(-0.99, 0.86, 0.32)
      car.add(m)
      return m
    })(),
  }

  // Mirrors — fold, angle, heat and the blind-spot indicator all show here.
  function makeMirror(side: 1 | -1) {
    const arm = new THREE.Group()
    arm.position.set(side * 0.98, 0.86, 0.84)
    const stalk = box(0.16, 0.05, 0.06, BODY_DARK)
    stalk.position.x = side * 0.08
    arm.add(stalk)
    const glass = box(0.1, 0.03, 0.16, 0x8fb6cc)
    glass.position.set(side * 0.16, 0.03, 0)
    arm.add(glass)
    const bsw = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.02, 0.06),
      new THREE.MeshBasicMaterial({ color: 0x2a2f38 }),
    )
    bsw.position.set(side * 0.16, 0.06, -0.08)
    arm.add(bsw)
    car.add(arm)
    return { arm, glass, bsw }
  }
  const mirrors = { left: makeMirror(1), right: makeMirror(-1) }

  // Occupants, visible from directly above.
  function occupant(x: number, z: number) {
    const g = new THREE.Group()
    g.position.set(x, 1.0, z)
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0xd8c3a5, roughness: 0.8 }),
    )
    g.add(head)
    const headrest = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.06, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 }),
    )
    headrest.position.set(0, 0.02, -0.16)
    headrest.name = 'headrest'
    g.add(headrest)
    const shoulders = box(0.42, 0.1, 0.24, 0x334155)
    shoulders.position.z = -0.22
    g.add(shoulders)
    car.add(g)
    return g
  }
  const driverFigure = occupant(0.52, 0.2)
  const passengerFigure = occupant(-0.52, 0.2)
  passengerFigure.visible = false

  // Seat pads, which glow when heated.
  const seatPads = [0.52, -0.52].map((x) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, 0.7),
      new THREE.MeshBasicMaterial({ color: 0xfb7185, transparent: true, opacity: 0 }),
    )
    m.rotation.x = -Math.PI / 2
    m.position.set(x, 0.97, 0.05)
    car.add(m)
    return m
  })

  // Door lock markers.
  const lockMarks = [
    [0.99, 0.5],
    [-0.99, 0.5],
    [0.99, -0.6],
    [-0.99, -0.6],
  ].map(([x, z]) => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.03, 0.11),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0 }),
    )
    m.position.set(x, 0.98, z)
    m.rotation.y = Math.PI / 4
    car.add(m)
    return m
  })

  // Horn pulse.
  const hornRings = [0, 1, 2].map((i) => {
    const m = new THREE.Mesh(
      new THREE.RingGeometry(1.6, 1.72, 48),
      new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0, side: THREE.DoubleSide }),
    )
    m.rotation.x = -Math.PI / 2
    m.position.y = 0.05
    m.userData.phase = i / 3
    scene.add(m)
    return m
  })

  // Trailer.
  const trailer = new THREE.Group()
  trailer.position.set(0, 0, -4.4)
  const trailerBody = box(1.8, 0.5, 2.6, 0x3f4b5c)
  trailerBody.position.y = 0.62
  trailerBody.castShadow = true
  trailer.add(trailerBody)
  const tow = box(0.1, 0.08, 0.9, 0x2a3340)
  tow.position.set(0, 0.5, 1.7)
  trailer.add(tow)
  for (const x of [0.9, -0.9]) {
    const w = new THREE.Mesh(wheelGeo, new THREE.MeshStandardMaterial({ color: 0x232a35, roughness: 0.85 }))
    w.rotation.z = Math.PI / 2
    w.position.set(x, 0.4, -0.4)
    trailer.add(w)
  }
  trailer.visible = false
  scene.add(trailer)

  // Charge cable.
  const cable = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 1.5, 10),
    new THREE.MeshStandardMaterial({ color: 0x1f2937 }),
  )
  cable.position.set(1.6, 0.3, -1.6)
  cable.rotation.z = Math.PI / 2
  cable.visible = false
  car.add(cable)
  const chargePulse = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0x5eead4 }),
  )
  chargePulse.visible = false
  car.add(chargePulse)

  // Parking sensor arcs.
  const parkArcs = [1, 2, 3].map((i) => {
    const m = new THREE.Mesh(
      new THREE.RingGeometry(2.4 + i * 0.36, 2.5 + i * 0.36, 32, 1, Math.PI * 0.72, Math.PI * 0.56),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0, side: THREE.DoubleSide }),
    )
    m.rotation.x = -Math.PI / 2
    m.position.y = 0.06
    scene.add(m)
    return m
  })

  // Impact flashes on the struck side.
  const impactPanels = {
    front: new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.5), new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0 })),
    rear: new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.5), new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0 })),
    left: new THREE.Mesh(new THREE.PlaneGeometry(0.5, 4.4), new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0 })),
    right: new THREE.Mesh(new THREE.PlaneGeometry(0.5, 4.4), new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0 })),
  }
  impactPanels.front.rotation.x = -Math.PI / 2
  impactPanels.front.position.set(0, 1.02, 2.4)
  impactPanels.rear.rotation.x = -Math.PI / 2
  impactPanels.rear.position.set(0, 1.02, -2.4)
  impactPanels.left.rotation.x = -Math.PI / 2
  impactPanels.left.position.set(1.35, 1.02, 0)
  impactPanels.right.rotation.x = -Math.PI / 2
  impactPanels.right.position.set(-1.35, 1.02, 0)
  Object.values(impactPanels).forEach((m) => car.add(m))

  // Footwell glow, and window/child lock markers.
  const footwells = [0.52, -0.52].map((x) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.44, 0.4),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0 }),
    )
    m.rotation.x = -Math.PI / 2
    m.position.set(x, 0.96, 0.85)
    car.add(m)
    return m
  })
  const rearLockMarks = [
    [0.99, -0.6],
    [-0.99, -0.6],
  ].map(([x, z]) => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.03, 0.09),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0 }),
    )
    m.position.set(x, 1.02, z)
    car.add(m)
    return m
  })

  // Cross-traffic arrows at the four corners.
  const crossArrows: Record<number, THREE.Mesh> = {}
  for (const [code, x, z] of [
    [2, 1.5, 2.0],
    [3, -1.5, 2.0],
    [6, 1.5, -2.0],
    [7, -1.5, -2.0],
  ] as const) {
    const m = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.5, 3),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0 }),
    )
    m.rotation.x = Math.PI / 2
    m.position.set(x, 0.4, z)
    scene.add(m)
    crossArrows[code] = m
  }

  // Lead vehicle for adaptive cruise control.
  const lead = new THREE.Group()
  const leadBody = box(1.8, 0.6, 4.0, 0x3f4b5c)
  leadBody.position.y = 0.7
  lead.add(leadBody)
  const leadTail = box(1.4, 0.08, 0.1, 0xff3b30)
  leadTail.position.set(0, 0.9, -2.0)
  lead.add(leadTail)
  lead.visible = false
  scene.add(lead)

  // Charge flap.
  const flap = new THREE.Group()
  flap.position.set(0.98, 0.72, -1.6)
  const flapPanel = box(0.06, 0.24, 0.3, 0xdbe6f2)
  flapPanel.position.z = 0.15
  flap.add(flapPanel)
  car.add(flap)

  let spin = 0
  let scroll = 0

  function update(state: SimState, delta: number, elapsed: number) {
    const powered = state.ignition >= 3
    const moving = state.gear === 0x0008 || state.gear === 0x0002
    const braked = state.aeb === 2
    const cruising = state.cruiseEnabled ? state.cruiseTarget : state.speed
    const pedalScale = 1 - state.brakePedal / 100
    const speed = powered && moving && !state.parkingBrake && !braked ? cruising * pedalScale : 0
    const forward = state.gear === 0x0002 ? -1 : 1

    // The car is fixed and the world moves past it, so the road travels
    // BACKWARDS when the car drives forwards.
    spin += speed * delta * forward * 2.4
    scroll = (scroll - speed * delta * forward) % 3
    for (let i = 0; i < dashes.length; i++) {
      const base = -9 + Math.floor(i / 2) * 3
      dashes[i].position.z = ((base + scroll + 21) % 42) - 9
    }

    for (const w of wheels) {
      w.mesh.rotation.x = spin
      if (w.steers) w.group.rotation.y = (-state.steeringAngle * Math.PI) / 180 / 1.7
    }

    // Doors swing outwards: trailing edge away from the body on each side.
    const open = 1.15
    doors.frontLeft.rotation.y = THREE.MathUtils.damp(doors.frontLeft.rotation.y, state.doorFrontLeft ? -open : 0, 6, delta)
    doors.frontRight.rotation.y = THREE.MathUtils.damp(doors.frontRight.rotation.y, state.doorFrontRight ? open : 0, 6, delta)
    doors.rearLeft.rotation.y = THREE.MathUtils.damp(doors.rearLeft.rotation.y, state.doorRearLeft ? -open * 0.9 : 0, 6, delta)
    doors.rearRight.rotation.y = THREE.MathUtils.damp(doors.rearRight.rotation.y, state.doorRearRight ? open * 0.9 : 0, 6, delta)
    boot.rotation.x = THREE.MathUtils.damp(boot.rotation.x, state.bootOpen ? -1.1 : 0, 5, delta)
    flap.rotation.y = THREE.MathUtils.damp(flap.rotation.y, state.chargePortOpen ? 1.5 : 0, 6, delta)

    // Lights.
    // The old FOG_LIGHTS and the newer FRONT_FOG_LIGHTS both light the front pair.
    const fogLampsOn = powered && (state.fogLights || state.frontFog === 1)
    const headOn = powered && state.headlights
    headlamps.forEach((l) => (l.material as THREE.MeshBasicMaterial).color.setHex(headOn ? 0xfff6dd : 0x4a4f57))
    beamMat.opacity = THREE.MathUtils.damp(beamMat.opacity, headOn ? (state.highBeam ? 0.3 : 0.18) : 0, 6, delta)
    beams.forEach((b, i) => {
      b.scale.y = state.highBeam ? 1.5 : 1
      b.position.z = (state.highBeam ? 7 : 5.2)
      b.position.x = (i === 0 ? -0.9 : 0.9)
    })
    const braking = powered && (state.parkingBrake || state.brakePedal > 3)
    const rearFogOn = powered && state.rearFog === 1
    taillamps.forEach((l) =>
      (l.material as THREE.MeshBasicMaterial).color.setHex(
        braking ? 0xff2d20 : rearFogOn ? 0xd92d20 : headOn ? 0x8f1a14 : 0x3a1f1e,
      ),
    )
    reverse.forEach((l) => (l.material as THREE.MeshBasicMaterial).color.setHex(powered && state.gear === 0x0002 ? 0xf1f5f9 : 0x4a4f57))

    const blink = Math.sin(elapsed * 8) > 0
    const left = powered && blink && (state.hazard || state.turnSignal === 2)
    const right = powered && blink && (state.hazard || state.turnSignal === 1)
    indicators.left.forEach((l) => (l.material as THREE.MeshBasicMaterial).color.setHex(left ? 0xffb020 : 0x4a3a20))
    indicators.right.forEach((l) => (l.material as THREE.MeshBasicMaterial).color.setHex(right ? 0xffb020 : 0x4a3a20))

    for (const { ring, key } of warnings) {
      const low = (state[key] as number) < 180
      const mat = ring.material as THREE.MeshBasicMaterial
      mat.opacity = THREE.MathUtils.damp(mat.opacity, low ? 0.5 + Math.sin(elapsed * 5) * 0.3 : 0, 8, delta)
    }

    // Side windows lower and clear.
    const glassLeft = windows.left.material as THREE.MeshStandardMaterial
    const glassRight = windows.right.material as THREE.MeshStandardMaterial
    glassLeft.opacity = THREE.MathUtils.damp(glassLeft.opacity, 1 - state.windowFrontLeft / 100, 6, delta)
    glassRight.opacity = THREE.MathUtils.damp(glassRight.opacity, 1 - state.windowFrontRight / 100, 6, delta)
    windows.left.scale.z = THREE.MathUtils.damp(windows.left.scale.z, 1 - (state.windowFrontLeft / 100) * 0.7, 6, delta)
    windows.right.scale.z = THREE.MathUtils.damp(windows.right.scale.z, 1 - (state.windowFrontRight / 100) * 0.7, 6, delta)

    // Mirrors: fold, angle, heat and blind spot.
    for (const [side, m] of [[1, mirrors.left], [-1, mirrors.right]] as const) {
      m.arm.rotation.y = THREE.MathUtils.damp(m.arm.rotation.y, state.mirrorFold ? side * 1.5 : 0, 6, delta)
      m.glass.rotation.y = THREE.MathUtils.damp(m.glass.rotation.y, (state.mirrorY / 30) * 0.5, 6, delta)
      const heat = m.glass.material as THREE.MeshStandardMaterial
      heat.emissive.setHex(0xfb7185)
      heat.emissiveIntensity = THREE.MathUtils.damp(heat.emissiveIntensity, (state.mirrorHeat / 3) * 0.8, 5, delta)
      const warn = m.bsw.material as THREE.MeshBasicMaterial
      warn.color.setHex(state.blindSpot === 2 && Math.sin(elapsed * 9) > 0 ? 0xfbbf24 : 0x2a2f38)
    }

    // Occupants and their seats.
    passengerFigure.visible = state.seatOccupancy === 2
    driverFigure.position.z = THREE.MathUtils.damp(driverFigure.position.z, 0.2 - state.seatForeAft / 200, 5, delta)
    for (const figure of [driverFigure, passengerFigure]) {
      const headrest = figure.getObjectByName('headrest')
      if (headrest) {
        headrest.position.z = THREE.MathUtils.damp(headrest.position.z, -0.16 - state.headrestHeight / 600, 5, delta)
      }
    }
    driverFigure.position.y = THREE.MathUtils.damp(driverFigure.position.y, 1.0 + state.seatHeight / 400, 5, delta)
    seatPads[0].position.z = THREE.MathUtils.damp(seatPads[0].position.z, 0.05 - state.seatForeAft / 200, 5, delta)
    seatPads[0].scale.x = THREE.MathUtils.damp(seatPads[0].scale.x, 1 - state.seatBolster / 150, 5, delta)
    driverFigure.rotation.x = THREE.MathUtils.damp(driverFigure.rotation.x, (state.backrestAngle / 30) * 0.3, 5, delta)
    seatPads.forEach((pad, i) => {
      const mat = pad.material as THREE.MeshBasicMaterial
      const level = state.hvacPower ? Math.abs(state.seatHeat) / 3 : 0
      mat.color.setHex(state.seatHeat >= 0 ? 0xfb7185 : 0x67e8f9)
      mat.opacity = THREE.MathUtils.damp(mat.opacity, i === 1 && state.seatOccupancy !== 2 ? level * 0.35 : level * 0.5, 5, delta)
    })

    // Door locks.
    lockMarks.forEach((m) => {
      const mat = m.material as THREE.MeshBasicMaterial
      mat.opacity = THREE.MathUtils.damp(mat.opacity, state.doorLock ? 0.85 : 0, 6, delta)
    })

    // Horn pulse.
    hornRings.forEach((ring, i) => {
      const mat = ring.material as THREE.MeshBasicMaterial
      if (state.horn && powered) {
        const t = ((elapsed * 1.4 + (i as number) / 3) % 1)
        ring.scale.setScalar(1 + t * 2.2)
        mat.opacity = 0.5 * (1 - t)
      } else {
        mat.opacity = THREE.MathUtils.damp(mat.opacity, 0, 8, delta)
      }
    })

    // Trailer.
    trailer.visible = state.trailer === 2
    trailer.rotation.y = THREE.MathUtils.damp(trailer.rotation.y, (state.steeringAngle / 35) * 0.25, 3, delta)

    // Charge cable and its flow pulse.
    const plugged = state.chargePortOpen && state.chargePortConnected
    cable.visible = plugged
    const charging = plugged && state.chargeState === 1
    chargePulse.visible = charging
    if (charging) {
      const t = (elapsed * 0.9) % 1
      chargePulse.position.set(2.3 - t * 1.4, 0.3, -1.6)
    }

      const leadMetres = state.leadDistance / 1000
    lead.visible = leadMetres > 0.5
    if (lead.visible) lead.position.set(0, 0, 2.2 + Math.min(leadMetres, 9))

    // Rear-wheel steering.
    for (const w of wheels) {
      if (!w.steers) w.group.rotation.y = (-state.rearSteering * Math.PI) / 180 / 1.7
    }

    // Parking sensor arcs — closer means fewer, redder rings.
    const parkM = state.parkingDistance
    parkArcs.forEach((arc, i) => {
      const mat = arc.material as THREE.MeshBasicMaterial
      const active = parkM > 0 && parkM < 2500 - i * 700
      mat.color.setHex(parkM > 0 && parkM < 700 ? 0xef4444 : parkM < 1500 ? 0xfbbf24 : 0x22d3ee)
      mat.opacity = THREE.MathUtils.damp(mat.opacity, active ? 0.55 : 0, 8, delta)
      // Arcs sit at whichever end the car is heading.
      arc.rotation.z = state.gear === 0x0002 ? 0 : Math.PI
    })

    // Impact flashes.
    const hit = Math.sin(elapsed * 12) > 0 ? 0.7 : 0.15
    const setImpact = (mesh: THREE.Mesh, on: boolean) => {
      const mat = mesh.material as THREE.MeshBasicMaterial
      mat.opacity = THREE.MathUtils.damp(mat.opacity, on ? hit : 0, 10, delta)
    }
    setImpact(impactPanels.front, (state.impact & 0x1) !== 0)
    setImpact(impactPanels.rear, (state.impact & 0x2) !== 0)
    setImpact(impactPanels.left, (state.impact & 0x4) !== 0)
    setImpact(impactPanels.right, (state.impact & 0x8) !== 0)

    // Footwell lights and the rear locks.
    footwells.forEach((f) => {
      const mat = f.material as THREE.MeshBasicMaterial
      mat.opacity = THREE.MathUtils.damp(mat.opacity, state.footwellLights === 1 ? 0.4 : 0, 5, delta)
    })
    rearLockMarks.forEach((m) => {
      const mat = m.material as THREE.MeshBasicMaterial
      mat.opacity = THREE.MathUtils.damp(mat.opacity, state.windowLock || state.childLock ? 0.85 : 0, 6, delta)
    })

    // Cross traffic.
    for (const [code, arrow] of Object.entries(crossArrows)) {
      const mat = arrow.material as THREE.MeshBasicMaterial
      const on = state.crossTrafficEnabled && state.crossTrafficWarning === Number(code) && Math.sin(elapsed * 9) > 0
      mat.opacity = THREE.MathUtils.damp(mat.opacity, on ? 0.9 : 0, 10, delta)
    }

    // Lane departure warning tints the markings on the side you drift towards.
    const warnLeft = state.laneDeparture === 2
    const warnRight = state.laneDeparture === 3
    dashMat.color.setHex(
      warnLeft || warnRight ? 0xfbbf24 : state.nightMode ? 0x4a5568 : 0x8ea3bd,
    )

    hemi.intensity = THREE.MathUtils.damp(hemi.intensity, state.nightMode ? 0.22 : 1.4, 3, delta)
    key.intensity = THREE.MathUtils.damp(key.intensity, state.nightMode ? 0.2 : 2.2, 3, delta)
  }

  return {
    update,
    render: () => renderer.render(scene, camera),
    resize: (w, h) => {
      const a = w / h
      camera.left = (-FRUSTUM * a) / 2
      camera.right = (FRUSTUM * a) / 2
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    },
    dispose: () => {
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
        const mat = m.material
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
        else if (mat) (mat as THREE.Material).dispose()
      })
      renderer.dispose()
    },
  }
}
