/**
 * The property set the simulator drives.
 *
 * Every control names a real property from VehicleProperty.aidl, so the panel
 * doubles as a map from "what I changed" to "which property that is". Only
 * properties with a visible physical consequence are here — a simulator cannot
 * usefully show you INFO_VIN — and the page says so rather than implying the
 * whole catalogue is covered.
 */

export type SimState = {
  // Motion and powertrain
  speed: number // m/s — PERF_VEHICLE_SPEED
  gear: number // VehicleGear — GEAR_SELECTION
  engineRpm: number // ENGINE_RPM
  parkingBrake: boolean // PARKING_BRAKE_ON
  steeringAngle: number // degrees — PERF_STEERING_ANGLE
  ignition: number // VehicleIgnitionState — IGNITION_STATE

  // Lights
  headlights: boolean // HEADLIGHTS_SWITCH
  highBeam: boolean // HIGH_BEAM_LIGHTS_SWITCH
  fogLights: boolean // FOG_LIGHTS_SWITCH
  hazard: boolean // HAZARD_LIGHTS_SWITCH
  turnSignal: number // VehicleTurnSignal — TURN_SIGNAL_STATE

  // Climate
  hvacPower: boolean // HVAC_POWER_ON
  hvacAc: boolean // HVAC_AC_ON
  hvacTemp: number // Celsius — HVAC_TEMPERATURE_SET
  hvacFanSpeed: number // HVAC_FAN_SPEED
  hvacFanDirection: number // bit flags — HVAC_FAN_DIRECTION
  hvacRecirc: boolean // HVAC_RECIRC_ON
  hvacDefroster: boolean // HVAC_DEFROSTER

  // Body
  doorFrontLeft: boolean // DOOR_POS
  doorFrontRight: boolean
  doorRearLeft: boolean
  doorRearRight: boolean
  bootOpen: boolean
  windowFrontLeft: number // 0–100 — WINDOW_POS
  windowFrontRight: number
  mirrorFold: boolean // MIRROR_FOLD

  // Electric
  batteryLevel: number // per cent — EV_BATTERY_LEVEL
  chargePortOpen: boolean // EV_CHARGE_PORT_OPEN
  chargePortConnected: boolean // EV_CHARGE_PORT_CONNECTED

  // Tyres
  tyreFrontLeft: number // kPa — TIRE_PRESSURE
  tyreFrontRight: number
  tyreRearLeft: number
  tyreRearRight: number

  // Environment
  outsideTemp: number // Celsius — ENV_OUTSIDE_TEMPERATURE
  nightMode: boolean // NIGHT_MODE
  wipers: number // WindshieldWipersSwitch — WINDSHIELD_WIPERS_SWITCH

  // Driver assistance
  cruiseEnabled: boolean // CRUISE_CONTROL_ENABLED
  cruiseTarget: number // m/s — CRUISE_CONTROL_TARGET_SPEED
  laneKeepEnabled: boolean // LANE_KEEP_ASSIST_ENABLED
}

export const initialState: SimState = {
  speed: 0,
  gear: 0x0004, // GEAR_PARK
  engineRpm: 0,
  parkingBrake: true,
  steeringAngle: 0,
  ignition: 4, // ON

  headlights: false,
  highBeam: false,
  fogLights: false,
  hazard: false,
  turnSignal: 0,

  hvacPower: false,
  hvacAc: false,
  hvacTemp: 21.5,
  hvacFanSpeed: 0,
  hvacFanDirection: 0x1, // FACE
  hvacRecirc: false,
  hvacDefroster: false,

  doorFrontLeft: false,
  doorFrontRight: false,
  doorRearLeft: false,
  doorRearRight: false,
  bootOpen: false,
  windowFrontLeft: 0,
  windowFrontRight: 0,
  mirrorFold: false,

  batteryLevel: 72,
  chargePortOpen: false,
  chargePortConnected: false,

  tyreFrontLeft: 240,
  tyreFrontRight: 240,
  tyreRearLeft: 240,
  tyreRearRight: 240,

  outsideTemp: 14,
  nightMode: false,
  wipers: 1, // OFF

  cruiseEnabled: false,
  cruiseTarget: 27.8,
  laneKeepEnabled: false,
}

export type ControlKind = 'toggle' | 'range' | 'enum'

