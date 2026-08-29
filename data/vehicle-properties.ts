// GENERATED FILE — do not edit by hand.
// Run: node scripts/generate-vehicle-properties.mjs
//
// Source of truth:
//   automotive/vehicle/aidl_property/android/hardware/automotive/vehicle/VehicleProperty.aidl
//   car-lib/src/android/car/VehiclePropertyIds.java
// Generated from AOSP main on 2026-08-29.

export type PropertyGroup = 'SYSTEM' | 'VENDOR' | 'BACKPORTED'
export type PropertyArea =
  | 'GLOBAL' | 'WINDOW' | 'MIRROR' | 'SEAT' | 'DOOR' | 'WHEEL' | 'VENDOR'
export type PropertyValueType =
  | 'STRING' | 'BOOLEAN' | 'INT32' | 'INT32_VEC' | 'INT64' | 'INT64_VEC'
  | 'FLOAT' | 'FLOAT_VEC' | 'BYTES' | 'MIXED'

export type VehicleProperty = {
  /** AIDL enum name, e.g. PERF_VEHICLE_SPEED. */
  name: string
  /** Full 32-bit property ID. */
  id: number
  hex: string
  group: PropertyGroup
  area: PropertyArea
  type: PropertyValueType
  /** The 16-bit ordinal unique within the group. */
  ordinal: number
  changeMode?: string
  access?: string
  unit?: string
  /** Name of the enum that constrains this property's values, if any. */
  dataEnum?: string
  /** Minimum HAL version that defines this property. */
  version?: number
  deprecated: boolean
  description: string
  /** Line of the definition in VehicleProperty.aidl. */
  aidlLine: number
  /** Line in VehiclePropertyIds.java — absent means not in the public Car API. */
  javaLine?: number
  readPermissions?: string[]
  writePermissions?: string[]
  /** Every access mode the AIDL declares; more than one means either is valid. */
  accessModes: string[]
  /** Set only when car-lib's constant disagrees with the AIDL's computed ID. */
  javaId?: number
}

export const AIDL_PATH =
  'automotive/vehicle/aidl_property/android/hardware/automotive/vehicle/VehicleProperty.aidl'
export const JAVA_PATH = 'car-lib/src/android/car/VehiclePropertyIds.java'

