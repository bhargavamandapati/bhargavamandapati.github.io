import * as THREE from 'three'
import type { SimState } from '@/data/simulator'

/**
 * The 3D scene, built from primitives rather than a downloaded model so the
 * page ships no binary asset and every part stays individually addressable —
 * a door has to rotate, a window has to slide, an indicator has to blink.
 *
 * Kept free of React: the component owns the lifecycle and pushes state in.
 */

const BODY = 0x2f6f8f
const BODY_DARK = 0x1d4b63
const GLASS = 0x0b1622
const TYRE = 0x14181f
const ROAD = 0x1b1f27

type Wheel = { group: THREE.Group; mesh: THREE.Mesh; steers: boolean }

/** Values the scene derives that the dashboard needs to read back. */
export type Readout = {
  /** Speed actually applied, after gear, ignition and parking brake. */
  effectiveSpeed: number
  /** Cabin temperature, which lags the target rather than jumping to it. */
  cabinTemp: number
  lowTyres: string[]
}

export type CarScene = {
  update: (state: SimState, delta: number, elapsed: number) => Readout
  resize: (width: number, height: number) => void
  render: () => void
  dispose: () => void
  setCameraPreset: (preset: CameraPreset) => void
}

export type CameraPreset = 'three-quarter' | 'side' | 'front' | 'top'

const PRESETS: Record<CameraPreset, THREE.Vector3> = {
  'three-quarter': new THREE.Vector3(5.6, 3.0, 6.6),
  side: new THREE.Vector3(9.4, 1.7, 0.2),
  front: new THREE.Vector3(0.2, 1.6, 9.0),
  top: new THREE.Vector3(0.01, 10.5, 0.01),
}
/** What the camera aims at — the middle of the car, not the ground. */
const LOOK_AT = new THREE.Vector3(0, 0.95, 0)

function box(w: number, h: number, d: number, color: number, opts: THREE.MeshStandardMaterialParameters = {}) {
  const geo = new THREE.BoxGeometry(w, h, d)
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.25, ...opts })
  return new THREE.Mesh(geo, mat)
}

