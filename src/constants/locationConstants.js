import * as cc from "./creatureConstants";
import * as utils from "../utils";

export const POINT_OF_INTEREST_RADIUS = 20;
export const BASE_VISION_IN_M = 10000;
export const BASE_TRAVEL_DISTANCE_PER_HOUR_IN_M = 2500;
export const MAXIMUM_SEQUENTIAL_EXPLORATION_HOURS = 8;
export const BASE_PX_IN_M_SCALE = 50;

export const DEFAULT_CONTEXT_NAME = "Normal";

export const GetNewLocation = (owner, exteriorLocationId) => ({
  _id: utils.reverseString(owner),
  owner: null,
  name: null,
  isHidden: false,
  exteriorLocationId,
  size: LOCATION_SIZES.POINT_OF_INTEREST,
  traversal: {
    type: null,
    irregularTerrainFrequency: IRREGULAR_TERRAIN_FREQUENCIES.LOW,
    elements: [],
  },
  interaction: {
    type: null,
    height: null,
    isHazardous: false,
    rarity: null,
    currentCreatures: null,
    rooms: [],
  },
  reference: {
    connectionSeed: null,
    distance: null,
    direction: null,
    location: null,
    connectionType: null,
    connectionAngle: null,
    connectionAngleOrigin: null,
    connectionDescription: null,
    connectionDepth: null,
  },
  connections: [],
  contexts: [
    {
      isCurrent: true,
      name: DEFAULT_CONTEXT_NAME,
      firstImpressions: null,
      details: null,
      precipitationFrequency: null,
      intenseTemperatureFrequency: null,
      panoramicVision: PANORAMIC_VISIONS.MEDIUM,
      hazardousness: HAZARDOUSNESS.MEDIUM,
      resourceEasiness: RESOURCE_EASINESS.NORMAL,
    },
  ],
  creatures: [],
  boundCreatures: [],
});

export const LOCATION_SIZES = {
  POINT_OF_INTEREST: 10,
  SMALL: 20,
  SMALL1: 21,
  SMALL2: 22,
  SMALL3: 23,
  SMALL4: 24,
  SMALL5: 25,
  SMALL6: 26,
  SMALL7: 27,
  SMALL8: 28,
  SMALL9: 29,
  MEDIUM: 30,
  MEDIUM1: 31,
  MEDIUM2: 32,
  MEDIUM3: 33,
  MEDIUM4: 34,
  MEDIUM5: 35,
  MEDIUM6: 36,
  MEDIUM7: 37,
  MEDIUM8: 38,
  MEDIUM9: 39,
  LARGE: 40,
  LARGE1: 41,
  LARGE2: 42,
  LARGE3: 43,
  LARGE4: 44,
  LARGE5: 45,
  LARGE6: 46,
  LARGE7: 47,
  LARGE8: 48,
  LARGE9: 49,
  EXTREME: 50,
  EXTREME2: 60,
  EXTREME3: 70,
};
export const locationSizes = [
  { display: "Ponto de Interesse", value: LOCATION_SIZES.POINT_OF_INTEREST, baseRadiusMultiplier: 0 },
  { display: "Pequeno", newSection: true, value: LOCATION_SIZES.SMALL, baseRadiusMultiplier: 1 },
  { display: "Pequeno", value: LOCATION_SIZES.SMALL1, baseRadiusMultiplier: 1.1 },
  { display: "Pequeno", value: LOCATION_SIZES.SMALL2, baseRadiusMultiplier: 1.2 },
  { display: "Pequeno", value: LOCATION_SIZES.SMALL3, baseRadiusMultiplier: 1.3 },
  { display: "Pequeno", value: LOCATION_SIZES.SMALL4, baseRadiusMultiplier: 1.4 },
  { display: "Pequeno", value: LOCATION_SIZES.SMALL5, baseRadiusMultiplier: 1.5 },
  { display: "Pequeno", value: LOCATION_SIZES.SMALL6, baseRadiusMultiplier: 1.6 },
  { display: "Pequeno", value: LOCATION_SIZES.SMALL7, baseRadiusMultiplier: 1.7 },
  { display: "Pequeno", value: LOCATION_SIZES.SMALL8, baseRadiusMultiplier: 1.8 },
  { display: "Pequeno", value: LOCATION_SIZES.SMALL9, baseRadiusMultiplier: 1.9 },
  { display: "Médio", newSection: true, value: LOCATION_SIZES.MEDIUM, baseRadiusMultiplier: 2 },
  { display: "Médio", value: LOCATION_SIZES.MEDIUM1, baseRadiusMultiplier: 2.1 },
  { display: "Médio", value: LOCATION_SIZES.MEDIUM2, baseRadiusMultiplier: 2.2 },
  { display: "Médio", value: LOCATION_SIZES.MEDIUM3, baseRadiusMultiplier: 2.3 },
  { display: "Médio", value: LOCATION_SIZES.MEDIUM4, baseRadiusMultiplier: 2.4 },
  { display: "Médio", value: LOCATION_SIZES.MEDIUM5, baseRadiusMultiplier: 2.5 },
  { display: "Médio", value: LOCATION_SIZES.MEDIUM6, baseRadiusMultiplier: 2.6 },
  { display: "Médio", value: LOCATION_SIZES.MEDIUM7, baseRadiusMultiplier: 2.7 },
  { display: "Médio", value: LOCATION_SIZES.MEDIUM8, baseRadiusMultiplier: 2.8 },
  { display: "Médio", value: LOCATION_SIZES.MEDIUM9, baseRadiusMultiplier: 2.9 },
  { display: "Grande", newSection: true, value: LOCATION_SIZES.LARGE, baseRadiusMultiplier: 3 },
  { display: "Grande", value: LOCATION_SIZES.LARGE1, baseRadiusMultiplier: 3.1 },
  { display: "Grande", value: LOCATION_SIZES.LARGE2, baseRadiusMultiplier: 3.2 },
  { display: "Grande", value: LOCATION_SIZES.LARGE3, baseRadiusMultiplier: 3.3 },
  { display: "Grande", value: LOCATION_SIZES.LARGE4, baseRadiusMultiplier: 3.4 },
  { display: "Grande", value: LOCATION_SIZES.LARGE5, baseRadiusMultiplier: 3.5 },
  { display: "Grande", value: LOCATION_SIZES.LARGE6, baseRadiusMultiplier: 3.6 },
  { display: "Grande", value: LOCATION_SIZES.LARGE7, baseRadiusMultiplier: 3.7 },
  { display: "Grande", value: LOCATION_SIZES.LARGE8, baseRadiusMultiplier: 3.8 },
  { display: "Grande", value: LOCATION_SIZES.LARGE9, baseRadiusMultiplier: 3.9 },
  { display: "Extremo", newSection: true, value: LOCATION_SIZES.EXTREME, baseRadiusMultiplier: 5 },
  { display: "Extremo", value: LOCATION_SIZES.EXTREME2, baseRadiusMultiplier: 7 },
  { display: "Extremo", value: LOCATION_SIZES.EXTREME3, baseRadiusMultiplier: 10 },
];
export const GetLocationSize = (value) => locationSizes.find((a) => a.value === value);

