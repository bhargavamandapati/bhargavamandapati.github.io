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
  leadDistance: number // mm — ADAPTIVE_CRUISE_CONTROL_LEAD_VEHICLE_MEASURED_DISTANCE
  timeGap: number // ms — ADAPTIVE_CRUISE_CONTROL_TARGET_TIME_GAP
  forwardCollision: number // ForwardCollisionWarningState
  blindSpot: number // BlindSpotWarningState
  laneDeparture: number // LaneDepartureWarningState
  aeb: number // AutomaticEmergencyBrakingState

  // Occupants
  seatOccupancy: number // VehicleSeatOccupancyState — SEAT_OCCUPANCY (passenger)
  beltDriver: boolean // SEAT_BELT_BUCKLED
  beltPassenger: boolean // SEAT_BELT_BUCKLED
  seatHeat: number // HVAC_SEAT_TEMPERATURE
  backrestAngle: number // SEAT_BACKREST_ANGLE_1_POS

  // Interior lighting
  cabinLights: number // VehicleLightSwitch — CABIN_LIGHTS_SWITCH
  readingLights: number // VehicleLightSwitch — READING_LIGHTS_SWITCH

  // Body extras
  doorLock: boolean // DOOR_LOCK
  horn: boolean // VEHICLE_HORN_ENGAGED
  mirrorY: number // MIRROR_Y_POS
  mirrorHeat: number // HVAC_SIDE_MIRROR_HEAT

  // Electric extras
  chargeState: number // EvChargeState — EV_CHARGE_STATE
  chargeLimit: number // EV_CHARGE_PERCENT_LIMIT
  regenState: number // EvRegenerativeBrakingState — EV_REGENERATIVE_BRAKING_STATE
  stoppingMode: number // EvStoppingMode — EV_STOPPING_MODE

  // Engine and chassis
  coolantTemp: number // ENGINE_COOLANT_TEMP
  oilLevel: number // VehicleOilLevel — ENGINE_OIL_LEVEL
  fuelLow: boolean // FUEL_LEVEL_LOW
  absActive: boolean // ABS_ACTIVE
  tractionActive: boolean // TRACTION_CONTROL_ACTIVE

  // Towing
  trailer: number // TrailerState — TRAILER_PRESENT

  // Climate extras
  hvacAuto: boolean // HVAC_AUTO_ON
  hvacMaxAc: boolean // HVAC_MAX_AC_ON
  wheelHeat: number // HVAC_STEERING_WHEEL_HEAT
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
  leadDistance: 0,
  timeGap: 1500,
  forwardCollision: 1, // NO_WARNING
  blindSpot: 1, // NO_WARNING
  laneDeparture: 1, // NO_WARNING
  aeb: 1, // ENABLED

  seatOccupancy: 1, // VACANT
  beltDriver: true,
  beltPassenger: false,
  seatHeat: 0,
  backrestAngle: 0,

  cabinLights: 0, // OFF
  readingLights: 0, // OFF

  doorLock: true,
  horn: false,
  mirrorY: 0,
  mirrorHeat: 0,

  chargeState: 0, // UNKNOWN
  chargeLimit: 80,
  regenState: 1, // DISABLED
  stoppingMode: 1, // CREEP

  coolantTemp: 88,
  oilLevel: 3, // NORMAL
  fuelLow: false,
  absActive: false,
  tractionActive: false,

  trailer: 2, // NOT_PRESENT

  hvacAuto: false,
  hvacMaxAc: false,
  wheelHeat: 0,
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
  /**
   * True when the real property is READ-only. You are standing in for the
   * vehicle here, which is worth saying rather than implying an app could
   * write it.
   */
  reported?: boolean
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

  // ---- Occupants -----------------------------------------------------------
  {
    key: 'seatOccupancy',
    property: 'SEAT_OCCUPANCY',
    label: 'Front passenger seat',
    kind: 'enum',
    group: 'Occupants',
    affects: 'Seats a passenger, who then appears in the cabin and the plan view.',
    reported: true,
    options: [
      { value: 0, label: 'UNKNOWN' },
      { value: 1, label: 'VACANT' },
      { value: 2, label: 'OCCUPIED' },
    ],
  },
  {
    key: 'beltDriver',
    property: 'SEAT_BELT_BUCKLED',
    label: 'Driver belt',
    kind: 'toggle',
    group: 'Occupants',
    affects: 'Unbuckled lights the belt telltale.',
  },
  {
    key: 'beltPassenger',
    property: 'SEAT_BELT_BUCKLED',
    label: 'Passenger belt',
    kind: 'toggle',
    group: 'Occupants',
    affects: 'Only warns when the seat is occupied — two properties, one decision.',
    note: 'Same property, a different area ID. Availability and value are both per seat.',
  },
  {
    key: 'seatHeat',
    property: 'HVAC_SEAT_TEMPERATURE',
    label: 'Seat heating',
    kind: 'range',
    group: 'Occupants',
    affects: 'Warms the seat cushion — visible as a glow from above.',
    min: -3,
    max: 3,
    step: 1,
    requires: 'hvacPower',
    note: 'Negative values ventilate, positive values heat.',
  },
  {
    key: 'backrestAngle',
    property: 'SEAT_BACKREST_ANGLE_1_POS',
    label: 'Driver backrest',
    kind: 'range',
    group: 'Occupants',
    affects: 'Reclines the seat back.',
    min: -30,
    max: 30,
    step: 5,
    unit: '°',
  },

  // ---- Driver assistance (extended) ---------------------------------------
  {
    key: 'leadDistance',
    property: 'ADAPTIVE_CRUISE_CONTROL_LEAD_VEHICLE_MEASURED_DISTANCE',
    label: 'Lead vehicle distance',
    kind: 'range',
    group: 'Driver assistance',
    affects: 'Puts a car ahead. Zero means the radar sees nothing in front.',
    reported: true,
    min: 0,
    max: 60000,
    step: 1000,
    unit: 'mm',
    format: (mm) => (mm === 0 ? 'no lead vehicle' : `${(mm / 1000).toFixed(0)} m ahead`),
  },
  {
    key: 'timeGap',
    property: 'ADAPTIVE_CRUISE_CONTROL_TARGET_TIME_GAP',
    label: 'Target time gap',
    kind: 'range',
    group: 'Driver assistance',
    affects: 'The gap cruise control aims to hold, shown on the cluster.',
    min: 500,
    max: 3000,
    step: 100,
    unit: 'ms',
    format: (ms) => `${(ms / 1000).toFixed(1)} s`,
  },
  {
    key: 'forwardCollision',
    property: 'FORWARD_COLLISION_WARNING_STATE',
    label: 'Forward collision warning',
    kind: 'enum',
    group: 'Driver assistance',
    affects: 'Flashes a red warning across the cluster and the road ahead.',
    reported: true,
    options: [
      { value: 0, label: 'OTHER' },
      { value: 1, label: 'NO_WARNING' },
      { value: 2, label: 'WARNING' },
    ],
  },
  {
    key: 'blindSpot',
    property: 'BLIND_SPOT_WARNING_STATE',
    label: 'Blind spot warning',
    kind: 'enum',
    group: 'Driver assistance',
    affects: 'Lights the mirror indicator on both sides.',
    reported: true,
    note: 'A MIRROR-area property — a real vehicle reports it per mirror.',
    options: [
      { value: 0, label: 'OTHER' },
      { value: 1, label: 'NO_WARNING' },
      { value: 2, label: 'WARNING' },
    ],
  },
  {
    key: 'laneDeparture',
    property: 'LANE_DEPARTURE_WARNING_STATE',
    label: 'Lane departure warning',
    kind: 'enum',
    group: 'Driver assistance',
    affects: 'Turns the lane markings amber on the side you are drifting towards.',
    reported: true,
    options: [
      { value: 0, label: 'OTHER' },
      { value: 1, label: 'NO_WARNING' },
      { value: 2, label: 'WARNING_LEFT' },
      { value: 3, label: 'WARNING_RIGHT' },
    ],
  },
  {
    key: 'aeb',
    property: 'AUTOMATIC_EMERGENCY_BRAKING_STATE',
    label: 'Emergency braking',
    kind: 'enum',
    group: 'Driver assistance',
    affects: 'ACTIVATED brings the car to a stop and lights the cluster.',
    reported: true,
    options: [
      { value: 0, label: 'OTHER' },
      { value: 1, label: 'ENABLED' },
      { value: 2, label: 'ACTIVATED' },
      { value: 3, label: 'USER_OVERRIDE' },
    ],
  },

  // ---- Interior lighting ---------------------------------------------------
  {
    key: 'cabinLights',
    property: 'CABIN_LIGHTS_SWITCH',
    label: 'Cabin lights',
    kind: 'enum',
    group: 'Lights',
    affects: 'Lights the whole cabin.',
    options: [
      { value: 0, label: 'OFF' },
      { value: 1, label: 'ON' },
      { value: 0x100, label: 'AUTOMATIC' },
    ],
  },
  {
    key: 'readingLights',
    property: 'READING_LIGHTS_SWITCH',
    label: 'Reading light',
    kind: 'enum',
    group: 'Lights',
    affects: 'A focused pool over the driver.',
    note: 'SEAT area — each seat has its own.',
    options: [
      { value: 0, label: 'OFF' },
      { value: 1, label: 'ON' },
    ],
  },

  // ---- Body (extended) -----------------------------------------------------
  {
    key: 'doorLock',
    property: 'DOOR_LOCK',
    label: 'Doors locked',
    kind: 'toggle',
    group: 'Body',
    affects: 'Shows a lock marker beside each door in the plan view.',
  },
  {
    key: 'horn',
    property: 'VEHICLE_HORN_ENGAGED',
    label: 'Horn',
    kind: 'toggle',
    group: 'Body',
    affects: 'Sends a visible pulse out from the car.',
  },
  {
    key: 'mirrorY',
    property: 'MIRROR_Y_POS',
    label: 'Mirror angle',
    kind: 'range',
    group: 'Body',
    affects: 'Swings the mirror glass left and right.',
    min: -30,
    max: 30,
    step: 5,
  },
  {
    key: 'mirrorHeat',
    property: 'HVAC_SIDE_MIRROR_HEAT',
    label: 'Mirror heating',
    kind: 'range',
    group: 'Body',
    affects: 'Warms the mirror glass — it glows from above.',
    min: 0,
    max: 3,
    step: 1,
  },

  // ---- Electric (extended) -------------------------------------------------
  {
    key: 'chargeState',
    property: 'EV_CHARGE_STATE',
    label: 'Charge state',
    kind: 'enum',
    group: 'Electric',
    affects: 'Drives the charging animation along the cable.',
    reported: true,
    options: [
      { value: 0, label: 'UNKNOWN' },
      { value: 1, label: 'CHARGING' },
      { value: 2, label: 'FULLY_CHARGED' },
      { value: 3, label: 'NOT_CHARGING' },
      { value: 4, label: 'ERROR' },
    ],
  },
  {
    key: 'chargeLimit',
    property: 'EV_CHARGE_PERCENT_LIMIT',
    label: 'Charge limit',
    kind: 'range',
    group: 'Electric',
    affects: 'Marks where charging stops on the battery gauge.',
    min: 50,
    max: 100,
    step: 5,
    unit: '%',
  },
  {
    key: 'regenState',
    property: 'EV_REGENERATIVE_BRAKING_STATE',
    label: 'Regenerative braking',
    kind: 'enum',
    group: 'Electric',
    affects: 'Shows a regen bar on the cluster while moving.',
    reported: true,
    options: [
      { value: 0, label: 'UNKNOWN' },
      { value: 1, label: 'DISABLED' },
      { value: 2, label: 'PARTIALLY_ENABLED' },
      { value: 3, label: 'FULLY_ENABLED' },
    ],
  },
  {
    key: 'stoppingMode',
    property: 'EV_STOPPING_MODE',
    label: 'Stopping mode',
    kind: 'enum',
    group: 'Electric',
    affects: 'One-pedal driving decelerates harder when you lift off.',
    options: [
      { value: 0, label: 'OTHER' },
      { value: 1, label: 'CREEP' },
      { value: 2, label: 'ROLL' },
      { value: 3, label: 'HOLD' },
    ],
  },

  // ---- Engine and chassis --------------------------------------------------
  {
    key: 'coolantTemp',
    property: 'ENGINE_COOLANT_TEMP',
    label: 'Coolant temperature',
    kind: 'range',
    group: 'Engine & chassis',
    affects: 'Above 110 °C the overheat telltale lights.',
    reported: true,
    min: 40,
    max: 130,
    step: 1,
    unit: '°C',
  },
  {
    key: 'oilLevel',
    property: 'ENGINE_OIL_LEVEL',
    label: 'Oil level',
    kind: 'enum',
    group: 'Engine & chassis',
    affects: 'Anything below NORMAL lights the oil telltale.',
    reported: true,
    options: [
      { value: 0, label: 'CRITICALLY_LOW' },
      { value: 1, label: 'LOW' },
      { value: 2, label: 'NORMAL' },
      { value: 3, label: 'HIGH' },
      { value: 4, label: 'ERROR' },
    ],
  },
  {
    key: 'fuelLow',
    property: 'FUEL_LEVEL_LOW',
    label: 'Low energy warning',
    kind: 'toggle',
    group: 'Engine & chassis',
    affects: 'Lights the low-energy telltale.',
    reported: true,
  },
  {
    key: 'absActive',
    property: 'ABS_ACTIVE',
    label: 'ABS active',
    kind: 'toggle',
    group: 'Engine & chassis',
    affects: 'Flashes the ABS telltale while the system is intervening.',
    reported: true,
  },
  {
    key: 'tractionActive',
    property: 'TRACTION_CONTROL_ACTIVE',
    label: 'Traction control active',
    kind: 'toggle',
    group: 'Engine & chassis',
    affects: 'Flashes the traction telltale.',
    reported: true,
  },
  {
    key: 'trailer',
    property: 'TRAILER_PRESENT',
    label: 'Trailer',
    kind: 'enum',
    group: 'Engine & chassis',
    affects: 'Attaches a trailer behind the car in the plan view.',
    reported: true,
    options: [
      { value: 0, label: 'UNKNOWN' },
      { value: 1, label: 'NOT_PRESENT' },
      { value: 2, label: 'PRESENT' },
      { value: 3, label: 'ERROR' },
    ],
  },

  // ---- Climate (extended) --------------------------------------------------
  {
    key: 'hvacAuto',
    property: 'HVAC_AUTO_ON',
    label: 'Auto climate',
    kind: 'toggle',
    group: 'Climate',
    affects: 'Lets the system pick the fan speed for you.',
    requires: 'hvacPower',
  },
  {
    key: 'hvacMaxAc',
    property: 'HVAC_MAX_AC_ON',
    label: 'Max A/C',
    kind: 'toggle',
    group: 'Climate',
    affects: 'Full cooling — forces the fan high and recirculation on.',
    requires: 'hvacPower',
  },
  {
    key: 'wheelHeat',
    property: 'HVAC_STEERING_WHEEL_HEAT',
    label: 'Steering wheel heat',
    kind: 'range',
    group: 'Climate',
    affects: 'The wheel rim glows as it warms.',
    min: 0,
    max: 3,
    step: 1,
    requires: 'hvacPower',
  },
]

export const controlGroups = [...new Set(controls.map((c) => c.group))]
