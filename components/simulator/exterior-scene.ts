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

  const roof = box(1.62, 0.12, 1.9, PANEL)
  roof.position.set(0, 0.94, -0.3)
  roof.castShadow = true
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
    const speed = powered && moving && !state.parkingBrake ? state.speed : 0
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
    const headOn = powered && state.headlights
    headlamps.forEach((l) => (l.material as THREE.MeshBasicMaterial).color.setHex(headOn ? 0xfff6dd : 0x4a4f57))
    beamMat.opacity = THREE.MathUtils.damp(beamMat.opacity, headOn ? (state.highBeam ? 0.3 : 0.18) : 0, 6, delta)
    beams.forEach((b, i) => {
      b.scale.y = state.highBeam ? 1.5 : 1
      b.position.z = (state.highBeam ? 7 : 5.2)
      b.position.x = (i === 0 ? -0.9 : 0.9)
    })
    const braking = powered && state.parkingBrake
    taillamps.forEach((l) => (l.material as THREE.MeshBasicMaterial).color.setHex(braking ? 0xff2d20 : headOn ? 0x8f1a14 : 0x3a1f1e))
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

    hemi.intensity = THREE.MathUtils.damp(hemi.intensity, state.nightMode ? 0.22 : 1.4, 3, delta)
    key.intensity = THREE.MathUtils.damp(key.intensity, state.nightMode ? 0.2 : 2.2, 3, delta)
    dashMat.color.setHex(state.nightMode ? 0x4a5568 : 0x8ea3bd)
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