export const IRREGULAR_TERRAIN_FREQUENCIES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const irregularTerrainFrequencies = [
  { display: "Baixa", value: IRREGULAR_TERRAIN_FREQUENCIES.LOW, probability: 0.1 },
  { display: "Média", value: IRREGULAR_TERRAIN_FREQUENCIES.MEDIUM, probability: 0.25 },
  { display: "Alta", value: IRREGULAR_TERRAIN_FREQUENCIES.HIGH, probability: 0.5 },
  { display: "Extrema", value: IRREGULAR_TERRAIN_FREQUENCIES.EXTREME, probability: 0.75 },
];
export const GetIrregularTerrainFrequency = (value) => irregularTerrainFrequencies.find((a) => a.value === value);

export const PRECIPITATION_FREQUENCIES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const precipitationFrequencies = [
  { display: "Baixa", value: PRECIPITATION_FREQUENCIES.LOW, probability: 0.1 },
  { display: "Média", value: PRECIPITATION_FREQUENCIES.MEDIUM, probability: 0.25 },
  { display: "Alta", value: PRECIPITATION_FREQUENCIES.HIGH, probability: 0.5 },
  { display: "Extrema", value: PRECIPITATION_FREQUENCIES.EXTREME, probability: 0.75 },
];
export const GetPrecipitationFrequency = (value) => precipitationFrequencies.find((a) => a.value === value);

export const INTENSE_TEMPERATURE_FREQUENCIES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const intenseTemperatureFrequencies = [
  { display: "Baixa", value: INTENSE_TEMPERATURE_FREQUENCIES.LOW, probability: 0.1 },
  { display: "Média", value: INTENSE_TEMPERATURE_FREQUENCIES.MEDIUM, probability: 0.25 },
  { display: "Alta", value: INTENSE_TEMPERATURE_FREQUENCIES.HIGH, probability: 0.5 },
  { display: "Extrema", value: INTENSE_TEMPERATURE_FREQUENCIES.EXTREME, probability: 0.75 },
];
export const GetIntenseTemperatureFrequency = (value) => intenseTemperatureFrequencies.find((a) => a.value === value);

export const PANORAMIC_VISIONS = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const panoramicVisions = [
  { display: "Baixa", value: PANORAMIC_VISIONS.LOW, modifier: 0.5 },
  { display: "Média", value: PANORAMIC_VISIONS.MEDIUM, modifier: 1 },
  { display: "Alta", value: PANORAMIC_VISIONS.HIGH, modifier: 2 },
  { display: "Extrema", value: PANORAMIC_VISIONS.EXTREME, modifier: 3 },
];
export const GetPanoramicVision = (value) => panoramicVisions.find((a) => a.value === value);

export const ELEMENT_TYPES = {
  PIT: 10,
  LAKE: 20,
  STRUCTURE: 30,
  ROCK: 40,
  PLANT: 50,
  OBJECT: 60,
};
export const elementTypes = [
  { display: "Declive", value: ELEMENT_TYPES.PIT, color: "#202021", shadowSpread: -50 }, //#1b1b1c
  { display: "Lago", value: ELEMENT_TYPES.LAKE, color: "#00CED1", shadowSpread: -50 },
  { display: "Estrutura", value: ELEMENT_TYPES.STRUCTURE, color: "#D3D3D3", shadowSpread: -50 },
  { display: "Rocha", value: ELEMENT_TYPES.ROCK, color: "#696969", canBeMaterial: true, shadowSpread: -50 },
  { display: "Planta", value: ELEMENT_TYPES.PLANT, color: "#008000", canBeMaterial: true, shadowSpread: -50 },
  { display: "Objeto", value: ELEMENT_TYPES.OBJECT, color: "#C0C0C0", canBeMaterial: true, shadowSpread: -50 },
];
export const GetElementType = (value) => elementTypes.find((a) => a.value === value);