export type Control = {
  key: keyof SimState
  /** The real property this stands for. */
  property: string
  label: string
  kind: ControlKind
  group: string
  /** What changing it does to the car, in one line. */
  affects: string
  min?: number
  max?: number
  step?: number
  unit?: string
  /** Formats the raw value for display. */
  format?: (value: number) => string
  options?: { value: number; label: string }[]
  /** Key of a boolean control that must be true for this to do anything. */
  requires?: keyof SimState
  /** Note shown under the control. */
  note?: string
}

const kmh = (ms: number) => `${Math.round(ms * 3.6)} km/h`

export const controls: Control[] = [
  // ---- Motion --------------------------------------------------------------
  {
    key: 'ignition',
    property: 'IGNITION_STATE',
    label: 'Ignition state',
    kind: 'enum',
    group: 'Motion & powertrain',
    affects: 'Powers the vehicle. Nothing else responds when it is off.',
    options: [
      { value: 0, label: 'UNDEFINED' },
      { value: 1, label: 'LOCK' },
      { value: 2, label: 'OFF' },
      { value: 3, label: 'ACC' },
      { value: 4, label: 'ON' },
      { value: 5, label: 'START' },
    ],
  },
  {
    key: 'gear',
    property: 'GEAR_SELECTION',
    label: 'Gear',
    kind: 'enum',
    group: 'Motion & powertrain',
    affects: 'Decides whether the car can move, and in which direction.',
    options: [
      { value: 0x0004, label: 'GEAR_PARK' },
      { value: 0x0002, label: 'GEAR_REVERSE' },
      { value: 0x0001, label: 'GEAR_NEUTRAL' },
      { value: 0x0008, label: 'GEAR_DRIVE' },
    ],
  },
  {
    key: 'speed',
    property: 'PERF_VEHICLE_SPEED',
    label: 'Vehicle speed',
    kind: 'range',
    group: 'Motion & powertrain',
    affects: 'Wheels turn, the road moves, and the cluster reads out.',
    min: 0,
    max: 55,
    step: 0.5,
    unit: 'm/s',
    format: kmh,
    note: 'Reported in metres per second — the display unit is a separate property.',
  },
  {
    key: 'engineRpm',
    property: 'ENGINE_RPM',
    label: 'Engine RPM',
    kind: 'range',
    group: 'Motion & powertrain',
    affects: 'Drives the tachometer.',
    min: 0,
    max: 7000,
    step: 50,
    unit: 'rpm',
  },
  {
    key: 'steeringAngle',
    property: 'PERF_STEERING_ANGLE',
    label: 'Steering angle',
    kind: 'range',
    group: 'Motion & powertrain',
    affects: 'Turns the front wheels and curves the road.',
    min: -35,
    max: 35,
    step: 1,
    unit: '°',
  },
  {
    key: 'parkingBrake',
    property: 'PARKING_BRAKE_ON',
    label: 'Parking brake',
    kind: 'toggle',
    group: 'Motion & powertrain',
    affects: 'Holds the car still and lights the cluster telltale.',
  },

  // ---- Lights --------------------------------------------------------------
  {
    key: 'headlights',
    property: 'HEADLIGHTS_SWITCH',
    label: 'Headlights',
    kind: 'toggle',
    group: 'Lights',
    affects: 'Casts beams onto the road ahead.',
  },
  {
    key: 'highBeam',
    property: 'HIGH_BEAM_LIGHTS_SWITCH',
    label: 'Main beam',
    kind: 'toggle',
    group: 'Lights',
    affects: 'Longer, brighter beams.',
    requires: 'headlights',
  },
  {
    key: 'fogLights',
    property: 'FOG_LIGHTS_SWITCH',
    label: 'Fog lights',
    kind: 'toggle',
    group: 'Lights',
    affects: 'Wide, low light pool at the front.',
  },
  {
    key: 'turnSignal',
    property: 'TURN_SIGNAL_STATE',
    label: 'Turn signal',
    kind: 'enum',
    group: 'Lights',
    affects: 'Flashes the indicators on one side.',
    options: [
      { value: 0, label: 'NONE' },
      { value: 1, label: 'RIGHT' },
      { value: 2, label: 'LEFT' },
    ],
  },
  {
    key: 'hazard',
    property: 'HAZARD_LIGHTS_SWITCH',
    label: 'Hazard lights',
    kind: 'toggle',
    group: 'Lights',
    affects: 'Flashes every indicator at once.',
  },

  // ---- Climate -------------------------------------------------------------
  {
    key: 'hvacPower',
    property: 'HVAC_POWER_ON',
    label: 'HVAC power',
    kind: 'toggle',
    group: 'Climate',
    affects: 'The gate. Every climate control below is inert until this is on.',
    note: 'Turn it off and try the others — they accept the change and nothing happens.',
  },
  {
    key: 'hvacFanSpeed',
    property: 'HVAC_FAN_SPEED',
    label: 'Fan speed',
    kind: 'range',
    group: 'Climate',
    affects: 'Volume and speed of the airflow in the cabin.',
    min: 0,
    max: 6,
    step: 1,
    requires: 'hvacPower',
  },
  {
    key: 'hvacTemp',
    property: 'HVAC_TEMPERATURE_SET',
    label: 'Target temperature',
    kind: 'range',
    group: 'Climate',
    affects: 'Colours the airflow from blue to red and drives the cabin readout.',
    min: 16,
    max: 28,
    step: 0.5,
    unit: '°C',
    requires: 'hvacPower',
  },
  {
    key: 'hvacFanDirection',
    property: 'HVAC_FAN_DIRECTION',
    label: 'Fan direction',
    kind: 'enum',
    group: 'Climate',
    affects: 'Where the air comes out — face, floor, or the windscreen.',
    requires: 'hvacPower',
    note: 'These are bit flags: FACE_AND_FLOOR is FACE | FLOOR.',
    options: [
      { value: 0x1, label: 'FACE' },
      { value: 0x2, label: 'FLOOR' },
      { value: 0x3, label: 'FACE_AND_FLOOR' },
      { value: 0x4, label: 'DEFROST' },
      { value: 0x6, label: 'DEFROST_AND_FLOOR' },
    ],
  },
  {
    key: 'hvacAc',
    property: 'HVAC_AC_ON',
    label: 'Air conditioning',
    kind: 'toggle',
    group: 'Climate',
    affects: 'Allows the cabin to be cooled below outside temperature.',
    requires: 'hvacPower',
  },
  {
    key: 'hvacRecirc',
    property: 'HVAC_RECIRC_ON',
    label: 'Recirculate',
    kind: 'toggle',
    group: 'Climate',
    affects: 'Closes the cabin off from outside air.',
    requires: 'hvacPower',
  },
  {
    key: 'hvacDefroster',
    property: 'HVAC_DEFROSTER',
    label: 'Windscreen defroster',
    kind: 'toggle',
    group: 'Climate',
    affects: 'Clears the windscreen.',
    note: 'A WINDOW-area property, so it is never gated by HVAC_POWER_ON.',
  },

  // ---- Body ----------------------------------------------------------------
  {
    key: 'doorFrontLeft',
    property: 'DOOR_POS',
    label: 'Driver door',
    kind: 'toggle',
    group: 'Body',
    affects: 'Swings the door open.',
  },
  {
    key: 'doorFrontRight',
    property: 'DOOR_POS',
    label: 'Front passenger door',
    kind: 'toggle',
    group: 'Body',
    affects: 'Swings the door open.',
  },
  {
    key: 'doorRearLeft',
    property: 'DOOR_POS',
    label: 'Rear left door',
    kind: 'toggle',
    group: 'Body',
    affects: 'Swings the door open.',
  },
  {
    key: 'doorRearRight',
    property: 'DOOR_POS',
    label: 'Rear right door',
    kind: 'toggle',
    group: 'Body',
    affects: 'Swings the door open.',
  },
  {
    key: 'bootOpen',
    property: 'DOOR_POS',
    label: 'Boot',
    kind: 'toggle',
    group: 'Body',
    affects: 'Lifts the tailgate.',
    note: 'The boot is an area of DOOR_POS, not a property of its own.',
  },
  {
    key: 'windowFrontLeft',
    property: 'WINDOW_POS',
    label: 'Driver window',
    kind: 'range',
    group: 'Body',
    affects: 'Lowers the glass.',
    min: 0,
    max: 100,
    step: 5,
    unit: '% open',
  },
  {
    key: 'windowFrontRight',
    property: 'WINDOW_POS',
    label: 'Passenger window',
    kind: 'range',
    group: 'Body',
    affects: 'Lowers the glass.',
    min: 0,
    max: 100,
    step: 5,
    unit: '% open',
  },
  {
    key: 'mirrorFold',
    property: 'MIRROR_FOLD',
    label: 'Fold mirrors',
    kind: 'toggle',
    group: 'Body',
    affects: 'Folds both door mirrors in.',
  },

  // ---- Electric ------------------------------------------------------------
  {
    key: 'batteryLevel',
    property: 'EV_BATTERY_LEVEL',
    label: 'Battery level',
    kind: 'range',
    group: 'Electric',
    affects: 'Drives the state-of-charge gauge and the range estimate.',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    note: 'The real property reports watt-hours, not per cent.',
  },
  {
    key: 'chargePortOpen',
    property: 'EV_CHARGE_PORT_OPEN',
    label: 'Charge port open',
    kind: 'toggle',
    group: 'Electric',
    affects: 'Opens the charge flap.',
  },
  {
    key: 'chargePortConnected',
    property: 'EV_CHARGE_PORT_CONNECTED',
    label: 'Cable connected',
    kind: 'toggle',
    group: 'Electric',
    affects: 'Plugs in and starts charging.',
    requires: 'chargePortOpen',
  },

  // ---- Tyres ---------------------------------------------------------------
  {
    key: 'tyreFrontLeft',
    property: 'TIRE_PRESSURE',
    label: 'Front left pressure',
    kind: 'range',
    group: 'Tyres',
    affects: 'Below 180 kPa the wheel is flagged on the car and in the cluster.',
    min: 120,
    max: 300,
    step: 5,
    unit: 'kPa',
  },
  {
    key: 'tyreFrontRight',
    property: 'TIRE_PRESSURE',
    label: 'Front right pressure',
    kind: 'range',
    group: 'Tyres',
    affects: 'Below 180 kPa the wheel is flagged.',
    min: 120,
    max: 300,
    step: 5,
    unit: 'kPa',
  },
  {
    key: 'tyreRearLeft',
    property: 'TIRE_PRESSURE',
    label: 'Rear left pressure',
    kind: 'range',
    group: 'Tyres',
    affects: 'Below 180 kPa the wheel is flagged.',
    min: 120,
    max: 300,
    step: 5,
    unit: 'kPa',
  },
  {
    key: 'tyreRearRight',
    property: 'TIRE_PRESSURE',
    label: 'Rear right pressure',
    kind: 'range',
    group: 'Tyres',
    affects: 'Below 180 kPa the wheel is flagged.',
    min: 120,
    max: 300,
    step: 5,
    unit: 'kPa',
  },

  // ---- Environment ---------------------------------------------------------
  {
    key: 'nightMode',
    property: 'NIGHT_MODE',
    label: 'Night mode',
    kind: 'toggle',
    group: 'Environment',
    affects: 'Darkens the scene — this is what drives day/night theming in a real cockpit.',
  },
  {
    key: 'outsideTemp',
    property: 'ENV_OUTSIDE_TEMPERATURE',
    label: 'Outside temperature',
    kind: 'range',
    group: 'Environment',
    affects: 'Shown in the cluster, and what the cabin drifts towards with HVAC off.',
    min: -20,
    max: 45,
    step: 1,
    unit: '°C',
  },
  {
    key: 'wipers',
    property: 'WINDSHIELD_WIPERS_SWITCH',
    label: 'Wipers',
    kind: 'enum',
    group: 'Environment',
    affects: 'Sweeps the windscreen.',
    options: [
      { value: 1, label: 'OFF' },
      { value: 3, label: 'INTERMITTENT_LEVEL_1' },
      { value: 8, label: 'CONTINUOUS_LEVEL_1' },
      { value: 12, label: 'CONTINUOUS_LEVEL_5' },
    ],
  },

  // ---- Driver assistance ---------------------------------------------------
  {
    key: 'cruiseEnabled',
    property: 'CRUISE_CONTROL_ENABLED',
    label: 'Cruise control',
    kind: 'toggle',
    group: 'Driver assistance',
    affects: 'Holds the target speed. The state property reports what it is doing.',
  },
  {
    key: 'cruiseTarget',
    property: 'CRUISE_CONTROL_TARGET_SPEED',
    label: 'Cruise target speed',
    kind: 'range',
    group: 'Driver assistance',
    affects: 'The speed cruise control settles on.',
    min: 8,
    max: 45,
    step: 0.5,
    unit: 'm/s',
    format: kmh,
    requires: 'cruiseEnabled',
  },
  {
    key: 'laneKeepEnabled',
    property: 'LANE_KEEP_ASSIST_ENABLED',
    label: 'Lane keep assist',
    kind: 'toggle',
    group: 'Driver assistance',
    affects: 'Draws the lane markings the system is tracking.',
  },
]

export const controlGroups = [...new Set(controls.map((c) => c.group))]
