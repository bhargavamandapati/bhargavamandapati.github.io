import type { SimState } from './simulator'

export type ScenarioStep = {
  /** The property values this step writes — applied together, like one batch of VHAL writes. */
  patch: Partial<SimState>
  /** What just happened and why, in the reader's terms. */
  narration: string
}

export type Scenario = {
  title: string
  /** One line shown on the scenario's own button, before it's picked. */
  summary: string
  steps: ScenarioStep[]
}

/**
 * The same eight scenarios the page used to describe in prose. Here each
 * step is a real patch to the simulator's own state — pressing Play drives
 * the actual controls, rather than asking the reader to go find and flip
 * them by hand.
 */
export const scenarios: Scenario[] = [
  {
    title: 'Open the driver door',
    summary: 'visible only from the plan view',
    steps: [
      {
        patch: { doorFrontLeft: true },
        narration:
          'The plan view shows it swing out on the left. Nothing about it is visible from the driver’s seat — which is the reason a cluster carries a door-open telltale at all.',
      },
    ],
  },
  {
    title: 'Turn the fan up with HVAC off',
    summary: 'a gated write that does nothing',
    steps: [
      {
        patch: { hvacPower: false, hvacFanSpeed: 5 },
        narration:
          'The control moves, the write is logged — and nothing happens. That’s exactly what a gated property does on a real vehicle, and why a dependency is worth knowing about before you ship.',
      },
    ],
  },
  {
    title: 'Park the car, then floor it',
    summary: 'speed is a report, not a command',
    steps: [
      {
        patch: { gear: 0x0004, speed: 25 },
        narration: 'The wheels stay still. Speed is a report from the vehicle, not a command to it.',
      },
    ],
  },
  {
    title: 'Defrost and floor, together',
    summary: 'a bit field, not a choice from a list',
    steps: [
      {
        patch: { hvacPower: true, hvacFanDirection: 0x2 | 0x4 },
        narration:
          'Air goes to both places at once, because the value is DEFROST | FLOOR — a bit field, not a choice from a list.',
      },
    ],
  },
  {
    title: 'Drop one tyre below 180 kPa',
    summary: 'pressure is per-area',
    steps: [
      {
        patch: { tyreFrontLeft: 165 },
        narration:
          'The wheel is flagged individually. Pressure is a per-area property, so three wheels being fine tells you nothing about the fourth.',
      },
    ],
  },
  {
    title: 'Seat a passenger, unbuckle',
    summary: 'two properties, one decision',
    steps: [
      {
        patch: { seatOccupancy: 2 },
        narration:
          'The seat is now occupied — but the belt telltale stays off until the belt itself is checked next.',
      },
      {
        patch: { beltPassenger: false },
        narration:
          'The belt telltale only appears once the seat is occupied — two properties, one decision, both per-seat.',
      },
    ],
  },
  {
    title: 'Put a car 20 metres ahead',
    summary: 'a property the vehicle reports',
    steps: [
      {
        patch: { leadDistance: 20000 },
        narration:
          'It appears through the windscreen and on the cluster. The distance is a property the vehicle reports; nothing an app writes puts a car there.',
      },
    ],
  },
  {
    title: 'Turn the ignition off',
    summary: 'availability is a runtime condition',
    steps: [
      {
        patch: { ignition: 2 },
        narration:
          'Almost everything stops responding — a good reminder that property availability is a runtime condition, not a fixed fact about the vehicle.',
      },
    ],
  },
]