export const REFERENCE_DISTANCES = {
  ADJACENT: 5,
  EXTERIOR_ADJACENT: 8,
  SMALL: 10,
  SMALL1: 11,
  SMALL2: 12,
  SMALL3: 13,
  SMALL4: 14,
  SMALL5: 15,
  SMALL6: 16,
  SMALL7: 17,
  SMALL8: 18,
  SMALL9: 19,
  MEDIUM: 20,
  MEDIUM1: 21,
  MEDIUM2: 22,
  MEDIUM3: 23,
  MEDIUM4: 24,
  MEDIUM5: 25,
  MEDIUM6: 26,
  MEDIUM7: 27,
  MEDIUM8: 28,
  MEDIUM9: 29,
  LARGE: 30,
  LARGE1: 31,
  LARGE2: 32,
  LARGE3: 33,
  LARGE4: 34,
  LARGE5: 35,
  LARGE6: 36,
  LARGE7: 37,
  LARGE8: 38,
  LARGE9: 39,
  EXTREME: 40,
  EXTREME2: 50,
  EXTREME3: 60,
};
export const referenceDistances = [
  { display: "Adjacente", value: REFERENCE_DISTANCES.ADJACENT, baseDistanceMultiplier: 0 },
  { display: "Adjacente Exterior", value: REFERENCE_DISTANCES.EXTERIOR_ADJACENT, baseDistanceMultiplier: 1 },
  { display: "Pequena", newSection: true, value: REFERENCE_DISTANCES.SMALL, baseDistanceMultiplier: 1 },
  { display: "Pequena", value: REFERENCE_DISTANCES.SMALL1, baseDistanceMultiplier: 1.1 },
  { display: "Pequena", value: REFERENCE_DISTANCES.SMALL2, baseDistanceMultiplier: 1.2 },
  { display: "Pequena", value: REFERENCE_DISTANCES.SMALL3, baseDistanceMultiplier: 1.3 },
  { display: "Pequena", value: REFERENCE_DISTANCES.SMALL4, baseDistanceMultiplier: 1.4 },
  { display: "Pequena", value: REFERENCE_DISTANCES.SMALL5, baseDistanceMultiplier: 1.5 },
  { display: "Pequena", value: REFERENCE_DISTANCES.SMALL6, baseDistanceMultiplier: 1.6 },
  { display: "Pequena", value: REFERENCE_DISTANCES.SMALL7, baseDistanceMultiplier: 1.7 },
  { display: "Pequena", value: REFERENCE_DISTANCES.SMALL8, baseDistanceMultiplier: 1.8 },
  { display: "Pequena", value: REFERENCE_DISTANCES.SMALL9, baseDistanceMultiplier: 1.9 },
  { display: "Média", newSection: true, value: REFERENCE_DISTANCES.MEDIUM, baseDistanceMultiplier: 2 },
  { display: "Média", value: REFERENCE_DISTANCES.MEDIUM1, baseDistanceMultiplier: 2.1 },
  { display: "Média", value: REFERENCE_DISTANCES.MEDIUM2, baseDistanceMultiplier: 2.2 },
  { display: "Média", value: REFERENCE_DISTANCES.MEDIUM3, baseDistanceMultiplier: 2.3 },
  { display: "Média", value: REFERENCE_DISTANCES.MEDIUM4, baseDistanceMultiplier: 2.4 },
  { display: "Média", value: REFERENCE_DISTANCES.MEDIUM5, baseDistanceMultiplier: 2.5 },
  { display: "Média", value: REFERENCE_DISTANCES.MEDIUM6, baseDistanceMultiplier: 2.6 },
  { display: "Média", value: REFERENCE_DISTANCES.MEDIUM7, baseDistanceMultiplier: 2.7 },
  { display: "Média", value: REFERENCE_DISTANCES.MEDIUM8, baseDistanceMultiplier: 2.8 },
  { display: "Média", value: REFERENCE_DISTANCES.MEDIUM9, baseDistanceMultiplier: 2.9 },
  { display: "Grande", newSection: true, value: REFERENCE_DISTANCES.LARGE, baseDistanceMultiplier: 3 },
  { display: "Grande", value: REFERENCE_DISTANCES.LARGE1, baseDistanceMultiplier: 3.1 },
  { display: "Grande", value: REFERENCE_DISTANCES.LARGE2, baseDistanceMultiplier: 3.2 },
  { display: "Grande", value: REFERENCE_DISTANCES.LARGE3, baseDistanceMultiplier: 3.3 },
  { display: "Grande", value: REFERENCE_DISTANCES.LARGE4, baseDistanceMultiplier: 3.4 },
  { display: "Grande", value: REFERENCE_DISTANCES.LARGE5, baseDistanceMultiplier: 3.5 },
  { display: "Grande", value: REFERENCE_DISTANCES.LARGE6, baseDistanceMultiplier: 3.6 },
  { display: "Grande", value: REFERENCE_DISTANCES.LARGE7, baseDistanceMultiplier: 3.7 },
  { display: "Grande", value: REFERENCE_DISTANCES.LARGE8, baseDistanceMultiplier: 3.8 },
  { display: "Grande", value: REFERENCE_DISTANCES.LARGE9, baseDistanceMultiplier: 3.9 },
  { display: "Extrema", newSection: true, value: REFERENCE_DISTANCES.EXTREME, baseDistanceMultiplier: 5 },
  { display: "Extrema", value: REFERENCE_DISTANCES.EXTREME2, baseDistanceMultiplier: 7 },
  { display: "Extrema", value: REFERENCE_DISTANCES.EXTREME3, baseDistanceMultiplier: 10 },
];
export const GetReferenceDistance = (value) => referenceDistances.find((a) => a.value === value);

export const LOCATION_CONNECTION_TYPES = {
  ELEVATION: 5,
  ROAD: 10,
  RIVER: 20,
  PASSAGE: 25,
  CHASM: 30,
};
export const locationConnectionTypes = [
  { display: "Elevaçao", value: LOCATION_CONNECTION_TYPES.ELEVATION, elementType: ELEMENT_TYPES.ROCK },
  { display: "Estrada", value: LOCATION_CONNECTION_TYPES.ROAD, elementType: ELEMENT_TYPES.STRUCTURE },
  { display: "Rio", value: LOCATION_CONNECTION_TYPES.RIVER, elementType: ELEMENT_TYPES.LAKE },
  { display: "Passagem", value: LOCATION_CONNECTION_TYPES.PASSAGE, elementType: ELEMENT_TYPES.STRUCTURE },
  { display: "Abismo", value: LOCATION_CONNECTION_TYPES.CHASM, elementType: ELEMENT_TYPES.PIT },
];
export const GetLocationConnectionType = (value) => locationConnectionTypes.find((a) => a.value === value);

export const CON_DEPTHS = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
  EXTREME2: 50,
};
export const conDepths = [
  { display: "Baixa (9m)", value: CON_DEPTHS.LOW, metersDisplay: "9m", meters: 9 },
  { display: "Média (18m)", value: CON_DEPTHS.MEDIUM, metersDisplay: "18m", meters: 18 },
  { display: "Alta (36m)", value: CON_DEPTHS.HIGH, metersDisplay: "36m", meters: 36 },
  { display: "Extrema (60m)", value: CON_DEPTHS.EXTREME, metersDisplay: "60m", meters: 60 },
  { display: "Extrema (120m)", value: CON_DEPTHS.EXTREME2, metersDisplay: "120m", meters: 120 },
];
export const GetConDepth = (value) => conDepths.find((a) => a.value === value);