export function createCarScene(canvas: HTMLCanvasElement, width: number, height: number): CarScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height, false)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  // Fades the far end of the road instead of ending it at a visible edge.
  const fog = new THREE.Fog(0x0a0e14, 22, 62)
  scene.fog = fog
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 200)
  camera.position.copy(PRESETS['three-quarter'])
  camera.lookAt(LOOK_AT)

  // ---- Lighting -----------------------------------------------------------
  const hemi = new THREE.HemisphereLight(0xbcd7ff, 0x0a0e14, 1.1)
  scene.add(hemi)
  const key = new THREE.DirectionalLight(0xffffff, 2.0)
  key.position.set(7, 11, 6)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.camera.left = -9
  key.shadow.camera.right = 9
  key.shadow.camera.top = 9
  key.shadow.camera.bottom = -9
  scene.add(key)
  const rim = new THREE.DirectionalLight(0x66d9ff, 0.5)
  rim.position.set(-6, 4, -7)
  scene.add(rim)

  // ---- Road ---------------------------------------------------------------
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 170),
    new THREE.MeshStandardMaterial({ color: ROAD, roughness: 0.95 }),
  )
  road.rotation.x = -Math.PI / 2
  road.receiveShadow = true
  scene.add(road)

  // Dashes scroll to convey speed without moving the car out of frame.
  const dashes: THREE.Mesh[] = []
  const dashGeo = new THREE.PlaneGeometry(0.22, 2.6)
  const dashMat = new THREE.MeshBasicMaterial({ color: 0x8ea3bd })
  for (let i = 0; i < 26; i++) {
    for (const x of [-3.6, 3.6]) {
      const d = new THREE.Mesh(dashGeo, dashMat)
      d.rotation.x = -Math.PI / 2
      d.position.set(x, 0.012, -60 + i * 5)
      dashes.push(d)
      scene.add(d)
    }
  }
  // Lane markings for lane keep assist.
  const laneMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0 })
  // Both share laneMat, so opacity is animated once for the pair.
  for (const x of [-2.1, 2.1]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 130), laneMat)
    m.rotation.x = -Math.PI / 2
    m.position.set(x, 0.014, 0)
    scene.add(m)
  }

  // ---- Car ----------------------------------------------------------------
  const car = new THREE.Group()
  scene.add(car)

  // Main body, sitting on the wheels.
  const lower = box(1.96, 0.52, 4.4, BODY)
  lower.position.y = 0.72
  lower.castShadow = true
  car.add(lower)

  // Bonnet, lower than the cabin so the car reads as a car from any angle.
  const bonnet = box(1.86, 0.16, 1.3, BODY)
  bonnet.position.set(0, 1.02, 1.5)
  bonnet.castShadow = true
  car.add(bonnet)

  // Rear deck.
  const deck = box(1.86, 0.14, 0.7, BODY)
  deck.position.set(0, 1.12, -1.82)
  deck.castShadow = true
  car.add(deck)

  const sill = box(2.02, 0.2, 4.2, BODY_DARK)
  sill.position.y = 0.5
  car.add(sill)

  // Cabin, set back and tapered by stacking two boxes.
  const cabin = box(1.72, 0.5, 2.1, BODY)
  cabin.position.set(0, 1.22, -0.2)
  cabin.castShadow = true
  car.add(cabin)

  const roof = box(1.56, 0.08, 1.75, BODY_DARK)
  roof.position.set(0, 1.5, -0.3)
  roof.castShadow = true
  car.add(roof)

  const glassMat = new THREE.MeshStandardMaterial({
    color: GLASS,
    roughness: 0.08,
    metalness: 0.6,
    transparent: true,
    opacity: 0.82,
  })
  const windscreen = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.68), glassMat)
  windscreen.position.set(0, 1.3, 0.92)
  windscreen.rotation.x = -0.5
  car.add(windscreen)
  const rearGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.56), glassMat)
  rearGlass.position.set(0, 1.3, -1.28)
  rearGlass.rotation.x = 0.55
  car.add(rearGlass)

  // ---- Doors (hinge groups so they swing, not slide) ----------------------
  // Hinged at the leading edge, like a real door.
  function makeDoor(x: number, frontEdge: number, length: number) {
    const hinge = new THREE.Group()
    hinge.position.set(x, 0.86, frontEdge)
    const panel = box(0.07, 0.66, length, BODY_DARK)
    panel.position.z = -length / 2
    panel.castShadow = true
    hinge.add(panel)
    car.add(hinge)
    return hinge
  }
  const doors = {
    frontLeft: makeDoor(-0.99, 0.78, 1.0),
    frontRight: makeDoor(0.99, 0.78, 1.0),
    rearLeft: makeDoor(-0.99, -0.28, 0.95),
    rearRight: makeDoor(0.99, -0.28, 0.95),
  }

  const boot = new THREE.Group()
  boot.position.set(0, 1.2, -1.2)
  const bootPanel = box(1.8, 0.1, 0.98, BODY_DARK)
  bootPanel.position.z = -0.49
  bootPanel.castShadow = true
  boot.add(bootPanel)
  car.add(boot)

  // ---- Windows (slide down into the door) ---------------------------------
  function makeWindow(x: number) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.42), glassMat.clone())
    m.position.set(x, 1.28, 0.3)
    m.rotation.y = Math.PI / 2
    car.add(m)
    return m
  }
  const windows = { left: makeWindow(-0.87), right: makeWindow(0.87) }

  // ---- Mirrors ------------------------------------------------------------
  function makeMirror(x: number) {
    const g = new THREE.Group()
    g.position.set(x, 1.2, 0.76)
    const arm = box(0.22, 0.09, 0.09, BODY_DARK)
    arm.position.x = (0.11 * x) / Math.abs(x)
    g.add(arm)
    car.add(g)
    return g
  }
  const mirrors = { left: makeMirror(-0.98), right: makeMirror(0.98) }

  // ---- Wheels -------------------------------------------------------------
  const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.3, 22)
  const wheels: Record<string, Wheel> = {}
  const wheelPositions: [string, number, number, boolean][] = [
    ['frontLeft', -0.98, 1.42, true],
    ['frontRight', 0.98, 1.42, true],
    ['rearLeft', -0.98, -1.42, false],
    ['rearRight', 0.98, -1.42, false],
  ]
  for (const [name, x, z, steers] of wheelPositions) {
    const group = new THREE.Group()
    group.position.set(x, 0.42, z)
    const mesh = new THREE.Mesh(
      wheelGeo,
      new THREE.MeshStandardMaterial({ color: TYRE, roughness: 0.85 }),
    )
    mesh.rotation.z = Math.PI / 2
    mesh.castShadow = true
    group.add(mesh)
    // A hub spoke, so rotation is visible.
    const spoke = box(0.06, 0.5, 0.06, 0xc8d4e3)
    spoke.rotation.z = Math.PI / 2
    mesh.add(spoke)
    car.add(group)
    wheels[name] = { group, mesh, steers }
  }

  // Tyre pressure warning rings.
  const tyreWarnings: Record<string, THREE.Mesh> = {}
  for (const [name, x, z] of wheelPositions) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.52, 0.045, 8, 26),
      new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0 }),
    )
    ring.position.set(x, 0.42, z)
    ring.rotation.y = Math.PI / 2
    car.add(ring)
    tyreWarnings[name] = ring
  }

  // ---- Lights -------------------------------------------------------------
  function lamp(x: number, z: number, color: number, size = 0.16) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(size, 14, 14),
      new THREE.MeshBasicMaterial({ color }),
    )
    m.position.set(x, 0.92, z)
    car.add(m)
    return m
  }
  const headlamps = [lamp(-0.64, 2.18, 0xfff3d0), lamp(0.64, 2.18, 0xfff3d0)]
  const fogLamps = [lamp(-0.78, 2.16, 0xfff0c0, 0.09), lamp(0.78, 2.16, 0xfff0c0, 0.09)]
  fogLamps.forEach((f) => (f.position.y = 0.62))
  const tailLamps = [lamp(-0.66, -2.18, 0xff3b30), lamp(0.66, -2.18, 0xff3b30)]
  const indicators = {
    left: [lamp(-0.9, 2.1, 0xffa021, 0.1), lamp(-0.9, -2.1, 0xffa021, 0.1)],
    right: [lamp(0.9, 2.1, 0xffa021, 0.1), lamp(0.9, -2.1, 0xffa021, 0.1)],
  }
  const reverseLamps = [lamp(-0.36, -2.18, 0xffffff, 0.09), lamp(0.36, -2.18, 0xffffff, 0.09)]

  const fogBeams = [-0.78, 0.78].map((x) => {
    const light = new THREE.SpotLight(0xffe9b0, 0, 16, 0.75, 0.8, 1.0)
    light.position.set(x, 0.62, 2.2)
    light.target.position.set(x * 2.2, 0, 9)
    car.add(light)
    car.add(light.target)
    return light
  })

  const beams = [-0.68, 0.68].map((x) => {
    const light = new THREE.SpotLight(0xfff0cf, 0, 40, 0.34, 0.6, 1.0)
    light.position.set(x, 0.92, 2.2)
    light.target.position.set(x * 1.6, 0, 24)
    car.add(light)
    car.add(light.target)
    return light
  })

  // ---- Charge port --------------------------------------------------------
  const chargeFlap = new THREE.Group()
  chargeFlap.position.set(-1.0, 0.85, -1.65)
  const flapPanel = box(0.04, 0.3, 0.32, 0xdbe6f2)
  flapPanel.position.z = 0.16
  chargeFlap.add(flapPanel)
  car.add(chargeFlap)
  const cable = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 1.6, 10),
    new THREE.MeshStandardMaterial({ color: 0x1f2937 }),
  )
  cable.position.set(-1.5, 0.5, -1.65)
  cable.rotation.z = Math.PI / 2.6
  cable.visible = false
  car.add(cable)

  // ---- HVAC airflow -------------------------------------------------------
  // Small planes drifting through the cabin: count follows fan speed, colour
  // follows the set temperature, direction follows the fan-direction flags.
  const AIRFLOW = 90
  const airGeo = new THREE.PlaneGeometry(0.05, 0.2)
  const airMat = new THREE.MeshBasicMaterial({
    color: 0x67e8f9,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  })
  const airflow = new THREE.InstancedMesh(airGeo, airMat, AIRFLOW)
  airflow.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  car.add(airflow)
  const particles = Array.from({ length: AIRFLOW }, () => ({
    x: (Math.random() - 0.5) * 1.4,
    y: 0.9 + Math.random() * 0.5,
    z: Math.random() * 2 - 1,
    speed: 0.4 + Math.random() * 0.8,
  }))
  const dummy = new THREE.Object3D()

  // ---- Wipers -------------------------------------------------------------
  const wiperArms = [-0.4, 0.4].map((x) => {
    const g = new THREE.Group()
    g.position.set(x, 1.0, 1.33)
    const blade = box(0.7, 0.03, 0.03, 0x0f172a)
    blade.position.x = 0.34
    g.add(blade)
    car.add(g)
    return g
  })

  // ---- State --------------------------------------------------------------
  let wheelSpin = 0
  let roadOffset = 0
  let cabinTemp = 21
  let targetCamera = PRESETS['three-quarter'].clone()

  function update(state: SimState, delta: number, elapsed: number): Readout {
    const powered = state.ignition >= 3
    // Cruise control pulls actual speed towards the target when engaged.
    const moving = state.gear === 0x0008 || state.gear === 0x0002
    const effectiveSpeed = powered && moving && !state.parkingBrake ? state.speed : 0
    const direction = state.gear === 0x0002 ? -1 : 1

    // Wheels and road.
    wheelSpin += effectiveSpeed * delta * direction * 2.2
    for (const w of Object.values(wheels)) {
      w.mesh.rotation.x = wheelSpin
      if (w.steers) w.group.rotation.y = (-state.steeringAngle * Math.PI) / 180 / 1.6
    }
    roadOffset = (roadOffset + effectiveSpeed * delta * direction) % 5
    for (let i = 0; i < dashes.length; i++) {
      const base = -60 + Math.floor(i / 2) * 5
      dashes[i].position.z = ((base + roadOffset + 75) % 150) - 60
    }
    dashMat.opacity = 1

    // Body roll and pitch give motion some weight.
    car.rotation.z = THREE.MathUtils.damp(
      car.rotation.z,
      (-state.steeringAngle / 35) * 0.05 * Math.min(effectiveSpeed / 20, 1),
      4,
      delta,
    )
    car.position.y = Math.sin(elapsed * 9) * 0.006 * Math.min(effectiveSpeed / 10, 1)

    // Doors.
    doors.frontLeft.rotation.y = THREE.MathUtils.damp(doors.frontLeft.rotation.y, state.doorFrontLeft ? -1.0 : 0, 6, delta)
    doors.frontRight.rotation.y = THREE.MathUtils.damp(doors.frontRight.rotation.y, state.doorFrontRight ? 1.0 : 0, 6, delta)
    doors.rearLeft.rotation.y = THREE.MathUtils.damp(doors.rearLeft.rotation.y, state.doorRearLeft ? -0.95 : 0, 6, delta)
    doors.rearRight.rotation.y = THREE.MathUtils.damp(doors.rearRight.rotation.y, state.doorRearRight ? 0.95 : 0, 6, delta)
    boot.rotation.x = THREE.MathUtils.damp(boot.rotation.x, state.bootOpen ? -0.9 : 0, 5, delta)

    // Windows slide into the door.
    windows.left.position.y = THREE.MathUtils.damp(windows.left.position.y, 1.28 - (state.windowFrontLeft / 100) * 0.46, 6, delta)
    windows.right.position.y = THREE.MathUtils.damp(windows.right.position.y, 1.28 - (state.windowFrontRight / 100) * 0.46, 6, delta)
    ;(windows.left.material as THREE.Material).opacity = 0.82 * (1 - state.windowFrontLeft / 100)
    ;(windows.right.material as THREE.Material).opacity = 0.82 * (1 - state.windowFrontRight / 100)

    // Mirrors.
    mirrors.left.rotation.y = THREE.MathUtils.damp(mirrors.left.rotation.y, state.mirrorFold ? -1.3 : 0, 6, delta)
    mirrors.right.rotation.y = THREE.MathUtils.damp(mirrors.right.rotation.y, state.mirrorFold ? 1.3 : 0, 6, delta)

    // Lights.
    const headOn = powered && state.headlights
    headlamps.forEach((l) => ((l.material as THREE.MeshBasicMaterial).color.setHex(headOn ? 0xfff6dd : 0x4a4f57)))
    beams.forEach((b) => (b.intensity = headOn ? (state.highBeam ? 2600 : 1100) : 0))
    beams.forEach((b) => (b.angle = state.highBeam ? 0.26 : 0.36))
    const fogOn = powered && state.fogLights
    fogLamps.forEach((l) => ((l.material as THREE.MeshBasicMaterial).color.setHex(fogOn ? 0xfff0c0 : 0x4a4f57)))
    fogBeams.forEach((f) => (f.intensity = fogOn ? 420 : 0))
    const braking = state.parkingBrake && powered
    tailLamps.forEach((l) => ((l.material as THREE.MeshBasicMaterial).color.setHex(braking ? 0xff2d20 : headOn ? 0x8f1a14 : 0x3a1f1e)))
    reverseLamps.forEach((l) => ((l.material as THREE.MeshBasicMaterial).color.setHex(state.gear === 0x0002 && powered ? 0xffffff : 0x4a4f57)))

    const blink = Math.sin(elapsed * 8) > 0
    const leftOn = powered && blink && (state.hazard || state.turnSignal === 2)
    const rightOn = powered && blink && (state.hazard || state.turnSignal === 1)
    indicators.left.forEach((l) => ((l.material as THREE.MeshBasicMaterial).color.setHex(leftOn ? 0xffb020 : 0x4a3a20)))
    indicators.right.forEach((l) => ((l.material as THREE.MeshBasicMaterial).color.setHex(rightOn ? 0xffb020 : 0x4a3a20)))

    // Night mode changes the whole scene, as it does in a real cockpit.
    fog.color.lerp(new THREE.Color(state.nightMode ? 0x05070b : 0x0a0e14), 1 - Math.exp(-3 * delta))
    hemi.intensity = THREE.MathUtils.damp(hemi.intensity, state.nightMode ? 0.16 : 1.1, 3, delta)
    key.intensity = THREE.MathUtils.damp(key.intensity, state.nightMode ? 0.18 : 2.0, 3, delta)
    rim.intensity = THREE.MathUtils.damp(rim.intensity, state.nightMode ? 0.25 : 0.5, 3, delta)

    // Charge port.
    chargeFlap.rotation.y = THREE.MathUtils.damp(chargeFlap.rotation.y, state.chargePortOpen ? -1.4 : 0, 6, delta)
    cable.visible = state.chargePortOpen && state.chargePortConnected

    // Tyre pressure warnings.
    const pressures: Record<string, number> = {
      frontLeft: state.tyreFrontLeft,
      frontRight: state.tyreFrontRight,
      rearLeft: state.tyreRearLeft,
      rearRight: state.tyreRearRight,
    }
    for (const [name, ring] of Object.entries(tyreWarnings)) {
      const low = pressures[name] < 180
      const mat = ring.material as THREE.MeshBasicMaterial
      mat.opacity = THREE.MathUtils.damp(mat.opacity, low ? 0.55 + Math.sin(elapsed * 5) * 0.3 : 0, 8, delta)
    }

    // Lane keep assist markings.
    laneMat.opacity = THREE.MathUtils.damp(laneMat.opacity, state.laneKeepEnabled && effectiveSpeed > 5 ? 0.75 : 0, 5, delta)

    // HVAC airflow.
    const fanActive = state.hvacPower && state.hvacFanSpeed > 0
    const visible = fanActive ? Math.round((state.hvacFanSpeed / 6) * AIRFLOW) : 0
    // Blue when cooling the cabin, red when heating it.
    const warm = state.hvacTemp > cabinTemp
    airMat.color.setHex(warm ? 0xfb7185 : 0x67e8f9)
    airMat.opacity = THREE.MathUtils.damp(airMat.opacity, fanActive ? 0.55 : 0, 6, delta)
    const toFloor = (state.hvacFanDirection & 0x2) !== 0
    const toDefrost = (state.hvacFanDirection & 0x4) !== 0
    for (let i = 0; i < AIRFLOW; i++) {
      const p = particles[i]
      if (i < visible) {
        p.z += p.speed * delta * (0.6 + state.hvacFanSpeed * 0.25)
        if (toFloor) p.y -= delta * 0.35
        if (toDefrost) p.y += delta * 0.3
        if (p.z > 1.2 || p.y < 0.55 || p.y > 1.6) {
          p.z = -1.1
          p.y = toDefrost ? 1.0 : 0.9 + Math.random() * 0.45
          p.x = (Math.random() - 0.5) * 1.4
        }
        dummy.position.set(p.x, p.y, p.z)
        dummy.scale.setScalar(1)
      } else {
        dummy.scale.setScalar(0)
      }
      dummy.updateMatrix()
      airflow.setMatrixAt(i, dummy.matrix)
    }
    airflow.instanceMatrix.needsUpdate = true

    // Cabin temperature drifts towards the target, or outside when off.
    const goal = state.hvacPower && state.hvacFanSpeed > 0 ? state.hvacTemp : state.outsideTemp
    const rate = state.hvacPower ? 0.25 + state.hvacFanSpeed * 0.12 : 0.05
    cabinTemp = THREE.MathUtils.damp(cabinTemp, goal, rate, delta)

    // Wipers.
    const wiperSpeed = state.wipers >= 8 ? 5.5 : state.wipers >= 3 ? 1.6 : 0
    const sweep = wiperSpeed > 0 ? Math.abs(Math.sin(elapsed * wiperSpeed)) * 1.0 : 0
    wiperArms.forEach((w) => (w.rotation.z = sweep))

    camera.position.lerp(targetCamera, 1 - Math.exp(-4 * delta))
    camera.lookAt(LOOK_AT)

    return {
      effectiveSpeed,
      cabinTemp,
      lowTyres: Object.entries(pressures)
        .filter(([, kpa]) => kpa < 180)
        .map(([name]) => name),
    }
  }

  return {
    update,
    render: () => renderer.render(scene, camera),
    resize: (w, h) => {
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    },
    setCameraPreset: (preset) => {
      targetCamera = PRESETS[preset].clone()
    },
    dispose: () => {
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        const mat = mesh.material
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
        else if (mat) (mat as THREE.Material).dispose()
      })
      renderer.dispose()
    },
  }
}