export const vehicleProperties: VehicleProperty[] = [
  {
    "name": "INFO_VIN",
    "id": 286261504,
    "hex": "0x11100100",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "STRING",
    "ordinal": 256,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "VIN of vehicle",
    "aidlLine": 50,
    "javaLine": 83,
    "readPermissions": [
      "PERMISSION_IDENTIFICATION"
    ],
    "writePermissions": [
      "PERMISSION_IDENTIFICATION"
    ]
  },
  {
    "name": "INFO_MAKE",
    "id": 286261505,
    "hex": "0x11100101",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "STRING",
    "ordinal": 257,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Manufacturer of vehicle\n\nThis property must communicate the vehicle's public brand name.",
    "aidlLine": 59,
    "javaLine": 103,
    "readPermissions": [
      "PERMISSION_CAR_INFO"
    ],
    "writePermissions": [
      "PERMISSION_CAR_INFO"
    ]
  },
  {
    "name": "INFO_MODEL",
    "id": 286261506,
    "hex": "0x11100102",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "STRING",
    "ordinal": 258,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Model of vehicle\n\nThis property must communicate the vehicle's public model name.",
    "aidlLine": 70,
    "javaLine": 124,
    "readPermissions": [
      "PERMISSION_CAR_INFO"
    ],
    "writePermissions": [
      "PERMISSION_CAR_INFO"
    ]
  },
  {
    "name": "INFO_MODEL_YEAR",
    "id": 289407235,
    "hex": "0x11400103",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 259,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "YEAR",
    "version": 2,
    "deprecated": false,
    "description": "Model year of vehicle in YYYY format based on the Gregorian calendar.",
    "aidlLine": 81,
    "javaLine": 145,
    "readPermissions": [
      "PERMISSION_CAR_INFO"
    ],
    "writePermissions": [
      "PERMISSION_CAR_INFO"
    ]
  },
  {
    "name": "INFO_FUEL_CAPACITY",
    "id": 291504388,
    "hex": "0x11600104",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 260,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "MILLILITER",
    "version": 2,
    "deprecated": false,
    "description": "Fuel capacity of the vehicle in milliliters\n\nThis property must communicate the maximum amount of the fuel that can be stored in the\nvehicle in milliliters. This property does not apply to electric vehicles. That is, if\nINFO_FUEL_TYPE only contains FuelType::FUEL_TYPE_ELECTRIC, this property must not be\nimplemented. For EVs, implement INFO_EV_BATTERY_CAPACITY.",
    "aidlLine": 91,
    "javaLine": 164,
    "readPermissions": [
      "PERMISSION_CAR_INFO"
    ],
    "writePermissions": [
      "PERMISSION_CAR_INFO"
    ]
  },
  {
    "name": "INFO_FUEL_TYPE",
    "id": 289472773,
    "hex": "0x11410105",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32_VEC",
    "ordinal": 261,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "FuelType",
    "version": 2,
    "deprecated": false,
    "description": "List of fuels the vehicle may use.\n\nFuelType::FUEL_TYPE_ELECTRIC must only be included if the vehicle is plug in rechargeable.\nFor example:\n  An FHEV (Fully Hybrid Electric Vehicle) must not include FuelType::FUEL_TYPE_ELECTRIC in\n  INFO_FUEL_TYPE's INT32_VEC value. So INFO_FUEL_TYPE can be populated as such:\n    int32Values = { FuelType::FUEL_TYPE_UNLEADED }\n  On the other hand, a PHEV (Plug-in Hybrid Electric Vehicle) is plug in rechargeable, and\n  hence should include FuelType::FUEL_TYPE_ELECTRIC in INFO_FUEL_TYPE's INT32_VEC value. So\n  INFO_FUEL_TYPE can be populated as such:\n    int32Values = { FuelType::FUEL_TYPE_UNLEADED, FuelType::FUEL_TYPE_ELECTRIC }",
    "aidlLine": 106,
    "javaLine": 188,
    "readPermissions": [
      "PERMISSION_CAR_INFO"
    ],
    "writePermissions": [
      "PERMISSION_CAR_INFO"
    ]
  },
  {
    "name": "INFO_EV_BATTERY_CAPACITY",
    "id": 291504390,
    "hex": "0x11600106",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 262,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "WATT_HOUR",
    "version": 2,
    "deprecated": false,
    "description": "Nominal usable battery capacity for EV or hybrid vehicle\n\nReturns the nominal battery capacity, if EV or hybrid. This is the total usable battery\ncapacity when the vehicle is new. This value might be different from\nEV_CURRENT_BATTERY_CAPACITY because EV_CURRENT_BATTERY_CAPACITY returns the real-time usable\nbattery capacity taking into account factors such as battery aging and temperature\ndependency.",
    "aidlLine": 126,
    "javaLine": 225,
    "readPermissions": [
      "PERMISSION_CAR_INFO"
    ],
    "writePermissions": [
      "PERMISSION_CAR_INFO"
    ]
  },
  {
    "name": "INFO_EV_CONNECTOR_TYPE",
    "id": 289472775,
    "hex": "0x11410107",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32_VEC",
    "ordinal": 263,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "EvConnectorType",
    "version": 2,
    "deprecated": false,
    "description": "List of connectors this EV may use\n\nIf the vehicle has multiple charging ports, this property must return all possible connector\ntypes that can be used by at least one charging port on the vehicle.",
    "aidlLine": 142,
    "javaLine": 250,
    "readPermissions": [
      "PERMISSION_CAR_INFO"
    ],
    "writePermissions": [
      "PERMISSION_CAR_INFO"
    ]
  },
  {
    "name": "INFO_FUEL_DOOR_LOCATION",
    "id": 289407240,
    "hex": "0x11400108",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 264,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "PortLocationType",
    "version": 2,
    "deprecated": false,
    "description": "Fuel door location\n\nThis property must communicate the location of the fuel door on the vehicle. This property\ndoes not apply to electric vehicles. That is, if INFO_FUEL_TYPE only contains\nFuelType::FUEL_TYPE_ELECTRIC, this property must not be implemented. For EVs, implement\nINFO_EV_PORT_LOCATION or INFO_MULTI_EV_PORT_LOCATIONS.",
    "aidlLine": 155,
    "javaLine": 274,
    "readPermissions": [
      "PERMISSION_CAR_INFO"
    ],
    "writePermissions": [
      "PERMISSION_CAR_INFO"
    ]
  },
  {
    "name": "INFO_EV_PORT_LOCATION",
    "id": 289407241,
    "hex": "0x11400109",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 265,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "PortLocationType",
    "version": 2,
    "deprecated": false,
    "description": "EV port location\n\nThis property must communicate the location of the charging port on the EV using the\nPortLocationType enum. If there are multiple ports available on the vehicle, this property\nmust return the port that allows the fastest charging. To communicate all port locations,\nuse INFO_MULTI_EV_PORT_LOCATIONS.",
    "aidlLine": 170,
    "javaLine": 300,
    "readPermissions": [
      "PERMISSION_CAR_INFO"
    ],
    "writePermissions": [
      "PERMISSION_CAR_INFO"
    ]
  },
  {
    "name": "INFO_DRIVER_SEAT",
    "id": 356516106,
    "hex": "0x1540010a",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 266,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleAreaSeat",
    "version": 2,
    "deprecated": false,
    "description": "Driver's seat location\nVHAL implementations must ignore the areaId. Use VehicleArea:GLOBAL.",
    "aidlLine": 185,
    "javaLine": 347,
    "readPermissions": [
      "PERMISSION_CAR_INFO"
    ],
    "writePermissions": [
      "PERMISSION_CAR_INFO"
    ]
  },
  {
    "name": "INFO_EXTERIOR_DIMENSIONS",
    "id": 289472779,
    "hex": "0x1141010b",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32_VEC",
    "ordinal": 267,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "MILLIMETER",
    "version": 2,
    "deprecated": false,
    "description": "Exterior dimensions of vehicle.\n\n int32Values[0] = height\n int32Values[1] = length\n int32Values[2] = width\n int32Values[3] = width including mirrors\n int32Values[4] = wheel base\n int32Values[5] = track width front\n int32Values[6] = track width rear\n int32Values[7] = curb to curb turning diameter",
    "aidlLine": 196,
    "javaLine": 371,
    "readPermissions": [
      "PERMISSION_CAR_INFO"
    ],
    "writePermissions": [
      "PERMISSION_CAR_INFO"
    ]
  },
  {
    "name": "INFO_MULTI_EV_PORT_LOCATIONS",
    "id": 289472780,
    "hex": "0x1141010c",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32_VEC",
    "ordinal": 268,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "PortLocationType",
    "version": 2,
    "deprecated": false,
    "description": "Multiple EV port locations\n\nImplement this property if the vehicle has multiple EV ports.\nPort locations are defined in PortLocationType.\nFor example, a car has one port in front left and one port in rear left:\n  int32Values[0] = PortLocationType::FRONT_LEFT\n  int32Values[1] = PortLocationType::REAR_LEFT\n\nIf only one port exists on the vehicle, this property's value should list just one element.\nSee INFO_EV_PORT_LOCATION for describing just one port location.",
    "aidlLine": 215,
    "javaLine": 326,
    "readPermissions": [
      "PERMISSION_CAR_INFO"
    ],
    "writePermissions": [
      "PERMISSION_CAR_INFO"
    ]
  },
  {
    "name": "INFO_MODEL_TRIM",
    "id": 286261517,
    "hex": "0x1110010d",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "STRING",
    "ordinal": 269,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 4,
    "deprecated": false,
    "description": "Public trim name of the vehicle.\n\nThis property must communicate the vehicle's public trim name.\n\nFor example, say an OEM manufactures two different versions of a vehicle model:\n  \"makeName modelName\" and\n  \"makeName modelName Sport\"\nThis property must be empty for the first vehicle (i.e. base model), and set to \"Sport\" for\nthe second vehicle.",
    "aidlLine": 234,
    "javaLine": 402,
    "readPermissions": [
      "PERMISSION_CAR_INFO"
    ],
    "writePermissions": []
  },
  {
    "name": "INFO_VEHICLE_SIZE_CLASS",
    "id": 289472782,
    "hex": "0x1141010e",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32_VEC",
    "ordinal": 270,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleSizeClass",
    "version": 4,
    "deprecated": false,
    "description": "Vehicle Size Class.\n\nThis property must communicate an integer array that contains the size classifications\nfollowed by the vehicle as enumerated in VehicleSizeClass.aidl. If the vehicle follows a\nsingle standard, then the array size of the property's value should be 1. If the vehicle\nfollows multiple standards that the OEM wants to communicate, this may be communicated as\nadditional values in the array.\n\nFor example, suppose a vehicle model follows the VehicleSizeClass.EU_A_SEGMENT standard in\nthe EU and the VehicleSizeClass.JPN_KEI standard in Japan. In this scenario this property\nmust return an intArray = [VehicleSizeClass.EU_A_SEGMENT, VehicleSizeClass.JPN_KEI]. If this\nvehicle only followed the VehicleSizeClass.EU_A_SEGMENT standard, then we expect intArray =\n[VehicleSizeClass.EU_A_SEGMENT].",
    "aidlLine": 251,
    "javaLine": 432,
    "readPermissions": [
      "PERMISSION_CAR_INFO"
    ],
    "writePermissions": []
  },
  {
    "name": "PERF_ODOMETER",
    "id": 291504644,
    "hex": "0x11600204",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 516,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "KILOMETER",
    "version": 2,
    "deprecated": false,
    "description": "Current odometer value of the vehicle",
    "aidlLine": 273,
    "javaLine": 467,
    "readPermissions": [
      "PERMISSION_MILEAGE_3P",
      "PERMISSION_MILEAGE"
    ],
    "writePermissions": []
  },
  {
    "name": "PERF_VEHICLE_SPEED",
    "id": 291504647,
    "hex": "0x11600207",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 519,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "METER_PER_SEC",
    "version": 2,
    "deprecated": false,
    "description": "Speed of the vehicle\n\nThe value must be positive when the vehicle is moving forward and negative when\nthe vehicle is moving backward. This value is independent of gear value\n(CURRENT_GEAR or GEAR_SELECTION), for example, if GEAR_SELECTION is GEAR_NEUTRAL,\nPERF_VEHICLE_SPEED is positive when the vehicle is moving forward, negative when moving\nbackward, and zero when not moving.",
    "aidlLine": 283,
    "javaLine": 489,
    "readPermissions": [
      "PERMISSION_SPEED"
    ],
    "writePermissions": [
      "PERMISSION_SPEED"
    ]
  },
  {
    "name": "PERF_VEHICLE_SPEED_DISPLAY",
    "id": 291504648,
    "hex": "0x11600208",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 520,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "METER_PER_SEC",
    "version": 2,
    "deprecated": false,
    "description": "Speed of the vehicle for displays\n\nSome cars display a slightly slower speed than the actual speed.  This is\nusually displayed on the speedometer.",
    "aidlLine": 299,
    "javaLine": 514,
    "readPermissions": [
      "PERMISSION_SPEED"
    ],
    "writePermissions": [
      "PERMISSION_SPEED"
    ]
  },
  {
    "name": "PERF_STEERING_ANGLE",
    "id": 291504649,
    "hex": "0x11600209",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 521,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "DEGREES",
    "version": 2,
    "deprecated": false,
    "description": "Front bicycle model steering angle for vehicle\n\nAngle is in degrees.  Left is negative.\n\nThis property is independent of the angle of the steering wheel. This property must\ncommunicate the angle of the front wheels with respect to the vehicle, not the angle of the\nsteering wheel.",
    "aidlLine": 312,
    "javaLine": 536,
    "readPermissions": [
      "PERMISSION_READ_STEERING_STATE_3P",
      "PERMISSION_READ_STEERING_STATE"
    ],
    "writePermissions": []
  },
  {
    "name": "PERF_REAR_STEERING_ANGLE",
    "id": 291504656,
    "hex": "0x11600210",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 528,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "DEGREES",
    "version": 2,
    "deprecated": false,
    "description": "Rear bicycle model steering angle for vehicle\n\nAngle is in degrees.  Left is negative.\n\nThis property is independent of the angle of the steering wheel. This property must\ncommunicate the angle of the rear wheels with respect to the vehicle, not the angle of the\nsteering wheel.",
    "aidlLine": 328,
    "javaLine": 564,
    "readPermissions": [
      "PERMISSION_READ_STEERING_STATE"
    ],
    "writePermissions": [
      "PERMISSION_READ_STEERING_STATE"
    ]
  },
  {
    "name": "INSTANTANEOUS_FUEL_ECONOMY",
    "id": 291504657,
    "hex": "0x11600211",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 529,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 4,
    "deprecated": false,
    "description": "Instantaneous Fuel Economy in L/100km.\n\nThis property must communicate the instantaneous fuel economy of the vehicle in units of\nL/100km. The property's value is independent of DISTANCE_DISPLAY_UNITS,\nFUEL_VOLUME_DISPLAY_UNITS, and FUEL_CONSUMPTION_UNITS_DISTANCE_OVER_VOLUME property i.e. this\nproperty must always communicate the value in L/100km.\n\nFor the EV version of this property, see INSTANTANEOUS_EV_EFFICIENCY.",
    "aidlLine": 344,
    "javaLine": 590,
    "readPermissions": [
      "PERMISSION_MILEAGE_3P"
    ],
    "writePermissions": []
  },
  {
    "name": "INSTANTANEOUS_EV_EFFICIENCY",
    "id": 291504658,
    "hex": "0x11600212",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 530,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 4,
    "deprecated": false,
    "description": "Instantaneous EV efficiency in km/kWh.\n\nThis property must communicate the instantaneous EV battery efficiency of the vehicle in\nunits of km/kWh. The property's value is independent of the DISTANCE_DISPLAY_UNITS and\nEV_BATTERY_DISPLAY_UNITS properties i.e. this property must always communicate the value in\nkm/kWh.\n\nFor the fuel version of this property, see INSTANTANEOUS_FUEL_ECONOMY.",
    "aidlLine": 360,
    "javaLine": 618,
    "readPermissions": [
      "PERMISSION_MILEAGE_3P"
    ],
    "writePermissions": []
  },
  {
    "name": "ENGINE_COOLANT_TEMP",
    "id": 291504897,
    "hex": "0x11600301",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 769,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "CELSIUS",
    "version": 2,
    "deprecated": false,
    "description": "Temperature of engine coolant",
    "aidlLine": 376,
    "javaLine": 647,
    "readPermissions": [
      "PERMISSION_CAR_ENGINE_DETAILED"
    ],
    "writePermissions": [
      "PERMISSION_CAR_ENGINE_DETAILED"
    ]
  },
  {
    "name": "ENGINE_OIL_LEVEL",
    "id": 289407747,
    "hex": "0x11400303",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 771,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleOilLevel",
    "version": 2,
    "deprecated": false,
    "description": "Engine oil level",
    "aidlLine": 386,
    "javaLine": 667,
    "readPermissions": [
      "PERMISSION_CAR_ENGINE_DETAILED"
    ],
    "writePermissions": []
  },
  {
    "name": "ENGINE_OIL_TEMP",
    "id": 291504900,
    "hex": "0x11600304",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 772,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "CELSIUS",
    "version": 2,
    "deprecated": false,
    "description": "Temperature of engine oil",
    "aidlLine": 396,
    "javaLine": 692,
    "readPermissions": [
      "PERMISSION_CAR_ENGINE_DETAILED"
    ],
    "writePermissions": [
      "PERMISSION_CAR_ENGINE_DETAILED"
    ]
  },
  {
    "name": "ENGINE_RPM",
    "id": 291504901,
    "hex": "0x11600305",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 773,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "RPM",
    "version": 2,
    "deprecated": false,
    "description": "Engine rpm",
    "aidlLine": 406,
    "javaLine": 712,
    "readPermissions": [
      "PERMISSION_CAR_ENGINE_DETAILED_3P",
      "PERMISSION_CAR_ENGINE_DETAILED"
    ],
    "writePermissions": []
  },
  {
    "name": "WHEEL_TICK",
    "id": 290521862,
    "hex": "0x11510306",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT64_VEC",
    "ordinal": 774,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Reports wheel ticks\n\nThe first element in the vector is a reset count.  A reset indicates\nprevious tick counts are not comparable with this and future ones.  Some\nsort of discontinuity in tick counting has occurred.\n\nThe next four elements represent ticks for individual wheels in the\nfollowing order: front left, front right, rear right, rear left.  All\ntick counts are cumulative.  Tick counts increment when the vehicle\nmoves forward, and decrement when vehicles moves in reverse.  The ticks\nshould be reset to 0 when the vehicle is started by the user.\n\n int64Values[0] = reset count\n int64Values[1] = front left ticks\n int64Values[2] = front right ticks\n int64Values[3] = rear right ticks\n int64Values[4] = rear left ticks\n\nconfigArray is used to indicate the micrometers-per-wheel-tick value and\nwhich wheels are supported.  configArray is set as follows:\n\n configArray[0], bits [0:3] = supported wheels. Uses enum Wheel. For example, if all wheels\n   are supported, then configArray[0] = VehicleAreaWheel::LEFT_FRONT\n   | VehicleAreaWheel::RIGHT_FRONT | VehicleAreaWheel::LEFT_REAR\n   | VehicleAreaWheel::RIGHT_REAR\n configArray[1] = micrometers per front left wheel tick\n configArray[2] = micrometers per front right wheel tick\n configArray[3] = micrometers per rear right wheel tick\n configArray[4] = micrometers per rear left wheel tick\n\nNOTE:  If a wheel is not supported, its value shall always be set to 0.\n\nVehiclePropValue.timestamp must be correctly filled in.",
    "aidlLine": 416,
    "javaLine": 819,
    "readPermissions": [
      "PERMISSION_SPEED"
    ],
    "writePermissions": [
      "PERMISSION_SPEED"
    ]
  },
  {
    "name": "FUEL_LEVEL",
    "id": 291504903,
    "hex": "0x11600307",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 775,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "MILLILITER",
    "version": 2,
    "deprecated": false,
    "description": "Fuel level in milliliters\n\nThis property must communicate the current amount of fuel remaining in the vehicle in\nmilliliters. This property does not apply to electric vehicles. That is, if INFO_FUEL_TYPE\nonly contains FuelType::FUEL_TYPE_ELECTRIC, this property must not be implemented. For EVs,\nimplement EV_BATTERY_LEVEL.\n\nValue may not exceed INFO_FUEL_CAPACITY.",
    "aidlLine": 457,
    "javaLine": 875,
    "readPermissions": [
      "PERMISSION_ENERGY"
    ],
    "writePermissions": [
      "PERMISSION_ENERGY"
    ]
  },
  {
    "name": "FUEL_DOOR_OPEN",
    "id": 287310600,
    "hex": "0x11200308",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 776,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Fuel door open\n\nThis property must communicate whether the fuel door on the vehicle is open or not. This\nproperty does not apply to electric vehicles. That is, if INFO_FUEL_TYPE only contains\nFuelType::FUEL_TYPE_ELECTRIC, this property must not be implemented. For EVs, implement\nEV_CHARGE_PORT_OPEN.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 474,
    "javaLine": 901,
    "readPermissions": [
      "PERMISSION_ENERGY_PORTS",
      "PERMISSION_CONTROL_ENERGY_PORTS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_ENERGY_PORTS"
    ]
  },
  {
    "name": "EV_BATTERY_LEVEL",
    "id": 291504905,
    "hex": "0x11600309",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 777,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "WATT_HOUR",
    "version": 2,
    "deprecated": false,
    "description": "Battery level for EV or hybrid vehicle\n\nReturns the current battery level, if EV or hybrid. This value will not exceed\nEV_CURRENT_BATTERY_CAPACITY. To calculate the battery percentage, use:\n(EV_BATTERY_LEVEL/EV_CURRENT_BATTERY_CAPACITY)*100.",
    "aidlLine": 492,
    "javaLine": 930,
    "readPermissions": [
      "PERMISSION_ENERGY"
    ],
    "writePermissions": [
      "PERMISSION_ENERGY"
    ]
  },
  {
    "name": "EV_CURRENT_BATTERY_CAPACITY",
    "id": 291504909,
    "hex": "0x1160030d",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 781,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "WATT_HOUR",
    "version": 2,
    "deprecated": false,
    "description": "Current usable battery capacity for EV or hybrid vehicle\n\nReturns the actual value of battery capacity, if EV or hybrid. This property captures the\nreal-time usable battery capacity taking into account factors such as battery aging and\ntemperature dependency. Therefore, this value might be different from\nINFO_EV_BATTERY_CAPACITY because INFO_EV_BATTERY_CAPACITY returns the nominal battery\ncapacity from when the vehicle was new.",
    "aidlLine": 506,
    "javaLine": 954,
    "readPermissions": [
      "PERMISSION_ENERGY"
    ],
    "writePermissions": [
      "PERMISSION_ENERGY"
    ]
  },
  {
    "name": "EV_CHARGE_PORT_OPEN",
    "id": 287310602,
    "hex": "0x1120030a",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 778,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "EV charge port open\n\nIf the vehicle has multiple charging ports, this property must return true if any of the\ncharge ports are open.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 522,
    "javaLine": 979,
    "readPermissions": [
      "PERMISSION_ENERGY_PORTS",
      "PERMISSION_CONTROL_ENERGY_PORTS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_ENERGY_PORTS"
    ]
  },
  {
    "name": "EV_CHARGE_PORT_CONNECTED",
    "id": 287310603,
    "hex": "0x1120030b",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 779,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "EV charge port connected\n\nIf the vehicle has multiple charging ports, this property must return true if any of the\ncharge ports are connected.",
    "aidlLine": 538,
    "javaLine": 1006,
    "readPermissions": [
      "PERMISSION_ENERGY_PORTS"
    ],
    "writePermissions": [
      "PERMISSION_ENERGY_PORTS"
    ]
  },
  {
    "name": "EV_BATTERY_INSTANTANEOUS_CHARGE_RATE",
    "id": 291504908,
    "hex": "0x1160030c",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 780,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "MILLIWATTS",
    "version": 2,
    "deprecated": false,
    "description": "EV instantaneous charge rate in milliwatts\n\nPositive value indicates battery is being charged.\nNegative value indicates battery being discharged.",
    "aidlLine": 550,
    "javaLine": 1028,
    "readPermissions": [
      "PERMISSION_ENERGY"
    ],
    "writePermissions": [
      "PERMISSION_ENERGY"
    ]
  },
  {
    "name": "RANGE_REMAINING",
    "id": 291504904,
    "hex": "0x11600308",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 776,
    "changeMode": "CONTINUOUS",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "unit": "METER",
    "version": 2,
    "deprecated": false,
    "description": "Range remaining\n\nMeters remaining of fuel and charge.  Range remaining shall account for\nall energy sources in a vehicle.  For example, a hybrid car's range will\nbe the sum of the ranges based on fuel and battery.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE because a navigation app could\nupdate the range if it has a more accurate estimate based on the upcoming route. However,\nthis property can be implemented as VehiclePropertyAccess.READ only at the OEM's discretion.",
    "aidlLine": 563,
    "javaLine": 1050,
    "readPermissions": [
      "PERMISSION_ENERGY",
      "PERMISSION_ADJUST_RANGE_REMAINING"
    ],
    "writePermissions": [
      "PERMISSION_ADJUST_RANGE_REMAINING"
    ]
  },
  {
    "name": "EV_BATTERY_AVERAGE_TEMPERATURE",
    "id": 291504910,
    "hex": "0x1160030e",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 782,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "CELSIUS",
    "version": 3,
    "deprecated": false,
    "description": "EV battery average temperature\n\nExposes the temperature of the battery in an EV. If multiple batteries exist in the EV, or\nmultiple temperature sensors exist, this property should be set to the mean or a meaningful\nweighted average that best represents the overall temperature of the battery system.",
    "aidlLine": 582,
    "javaLine": 1077,
    "readPermissions": [
      "PERMISSION_ENERGY"
    ],
    "writePermissions": []
  },
  {
    "name": "TIRE_PRESSURE",
    "id": 392168201,
    "hex": "0x17600309",
    "group": "SYSTEM",
    "area": "WHEEL",
    "type": "FLOAT",
    "ordinal": 777,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "KILOPASCAL",
    "version": 2,
    "deprecated": false,
    "description": "Tire pressure\n\n{@code HasSupportedValueInfo.hasMinSupportedValue} and\n{@code HasSupportedValueInfo.hasMaxSupportedValue} must be {@code true} for all areas.\n\n{@code MinMaxSupportedValueResult.minSupportedValue} represents the lower bound of the\nrecommended tire pressure for the tire at the specified area ID.\n\n{@code MinMaxSupportedValueResult.maxSupportedValue} represents the upper bound of the\nrecommended tire pressure for the tire at the specified area ID.\n\nFor example, if the recommended tire pressure of left_front tire is from 200.0 KILOPASCAL to\n240.0 KILOPASCAL, {@code getMinMaxSupportedValue} for\n[propId=TIRE_PRESSURE, areaId=VehicleAreaWheel::LEFT_FRONT] must return a\n{@code MinMaxSupportedValueResult} with OK status, 200.0 as minSupportedValue, 240.0 as\nmaxSupportedValue.\n\nFor backward compatibility, minFloatValue and maxFloatValue in {@code VehicleAreaConfig}\nmust be set to the same as minSupportedValue and maxSupportedValue at boot time.\n\nEach tire is identified by its areaConfig.areaId config.\n\nFor example:\n.areaConfigs = {\n     VehicleAreaConfig {\n         .areaId = VehicleAreaWheel::LEFT_FRONT,\n         .minFloatValue = 200.0,\n         .maxFloatValue = 240.0,\n     }\n},",
    "aidlLine": 596,
    "javaLine": 1101,
    "readPermissions": [
      "PERMISSION_TIRES_3P",
      "PERMISSION_TIRES"
    ],
    "writePermissions": []
  },
  {
    "name": "CRITICALLY_LOW_TIRE_PRESSURE",
    "id": 392168202,
    "hex": "0x1760030a",
    "group": "SYSTEM",
    "area": "WHEEL",
    "type": "FLOAT",
    "ordinal": 778,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "KILOPASCAL",
    "version": 2,
    "deprecated": false,
    "description": "Critically low tire pressure\n\nThis property indicates the critically low pressure threshold for each tire.\nIt indicates when it is time for tires to be replaced or fixed. The value\nmust be less than or equal to minFloatValue in TIRE_PRESSURE.\nMinimum and maximum property values (that is, minFloatValue, maxFloatValue)\nare not applicable to this property.",
    "aidlLine": 636,
    "javaLine": 1128,
    "readPermissions": [
      "PERMISSION_TIRES"
    ],
    "writePermissions": [
      "PERMISSION_TIRES"
    ]
  },
  {
    "name": "ACCELERATOR_PEDAL_COMPRESSION_PERCENTAGE",
    "id": 291504911,
    "hex": "0x1160030f",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 783,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 4,
    "deprecated": false,
    "description": "Accelerator pedal compression percentage.\n\nThis property must communicate the percentage that the physical accelerator pedal in the\nvehicle is compressed. This property must return a float value from 0 to 100.\n\n0 indicates the pedal is not compressed.\n100 indicates the pedal is maximally compressed.",
    "aidlLine": 652,
    "javaLine": 1152,
    "readPermissions": [
      "PERMISSION_READ_CAR_PEDALS"
    ],
    "writePermissions": []
  },
  {
    "name": "BRAKE_PEDAL_COMPRESSION_PERCENTAGE",
    "id": 291504912,
    "hex": "0x11600310",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 784,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 4,
    "deprecated": false,
    "description": "Brake pedal compression percentage.\n\nThis property must communicate the percentage that the physical brake pedal in the vehicle is\ncompressed. This property must return a float value from 0 to 100.\n\n0 indicates the pedal is not compressed.\n100 indicates the pedal is maximally compressed.",
    "aidlLine": 667,
    "javaLine": 1179,
    "readPermissions": [
      "PERMISSION_READ_CAR_PEDALS"
    ],
    "writePermissions": []
  },
  {
    "name": "BRAKE_PAD_WEAR_PERCENTAGE",
    "id": 392168209,
    "hex": "0x17600311",
    "group": "SYSTEM",
    "area": "WHEEL",
    "type": "FLOAT",
    "ordinal": 785,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 4,
    "deprecated": false,
    "description": "Brake pad wear percentage.\n\nThis property must communicate the amount of brake pad wear accumulated by the vehicle as a\npercentage. This property return a float value from 0 to 100.\n\n0 indicates the brake pad has no wear.\n100 indicates the brake pad is maximally worn.",
    "aidlLine": 682,
    "javaLine": 1206,
    "readPermissions": [
      "PERMISSION_READ_BRAKE_INFO"
    ],
    "writePermissions": []
  },
  {
    "name": "BRAKE_FLUID_LEVEL_LOW",
    "id": 287310610,
    "hex": "0x11200312",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 786,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 4,
    "deprecated": false,
    "description": "Brake fluid low.\n\nThis property must communicate that the brake fluid level in the vehicle is low according to\nthe OEM. This property must match the vehicle's brake fluid level status as displayed on the\ninstrument cluster. If the brake fluid level is low, this property must be set to true. If\nnot, it must be set to false.",
    "aidlLine": 697,
    "javaLine": 1233,
    "readPermissions": [
      "PERMISSION_READ_BRAKE_INFO"
    ],
    "writePermissions": []
  },
  {
    "name": "VEHICLE_PASSIVE_SUSPENSION_HEIGHT",
    "id": 390071059,
    "hex": "0x17400313",
    "group": "SYSTEM",
    "area": "WHEEL",
    "type": "INT32",
    "ordinal": 787,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 4,
    "deprecated": false,
    "description": "Vehicle Passive Suspension Height in mm.\n\nThis property must communicate the real-time suspension displacement of the vehicle relative\nto its neutral position, given in mm. In other words, the displacement of the suspension at\nany given point in time relative to the suspension's position when the vehicle is on a flat\nsurface with no passengers or cargo. When the suspension is compressed in comparison to the\nneutral position, the value should be negative. When the suspension is decompressed in\ncomparison to the neutral position, the value should be positive.\n\nExamples for further clarity:\n  1) Suppose the user is driving on a smooth flat surface, and all wheels are currently\n  compressed by 2 cm in comparison to the default suspension height. In this scenario, this\n  property must be set to -20 for all wheels.\n  2) Suppose the user drives over a pothole. While the front left wheel is over the pothole,\n  it's decompressed by 3 cm in comparison to the rest of the wheels, or 1 cm in comparison to\n  the default suspension height. All the others are still compressed by 2 cm. In this\n  scenario, this property must be set to -20 for all wheels except for the front left, which\n  must be set to 10.\n\nHasSupportedValueInfo.hasMinSupportedValue and HasSupportedValueInfo.hasMaxSupportedValue\nmust be true for all areas.\n\nMinMaxSupportedValueResult.minSupportedValue represents the lower bound of the suspension\nheight for the wheel at the specified area ID.\n\nMinMaxSupportedValueResult.maxSupportedValue represents the upper bound of the suspension\nheight for the wheel at the specified area ID.",
    "aidlLine": 711,
    "javaLine": 1258,
    "readPermissions": [
      "PERMISSION_CAR_DYNAMICS_STATE"
    ],
    "writePermissions": []
  },
  {
    "name": "ENGINE_IDLE_AUTO_STOP_ENABLED",
    "id": 287310624,
    "hex": "0x11200320",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 800,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Represents feature for engine idle automatic stop.\n\nIf true, the vehicle may automatically shut off the engine when it is not needed and then\nautomatically restart it when needed.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 746,
    "javaLine": 734,
    "readPermissions": [
      "PERMISSION_CAR_ENGINE_DETAILED"
    ],
    "writePermissions": [
      "PERMISSION_CAR_ENGINE_DETAILED"
    ]
  },
  {
    "name": "IMPACT_DETECTED",
    "id": 289407792,
    "hex": "0x11400330",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 816,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "ImpactSensorLocation",
    "version": 3,
    "deprecated": false,
    "description": "Impact detected.\n\nBit flag property to relay information on whether an impact has occurred on a particular side\nof the vehicle as described through the ImpactSensorLocation enum. As a bit flag property,\nthis property can be set to multiple ORed together values of the enum when necessary.\n\nFor the global area ID (0), {@code getSupportedValuesList}\nmust return a {@code SupportedValuesListResult} that contains supported values unless all bit\nflags of ImpactSensorLocation are supported.\n\nFor backward compatibility, if {@code SupportedValuesListResult} is defined,\n{@code VehicleAreaConfig#supportedEnumValues} must be set to the same values.",
    "aidlLine": 762,
    "javaLine": 758,
    "readPermissions": [
      "PERMISSION_READ_IMPACT_SENSORS"
    ],
    "writePermissions": []
  },
  {
    "name": "VEHICLE_HORN_ENGAGED",
    "id": 287310656,
    "hex": "0x11200340",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 832,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 4,
    "deprecated": false,
    "description": "Vehicle horn engaged.\n\nThis property must communicate if the vehicle's horn is currently engaged or not. If true,\nthe horn is engaged. If false, the horn is disengaged.",
    "aidlLine": 783,
    "javaLine": 792,
    "readPermissions": [
      "PERMISSION_READ_CAR_HORN",
      "PERMISSION_CONTROL_CAR_HORN"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_HORN"
    ]
  },
  {
    "name": "GEAR_SELECTION",
    "id": 289408000,
    "hex": "0x11400400",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 1024,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleGear",
    "version": 2,
    "deprecated": false,
    "description": "Currently selected gear\n\nThis is the gear selected by the user.\n\n{@code VehicleAreaConfig.HasSupportedValueInfo.hasSupportedValuesList} for the global area ID\n(0) must be {@code true}.\n\n{@code getSupportedValuesList} for [GEAR_SELECTION, areaId=0] must return a\n{@code SupportedValuesListResult} that contains non-null {@code supportedValuesList}.\n\nThe supportedValues must represent the list of supported gears for this vehicle. For example,\nfor an automatic transmission, the list can be {GEAR_NEUTRAL, GEAR_REVERSE, GEAR_PARK,\nGEAR_DRIVE, GEAR_1, GEAR_2,...} and for manual transmission it can be {GEAR_NEUTRAL,\nGEAR_REVERSE, GEAR_1, GEAR_2,...}.\n\nIn the case of an automatic transmission vehicle that allows the driver to select specific\ngears on demand (i.e. \"manual mode\"), GEAR_SELECTION's value must be set to the specific gear\nselected by the driver instead of simply GEAR_DRIVE.\n\nFor backward compatibility, config array for this property must be a list of values\nsame as the supported values at boot-time.",
    "aidlLine": 796,
    "javaLine": 1308,
    "readPermissions": [
      "PERMISSION_POWERTRAIN"
    ],
    "writePermissions": [
      "PERMISSION_POWERTRAIN"
    ]
  },
  {
    "name": "CURRENT_GEAR",
    "id": 289408001,
    "hex": "0x11400401",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 1025,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleGear",
    "version": 2,
    "deprecated": false,
    "description": "Current gear. In non-manual case, selected gear may not\nmatch the current gear. For example, if the selected gear is GEAR_DRIVE,\nthe current gear will be one of GEAR_1, GEAR_2 etc, which reflects\nthe actual gear the transmission is currently running in.\n\n{@code VehicleAreaConfig.HasSupportedValueInfo.hasSupportedValuesList} for the global area ID\n(0) must be {@code true}.\n\n{@code getSupportedValuesList} for [GEAR_SELECTION, areaId=0] must return a\n{@code SupportedValuesListResult} that contains non-null {@code supportedValuesList}.\n\nThe supported values list must represent the list of supported gears\nfor this vehicle.  For example, for an automatic transmission, this list can be\n{GEAR_NEUTRAL, GEAR_REVERSE, GEAR_PARK, GEAR_1, GEAR_2,...}\nand for manual transmission the list can be\n{GEAR_NEUTRAL, GEAR_REVERSE, GEAR_1, GEAR_2,...}. This list need not be the\nsame as that of the supported gears reported in GEAR_SELECTION.\n\nFor backward compatibility, config array for this property must be a list of values\nsame as the supported values at boot-time.",
    "aidlLine": 828,
    "javaLine": 1362,
    "readPermissions": [
      "PERMISSION_POWERTRAIN"
    ],
    "writePermissions": [
      "PERMISSION_POWERTRAIN"
    ]
  },
  {
    "name": "PARKING_BRAKE_ON",
    "id": 287310850,
    "hex": "0x11200402",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 1026,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Parking brake state.\n\nThis property is true indicates that the car's parking brake is currently engaged. False\nimplies that the car's parking brake is currently disengaged.",
    "aidlLine": 859,
    "javaLine": 1420,
    "readPermissions": [
      "PERMISSION_POWERTRAIN"
    ],
    "writePermissions": [
      "PERMISSION_POWERTRAIN"
    ]
  },
  {
    "name": "PARKING_BRAKE_AUTO_APPLY",
    "id": 287310851,
    "hex": "0x11200403",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 1027,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Auto-apply parking brake.\n\nThis property is true indicates that the car's automatic parking brake feature is currently\nenabled. False indicates that the car's automatic parking brake feature is currently\ndisabled.\n\nThis property is often confused with PARKING_BRAKE_ON. The difference is that\nPARKING_BRAKE_ON describes whether the actual parking brake is currently on/off, whereas\nPARKING_BRAKE_AUTO_APPLY describes whether the feature of automatic parking brake is enabled/\ndisabled, and does not describe the current state of the actual parking brake.",
    "aidlLine": 871,
    "javaLine": 1442,
    "readPermissions": [
      "PERMISSION_POWERTRAIN"
    ],
    "writePermissions": [
      "PERMISSION_POWERTRAIN"
    ]
  },
  {
    "name": "EV_BRAKE_REGENERATION_LEVEL",
    "id": 289408012,
    "hex": "0x1140040c",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 1036,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Regenerative braking level of a electronic vehicle\n\n{@code HasSupportedValueInfo.hasMinSupportedValue} and\n{@code HasSupportedValueInfo.hasMaxSupportedValue} must be {@code true} for global area ID(0)\n\n{@code MinMaxSupportedValueResult.minSupportedValue} must be 0.\n\n{@code MinMaxSupportedValueResult.maxSupportedValue} indicates the setting for the maximum\namount of energy regenerated from braking. The minSupportedValue indicates the setting for no\nregenerative braking.\n\nAll values between min and max supported value must be supported.\n\nFor backward compatibility, minInt32Value and maxInt32Value in {@code VehicleAreaConfig}\nmust be set to the same as minSupportedValue and maxSupportedValue at boot time.\n\nThis property is a more granular form of EV_REGENERATIVE_BRAKING_STATE. It allows the user to\nset a more specific level of regenerative braking if the states in EvRegenerativeBrakingState\nare not granular enough for the OEM.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 889,
    "javaLine": 1471,
    "readPermissions": [
      "PERMISSION_POWERTRAIN",
      "PERMISSION_CONTROL_POWERTRAIN"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_POWERTRAIN"
    ]
  },
  {
    "name": "FUEL_LEVEL_LOW",
    "id": 287310853,
    "hex": "0x11200405",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 1029,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Warning for fuel low level.\n\nThis property corresponds to the low fuel warning on the dashboard.\nOnce FUEL_LEVEL_LOW is set, it should not be cleared until more fuel is\nadded to the vehicle.  This property may take into account all fuel\nsources for a vehicle - for example:\n\n  For a gas powered vehicle, this property is based soley on gas level.\n  For a battery powered vehicle, this property is based solely on battery level.\n  For a hybrid vehicle, this property may be based on the combination of gas and battery\n     levels, at the OEM's discretion.",
    "aidlLine": 921,
    "javaLine": 1533,
    "readPermissions": [
      "PERMISSION_ENERGY"
    ],
    "writePermissions": [
      "PERMISSION_ENERGY"
    ]
  },
  {
    "name": "NIGHT_MODE",
    "id": 287310855,
    "hex": "0x11200407",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 1031,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Night mode\n\nTrue indicates that the night mode sensor has detected that the car cabin environment has\nlow light. The platform could use this, for example, to enable appropriate UI for\nbetter viewing in dark or low light environments.",
    "aidlLine": 940,
    "javaLine": 1562,
    "readPermissions": [
      "PERMISSION_EXTERIOR_ENVIRONMENT"
    ],
    "writePermissions": [
      "PERMISSION_EXTERIOR_ENVIRONMENT"
    ]
  },
  {
    "name": "TURN_SIGNAL_STATE",
    "id": 289408008,
    "hex": "0x11400408",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 1032,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleTurnSignal",
    "version": 2,
    "deprecated": true,
    "description": "(Deprecated) State of the vehicles turn signals\n\nThis property has been deprecated as it ambiguously defines the state of the vehicle turn\nsignals without making clear if it means the state of the turn signal lights or the state of\nthe turn signal switch. The introduction of TURN_SIGNAL_LIGHT_STATE and TURN_SIGNAL_SWITCH\nrectifies this problem.",
    "aidlLine": 953,
    "javaLine": 1584,
    "readPermissions": [
      "PERMISSION_EXTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_EXTERIOR_LIGHTS"
    ]
  },
  {
    "name": "IGNITION_STATE",
    "id": 289408009,
    "hex": "0x11400409",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 1033,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleIgnitionState",
    "version": 2,
    "deprecated": false,
    "description": "Represents ignition state",
    "aidlLine": 968,
    "javaLine": 1614,
    "readPermissions": [
      "PERMISSION_POWERTRAIN"
    ],
    "writePermissions": [
      "PERMISSION_POWERTRAIN"
    ]
  },
  {
    "name": "ABS_ACTIVE",
    "id": 287310858,
    "hex": "0x1120040a",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 1034,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "ABS is active\n\nSet to true when ABS is active.  Reset to false when ABS is off.  This\nproperty may be intermittently set (pulsing) based on the real-time\nstate of the ABS system.",
    "aidlLine": 978,
    "javaLine": 1637,
    "readPermissions": [
      "PERMISSION_CAR_DYNAMICS_STATE"
    ],
    "writePermissions": [
      "PERMISSION_CAR_DYNAMICS_STATE"
    ]
  },
  {
    "name": "TRACTION_CONTROL_ACTIVE",
    "id": 287310859,
    "hex": "0x1120040b",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 1035,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Traction Control is active\n\nSet to true when traction control (TC) is active.  Reset to false when\nTC is off.  This property may be intermittently set (pulsing) based on\nthe real-time state of the TC system.",
    "aidlLine": 991,
    "javaLine": 1657,
    "readPermissions": [
      "PERMISSION_CAR_DYNAMICS_STATE"
    ],
    "writePermissions": [
      "PERMISSION_CAR_DYNAMICS_STATE"
    ]
  },
  {
    "name": "EV_STOPPING_MODE",
    "id": 289408013,
    "hex": "0x1140040d",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 1037,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "EvStoppingMode",
    "version": 2,
    "deprecated": false,
    "description": "Represents property for the current stopping mode of the vehicle.\n\nFor the global area ID (0), {@code getSupportedValuesList}\nmust return a {@code SupportedValuesListResult} that contains supported values unless all\nenum values of EvStoppingMode are supported.\n\nFor backward compatibility, if {@code SupportedValuesListResult} is defined,\n{@code VehicleAreaConfig#supportedEnumValues} must be set to the same values.\n\nThe EvStoppingMode enum may be extended to include more states in the future.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1004,
    "javaLine": 1501,
    "readPermissions": [
      "PERMISSION_POWERTRAIN",
      "PERMISSION_CONTROL_POWERTRAIN"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_POWERTRAIN"
    ]
  },
  {
    "name": "ELECTRONIC_STABILITY_CONTROL_ENABLED",
    "id": 287310862,
    "hex": "0x1120040e",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 1038,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 3,
    "deprecated": false,
    "description": "Enable or disable Electronic Stability Control (ESC).\n\nSet true to enable ESC and false to disable ESC. When ESC is enabled, a system in the vehicle\nshould be controlling the tires during instances with high risk of skidding to actively\nprevent the same from happening.\n\nIn general, ELECTRONIC_STABILITY_CONTROL_ENABLED should always return true or false. If the\nfeature is not available due to some temporary state, such as the vehicle speed being too\nhigh, that information must be conveyed through the ErrorState values in the\nELECTRONIC_STABILITY_CONTROL_STATE property.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1027,
    "javaLine": 1677,
    "readPermissions": [
      "PERMISSION_CAR_DYNAMICS_STATE",
      "PERMISSION_CONTROL_CAR_DYNAMICS_STATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_DYNAMICS_STATE"
    ]
  },
  {
    "name": "ELECTRONIC_STABILITY_CONTROL_STATE",
    "id": 289408015,
    "hex": "0x1140040f",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 1039,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "ElectronicStabilityControlState",
    "version": 3,
    "deprecated": false,
    "description": "Electronic Stability Control (ESC) state.\n\nReturns the current state of ESC. This property must always return a valid state defined in\nElectronicStabilityControlState or ErrorState. It must not surface errors through StatusCode\nand must use the supported error states instead.\n\nFor the global area ID (0), {@code getSupportedValuesList}\nmust return a {@code SupportedValuesListResult} that contains supported values unless all\nstates of both ElectronicStabilityControlState (including OTHER, which is not\nrecommended) and ErrorState are supported.\n\nFor backward compatibility, if {@code SupportedValuesListResult} is defined,\n{@code VehicleAreaConfig#supportedEnumValues} must be set to the same values.",
    "aidlLine": 1049,
    "javaLine": 1710,
    "readPermissions": [
      "PERMISSION_CAR_DYNAMICS_STATE"
    ],
    "writePermissions": []
  },
  {
    "name": "TURN_SIGNAL_LIGHT_STATE",
    "id": 289408016,
    "hex": "0x11400410",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 1040,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleTurnSignal",
    "version": 4,
    "deprecated": false,
    "description": "Turn signal light state.\n\nThis property must communicate the actual state of the turn signal lights.\n\nExamples:\n  1) Left turn signal light is currently pulsing, right turn signal light is currently off.\n  This property must return VehicleTurnSignal.LEFT while the light is on during the pulse,\n  and VehicleTurnSignal.NONE when it is off during the pulse.\n  2) Right turn signal light is currently pulsing, left turn signal light is currently off.\n  This property must return VehicleTurnSignal.RIGHT while the light is on during the pulse,\n  and VehicleTurnSignal.NONE when it is off during the pulse.\n  3) Both turn signal lights are currently pulsing (e.g. when hazard lights switch is on).\n  This property must return VehicleTurnSignal.LEFT | VehicleTurnSignal.RIGHT while the lights\n  are on during the pulse, and VehicleTurnSignal.NONE when they are off during the pulse.\n\nNote that this property uses VehicleTurnSignal as a bit flag, unlike TURN_SIGNAL_SWITCH,\nwhich uses it like a regular enum. This means this property can support ORed together values\nin VehicleTurnSignal.\n\nThis is different from the function of TURN_SIGNAL_SWITCH, which must communicate the state\nof the turn signal lever/switch.\n\nThis property is a replacement to the TURN_SIGNAL_STATE property, which is now deprecated.",
    "aidlLine": 1072,
    "javaLine": 1744,
    "readPermissions": [
      "PERMISSION_READ_EXTERIOR_LIGHTS",
      "PERMISSION_CONTROL_EXTERIOR_LIGHTS"
    ],
    "writePermissions": []
  },
  {
    "name": "TURN_SIGNAL_SWITCH",
    "id": 289408017,
    "hex": "0x11400411",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 1041,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "VehicleTurnSignal",
    "version": 4,
    "deprecated": false,
    "description": "Turn signal switch.\n\nThis property must communicate the state of the turn signal lever/switch. This is different\nfrom the function of TURN_SIGNAL_LIGHT_STATE, which must communicate the actual state of the\nturn signal lights.\n\nNote that this property uses VehicleTurnSignal as a regular enum, unlike\nTURN_SIGNAL_LIGHT_STATE, which uses it like a bit flag. This means this property cannot\nsupport ORed together values in VehicleTurnSignal.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1104,
    "javaLine": 1792,
    "readPermissions": [
      "PERMISSION_READ_EXTERIOR_LIGHTS",
      "PERMISSION_CONTROL_EXTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_EXTERIOR_LIGHTS"
    ]
  },
  {
    "name": "HVAC_FAN_SPEED",
    "id": 356517120,
    "hex": "0x15400500",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 1280,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Fan speed setting\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates the lowest fan speed.\nThe maxInt32Value indicates the highest fan speed.\n\nThis property is not in any particular unit but in a specified range of relative speeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1172,
    "javaLine": 1830,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_FAN_DIRECTION",
    "id": 356517121,
    "hex": "0x15400501",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 1281,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "VehicleHvacFanDirection",
    "version": 2,
    "deprecated": false,
    "description": "Fan direction setting\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.\n\nThe supported hvac fan direction is exposed through {@code HVAC_FAN_DIRECTION_AVAILABLE}\nproperty. Caller should not call {@code getSupportedValuesList}, or use\n{@code VehicleAreaConfig#supportedEnumValues}.",
    "aidlLine": 1193,
    "javaLine": 1850,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_TEMPERATURE_CURRENT",
    "id": 358614274,
    "hex": "0x15600502",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "FLOAT",
    "ordinal": 1282,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "CELSIUS",
    "version": 2,
    "deprecated": false,
    "description": "HVAC current temperature.",
    "aidlLine": 1211,
    "javaLine": 1877,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_TEMPERATURE_SET",
    "id": 358614275,
    "hex": "0x15600503",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "FLOAT",
    "ordinal": 1283,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "unit": "CELSIUS",
    "version": 2,
    "deprecated": false,
    "description": "HVAC target temperature set in Celsius.\n\nThe minFloatValue and maxFloatValue in VehicleAreaConfig must be defined.\n\nThe minFloatValue indicates the minimum temperature setting in Celsius.\nThe maxFloatValue indicates the maximum temperature setting in Celsius.\n\nIf all the values between minFloatValue and maxFloatValue are not supported, the configArray\ncan be used to list the valid temperature values that can be set. It also describes a lookup\ntable to convert the temperature from Celsius to Fahrenheit and vice versa for this vehicle.\nThe configArray must be defined if standard unit conversion is not supported on this vehicle.\n\nThe configArray is set as follows:\n     configArray[0] = [the lower bound of the supported temperature in Celsius] * 10.\n     configArray[1] = [the upper bound of the supported temperature in Celsius] * 10.\n     configArray[2] = [the increment in Celsius] * 10.\n     configArray[3] = [the lower bound of the supported temperature in Fahrenheit] * 10.\n     configArray[4] = [the upper bound of the supported temperature in Fahrenheit] * 10.\n     configArray[5] = [the increment in Fahrenheit] * 10.\n\nThe minFloatValue and maxFloatValue in VehicleAreaConfig must be equal to configArray[0] and\nconfigArray[1] respectively.\n\nFor example, if the vehicle supports temperature values as:\n     [16.0, 16.5, 17.0 ,..., 28.0] in Celsius\n     [60.5, 61.5, 62.5 ,..., 84.5] in Fahrenheit\nThe configArray should be configArray = {160, 280, 5, 605, 845, 10}.\n\nIdeally, the ratio of the Celsius increment to the Fahrenheit increment should be as close to\nthe actual ratio of 1 degree Celsius to 1.8 degrees Fahrenheit.\n\nThere must be a one to one mapping of all Celsius values to Fahrenheit values defined by the\nconfigArray. The configArray will be used by clients to convert this property's temperature\nfrom Celsius to Fahrenheit. Also, it will let clients know what Celsius value to set the\nproperty to achieve their desired Fahreneheit value for the system. If the ECU does not have\na one to one mapping of all Celsius values to Fahrenheit values, then the config array should\nonly define the list of Celsius and Fahrenheit values that do have a one to one mapping.\n\nFor example, if the ECU supports Celsius values from 16 to 28 and Fahrenheit values from 60\nto 85 both with an increment of 1, then one possible configArray would be {160, 280, 10, 600,\n840, 20}. In this case, 85 would not be a supported temperature.\n\nAny value set in between a valid value should be rounded to the closest valid value.\n\nIt is highly recommended that the OEM also implement the HVAC_TEMPERATURE_VALUE_SUGGESTION\nvehicle property because it provides applications a simple method for determining temperature\nvalues that can be set for this vehicle and for converting values between Celsius and\nFahrenheit.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1221,
    "javaLine": 1897,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_DEFROSTER",
    "id": 320865540,
    "hex": "0x13200504",
    "group": "SYSTEM",
    "area": "WINDOW",
    "type": "BOOLEAN",
    "ordinal": 1284,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Fan-based defrost for designated window.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1282,
    "javaLine": 2044,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_AC_ON",
    "id": 354419973,
    "hex": "0x15200505",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "BOOLEAN",
    "ordinal": 1285,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "On/off AC for designated areaId\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1295,
    "javaLine": 2064,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_MAX_AC_ON",
    "id": 354419974,
    "hex": "0x15200506",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "BOOLEAN",
    "ordinal": 1286,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "On/off max AC\n\nWhen MAX AC is on, the ECU may adjust the vent position, fan speed,\ntemperature, etc as necessary to cool the vehicle as quickly as possible.\nAny parameters modified as a side effect of turning on/off the MAX AC\nparameter shall generate onPropertyEvent() callbacks to the VHAL.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1309,
    "javaLine": 2084,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_MAX_DEFROST_ON",
    "id": 354419975,
    "hex": "0x15200507",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "BOOLEAN",
    "ordinal": 1287,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "On/off max defrost\n\nWhen MAX DEFROST is on, the ECU may adjust the vent position, fan speed,\ntemperature, etc as necessary to defrost the windows as quickly as\npossible.  Any parameters modified as a side effect of turning on/off\nthe MAX DEFROST parameter shall generate onPropertyEvent() callbacks to\nthe VHAL.\nThe AreaIDs for HVAC_MAX_DEFROST_ON indicate MAX DEFROST can be controlled\nin the area.\nFor example:\nareaConfig.areaId = {ROW_1_LEFT | ROW_1_RIGHT} indicates HVAC_MAX_DEFROST_ON\nonly can be controlled for the front rows.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1327,
    "javaLine": 2104,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_RECIRC_ON",
    "id": 354419976,
    "hex": "0x15200508",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "BOOLEAN",
    "ordinal": 1288,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Recirculation on/off\n\nControls the supply of exterior air to the cabin.  Recirc “on” means the\nmajority of the airflow into the cabin is originating in the cabin.\nRecirc “off” means the majority of the airflow into the cabin is coming\nfrom outside the car.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1351,
    "javaLine": 2124,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_DUAL_ON",
    "id": 354419977,
    "hex": "0x15200509",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "BOOLEAN",
    "ordinal": 1289,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Enable temperature coupling between areas.\n\nThe AreaIDs for HVAC_DUAL_ON property shall contain a combination of\nHVAC_TEMPERATURE_SET AreaIDs that can be coupled together. If\nHVAC_TEMPERATURE_SET is mapped to AreaIDs [a_1, a_2, ..., a_n], and if\nHVAC_DUAL_ON can be enabled to couple a_i and a_j, then HVAC_DUAL_ON\nproperty must be mapped to [a_i | a_j]. Further, if a_k and a_l can also\nbe coupled together separately then HVAC_DUAL_ON must be mapped to\n[a_i | a_j, a_k | a_l].\n\nExample: A car has two front seats (ROW_1_LEFT, ROW_1_RIGHT) and three\n back seats (ROW_2_LEFT, ROW_2_CENTER, ROW_2_RIGHT). There are two\n temperature control units -- driver side and passenger side -- which can\n be optionally synchronized. This may be expressed in the AreaIDs this way:\n - HVAC_TEMPERATURE_SET->[ROW_1_LEFT | ROW_2_LEFT, ROW_1_RIGHT | ROW_2_CENTER | ROW_2_RIGHT]\n - HVAC_DUAL_ON->[ROW_1_LEFT | ROW_2_LEFT | ROW_1_RIGHT | ROW_2_CENTER | ROW_2_RIGHT]\n\nWhen the property is enabled, the ECU must synchronize the temperature\nfor the affected areas. Any parameters modified as a side effect\nof turning on/off the DUAL_ON parameter shall generate\nonPropertyEvent() callbacks to the VHAL. In addition, if setting\na temperature (i.e. driver's temperature) changes another temperature\n(i.e. front passenger's temperature), then the appropriate\nonPropertyEvent() callbacks must be generated.  If a user changes a\ntemperature that breaks the coupling (e.g. setting the passenger\ntemperature independently) then the VHAL must send the appropriate\nonPropertyEvent() callbacks (i.e. HVAC_DUAL_ON = false,\nHVAC_TEMPERATURE_SET[AreaID] = xxx, etc).\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1369,
    "javaLine": 2144,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_AUTO_ON",
    "id": 354419978,
    "hex": "0x1520050a",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "BOOLEAN",
    "ordinal": 1290,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "On/off automatic climate control.\n\nIf true, automatic climate control is on. If false, automatic climate control is off.\n\nIf the vehicle does not support directly turning off automatic climate control, then OEMs\nshould add logic in their VHAL implementation so that setting HVAC_AUTO_ON to false would\nchange the necessary HVAC settings to indirectly turn off HVAC_AUTO_ON. Ideally, this should\nnot be disruptive to the user, so OEMs should change back to the previous state any settings\nthat were modified once automatic climate control is off. That way the only outcome should be\nthat HVAC_AUTO_ON is off. If restoring the HVAC settings to its previous settings is not\npossible, then the OEM should choose the least disruptive change and implement that.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1409,
    "javaLine": 2164,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_SEAT_TEMPERATURE",
    "id": 356517131,
    "hex": "0x1540050b",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 1291,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seat heating/cooling\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value indicates the maximum seat temperature heating setting.\nThe minInt32Value must be 0, unless the vehicle supports seat cooling as well. In this case,\nminInt32Value indicates the maximum seat temperature cooling setting.\n\nThis property is not in any particular unit, but in a specified range of relative temperature\nsettings.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1432,
    "javaLine": 2184,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_SIDE_MIRROR_HEAT",
    "id": 339739916,
    "hex": "0x1440050c",
    "group": "SYSTEM",
    "area": "MIRROR",
    "type": "INT32",
    "ordinal": 1292,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Side Mirror Heat\n\nIncreasing values denote higher heating levels for side mirrors.\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value in the config data represents the maximum heating level.\nThe minInt32Value in the config data MUST be zero and indicates no heating.\n\nThis property is not in any particular unit but in a specified range of relative heating\nsettings.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1455,
    "javaLine": 2204,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_STEERING_WHEEL_HEAT",
    "id": 289408269,
    "hex": "0x1140050d",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 1293,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Steering Wheel Heating/Cooling\n\nSets the amount of heating/cooling for the steering wheel.\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value indicates the maximum steering wheel heating setting.\nThe minInt32Value should be 0, unless the vehicle supports steering wheel cooling as well. In\nsuch a case, the minInt32Value indicates the maximum steering wheel cooling setting.\n\nThis property is not in any particular unit but in a specified range of heating settings.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1479,
    "javaLine": 2224,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_TEMPERATURE_DISPLAY_UNITS",
    "id": 289408270,
    "hex": "0x1140050e",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 1294,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "VehicleUnit",
    "version": 2,
    "deprecated": false,
    "description": "Temperature units for display\n\nIndicates whether the vehicle is displaying temperature to the user as\nCelsius or Fahrenheit.\nVehiclePropConfig.configArray is used to indicate the supported temperature display units.\nFor example: configArray[0] = CELSIUS\n             configArray[1] = FAHRENHEIT\n\nThis parameter MAY be used for displaying any HVAC temperature in the system.\nValues must be one of VehicleUnit.CELSIUS or VehicleUnit.FAHRENHEIT\nNote that internally, all temperatures are represented in floating point Celsius.\n\nIf updating HVAC_TEMPERATURE_DISPLAY_UNITS affects the values of other *_DISPLAY_UNITS\nproperties, then their values must be updated and communicated to the AAOS framework as well.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1503,
    "javaLine": 2244,
    "readPermissions": [
      "PERMISSION_READ_DISPLAY_UNITS",
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_ACTUAL_FAN_SPEED_RPM",
    "id": 356517135,
    "hex": "0x1540050f",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 1295,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Actual fan speed",
    "aidlLine": 1530,
    "javaLine": 2270,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_POWER_ON",
    "id": 354419984,
    "hex": "0x15200510",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "BOOLEAN",
    "ordinal": 1296,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Represents global power state for HVAC. Setting this property to false\nMAY mark some properties that control individual HVAC features/subsystems\nto UNAVAILABLE state. Setting this property to true MAY mark some\nproperties that control individual HVAC features/subsystems to AVAILABLE\nstate (unless any/all of them are UNAVAILABLE on their own individual\nmerits).\n\n[Definition] HvacPower_DependentProperties: Properties that need HVAC to be\n  powered on in order to enable their functionality. For example, in some cars,\n  in order to turn on the AC, HVAC must be powered on first.\n\nHvacPower_DependentProperties list must be set in the\nVehiclePropConfig.configArray. HvacPower_DependentProperties must only contain\nproperties that are associated with VehicleArea:SEAT. Properties that are not\nassociated with VehicleArea:SEAT, for example, HVAC_DEFROSTER, must never\ndepend on HVAC_POWER_ON property and must never be part of\nHvacPower_DependentProperties list.\n\nAreaID mapping for HVAC_POWER_ON property must contain all AreaIDs that\nHvacPower_DependentProperties are mapped to.\n\nExample 1: A car has two front seats (ROW_1_LEFT, ROW_1_RIGHT) and three back\n seats (ROW_2_LEFT, ROW_2_CENTER, ROW_2_RIGHT). If the HVAC features (AC,\n Temperature etc.) throughout the car are dependent on a single HVAC power\n controller then HVAC_POWER_ON must be mapped to\n [ROW_1_LEFT | ROW_1_RIGHT | ROW_2_LEFT | ROW_2_CENTER | ROW_2_RIGHT].\n\nExample 2: A car has two seats in the front row (ROW_1_LEFT, ROW_1_RIGHT) and\n  three seats in the second (ROW_2_LEFT, ROW_2_CENTER, ROW_2_RIGHT) and third\n  rows (ROW_3_LEFT, ROW_3_CENTER, ROW_3_RIGHT). If the car has temperature\n  controllers in the front row which can operate entirely independently of\n  temperature controllers in the back of the vehicle, then HVAC_POWER_ON\n  must be mapped to a two element array:\n  - ROW_1_LEFT | ROW_1_RIGHT\n  - ROW_2_LEFT | ROW_2_CENTER | ROW_2_RIGHT | ROW_3_LEFT | ROW_3_CENTER | ROW_3_RIGHT\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1539,
    "javaLine": 2290,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_FAN_DIRECTION_AVAILABLE",
    "id": 356582673,
    "hex": "0x15410511",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32_VEC",
    "ordinal": 1297,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleHvacFanDirection",
    "version": 2,
    "deprecated": false,
    "description": "Fan Positions Available\n\nThis is a bit mask of fan positions available for the zone.  Each\navailable fan direction is denoted by a separate entry in the vector.  A\nfan direction may have multiple bits from vehicle_hvac_fan_direction set.\nFor instance, a typical car may have the following fan positions:\n  - FAN_DIRECTION_FACE (0x1)\n  - FAN_DIRECTION_FLOOR (0x2)\n  - FAN_DIRECTION_FACE | FAN_DIRECTION_FLOOR (0x3)\n  - FAN_DIRECTION_DEFROST (0x4)\n  - FAN_DIRECTION_FLOOR | FAN_DIRECTION_DEFROST (0x6)",
    "aidlLine": 1586,
    "javaLine": 2315,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_AUTO_RECIRC_ON",
    "id": 354419986,
    "hex": "0x15200512",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "BOOLEAN",
    "ordinal": 1298,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Automatic recirculation on/off\n\nWhen automatic recirculation is ON, the HVAC system may automatically\nswitch to recirculation mode if the vehicle detects poor incoming air\nquality.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1606,
    "javaLine": 2337,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_SEAT_VENTILATION",
    "id": 356517139,
    "hex": "0x15400513",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 1299,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seat ventilation\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value must be 0.\nThe maxInt32Value indicates the maximum ventilation setting available for the seat.\n\nThis property is not in any particular unit but in the specified range of ventilation\nsettings.\n\nUsed by HVAC apps and Assistant to enable, change, or read state of seat\nventilation.  This is different than seating cooling. It can be on at the\nsame time as cooling, or not.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1623,
    "javaLine": 2357,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_ELECTRIC_DEFROSTER_ON",
    "id": 320865556,
    "hex": "0x13200514",
    "group": "SYSTEM",
    "area": "WINDOW",
    "type": "BOOLEAN",
    "ordinal": 1300,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Electric defrosters' status\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1649,
    "javaLine": 2377,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "HVAC_TEMPERATURE_VALUE_SUGGESTION",
    "id": 291570965,
    "hex": "0x11610515",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT_VEC",
    "ordinal": 1301,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Suggested values for setting HVAC temperature.\n\nImplement the property to help applications understand the closest supported temperature\nvalue in Celsius or Fahrenheit.\n\n     floatValues[0] = the requested value that an application wants to set a temperature to.\n     floatValues[1] = the unit for floatValues[0]. It should be one of\n                      {VehicleUnit.CELSIUS, VehicleUnit.FAHRENHEIT}.\n     floatValues[2] = the value OEMs suggested in CELSIUS. This value is not included\n                      in the request.\n     floatValues[3] = the value OEMs suggested in FAHRENHEIT. This value is not included\n                      in the request.\n\nAn application calls set(VehiclePropValue propValue) with the requested value and unit for\nthe value. OEMs need to return the suggested values in floatValues[2] and floatValues[3] by\nonPropertyEvent() callbacks. The suggested values must conform to the values that can be\nderived from the HVAC_TEMPERATURE_SET configArray. In other words, the suggested values and\nthe table of values from the configArray should be the same. It is recommended for the OEM to\nadd custom logic in their VHAL implementation in order to avoid making requests to the HVAC\nECU.\n\nThe logic can be as follows:\nFor converting the temperature from celsius to fahrenheit use the following:\n// Given tempC and the configArray\nfloat minTempC = configArray[0] / 10.0;\nfloat temperatureIncrementCelsius = configArray[2] / 10.0;\nfloat minTempF = configArray[3] / 10.0;\nfloat temperatureIncrementFahrenheit = configArray[5] / 10.0;\n// Round to the closest increment\nint numIncrements = round((tempC - minTempC) / temperatureIncrementCelsius);\ntempF = temperatureIncrementFahrenheit * numIncrements + minTempF;\n\nFor example, when a user uses the voice assistant to set HVAC temperature to 66.2 in\nFahrenheit.\nFirst, an application will set this property with the value\n[66.2, (float)VehicleUnit.FAHRENHEIT,0,0].\nIf OEMs suggest to set 19.0 in Celsius or 66.5 in Fahrenheit for user's request, then VHAL\nmust generate a callback with property value\n[66.2, (float)VehicleUnit.FAHRENHEIT, 19.0, 66.5]. After the voice assistant gets the\ncallback, it will inform the user and set HVAC temperature to the suggested value.\n\nAnother example, an application receives 21 Celsius as the current temperature value by\nquerying HVC_TEMPERATURE_SET. But the application wants to know what value is displayed on\nthe car's UI in Fahrenheit.\nFor this, the application sets the property to [21, (float)VehicleUnit.CELSIUS, 0, 0]. If\nthe suggested value by the OEM for 21 Celsius is 70 Fahrenheit, then VHAL must generate a\ncallback with property value [21, (float)VehicleUnit.CELSIUS, 21.0, 70.0].\nIn this case, the application can know that the value is 70.0 Fahrenheit in the car’s UI.",
    "aidlLine": 1662,
    "javaLine": 1987,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_CLIMATE"
    ]
  },
  {
    "name": "DISTANCE_DISPLAY_UNITS",
    "id": 289408512,
    "hex": "0x11400600",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 1536,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "VehicleUnit",
    "version": 2,
    "deprecated": false,
    "description": "Distance units for display\n\nIndicates which units the car is using to display distances to the user. Eg. Mile, Meter\nKilometer.\n\nDistance units are defined in VehicleUnit.\nVehiclePropConfig.configArray is used to indicate the supported distance display units.\nFor example: configArray[0] = METER\n             configArray[1] = KILOMETER\n             configArray[2] = MILE\n\nIf updating DISTANCE_DISPLAY_UNITS affects the values of other *_DISPLAY_UNITS properties,\nthen their values must be updated and communicated to the AAOS framework as well.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1718,
    "javaLine": 2398,
    "readPermissions": [
      "PERMISSION_READ_DISPLAY_UNITS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_DISPLAY_UNITS",
      "PERMISSION_VENDOR_EXTENSION"
    ]
  },
  {
    "name": "FUEL_VOLUME_DISPLAY_UNITS",
    "id": 289408513,
    "hex": "0x11400601",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 1537,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "VehicleUnit",
    "version": 2,
    "deprecated": false,
    "description": "Fuel volume units for display\n\nIndicates which units the car is using to display fuel volume to the user. Eg. Liter or\nGallon.\n\nVehiclePropConfig.configArray is used to indicate the supported fuel volume display units.\nVolume units are defined in VehicleUnit.\nFor example: configArray[0] = LITER\n             configArray[1] = GALLON\n\nIf updating FUEL_VOLUME_DISPLAY_UNITS affects the values of other *_DISPLAY_UNITS properties,\nthen their values must be updated and communicated to the AAOS framework as well.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1744,
    "javaLine": 2433,
    "readPermissions": [
      "PERMISSION_READ_DISPLAY_UNITS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_DISPLAY_UNITS",
      "PERMISSION_VENDOR_EXTENSION"
    ]
  },
  {
    "name": "TIRE_PRESSURE_DISPLAY_UNITS",
    "id": 289408514,
    "hex": "0x11400602",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 1538,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "VehicleUnit",
    "version": 2,
    "deprecated": false,
    "description": "Tire pressure units for display\n\nIndicates which units the car is using to display tire pressure to the user. Eg. PSI, Bar or\nKilopascal.\n\nVehiclePropConfig.configArray is used to indicate the supported pressure display units.\nPressure units are defined in VehicleUnit.\nFor example: configArray[0] = KILOPASCAL\n             configArray[1] = PSI\n             configArray[2] = BAR\n\nIf updating TIRE_PRESSURE_DISPLAY_UNITS affects the values of other *_DISPLAY_UNITS\nproperties, then their values must be updated and communicated to the AAOS framework as well.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1769,
    "javaLine": 2467,
    "readPermissions": [
      "PERMISSION_READ_DISPLAY_UNITS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_DISPLAY_UNITS",
      "PERMISSION_VENDOR_EXTENSION"
    ]
  },
  {
    "name": "EV_BATTERY_DISPLAY_UNITS",
    "id": 289408515,
    "hex": "0x11400603",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 1539,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "VehicleUnit",
    "version": 2,
    "deprecated": false,
    "description": "EV battery units for display\n\nIndicates which units the car is using to display EV battery information to the user. Eg.\nwatt-hours(Wh), kilowatt-hours(kWh) or ampere-hours(Ah).\n\nVehiclePropConfig.configArray is used to indicate the supported electrical energy units.\nElectrical energy units are defined in VehicleUnit.\nFor example: configArray[0] = WATT_HOUR\n             configArray[1] = AMPERE_HOURS\n             configArray[2] = KILOWATT_HOUR\n\nIf updating EV_BATTERY_DISPLAY_UNITS affects the values of other *_DISPLAY_UNITS properties,\nthen their values must be updated and communicated to the AAOS framework as well.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1795,
    "javaLine": 2502,
    "readPermissions": [
      "PERMISSION_READ_DISPLAY_UNITS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_DISPLAY_UNITS",
      "PERMISSION_VENDOR_EXTENSION"
    ]
  },
  {
    "name": "FUEL_CONSUMPTION_UNITS_DISTANCE_OVER_VOLUME",
    "id": 287311364,
    "hex": "0x11200604",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 1540,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Fuel consumption units for display\n\nIndicates type of units the car is using to display fuel consumption information to user\nTrue indicates units are distance over volume such as MPG.\nFalse indicates units are volume over distance such as L/100KM.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1821,
    "javaLine": 2572,
    "readPermissions": [
      "PERMISSION_READ_DISPLAY_UNITS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_DISPLAY_UNITS",
      "PERMISSION_VENDOR_EXTENSION"
    ]
  },
  {
    "name": "VEHICLE_SPEED_DISPLAY_UNITS",
    "id": 289408517,
    "hex": "0x11400605",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 1541,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "VehicleUnit",
    "version": 2,
    "deprecated": false,
    "description": "Speed units for display\n\nIndicates type of units the car is using to display speed to user. Eg. m/s, km/h, or mph.\n\n{@code VehicleAreaConfig.HasSupportedValueInfo.hasSupportedValuesList} for the global area ID\n(0) must be {@code true}.\n\n{@code getSupportedValuesLists} for [VEHICLE_SPEED_DISPLAY_UNITS, areaId=0] must return a\n{@code SupportedValuesListResult} that contains non-null {@code supportedValuesList},\ne.g. [METER_PER_SEC, MILES_PER_HOUR, KILOMETERS_PER_HOUR].\n\nFor backward compatibility, config array for this property must contain the same values as\nsupported values at boot time.\nFor example: configArray[0] = METER_PER_SEC\n             configArray[1] = MILES_PER_HOUR\n             configArray[2] = KILOMETERS_PER_HOUR\n\nIf updating VEHICLE_SPEED_DISPLAY_UNITS affects the values of other *_DISPLAY_UNITS\nproperties, then their values must be updated and communicated to the AAOS framework as well.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 1838,
    "javaLine": 2537,
    "readPermissions": [
      "PERMISSION_READ_DISPLAY_UNITS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_DISPLAY_UNITS",
      "PERMISSION_VENDOR_EXTENSION"
    ],
    "javaId": 289408516
  },
  {
    "name": "EXTERNAL_CAR_TIME",
    "id": 290457096,
    "hex": "0x11500608",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT64",
    "ordinal": 1544,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "MILLI_SECS",
    "version": 2,
    "deprecated": false,
    "description": "Current date and time suggestion for the Car, encoded as Epoch time\n(in milliseconds). This value denotes the number of milliseconds seconds\nthat have elapsed since 1/1/1970 UTC.\n\nThis property signals a change in CarTime to Android. If the property is supported, VHAL\nmust report the most accurate current CarTime when this property is read, and publish a\nchange to this property when the CarTime value has changed. An on-change event for this\nproperty must be published when CarTime changes for any reason other than the natural elapse\nof time (time delta smaller than 500ms should not trigger an on change event). Android will\nread and subscribe to this property to fetch time from VHAL. This can be useful to\nsynchronize Android's time with other vehicle systems (dash clock etc).\n    int64Values[0] = provided Epoch time (in milliseconds)\n\nWhenever a new Value for the property is received, AAOS will create\nand send an \"ExternalTimeSuggestion\" to the \"TimeDetectorService\".\nIf other sources do not have a higher priority, Android will use this\nto set the system time. For information on how to adjust time source\npriorities and how time suggestions are handled (including how Android\nhandles gitter, drift, and minimum resolution) see Time Detector Service\ndocumentation.\n\nNote that the property may take >0 ms to get propagated through the stack\nand, having a timestamped property helps reduce any time drift. So,\nfor all reads to the property, the timestamp can be used to negate this\ndrift:\n    drift = elapsedTime - PropValue.timestamp\n    effectiveTime = PropValue.value.int64Values[0] + drift\n\nIt is strongly recommended that this property must not be used to retrieve\ntime from ECUs using protocols (GNSS, NTP, Telephony etc). Since these\nprotocols are already supported by Android, it is recommended to use\nAndroid’s own systems for them instead of wiring those through the VHAL\nusing this property.\n\nWARNING: The value available through this property should not be dependent\non value written by Android to ANDROID_EPOCH_TIME property in any way.",
    "aidlLine": 1872
  },
  {
    "name": "ANDROID_EPOCH_TIME",
    "id": 290457094,
    "hex": "0x11500606",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT64",
    "ordinal": 1542,
    "changeMode": "ON_CHANGE",
    "access": "WRITE",
    "accessModes": [
      "WRITE"
    ],
    "unit": "MILLI_SECS",
    "version": 2,
    "deprecated": false,
    "description": "Current date and time, encoded as Epoch time (in milliseconds).\nThis value denotes the number of milliseconds seconds that have\nelapsed since 1/1/1970 UTC.\n\nCarServices will write to this value to give VHAL the Android system's\ntime, if the VHAL supports this property. This can be useful to\nsynchronize other vehicle systems (dash clock etc) with Android's time.\n\nAAOS writes to this property once during boot, and\nwill thereafter write only when some time-source changes are propagated.\nAAOS will fill in VehiclePropValue.timestamp correctly.\nNote that AAOS will not send updates for natural elapse of time.\n    int64Values[0] = provided Unix time (in milliseconds)\n\nNote that the property may take >0 ms to get propagated through the stack\nand, having a timestamped property helps reduce any time drift. So,\nfor all writes to the property, the timestamp can be used to negate this\ndrift:\n    drift = elapsedTime - PropValue.timestamp\n    effectiveTime = PropValue.value.int64Values[0] + drift",
    "aidlLine": 1918
  },
  {
    "name": "STORAGE_ENCRYPTION_BINDING_SEED",
    "id": 292554247,
    "hex": "0x11700607",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BYTES",
    "ordinal": 1543,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "External encryption binding seed.\n\nThis value is mixed with the local key storage encryption key.\nThis property holds 16 bytes, and is expected to be persisted on an ECU separate from\nthe IVI. The property is initially set by AAOS, who generates it using a CSRNG.\nAAOS will then read the property on subsequent boots. The binding seed is expected to be\nreliably persisted. Any loss of the seed results in a factory reset of the IVI.",
    "aidlLine": 1947
  },
  {
    "name": "ENV_OUTSIDE_TEMPERATURE",
    "id": 291505923,
    "hex": "0x11600703",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 1795,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "CELSIUS",
    "version": 2,
    "deprecated": false,
    "description": "Outside temperature\n\nThis property must communicate the temperature reading of the environment outside the\nvehicle. If there are multiple sensors for measuring the outside temperature, this property\nshould be populated with the mean or a meaningful weighted average of the readings that will\nbest represent the temperature of the outside environment.",
    "aidlLine": 1962,
    "javaLine": 2601,
    "readPermissions": [
      "PERMISSION_EXTERIOR_ENVIRONMENT"
    ],
    "writePermissions": [
      "PERMISSION_EXTERIOR_ENVIRONMENT"
    ]
  },
  {
    "name": "AP_POWER_STATE_REQ",
    "id": 289475072,
    "hex": "0x11410a00",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32_VEC",
    "ordinal": 2560,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Property to control power state of application processor\n\nIt is assumed that AP's power state is controlled by a separate power\ncontroller.\n\nFor configuration information, VehiclePropConfig.configArray must have bit flag combining\nvalues in VehicleApPowerStateConfigFlag.\n\n  configArray[0] : Bit flag combining values in VehicleApPowerStateConfigFlag,\n                   0x0 if not used,\n                   0x1 for enabling suspend to ram,\n                   0x2 for supporting powering on AP from off state after timeout.\n                   0x4 for enabling suspend to disk,\n\n  int32Values[0] : VehicleApPowerStateReq enum value\n  int32Values[1] : additional parameter relevant for each state,\n                   0 if not used.",
    "aidlLine": 1977,
    "javaLine": 2620,
    "readPermissions": [
      "PERMISSION_CAR_POWER"
    ],
    "writePermissions": [
      "PERMISSION_CAR_POWER"
    ]
  },
  {
    "name": "AP_POWER_STATE_REPORT",
    "id": 289475073,
    "hex": "0x11410a01",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32_VEC",
    "ordinal": 2561,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Property to report power state of application processor\n\nIt is assumed that AP's power state is controller by separate power\ncontroller.\n\n  int32Values[0] : VehicleApPowerStateReport enum value\n  int32Values[1] : Time in ms to wake up, if necessary.  Otherwise 0.",
    "aidlLine": 2002,
    "javaLine": 2632,
    "readPermissions": [
      "PERMISSION_CAR_POWER"
    ],
    "writePermissions": [
      "PERMISSION_CAR_POWER"
    ]
  },
  {
    "name": "AP_POWER_BOOTUP_REASON",
    "id": 289409538,
    "hex": "0x11400a02",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 2562,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Property to report bootup reason for the current power on. This is a\nstatic property that will not change for the whole duration until power\noff. For example, even if user presses power on button after automatic\npower on with door unlock, bootup reason must stay with\nVehicleApPowerBootupReason#USER_UNLOCK.\n\nint32Values[0] must be VehicleApPowerBootupReason.",
    "aidlLine": 2017,
    "javaLine": 2644,
    "readPermissions": [
      "PERMISSION_CAR_POWER"
    ],
    "writePermissions": [
      "PERMISSION_CAR_POWER"
    ]
  },
  {
    "name": "DISPLAY_BRIGHTNESS",
    "id": 289409539,
    "hex": "0x11400a03",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 2563,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Property to represent brightness of the display.\n\nSome cars have single control for the brightness of all displays and this\nproperty is to share change in that control. In cars which have displays\nwhose brightness is controlled separately, they must use\nPER_DISPLAY_BRIGHTNESS.\n\nOnly one of DISPLAY_BRIGHTNESS and PER_DISPLAY_BRIGHTNESS should be\nimplemented. If both are available, PER_DISPLAY_BRIGHTNESS is used by\nAAOS.\n\nIf this is writable, android side can set this value when user changes\ndisplay brightness from Settings. If this is read only, user may still\nchange display brightness from Settings, but that must not be reflected\nto other displays.\n\nIf this is writable, writing this property must cause an on property\nchange event even if the new display brightness is the same as the\ncurrent value.",
    "aidlLine": 2032,
    "javaLine": 2656,
    "readPermissions": [
      "PERMISSION_CAR_POWER"
    ],
    "writePermissions": [
      "PERMISSION_CAR_POWER"
    ]
  },
  {
    "name": "PER_DISPLAY_BRIGHTNESS",
    "id": 289475076,
    "hex": "0x11410a04",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32_VEC",
    "ordinal": 2564,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Property to represent brightness of the displays which are controlled separately.\n\nSome cars have one or more displays whose brightness is controlled\nseparately and this property is to inform the brightness of each\npassenger display. In cars where all displays' brightness is controlled\ntogether, they must use DISPLAY_BRIGHTNESS.\n\nOnly one of DISPLAY_BRIGHTNESS and PER_DISPLAY_BRIGHTNESS should be\nimplemented. If both are available, PER_DISPLAY_BRIGHTNESS is used by\nAAOS.\n\nIf this is supported, PER_DISPLAY_MAX_BRIGHTNESS must be supported to represent the max\ndisplay brightness for each display. Otherwise, the max display brightness is by default 1.\nThe VehicleAreaConfig.maxInt32Value must not be used to represent max display brightness,\nbecause maxInt32Value is defined to be the max value for all the elements inside the integer\nvalue, which includes display port and brightness. So it is not meaningful.\n\nThe display port uniquely identifies a physical connector on the device\nfor display output, ranging from 0 to 255.\n\nWriting this property must cause an on property change event that\ncontains the same [display port, brightness] tuple even if the new\ndisplay brightness is the same as the current value.\n\nTo get the display brightness for a specific display port, the\nGetValueRequest must contain a VehiclePropValue, which contains one\nint32Value: displayPort. Getting this property without specifying the\nthe display port is undefined behavior.\n\nint32Values[0] : display port\nint32Values[1] : brightness",
    "aidlLine": 2060,
    "javaLine": 2668,
    "readPermissions": [
      "PERMISSION_CAR_POWER"
    ],
    "writePermissions": [
      "PERMISSION_CAR_POWER"
    ]
  },
  {
    "name": "VALET_MODE_ENABLED",
    "id": 287312389,
    "hex": "0x11200a05",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 2565,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 3,
    "deprecated": false,
    "description": "Valet mode enabled\n\nThis property allows the user to enable/disable valet mode in their vehicle. Valet mode is\na privacy and security setting that prevents an untrusted driver to access more private areas\nin the vehicle, such as the glove box or the trunk(s).\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2099,
    "javaLine": 2680,
    "readPermissions": [
      "PERMISSION_READ_VALET_MODE",
      "PERMISSION_CONTROL_VALET_MODE"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_VALET_MODE"
    ]
  },
  {
    "name": "HEAD_UP_DISPLAY_ENABLED",
    "id": 354421254,
    "hex": "0x15200a06",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "BOOLEAN",
    "ordinal": 2566,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 3,
    "deprecated": false,
    "description": "Head up display (HUD) enabled\n\nThis property allows the user to turn on/off the HUD for their seat.\n\nEach HUD in the vehicle should be assigned to the seat that is intended to use it. For\nexample, if there is a single HUD in the vehicle that is used by the driver so that they no\nlonger need to continuously look at the instrument cluster, then this property should be\ndefined with a single area ID equal to the driver's seat area value.",
    "aidlLine": 2116,
    "javaLine": 2712,
    "readPermissions": [
      "PERMISSION_READ_HEAD_UP_DISPLAY_STATUS",
      "PERMISSION_CONTROL_HEAD_UP_DISPLAY"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_HEAD_UP_DISPLAY"
    ]
  },
  {
    "name": "HW_KEY_INPUT",
    "id": 289475088,
    "hex": "0x11410a10",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32_VEC",
    "ordinal": 2576,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Property to feed H/W input events to android\n\nint32Values[0] : action defined by VehicleHwKeyInputAction\nint32Values[1] : key code, must use standard android key code\nint32Values[2] : target display defined in VehicleDisplay. Events not\n                 tied to specific display must be sent to\n                 VehicleDisplay#MAIN.\nint32Values[3] : [optional] Number of ticks. The value must be equal or\n                 greater than 1. When omitted, Android will default to 1.",
    "aidlLine": 2133,
    "javaLine": 2746,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "HW_KEY_INPUT_V2",
    "id": 367004177,
    "hex": "0x15e00a11",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "MIXED",
    "ordinal": 2577,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Property to feed H/W input events to android\n\nint32array[0]: target display defined by VehicleDisplay like VehicleDisplay::MAIN,\n               VehicleDisplay::INSTRUMENT_CLUSTER, VehicleDisplay::AUX\nint32array[1]: key code, must use standard android key code like KEYCODE_HOME, KEYCODE_BACK\nint32array[2]: action defined in VehicleHwKeyInputAction like\n               VehicleHwKeyInputAction::ACTION_UP, VehicleHwKeyInputAction::ACTION_UP\nint32array[3]: repeat count of the event. For key down events, this is the repeat count\n               with the first down starting at 0 and counting up from there. For key up\n               events, this is always equal to 0\n\nint64array[0]: down time, elapsed nanoseconds since boot. Denotes the time of the most\n               recent key down event. For the down event, it will be the event time of the\n               down event itself",
    "aidlLine": 2151
  },
  {
    "name": "HW_MOTION_INPUT",
    "id": 367004178,
    "hex": "0x15e00a12",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "MIXED",
    "ordinal": 2578,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Property to feed H/W input events to android\n\nint32array[0]: target display defined by VehicleDisplay like VehicleDisplay::MAIN,\n               VehicleDisplay::INSTRUMENT_CLUSTER, VehicleDisplay::AUX\nint32array[1]: input type defined in VehicleHwMotionInputSource like\n               VehicleHwMotionInputSource::SOURCE_KEYBOARD,\n               VehicleHwMotionInputSource::SOURCE_DPAD\nint32array[2]: action code defined in VehicleHwMotionInputAction like\n               VehicleHwMotionInputAction::ACTION_UP, VehicleHwMotionInputAction::ACTION_DOWN\nint32array[3]: button state flag defined in VehicleHwMotionButtonStateFlag like\n               VehicleHwMotionButtonStateFlag::BUTTON_PRIMARY,\n               VehicleHwMotionButtonStateFlag::BUTTON_SECONDARY\nint32array[4]: pointer events count, N. N must be a positive integer\nint32array[5:5+N-1]: pointer id, length N\nint32array[5+N:5+2*N-1] : tool type, length N. As defined in VehicleHwMotionToolType like\n                          VehicleHwMotionToolType::TOOL_TYPE_FINGER,\n                          VehicleHwMotionToolType::TOOL_TYPE_STYLUS\n\nfloatArray[0:N-1] : x data, length N\nfloatArray[N:2*N-1] : y data, length N\nfloatArray[2*N:3*N-1] : pressure data, length N\nfloatArray[3*N:4*N-1] : size data, length N\n\nint64array[0]: down time, elapsed nanoseconds since boot. Denotes the time when the user\n               originally pressed down to start a stream of position events. For the down\n               event, it will be the event time of the down event itself",
    "aidlLine": 2174
  },
  {
    "name": "HW_ROTARY_INPUT",
    "id": 289475104,
    "hex": "0x11410a20",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32_VEC",
    "ordinal": 2592,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "RotaryInputType",
    "version": 2,
    "deprecated": false,
    "description": "Property to feed H/W rotary events to android\n\nint32Values[0] : RotaryInputType identifying which rotary knob rotated\nint32Values[1] : number of detents (clicks), positive for clockwise,\n                 negative for counterclockwise\nint32Values[2] : target display defined in VehicleDisplay. Events not\n                 tied to specific display must be sent to\n                 VehicleDisplay#MAIN.\nint32values[3 .. 3 + abs(number of detents) - 2]:\n                 nanosecond deltas between pairs of consecutive detents,\n                 if the number of detents is > 1 or < -1\n\nVehiclePropValue.timestamp: when the rotation occurred. If the number of\n                            detents is > 1 or < -1, this is when the\n                            first detent of rotation occurred.",
    "aidlLine": 2209
  },
  {
    "name": "HW_CUSTOM_INPUT",
    "id": 289472512,
    "hex": "0x11410000",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32_VEC",
    "ordinal": 0,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "CustomInputType",
    "version": 2,
    "deprecated": false,
    "description": "Defines a custom OEM partner input event.\n\nThis input event must be used by OEM partners who wish to propagate events not supported\nby Android. It is composed by an array of int32 values only.\n\nThe Android properties are:\n\nint32Values[0] : Input code identifying the function representing this event. Valid event\n                 types are defined by CustomInputType.CUSTOM_EVENT_F1 up to\n                 CustomInputType.CUSTOM_EVENT_F10. They represent the custom event to be\n                 defined by OEM partners.\nint32Values[1] : target display type defined in VehicleDisplay. Events not tied to specific\n                 display must be sent to VehicleDisplay#MAIN.\nint32Values[2] : repeat counter, if 0 then event is not repeated. Values 1 or above means\n                 how many times this event repeated.",
    "aidlLine": 2233
  },
  {
    "name": "DOOR_POS",
    "id": 373295872,
    "hex": "0x16400b00",
    "group": "SYSTEM",
    "area": "DOOR",
    "type": "INT32",
    "ordinal": 2816,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Door position\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates the door is closed. The minInt32Value must be 0.\nThe maxInt32Value indicates the door is fully open.\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nclosed and fully open positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nSome vehicles (minivans) can open the door electronically. Hence, the\nability to write this property.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2275,
    "javaLine": 2757,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_DOORS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_DOORS"
    ]
  },
  {
    "name": "DOOR_MOVE",
    "id": 373295873,
    "hex": "0x16400b01",
    "group": "SYSTEM",
    "area": "DOOR",
    "type": "INT32",
    "ordinal": 2817,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Door move\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value represents the maximum movement speed of the door while opening.\nThe minInt32Value represents the maximum movement speed of the door while closing.\n\nLarger absolute values, either positive or negative, indicate a faster movement speed. Once\nthe door reaches the positional limit, the value must reset to 0. If DOOR_MOVE's value is\ncurrently 0, then that means there is no movement currently occurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2302,
    "javaLine": 2788,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_DOORS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_DOORS"
    ]
  },
  {
    "name": "DOOR_LOCK",
    "id": 371198722,
    "hex": "0x16200b02",
    "group": "SYSTEM",
    "area": "DOOR",
    "type": "BOOLEAN",
    "ordinal": 2818,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Door lock\n\n'true' indicates door is locked\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2328,
    "javaLine": 2820,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_DOORS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_DOORS"
    ]
  },
  {
    "name": "DOOR_CHILD_LOCK_ENABLED",
    "id": 371198723,
    "hex": "0x16200b03",
    "group": "SYSTEM",
    "area": "DOOR",
    "type": "BOOLEAN",
    "ordinal": 2819,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Door child lock feature enabled\n\nReturns true if the door child lock feature is enabled and false if it is disabled.\n\nIf enabled, the door is unable to be opened from the inside.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2343,
    "javaLine": 2842,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_DOORS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_DOORS"
    ]
  },
  {
    "name": "MIRROR_Z_POS",
    "id": 339741504,
    "hex": "0x14400b40",
    "group": "SYSTEM",
    "area": "MIRROR",
    "type": "INT32",
    "ordinal": 2880,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Mirror Z Position\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates the mirror is tilted completely downwards. This must be a\nnon-positive value.\nThe maxInt32Value indicates the mirror is tilted completely upwards. This must be a\nnon-negative value.\n0 indicates the mirror is not tilted in either direction.\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nfully downward and fully upwards positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2360,
    "javaLine": 2866,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_MIRRORS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_MIRRORS"
    ]
  },
  {
    "name": "MIRROR_Z_MOVE",
    "id": 339741505,
    "hex": "0x14400b41",
    "group": "SYSTEM",
    "area": "MIRROR",
    "type": "INT32",
    "ordinal": 2881,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Mirror Z Move\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value represents the maximum movement speed of the mirror while tilting upwards.\nThe minInt32Value represents the maximum movement speed of the mirror while tilting\ndownwards.\n\nLarger absolute values, either positive or negative, indicate a faster movement speed. Once\nthe mirror reaches the positional limit, the value must reset to 0. If MIRROR_Z_MOVE's value\nis currently 0, then that means there is no movement currently occurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2387,
    "javaLine": 2898,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_MIRRORS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_MIRRORS"
    ]
  },
  {
    "name": "MIRROR_Y_POS",
    "id": 339741506,
    "hex": "0x14400b42",
    "group": "SYSTEM",
    "area": "MIRROR",
    "type": "INT32",
    "ordinal": 2882,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Mirror Y Position\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates the mirror is tilted completely to the left. This must be a\nnon-positive value.\nThe maxInt32Value indicates the mirror is tilted completely to the right. This must be a\nnon-negative value.\n0 indicates the mirror is not tilted in either direction.\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nleft extreme and right extreme positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2414,
    "javaLine": 2930,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_MIRRORS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_MIRRORS"
    ]
  },
  {
    "name": "MIRROR_Y_MOVE",
    "id": 339741507,
    "hex": "0x14400b43",
    "group": "SYSTEM",
    "area": "MIRROR",
    "type": "INT32",
    "ordinal": 2883,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Mirror Y Move\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value represents the maximum movement speed of the mirror while tilting right.\nThe minInt32Value represents the maximum movement speed of the mirror while tilting left.\n\nLarger absolute values, either positive or negative, indicate a faster movement speed. Once\nthe mirror reaches the positional limit, the value must reset to 0. If MIRROR_Y_MOVE's value\nis currently 0, then that means there is no movement currently occurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2441,
    "javaLine": 2962,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_MIRRORS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_MIRRORS"
    ]
  },
  {
    "name": "MIRROR_LOCK",
    "id": 287312708,
    "hex": "0x11200b44",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 2884,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Mirror Lock\n\nTrue indicates mirror positions are locked and not changeable\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2467,
    "javaLine": 2994,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_MIRRORS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_MIRRORS"
    ]
  },
  {
    "name": "MIRROR_FOLD",
    "id": 287312709,
    "hex": "0x11200b45",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 2885,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Mirror Fold\n\nTrue indicates mirrors are folded\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2482,
    "javaLine": 3016,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_MIRRORS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_MIRRORS"
    ]
  },
  {
    "name": "MIRROR_AUTO_FOLD_ENABLED",
    "id": 337644358,
    "hex": "0x14200b46",
    "group": "SYSTEM",
    "area": "MIRROR",
    "type": "BOOLEAN",
    "ordinal": 2886,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Represents property for Mirror Auto Fold feature.\n\nThis property is true when the feature for automatically folding the vehicle's side mirrors\n(for example, when the mirrors fold inward automatically when one exits and locks the\nvehicle) is enabled.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2498,
    "javaLine": 3036,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_MIRRORS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_MIRRORS"
    ]
  },
  {
    "name": "MIRROR_AUTO_TILT_ENABLED",
    "id": 337644359,
    "hex": "0x14200b47",
    "group": "SYSTEM",
    "area": "MIRROR",
    "type": "BOOLEAN",
    "ordinal": 2887,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Represents property for Mirror Auto Tilt feature.\n\nThis property is true when the feature for automatically tilting the vehicle's side mirrors\n(for example, when the mirrors tilt downward automatically when one reverses the vehicle) is\nenabled.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2517,
    "javaLine": 3060,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_MIRRORS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_MIRRORS"
    ]
  },
  {
    "name": "SEAT_MEMORY_SELECT",
    "id": 356518784,
    "hex": "0x15400b80",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2944,
    "changeMode": "ON_CHANGE",
    "access": "WRITE",
    "accessModes": [
      "WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seat memory select\n\nThis parameter selects the memory preset to use to select the seat position. The\nmaxInt32Value and minInt32Value in VehicleAreaConfig must be defined. All integers between\nminInt32Value and maxInt32Value must be supported. The minInt32Value is always 0, and the\nmaxInt32Value determines the number of seat preset memory slots available (i.e.\nnumSeatPresets - 1).\n\nFor instance, if the driver's seat has 3 memory presets, the maxInt32Value will be 2. When\nthe user wants to select a preset, the desired preset number (0, 1, or 2) is set.",
    "aidlLine": 2536,
    "javaLine": 3150,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_MEMORY_SET",
    "id": 356518785,
    "hex": "0x15400b81",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2945,
    "changeMode": "ON_CHANGE",
    "access": "WRITE",
    "accessModes": [
      "WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seat memory set\n\nThis setting allows the user to save the current seat position settings into the selected\npreset slot. The maxInt32Value and minInt32Value in VehicleAreaConfig must be defined. The\nminInt32Value must be 0, and the maxInt32Value for each seat position must match the\nmaxInt32Value for SEAT_MEMORY_SELECT.",
    "aidlLine": 2554,
    "javaLine": 3175,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_BELT_BUCKLED",
    "id": 354421634,
    "hex": "0x15200b82",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "BOOLEAN",
    "ordinal": 2946,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seatbelt buckled\n\nTrue indicates belt is buckled.\n\nWrite access indicates automatic seat buckling capabilities.  There are\nno known cars at this time, but you never know...\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2568,
    "javaLine": 3200,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_BELT_HEIGHT_POS",
    "id": 356518787,
    "hex": "0x15400b83",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2947,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seatbelt height position\n\nAdjusts the shoulder belt anchor point.\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates the seat belt's shoulder anchor is at its lowest position.\nThe maxInt32Value indicates the seat belt's shoulder anchor is at its highest position.\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nlowest and highest positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2586,
    "javaLine": 3222,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_BELT_HEIGHT_MOVE",
    "id": 356518788,
    "hex": "0x15400b84",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2948,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seatbelt height move\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value represents the maximum movement speed of the seat belt's shoulder anchor\nwhile moving upwards.\nThe minInt32Value represents the maximum movement speed of the seat belt's shoulder anchor\nwhile moving downwards.\n\nLarger absolute values, either positive or negative, indicate a faster movement speed. Once\nthe seat belt reaches the positional limit, the value must reset to 0. If\nSEAT_BELT_HEIGHT_MOVE's value is currently 0, then that means there is no movement currently\noccurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2612,
    "javaLine": 3253,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_FORE_AFT_POS",
    "id": 356518789,
    "hex": "0x15400b85",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2949,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seat fore/aft position\n\nSets the seat position forward and backwards.\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates the seat is at its rearward-most linear position.\nThe maxInt32Value indicates the seat is at its forward-most linear position.\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nclosest and farthest positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2641,
    "javaLine": 3286,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_FORE_AFT_MOVE",
    "id": 356518790,
    "hex": "0x15400b86",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2950,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seat fore/aft move\n\nThis property moves the entire seat forward/backward in the direction that it is facing.\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value represents the maximum movement speed of the seat while moving forward.\nThe minInt32Value represents the maximum movement speed of the seat while moving backward.\n\nLarger absolute values, either positive or negative, indicate a faster movement speed. Once\nthe seat reaches the positional limit, the value must reset to 0. If SEAT_FORE_AFT_MOVE's\nvalue is currently 0, then that means there is no movement currently occurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2667,
    "javaLine": 3317,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_BACKREST_ANGLE_1_POS",
    "id": 356518791,
    "hex": "0x15400b87",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2951,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seat backrest angle 1 position\n\nBackrest angle 1 is the actuator closest to the bottom of the seat.\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates the seat backrest's full recline position w.r.t the\nactuator at the bottom of the seat.\nThe maxInt32Value indicates the seat backrest's most upright/forward position w.r.t the\nactuator at the bottom of the seat.\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nfull recline and upright/forward positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2695,
    "javaLine": 3351,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_BACKREST_ANGLE_1_MOVE",
    "id": 356518792,
    "hex": "0x15400b88",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2952,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seat backrest angle 1 move\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value represents the maximum movement speed of the seat backrest while angling\nforward.\nThe minInt32Value represents the maximum movement speed of the seat backrest while reclining.\n\nLarger absolute values, either positive or negative, indicate a faster movement speed. Once\nthe seat backrest reaches the positional limit, the value must reset to 0. If\nSEAT_BACKREST_ANGLE_1_MOVE's value is currently 0, then that means there is no movement\ncurrently occurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2723,
    "javaLine": 3384,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_BACKREST_ANGLE_2_POS",
    "id": 356518793,
    "hex": "0x15400b89",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2953,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seat backrest angle 2 position\n\nBackrest angle 2 is the next actuator up from the bottom of the seat.\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates the seat backrest's full recline position w.r.t the next\nactuator in the backrest from the one at the bottom of the seat (see\nSEAT_BACKREST_ANGLE_1_POS for additional details).\nThe maxInt32Value indicates the seat backrest's most upright/forward position w.r.t the\nnext actuator in the backrest from the one at the bottom of the seat(see\nSEAT_BACKREST_ANGLE_1_POS for additional details).\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nfull recline and upright/forward positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2751,
    "javaLine": 3420,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_BACKREST_ANGLE_2_MOVE",
    "id": 356518794,
    "hex": "0x15400b8a",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2954,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seat backrest angle 2 move\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value represents the maximum movement speed of the seat backrest while angling\nforward.\nThe minInt32Value represents the maximum movement speed of the seat backrest while reclining.\n\nLarger absolute values, either positive or negative, indicate a faster movement speed. Once\nthe seat backrest reaches the positional limit, the value must reset to 0. If\nSEAT_BACKREST_ANGLE_2_MOVE's value is currently 0, then that means there is no movement\ncurrently occurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2781,
    "javaLine": 3453,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_HEIGHT_POS",
    "id": 356518795,
    "hex": "0x15400b8b",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2955,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seat height position\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates the seat is in its lowest position.\nThe maxInt32Value indicates the seat is in its highest position.\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nlowest and highest positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2809,
    "javaLine": 3491,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_HEIGHT_MOVE",
    "id": 356518796,
    "hex": "0x15400b8c",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2956,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seat height move\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value represents the maximum movement speed of the seat while moving upward.\nThe minInt32Value represents the maximum movement speed of the seat while moving downward.\n\nLarger absolute values, either positive or negative, indicate a faster movement speed. Once\nthe seat reaches the positional limit, the value must reset to 0. If SEAT_HEIGHT_MOVE's value\nis currently 0, then that means there is no movement currently occurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2833,
    "javaLine": 3522,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_DEPTH_POS",
    "id": 356518797,
    "hex": "0x15400b8d",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2957,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seat depth position\n\nSets the seat depth, distance from back rest to front edge of seat.\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates the seat is in its shallowest position (i.e. the position with\nthe smallest distance between the front edge of the seat cushion and the rear end of the\nseat).\nThe maxInt32Value indicates the seat is in its deepest position (i.e. the position with the\nlargest distance between the front edge of the seat cushion and the rear end of the seat).\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nshallowest and deepest positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2859,
    "javaLine": 3554,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_DEPTH_MOVE",
    "id": 356518798,
    "hex": "0x15400b8e",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2958,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seat depth move\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value represents the maximum movement speed of the seat while getting deeper\nThe minInt32Value represents the maximum movement speed of the seat while getting shallower.\n\nLarger absolute values, either positive or negative, indicate a faster movement speed. Once\nthe seat backrest reaches the positional limit, the value must reset to 0. If\nSEAT_DEPTH_MOVE's value is currently 0, then that means there is no movement currently\noccurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2888,
    "javaLine": 3587,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_TILT_POS",
    "id": 356518799,
    "hex": "0x15400b8f",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2959,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seat tilt position\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates the seat bottom is angled at its lowest angular position. This\ncorresponds to the seat's front edge at its lowest possible position relative to the rear\nend of the seat.\nThe maxInt32Value indicates the seat bottom is angled at its highest angular position. This\ncorresponds to the seat's front edge at its highest possible position relative to the rear\nend of the seat.\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nlowest and highest positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2915,
    "javaLine": 3621,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_TILT_MOVE",
    "id": 356518800,
    "hex": "0x15400b90",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2960,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Seat tilt move\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value represents the maximum movement speed of the front edge of the seat while\nmoving upward.\nThe minInt32Value represents the maximum movement speed of the front edge of the seat while\nmoving downward.\n\nLarger absolute values, either positive or negative, indicate a faster movement speed. Once\nthe seat bottom reaches the positional limit, the value must reset to 0. If SEAT_TILT_MOVE's\nvalue is currently 0, then that means there is no movement currently occurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2943,
    "javaLine": 3654,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_LUMBAR_FORE_AFT_POS",
    "id": 356518801,
    "hex": "0x15400b91",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2961,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Lumber fore/aft position\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates the lumbar support is in its rearward most position (i.e. least\nsupportive position).\nThe maxInt32Value indicates the lumbar support is in its forward most position (i.e. most\nsupportive position).\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nforward and rearward positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2971,
    "javaLine": 3688,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_LUMBAR_FORE_AFT_MOVE",
    "id": 356518802,
    "hex": "0x15400b92",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2962,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Lumbar fore/aft move\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value represents the maximum movement speed of the seat's lumbar support while\nmoving forward.\nThe minInt32Value represents the maximum movement speed of the seat's lumbar support while\nmoving backward.\n\nLarger absolute values, either positive or negative, indicate a faster movement speed. Once\nthe seat's lumbar support reaches the positional limit, the value must reset to 0. If\nSEAT_LUMBAR_FORE_AFT_MOVE's value is currently 0, then that means there is no movement\ncurrently occurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 2997,
    "javaLine": 3719,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_LUMBAR_SIDE_SUPPORT_POS",
    "id": 356518803,
    "hex": "0x15400b93",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2963,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Lumbar side support position\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates the lumbar side support is in its thinnest position (i.e.\nmost support).\nThe maxInt32Value indicates the lumbar side support is in its widest position (i.e.\nleast support).\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nthinnest and widest positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3026,
    "javaLine": 3752,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_LUMBAR_SIDE_SUPPORT_MOVE",
    "id": 356518804,
    "hex": "0x15400b94",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2964,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Lumbar side support move\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value represents the maximum movement speed of the seat's lumbar side support\nwhile getting wider.\nThe minInt32Value represents the maximum movement speed of the seat's lumbar side support\nwhile getting thinner.\n\nLarger absolute values, either positive or negative, indicate a faster movement speed. Once\nthe seat's lumbar side support reaches the positional limit, the value must reset to 0. If\nSEAT_LUMBAR_SIDE_SUPPORT_MOVE's value is currently 0, then that means there is no movement\ncurrently occurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3052,
    "javaLine": 3783,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_HEADREST_HEIGHT_POS",
    "id": 289409941,
    "hex": "0x11400b95",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 2965,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": true,
    "description": "(Deprecated) Headrest height position\n\nThis property is deprecated because it is defined as type VehicleArea:GLOBAL, which means all\nseats use the same value. Use SEAT_HEADREST_HEIGHT_POS_V2 instead which fixes this issue by\nbeing defined as type VehicleArea:SEAT.\n\nSets the headrest height.\nMax value indicates tallest setting.\nMin value indicates shortest setting.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3081,
    "javaLine": 3817,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_HEADREST_HEIGHT_POS_V2",
    "id": 356518820,
    "hex": "0x15400ba4",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2980,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Headrest height position\n\nSets the headrest height for supported seats. VehiclePropConfig.areaConfigs specifies which\nseats are supported.\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates the headrest is in its lowest position.\nThe maxInt32Value indicates the headrest is in its highest position.\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nlowest and highest positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3103,
    "javaLine": 3833,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_HEADREST_HEIGHT_MOVE",
    "id": 356518806,
    "hex": "0x15400b96",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2966,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Headrest height move\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value represents the maximum movement speed of the seat's headrest while moving\nup.\nThe minInt32Value represents the maximum movement speed of the seat's headrest while moving\ndown.\n\nLarger absolute values, either positive or negative, indicate a faster movement speed. Once\nthe seat's headrest reaches the positional limit, the value must reset to 0. If\nSEAT_HEADREST_HEIGHT_MOVE's value is currently 0, then that means there is no movement\ncurrently occurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3131,
    "javaLine": 3868,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_HEADREST_ANGLE_POS",
    "id": 356518807,
    "hex": "0x15400b97",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2967,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Headrest angle position\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates the headrest is in its full recline position.\nThe maxInt32Value indicates the headrest is in its most upright/forward position.\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nfull recline and most upright/forward positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3160,
    "javaLine": 3900,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_HEADREST_ANGLE_MOVE",
    "id": 356518808,
    "hex": "0x15400b98",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2968,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Headrest angle move\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value represents the maximum movement speed of the seat's headrest while moving\ninto an upright/forward position.\nThe minInt32Value represents the maximum movement speed of the seat's headrest while moving\ninto a shallow position.\n\nLarger absolute values, either positive or negative, indicate a faster movement speed. Once\nthe seat's headrest reaches the positional limit, the value must reset to 0. If\nSEAT_HEADREST_ANGLE_MOVE's value is currently 0, then that means there is no movement\ncurrently occurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3184,
    "javaLine": 3931,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_HEADREST_FORE_AFT_POS",
    "id": 356518809,
    "hex": "0x15400b99",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2969,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Headrest fore/aft position\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates the headrest is in its rearward-most linear position.\nThe maxInt32Value indicates the headrest is in its forward-most linear position.\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nforward and rearward positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3213,
    "javaLine": 3963,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_HEADREST_FORE_AFT_MOVE",
    "id": 356518810,
    "hex": "0x15400b9a",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2970,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Headrest fore/aft move\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value represents the maximum movement speed of the seat's headrest while moving\nforward.\nThe minInt32Value represents the maximum movement speed of the seat's headrest while moving\nbackward.\n\nLarger absolute values, either positive or negative, indicate a faster movement speed. Once\nthe seat's headrest reaches the positional limit, the value must reset to 0. If\nSEAT_HEADREST_FORE_AFT_MOVE's value is currently 0, then that means there is no movement\ncurrently occurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3237,
    "javaLine": 3994,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_FOOTWELL_LIGHTS_STATE",
    "id": 356518811,
    "hex": "0x15400b9b",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2971,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleLightState",
    "version": 2,
    "deprecated": false,
    "description": "Represents property for the seat footwell lights state.\n\nSEAT_FOOTWELL_LIGHTS_STATE reflects the current state of the lights at any point in time.\nThis is different from the function of SEAT_FOOTWELL_LIGHTS_SWITCH which represents the\nposition of the switch controlling the lights. Therefore, SEAT_FOOTWELL_LIGHTS_STATE may not\nmatch the value of SEAT_FOOTWELL_LIGHTS_SWITCH (e.g. SEAT_FOOTWELL_LIGHTS_SWITCH=AUTOMATIC\nand SEAT_FOOTWELL_LIGHTS_STATE=ON).\n\nThis property should only be implemented if SEAT_FOOTWELL_LIGHTS_STATE's value may be\ndifferent from that of CABIN_LIGHTS_STATE.\n\nFor each supported area ID, the VehicleAreaConfig#supportedEnumValues must be defined unless\nall enum values of VehicleLightState are supported.",
    "aidlLine": 3266,
    "javaLine": 4027,
    "readPermissions": [
      "PERMISSION_READ_INTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_READ_INTERIOR_LIGHTS"
    ]
  },
  {
    "name": "SEAT_FOOTWELL_LIGHTS_SWITCH",
    "id": 356518812,
    "hex": "0x15400b9c",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2972,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "VehicleLightSwitch",
    "version": 2,
    "deprecated": false,
    "description": "Represents property for the seat footwell lights switch.\n\nSEAT_FOOTWELL_LIGHTS_SWITCH represents the position of the switch controlling the lights.\nThis is different from the function of SEAT_FOOTWELL_LIGHTS_STATE which reflects the current\nstate of the lights at any point in time. Therefore, SEAT_FOOTWELL_LIGHTS_SWITCH may not\nmatch the value of SEAT_FOOTWELL_LIGHTS_STATE (e.g. SEAT_FOOTWELL_LIGHTS_SWITCH=AUTOMATIC and\nSEAT_FOOTWELL_LIGHTS_STATE=ON).\n\nThis property should only be implemented if SEAT_FOOTWELL_LIGHTS_SWITCH's value may be\ndifferent from that of CABIN_LIGHTS_SWITCH.\n\nFor each supported area ID, the VehicleAreaConfig#supportedEnumValues must be defined unless\nall enum values of VehicleLightSwitch are supported.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3288,
    "javaLine": 4064,
    "readPermissions": [
      "PERMISSION_CONTROL_INTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_INTERIOR_LIGHTS"
    ]
  },
  {
    "name": "SEAT_EASY_ACCESS_ENABLED",
    "id": 354421661,
    "hex": "0x15200b9d",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "BOOLEAN",
    "ordinal": 2973,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Represents property for Seat easy access feature.\n\nIf true, the seat will automatically adjust to make it easier for the occupant to enter and\nexit the vehicle. Each area ID must map to the seat that the user is trying to enter/exit\nwith the help of the easy access feature.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3314,
    "javaLine": 4101,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_AIRBAG_ENABLED",
    "id": 354421662,
    "hex": "0x15200b9e",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "BOOLEAN",
    "ordinal": 2974,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Represents feature to enable/disable a seat's ability to deploy airbag(s) when triggered\n(e.g. by a crash).\n\nIf true, it means the seat's airbags are enabled, and if triggered (e.g. by a crash), they\nwill deploy. If false, it means the seat's airbags are disabled, and they will not deploy\nunder any circumstance. This property does not indicate if the airbags are deployed or not.\n\nThis property can be set to VehiclePropertyAccess.READ read only for the sake of regulation\nor safety concerns.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3331,
    "javaLine": 4126,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_AIRBAGS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_AIRBAGS"
    ]
  },
  {
    "name": "SEAT_AIRBAGS_DEPLOYED",
    "id": 356518821,
    "hex": "0x15400ba5",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2981,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleAirbagLocation",
    "version": 3,
    "deprecated": false,
    "description": "Seat airbags deployed\n\nBit flag property to relay information on which airbags have been deployed in the vehicle at\neach seat, vs which ones are currently still armed. If SEAT_AIRBAG_ENABLED is set to false at\na particular areaId, this property should return status code UNAVAILABLE at that areaId.\n\nEnums apply to each seat, not the global vehicle. For example, VehicleAirbagsLocation#CURTAIN\nat the driver seat areaId represents whether the driver side curtain airbag has been\ndeployed. Multiple bit flags can be set to indicate that multiple different airbags have been\ndeployed for the seat.\n\nFor each seat area ID, the VehicleAreaConfig#supportedEnumValues array must be defined unless\nall states of VehicleAirbagLocation are supported (including OTHER, which is not\nrecommended).",
    "aidlLine": 3352,
    "javaLine": 4152,
    "readPermissions": [
      "PERMISSION_READ_CAR_AIRBAGS"
    ],
    "writePermissions": []
  },
  {
    "name": "SEAT_CUSHION_SIDE_SUPPORT_POS",
    "id": 356518815,
    "hex": "0x15400b9f",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2975,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Represents property for seat’s hipside (bottom cushion’s side) support position.\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value indicates the seat cushion side support is in its widest position (i.e.\nleast support).\nThe minInt32Value indicates the seat cushion side support is in its thinnest position (i.e.\nmost support).\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nthinnest and widest positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3375,
    "javaLine": 4189,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_CUSHION_SIDE_SUPPORT_MOVE",
    "id": 356518816,
    "hex": "0x15400ba0",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2976,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Represents property for movement direction and speed of seat cushion side support.\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value represents the maximum movement speed of the seat cushion side support when\ngrowing wider (i.e. support is decreasing).\nThe minInt32Value represents the maximum movement speed of the seat cushion side support when\ngrowing thinner (i.e. support is increasing).\n\nLarger absolute values, either positive or negative, indicate a faster movement speed. Once\nthe seat cushion side support reaches the positional limit, the value must reset to 0. If\nSEAT_CUSHION_SIDE_SUPPORT_MOVE's value is currently 0, then that means there is no movement\ncurrently occurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3401,
    "javaLine": 4221,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_LUMBAR_VERTICAL_POS",
    "id": 356518817,
    "hex": "0x15400ba1",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2977,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Represents property for seat’s lumbar support vertical position.\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value indicates the lumbar support's highest position.\nThe minInt32Value indicates the lumbar support's lowest position.\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nlowest and highest positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3430,
    "javaLine": 4255,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_LUMBAR_VERTICAL_MOVE",
    "id": 356518818,
    "hex": "0x15400ba2",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2978,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Represents property for vertical movement direction and speed of seat lumbar support.\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value indicates the lumbar support is moving at the fastest upward speed.\nThe minInt32Value indicates the lumbar support is moving at the fastest downward speed.\n\nLarger absolute values, either positive or negative, indicate a faster movement speed. Once\nthe seat cushion side support reaches the positional limit, the value must reset to 0. If\nSEAT_LUMBAR_VERTICAL_MOVE's value is currently 0, then that means there is no movement\ncurrently occurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3454,
    "javaLine": 4287,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_WALK_IN_POS",
    "id": 356518819,
    "hex": "0x15400ba3",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2979,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Represents property that indicates the current walk-in position of the seat.\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates the normal seat position. The minInt32Value must be 0.\nThe maxInt32Value indicates the seat is in the full walk-in position.\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nnormal and walk-in positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThe area ID must match the seat that actually moves when the walk-in feature activates, not\nthe intended seat the passengers will sit in.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3481,
    "javaLine": 4320,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_SEATS"
    ]
  },
  {
    "name": "SEAT_BELT_PRETENSIONER_DEPLOYED",
    "id": 354421670,
    "hex": "0x15200ba6",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "BOOLEAN",
    "ordinal": 2982,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 3,
    "deprecated": false,
    "description": "Seat belt pretensioner deployed.\n\nProperty to relay information on whether the seat belt pretensioner has been deployed for a\nparticular seat due to a collision. This is different from the regular seat belt tightening\nsystem that continuously adds tension to the seat belts so that they fit snugly around the\nperson sitting in the seat, nor is it the seat belt retractor system that locks the seat belt\nin place during sudden brakes or when the user jerks the seat belt.\n\nIf this property is dependant on the state of other properties, and those properties are\ncurrently in the state that doesn't support this property, this should return\nStatusCode#NOT_AVAILABLE",
    "aidlLine": 3508,
    "javaLine": 4353,
    "readPermissions": [
      "PERMISSION_READ_CAR_SEAT_BELTS"
    ],
    "writePermissions": []
  },
  {
    "name": "SEAT_OCCUPANCY",
    "id": 356518832,
    "hex": "0x15400bb0",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 2992,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleSeatOccupancyState",
    "version": 2,
    "deprecated": false,
    "description": "Seat Occupancy\n\nIndicates whether a particular seat is occupied or not, to the best of the car's ability\nto determine. Valid values are from the VehicleSeatOccupancyState enum.",
    "aidlLine": 3527,
    "javaLine": 4384,
    "readPermissions": [
      "PERMISSION_READ_CAR_SEATS",
      "PERMISSION_CONTROL_CAR_SEATS"
    ],
    "writePermissions": []
  },
  {
    "name": "WINDOW_POS",
    "id": 322964416,
    "hex": "0x13400bc0",
    "group": "SYSTEM",
    "area": "WINDOW",
    "type": "INT32",
    "ordinal": 3008,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Window Position\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates the window is closed/fully open out of plane. If the window\ncannot open out of plane, then minInt32Value is the position of the window when fully closed\nand must be 0. If the window can open out of plane, the minInt32Value indicates the window\nis fully open in its position out of plane and will be a negative value. See the example\nbelow for a more detailed explanation.\nThe maxInt32Value indicates the window is fully open.\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nclosed/fully open out-of-plane and fully open positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nFor example, this is how the property should work for a window that can move out of plane:\n For a window that may open out of plane (i.e. vent mode of sunroof) this\n parameter will work with negative values as follows:\n   Max = sunroof completely open\n   0 = sunroof closed.\n   Min = sunroof vent completely open\n\n   Note that in this mode, 0 indicates the window is closed.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3540,
    "javaLine": 4408,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_WINDOWS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_WINDOWS"
    ]
  },
  {
    "name": "WINDOW_MOVE",
    "id": 322964417,
    "hex": "0x13400bc1",
    "group": "SYSTEM",
    "area": "WINDOW",
    "type": "INT32",
    "ordinal": 3009,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Window Move\n\nThe maxInt32Value and minInt32Value in each VehicleAreaConfig must be defined. All integers\nbetween minInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value indicates the window is opening in plane/closing in the out of plane\ndirection at the fastest speed.\nThe minInt32Value indicates the window is closing in plane/opening in the out of plane\ndirection at the fastest speed.\n\nLarger absolute values, either positive or negative, indicate a faster movement speed. Once\nthe window reaches the positional limit, the value must reset to 0. If WINDOW_MOVE's value is\ncurrently 0, then that means there is no movement currently occurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nFor a window that may open out of plane (i.e. vent mode of sunroof) this\nparameter will work as follows:\n\nIf sunroof is open:\n  Max = open the sunroof further, automatically stop when fully open.\n  Min = close the sunroof, automatically stop when sunroof is closed.\n\nIf vent is open:\n  Max = close the vent, automatically stop when vent is closed.\n  Min = open the vent further, automatically stop when vent is fully open.\n\nIf sunroof is in the closed position:\n  Max = open the sunroof, automatically stop when sunroof is fully open.\n  Min = open the vent, automatically stop when vent is fully open.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3577,
    "javaLine": 4443,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_WINDOWS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_WINDOWS"
    ]
  },
  {
    "name": "WINDOW_LOCK",
    "id": 320867268,
    "hex": "0x13200bc4",
    "group": "SYSTEM",
    "area": "WINDOW",
    "type": "BOOLEAN",
    "ordinal": 3012,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Window Child Lock\n\nTrue indicates the window is child-locked.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3620,
    "javaLine": 4477,
    "readPermissions": [
      "PERMISSION_CONTROL_CAR_WINDOWS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_WINDOWS"
    ]
  },
  {
    "name": "WINDSHIELD_WIPERS_PERIOD",
    "id": 322964421,
    "hex": "0x13400bc5",
    "group": "SYSTEM",
    "area": "WINDOW",
    "type": "INT32",
    "ordinal": 3013,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "MILLI_SECS",
    "version": 2,
    "deprecated": false,
    "description": "Windshield wipers period (milliseconds).\n\nReturns the instantaneous time period for 1 full cycle of the windshield wipers in\nmilliseconds. A full cycle is defined as a wiper moving from and returning to its rest\nposition.\n\nWhen an intermittent wiper setting is selected, this property value must be set to 0 during\nthe \"pause\" period of the intermittent wiping.\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined. The maxInt32Value\nfor each area ID must specify the longest wiper period. The minInt32Value must be set to 0\nfor each area ID.",
    "aidlLine": 3635,
    "javaLine": 4500,
    "readPermissions": [
      "PERMISSION_READ_WINDSHIELD_WIPERS"
    ],
    "writePermissions": []
  },
  {
    "name": "WINDSHIELD_WIPERS_STATE",
    "id": 322964422,
    "hex": "0x13400bc6",
    "group": "SYSTEM",
    "area": "WINDOW",
    "type": "INT32",
    "ordinal": 3014,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "WindshieldWipersState",
    "version": 2,
    "deprecated": false,
    "description": "Windshield wipers state.\n\nReturns the current state of the windshield wipers. The value of WINDSHIELD_WIPERS_STATE may\nnot match the value of WINDSHIELD_WIPERS_SWITCH. (e.g. WINDSHIELD_WIPERS_STATE = ON and\nWINDSHIELD_WIPERS_SWITCH = WindshieldWipersSwitch#AUTO).\n\nIf WINDSHIELD_WIPERS_STATE = ON and WINDSHIELD_WIPERS_PERIOD is implemented, then\nWINDSHIELD_WIPERS_PERIOD must reflect the time period of 1 full cycle of the wipers.\n\nFor each supported area ID, the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states in WindshieldWipersState are supported (including OTHER, which is not\nrecommended).",
    "aidlLine": 3657,
    "javaLine": 4530,
    "readPermissions": [
      "PERMISSION_READ_WINDSHIELD_WIPERS_3P",
      "PERMISSION_READ_WINDSHIELD_WIPERS"
    ],
    "writePermissions": []
  },
  {
    "name": "WINDSHIELD_WIPERS_SWITCH",
    "id": 322964423,
    "hex": "0x13400bc7",
    "group": "SYSTEM",
    "area": "WINDOW",
    "type": "INT32",
    "ordinal": 3015,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "WindshieldWipersSwitch",
    "version": 2,
    "deprecated": false,
    "description": "Windshield wipers switch.\n\nRepresents the position of the switch controlling the windshield wipers. The value of\nWINDSHIELD_WIPERS_SWITCH may not match the value of WINDSHIELD_WIPERS_STATE (e.g.\nWINDSHIELD_WIPERS_SWITCH = AUTO and WINDSHIELD_WIPERS_STATE = WindshieldWipersState#ON).\n\nFor each supported area ID, the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states in WindshieldWipersSwitch are supported (including OTHER, which is not\nrecommended).\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.\n\nIf this property is implemented as VehiclePropertyAccess.READ_WRITE and the OTHER state is\nlisted in the VehicleAreaConfig#supportedEnumValues array, then OTHER is not a supported\nvalue for writing. It is only a supported value for reading.",
    "aidlLine": 3679,
    "javaLine": 4573,
    "readPermissions": [
      "PERMISSION_READ_WINDSHIELD_WIPERS",
      "PERMISSION_CONTROL_WINDSHIELD_WIPERS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_WINDSHIELD_WIPERS"
    ]
  },
  {
    "name": "STEERING_WHEEL_DEPTH_POS",
    "id": 289410016,
    "hex": "0x11400be0",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3040,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Steering wheel depth position\n\nAll steering wheel properties' unique ids start from 0x0BE0.\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined. All values between\nminInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value indicates the steering wheel position furthest from the driver.\nThe minInt32Value indicates the steering wheel position closest to the driver.\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nclosest and furthest positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3706,
    "javaLine": 4616,
    "readPermissions": [
      "PERMISSION_CONTROL_STEERING_WHEEL"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_STEERING_WHEEL"
    ]
  },
  {
    "name": "STEERING_WHEEL_DEPTH_MOVE",
    "id": 289410017,
    "hex": "0x11400be1",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3041,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Steering wheel depth movement\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined. All values between\nminInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value indicates the steering wheel moving away from the driver.\nThe minInt32Value indicates the steering wheel moving towards the driver.\n\nLarger integers, either positive or negative, indicate a faster movement speed. Once the\nsteering wheel reaches the positional limit, the value must reset to 0. If\nSTEERING_WHEEL_DEPTH_MOVE's value is currently 0, then that means there is no movement\ncurrently occurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3732,
    "javaLine": 4648,
    "readPermissions": [
      "PERMISSION_CONTROL_STEERING_WHEEL"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_STEERING_WHEEL"
    ]
  },
  {
    "name": "STEERING_WHEEL_HEIGHT_POS",
    "id": 289410018,
    "hex": "0x11400be2",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3042,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Steering wheel height position\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined. All values between\nminInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value indicates the steering wheel being in the highest position.\nThe minInt32Value indicates the steering wheel being in the lowest position.\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nlowest and highest positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3759,
    "javaLine": 4683,
    "readPermissions": [
      "PERMISSION_CONTROL_STEERING_WHEEL"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_STEERING_WHEEL"
    ]
  },
  {
    "name": "STEERING_WHEEL_HEIGHT_MOVE",
    "id": 289410019,
    "hex": "0x11400be3",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3043,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Steering wheel height movement\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined. All values between\nminInt32Value and maxInt32Value must be supported.\n\nThe maxInt32Value indicates the steering wheel moving upwards.\nThe minInt32Value indicates the steering wheel moving downwards.\n\nLarger integers, either positive or negative, indicate a faster movement speed. Once the\nsteering wheel reaches the positional limit, the value must reset to 0. If\nSTEERING_WHEEL_HEIGHT_MOVE's value is currently 0, then that means there is no movement\ncurrently occurring.\n\nThis property is not in any particular unit but in a specified range of relative movement\nspeeds.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3783,
    "javaLine": 4715,
    "readPermissions": [
      "PERMISSION_CONTROL_STEERING_WHEEL"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_STEERING_WHEEL"
    ]
  },
  {
    "name": "STEERING_WHEEL_THEFT_LOCK_ENABLED",
    "id": 287312868,
    "hex": "0x11200be4",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 3044,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Steering wheel theft lock feature enabled\n\nIf true, the steering wheel will lock automatically to prevent theft in certain\nsituations.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3810,
    "javaLine": 4749,
    "readPermissions": [
      "PERMISSION_CONTROL_STEERING_WHEEL"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_STEERING_WHEEL"
    ]
  },
  {
    "name": "STEERING_WHEEL_LOCKED",
    "id": 287312869,
    "hex": "0x11200be5",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 3045,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Steering wheel locked\n\nIf true, the steering wheel's position is locked and not changeable.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3826,
    "javaLine": 4774,
    "readPermissions": [
      "PERMISSION_CONTROL_STEERING_WHEEL"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_STEERING_WHEEL"
    ]
  },
  {
    "name": "STEERING_WHEEL_EASY_ACCESS_ENABLED",
    "id": 287312870,
    "hex": "0x11200be6",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 3046,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Steering wheel easy access feature enabled\n\nIf true, the driver’s steering wheel will automatically adjust to make it easier for the\ndriver to enter and exit the vehicle.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3841,
    "javaLine": 4798,
    "readPermissions": [
      "PERMISSION_CONTROL_STEERING_WHEEL"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_STEERING_WHEEL"
    ]
  },
  {
    "name": "GLOVE_BOX_DOOR_POS",
    "id": 356518896,
    "hex": "0x15400bf0",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 3056,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Property that represents the current position of the glove box door.\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nAll integers between minInt32Value and maxInt32Value must be supported.\n\nThe minInt32Value indicates that the glove box door is closed. The minInt32Value must be 0.\nThe maxInt32Value indicates that the glove box door is in the fully open position.\n\nValues in between minInt32Value and maxInt32Value indicate a transition state between the\nclosed and fully open positions.\n\nThis property is not in any particular unit but in a specified range of relative positions.\n\nThe area ID must match the seat by which the glove box is intended to be used  (e.g. if the\nfront right dashboard has a glove box embedded in it, then the area ID should be\nSEAT_1_RIGHT).\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3857,
    "javaLine": 3085,
    "readPermissions": [
      "PERMISSION_CONTROL_GLOVE_BOX"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_GLOVE_BOX"
    ]
  },
  {
    "name": "GLOVE_BOX_LOCKED",
    "id": 354421745,
    "hex": "0x15200bf1",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "BOOLEAN",
    "ordinal": 3057,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Lock or unlock the glove box.\n\nIf true, the glove box is locked. If false, the glove box is unlocked.\n\nThe area ID must match the seat by which the glove box is intended to be used (e.g. if the\nfront right dashboard has a glove box embedded in it, then the area ID should be\nVehicleAreaSeat#ROW_1_RIGHT).\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 3886,
    "javaLine": 3122,
    "readPermissions": [
      "PERMISSION_CONTROL_GLOVE_BOX"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_GLOVE_BOX"
    ]
  },
  {
    "name": "VEHICLE_MAP_SERVICE",
    "id": 299895808,
    "hex": "0x11e00c00",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "MIXED",
    "ordinal": 3072,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Vehicle Maps Service (VMS) message\n\nThis property uses MIXED data to communicate vms messages.\n\nIts contents are to be interpreted as follows:\nthe indices defined in VmsMessageIntegerValuesIndex are to be used to\nread from int32Values;\nbytes is a serialized VMS message as defined in the vms protocol\nwhich is opaque to the framework;\n\nIVehicle#get must always return StatusCode::NOT_AVAILABLE.",
    "aidlLine": 3906,
    "javaLine": 4823,
    "readPermissions": [
      "PERMISSION_VMS_PUBLISHER",
      "PERMISSION_VMS_SUBSCRIBER"
    ],
    "writePermissions": [
      "PERMISSION_VMS_PUBLISHER",
      "PERMISSION_VMS_SUBSCRIBER"
    ]
  },
  {
    "name": "LOCATION_CHARACTERIZATION",
    "id": 289410064,
    "hex": "0x11400c10",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3088,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Characterization of inputs used for computing location.\n\nThis property must indicate what (if any) data and sensor inputs are considered by the system\nwhen computing the vehicle's location that is shared with Android through the GNSS HAL.\n\nThe value must return a collection of bit flags. The bit flags are defined in\nLocationCharacterization. The value must also include exactly one of DEAD_RECKONED or\nRAW_GNSS_ONLY among its collection of bit flags.\n\nWhen this property is not supported, it is assumed that no additional sensor inputs are fused\ninto the GNSS updates provided through the GNSS HAL. That is unless otherwise specified\nthrough the GNSS HAL interfaces.",
    "aidlLine": 3925,
    "javaLine": 4835,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "ULTRASONICS_SENSOR_POSITION",
    "id": 406916128,
    "hex": "0x18410c20",
    "group": "SYSTEM",
    "area": "VENDOR",
    "type": "INT32_VEC",
    "ordinal": 3104,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 3,
    "deprecated": false,
    "description": "Static data for the position of each ultrasonic sensor installed on the vehicle.\n\nEach individual sensor is identified by its unique VehicleAreaConfig#areaId and returns the\nsensor's position formatted as [x, y, z] where:\n\n    int32Values[0] = x, the position of the sensor along the x-axis relative to the origin of\n                     the Android Automotive sensor coordinate frame in millimeters\n    int32Values[1] = y, the position of the sensor along the y-axis relative to the origin of\n                     the Android Automotive sensor coordinate frame in millimeters.\n    int32Values[2] = z, the position of the sensor along the z-axis relative to the origin of\n                     the Android Automotive sensor coordinate frame in millimeters.\n\nIf the data is aggregated by another ECU, then OEMs have the option of reporting the same\nreading across all included sensors or reporting a virtual representation of all the included\nsensors as if they were one sensor.",
    "aidlLine": 3946,
    "javaLine": 4873,
    "readPermissions": [
      "PERMISSION_READ_ULTRASONICS_SENSOR_DATA"
    ],
    "writePermissions": []
  },
  {
    "name": "ULTRASONICS_SENSOR_ORIENTATION",
    "id": 409013281,
    "hex": "0x18610c21",
    "group": "SYSTEM",
    "area": "VENDOR",
    "type": "FLOAT_VEC",
    "ordinal": 3105,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 3,
    "deprecated": false,
    "description": "Static data for the orientation of each ultrasonic sensor installed on the vehicle.\n\nEach individual sensor is identified by its VehicleAreaConfig#areaId and returns the sensor's\norientation formatted as [qw, qx, qy, qz] where:\n\n    int32Values[0] = qw, the quaternion coefficient w within the quaterinion (w + xi + yj +\n                     zk) describing the rotation of the sensor relative to the Android\n                     Automotive sensor coordinate frame.\n    int32Values[1] = qx, the quaternion coefficient x within the quaterinion (w + xi + yj +\n                     zk) describing the rotation of the sensor relative to the Android\n                     Automotive sensor coordinate frame.\n    int32Values[2] = qy, the quaternion coefficient y within the quaterinion (w + xi + yj +\n                     zk) describing the rotation of the sensor relative to the Android\n                     Automotive sensor coordinate frame.\n    int32Values[3] = qz, the quaternion coefficient z within the quaterinion (w + xi + yj +\n                     zk) describing the rotation of the sensor relative to the Android\n                     Automotive sensor coordinate frame.\n\nThis assumes each sensor uses the same axes conventions as Android Automotive.\n\nIf the data is aggregated by another ECU, then OEMs have the option of reporting the same\nreading across all included sensors or reporting a virtual representation of all the included\nsensors as if they were one sensor.",
    "aidlLine": 3970,
    "javaLine": 4907,
    "readPermissions": [
      "PERMISSION_READ_ULTRASONICS_SENSOR_DATA"
    ],
    "writePermissions": []
  },
  {
    "name": "ULTRASONICS_SENSOR_FIELD_OF_VIEW",
    "id": 406916130,
    "hex": "0x18410c22",
    "group": "SYSTEM",
    "area": "VENDOR",
    "type": "INT32_VEC",
    "ordinal": 3106,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 3,
    "deprecated": false,
    "description": "Static data for the field of view of each ultrasonic sensor in degrees.\n\nEach individual sensor is identified by its VehicleAreaConfig#areaId and returns the sensor's\nfield of view formatted as [horizontal, vertical] where:\n\n    int32Values[0] = horizontal, the horizontal field of view for the specified ultrasonic\n                     sensor in degrees.\n    int32Values[1] = vertical, the vertical field of view for the associated specified\n                     ultrasonic sensor in degrees.\n\nThis assumes each sensor uses the same axes conventions as Android Automotive.\n\nIf the data is aggregated by another ECU, then OEMs have the option of reporting the same\nreading across all included sensors or reporting a virtual representation of all the included\nsensors as if they were one sensor.",
    "aidlLine": 4002,
    "javaLine": 4945,
    "readPermissions": [
      "PERMISSION_READ_ULTRASONICS_SENSOR_DATA"
    ],
    "writePermissions": []
  },
  {
    "name": "ULTRASONICS_SENSOR_DETECTION_RANGE",
    "id": 406916131,
    "hex": "0x18410c23",
    "group": "SYSTEM",
    "area": "VENDOR",
    "type": "INT32_VEC",
    "ordinal": 3107,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 3,
    "deprecated": false,
    "description": "Static data for the detection range of each ultrasonic sensor in millimeters.\n\nEach individual sensor is identified by its VehicleAreaConfig#areaId and returns the sensor's\ndetection range formatted as [minimum, maximum] where:\n\n    int32Values[0] = minimum, the minimum range detectable by the ultrasonic sensor in\n                     millimeters.\n    int32Values[1] = maximum, the maximum range detectable by the ultrasonic sensor in\n                     millimeters.\n\nIf the data is aggregated by another ECU, then OEMs have the option of reporting the same\nreading across all included sensors or reporting a virtual representation of all the included\nsensors as if they were one sensor.",
    "aidlLine": 4026,
    "javaLine": 4979,
    "readPermissions": [
      "PERMISSION_READ_ULTRASONICS_SENSOR_DATA"
    ],
    "writePermissions": []
  },
  {
    "name": "ULTRASONICS_SENSOR_SUPPORTED_RANGES",
    "id": 406916132,
    "hex": "0x18410c24",
    "group": "SYSTEM",
    "area": "VENDOR",
    "type": "INT32_VEC",
    "ordinal": 3108,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 3,
    "deprecated": false,
    "description": "Static data for the supported ranges of each ultrasonic sensor in millimeters.\n\nFor ultrasonic sensors that only support readings within a specific range. For example, if\nan ultrasonic sensor detects an object at 700mm, but can only report that an object has been\ndetected between 500mm and 1000mm.\n\nEach individual sensor is identified by its VehicleAreaConfig#areaId and returns the sensor's\nsupported ranges formatted as [range_min_1, range_max_1, range_min_2, range_max_2, ...]\nwhere:\n\n    int32Values[0] = range_min_1, the minimum of one supported range by the specified sensor\n                     in millimeters, inclusive.\n    int32Values[1] = range_max_1, the maximum of one supported range by the specified sensor\n                     in millimeters, inclusive.\n    int32Values[2] = range_min_2, the minimum of another supported range by the specified\n                     sensor in millimeters, inclusive.\n    int32Values[3] = range_max_2, the maximum of another supported range by the specified\n                            sensor in millimeters, inclusive.\n\nExample:\n    - Ultrasonic sensor supports the following ranges:\n          - 150mm to 499mm\n          - 500mm to 999mm\n          - 1000mm to 1500mm\n    - The associated supported ranges should be formatted as:\n          - int32Values[0] = 150\n          - int32Values[1] = 499\n          - int32Values[2] = 500\n          - int32Values[3] = 999\n          - int32Values[4] = 1000\n          - int32Values[5] = 1500\n\nIf this property is not defined, all the values within the ULTRASONICS_SENSOR_DETECTION_RANGE\nfor the specified sensor are assumed to be supported.\n\nIf the data is aggregated by another ECU, then OEMs have the option of reporting the same\nreading across all included sensors or reporting a virtual representation of all the included\nsensors as if they were one sensor.",
    "aidlLine": 4048,
    "javaLine": 5009,
    "readPermissions": [
      "PERMISSION_READ_ULTRASONICS_SENSOR_DATA"
    ],
    "writePermissions": []
  },
  {
    "name": "ULTRASONICS_SENSOR_MEASURED_DISTANCE",
    "id": 406916133,
    "hex": "0x18410c25",
    "group": "SYSTEM",
    "area": "VENDOR",
    "type": "INT32_VEC",
    "ordinal": 3109,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 3,
    "deprecated": false,
    "description": "The distance reading of the nearest detected object per sensor in millimeters.\n\nEach individual sensor is identified by its VehicleAreaConfig#areaId and returns the sensor's\nmeasured distance formatted as [distance, distance_error] where:\n\n    int32Values[0] = distance, the measured distance of the nearest object in millimeters.\n                     If only a range is supported, this value must be set to the minimum\n                     supported distance in the detected range as specified in\n                     ULTRASONICS_SENSOR_SUPPORTED_RANGES.\n    int32Values[1] = distance_error, the error of the measured distance value in\n                     millimeters.\n\nIf no object is detected, an empty vector must be returned. If distance_error is not\navailable then an array of only the measured distance must be returned.\n\nIf the data is aggregated by another ECU, then OEMs have the option of reporting the same\nreading across all included sensors or reporting a virtual representation of all the included\nsensors as if they were one sensor.",
    "aidlLine": 4095,
    "javaLine": 5065,
    "readPermissions": [
      "PERMISSION_READ_ULTRASONICS_SENSOR_DATA"
    ],
    "writePermissions": []
  },
  {
    "name": "OBD2_LIVE_FRAME",
    "id": 299896064,
    "hex": "0x11e00d00",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "MIXED",
    "ordinal": 3328,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "OBD2 Live Sensor Data\n\nReports a snapshot of the current (live) values of the OBD2 sensors available.\n\nThe configArray is set as follows:\n  configArray[0] = number of vendor-specific integer-valued sensors\n  configArray[1] = number of vendor-specific float-valued sensors\n\nThe values of this property are to be interpreted as in the following example.\nConsidering a configArray = {2,3}\nint32Values must be a vector containing Obd2IntegerSensorIndex.LAST_SYSTEM_INDEX + 2\nelements (that is, 33 elements);\nfloatValues must be a vector containing Obd2FloatSensorIndex.LAST_SYSTEM_INDEX + 3\nelements (that is, 73 elements);\n\nIt is possible for each frame to contain a different subset of sensor values, both system\nprovided sensors, and vendor-specific ones. In order to support that, the bytes element\nof the property value is used as a bitmask,.\n\nbytes must have a sufficient number of bytes to represent the total number of possible\nsensors (in this case, 14 bytes to represent 106 possible values); it is to be read as\na contiguous bitmask such that each bit indicates the presence or absence of a sensor\nfrom the frame, starting with as many bits as the size of int32Values, immediately\nfollowed by as many bits as the size of floatValues.\n\nFor example, should bytes[0] = 0x4C (0b01001100) it would mean that:\n  int32Values[0 and 1] are not valid sensor values\n  int32Values[2 and 3] are valid sensor values\n  int32Values[4 and 5] are not valid sensor values\n  int32Values[6] is a valid sensor value\n  int32Values[7] is not a valid sensor value\nShould bytes[5] = 0x61 (0b01100001) it would mean that:\n  int32Values[32] is a valid sensor value\n  floatValues[0 thru 3] are not valid sensor values\n  floatValues[4 and 5] are valid sensor values\n  floatValues[6] is not a valid sensor value",
    "aidlLine": 4122,
    "javaLine": 5100,
    "readPermissions": [
      "PERMISSION_CAR_DIAGNOSTIC_READ_ALL"
    ],
    "writePermissions": [
      "PERMISSION_CAR_DIAGNOSTIC_READ_ALL"
    ]
  },
  {
    "name": "OBD2_FREEZE_FRAME",
    "id": 299896065,
    "hex": "0x11e00d01",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "MIXED",
    "ordinal": 3329,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "OBD2 Freeze Frame Sensor Data\n\nReports a snapshot of the value of the OBD2 sensors available at the time that a fault\noccurred and was detected.\n\nA configArray must be provided with the same meaning as defined for OBD2_LIVE_FRAME.\n\nThe values of this property are to be interpreted in a similar fashion as those for\nOBD2_LIVE_FRAME, with the exception that the stringValue field may contain a non-empty\ndiagnostic troubleshooting code (DTC).\n\nA IVehicle#get request of this property must provide a value for int64Values[0].\nThis will be interpreted as the timestamp of the freeze frame to retrieve. A list of\ntimestamps can be obtained by a IVehicle#get of OBD2_FREEZE_FRAME_INFO.\n\nShould no freeze frame be available at the given timestamp, a response of NOT_AVAILABLE\nmust be returned by the implementation. Because vehicles may have limited storage for\nfreeze frames, it is possible for a frame request to respond with NOT_AVAILABLE even if\nthe associated timestamp has been recently obtained via OBD2_FREEZE_FRAME_INFO.",
    "aidlLine": 4166,
    "javaLine": 5112,
    "readPermissions": [
      "PERMISSION_CAR_DIAGNOSTIC_READ_ALL"
    ],
    "writePermissions": [
      "PERMISSION_CAR_DIAGNOSTIC_READ_ALL"
    ]
  },
  {
    "name": "OBD2_FREEZE_FRAME_INFO",
    "id": 299896066,
    "hex": "0x11e00d02",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "MIXED",
    "ordinal": 3330,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "OBD2 Freeze Frame Information\n\nThis property describes the current freeze frames stored in vehicle\nmemory and available for retrieval via OBD2_FREEZE_FRAME.\n\nThe values are to be interpreted as follows:\neach element of int64Values must be the timestamp at which a a fault code\nhas been detected and the corresponding freeze frame stored, and each\nsuch element can be used as the key to OBD2_FREEZE_FRAME to retrieve\nthe corresponding freeze frame.",
    "aidlLine": 4193,
    "javaLine": 5124,
    "readPermissions": [
      "PERMISSION_CAR_DIAGNOSTIC_READ_ALL"
    ],
    "writePermissions": [
      "PERMISSION_CAR_DIAGNOSTIC_READ_ALL"
    ]
  },
  {
    "name": "OBD2_FREEZE_FRAME_CLEAR",
    "id": 299896067,
    "hex": "0x11e00d03",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "MIXED",
    "ordinal": 3331,
    "changeMode": "ON_CHANGE",
    "access": "WRITE",
    "accessModes": [
      "WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "OBD2 Freeze Frame Clear\n\nThis property allows deletion of any of the freeze frames stored in\nvehicle memory, as described by OBD2_FREEZE_FRAME_INFO.\n\nThe configArray is set as follows:\n configArray[0] = 1 if the implementation is able to clear individual freeze frames\n                  by timestamp, 0 otherwise\n\nIVehicle#set of this property is to be interpreted as follows:\n  if int64Values contains no elements, then all frames stored must be cleared;\n  if int64Values contains one or more elements, then frames at the timestamps\n  stored in int64Values must be cleared, and the others not cleared. Should the\n  vehicle not support selective clearing of freeze frames, this latter mode must\n  return NOT_AVAILABLE.",
    "aidlLine": 4211,
    "javaLine": 5136,
    "readPermissions": [
      "PERMISSION_CAR_DIAGNOSTIC_CLEAR"
    ],
    "writePermissions": [
      "PERMISSION_CAR_DIAGNOSTIC_CLEAR"
    ]
  },
  {
    "name": "HEADLIGHTS_STATE",
    "id": 289410560,
    "hex": "0x11400e00",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3584,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleLightState",
    "version": 2,
    "deprecated": false,
    "description": "Headlights State\n\nReturn the current state of headlights.",
    "aidlLine": 4234,
    "javaLine": 5148,
    "readPermissions": [
      "PERMISSION_EXTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_EXTERIOR_LIGHTS"
    ]
  },
  {
    "name": "HIGH_BEAM_LIGHTS_STATE",
    "id": 289410561,
    "hex": "0x11400e01",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3585,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleLightState",
    "version": 2,
    "deprecated": false,
    "description": "High beam lights state\n\nReturn the current state of high beam lights.",
    "aidlLine": 4246,
    "javaLine": 5170,
    "readPermissions": [
      "PERMISSION_EXTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_EXTERIOR_LIGHTS"
    ]
  },
  {
    "name": "FOG_LIGHTS_STATE",
    "id": 289410562,
    "hex": "0x11400e02",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3586,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleLightState",
    "version": 2,
    "deprecated": false,
    "description": "Fog light state\n\nReturn the current state of fog lights.\n\nIf the car has both front and rear fog lights:\n  If front and rear fog lights can only be controlled together: FOG_LIGHTS_STATE must be\n  implemented. FRONT_FOG_LIGHTS_STATE and REAR_FOG_LIGHTS_STATE must not be implemented.\n\n  If the front and rear fog lights can only be controlled independently: FOG_LIGHTS_STATE\n  must not be implemented. FRONT_FOG_LIGHTS_STATE and REAR_FOG_LIGHTS_STATE must be\n  implemented.\n\nIf the car has only front fog lights:\nOnly one of FOG_LIGHTS_STATE or FRONT_FOG_LIGHTS_STATE must be implemented and not both.\nREAR_FOG_LIGHTS_STATE must not be implemented.\n\nIf the car has only rear fog lights:\nOnly one of FOG_LIGHTS_STATE or REAR_FOG_LIGHTS_STATE must be implemented and not both.\nFRONT_FOG_LIGHTS_STATE must not be implemented.",
    "aidlLine": 4258,
    "javaLine": 5192,
    "readPermissions": [
      "PERMISSION_EXTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_EXTERIOR_LIGHTS"
    ]
  },
  {
    "name": "HAZARD_LIGHTS_STATE",
    "id": 289410563,
    "hex": "0x11400e03",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3587,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleLightState",
    "version": 2,
    "deprecated": false,
    "description": "Hazard light status\n\nReturn the current status of hazard lights.",
    "aidlLine": 4286,
    "javaLine": 5235,
    "readPermissions": [
      "PERMISSION_EXTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_EXTERIOR_LIGHTS"
    ]
  },
  {
    "name": "HEADLIGHTS_SWITCH",
    "id": 289410576,
    "hex": "0x11400e10",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3600,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "VehicleLightSwitch",
    "version": 2,
    "deprecated": false,
    "description": "Headlight switch\n\nThe setting that the user wants.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 4298,
    "javaLine": 5257,
    "readPermissions": [
      "PERMISSION_CONTROL_EXTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_EXTERIOR_LIGHTS"
    ]
  },
  {
    "name": "HIGH_BEAM_LIGHTS_SWITCH",
    "id": 289410577,
    "hex": "0x11400e11",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3601,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "VehicleLightSwitch",
    "version": 2,
    "deprecated": false,
    "description": "High beam light switch\n\nThe setting that the user wants.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 4314,
    "javaLine": 5279,
    "readPermissions": [
      "PERMISSION_CONTROL_EXTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_EXTERIOR_LIGHTS"
    ]
  },
  {
    "name": "FOG_LIGHTS_SWITCH",
    "id": 289410578,
    "hex": "0x11400e12",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3602,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "VehicleLightSwitch",
    "version": 2,
    "deprecated": false,
    "description": "Fog light switch\n\nThe setting that the user wants.\n\nIf the car has both front and rear fog lights:\n  If front and rear fog lights can only be controlled together: FOG_LIGHTS_SWITCH must be\n  implemented. FRONT_FOG_LIGHTS_SWITCH and REAR_FOG_LIGHTS_SWITCH must not be implemented.\n\n  If the front and rear fog lights can only be controlled independently: FOG_LIGHTS_SWITCH\n  must not be implemented. FRONT_FOG_LIGHTS_SWITCH and REAR_FOG_LIGHTS_SWITCH must be\n  implemented.\n\nIf the car has only front fog lights:\nOnly one of FOG_LIGHTS_SWITCH or FRONT_FOG_LIGHTS_SWITCH must be implemented and not both.\nREAR_FOG_LIGHTS_SWITCH must not be implemented.\n\nIf the car has only rear fog lights:\nOnly one of FOG_LIGHTS_SWITCH or REAR_FOG_LIGHTS_SWITCH must be implemented and not both.\nFRONT_FOG_LIGHTS_SWITCH must not be implemented.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 4330,
    "javaLine": 5301,
    "readPermissions": [
      "PERMISSION_CONTROL_EXTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_EXTERIOR_LIGHTS"
    ]
  },
  {
    "name": "HAZARD_LIGHTS_SWITCH",
    "id": 289410579,
    "hex": "0x11400e13",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3603,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "VehicleLightSwitch",
    "version": 2,
    "deprecated": false,
    "description": "Hazard light switch\n\nThe setting that the user wants.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 4362,
    "javaLine": 5346,
    "readPermissions": [
      "PERMISSION_CONTROL_EXTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_EXTERIOR_LIGHTS"
    ]
  },
  {
    "name": "CABIN_LIGHTS_STATE",
    "id": 289410817,
    "hex": "0x11400f01",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3841,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleLightState",
    "version": 2,
    "deprecated": false,
    "description": "Cabin lights\n\nReturn current status of cabin lights.",
    "aidlLine": 4378,
    "javaLine": 5368,
    "readPermissions": [
      "PERMISSION_READ_INTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_READ_INTERIOR_LIGHTS"
    ]
  },
  {
    "name": "CABIN_LIGHTS_SWITCH",
    "id": 289410818,
    "hex": "0x11400f02",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3842,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "VehicleLightSwitch",
    "version": 2,
    "deprecated": false,
    "description": "Cabin lights switch\n\nThe position of the physical switch which controls the cabin lights.\nThis might be different than the CABIN_LIGHTS_STATE if the lights are on because a door\nis open or because of a voice command.\nFor example, while the switch is in the \"off\" or \"automatic\" position.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 4390,
    "javaLine": 5390,
    "readPermissions": [
      "PERMISSION_CONTROL_INTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_INTERIOR_LIGHTS"
    ]
  },
  {
    "name": "READING_LIGHTS_STATE",
    "id": 356519683,
    "hex": "0x15400f03",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 3843,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleLightState",
    "version": 2,
    "deprecated": false,
    "description": "Reading lights\n\nReturn current status of reading lights.",
    "aidlLine": 4409,
    "javaLine": 5412,
    "readPermissions": [
      "PERMISSION_READ_INTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_READ_INTERIOR_LIGHTS"
    ]
  },
  {
    "name": "READING_LIGHTS_SWITCH",
    "id": 356519684,
    "hex": "0x15400f04",
    "group": "SYSTEM",
    "area": "SEAT",
    "type": "INT32",
    "ordinal": 3844,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "VehicleLightSwitch",
    "version": 2,
    "deprecated": false,
    "description": "Reading lights switch\n\nThe position of the physical switch which controls the reading lights.\nThis might be different than the READING_LIGHTS_STATE if the lights are on because a door\nis open or because of a voice command.\nFor example, while the switch is in the \"off\" or \"automatic\" position.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 4421,
    "javaLine": 5434,
    "readPermissions": [
      "PERMISSION_CONTROL_INTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_INTERIOR_LIGHTS"
    ]
  },
  {
    "name": "STEERING_WHEEL_LIGHTS_STATE",
    "id": 289410828,
    "hex": "0x11400f0c",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3852,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleLightState",
    "version": 2,
    "deprecated": false,
    "description": "Steering wheel lights state\n\nRepresents the current state of the steering wheel lights. This is different from\nSTEERING_WHEEL_LIGHTS_SWITCH which represents the position of the switch controlling\nthe lights. Therefore, STEERING_WHEEL_LIGHTS_STATE may not match the value of\nSTEERING_WHEEL_LIGHTS_SWITCH (e.g. STEERING_WHEEL_LIGHTS_SWITCH=AUTOMATIC and\nSTEERING_WHEEL_LIGHTS_STATE=ON).\n\nThis property should only be implemented if STEERING_WHEEL_LIGHTS_STATE's value may be\ndifferent from that of CABIN_LIGHTS_STATE.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues must be defined unless\nall enum values of VehicleLightState are supported.",
    "aidlLine": 4440,
    "javaLine": 5457,
    "readPermissions": [
      "PERMISSION_READ_INTERIOR_LIGHTS"
    ],
    "writePermissions": []
  },
  {
    "name": "STEERING_WHEEL_LIGHTS_SWITCH",
    "id": 289410829,
    "hex": "0x11400f0d",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3853,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "VehicleLightSwitch",
    "version": 2,
    "deprecated": false,
    "description": "Steering wheel lights switch\n\nRepresents the position of the switch controlling the steering wheel lights. This is\ndifferent from STEERING_WHEEL_LIGHTS_STATE which represents the current state of the steering\nwheel lights. Therefore, STEERING_WHEEL_LIGHTS_SWITCH may not match the value of\nSTEERING_WHEEL_LIGHTS_STATE (e.g. STEERING_WHEEL_LIGHTS_SWITCH=AUTOMATIC and\nSTEERING_WHEEL_LIGHTS_STATE=ON).\n\nThis property should only be implemented if STEERING_WHEEL_LIGHTS_SWITCH's value may be\ndifferent from that of CABIN_LIGHTS_SWITCH.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues must be defined unless\nall enum values of VehicleLightSwitch are supported.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 4462,
    "javaLine": 5495,
    "readPermissions": [
      "PERMISSION_CONTROL_INTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_INTERIOR_LIGHTS"
    ]
  },
  {
    "name": "SUPPORT_CUSTOMIZE_VENDOR_PERMISSION",
    "id": 287313669,
    "hex": "0x11200f05",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 3845,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Support customize permissions for vendor properties\n\nImplement this property if vehicle hal support customize vendor permissions feature.\nVehiclePropConfig.configArray is used to indicate vendor properties and permissions\nwhich selected for this vendor property. The permission must be one of enum in\nVehicleVendorPermission.\nThe configArray is set as follows:\n     configArray[n] = propId : property ID for the vendor property\n     configArray[n+1] = one of enums in VehicleVendorPermission. It indicates the permission\n     for reading value of the property.\n     configArray[n+2] = one of enums in VehicleVendorPermission. It indicates the permission\n     for writing value of the property.\n\nFor example:\nconfigArray = {\n     vendor_prop_1, PERMISSION_VENDOR_SEAT_READ, PERMISSION_VENDOR_SEAT_WRITE,\n     vendor_prop_2, PERMISSION_VENDOR_INFO, PERMISSION_NOT_ACCESSIBLE,\n}\nIf vendor properties are not in this array, they will have the default vendor permission.\nIf vendor chose PERMISSION_NOT_ACCESSIBLE, android will not have access to the property. In\nthe example, Android can not write value for vendor_prop_2.",
    "aidlLine": 4488
  },
  {
    "name": "DISABLED_OPTIONAL_FEATURES",
    "id": 286265094,
    "hex": "0x11100f06",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "STRING",
    "ordinal": 3846,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Allow disabling optional featurs from vhal.\n\nThis property reports optional features that should be disabled.\nAll allowed optional features for the system is declared in Car service overlay,\nconfig_allowed_optional_car_features.\nThis property allows disabling features defined in the overlay. Without this property,\nall the features declared in the overlay will be enabled.\n\nValue read should include all features disabled with ',' separation.\nex) \"com.android.car.user.CarUserNoticeService,storage_monitoring\"",
    "aidlLine": 4517
  },
  {
    "name": "INITIAL_USER_INFO",
    "id": 299896583,
    "hex": "0x11e00f07",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "MIXED",
    "ordinal": 3847,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Defines the initial Android user to be used during initialization.\n\nThis property is called by the Android system when it initializes and it lets the HAL\ndefine which Android user should be started.\n\nThis request is made by setting a VehiclePropValue (defined by InitialUserInfoRequest),\nand the HAL must respond with a property change event (defined by InitialUserInfoResponse).\nIf the HAL doesn't respond after some time (defined by the Android system), the Android\nsystem will proceed as if HAL returned a response of action\nInitialUserInfoResponseAction:DEFAULT.\n\nFor example, on first boot, the request could be:\n\nint32[0]: 42  // request id (arbitrary number set by Android system)\nint32[1]: 1   // InitialUserInfoRequestType::FIRST_BOOT\nint32[2]: 0   // id of current user (usersInfo.currentUser.userId)\nint32[3]: 1   // flag of current user (usersInfo.currentUser.flags = SYSTEM)\nint32[4]: 1   // number of existing users (usersInfo.numberUsers);\nint32[5]: 0   // user #0  (usersInfo.existingUsers[0].userId)\nint32[6]: 1   // flags of user #0  (usersInfo.existingUsers[0].flags)\n\nAnd if the HAL want to respond with the creation of an admin user called \"Owner\", the\nresponse would be:\n\nint32[0]: 42      // must match the request id from the request\nint32[1]:  2      // action = InitialUserInfoResponseAction::CREATE\nint32[2]: -10000  // userToSwitchOrCreate.userId (not used as user will be created)\nint32[3]:  8      // userToSwitchOrCreate.flags = ADMIN\nstring: \"||Owner\" // userLocales + separator + userNameToCreate\n\nNotice the string value represents multiple values, separated by ||. The first value is the\n(optional) system locales for the user to be created (in this case, it's empty, meaning it\nwill use Android's default value), while the second value is the (also optional) name of the\nto user to be created (when the type of response is InitialUserInfoResponseAction:CREATE).\nFor example, to create the same \"Owner\" user with \"en-US\" and \"pt-BR\" locales, the string\nvalue of the response would be \"en-US,pt-BR||Owner\". As such, neither the locale nor the\nname can have || on it, although a single | is fine.\n\nNOTE: if the HAL doesn't support user management, then it should not define this property,\nwhich in turn would disable the other user-related properties (for example, the Android\nsystem would never issue them and user-related requests from the HAL layer would be ignored\nby the Android System). But if it supports user management, then it must support all core\nuser-related properties (INITIAL_USER_INFO, SWITCH_USER, CREATE_USER, and REMOVE_USER).",
    "aidlLine": 4534,
    "javaLine": 5533,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "SWITCH_USER",
    "id": 299896584,
    "hex": "0x11e00f08",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "MIXED",
    "ordinal": 3848,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Defines a request to switch the foreground Android user.\n\nThis property is used primarily by the Android System to inform the HAL that the\ncurrent foreground Android user is switching, but it could also be used by the HAL to request\nthe Android system to switch users - the\n\nWhen the request is made by Android, it sets a VehiclePropValue and the HAL must responde\nwith a property change event; when the HAL is making the request, it must also do it through\na property change event (the main difference is that the request id will be positive in the\nformer case, and negative in the latter; the SwitchUserMessageType will also be different).\n\nThe format of both request is defined by SwitchUserRequest and the format of the response\n(when needed) is defined by SwitchUserResponse. How the HAL (or Android System) should\nproceed depends on the message type (which is defined by the SwitchUserMessageType\nparameter), as defined below.\n\n1.LEGACY_ANDROID_SWITCH\n-----------------------\n\nCalled by the Android System to indicate the Android user is about to change, when the change\nrequest was made in a way that is not integrated with the HAL (for example, through\nadb shell am switch-user).\n\nThe HAL can switch its internal user once it receives this request, but it doesn't need to\nreply back to the Android System. If its internal user cannot be changed for some reason,\nthen it must wait for the SWITCH_USER(type=ANDROID_POST_SWITCH) call to recover\n(for example, it could issue a SWITCH_USER(type=VEHICLE_REQUEST) to switch back to\nthe previous user), but ideally it should never fail (as switching back could result in a\nconfusing experience for the end user).\n\nFor example, if the system have users (0, 10, 11) and it's switching from 0 to 11 (where none\nof them have any special flag), the request would be:\n\nint32[0]:  42  // request id\nint32[1]:  1   // SwitchUserMessageType::LEGACY_ANDROID_SWITCH\nint32[2]:  11  // target user id\nint32[3]:  0   // target user flags (none)\nint32[4]:  10  // current user\nint32[5]:  0   // current user flags (none)\nint32[6]:  3   // number of users\nint32[7]:  0   // user #0 (Android user id 0)\nint32[8]:  0   // flags of user #0 (none)\nint32[9]:  10  // user #1 (Android user id 10)\nint32[10]: 0   // flags of user #1 (none)\nint32[11]: 11  // user #2 (Android user id 11)\nint32[12]: 0   // flags of user #2 (none)\n\n2.ANDROID_SWITCH\n----------------\nCalled by the Android System to indicate the Android user is about to change, but Android\nwill wait for the HAL's response (up to some time) before proceeding.\n\nThe HAL must switch its internal user once it receives this request, then respond back to\nAndroid with a SWITCH_USER(type=VEHICLE_RESPONSE) indicating whether its internal\nuser was switched or not (through the SwitchUserStatus enum).\n\nFor example, if Android has users (0, 10, 11) and it's switching from 10 to 11 (where\nnone of them have any special flag), the request would be:\n\nint32[0]:  42  // request id\nint32[1]:  2   // SwitchUserMessageType::ANDROID_SWITCH\nint32[2]:  11  // target user id\nint32[3]:  0   // target user flags (none)\nint32[4]:  10  // current user\nint32[5]:  0   // current user flags (none)\nint32[6]:  3   // number of users\nint32[7]:  0   // 1st user (user 0)\nint32[8]:  1   // 1st user flags (SYSTEM)\nint32[9]:  10  // 2nd user (user 10)\nint32[10]: 0   // 2nd user flags (none)\nint32[11]: 11  // 3rd user (user 11)\nint32[12]: 0   // 3rd user flags (none)\n\nIf the request succeeded, the HAL must update the property with:\n\nint32[0]: 42  // request id\nint32[1]: 3   // messageType = SwitchUserMessageType::VEHICLE_RESPONSE\nint32[2]: 1   // status = SwitchUserStatus::SUCCESS\n\nBut if it failed, the response would be something like:\n\nint32[0]: 42   // request id\nint32[1]: 3    // messageType = SwitchUserMessageType::VEHICLE_RESPONSE\nint32[2]: 2    // status = SwitchUserStatus::FAILURE\nstring: \"108-D'OH!\" // OEM-specific error message\n\n3.VEHICLE_RESPONSE\n------------------\nCalled by the HAL to indicate whether a request of type ANDROID_SWITCH should proceed or\nabort - see the ANDROID_SWITCH section above for more info.\n\n4.VEHICLE_REQUEST\n------------------\nCalled by the HAL to request that the current foreground Android user is switched.\n\nThis is useful in situations where Android started as one user, but the vehicle identified\nthe driver as another user. For example, user A unlocked the car using the key fob of user B;\nthe INITIAL_USER_INFO request returned user B, but then a face recognition subsubsystem\nidentified the user as A.\n\nThe HAL makes this request by a property change event (passing a negative request id), and\nthe Android system will response by issue an ANDROID_POST_SWITCH call which the same\nrequest id.\n\nFor example, if the current foreground Android user is 10 and the HAL asked it to switch to\n11, the request would be:\n\nint32[0]: -108  // request id\nint32[1]: 4     // messageType = SwitchUserMessageType::VEHICLE_REQUEST\nint32[2]: 11    // Android user id\n\nIf the request succeeded and Android has 3 users (0, 10, 11), the response would be:\n\nint32[0]: -108 // request id\nint32[1]:  5   // messageType = SwitchUserMessageType::ANDROID_POST_SWITCH\nint32[2]:  11  // target user id\nint32[3]:  0   // target user id flags (none)\nint32[4]:  11  // current user\nint32[5]:  0   // current user flags (none)\nint32[6]:  3   // number of users\nint32[7]:  0   // 1st user (user 0)\nint32[8]:  0   // 1st user flags (none)\nint32[9]:  10  // 2nd user (user 10)\nint32[10]: 4   // 2nd user flags (none)\nint32[11]: 11  // 3rd user (user 11)\nint32[12]: 3   // 3rd user flags (none)\n\nNotice that both the current and target user ids are the same - if the request failed, then\nthey would be different (i.e, target user would be 11, but current user would still be 10).\n\n5.ANDROID_POST_SWITCH\n---------------------\nCalled by the Android System after a request to switch a user was made.\n\nThis property is called after switch requests of any type (i.e., LEGACY_ANDROID_SWITCH,\nANDROID_SWITCH, or VEHICLE_REQUEST) and can be used to determine if the request succeeded or\nfailed:\n\n1. When it succeeded, it's called when the Android user is in the unlocked state and the\n   value of the current and target users ids in the response are the same. This would be\n   equivalent to receiving an Intent.ACTION_USER_UNLOCKED in an Android app.\n2. When it failed it's called right away and the value of the current and target users ids\n   in the response are different (as the current user didn't change to the target).\n3. If a new switch request is made before the HAL responded to the previous one or before\n   the user was unlocked, then the ANDROID_POST_SWITCH request is not made. For example,\n   the driver could accidentally switch to the wrong user which has lock credentials, then\n   switch to the right one before entering the credentials.\n\nThe HAL can update its internal state once it receives this request, but it doesn't need to\nreply back to the Android System.\n\nRequest: the first N values as defined by INITIAL_USER_INFO (where the request-specific\nvalue at index 1 is SwitchUserMessageType::ANDROID_POST_SWITCH), then 2 more values for the\ntarget user id (i.e., the Android user id that was requested to be switched to) and its flags\n(as defined by  UserFlags).\n\nResponse: none.\n\nExample: see VEHICLE_REQUEST section above.",
    "aidlLine": 4585,
    "javaLine": 5551,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "CREATE_USER",
    "id": 299896585,
    "hex": "0x11e00f09",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "MIXED",
    "ordinal": 3849,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Called by the Android System after an Android user was created.\n\nThe HAL can use this property to create its equivalent user.\n\nThis is an async request: Android makes the request by setting a VehiclePropValue, and HAL\nmust respond with a property change indicating whether the request succeeded or failed. If\nit failed, the Android system will remove the user.\n\nThe format of the request is defined by CreateUserRequest and the format of the response by\nCreateUserResponse.\n\nFor example, if system had 2 users (0 and 10) and a 3rd one (which is an ephemeral guest) was\ncreated, the request would be:\n\nint32[0]: 42  // request id\nint32[1]: 11  // Android id of the created user\nint32[2]: 6   // Android flags (ephemeral guest) of the created user\nint32[3]: 10  // current user\nint32[4]: 0   // current user flags (none)\nint32[5]: 3   // number of users\nint32[6]: 0   // 1st user (user 0)\nint32[7]: 0   // 1st user flags (none)\nint32[8]: 10  // 2nd user (user 10)\nint32[9]: 0   // 2nd user flags (none)\nint32[19]: 11 // 3rd user (user 11)\nint32[11]: 6  // 3rd user flags (ephemeral guest)\nstring: \"ElGuesto\" // name of the new user\n\nThen if the request succeeded, the HAL would return:\n\nint32[0]: 42  // request id\nint32[1]: 1   // CreateUserStatus::SUCCESS\n\nBut if it failed:\n\nint32[0]: 42  // request id\nint32[1]: 2   // CreateUserStatus::FAILURE\nstring: \"D'OH!\" // The meaning is a blackbox - it's passed to the caller (like Settings UI),\n                // which in turn can take the proper action.",
    "aidlLine": 4752,
    "javaLine": 5569,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "REMOVE_USER",
    "id": 299896586,
    "hex": "0x11e00f0a",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "MIXED",
    "ordinal": 3850,
    "changeMode": "STATIC",
    "access": "WRITE",
    "accessModes": [
      "WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Called by the Android System after an Android user was removed.\n\nThe HAL can use this property to remove its equivalent user.\n\nThis is write-only call - the Android System is not expecting a reply from the HAL. Hence,\nthis request should not fail - if the equivalent HAL user cannot be removed, then HAL should\nmark it as inactive or recover in some other way.\n\nThe request is made by setting the VehiclePropValue with the contents defined by\nRemoveUserRequest.\n\nFor example, if system had 3 users (0, 10, and 11) and user 11 was removed, the request\nwould be:\n\nint32[0]: 42  // request id\nint32[1]: 11  // (Android user id of the removed user)\nint32[2]: 0   // (Android user flags of the removed user)\nint32[3]: 10  // current user\nint32[4]: 0   // current user flags (none)\nint32[5]: 2   // number of users\nint32[6]: 0   // 1st user (user 0)\nint32[7]: 0   // 1st user flags (none)\nint32[8]: 10  // 2nd user (user 10)\nint32[9]: 0   // 2nd user flags (none)",
    "aidlLine": 4799,
    "javaLine": 5587,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "USER_IDENTIFICATION_ASSOCIATION",
    "id": 299896587,
    "hex": "0x11e00f0b",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "MIXED",
    "ordinal": 3851,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Property used to associate (or query the association) the current user with vehicle-specific\nidentification mechanisms (such as key FOB).\n\nThis is an optional user management property - the OEM could still support user management\nwithout defining it. In fact, this property could be used without supporting the core\nuser-related functions described on INITIAL_USER_INFO.\n\nTo query the association, the Android system gets the property, passing a VehiclePropValue\ncontaining the types of associations are being queried, as defined by\nUserIdentificationGetRequest. The HAL must return right away, returning a VehiclePropValue\nwith a UserIdentificationResponse. Notice that user identification should have already\nhappened while system is booting up and the VHAL implementation should only return the\nalready identified association (like the key FOB used to unlock the car), instead of starting\na new association from the get call.\n\nTo associate types, the Android system sets the property, passing a VehiclePropValue\ncontaining the types and values of associations being set, as defined by the\nUserIdentificationSetRequest. The HAL will then use a property change event (whose\nVehiclePropValue is defined by UserIdentificationResponse) indicating the current status of\nthe types after the request.\n\nFor example, to query if the current user (10) is associated with the FOB that unlocked the\ncar and a custom mechanism provided by the OEM, the request would be:\n\nint32[0]: 42  // request id\nint32[1]: 10  (Android user id)\nint32[2]: 0   (Android user flags)\nint32[3]: 2   (number of types queried)\nint32[4]: 1   (1st type queried, UserIdentificationAssociationType::KEY_FOB)\nint32[5]: 101 (2nd type queried, UserIdentificationAssociationType::CUSTOM_1)\n\nIf the user is associated with the FOB but not with the custom mechanism, the response would\nbe:\n\nint32[0]: 42  // request id\nint32[1]: 2   (number of associations in the response)\nint32[2]: 1   (1st type: UserIdentificationAssociationType::KEY_FOB)\nint32[3]: 2   (1st value: UserIdentificationAssociationValue::ASSOCIATED_CURRENT_USER)\nint32[4]: 101 (2st type: UserIdentificationAssociationType::CUSTOM_1)\nint32[5]: 4   (2nd value: UserIdentificationAssociationValue::NOT_ASSOCIATED_ANY_USER)\n\nThen to associate the user with the custom mechanism, a set request would be made:\n\nint32[0]: 43  // request id\nint32[1]: 10  (Android user id)\nint32[2]: 0   (Android user flags)\nint32[3]: 1   (number of associations being set)\nint32[4]: 101 (1st type: UserIdentificationAssociationType::CUSTOM_1)\nint32[5]: 1   (1st value: UserIdentificationAssociationSetValue::ASSOCIATE_CURRENT_USER)\n\nIf the request succeeded, the response would be simply:\n\nint32[0]: 43  // request id\nint32[1]: 1   (number of associations in the response)\nint32[2]: 101 (1st type: UserIdentificationAssociationType::CUSTOM_1)\nint32[3]: 1   (1st value: UserIdentificationAssociationValue::ASSOCIATED_CURRENT_USER)\n\nNotice that the set request adds associations, but doesn't remove the existing ones. In the\nexample above, the end state would be 2 associations (FOB and CUSTOM_1). If we wanted to\nassociate the user with just CUSTOM_1 but not FOB, then the request should have been:\n\nint32[0]: 43  // request id\nint32[1]: 10  (Android user id)\nint32[2]: 2   (number of types set)\nint32[3]: 1   (1st type: UserIdentificationAssociationType::KEY_FOB)\nint32[4]: 2   (1st value: UserIdentificationAssociationValue::DISASSOCIATE_CURRENT_USER)\nint32[5]: 101 (2nd type: UserIdentificationAssociationType::CUSTOM_1)\nint32[6]: 1   (2nd value: UserIdentificationAssociationValue::ASSOCIATE_CURRENT_USER)",
    "aidlLine": 4831,
    "javaLine": 5605,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "EVS_SERVICE_REQUEST",
    "id": 289476368,
    "hex": "0x11410f10",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32_VEC",
    "ordinal": 3856,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Enable/request an EVS service.\n\nThe property provides a generalized way to trigger EVS services.  VHAL\nshould use this property to request Android to start or stop EVS service.\n\n int32Values[0] = a type of the EVS service. The value must be one of enums in\n                  EvsServiceType.\n int32Values[1] = the state of the EVS service. The value must be one of enums in\n                  EvsServiceState.\n\nFor example, to enable rear view EVS service, android side can set the property value as\n[EvsServiceType::REAR_VIEW, EvsServiceState::ON].",
    "aidlLine": 4907
  },
  {
    "name": "POWER_POLICY_REQ",
    "id": 286265121,
    "hex": "0x11100f21",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "STRING",
    "ordinal": 3873,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Defines a request to apply power policy.\n\nVHAL sets this property to change car power policy. Car power policy service subscribes to\nthis property and actually changes the power policy.\nThe request is made by setting the VehiclePropValue with the ID of a power policy which is\ndefined at /vendor/etc/automotive/power_policy.xml.\nIf the given ID is not defined, car power policy service ignores the request\nand the current power policy is maintained.\n\n  string: \"sample_policy_id\" // power policy ID",
    "aidlLine": 4927,
    "javaLine": 5623,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "POWER_POLICY_GROUP_REQ",
    "id": 286265122,
    "hex": "0x11100f22",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "STRING",
    "ordinal": 3874,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Defines a request to set the power polic group used to decide a default power policy per\npower status transition.\n\nVHAL sets this property with the ID of a power policy group in order to set the default power\npolicy applied at power status transition. Power policy groups are defined at\n/vendor/etc/power_policy.xml. If the given ID is not defined, car power policy service\nignores the request.\nCar power policy service subscribes to this property and sets the power policy group.\nThe actual application of power policy takes place when the system power status changes and\nthere is a valid mapped power policy for the new power status.\n\n  string: \"sample_policy_group_id\" // power policy group ID",
    "aidlLine": 4945,
    "javaLine": 5641,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "CURRENT_POWER_POLICY",
    "id": 286265123,
    "hex": "0x11100f23",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "STRING",
    "ordinal": 3875,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Notifies the current power policy to VHAL layer.\n\nCar power policy service sets this property when the current power policy is changed.\n\n  string: \"sample_policy_id\" // power policy ID",
    "aidlLine": 4965,
    "javaLine": 5659,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "WATCHDOG_ALIVE",
    "id": 290459441,
    "hex": "0x11500f31",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT64",
    "ordinal": 3889,
    "changeMode": "ON_CHANGE",
    "access": "WRITE",
    "accessModes": [
      "WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Defines an event that car watchdog updates to tell it's alive.\n\nCar watchdog sets this property to system uptime in milliseconds at every 3 second.\nDuring the boot, the update may take longer time.",
    "aidlLine": 4978,
    "javaLine": 5677,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "WATCHDOG_TERMINATED_PROCESS",
    "id": 299896626,
    "hex": "0x11e00f32",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "MIXED",
    "ordinal": 3890,
    "changeMode": "ON_CHANGE",
    "access": "WRITE",
    "accessModes": [
      "WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Defines a process terminated by car watchdog and the reason of termination.\n\n  int32Values[0]: 1         // ProcessTerminationReason showing why a process is terminated.\n  string: \"/system/bin/log\" // Process execution command.",
    "aidlLine": 4990,
    "javaLine": 5695,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "VHAL_HEARTBEAT",
    "id": 290459443,
    "hex": "0x11500f33",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT64",
    "ordinal": 3891,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Defines an event that VHAL signals to car watchdog as a heartbeat.\n\nIf VHAL supports this property, VHAL should write system uptime to this property at every 3\nsecond. Car watchdog subscribes to this property and checks if the property is updated at\nevery 3 second. With the buffer time of 3 second, car watchdog waits for a heart beat to be\nsignaled up to 6 seconds from the last heart beat. If it isn’t, car watchdog considers\nVHAL unhealthy and terminates it.\nIf this property is not supported by VHAL, car watchdog doesn't check VHAL health status.",
    "aidlLine": 5002,
    "javaLine": 5713,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "CLUSTER_SWITCH_UI",
    "id": 289410868,
    "hex": "0x11400f34",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3892,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Starts the ClusterUI in cluster display.\n\nint32: the type of ClusterUI to show\n   0 indicates ClusterHome, that is a home screen of cluster display, and provides\n       the default UI and a kind of launcher functionality for cluster display.\n   the other values are followed by OEM's definition.",
    "aidlLine": 5018,
    "javaLine": 5731,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "CLUSTER_DISPLAY_STATE",
    "id": 289476405,
    "hex": "0x11410f35",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32_VEC",
    "ordinal": 3893,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Changes the state of the cluster display.\n\nBounds: the area to render the cluster Activity.\nInset: the area which Activity should avoid from placing any important\n    information.\n\nint32[0]: on/off: 0 - off, 1 - on, -1 - don't care\nint32[1]: Bounds - left: positive number - left position in pixels\n                                -1 - don't care (should set all Bounds fields)\nint32[2]: Bounds - top:    same format with 'left'\nint32[3]: Bounds - right:  same format with 'left'\nint32[4]: Bounds - bottom: same format with 'left'\nint32[5]: Inset - left: positive number - actual left inset value in pixels\n                               -1 - don't care (should set \"don't care\" all Inset fields)\nint32[6]: Inset - top:    same format with 'left'\nint32[7]: Inset - right:  same format with 'left'\nint32[8]: Inset - bottom: same format with 'left'",
    "aidlLine": 5032,
    "javaLine": 5749,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "CLUSTER_REPORT_STATE",
    "id": 299896630,
    "hex": "0x11e00f36",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "MIXED",
    "ordinal": 3894,
    "changeMode": "ON_CHANGE",
    "access": "WRITE",
    "accessModes": [
      "WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Reports the current display state and ClusterUI state.\n\nClusterHome will send this message when it handles CLUSTER_SWITCH_UI, CLUSTER_DISPLAY_STATE.\n\nIn addition, ClusterHome should send this message when it starts for the first time.\nWhen ClusterOS receives this message and if the internal expectation is different with the\nreceived message, then it should send CLUSTER_SWITCH_UI, CLUSTER_DISPLAY_STATE again to\nmatch the state.\n\nint32[0]: on/off: 0 - off, 1 - on\nint32[1]: Bounds - left\nint32[2]: Bounds - top\nint32[3]: Bounds - right\nint32[4]: Bounds - bottom\nint32[5]: Inset - left\nint32[6]: Inset - top\nint32[7]: Inset - right\nint32[8]: Inset - bottom\nint32[9]: the type of ClusterUI in the fullscreen or main screen.\n   0 indicates ClusterHome.\n   the other values are followed by OEM's definition.\nint32[10]: the type of ClusterUI in sub screen if the currently two UIs are shown.\n   -1 indicates the area isn't used any more.\nbytes: the array to represent the availability of ClusterUI.\n    0 indicates non-available and 1 indicates available.\n    For example, let's assume a car supports 3 OEM defined ClusterUI like HOME, MAPS, CALL,\n    and it only supports CALL UI only when the cellular network is available. Then, if the\n    nework is avaibale, it'll send [1 1 1], and if it's out of network, it'll send [1 1 0].",
    "aidlLine": 5057,
    "javaLine": 5767,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "CLUSTER_REQUEST_DISPLAY",
    "id": 289410871,
    "hex": "0x11400f37",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3895,
    "changeMode": "ON_CHANGE",
    "access": "WRITE",
    "accessModes": [
      "WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Requests to change the cluster display state to show some ClusterUI.\n\nWhen the current display state is off and ClusterHome sends this message to ClusterOS to\nrequest to turn the display on to show some specific ClusterUI.\nClusterOS should response this with CLUSTER_DISPLAY_STATE.\n\nint32: the type of ClusterUI to show",
    "aidlLine": 5093,
    "javaLine": 5785,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "CLUSTER_NAVIGATION_STATE",
    "id": 292556600,
    "hex": "0x11700f38",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BYTES",
    "ordinal": 3896,
    "changeMode": "ON_CHANGE",
    "access": "WRITE",
    "accessModes": [
      "WRITE"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Informs the current navigation state.\n\nbytes: the serialized message of NavigationStateProto.",
    "aidlLine": 5108,
    "javaLine": 5803,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "ELECTRONIC_TOLL_COLLECTION_CARD_TYPE",
    "id": 289410873,
    "hex": "0x11400f39",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3897,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "ElectronicTollCollectionCardType",
    "version": 2,
    "deprecated": false,
    "description": "Electronic Toll Collection card type.\n\nThis property indicates the type of ETC card in this vehicle.\nIf the head unit is aware of an ETC card attached to the vehicle, this property should\nreturn the type of card attached; otherwise, this property should be UNAVAILABLE.",
    "aidlLine": 5119,
    "javaLine": 5862,
    "readPermissions": [
      "PERMISSION_CAR_INFO"
    ],
    "writePermissions": [
      "PERMISSION_CAR_INFO"
    ]
  },
  {
    "name": "ELECTRONIC_TOLL_COLLECTION_CARD_STATUS",
    "id": 289410874,
    "hex": "0x11400f3a",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3898,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "ElectronicTollCollectionCardStatus",
    "version": 2,
    "deprecated": false,
    "description": "Electronic Toll Collection card status.\n\nThis property indicates the status of ETC card in this vehicle.\nIf the head unit is aware of an ETC card attached to the vehicle,\nELECTRONIC_TOLL_COLLECTION_CARD_TYPE gives that status of the card; otherwise,\nthis property should be UNAVAILABLE.",
    "aidlLine": 5133,
    "javaLine": 5889,
    "readPermissions": [
      "PERMISSION_CAR_INFO"
    ],
    "writePermissions": [
      "PERMISSION_CAR_INFO"
    ]
  },
  {
    "name": "FRONT_FOG_LIGHTS_STATE",
    "id": 289410875,
    "hex": "0x11400f3b",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3899,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleLightState",
    "version": 2,
    "deprecated": false,
    "description": "Front fog lights state\n\nReturn the current state of the front fog lights.\nOnly one of FOG_LIGHTS_STATE or FRONT_FOG_LIGHTS_STATE must be implemented. Please refer to\nthe documentation on FOG_LIGHTS_STATE for more information.",
    "aidlLine": 5148,
    "javaLine": 5916,
    "readPermissions": [
      "PERMISSION_EXTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_EXTERIOR_LIGHTS"
    ]
  },
  {
    "name": "FRONT_FOG_LIGHTS_SWITCH",
    "id": 289410876,
    "hex": "0x11400f3c",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3900,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "VehicleLightSwitch",
    "version": 2,
    "deprecated": false,
    "description": "Front fog lights switch\n\nThe setting that the user wants.\nOnly one of FOG_LIGHTS_SWITCH or FRONT_FOG_LIGHTS_SWITCH must be implemented. Please refer to\nthe documentation on FOG_LIGHTS_SWITCH for more information.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 5163,
    "javaLine": 5941,
    "readPermissions": [
      "PERMISSION_CONTROL_EXTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_EXTERIOR_LIGHTS"
    ]
  },
  {
    "name": "REAR_FOG_LIGHTS_STATE",
    "id": 289410877,
    "hex": "0x11400f3d",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3901,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleLightState",
    "version": 2,
    "deprecated": false,
    "description": "Rear fog lights state\n\nReturn the current state of the rear fog lights.\nOnly one of FOG_LIGHTS_STATE or REAR_FOG_LIGHTS_STATE must be implemented. Please refer to\nthe documentation on FOG_LIGHTS_STATE for more information.",
    "aidlLine": 5182,
    "javaLine": 5966,
    "readPermissions": [
      "PERMISSION_EXTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_EXTERIOR_LIGHTS"
    ]
  },
  {
    "name": "REAR_FOG_LIGHTS_SWITCH",
    "id": 289410878,
    "hex": "0x11400f3e",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3902,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "VehicleLightSwitch",
    "version": 2,
    "deprecated": false,
    "description": "Rear fog lights switch\n\nThe setting that the user wants.\nOnly one of FOG_LIGHTS_SWITCH or REAR_FOG_LIGHTS_SWITCH must be implemented. Please refer to\nthe documentation on FOG_LIGHTS_SWITCH for more information.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 5197,
    "javaLine": 5991,
    "readPermissions": [
      "PERMISSION_CONTROL_EXTERIOR_LIGHTS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_EXTERIOR_LIGHTS"
    ]
  },
  {
    "name": "EV_CHARGE_CURRENT_DRAW_LIMIT",
    "id": 291508031,
    "hex": "0x11600f3f",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 3903,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "unit": "AMPERE",
    "version": 2,
    "deprecated": false,
    "description": "Indicates the maximum current draw threshold for charging set by the user\n\nconfigArray[0] is used to specify the max current draw allowed by\nthe vehicle in Amperes.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 5216,
    "javaLine": 6016,
    "readPermissions": [
      "PERMISSION_ENERGY",
      "PERMISSION_CONTROL_CAR_ENERGY"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_ENERGY"
    ]
  },
  {
    "name": "EV_CHARGE_PERCENT_LIMIT",
    "id": 291508032,
    "hex": "0x11600f40",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 3904,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Indicates the maximum charge percent threshold set by the user\n\nReturns a float value from 0 to 100.\n\nconfigArray is used to specify the valid values.\n  For example, if the vehicle supports the following charge percent limit values:\n    [20, 40, 60, 80, 100]\n  then the configArray should be {20, 40, 60, 80, 100}\nIf the configArray is empty then all values from 0 to 100 must be valid.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 5234,
    "javaLine": 6044,
    "readPermissions": [
      "PERMISSION_ENERGY",
      "PERMISSION_CONTROL_CAR_ENERGY"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_ENERGY"
    ]
  },
  {
    "name": "EV_CHARGE_STATE",
    "id": 289410881,
    "hex": "0x11400f41",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3905,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "EvChargeState",
    "version": 2,
    "deprecated": false,
    "description": "Charging state of the car\n\nReturns the current charging state of the car.\n\nIf the vehicle has a target charge percentage other than 100, this property must return\nEvChargeState::STATE_FULLY_CHARGED when the battery charge level has reached the target\nlevel. See EV_CHARGE_PERCENT_LIMIT for more context.",
    "aidlLine": 5256,
    "javaLine": 6081,
    "readPermissions": [
      "PERMISSION_ENERGY"
    ],
    "writePermissions": []
  },
  {
    "name": "EV_CHARGE_SWITCH",
    "id": 287313730,
    "hex": "0x11200f42",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 3906,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Start or stop charging the EV battery\n\nThe setting that the user wants. Setting this property to true starts the battery charging\nand setting to false stops charging.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 5273,
    "javaLine": 6110,
    "readPermissions": [
      "PERMISSION_ENERGY",
      "PERMISSION_CONTROL_CAR_ENERGY"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_CAR_ENERGY"
    ]
  },
  {
    "name": "EV_CHARGE_TIME_REMAINING",
    "id": 289410883,
    "hex": "0x11400f43",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3907,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "SECS",
    "version": 2,
    "deprecated": false,
    "description": "Estimated charge time remaining in seconds\n\nReturns 0 if the vehicle is not charging.",
    "aidlLine": 5290,
    "javaLine": 6138,
    "readPermissions": [
      "PERMISSION_ENERGY"
    ],
    "writePermissions": []
  },
  {
    "name": "EV_REGENERATIVE_BRAKING_STATE",
    "id": 289410884,
    "hex": "0x11400f44",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3908,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "EvRegenerativeBrakingState",
    "version": 2,
    "deprecated": false,
    "description": "Regenerative braking or one-pedal drive setting of the car\n\nReturns the current setting associated with the regenerative braking setting in the car\n\nIf the OEM requires more setting than those provided in EvRegenerativeBrakingState, the\nEV_BRAKE_REGENERATION_LEVEL property can be used instead, which provides a more granular\nway of providing the same information.",
    "aidlLine": 5303,
    "javaLine": 6160,
    "readPermissions": [
      "PERMISSION_ENERGY"
    ],
    "writePermissions": []
  },
  {
    "name": "TRAILER_PRESENT",
    "id": 289410885,
    "hex": "0x11400f45",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3909,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "TrailerState",
    "version": 2,
    "deprecated": false,
    "description": "Indicates if there is a trailer present or not.\n\nReturns the trailer state of the car.",
    "aidlLine": 5320,
    "javaLine": 6217,
    "readPermissions": [
      "PERMISSION_PRIVILEGED_CAR_INFO"
    ],
    "writePermissions": []
  },
  {
    "name": "VEHICLE_CURB_WEIGHT",
    "id": 289410886,
    "hex": "0x11400f46",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3910,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Vehicle’s curb weight in kilograms.\n\nReturns the vehicle's curb weight in kilograms. Curb weight is\nthe total weight of the vehicle with standard equipment and all\nnecessary operating consumables such as motor oil,transmission oil,\nbrake fluid, coolant, air conditioning refrigerant, and weight of\nfuel at nominal tank capacity, while not loaded with either passengers\nor cargo.\n\nconfigArray[0] is used to specify the vehicle’s gross weight in kilograms.\nThe vehicle’s gross weight is the maximum operating weight of the vehicle\nas specified by the manufacturer including the vehicle's chassis, body, engine,\nengine fluids, fuel, accessories, driver, passengers and cargo but excluding\nthat of any trailers.",
    "aidlLine": 5333,
    "javaLine": 6190,
    "readPermissions": [
      "PERMISSION_PRIVILEGED_CAR_INFO"
    ],
    "writePermissions": []
  },
  {
    "name": "GENERAL_SAFETY_REGULATION_COMPLIANCE_REQUIREMENT",
    "id": 289410887,
    "hex": "0x11400f47",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3911,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "GsrComplianceRequirementType",
    "version": 2,
    "deprecated": false,
    "description": "EU's General security regulation compliance requirement.\n\nReturns whether general security regulation compliance is required, if\nso, what type of requirement.",
    "aidlLine": 5356
  },
  {
    "name": "SUPPORTED_PROPERTY_IDS",
    "id": 289476424,
    "hex": "0x11410f48",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32_VEC",
    "ordinal": 3912,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 2,
    "deprecated": true,
    "description": "(Deprecated) List of all supported property IDs.\n\nA list of all supported property IDs (including this property). This property is required for\nHIDL VHAL to work with large amount of vehicle prop configs where the getAllPropConfigs\npayload exceeds the binder limitation. This issue is fixed in AIDL version using\nLargeParcelable in getAllPropConfigs, so this property is deprecated.\n\nIn HIDL VHAL implementation, if the amount of data returned in getAllPropConfigs exceeds the\nbinder limitation, vendor must support this property and return all the supported property\nIDs. Car service will divide this list into smaller sub lists and use getPropConfigs([ids])\nto query the sub lists. The results will be merged together in Car Service.\n\nThe config array for this property must contain one int element which is the number of\nconfigs per getPropConfigs request by Car Service. This number must be small enough so that\neach getPropConfigs payload will not exceed binder limitation, however, a smaller number will\ncause more requests, which increase overhead to fetch all the configs.",
    "aidlLine": 5370
  },
  {
    "name": "SHUTDOWN_REQUEST",
    "id": 289410889,
    "hex": "0x11400f49",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3913,
    "changeMode": "ON_CHANGE",
    "access": "WRITE",
    "accessModes": [
      "WRITE"
    ],
    "dataEnum": "VehicleApPowerStateShutdownParam",
    "version": 2,
    "deprecated": false,
    "description": "Request the head unit to be shutdown.\n\n<p>This is required for executing a task when the head unit is powered off (remote task\nfeature). After the head unit is powered-on to execute the task, the head unit should\nbe shutdown. The head unit will send this message once the task is finished.\n\n<p>This is not for the case when a user wants to shutdown the head unit.\n\n<p>This usually involves telling a separate system outside the head unit (e.g. a power\ncontroller) to prepare shutting down the head unit.\n\n<p>Note that the external system must validate whether this request is valid by checking\nwhether the vehicle is currently in use. If a user enters the vehicle after a\nSHUTDOWN_REQUEST is sent, then the system must ignore this request. It\nis recommended to store a VehicleInUse property in the power controller and exposes it\nthrough VEHICLE_IN_USE property. A shutdown request must be ignored if VehicleInUse is true.\n\n<p>If allowed, the external system will start sending a shutdown signal to the head unit,\nwhich will cause VHAL to send SHUTDOWN_PREPARE message to Android. Android will then start\nthe shut down process by handling the message.\n\n<p>This property is only for issuing a request and only supports writing. Every time this\nproperty value is set, the request to shutdown will be issued no matter what the current\nproperty value is. The current property value is meaningless.\n\n<p>Since this property is write-only, subscribing is not allowed and no property change\nevent will be generated.\n\n<p>The value to set indicates the shutdown option, it must be one of\n{@code VehicleApPowerStateShutdownParam}, e.g.,\nVehicleApPowerStateShutdownParam.SLEEP_IMMEDIATELY. This shutdown option might not be honored\nif the system doesn't support such option. In such case, an error will not be returned.\n\n<p>For configuration information, VehiclePropConfig.configArray must have bit flag combining\nvalues in {@code VehicleApPowerStateConfigFlag} to indicate which shutdown options are\nsupported.\n\n<p>Returns error if failed to send the shutdown request to the other system.",
    "aidlLine": 5395
  },
  {
    "name": "VEHICLE_IN_USE",
    "id": 287313738,
    "hex": "0x11200f4a",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 3914,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Whether the vehicle is currently in use.\n\n<p>In-use means a human user is present and is intended to use the vehicle. This doesn't\nnecessarily means the human user is in the vehicle. For example, if the human user unlocks\nthe vehicle remotely, the vehicle is considered in use.\n\n<p>If this property is supported:\n\n<p>Each time user powers on the vehicle or the system detects the user is present,\nVEHICLE_IN_USE must be set to true. Each time user powers off the vehicle or the system\ndetects the user is not present, VEHICLE_IN_USE must be set to false.\n\n<p>This property is different than AP_POWER_BOOTUP_REASON in the sense that\nAP_POWER_BOOTUP_REASON is only set once during the system bootup. However, this property\nmight change multiple times during a system bootup cycle.\n\n<p>For example, a device is currently not in use. The system bootup to execute a remote task.\nVEHICLE_IN_USE is false. While the remote task is executing, the user enters the vehicle and\npowers on the vehicle. VEHICLE_IN_USE is set to true. After a driving session, user powers\noff the vehicle, VEHICLE_IN_USE is set to false.\n\n<p>This property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 5443
  },
  {
    "name": "CLUSTER_HEARTBEAT",
    "id": 299896651,
    "hex": "0x11e00f4b",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "MIXED",
    "ordinal": 3915,
    "changeMode": "ON_CHANGE",
    "access": "WRITE",
    "accessModes": [
      "WRITE"
    ],
    "version": 3,
    "deprecated": false,
    "description": "Sends the heartbeat signal to ClusterOS.\n\nint64[0]: epochTimeNs\nint64[1]: the visibility of ClusterUI, 0 - invisible, 1 - visible\nbytes: the app specific metadata, this can be empty when ClusterHomeService use the heartbeat\n    to deliver the change of the visibility.",
    "aidlLine": 5476,
    "javaLine": 5821,
    "readPermissions": [],
    "writePermissions": []
  },
  {
    "name": "VEHICLE_DRIVING_AUTOMATION_CURRENT_LEVEL",
    "id": 289410892,
    "hex": "0x11400f4c",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3916,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleAutonomousState",
    "version": 3,
    "deprecated": false,
    "description": "Current state of vehicle autonomy.\n\nDefines the level of autonomy currently engaged in the vehicle from the J3016_202104 revision\nof the SAE standard levels 0-5, with 0 representing no autonomy and 5 representing full\ndriving automation.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of VehicleAutonomousState are supported.",
    "aidlLine": 5491,
    "javaLine": 6268,
    "readPermissions": [
      "PERMISSION_CAR_DRIVING_STATE_3P",
      "PERMISSION_CAR_DRIVING_STATE"
    ],
    "writePermissions": []
  },
  {
    "name": "VEHICLE_DRIVING_AUTOMATION_TARGET_LEVEL",
    "id": 289410895,
    "hex": "0x11400f4f",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 3919,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "VehicleAutonomousState",
    "version": 4,
    "deprecated": false,
    "description": "Target state of vehicle autonomy.\n\nDefines the level of autonomy being targeted by the vehicle from the J3016_202104 revision of\nthe SAE standard levels 0-5, with 0 representing no autonomy and 5 representing full driving\nautomation.\n\nFor example, suppose the vehicle is currently in a Level 3 state of automation and wants to\ngive the driver full manual control (i.e. Level 0) as soon as it's safe to do so. In this\nscenario, this property must be set to VehicleAutonomousState.LEVEL_0. Similarly, if the\nvehicle is currently in Level 1 state of automation and wants to go up to Level 2, this\nproperty must be set to VehicleAutonomousState.LEVEL_2. If the vehicle has already reached\nand is currently in the target level of autonomy, this property must be equal to the value of\nVEHICLE_DRIVING_AUTOMATION_CURRENT_LEVEL.\n\nFor the global area ID (0), the SupportedValuesListResult#supportedValuesList array must be\ndefined unless all states of VehicleAutonomousState are supported. These values must match\nthe values in supportedValuesList of VEHICLE_DRIVING_AUTOMATION_CURRENT_LEVEL.\n\nFor the property that communicates the current state of autonomy, see\nVEHICLE_DRIVING_AUTOMATION_CURRENT_LEVEL.",
    "aidlLine": 5508,
    "javaLine": 6301,
    "readPermissions": [
      "PERMISSION_CAR_DRIVING_STATE"
    ],
    "writePermissions": []
  },
  {
    "name": "CAMERA_SERVICE_CURRENT_STATE",
    "id": 289476429,
    "hex": "0x11410f4d",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32_VEC",
    "ordinal": 3917,
    "changeMode": "ON_CHANGE",
    "access": "WRITE",
    "accessModes": [
      "WRITE"
    ],
    "dataEnum": "CameraServiceState",
    "version": 3,
    "deprecated": false,
    "description": "Reports current state of CarEvsService types.\n\nInforms other components of current state of each CarEvsService service type with values\ndefined in CameraServiceState. CarEvsService will update this property whenever a service\ntype transitions into a new state.\n\nint32[0]: Current state of REARVIEW service type.\nint32[1]: Current state of SURROUNDVIEW service type.\nint32[2]: Current state of FRONTVIEW service type.\nint32[3]: Current state of LEFTVIEW service type.\nint32[4]: Current state of RIGHTVIEW service type.\nint32[5]: Current state of DRIVERVIEW service type.\nint32[6]: Current state of FRONT_PASSENGERVIEW service type.\nint32[7]: Current state of REAR_PASSENGERVIEW service type.",
    "aidlLine": 5537
  },
  {
    "name": "PER_DISPLAY_MAX_BRIGHTNESS",
    "id": 289476430,
    "hex": "0x11410f4e",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32_VEC",
    "ordinal": 3918,
    "changeMode": "STATIC",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "version": 3,
    "deprecated": false,
    "description": "Property to represent max brightness of the displays which are controlled separately.\n\nThis is only used if PER_DISPLAY_BRIGHTNESS is supported.\n\nThe display port uniquely identifies a physical connector on the device\nfor display output, ranging from 0 to 255.\n\nint32Values[0] : display port number\nint32Values[1] : max brightness for display port number specified at int32Values[0]\nint32Values[2] : display port number\nint32Values[3] : max brightness for display port number specified at int32Values[2]\n...",
    "aidlLine": 5561
  },
  {
    "name": "AUTOMATIC_EMERGENCY_BRAKING_ENABLED",
    "id": 287313920,
    "hex": "0x11201000",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 4096,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Enable or disable Automatic Emergency Braking (AEB).\n\nSet true to enable AEB and false to disable AEB. When AEB is enabled, the ADAS system in the\nvehicle should be turned on and monitoring to avoid potential collisions. This property\nshould apply for higher speed applications only. For enabling low speed automatic emergency\nbraking, LOW_SPEED_AUTOMATIC_EMERGENCY_BRAKING_ENABLED should be used.\n\nIn general, AUTOMATIC_EMERGENCY_BRAKING_ENABLED should always return true or false. If the\nfeature is not available due to some temporary state, such as the vehicle speed being too\nlow, that information must be conveyed through the ErrorState values in the\nAUTOMATIC_EMERGENCY_BRAKING_STATE property.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 5588,
    "javaLine": 6347,
    "readPermissions": [
      "PERMISSION_READ_ADAS_SETTINGS",
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ]
  },
  {
    "name": "AUTOMATIC_EMERGENCY_BRAKING_STATE",
    "id": 289411073,
    "hex": "0x11401001",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4097,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "AutomaticEmergencyBrakingState",
    "version": 2,
    "deprecated": false,
    "description": "Automatic Emergency Braking (AEB) state.\n\nReturns the current state of AEB. This property must always return a valid state defined in\nAutomaticEmergencyBrakingState or ErrorState. It must not surface errors through StatusCode\nand must use the supported error states instead. This property should apply for higher speed\napplications only. For representing the state of the low speed automatic emergency braking\nsystem, LOW_SPEED_AUTOMATIC_EMERGENCY_BRAKING_STATE should be used.\n\nIf AEB includes forward collision warnings before activating the brakes, those warnings must\nbe surfaced through the Forward Collision Warning (FCW) properties.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of both AutomaticEmergencyBrakingState (including OTHER, which is not\nrecommended) and ErrorState are supported.",
    "aidlLine": 5612,
    "javaLine": 6382,
    "readPermissions": [
      "PERMISSION_READ_ADAS_STATES"
    ],
    "writePermissions": []
  },
  {
    "name": "FORWARD_COLLISION_WARNING_ENABLED",
    "id": 287313922,
    "hex": "0x11201002",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 4098,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Enable or disable Forward Collision Warning (FCW).\n\nSet true to enable FCW and false to disable FCW. When FCW is enabled, the ADAS system in the\nvehicle should be turned on and monitoring for potential collisions.\n\nIn general, FORWARD_COLLISION_WARNING_ENABLED should always return true or false. If the\nfeature is not available due to some temporary state, such as the vehicle speed being too\nlow, that information must be conveyed through the ErrorState values in the\nFORWARD_COLLISION_WARNING_STATE property.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 5637,
    "javaLine": 6422,
    "readPermissions": [
      "PERMISSION_READ_ADAS_SETTINGS",
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ]
  },
  {
    "name": "FORWARD_COLLISION_WARNING_STATE",
    "id": 289411075,
    "hex": "0x11401003",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4099,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "ForwardCollisionWarningState",
    "version": 2,
    "deprecated": false,
    "description": "Forward Collision Warning (FCW) state.\n\nReturns the current state of FCW. This property must always return a valid state defined in\nForwardCollisionWarningState or ErrorState. It must not surface errors through StatusCode\nand must use the supported error states instead.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of both ForwardCollisionWarningState (including OTHER, which is not\nrecommended) and ErrorState are supported.",
    "aidlLine": 5659,
    "javaLine": 6455,
    "readPermissions": [
      "PERMISSION_READ_ADAS_STATES"
    ],
    "writePermissions": []
  },
  {
    "name": "BLIND_SPOT_WARNING_ENABLED",
    "id": 287313924,
    "hex": "0x11201004",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 4100,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Enable and disable Blind Spot Warning (BSW).\n\nSet true to enable BSW and false to disable BSW. When BSW is enabled, the ADAS system in the\nvehicle should be turned on and monitoring for objects in the vehicle’s blind spots.\n\nIn general, BLIND_SPOT_WARNING_ENABLED should always return true or false. If the feature is\nnot available due to some temporary state, such as the vehicle speed being too low, that\ninformation must be conveyed through the ErrorState values in the BLIND_SPOT_WARNING_STATE\nproperty.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 5679,
    "javaLine": 6490,
    "readPermissions": [
      "PERMISSION_READ_ADAS_SETTINGS",
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ]
  },
  {
    "name": "BLIND_SPOT_WARNING_STATE",
    "id": 339742725,
    "hex": "0x14401005",
    "group": "SYSTEM",
    "area": "MIRROR",
    "type": "INT32",
    "ordinal": 4101,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "BlindSpotWarningState",
    "version": 2,
    "deprecated": false,
    "description": "Blind Spot Warning (BSW) state.\n\nReturns the current state of BSW. This property must always return a valid state defined in\nBlindSpotWarningState or ErrorState. It must not surface errors through StatusCode\nand must use the supported error states instead.\n\nFor each supported area ID, the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of both BlindSpotWarningState (including OTHER, which is not\nrecommended) and ErrorState are supported.",
    "aidlLine": 5701,
    "javaLine": 6524,
    "readPermissions": [
      "PERMISSION_READ_ADAS_STATES"
    ],
    "writePermissions": []
  },
  {
    "name": "LANE_DEPARTURE_WARNING_ENABLED",
    "id": 287313926,
    "hex": "0x11201006",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 4102,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Enable or disable Lane Departure Warning (LDW).\n\nSet true to enable LDW and false to disable LDW. When LDW is enabled, the ADAS system in the\nvehicle should be turned on and monitoring if the vehicle is approaching or crossing lane\nlines, in which case a warning will be given.\n\nIn general, LANE_DEPARTURE_WARNING_ENABLED should always return true or false. If the feature\nis not available due to some temporary state, such as the vehicle speed being too low or too\nhigh, that information must be conveyed through the ErrorState values in the\nLANE_DEPARTURE_WARNING_STATE property.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 5721,
    "javaLine": 6559,
    "readPermissions": [
      "PERMISSION_READ_ADAS_SETTINGS",
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ]
  },
  {
    "name": "LANE_DEPARTURE_WARNING_STATE",
    "id": 289411079,
    "hex": "0x11401007",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4103,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "LaneDepartureWarningState",
    "version": 2,
    "deprecated": false,
    "description": "Lane Departure Warning (LDW) state.\n\nReturns the current state of LDW. This property must always return a valid state defined in\nLaneDepartureWarningState or ErrorState. It must not surface errors through StatusCode\nand must use the supported error states instead.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of both LaneDepartureWarningState (including OTHER, which is not\nrecommended) and ErrorState are supported.",
    "aidlLine": 5744,
    "javaLine": 6593,
    "readPermissions": [
      "PERMISSION_READ_ADAS_STATES"
    ],
    "writePermissions": []
  },
  {
    "name": "LANE_KEEP_ASSIST_ENABLED",
    "id": 287313928,
    "hex": "0x11201008",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 4104,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Enable or disable Lane Keep Assist (LKA).\n\nSet true to enable LKA and false to disable LKA. When LKA is enabled, the ADAS system in the\nvehicle should be turned on and monitoring if the driver unintentionally drifts toward or\nover the lane marking. If an unintentional lane departure is detected, the system applies\nsteering control to return the vehicle into the current lane.\n\nThis is different from Lane Centering Assist (LCA) which, when activated, applies continuous\nsteering control to keep the vehicle centered in the current lane.\n\nIn general, LANE_KEEP_ASSIST_ENABLED should always return true or false. If the feature is\nnot available due to some temporary state, such as the vehicle speed being too low or too\nhigh, that information must be conveyed through the ErrorState values in the\nLANE_KEEP_ASSIST_STATE property.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 5764,
    "javaLine": 6628,
    "readPermissions": [
      "PERMISSION_READ_ADAS_SETTINGS",
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ]
  },
  {
    "name": "LANE_KEEP_ASSIST_STATE",
    "id": 289411081,
    "hex": "0x11401009",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4105,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "LaneKeepAssistState",
    "version": 2,
    "deprecated": false,
    "description": "Lane Keep Assist (LKA) state.\n\nReturns the current state of LKA. This property must always return a valid state defined in\nLaneKeepAssistState or ErrorState. It must not surface errors through StatusCode\nand must use the supported error states instead.\n\nIf LKA includes lane departure warnings before applying steering corrections, those warnings\nmust be surfaced through the Lane Departure Warning (LDW) properties.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of both LaneKeepAssistState (including OTHER, which is not\nrecommended) and ErrorState are supported.",
    "aidlLine": 5791,
    "javaLine": 6666,
    "readPermissions": [
      "PERMISSION_READ_ADAS_STATES"
    ],
    "writePermissions": []
  },
  {
    "name": "LANE_CENTERING_ASSIST_ENABLED",
    "id": 287313930,
    "hex": "0x1120100a",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 4106,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Enable or disable Lane Centering Assist (LCA).\n\nSet true to enable LCA and false to disable LCA. When LCA is enabled, the ADAS system in the\nvehicle should be turned on and waiting for an activation signal from the driver. Once the\nfeature is activated, the ADAS system should be steering the vehicle to keep it centered in\nits current lane.\n\nThis is different from Lane Keep Assist (LKA) which monitors if the driver unintentionally\ndrifts toward or over the lane marking. If an unintentional lane departure is detected, the\nsystem applies steering control to return the vehicle into the current lane.\n\nIn general, LANE_CENTERING_ASSIST_ENABLED should always return true or false. If the feature\nis not available due to some temporary state, such as the vehicle speed being too low or too\nhigh, that information must be conveyed through the ErrorState values in the\nLANE_CENTERING_ASSIST_STATE property.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 5814,
    "javaLine": 6704,
    "readPermissions": [
      "PERMISSION_READ_ADAS_SETTINGS",
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ]
  },
  {
    "name": "LANE_CENTERING_ASSIST_COMMAND",
    "id": 289411083,
    "hex": "0x1140100b",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4107,
    "changeMode": "ON_CHANGE",
    "access": "WRITE",
    "accessModes": [
      "WRITE"
    ],
    "dataEnum": "LaneCenteringAssistCommand",
    "version": 2,
    "deprecated": false,
    "description": "Lane Centering Assist (LCA) commands.\n\nCommands to activate and suspend LCA.\n\nWhen the command ACTIVATE from LaneCenteringAssistCommand is sent,\nLANE_CENTERING_ASSIST_STATE must be set to LaneCenteringAssistState#ACTIVATION_REQUESTED.\nWhen the ACTIVATE command succeeds, LANE_CENTERING_ASSIST_STATE must be set to\nLaneCenteringAssistState#ACTIVATED. When the command DEACTIVATE from\nLaneCenteringAssistCommand succeeds, LANE_CENTERING_ASSIST_STATE must be set to\nLaneCenteringAssistState#ENABLED.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues must be defined unless\nall enum values of LaneCenteringAssistCommand are supported.\n\nWhen this property is not available because LCA is disabled (i.e.\nLANE_CENTERING_ASSIST_ENABLED is false), this property must return\nStatusCode#NOT_AVAILABLE_DISABLED. If LANE_CENTERING_ASSIST_STATE is implemented and the\nstate is set to an ErrorState value, then this property must return a StatusCode that aligns\nwith the ErrorState value. For example, if LANE_CENTERING_ASSIST_STATE is set to\nErrorState#NOT_AVAILABLE_SPEED_LOW, then this property must return\nStatusCode#NOT_AVAILABLE_SPEED_LOW.",
    "aidlLine": 5842,
    "javaLine": 6743,
    "readPermissions": [],
    "writePermissions": [
      "PERMISSION_CONTROL_ADAS_STATES"
    ]
  },
  {
    "name": "LANE_CENTERING_ASSIST_STATE",
    "id": 289411084,
    "hex": "0x1140100c",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4108,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "LaneCenteringAssistState",
    "version": 2,
    "deprecated": false,
    "description": "Lane Centering Assist (LCA) state.\n\nReturns the current state of LCA. This property must always return a valid state defined in\nLaneCenteringAssistState or ErrorState. It must not surface errors through StatusCode\nand must use the supported error states instead.\n\nIf LCA includes lane departure warnings, those warnings must be surfaced through the Lane\nDeparture Warning (LDW) properties.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of both LaneCenteringAssistState (including OTHER, which is not\nrecommended) and ErrorState are supported.",
    "aidlLine": 5873,
    "javaLine": 6786,
    "readPermissions": [
      "PERMISSION_READ_ADAS_STATES"
    ],
    "writePermissions": []
  },
  {
    "name": "EMERGENCY_LANE_KEEP_ASSIST_ENABLED",
    "id": 287313933,
    "hex": "0x1120100d",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 4109,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Enable or disable Emergency Lane Keep Assist (ELKA).\n\nSet true to enable ELKA and false to disable ELKA. When ELKA is enabled, the ADAS system in\nthe vehicle should be on and monitoring for unsafe lane changes by the driver. When an unsafe\nmaneuver is detected, ELKA alerts the driver and applies steering corrections to keep the\nvehicle in its original lane.\n\nIn general, EMERGENCY_LANE_KEEP_ASSIST_ENABLED should always return true or false. If the\nfeature is not available due to some temporary state, such as the vehicle speed being too\nlow, that information must be conveyed through the ErrorState values in the\nEMERGENCY_LANE_KEEP_ASSIST_STATE property.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 5896,
    "javaLine": 6824,
    "readPermissions": [
      "PERMISSION_READ_ADAS_SETTINGS",
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ]
  },
  {
    "name": "EMERGENCY_LANE_KEEP_ASSIST_STATE",
    "id": 289411086,
    "hex": "0x1140100e",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4110,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "EmergencyLaneKeepAssistState",
    "version": 2,
    "deprecated": false,
    "description": "Emergency Lane Keep Assist (ELKA) state.\n\nReturns the current state of ELKA. Generally, this property should return a valid state\ndefined in the EmergencyLaneKeepAssistState or ErrorState. For example, if the feature is not\navailable due to some temporary state, that information should be conveyed through\nErrorState.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of EmergencyLaneKeepAssistState (including OTHER, which is not recommended)\nand ErrorState are supported.",
    "aidlLine": 5920,
    "javaLine": 6859,
    "readPermissions": [
      "PERMISSION_READ_ADAS_STATES"
    ],
    "writePermissions": []
  },
  {
    "name": "CRUISE_CONTROL_ENABLED",
    "id": 287313935,
    "hex": "0x1120100f",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 4111,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Enable or disable cruise control (CC).\n\nSet true to enable CC and false to disable CC. This property is shared by all forms of\nCruiseControlType(s).\n\nWhen CC is enabled, the ADAS system in the vehicle should be turned on and responding to\ncommands.\n\nIn general, CRUISE_CONTROL_ENABLED should always return true or false. If the feature is not\navailable due to some temporary state, such as the vehicle speed being too low, that\ninformation must be conveyed through the ErrorState values in the CRUISE_CONTROL_STATE\nproperty.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 5941,
    "javaLine": 6896,
    "readPermissions": [
      "PERMISSION_READ_ADAS_SETTINGS",
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ]
  },
  {
    "name": "CRUISE_CONTROL_TYPE",
    "id": 289411088,
    "hex": "0x11401010",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4112,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "dataEnum": "CruiseControlType",
    "version": 2,
    "deprecated": false,
    "description": "Current type of Cruise Control (CC).\n\nWhen CRUISE_CONTROL_ENABLED is true, this property returns the type of CC that is currently\nenabled (for example, standard CC, adaptive CC, predictive CC, etc.). Generally, this\nproperty should return a valid state defined in the CruiseControlType or ErrorState. For\nexample, if the feature is not available due to some temporary state, that information should\nbe conveyed through ErrorState.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of CruiseControlType (including OTHER, which is not recommended) and\nErrorState are supported.\n\nTrying to write CruiseControlType#OTHER or an ErrorState to this property will throw an\nIllegalArgumentException.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 5966,
    "javaLine": 6932,
    "readPermissions": [
      "PERMISSION_READ_ADAS_STATES",
      "PERMISSION_CONTROL_ADAS_STATES"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_ADAS_STATES"
    ]
  },
  {
    "name": "CRUISE_CONTROL_STATE",
    "id": 289411089,
    "hex": "0x11401011",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4113,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "CruiseControlState",
    "version": 2,
    "deprecated": false,
    "description": "Current state of Cruise Control (CC).\n\nThis property returns the current state of CC. Generally, this property should return a valid\nstate defined in the CruiseControlState or ErrorState. For example, if the feature is not\navailable due to some temporary state, that information should be conveyed through\nErrorState.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of CruiseControlState (including OTHER, which is not recommended) and\nErrorState are supported.",
    "aidlLine": 5995,
    "javaLine": 6980,
    "readPermissions": [
      "PERMISSION_READ_ADAS_STATES"
    ],
    "writePermissions": []
  },
  {
    "name": "CRUISE_CONTROL_COMMAND",
    "id": 289411090,
    "hex": "0x11401012",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4114,
    "changeMode": "ON_CHANGE",
    "access": "WRITE",
    "accessModes": [
      "WRITE"
    ],
    "dataEnum": "CruiseControlCommand",
    "version": 2,
    "deprecated": false,
    "description": "Write Cruise Control (CC) commands.\n\nSee CruiseControlCommand for the details about each supported command.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of CruiseControlState are supported. Any unsupported commands sent through\nthis property must return StatusCode#INVALID_ARG.\n\nWhen this property is not available because CC is disabled (i.e. CRUISE_CONTROL_ENABLED is\nfalse), this property must return StatusCode#NOT_AVAILABLE_DISABLED. If CRUISE_CONTROL_STATE\nis implemented and the state is set to an ErrorState value, then this property must return a\nStatusCode that aligns with the ErrorState value. For example, if CRUISE_CONTROL_STATE is set\nto ErrorState#NOT_AVAILABLE_SPEED_LOW, then this property must return\nStatusCode#NOT_AVAILABLE_SPEED_LOW.",
    "aidlLine": 6016,
    "javaLine": 7017,
    "readPermissions": [],
    "writePermissions": [
      "PERMISSION_CONTROL_ADAS_STATES"
    ]
  },
  {
    "name": "CRUISE_CONTROL_TARGET_SPEED",
    "id": 291508243,
    "hex": "0x11601013",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "FLOAT",
    "ordinal": 4115,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "METER_PER_SEC",
    "version": 2,
    "deprecated": false,
    "description": "Current target speed for Cruise Control (CC).\n\nOEMs should set the minFloatValue and maxFloatValue values for this property to define the\nmin and max target speed values. These values must be non-negative.\n\nThe maxFloatValue represents the upper bound of the target speed.\nThe minFloatValue represents the lower bound of the target speed.\n\nWhen this property is not available because CC is disabled (i.e. CRUISE_CONTROL_ENABLED is\nfalse), this property must return StatusCode#NOT_AVAILABLE_DISABLED. If CRUISE_CONTROL_STATE\nis implemented and the state is set to an ErrorState value, then this property must return a\nStatusCode that aligns with the ErrorState value. For example, if CRUISE_CONTROL_STATE is set\nto ErrorState#NOT_AVAILABLE_SPEED_LOW, then this property must return\nStatusCode#NOT_AVAILABLE_SPEED_LOW.",
    "aidlLine": 6040,
    "javaLine": 7053,
    "readPermissions": [
      "PERMISSION_READ_ADAS_STATES"
    ],
    "writePermissions": []
  },
  {
    "name": "ADAPTIVE_CRUISE_CONTROL_TARGET_TIME_GAP",
    "id": 289411092,
    "hex": "0x11401014",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4116,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "unit": "MILLI_SECS",
    "version": 2,
    "deprecated": false,
    "description": "Current target time gap for Adaptive Cruise Control (ACC) or Predictive Cruise Control in\nmilliseconds.\n\nThis property should specify the target time gap to a leading vehicle. This gap is defined as\nthe time to travel the distance between the leading vehicle's rear-most point to the ACC\nvehicle's front-most point. The actual time gap from a leading vehicle can be above or below\nthis value.\n\nThe possible values to set for the target time gap should be specified in configArray in\nascending order. All values must be positive. If the property is writable, all values must be\nwritable.\n\nWhen this property is not available because CC is disabled (i.e. CRUISE_CONTROL_ENABLED is\nfalse), this property must return StatusCode#NOT_AVAILABLE_DISABLED. If CRUISE_CONTROL_STATE\nis implemented and the state is set to an ErrorState value, then this property must return a\nStatusCode that aligns with the ErrorState value. For example, if CRUISE_CONTROL_STATE is set\nto ErrorState#NOT_AVAILABLE_SPEED_LOW, then this property must return\nStatusCode#NOT_AVAILABLE_SPEED_LOW.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 6064,
    "javaLine": 7088,
    "readPermissions": [
      "PERMISSION_READ_ADAS_STATES",
      "PERMISSION_CONTROL_ADAS_STATES"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_ADAS_STATES"
    ]
  },
  {
    "name": "ADAPTIVE_CRUISE_CONTROL_LEAD_VEHICLE_MEASURED_DISTANCE",
    "id": 289411093,
    "hex": "0x11401015",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4117,
    "changeMode": "CONTINUOUS",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "unit": "MILLIMETER",
    "version": 2,
    "deprecated": false,
    "description": "Measured distance from leading vehicle when using Adaptive Cruise Control (ACC) or\nPredictive Cruise Control.\n\nReturns the measured distance in millimeters between the rear-most point of the leading\nvehicle and the front-most point of the ACC vehicle.\n\nThe maxInt32Value and minInt32Value in VehicleAreaConfig must be defined.\nThe minInt32Value should be 0.\nThe maxInt32Value should be populated with the maximum range the distance sensor can support.\nThis value should be non-negative.\n\nWhen no lead vehicle is detected (that is, when there is no leading vehicle or the leading\nvehicle is too far away for the sensor to detect), this property should return\nStatusCode.NOT_AVAILABLE.\n\nWhen this property is not available because CC is disabled (i.e. CRUISE_CONTROL_ENABLED is\nfalse), this property must return StatusCode#NOT_AVAILABLE_DISABLED. If CRUISE_CONTROL_STATE\nis implemented and the state is set to an ErrorState value, then this property must return a\nStatusCode that aligns with the ErrorState value. For example, if CRUISE_CONTROL_STATE is set\nto ErrorState#NOT_AVAILABLE_SPEED_LOW, then this property must return\nStatusCode#NOT_AVAILABLE_SPEED_LOW.",
    "aidlLine": 6096,
    "javaLine": 7129,
    "readPermissions": [
      "PERMISSION_READ_ADAS_STATES"
    ],
    "writePermissions": []
  },
  {
    "name": "HANDS_ON_DETECTION_ENABLED",
    "id": 287313942,
    "hex": "0x11201016",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 4118,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 2,
    "deprecated": false,
    "description": "Enable or disable Hands On Detection (HOD).\n\nSet true to enable HOD and false to disable HOD. When HOD is enabled, a system inside the\nvehicle should be monitoring the presence of the driver's hands on the steering wheel and\nsend a warning if it detects that the driver's hands are no longer on the steering wheel.\n\nIn general, HANDS_ON_DETECTION_ENABLED should always return true or false. If the feature is\nnot available due to some temporary state, that information must be conveyed through the\nErrorState values in the HANDS_ON_DETECTION_STATE property.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 6127,
    "javaLine": 7167,
    "readPermissions": [
      "PERMISSION_READ_DRIVER_MONITORING_SETTINGS",
      "PERMISSION_CONTROL_DRIVER_MONITORING_SETTINGS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_DRIVER_MONITORING_SETTINGS"
    ]
  },
  {
    "name": "HANDS_ON_DETECTION_DRIVER_STATE",
    "id": 289411095,
    "hex": "0x11401017",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4119,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "HandsOnDetectionDriverState",
    "version": 2,
    "deprecated": false,
    "description": "Hands On Detection (HOD) driver state.\n\nReturns whether the driver's hands are on the steering wheel. Generally, this property should\nreturn a valid state defined in the HandsOnDetectionDriverState or ErrorState. For example,\nif the feature is not available due to some temporary state, that information should be\nconveyed through ErrorState.\n\nIf the vehicle wants to send a warning to the user because the driver's hands have been off\nthe steering wheel for too long, the warning should be surfaced through\nHANDS_ON_DETECTION_WARNING.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of both HandsOnDetectionDriverState (including OTHER, which is not\nrecommended) and ErrorState are supported.",
    "aidlLine": 6149,
    "javaLine": 7204,
    "readPermissions": [
      "PERMISSION_READ_DRIVER_MONITORING_STATES"
    ],
    "writePermissions": []
  },
  {
    "name": "HANDS_ON_DETECTION_WARNING",
    "id": 289411096,
    "hex": "0x11401018",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4120,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "HandsOnDetectionWarning",
    "version": 2,
    "deprecated": false,
    "description": "Hands On Detection (HOD) warning.\n\nReturns whether a warning is being sent to the driver for having their hands off the wheel\nfor too long a duration.\n\nGenerally, this property should return a valid state defined in HandsOnDetectionWarning or\nErrorState. For example, if the feature is not available due to some temporary state, that\ninformation should be conveyed through an ErrorState.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of both HandsOnDetectionWarning (including OTHER, which is not recommended)\nand ErrorState are supported.",
    "aidlLine": 6174,
    "javaLine": 7245,
    "readPermissions": [
      "PERMISSION_READ_DRIVER_MONITORING_STATES"
    ],
    "writePermissions": []
  },
  {
    "name": "DRIVER_DROWSINESS_ATTENTION_SYSTEM_ENABLED",
    "id": 287313945,
    "hex": "0x11201019",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 4121,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 3,
    "deprecated": false,
    "description": "Enable or disable driver drowsiness and attention monitoring.\n\nSet true to enable driver drowsiness and attention monitoring and false to disable driver\ndrowsiness and attention monitoring. When driver drowsiness and attention monitoring is\nenabled, a system inside the vehicle should be monitoring the drowsiness and attention level\nof the driver and warn the driver if needed.\n\nIn general, DRIVER_DROWSINESS_ATTENTION_SYSTEM_ENABLED should always return true or false.\nIf the feature is not available due to some temporary state, that information must be\nconveyed through the ErrorState values in the DRIVER_DROWSINESS_ATTENTION_STATE property.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 6197,
    "javaLine": 7285,
    "readPermissions": [
      "PERMISSION_READ_DRIVER_MONITORING_SETTINGS",
      "PERMISSION_CONTROL_DRIVER_MONITORING_SETTINGS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_DRIVER_MONITORING_SETTINGS"
    ]
  },
  {
    "name": "DRIVER_DROWSINESS_ATTENTION_STATE",
    "id": 289411098,
    "hex": "0x1140101a",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4122,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "DriverDrowsinessAttentionState",
    "version": 3,
    "deprecated": false,
    "description": "Driver drowsiness and attention level state.\n\nReturns the current detected state of driver drowiness and attention level based on the\nKarolinska Sleepiness scale. If alternative measurement methods are used, the value should be\ntranslated to the Karolinska Sleepiness Scale equivalent.\n\nGenerally, this property should return a valid state defined in the\nDriverDrowsinessAttentionState or ErrorState. For example, if the feature is not available\ndue to some temporary state, that information should be conveyed through ErrorState.\n\nIf the vehicle is sending a warning to the user because the driver is too drowsy, the warning\nshould be surfaced through {@link #DRIVER_DROWSINESS_ATTENTION_WARNING}.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of both DriverDrowsinessAttentionState (including OTHER, which is not\nrecommended) and ErrorState are supported.",
    "aidlLine": 6220,
    "javaLine": 7319,
    "readPermissions": [
      "PERMISSION_READ_DRIVER_MONITORING_STATES"
    ],
    "writePermissions": []
  },
  {
    "name": "DRIVER_DROWSINESS_ATTENTION_WARNING_ENABLED",
    "id": 287313947,
    "hex": "0x1120101b",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 4123,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 3,
    "deprecated": false,
    "description": "Enable or disable driver drowsiness and attention warnings.\n\nSet true to enable driver drowsiness and attention warnings and false to disable driver\ndrowsiness and attention warnings.\n\nWhen driver drowsiness and attention warnings are enabled, the driver drowsiness and\nattention monitoring system inside the vehicle should warn the driver when it detects the\ndriver is drowsy or not attentive.\n\nIn general, DRIVER_DROWSINESS_ATTENTION_WARNING_ENABLED should always return true or false.\nIf the feature is not available due to some temporary state, that information must be\nconveyed through the ErrorState values in the DRIVER_DROWSINESS_ATTENTION_WARNING property.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 6247,
    "javaLine": 7362,
    "readPermissions": [
      "PERMISSION_READ_DRIVER_MONITORING_SETTINGS",
      "PERMISSION_CONTROL_DRIVER_MONITORING_SETTINGS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_DRIVER_MONITORING_SETTINGS"
    ]
  },
  {
    "name": "DRIVER_DROWSINESS_ATTENTION_WARNING",
    "id": 289411100,
    "hex": "0x1140101c",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4124,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "DriverDrowsinessAttentionWarning",
    "version": 3,
    "deprecated": false,
    "description": "Driver drowsiness and attention warning.\n\nReturns whether a warning is being sent to the driver for being drowsy or not attentive.\n\nGenerally, this property should return a valid state defined in\nDriverDrowsinessAttentionWarning or ErrorState. For example, if the feature is not available\ndue to some temporary state, that information should be conveyed through an ErrorState.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of both DriverDrowsinessAttentionWarning (including OTHER, which is not\nrecommended) and ErrorState are supported.",
    "aidlLine": 6272,
    "javaLine": 7396,
    "readPermissions": [
      "PERMISSION_READ_DRIVER_MONITORING_STATES"
    ],
    "writePermissions": []
  },
  {
    "name": "DRIVER_DISTRACTION_SYSTEM_ENABLED",
    "id": 287313949,
    "hex": "0x1120101d",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 4125,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 3,
    "deprecated": false,
    "description": "Enable or disable driver distraction monitoring.\n\nSet true to enable driver distraction monitoring and false to disable driver\ndistraction monitoring. When driver distraction monitoring is enabled, a system\ninside the vehicle should be monitoring the distraction level of the driver and\nwarn the driver if needed.\n\nIn general, DRIVER_DISTRACTION_SYSTEM_ENABLED should always return true or false. If the\nfeature is not available due to some temporary state, that information must be conveyed\nthrough the ErrorState values in the DRIVER_DISTRACTION_STATE property.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 6294,
    "javaLine": 7435,
    "readPermissions": [
      "PERMISSION_READ_DRIVER_MONITORING_SETTINGS",
      "PERMISSION_CONTROL_DRIVER_MONITORING_SETTINGS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_DRIVER_MONITORING_SETTINGS"
    ]
  },
  {
    "name": "DRIVER_DISTRACTION_STATE",
    "id": 289411102,
    "hex": "0x1140101e",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4126,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "DriverDistractionState",
    "version": 3,
    "deprecated": false,
    "description": "Driver distraction state.\n\nReturns the current detected driver distraction state.\n\nGenerally, this property should return a valid state defined in the DriverDistractionState or\nErrorState. For example, if the feature is not available due to some temporary state, that\ninformation should be conveyed through ErrorState.\n\nIf the vehicle is sending a warning to the user because the driver is too distracted, the\nwarning should be surfaced through {@link #DRIVER_DISTRACTION_WARNING}.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of both DriverDistractionState (including OTHER, which is not\nrecommended) and ErrorState are supported.",
    "aidlLine": 6317,
    "javaLine": 7468,
    "readPermissions": [
      "PERMISSION_READ_DRIVER_MONITORING_STATES"
    ],
    "writePermissions": []
  },
  {
    "name": "DRIVER_DISTRACTION_WARNING_ENABLED",
    "id": 287313951,
    "hex": "0x1120101f",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 4127,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 3,
    "deprecated": false,
    "description": "Enable or disable driver distraction warnings.\n\nSet true to enable driver distraction warnings and false to disable driver distraction\nwarnings.\n\nWhen driver distraction warnings are enabled, the driver distraction monitoring system inside\nthe vehicle should warn the driver when it detects the driver is distracted.\n\nIn general, DRIVER_DISTRACTION_WARNING_ENABLED should always return true or false. If the\nfeature is not available due to some temporary state, that information must be conveyed\nthrough the ErrorState values in the DRIVER_DISTRACTION_WARNING property.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 6342,
    "javaLine": 7510,
    "readPermissions": [
      "PERMISSION_READ_DRIVER_MONITORING_SETTINGS",
      "PERMISSION_CONTROL_DRIVER_MONITORING_SETTINGS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_DRIVER_MONITORING_SETTINGS"
    ]
  },
  {
    "name": "DRIVER_DISTRACTION_WARNING",
    "id": 289411104,
    "hex": "0x11401020",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4128,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "DriverDistractionWarning",
    "version": 3,
    "deprecated": false,
    "description": "Driver distraction warning.\n\nReturns whether a warning is being sent to the driver for being distracted.\n\nGenerally, this property should return a valid state defined in DriverDistractionWarning or\nErrorState. For example, if the feature is not available due to some temporary state, that\ninformation should be conveyed through an ErrorState.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of both DriverDistractionWarning (including OTHER, which is not\nrecommended) and ErrorState are supported.",
    "aidlLine": 6366,
    "javaLine": 7543,
    "readPermissions": [
      "PERMISSION_READ_DRIVER_MONITORING_STATES"
    ],
    "writePermissions": []
  },
  {
    "name": "LOW_SPEED_COLLISION_WARNING_ENABLED",
    "id": 287313953,
    "hex": "0x11201021",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 4129,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 3,
    "deprecated": false,
    "description": "Enable or disable Low Speed Collision Warning.\n\nSet true to enable low speed collision warning and false to disable low speed collision\nwarning. When low speed collision warning is enabled, the ADAS system in the vehicle should\nwarn the driver of potential collisions at low speeds. This property is different from the\npre-existing FORWARD_COLLISION_WARNING_ENABLED, which should apply to higher speed\napplications only. If the vehicle doesn't have a separate collision detection system for low\nspeed environments, this property should not be implemented.\n\nIn general, LOW_SPEED_COLLISION_WARNING_ENABLED should always return true or false. If the\nfeature is not available due to some temporary state, such as the vehicle speed being too\nhigh, that information must be conveyed through the ErrorState values in the\nLOW_SPEED_COLLISION_WARNING_STATE property.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 6388,
    "javaLine": 7581,
    "readPermissions": [
      "PERMISSION_READ_ADAS_SETTINGS",
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ]
  },
  {
    "name": "LOW_SPEED_COLLISION_WARNING_STATE",
    "id": 289411106,
    "hex": "0x11401022",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4130,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "LowSpeedCollisionWarningState",
    "version": 3,
    "deprecated": false,
    "description": "Low Speed Collision Warning state.\n\nReturns the current state of Low Speed Collision Warning. This property must always return a\nvalid state defined in LowSpeedCollisionWarningState or ErrorState. It must not surface\nerrors through StatusCode and must use the supported error states instead. This property is\ndifferent from the pre-existing FORWARD_COLLISION_WARNING_STATE, which should apply to higher\nspeed applications only. If the vehicle doesn't have a separate collision detection system\nfor low speed environments, this property should not be implemented.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of both LowSpeedCollisionWarningState (including OTHER, which is not\nrecommended) and ErrorState are supported.",
    "aidlLine": 6414,
    "javaLine": 7618,
    "readPermissions": [
      "PERMISSION_READ_ADAS_STATES"
    ],
    "writePermissions": []
  },
  {
    "name": "CROSS_TRAFFIC_MONITORING_ENABLED",
    "id": 287313955,
    "hex": "0x11201023",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 4131,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 3,
    "deprecated": false,
    "description": "Enable or disable Cross Traffic Monitoring.\n\nSet true to enable Cross Traffic Monitoring and false to disable Cross Traffic Monitoring.\nWhen Cross Traffic Monitoring is enabled, the ADAS system in the vehicle should be turned on\nand monitoring for potential sideways collisions.\n\nIn general, CROSS_TRAFFIC_MONITORING_ENABLED should always return true or false. If the\nfeature is not available due to some temporary state, such as the vehicle speed being too\nhigh, that information must be conveyed through the ErrorState values in the\nCROSS_TRAFFIC_MONITORING_STATE property.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 6437,
    "javaLine": 7656,
    "readPermissions": [
      "PERMISSION_READ_ADAS_SETTINGS",
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ]
  },
  {
    "name": "CROSS_TRAFFIC_MONITORING_WARNING_STATE",
    "id": 289411108,
    "hex": "0x11401024",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4132,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "CrossTrafficMonitoringWarningState",
    "version": 3,
    "deprecated": false,
    "description": "Cross Traffic Monitoring warning state.\n\nReturns the current state of Cross Traffic Monitoring Warning. This property must always\nreturn a valid state defined in CrossTrafficMonitoringWarningState or ErrorState. It must not\nsurface errors through StatusCode and must use the supported error states instead.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of both CrossTrafficMonitoringWarningState (including OTHER, which is not\nrecommended) and ErrorState are supported.",
    "aidlLine": 6460,
    "javaLine": 7690,
    "readPermissions": [
      "PERMISSION_READ_ADAS_STATES"
    ],
    "writePermissions": []
  },
  {
    "name": "LOW_SPEED_AUTOMATIC_EMERGENCY_BRAKING_ENABLED",
    "id": 287313957,
    "hex": "0x11201025",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "BOOLEAN",
    "ordinal": 4133,
    "changeMode": "ON_CHANGE",
    "access": "READ_WRITE",
    "accessModes": [
      "READ_WRITE",
      "READ"
    ],
    "version": 3,
    "deprecated": false,
    "description": "Enable or disable Low Speed Automatic Emergency Braking.\n\nSet true to enable Low Speed Automatic Emergency Braking or false to disable Low Speed\nAutomatic Emergency Braking. When Low Speed Automatic Emergency Braking is enabled, the ADAS\nsystem in the vehicle should be turned on and monitoring to avoid potential collisions in low\nspeed conditions. This property is different from the pre-existing\nAUTOMATIC_EMERGENCY_BRAKING_ENABLED, which should apply to higher speed applications only. If\nthe vehicle doesn't have a separate collision avoidance system for low speed environments,\nthis property should not be implemented.\n\nIn general, LOW_SPEED_AUTOMATIC_EMERGENCY_BRAKING_ENABLED should always return true or false.\nIf the feature is not available due to some temporary state, such as the vehicle speed being\ntoo low, that information must be conveyed through the ErrorState values in the\nLOW_SPEED_AUTOMATIC_EMERGENCY_BRAKING_STATE property.\n\nThis property is defined as VehiclePropertyAccess.READ_WRITE, but OEMs have the option to\nimplement it as VehiclePropertyAccess.READ only.",
    "aidlLine": 6480,
    "javaLine": 7726,
    "readPermissions": [
      "PERMISSION_READ_ADAS_SETTINGS",
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ],
    "writePermissions": [
      "PERMISSION_CONTROL_ADAS_SETTINGS"
    ]
  },
  {
    "name": "LOW_SPEED_AUTOMATIC_EMERGENCY_BRAKING_STATE",
    "id": 289411110,
    "hex": "0x11401026",
    "group": "SYSTEM",
    "area": "GLOBAL",
    "type": "INT32",
    "ordinal": 4134,
    "changeMode": "ON_CHANGE",
    "access": "READ",
    "accessModes": [
      "READ"
    ],
    "dataEnum": "LowSpeedAutomaticEmergencyBrakingState",
    "version": 3,
    "deprecated": false,
    "description": "Low Speed Automatic Emergency Braking state.\n\nReturns the current state of Low Speed Automatic Emergency Braking. This property must always\nreturn a valid state defined in LowSpeedAutomaticEmergencyBrakingState or ErrorState. It must\nnot surface errors through StatusCode and must use the supported error states instead. This\nproperty is different from the pre-existing AUTOMATIC_EMERGENCY_BRAKING_STATE, which should\napply to higher speed applications only. If the vehicle doesn't have a separate collision\navoidance system for low speed environments, this property should not be implemented.\n\nIf Low Speed Automatic Emergency Braking includes collision warnings before activating the\nbrakes, those warnings must be surfaced through use of LOW_SPEED_COLLISION_WARNING_ENABLED\nand LOW_SPEED_COLLISION_WARNING_STATE.\n\nFor the global area ID (0), the VehicleAreaConfig#supportedEnumValues array must be defined\nunless all states of both LowSpeedAutomaticEmergencyBrakingState (including OTHER, which is\nnot recommended) and ErrorState are supported.",
    "aidlLine": 6507,
    "javaLine": 7764,
    "readPermissions": [
      "PERMISSION_READ_ADAS_STATES"
    ],
    "writePermissions": []
  }
]

export const propertyByName = new Map(vehicleProperties.map((p) => [p.name, p]))