export const LOCATION_CONNECTION_ANGLE_ORIGINS = {
  START: 10,
  CENTER: 20,
  END: 30,
};
export const locationConnectionAngleOrigins = [
  { display: "Começo", value: LOCATION_CONNECTION_ANGLE_ORIGINS.START, cssClass: "right" },
  { display: "Meio", value: LOCATION_CONNECTION_ANGLE_ORIGINS.CENTER, cssClass: "center" },
  { display: "Fim", value: LOCATION_CONNECTION_ANGLE_ORIGINS.END, cssClass: "left" },
];
export const GetLocationConnectionAngleOrigin = (value) => locationConnectionAngleOrigins.find((a) => a.value === value);

export const DIRECTIONS = {
  NORTH: 10,
  NORTH95: 11,
  NORTH100: 12,
  NORTH105: 13,
  NORTH110: 14,
  NORTH115: 15,
  NORTH120: 16,
  NORTH125: 17,
  NORTH130: 18,
  NORTH_EAST: 20,
  NORTH_EAST50: 21,
  NORTH_EAST55: 22,
  NORTH_EAST60: 23,
  NORTH_EAST65: 24,
  NORTH_EAST70: 25,
  NORTH_EAST75: 26,
  NORTH_EAST80: 27,
  NORTH_EAST85: 28,
  EAST: 30,
  EAST5: 31,
  EAST10: 32,
  EAST15: 33,
  EAST20: 34,
  EAST25: 35,
  EAST30: 36,
  EAST35: 37,
  EAST40: 38,
  SOUTH_EAST: 40,
  SOUTH_EAST320: 41,
  SOUTH_EAST325: 42,
  SOUTH_EAST330: 43,
  SOUTH_EAST335: 44,
  SOUTH_EAST340: 45,
  SOUTH_EAST345: 46,
  SOUTH_EAST350: 47,
  SOUTH_EAST355: 48,
  SOUTH: 50,
  SOUTH275: 51,
  SOUTH280: 52,
  SOUTH285: 53,
  SOUTH290: 54,
  SOUTH295: 55,
  SOUTH300: 56,
  SOUTH305: 57,
  SOUTH310: 58,
  SOUTH_WEST: 60,
  SOUTH_WEST230: 61,
  SOUTH_WEST235: 62,
  SOUTH_WEST240: 63,
  SOUTH_WEST245: 64,
  SOUTH_WEST250: 65,
  SOUTH_WEST255: 66,
  SOUTH_WEST260: 67,
  SOUTH_WEST265: 68,
  WEST: 70,
  WEST185: 71,
  WEST190: 72,
  WEST195: 73,
  WEST200: 74,
  WEST205: 75,
  WEST210: 76,
  WEST215: 77,
  WEST220: 78,
  NORTH_WEST: 80,
  NORTH_WEST140: 81,
  NORTH_WEST145: 82,
  NORTH_WEST150: 83,
  NORTH_WEST155: 84,
  NORTH_WEST160: 85,
  NORTH_WEST165: 86,
  NORTH_WEST170: 87,
  NORTH_WEST175: 88,
};
export const directions = [
  { display: "(0°)", preDisplay: "→", newSection: true, value: DIRECTIONS.EAST, baseAngle: 0 },
  { display: "(5°)", preDisplay: "→", value: DIRECTIONS.EAST5, baseAngle: 5 },
  { display: "(10°)", preDisplay: "→", value: DIRECTIONS.EAST10, baseAngle: 10 },
  { display: "(15°)", preDisplay: "→", value: DIRECTIONS.EAST15, baseAngle: 15 },
  { display: "(20°)", preDisplay: "→", value: DIRECTIONS.EAST20, baseAngle: 20 },
  { display: "(25°)", preDisplay: "→", value: DIRECTIONS.EAST25, baseAngle: 25 },
  { display: "(30°)", preDisplay: "→", value: DIRECTIONS.EAST30, baseAngle: 30 },
  { display: "(35°)", preDisplay: "→", value: DIRECTIONS.EAST35, baseAngle: 35 },
  { display: "(40°)", preDisplay: "→", value: DIRECTIONS.EAST40, baseAngle: 40 },
  { display: "(45°)", preDisplay: "↗", newSection: true, value: DIRECTIONS.NORTH_EAST, baseAngle: 45 },
  { display: "(50°)", preDisplay: "↗", value: DIRECTIONS.NORTH_EAST50, baseAngle: 50 },
  { display: "(55°)", preDisplay: "↗", value: DIRECTIONS.NORTH_EAST55, baseAngle: 55 },
  { display: "(60°)", preDisplay: "↗", value: DIRECTIONS.NORTH_EAST60, baseAngle: 60 },
  { display: "(65°)", preDisplay: "↗", value: DIRECTIONS.NORTH_EAST65, baseAngle: 65 },
  { display: "(70°)", preDisplay: "↗", value: DIRECTIONS.NORTH_EAST70, baseAngle: 70 },
  { display: "(75°)", preDisplay: "↗", value: DIRECTIONS.NORTH_EAST75, baseAngle: 75 },
  { display: "(80°)", preDisplay: "↗", value: DIRECTIONS.NORTH_EAST80, baseAngle: 80 },
  { display: "(85°)", preDisplay: "↗", value: DIRECTIONS.NORTH_EAST85, baseAngle: 85 },
  { display: "(90°)", preDisplay: "↑", newSection: true, value: DIRECTIONS.NORTH, baseAngle: 90 },
  { display: "(95°)", preDisplay: "↑", value: DIRECTIONS.NORTH95, baseAngle: 95 },
  { display: "(100°)", preDisplay: "↑", value: DIRECTIONS.NORTH100, baseAngle: 100 },
  { display: "(105°)", preDisplay: "↑", value: DIRECTIONS.NORTH105, baseAngle: 105 },
  { display: "(110°)", preDisplay: "↑", value: DIRECTIONS.NORTH110, baseAngle: 110 },
  { display: "(115°)", preDisplay: "↑", value: DIRECTIONS.NORTH115, baseAngle: 115 },
  { display: "(120°)", preDisplay: "↑", value: DIRECTIONS.NORTH120, baseAngle: 120 },
  { display: "(125°)", preDisplay: "↑", value: DIRECTIONS.NORTH125, baseAngle: 125 },
  { display: "(130°)", preDisplay: "↑", value: DIRECTIONS.NORTH130, baseAngle: 130 },
  { display: "(135°)", preDisplay: "↖", newSection: true, value: DIRECTIONS.NORTH_WEST, baseAngle: 135 },
  { display: "(140°)", preDisplay: "↖", value: DIRECTIONS.NORTH_WEST140, baseAngle: 140 },
  { display: "(145°)", preDisplay: "↖", value: DIRECTIONS.NORTH_WEST145, baseAngle: 145 },
  { display: "(150°)", preDisplay: "↖", value: DIRECTIONS.NORTH_WEST150, baseAngle: 150 },
  { display: "(155°)", preDisplay: "↖", value: DIRECTIONS.NORTH_WEST155, baseAngle: 155 },
  { display: "(160°)", preDisplay: "↖", value: DIRECTIONS.NORTH_WEST160, baseAngle: 160 },
  { display: "(165°)", preDisplay: "↖", value: DIRECTIONS.NORTH_WEST165, baseAngle: 165 },
  { display: "(170°)", preDisplay: "↖", value: DIRECTIONS.NORTH_WEST170, baseAngle: 170 },
  { display: "(175°)", preDisplay: "↖", value: DIRECTIONS.NORTH_WEST175, baseAngle: 175 },
  { display: "(180°)", preDisplay: "←", newSection: true, value: DIRECTIONS.WEST, baseAngle: 180 },
  { display: "(185°)", preDisplay: "←", value: DIRECTIONS.WEST185, baseAngle: 185 },
  { display: "(190°)", preDisplay: "←", value: DIRECTIONS.WEST190, baseAngle: 190 },
  { display: "(195°)", preDisplay: "←", value: DIRECTIONS.WEST195, baseAngle: 195 },
  { display: "(200°)", preDisplay: "←", value: DIRECTIONS.WEST200, baseAngle: 200 },
  { display: "(205°)", preDisplay: "←", value: DIRECTIONS.WEST205, baseAngle: 205 },
  { display: "(210°)", preDisplay: "←", value: DIRECTIONS.WEST210, baseAngle: 210 },
  { display: "(215°)", preDisplay: "←", value: DIRECTIONS.WEST215, baseAngle: 215 },
  { display: "(220°)", preDisplay: "←", value: DIRECTIONS.WEST220, baseAngle: 220 },
  { display: "(225°)", preDisplay: "↙", newSection: true, value: DIRECTIONS.SOUTH_WEST, baseAngle: 225 },
  { display: "(230°)", preDisplay: "↙", value: DIRECTIONS.SOUTH_WEST230, baseAngle: 230 },
  { display: "(235°)", preDisplay: "↙", value: DIRECTIONS.SOUTH_WEST235, baseAngle: 235 },
  { display: "(240°)", preDisplay: "↙", value: DIRECTIONS.SOUTH_WEST240, baseAngle: 240 },
  { display: "(245°)", preDisplay: "↙", value: DIRECTIONS.SOUTH_WEST245, baseAngle: 245 },
  { display: "(250°)", preDisplay: "↙", value: DIRECTIONS.SOUTH_WEST250, baseAngle: 250 },
  { display: "(255°)", preDisplay: "↙", value: DIRECTIONS.SOUTH_WEST255, baseAngle: 255 },
  { display: "(260°)", preDisplay: "↙", value: DIRECTIONS.SOUTH_WEST260, baseAngle: 260 },
  { display: "(265°)", preDisplay: "↙", value: DIRECTIONS.SOUTH_WEST265, baseAngle: 265 },
  { display: "(270°)", preDisplay: "↓", newSection: true, value: DIRECTIONS.SOUTH, baseAngle: 270 },
  { display: "(275°)", preDisplay: "↓", value: DIRECTIONS.SOUTH275, baseAngle: 275 },
  { display: "(280°)", preDisplay: "↓", value: DIRECTIONS.SOUTH280, baseAngle: 280 },
  { display: "(285°)", preDisplay: "↓", value: DIRECTIONS.SOUTH285, baseAngle: 285 },
  { display: "(290°)", preDisplay: "↓", value: DIRECTIONS.SOUTH290, baseAngle: 290 },
  { display: "(295°)", preDisplay: "↓", value: DIRECTIONS.SOUTH295, baseAngle: 295 },
  { display: "(300°)", preDisplay: "↓", value: DIRECTIONS.SOUTH300, baseAngle: 300 },
  { display: "(305°)", preDisplay: "↓", value: DIRECTIONS.SOUTH305, baseAngle: 305 },
  { display: "(310°)", preDisplay: "↓", value: DIRECTIONS.SOUTH310, baseAngle: 310 },
  { display: "(315°)", preDisplay: "↘", newSection: true, value: DIRECTIONS.SOUTH_EAST, baseAngle: 315 },
  { display: "(320°)", preDisplay: "↘", value: DIRECTIONS.SOUTH_EAST320, baseAngle: 320 },
  { display: "(325°)", preDisplay: "↘", value: DIRECTIONS.SOUTH_EAST325, baseAngle: 325 },
  { display: "(330°)", preDisplay: "↘", value: DIRECTIONS.SOUTH_EAST330, baseAngle: 330 },
  { display: "(335°)", preDisplay: "↘", value: DIRECTIONS.SOUTH_EAST335, baseAngle: 335 },
  { display: "(340°)", preDisplay: "↘", value: DIRECTIONS.SOUTH_EAST340, baseAngle: 340 },
  { display: "(345°)", preDisplay: "↘", value: DIRECTIONS.SOUTH_EAST345, baseAngle: 345 },
  { display: "(350°)", preDisplay: "↘", value: DIRECTIONS.SOUTH_EAST350, baseAngle: 350 },
  { display: "(355°)", preDisplay: "↘", value: DIRECTIONS.SOUTH_EAST355, baseAngle: 355 },
];
export const GetDirection = (value) => directions.find((a) => a.value === value);

