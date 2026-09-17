/**
 * VSS-to-VehicleProperty pairs, hand-curated and verified rather than
 * mechanically derived — content/learn/sdv/vss-and-kuksa.mdx explains why
 * that last mile (sampling rate, permissions, and the exact area/instance
 * mapping) is deliberately not something a generator can decide alone.
 *
 * Every AAOS-side unit and property name here is checked against the real
 * generated record in data/vehicle-properties.ts. Every VSS path is checked
 * against the COVESA/vehicle_signal_specification repository. Deliberately
 * excluded: a few plausible-looking pairs (HEADLIGHTS_SWITCH, EV_CHARGE_STATE
 * and the individual cabin-light fixtures) whose exact current VSS leaf path
 * could not be confirmed against the spec — better a smaller verified table
 * than a larger guessed one.
 */

export type MismatchKind = 'none' | 'unit' | 'encoding' | 'granularity' | 'no-equivalent'

export type VssMapping = {
  vssPath: string
  /** Undefined when there is deliberately no AAOS equivalent. */
  property?: string
  mismatch: MismatchKind
  note: string
}

export const MISMATCH_LABEL: Record<MismatchKind, string> = {
  none: 'Direct match',
  unit: 'Unit mismatch',
  encoding: 'Encoding mismatch',
  granularity: 'Granularity differs',
  'no-equivalent': 'No AAOS equivalent',
}

export const vssMappings: VssMapping[] = [
  {
    vssPath: 'Vehicle.Speed',
    property: 'PERF_VEHICLE_SPEED',
    mismatch: 'unit',
    note: 'VSS reports km/h. AAOS reports the same quantity in metres per second, as a FLOAT. Convert — don’t assume the raw number means the same thing on both sides.',
  },
  {
    vssPath: 'Vehicle.Chassis.ParkingBrake.IsEngaged',
    property: 'PARKING_BRAKE_ON',
    mismatch: 'none',
    note: 'Direct boolean match, no conversion needed.',
  },
  {
    vssPath: 'Vehicle.Powertrain.CombustionEngine.Speed',
    property: 'ENGINE_RPM',
    mismatch: 'none',
    note: 'Direct match — both are engine speed in RPM. VSS deprecated the older Vehicle.OBD.EngineSpeed path in favour of this one.',
  },
  {
    vssPath: 'Vehicle.Powertrain.FuelSystem.Level',
    property: 'FUEL_LEVEL',
    mismatch: 'unit',
    note: 'VSS reports a percentage (0–100). AAOS FUEL_LEVEL is a FLOAT in millilitres. You need the tank’s actual capacity to convert either way — neither side carries it.',
  },
  {
    vssPath: 'Vehicle.Powertrain.Transmission.SelectedGear',
    property: 'GEAR_SELECTION',
    mismatch: 'encoding',
    note: 'Not just a unit difference: VSS uses a signed int8 (0=Neutral, 126=Park, 127=Drive, negative=reverse gears). AAOS uses a separate VehicleGear bitmask enum entirely. The raw values never line up numerically.',
  },
  {
    vssPath: 'Vehicle.Cabin.Seat.Row1.Pos1.IsBelted',
    property: 'SEAT_BELT_BUCKLED',
    mismatch: 'granularity',
    note: 'Same fact, different addressing: VSS names each seat as its own path (Row1.Pos1, Row1.Pos2…). AAOS uses one property with a per-seat VehicleAreaSeat bitmask.',
  },
  {
    vssPath: 'Vehicle.Powertrain.TractionBattery.StateOfCharge.Current',
    property: 'EV_BATTERY_LEVEL',
    mismatch: 'unit',
    note: 'Not directly convertible without more data: VSS reports state of charge as a percentage. AAOS EV_BATTERY_LEVEL reports remaining energy in watt-hours — you need the pack’s total capacity to convert between them.',
  },
  {
    vssPath: 'Vehicle.Chassis.Axle.Row1.Wheel.Left.Tire.Pressure',
    property: 'TIRE_PRESSURE',
    mismatch: 'granularity',
    note: 'The units actually agree — both kilopascals. Only the addressing differs: VSS names each wheel by axle row and side, AAOS uses a per-wheel VehicleAreaWheel bitmask on one property.',
  },
  {
    vssPath: 'Vehicle.Cabin.Door.Row1.Left.IsLocked',
    property: 'DOOR_LOCK',
    mismatch: 'none',
    note: 'Direct boolean match, addressed per-door on both sides.',
  },
  {
    vssPath: 'Vehicle.Cabin.Door.Row1.Left.Window.Position',
    property: 'WINDOW_POS',
    mismatch: 'granularity',
    note: 'AAOS reports a relative range whose endpoints are vehicle-specific. Confirm the exact datatype and range your VSS provider declares for this signal before assuming a given number means the same openness on both sides.',
  },
  {
    vssPath: 'Vehicle.Body.Mirrors.DriverSide.Yaw',
    property: 'MIRROR_Y_POS',
    mismatch: 'encoding',
    note: 'Not value-compatible: VSS models this as an angle. AAOS reports a relative position int with no defined physical unit. (VSS itself renamed this signal from Pan to Yaw across spec versions — check which one your provider is on.)',
  },
  {
    vssPath: 'Vehicle.CurrentLocation.Latitude',
    mismatch: 'no-equivalent',
    note: 'Vehicle location comes from Android’s LocationManager and the GNSS HAL, not the VHAL — there is no VehicleProperty for it, and there shouldn’t be one. Don’t force this mapping.',
  },
  {
    vssPath: 'Vehicle.Cabin.HVAC.Station.Row1.Left.Temperature',
    property: 'HVAC_TEMPERATURE_SET',
    mismatch: 'granularity',
    note: 'Both are a per-seat-position temperature and both are commonly °C, but confirm the exact leaf path against the COVESA spec version you’re building against — the HVAC branch has had naming adjustments across VSS releases.',
  },
]
