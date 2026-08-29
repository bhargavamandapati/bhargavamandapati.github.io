import * as THREE from 'three'
import type { SimState } from '@/data/simulator'

/**
 * The driver's view: cluster, centre screen, steering wheel and its controls,
 * gear selector, vents and the road through the windscreen.
 *
 * The cluster and the IVI are drawn to 2D canvases and used as textures. Real
 * text at real resolution is the point — a cluster made of extruded meshes
 * would look like a cluster and read like nothing.
 */

const DASH = 0x161b24
const DASH_LIGHT = 0x222a36
const TRIM = 0x2f6f8f

export type InteriorScene = {
  update: (state: SimState, readout: Readout, delta: number, elapsed: number) => void
  render: () => void
  resize: (w: number, h: number) => void
  dispose: () => void
}

export type Readout = {
  effectiveSpeed: number
  cabinTemp: number
  lowTyres: number
}

const GEAR_LABEL: Record<number, string> = { 0x0004: 'P', 0x0002: 'R', 0x0001: 'N', 0x0008: 'D' }

/** A canvas sized for crisp text at the size the panel is drawn on screen. */
function makePanel(w: number, h: number) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return { canvas, ctx, texture }
}

export function createInteriorScene(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): InteriorScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height, false)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(52, width / height, 0.05, 120)
  // Driver's eye position, looking slightly down at the dash.
  camera.position.set(0.34, 1.22, -0.5)
  camera.lookAt(0.24, 1.0, 1.6)

  scene.add(new THREE.HemisphereLight(0xa9c6ea, 0x0a0d12, 0.9))
  const cabinLight = new THREE.PointLight(0xbfd8ff, 6, 6)
  cabinLight.position.set(0, 1.6, 0.2)
  scene.add(cabinLight)
  const screenGlow = new THREE.PointLight(0x67e8f9, 2.4, 2.6)
  screenGlow.position.set(0.16, 1.02, 0.86)
  scene.add(screenGlow)

  // ---- Road seen through the windscreen -----------------------------------
  const world = new THREE.Group()
  scene.add(world)
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 260),
    new THREE.MeshStandardMaterial({ color: 0x10151d, roughness: 1 }),
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.set(0, -0.02, 60)
  world.add(ground)
  const laneMat = new THREE.MeshBasicMaterial({ color: 0x9fb2c9 })
  const laneDashes: THREE.Mesh[] = []
  const laneGeo = new THREE.PlaneGeometry(0.22, 3.4)
  for (let i = 0; i < 40; i++) {
    for (const x of [-3.4, 3.4]) {
      const d = new THREE.Mesh(laneGeo, laneMat)
      d.rotation.x = -Math.PI / 2
      d.position.set(x, 0, i * 7)
      laneDashes.push(d)
      world.add(d)
    }
  }
  scene.fog = new THREE.Fog(0x0a0e14, 30, 150)
  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 90),
    new THREE.MeshBasicMaterial({ color: 0x111a26, fog: false }),
  )
  sky.position.set(0, 20, 150)
  world.add(sky)

  // ---- Cabin shell --------------------------------------------------------
  const shellMat = new THREE.MeshStandardMaterial({ color: DASH, roughness: 0.85, side: THREE.DoubleSide })
  const roof = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.6), shellMat)
  roof.rotation.x = Math.PI / 2
  roof.position.set(0, 1.62, 0.1)
  scene.add(roof)
  for (const x of [-1.06, 1.06]) {
    const side = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.6), shellMat)
    side.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2
    side.position.set(x, 0.9, 0.1)
    scene.add(side)
  }

  // Dashboard.
  const dash = new THREE.Mesh(
    new THREE.BoxGeometry(2.12, 0.66, 0.5),
    new THREE.MeshStandardMaterial({ color: DASH, roughness: 0.8 }),
  )
  dash.position.set(0, 0.66, 1.0)
  scene.add(dash)
  // The upper fascia slopes away, so the screen area is not blocked.
  const dashTop = new THREE.Mesh(
    new THREE.BoxGeometry(2.12, 0.05, 0.62),
    new THREE.MeshStandardMaterial({ color: DASH_LIGHT, roughness: 0.7 }),
  )
  dashTop.position.set(0, 0.99, 1.2)
  dashTop.rotation.x = 0.12
  scene.add(dashTop)
  // A brand accent strip across the fascia.
  const trim = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 0.03, 0.03),
    new THREE.MeshStandardMaterial({ color: TRIM, emissive: TRIM, emissiveIntensity: 0.4 }),
  )
  trim.position.set(0, 0.86, 0.76)
  scene.add(trim)

  // A-pillars frame the view the way a real cabin does.
  for (const x of [-0.92, 0.92]) {
    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 1.5, 0.13),
      new THREE.MeshStandardMaterial({ color: DASH, roughness: 0.9 }),
    )
    pillar.position.set(x, 1.24, 1.34)
    pillar.rotation.x = -0.3
    scene.add(pillar)
  }

  // ---- Instrument cluster -------------------------------------------------
  const cluster = makePanel(1024, 420)
  const clusterMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.58, 0.238),
    new THREE.MeshBasicMaterial({ map: cluster.texture, toneMapped: false }),
  )
  clusterMesh.position.set(0.34, 1.06, 0.72)
  clusterMesh.rotation.y = Math.PI
  clusterMesh.rotation.x = 0.16
  scene.add(clusterMesh)

  // ---- Centre screen (IVI) ------------------------------------------------
  const ivi = makePanel(900, 620)
  const iviMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.46, 0.317),
    new THREE.MeshBasicMaterial({ map: ivi.texture, toneMapped: false }),
  )
  iviMesh.position.set(-0.3, 1.09, 0.78)
  // Angled towards the driver, then flipped to face them.
  iviMesh.rotation.y = Math.PI - 0.3
  iviMesh.rotation.x = 0.08
  scene.add(iviMesh)

  // ---- Steering wheel + SWC ----------------------------------------------
  const wheel = new THREE.Group()
  wheel.position.set(0.34, 0.86, 0.3)
  wheel.rotation.x = -0.5
  scene.add(wheel)
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.17, 0.022, 12, 40),
    new THREE.MeshStandardMaterial({ color: 0x0e1219, roughness: 0.6 }),
  )
  wheel.add(rim)
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 0.03, 18),
    new THREE.MeshStandardMaterial({ color: 0x1a212b, roughness: 0.5 }),
  )
  hub.rotation.x = Math.PI / 2
  wheel.add(hub)
  for (const angle of [-0.55, 0.55, Math.PI]) {
    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(0.145, 0.022, 0.014),
      new THREE.MeshStandardMaterial({ color: 0x1a212b, roughness: 0.5 }),
    )
    spoke.position.set(Math.cos(angle) * 0.1, Math.sin(angle) * 0.1, 0)
    spoke.rotation.z = angle
    wheel.add(spoke)
  }
  // Steering wheel controls — small illuminated pads on the spokes.
  const swcMat = () =>
    new THREE.MeshStandardMaterial({ color: 0x243040, emissive: 0x0e7490, emissiveIntensity: 0.3 })
  const swc = [-1, 1].map((side) => {
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.05, 0.016), swcMat())
    pad.position.set(side * 0.1, 0.012, 0.014)
    wheel.add(pad)
    return pad
  })

  // ---- Gear selector ------------------------------------------------------
  const console3d = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.16, 0.7),
    new THREE.MeshStandardMaterial({ color: DASH_LIGHT, roughness: 0.75 }),
  )
  console3d.position.set(-0.06, 0.5, 0.2)
  scene.add(console3d)
  const lever = new THREE.Group()
  lever.position.set(-0.04, 0.58, 0.26)
  const leverStick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.016, 0.02, 0.12, 12),
    new THREE.MeshStandardMaterial({ color: 0x0e1219, roughness: 0.5 }),
  )
  leverStick.position.y = 0.06
  lever.add(leverStick)
  const knob = new THREE.Mesh(
    new THREE.SphereGeometry(0.032, 14, 14),
    new THREE.MeshStandardMaterial({ color: 0x1a212b, roughness: 0.4 }),
  )
  knob.position.y = 0.13
  lever.add(knob)
  scene.add(lever)

  const gearPanel = makePanel(256, 340)
  const gearMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.09, 0.12),
    new THREE.MeshBasicMaterial({ map: gearPanel.texture, transparent: true, toneMapped: false }),
  )
  gearMesh.rotation.x = -Math.PI / 2
  gearMesh.position.set(-0.18, 0.585, 0.26)
  scene.add(gearMesh)

  // ---- HVAC vents and airflow --------------------------------------------
  const ventPositions = [-0.72, -0.1, 0.5, 0.86]
  for (const x of ventPositions) {
    const vent = new THREE.Mesh(
      new THREE.BoxGeometry(0.17, 0.055, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x0b0e13, roughness: 0.9 }),
    )
    vent.position.set(x, 0.9, 0.79)
    scene.add(vent)
  }

  const AIR = 260
  const airGeo = new THREE.PlaneGeometry(0.012, 0.075)
  const airMat = new THREE.MeshBasicMaterial({
    color: 0x67e8f9,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
  const airflow = new THREE.InstancedMesh(airGeo, airMat, AIR)
  airflow.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  scene.add(airflow)
  const particles = Array.from({ length: AIR }, () => ({
    x: ventPositions[Math.floor(Math.random() * ventPositions.length)] + (Math.random() - 0.5) * 0.15,
    y: 0.9,
    z: 0.78,
    vy: 0,
    speed: 0.5 + Math.random() * 0.9,
    life: Math.random(),
  }))
  const dummy = new THREE.Object3D()

  // ---- Drawing the cluster ------------------------------------------------
  function drawCluster(state: SimState, readout: Readout, elapsed: number) {
    const { ctx, canvas: c } = cluster
    const w = c.width
    const h = c.height
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#070a0f'
    ctx.fillRect(0, 0, w, h)

    const powered = state.ignition >= 3
    if (!powered) {
      ctx.fillStyle = '#1e2530'
      ctx.font = '600 34px ui-monospace, monospace'
      ctx.textAlign = 'center'
      ctx.fillText('IGNITION OFF', w / 2, h / 2)
      cluster.texture.needsUpdate = true
      return
    }

    const kmh = Math.round(readout.effectiveSpeed * 3.6)

    // Speed arc.
    const cx = w * 0.28
    const cy = h * 0.56
    const r = 128
    ctx.lineWidth = 14
    ctx.strokeStyle = '#182231'
    ctx.beginPath()
    ctx.arc(cx, cy, r, Math.PI * 0.78, Math.PI * 2.22)
    ctx.stroke()
    ctx.strokeStyle = '#22d3ee'
    ctx.beginPath()
    ctx.arc(cx, cy, r, Math.PI * 0.78, Math.PI * 0.78 + Math.PI * 1.44 * Math.min(kmh / 200, 1))
    ctx.stroke()
    ctx.fillStyle = '#e6edf6'
    ctx.textAlign = 'center'
    ctx.font = '700 78px ui-sans-serif, system-ui'
    ctx.fillText(String(kmh), cx, cy + 16)
    ctx.fillStyle = '#7d8ea6'
    ctx.font = '500 22px ui-monospace, monospace'
    ctx.fillText('km/h', cx, cy + 52)

    // RPM arc.
    const rx = w * 0.72
    ctx.lineWidth = 14
    ctx.strokeStyle = '#182231'
    ctx.beginPath()
    ctx.arc(rx, cy, r, Math.PI * 0.78, Math.PI * 2.22)
    ctx.stroke()
    ctx.strokeStyle = state.engineRpm > 5500 ? '#f87171' : '#5eead4'
    ctx.beginPath()
    ctx.arc(rx, cy, r, Math.PI * 0.78, Math.PI * 0.78 + Math.PI * 1.44 * Math.min(state.engineRpm / 7000, 1))
    ctx.stroke()
    ctx.fillStyle = '#e6edf6'
    ctx.font = '700 60px ui-sans-serif, system-ui'
    ctx.fillText(String(Math.round(state.engineRpm)), rx, cy + 12)
    ctx.fillStyle = '#7d8ea6'
    ctx.font = '500 22px ui-monospace, monospace'
    ctx.fillText('rpm', rx, cy + 48)

    // Gear.
    ctx.fillStyle = '#22d3ee'
    ctx.font = '700 54px ui-monospace, monospace'
    ctx.fillText(GEAR_LABEL[state.gear] ?? '-', w / 2, h * 0.44)
    ctx.fillStyle = '#4a5568'
    ctx.font = '500 18px ui-monospace, monospace'
    ctx.fillText(`${state.batteryLevel}%  ·  ${Math.round((state.batteryLevel / 100) * 420)} km`, w / 2, h * 0.62)
    ctx.fillText(`OUT ${state.outsideTemp}°C   CABIN ${readout.cabinTemp.toFixed(1)}°C`, w / 2, h * 0.72)

    // Telltales.
    const tells: [boolean, string, string][] = [
      [state.parkingBrake, 'P', '#f87171'],
      [readout.lowTyres > 0, '(!)', '#fbbf24'],
      [state.headlights, state.highBeam ? '≡D' : '≡', '#38bdf8'],
      [state.cruiseEnabled, 'CC', '#5eead4'],
      [state.laneKeepEnabled, 'LKA', '#5eead4'],
      [state.hvacAc && state.hvacPower, 'A/C', '#5eead4'],
      [state.chargePortConnected && state.chargePortOpen, '⚡', '#5eead4'],
    ]
    let tx = 40
    ctx.textAlign = 'left'
    ctx.font = '700 26px ui-monospace, monospace'
    for (const [on, label, color] of tells) {
      if (!on) continue
      ctx.fillStyle = color
      ctx.fillText(label, tx, 48)
      tx += ctx.measureText(label).width + 26
    }

    // Indicator arrows.
    const blink = Math.sin(elapsed * 8) > 0
    ctx.font = '700 34px ui-monospace, monospace'
    ctx.fillStyle = blink && (state.hazard || state.turnSignal === 2) ? '#22c55e' : '#161d27'
    ctx.textAlign = 'center'
    ctx.fillText('◀', w * 0.4, h * 0.44)
    ctx.fillStyle = blink && (state.hazard || state.turnSignal === 1) ? '#22c55e' : '#161d27'
    ctx.fillText('▶', w * 0.6, h * 0.44)

    cluster.texture.needsUpdate = true
  }

  // ---- Drawing the centre screen -----------------------------------------
  function drawIvi(state: SimState, readout: Readout) {
    const { ctx, canvas: c } = ivi
    const w = c.width
    const h = c.height
    ctx.fillStyle = '#0a0f16'
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = '#0e1620'
    ctx.fillRect(0, 0, w, 58)
    ctx.fillStyle = '#7d8ea6'
    ctx.font = '600 24px ui-monospace, monospace'
    ctx.textAlign = 'left'
    ctx.fillText('CLIMATE', 26, 38)
    ctx.textAlign = 'right'
    ctx.fillStyle = state.hvacPower ? '#22d3ee' : '#3d4757'
    ctx.fillText(state.hvacPower ? 'ON' : 'OFF', w - 26, 38)

    if (!state.hvacPower) {
      ctx.fillStyle = '#2a3340'
      ctx.font = '600 30px ui-sans-serif, system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('HVAC_POWER_ON is false', w / 2, h / 2 - 10)
      ctx.font = '400 21px ui-sans-serif, system-ui'
      ctx.fillText('every control below is inert', w / 2, h / 2 + 28)
      ivi.texture.needsUpdate = true
      return
    }

    // Target temperature.
    ctx.textAlign = 'center'
    ctx.fillStyle = state.hvacTemp > readout.cabinTemp ? '#fb7185' : '#67e8f9'
    ctx.font = '700 108px ui-sans-serif, system-ui'
    ctx.fillText(state.hvacTemp.toFixed(1), w / 2, 190)
    ctx.fillStyle = '#7d8ea6'
    ctx.font = '500 26px ui-monospace, monospace'
    ctx.fillText('°C  TARGET', w / 2, 226)
    ctx.fillText(`CABIN ${readout.cabinTemp.toFixed(1)}°C`, w / 2, 264)

    // Fan bars.
    ctx.textAlign = 'left'
    ctx.fillStyle = '#7d8ea6'
    ctx.font = '600 22px ui-monospace, monospace'
    ctx.fillText('FAN', 40, 330)
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i < state.hvacFanSpeed ? '#22d3ee' : '#1a2431'
      ctx.fillRect(120 + i * 58, 306 + (5 - i) * 3, 44, 30 + i * 6)
    }

    // Direction and modes.
    const dir = state.hvacFanDirection
    const chips: [string, boolean][] = [
      ['FACE', (dir & 0x1) !== 0],
      ['FLOOR', (dir & 0x2) !== 0],
      ['DEFROST', (dir & 0x4) !== 0],
      ['A/C', state.hvacAc],
      ['RECIRC', state.hvacRecirc],
    ]
    let x = 40
    ctx.font = '600 20px ui-monospace, monospace'
    for (const [label, on] of chips) {
      const tw = ctx.measureText(label).width + 26
      ctx.fillStyle = on ? '#0e7490' : '#141c26'
      ctx.fillRect(x, 400, tw, 40)
      ctx.fillStyle = on ? '#e0f7ff' : '#4a5568'
      ctx.textAlign = 'center'
      ctx.fillText(label, x + tw / 2, 426)
      x += tw + 12
    }

    // Footer showing the property behind the screen.
    ctx.textAlign = 'left'
    ctx.fillStyle = '#2a3340'
    ctx.font = '500 18px ui-monospace, monospace'
    ctx.fillText('HVAC_TEMPERATURE_SET · HVAC_FAN_SPEED · HVAC_FAN_DIRECTION', 40, h - 30)

    ivi.texture.needsUpdate = true
  }

  function drawGear(state: SimState) {
    const { ctx, canvas: c } = gearPanel
    ctx.clearRect(0, 0, c.width, c.height)
    const order = [0x0004, 0x0002, 0x0001, 0x0008]
    ctx.textAlign = 'center'
    ctx.font = '700 54px ui-monospace, monospace'
    order.forEach((g, i) => {
      ctx.fillStyle = state.gear === g ? '#22d3ee' : '#2a3340'
      ctx.fillText(GEAR_LABEL[g], c.width / 2, 62 + i * 78)
    })
    gearPanel.texture.needsUpdate = true
  }

  let scroll = 0
  let lastCabin = 21

  function update(state: SimState, readout: Readout, delta: number, elapsed: number) {
    const powered = state.ignition >= 3
    const moving = state.gear === 0x0008 || state.gear === 0x0002
    const speed = powered && moving && !state.parkingBrake ? state.speed : 0
    const forward = state.gear === 0x0002 ? -1 : 1

    // Driving forward pulls the world towards the driver.
    scroll = (scroll - speed * delta * forward) % 7
    for (let i = 0; i < laneDashes.length; i++) {
      const base = Math.floor(i / 2) * 7
      laneDashes[i].position.z = ((base + scroll + 280) % 280) - 6
    }

    // Steering wheel, with the road banking slightly.
    wheel.rotation.z = THREE.MathUtils.damp(wheel.rotation.z, (-state.steeringAngle * Math.PI) / 180 * 2.2, 8, delta)
    world.rotation.z = THREE.MathUtils.damp(world.rotation.z, (state.steeringAngle / 35) * 0.05, 4, delta)
    camera.position.x = 0.34 + Math.sin(elapsed * 8) * 0.0025 * Math.min(speed / 12, 1)
    camera.position.y = 1.22 + Math.sin(elapsed * 11) * 0.002 * Math.min(speed / 12, 1)
    camera.lookAt(0.24 - (state.steeringAngle / 35) * 0.6, 1.0, 1.6)

    // SWC pads glow when cruise or lane keep is engaged.
    ;(swc[0].material as THREE.MeshStandardMaterial).emissiveIntensity = state.cruiseEnabled ? 1.6 : 0.25
    ;(swc[1].material as THREE.MeshStandardMaterial).emissiveIntensity = state.laneKeepEnabled ? 1.6 : 0.25

    // Gear lever slides through P R N D.
    const slot = [0x0004, 0x0002, 0x0001, 0x0008].indexOf(state.gear)
    lever.position.z = THREE.MathUtils.damp(lever.position.z, 0.34 - slot * 0.05, 8, delta)

    // Cabin temperature drifts.
    const goal = state.hvacPower && state.hvacFanSpeed > 0 ? state.hvacTemp : state.outsideTemp
    const rate = state.hvacPower ? 0.25 + state.hvacFanSpeed * 0.12 : 0.05
    lastCabin = THREE.MathUtils.damp(lastCabin, goal, rate, delta)
    readout.cabinTemp = lastCabin

    // Airflow from the vents.
    const active = state.hvacPower && state.hvacFanSpeed > 0
    const count = active ? Math.round((state.hvacFanSpeed / 6) * AIR) : 0
    airMat.color.setHex(state.hvacTemp > lastCabin ? 0xfb7185 : 0x67e8f9)
    airMat.opacity = THREE.MathUtils.damp(airMat.opacity, active ? 0.5 : 0, 6, delta)
    const toFloor = (state.hvacFanDirection & 0x2) !== 0
    const toDefrost = (state.hvacFanDirection & 0x4) !== 0
    const toFace = (state.hvacFanDirection & 0x1) !== 0
    for (let i = 0; i < AIR; i++) {
      const p = particles[i]
      if (i < count) {
        const push = 0.5 + state.hvacFanSpeed * 0.32
        p.z -= p.speed * delta * push
        if (toFloor) p.vy = -0.55
        else if (toDefrost) p.vy = 0.5
        else if (toFace) p.vy = -0.04
        p.y += p.vy * delta
        if (p.z < -0.6 || p.y < 0.45 || p.y > 1.5) {
          p.z = 0.78
          p.y = toDefrost ? 1.04 : 0.9
          p.x = ventPositions[Math.floor(Math.random() * ventPositions.length)] + (Math.random() - 0.5) * 0.15
          p.vy = 0
        }
        dummy.position.set(p.x, p.y, p.z)
        dummy.rotation.set(0, 0, 0)
        dummy.scale.setScalar(1)
      } else {
        dummy.scale.setScalar(0)
      }
      dummy.updateMatrix()
      airflow.setMatrixAt(i, dummy.matrix)
    }
    airflow.instanceMatrix.needsUpdate = true

    // Night mode dims the cabin; the screens stay lit.
    cabinLight.intensity = THREE.MathUtils.damp(cabinLight.intensity, state.nightMode ? 1.1 : 6, 3, delta)
    screenGlow.intensity = powered ? (state.nightMode ? 3.4 : 2.4) : 0
    ;(scene.fog as THREE.Fog).color.lerp(
      new THREE.Color(state.nightMode ? 0x04070b : 0x0a0e14),
      1 - Math.exp(-3 * delta),
    )
    laneMat.color.setHex(state.nightMode && !state.headlights ? 0x3b4655 : 0x9fb2c9)

    drawCluster(state, readout, elapsed)
    drawIvi(state, readout)
    drawGear(state)
  }

  return {
    update,
    render: () => renderer.render(scene, camera),
    resize: (w, h) => {
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    },
    dispose: () => {
      cluster.texture.dispose()
      ivi.texture.dispose()
      gearPanel.texture.dispose()
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