export const PARTITION_TYPES = {
  ELEVATION: 10,
  PRECIPICE: 20,
};
export const partitionTypes = [
  { display: "Elevação", value: PARTITION_TYPES.ELEVATION, mapaColor: "gray" },
  { display: "Precipício", value: PARTITION_TYPES.PRECIPICE, mapaColor: "black" },
];
export const GetPartitionType = (value) => partitionTypes.find((a) => a.value === value);

export const PARTITION_MAGNITUDES = {
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 30,
  EXTREME: 40,
};
export const partitionMagnitudes = [
  { display: "Pequena", value: REFERENCE_DISTANCES.SMALL },
  { display: "Média", value: REFERENCE_DISTANCES.MEDIUM },
  { display: "Grande", value: REFERENCE_DISTANCES.LARGE },
  { display: "Extrema", value: REFERENCE_DISTANCES.EXTREME },
];
export const GetPartitionMagnitude = (value) => partitionMagnitudes.find((a) => a.value === value);

export const PARTITION_QUANTITIES = {
  SMALL: 20,
  MEDIUM: 30,
  LARGE: 40,
  EXTREME: 50,
};
export const partitionQuantities = [
  { display: "Baixa (0-2)", value: IRREGULAR_TERRAIN_FREQUENCIES.LOW },
  { display: "Média (2-4)", value: IRREGULAR_TERRAIN_FREQUENCIES.MEDIUM },
  { display: "Alta (4-6)", value: IRREGULAR_TERRAIN_FREQUENCIES.HIGH },
  { display: "Extrema (6-8)", value: IRREGULAR_TERRAIN_FREQUENCIES.EXTREME },
];
export const GetPartitionQuantity = (value) => partitionQuantities.find((a) => a.value === value);

export const HAZARDOUSNESS = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const hazardousness = [
  { display: "Baixa (5% / hora de exploraçao)", value: HAZARDOUSNESS.LOW, color: cc.GetRarity(HAZARDOUSNESS.LOW).color, probability: 0.05 },
  { display: "Média (10% / hora de exploraçao)", value: HAZARDOUSNESS.MEDIUM, color: cc.GetRarity(HAZARDOUSNESS.MEDIUM).color, probability: 0.1 },
  { display: "Alta (15% / hora de exploraçao)", value: HAZARDOUSNESS.HIGH, color: cc.GetRarity(HAZARDOUSNESS.HIGH).color, probability: 0.15 },
  {
    display: "Extrema (20% / hora de exploraçao)",
    value: HAZARDOUSNESS.EXTREME,
    color: cc.GetRarity(HAZARDOUSNESS.EXTREME).color,
    probability: 0.2,
  },
];
export const GetHazardousness = (value) => hazardousness.find((a) => a.value === value);

export const RESOURCE_EASINESS = {
  ABUNDANT: 10,
  NORMAL: 20,
  LIMITED: 30,
  SCARCE: 40,
};
export const resourceEasiness = [
  { display: "Abundante", value: RESOURCE_EASINESS.ABUNDANT, difficult: cc.DIFFICULTY_CLASSES.LOW },
  { display: "Normal", value: RESOURCE_EASINESS.NORMAL, difficult: cc.DIFFICULTY_CLASSES.MEDIUM },
  { display: "Limitado", value: RESOURCE_EASINESS.LIMITED, difficult: cc.DIFFICULTY_CLASSES.HIGH },
  { display: "Escasso", value: RESOURCE_EASINESS.SCARCE, difficult: cc.DIFFICULTY_CLASSES.EXTREME },
];
export const GetResourceEasiness = (value) => resourceEasiness.find((a) => a.value === value);

export const ROUTINE_PRECIPITATIONS = {
  CLEAR: 10,
  PRECIPITATING: 20,
};
export const routinePrecipitations = [
  { display: "Normal", value: ROUTINE_PRECIPITATIONS.CLEAR, icon: "fas fa-rainbow" },
  { display: "Precipitando", value: ROUTINE_PRECIPITATIONS.PRECIPITATING, icon: "fas fa-cloud-showers-heavy" },
];
export const GetRoutinePrecipitation = (value) => routinePrecipitations.find((a) => a.value === value);

export const ROUTINE_TEMPERATURES = {
  NORMAL: 10,
  EXTREME: 20,
};
export const routineTemperatures = [
  { display: "Normal", value: ROUTINE_TEMPERATURES.NORMAL, icon: "fas fa-thermometer-empty" },
  { display: "Intensa", value: ROUTINE_TEMPERATURES.EXTREME, icon: "fas fa-thermometer-full" },
];
export const GetRoutineTemperature = (value) => routineTemperatures.find((a) => a.value === value);

export const ROUTINE_SCHEDULES = {
  DAY: 10,
  NIGHT: 20,
};
export const routineSchedules = [
  { display: "Dia", value: ROUTINE_SCHEDULES.DAY, icon: "fas fa-sun" },
  { display: "Noite", value: ROUTINE_SCHEDULES.NIGHT, icon: "fas fa-moon" },
];
export const GetRoutineSchedule = (value) => routineSchedules.find((a) => a.value === value);

export const GROUP_SIZES = {
  SOLO: 5,
  SMALL_RANGE: 9,
  SMALL: 10,
  MEDIUM_RANGE: 19,
  MEDIUM: 20,
  MEDIUM_RANGE_HIGH: 21,
  LARGE: 30,
  EXTREME: 40,
};
export const groupSizes = [
  { display: "Solitário", value: GROUP_SIZES.SOLO, routineDisplay: "1", min: 1, max: 1 },
  { display: "Pequeno (1-2)", value: GROUP_SIZES.SMALL_RANGE, routineDisplay: "1-2", min: 1, max: 2 },
  { display: "Pequeno (2)", value: GROUP_SIZES.SMALL, routineDisplay: "2", min: 2, max: 2 },
  { display: "Médio (2-3)", value: GROUP_SIZES.MEDIUM_RANGE, routineDisplay: "2-3", min: 2, max: 3 },
  { display: "Médio (3)", value: GROUP_SIZES.MEDIUM, routineDisplay: "3", min: 3, max: 3 },
  { display: "Médio (3-4)", value: GROUP_SIZES.MEDIUM_RANGE_HIGH, routineDisplay: "3-4", min: 3, max: 4 },
  { display: "Grande (4-6)", value: GROUP_SIZES.LARGE, routineDisplay: "4-6", min: 4, max: 6 },
  { display: "Muito Grande (6-10)", value: GROUP_SIZES.EXTREME, routineDisplay: "6-10", min: 6, max: 10 },
];
export const GetGroupSize = (value) => groupSizes.find((a) => a.value === value);

export const ENCOUNTER_FREQUENCIES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
  CERTAIN: 50,
};
export const encounterFrequencies = [
  { display: "Baixa (10%)", value: ENCOUNTER_FREQUENCIES.LOW, opacity: 0.5, probability: 0.1 },
  { display: "Média (25%)", value: ENCOUNTER_FREQUENCIES.MEDIUM, opacity: 0.67, probability: 0.25 },
  { display: "Alta (50%)", value: ENCOUNTER_FREQUENCIES.HIGH, opacity: 0.83, probability: 0.5 },
  { display: "Extrema (75%)", value: ENCOUNTER_FREQUENCIES.EXTREME, opacity: 1, probability: 0.75 },
  { display: "Certa (100%)", value: ENCOUNTER_FREQUENCIES.CERTAIN, opacity: 1, probability: 1 },
];
export const GetEncounterFrequency = (value) => encounterFrequencies.find((a) => a.value === value);

export const ELEMENT_MATERIAL_FREQUENCIES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const elementMaterialFrequencies = [
  { display: "Baixa", value: ELEMENT_MATERIAL_FREQUENCIES.LOW, probability: 0.1 },
  { display: "Média", value: ELEMENT_MATERIAL_FREQUENCIES.MEDIUM, probability: 0.25 },
  { display: "Alta", value: ELEMENT_MATERIAL_FREQUENCIES.HIGH, probability: 0.5 },
  { display: "Extrema", value: ELEMENT_MATERIAL_FREQUENCIES.EXTREME, probability: 0.75 },
];
export const GetElementMaterialFrequency = (value) => elementMaterialFrequencies.find((a) => a.value === value);

export const MATERIAL_EXTRACTION_DIFFICULTIES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
  CERTAIN: 50,
};
export const materialExtractionDifficulties = [
  { display: "Baixa (10%)", value: MATERIAL_EXTRACTION_DIFFICULTIES.LOW, probability: 0.1 },
  { display: "Média (25%)", value: MATERIAL_EXTRACTION_DIFFICULTIES.MEDIUM, probability: 0.25 },
  { display: "Alta (50%)", value: MATERIAL_EXTRACTION_DIFFICULTIES.HIGH, probability: 0.5 },
  { display: "Extrema (75%)", value: MATERIAL_EXTRACTION_DIFFICULTIES.EXTREME, probability: 0.75 },
  { display: "Certa (100%)", value: MATERIAL_EXTRACTION_DIFFICULTIES.CERTAIN, probability: 1 },
];
export const GetMaterialExtractionDifficulty = (value) => materialExtractionDifficulties.find((a) => a.value === value);

export const MAP_MODES = {
  FREE: 10,
  TRAVEL: 20,
};
export const mapModes = [
  { display: "Livre", value: MAP_MODES.FREE },
  { display: "Exploraçao", value: MAP_MODES.TRAVEL },
];

export const TRAVEL_PACES = {
  REST: 10,
  ACTIVITY: 20,
  SLOW: 30,
  NORMAL: 40,
  HASTEN: 50,
  VERY_HASTEN: 60,
  VERY_HASTE2: 70,
};
export const travelPaces = [
  {
    display: "Descanso",
    icon: "fas fa-bed",
    info: [{ text: "Opção Descanso recupera desgaste" }],
    value: TRAVEL_PACES.REST,
    mobility: 0,
    fatigue: 0,
    imminentEncounterProbMod: 1,
    resultDisplay: "Descanso",
  },
  { display: "Atividade (x0)", value: TRAVEL_PACES.ACTIVITY, mobility: 0, fatigue: 1, imminentEncounterProbMod: 0.5, resultDisplay: "Atividade" },
  { display: "Devagar (x0.5)", value: TRAVEL_PACES.SLOW, mobility: 0.5, fatigue: 0.5, imminentEncounterProbMod: 0 },
  { display: "Normal (x1)", value: TRAVEL_PACES.NORMAL, mobility: 1, fatigue: 1, imminentEncounterProbMod: 1 },
  { display: "Rápido (x1.5)", value: TRAVEL_PACES.HASTEN, mobility: 1.5, fatigue: 2, imminentEncounterProbMod: 2 },
  { display: "Muito Rápido (x2)", value: TRAVEL_PACES.VERY_HASTEN, mobility: 2, fatigue: 4, imminentEncounterProbMod: 4 },
  { display: "Muito Rápido (x3)", value: TRAVEL_PACES.VERY_HASTE2, mobility: 3, fatigue: 8, imminentEncounterProbMod: 8 },
];
export const GetTravelPace = (value) => travelPaces.find((a) => a.value === value);

export const TRAVEL_LOADS = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
};
export const travelLoads = [
  { display: "Baixa (< 1/3 max)", value: TRAVEL_LOADS.LOW, mobility: 1, fatigue: 0.5 },
  { display: "Média (1/3 - 2/3 max)", value: TRAVEL_LOADS.MEDIUM, mobility: 1, fatigue: 1 },
  { display: "Alta (> 2/3 max)", value: TRAVEL_LOADS.HIGH, mobility: 1, fatigue: 1.5 },
];
export const GetTravelLoad = (value) => travelLoads.find((a) => a.value === value);

export const REST_TIMES = {
  h0m10: 10,
  h0m30: 20,
  h1m0: 30,
  h1m30: 40,
  h2m0: 50,
  h2m30: 60,
  h3m0: 70,
  h3m30: 80,
  h4m0: 90,
  h4m30: 100,
  h5m0: 110,
  h5m30: 120,
  h6m0: 130,
  h6m30: 140,
  h7m0: 150,
  h7m30: 160,
  h8m0: 170,
};
export const restTimes = [
  { display: "10 min", value: REST_TIMES.h0m10, timeInMin: 10 },
  { display: "30 min", value: REST_TIMES.h0m30, timeInMin: 30 },
  { display: "1 hora", value: REST_TIMES.h1m0, timeInMin: 1 * 60 },
  { display: "1 hora e 30 min", value: REST_TIMES.h1m30, timeInMin: 1 * 60 + 30 },
  { display: "2 horas", value: REST_TIMES.h2m0, timeInMin: 2 * 60 },
  { display: "2 horas e 30 min", value: REST_TIMES.h2m30, timeInMin: 2 * 60 + 30 },
  { display: "3 horas", value: REST_TIMES.h3m0, timeInMin: 3 * 60 },
  { display: "3 horas e 30 min", value: REST_TIMES.h3m30, timeInMin: 3 * 60 + 30 },
  { display: "4 horas", value: REST_TIMES.h4m0, timeInMin: 4 * 60 },
  { display: "4 horas e 30 min", value: REST_TIMES.h4m30, timeInMin: 4 * 60 + 30 },
  { display: "5 horas", value: REST_TIMES.h5m0, timeInMin: 5 * 60 },
  { display: "5 horas e 30 min", value: REST_TIMES.h5m30, timeInMin: 5 * 60 + 30 },
  { display: "6 horas", value: REST_TIMES.h6m0, timeInMin: 6 * 60 },
  { display: "6 horas e 30 min", value: REST_TIMES.h6m30, timeInMin: 6 * 60 + 30 },
  { display: "7 horas", value: REST_TIMES.h7m0, timeInMin: 7 * 60 },
  { display: "7 horas e 30 min", value: REST_TIMES.h7m30, timeInMin: 7 * 60 + 30 },
  { display: "8 horas", value: REST_TIMES.h8m0, timeInMin: 8 * 60 },
];
export const GetRestTime = (value) => restTimes.find((a) => a.value === value);

export const ELEMENT_ALTERATIONS = {
  SIZE: 10,
  NUMBER: 20,
  SHAPE: 30,
  CONDITION: 40,
};
export const elementAlterations = [
  { display: "Tamanho", value: ELEMENT_ALTERATIONS.SIZE },
  { display: "Quantidade", value: ELEMENT_ALTERATIONS.NUMBER },
  { display: "Forma", value: ELEMENT_ALTERATIONS.SHAPE },
  { display: "Condiçao", value: ELEMENT_ALTERATIONS.CONDITION },
];
export const GetElementAlteration = (value) => elementAlterations.find((a) => a.value === value);

export const NODE_CREATURE_CONDITIONS = {
  NONE: 10,
  TRACKS: 20,
  REMAINS: 30,
  NEAR: 40,
  IMMINENT: 50,
};
export const nodeCreatureConditions = [
  { display: "Nenhum", value: NODE_CREATURE_CONDITIONS.NONE },
  { display: "Rastros", value: NODE_CREATURE_CONDITIONS.TRACKS },
  { display: "Restos mortais", value: NODE_CREATURE_CONDITIONS.REMAINS },
  { display: "Perigosamente Próximo", value: NODE_CREATURE_CONDITIONS.NEAR },
  { display: "Encontro Eminente", value: NODE_CREATURE_CONDITIONS.IMMINENT },
];
export const GetNodeCreatureCondition = (value) => nodeCreatureConditions.find((a) => a.value === value);

export const ROOM_SIZES = {
  EXIT: 3,
  CORRIDOR: 5,
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 30,
};
export const roomSizes = [
  {
    display: "Saída",
    icon: "fas fa-dungeon",
    info: [{ text: "Use o mapa para se mover até outra localizaçao" }],
    value: ROOM_SIZES.EXIT,
    cssClass: "large",
    meters: null,
    corridorDisplay: null,
  },
  { display: "Corredor", value: ROOM_SIZES.CORRIDOR, cssClass: "corridor", meters: null, corridorDisplay: "4,5m" },
  { display: "Pequeno", value: ROOM_SIZES.SMALL, cssClass: "small", meters: 9, corridorDisplay: "4,5m" },
  { display: "Médio", value: ROOM_SIZES.MEDIUM, cssClass: "medium", meters: 18, corridorDisplay: "3m" },
  { display: "Grande", value: ROOM_SIZES.LARGE, cssClass: "large", meters: 36, corridorDisplay: "1,5m" },
];
export const GetRoomSize = (value) => roomSizes.find((a) => a.value === value);

export const ROOM_HEIGHTS = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
  EXTREME2: 50,
  EXTREME3: 60,
};
export const roomHeights = [
  { display: "Baixa (1,5m)", value: ROOM_HEIGHTS.LOW, metersDisplay: "1,5m", meters: 1.5 },
  { display: "Média (3m)", value: ROOM_HEIGHTS.MEDIUM, metersDisplay: "3m", meters: 3 },
  { display: "Alta (6m)", value: ROOM_HEIGHTS.HIGH, metersDisplay: "6m", meters: 6 },
  { display: "Extrema (9m)", value: ROOM_HEIGHTS.EXTREME, metersDisplay: "9m", meters: 9 },
  { display: "Extrema (18m)", value: ROOM_HEIGHTS.EXTREME2, metersDisplay: "18m", meters: 18 },
  { display: "Extrema (36m)", value: ROOM_HEIGHTS.EXTREME3, metersDisplay: "36m", meters: 36 },
];
export const GetRoomHeight = (value) => roomHeights.find((a) => a.value === value);

export const ROOM_CONNECTIONS = {
  BLOCKED: 20,
  UNBLOCKED: 30,
  OPEN: 40,
};
export const roomConnections = [
  { display: "Bloqueada", value: ROOM_CONNECTIONS.BLOCKED },
  { display: "Desbloqueada", value: ROOM_CONNECTIONS.UNBLOCKED },
  { display: "Aberta", value: ROOM_CONNECTIONS.OPEN },
];
export const GetRoomConnection = (value) => roomConnections.find((a) => a.value === value);

export const ROOM_CONNECTION_DIRECTIONS = {
  TOP_LEFT: 10,
  TOP_RIGHT: 20,
  BOTTOM_LEFT: 30,
  BOTTOM_RIGHT: 40,
};
export const roomConnectionDirections = [
  { display: "(cima esquerdo)", preDisplay: "↖", value: ROOM_CONNECTION_DIRECTIONS.TOP_LEFT },
  { display: "(cima direito)", preDisplay: "↗", value: ROOM_CONNECTION_DIRECTIONS.TOP_RIGHT },
  { display: "(baixo esquerdo)", preDisplay: "↙", value: ROOM_CONNECTION_DIRECTIONS.BOTTOM_LEFT },
  { display: "(baixo direito)", preDisplay: "↘", value: ROOM_CONNECTION_DIRECTIONS.BOTTOM_RIGHT },
];
export const GetRoomConnectionDirection = (value) => roomConnectionDirections.find((a) => a.value === value);
