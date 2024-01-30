import * as cc from "./creatureConstants";

export const POINT_OF_INTEREST_RADIUS = 20;
export const BASE_VISION_IN_M = 10000;
export const BASE_TRAVEL_DISTANCE_PER_HOUR_IN_M = 2500;
export const MAXIMUM_SEQUENTIAL_EXPLORATION_HOURS = 8;
export const BASE_PX_IN_M_SCALE = 50;

export const DEFAULT_CONTEXT_NAME = "Normal";

export const GetNewLocation = (exteriorLocationId) => ({
  owner: false,
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
    isHazardous: false,
    rarity: null,
    rooms: [],
  },
  reference: {
    distance: null,
    direction: null,
    location: null,
    connectionType: null,
  },
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
});

export const LOCATION_SIZES = {
  POINT_OF_INTEREST: 10,
  SMALL: 20,
  MEDIUM: 30,
  LARGE: 40,
  EXTREME: 50,
  EXTREME2: 60,
  EXTREME3: 70,
};
export const locationSizes = [
  { display: "Ponto de Interesse", value: LOCATION_SIZES.POINT_OF_INTEREST, baseRadiusMultiplier: 0 },
  { display: "Pequeno", value: LOCATION_SIZES.SMALL, baseRadiusMultiplier: 1 },
  { display: "Médio", value: LOCATION_SIZES.MEDIUM, baseRadiusMultiplier: 2 },
  { display: "Grande", value: LOCATION_SIZES.LARGE, baseRadiusMultiplier: 3 },
  { display: "Extremo", value: LOCATION_SIZES.EXTREME, baseRadiusMultiplier: 5 },
  { display: "Extremo 2", value: LOCATION_SIZES.EXTREME2, baseRadiusMultiplier: 7 },
  { display: "Extremo 3", value: LOCATION_SIZES.EXTREME3, baseRadiusMultiplier: 10 },
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
  { display: "Declive", value: ELEMENT_TYPES.PIT, color: "#202021" }, //#1b1b1c
  { display: "Lago", value: ELEMENT_TYPES.LAKE, color: "#00CED1" },
  { display: "Estrutura", value: ELEMENT_TYPES.STRUCTURE, color: "#D3D3D3" },
  { display: "Rocha", value: ELEMENT_TYPES.ROCK, color: "#696969", canBeMaterial: true },
  { display: "Planta", value: ELEMENT_TYPES.PLANT, color: "#008000", canBeMaterial: true },
  { display: "Objeto", value: ELEMENT_TYPES.OBJECT, color: "#C0C0C0", canBeMaterial: true },
];
export const GetElementType = (value) => elementTypes.find((a) => a.value === value);

export const REFERENCE_DISTANCES = {
  // BLEND: 3,
  ADJACENT: 5,
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 30,
  EXTREME: 40,
  EXTREME2: 50,
  EXTREME3: 60,
};
export const referenceDistances = [
  // { display: "Mesclado", value: REFERENCE_DISTANCES.BLEND, baseDistanceMultiplier: 0 },
  { display: "Adjacente", value: REFERENCE_DISTANCES.ADJACENT, baseDistanceMultiplier: 0 },
  { display: "Pequena", value: REFERENCE_DISTANCES.SMALL, baseDistanceMultiplier: 1 },
  { display: "Média", value: REFERENCE_DISTANCES.MEDIUM, baseDistanceMultiplier: 2 },
  { display: "Grande", value: REFERENCE_DISTANCES.LARGE, baseDistanceMultiplier: 3 },
  { display: "Extrema", value: REFERENCE_DISTANCES.EXTREME, baseDistanceMultiplier: 5 },
  { display: "Extrema 2", value: REFERENCE_DISTANCES.EXTREME2, baseDistanceMultiplier: 7 },
  { display: "Extrema 3", value: REFERENCE_DISTANCES.EXTREME3, baseDistanceMultiplier: 10 },
];
export const GetReferenceDistance = (value) => referenceDistances.find((a) => a.value === value);

export const LOCATION_CONNECTION_TYPES = {
  ROAD: 10,
  RIVER: 20,
  CHASM: 30,
};
export const locationConnectionTypes = [
  { display: "Estrada", value: LOCATION_CONNECTION_TYPES.ROAD, elementType: ELEMENT_TYPES.STRUCTURE },
  { display: "Rio", value: LOCATION_CONNECTION_TYPES.RIVER, elementType: ELEMENT_TYPES.LAKE },
  { display: "Abismo", value: LOCATION_CONNECTION_TYPES.CHASM, elementType: ELEMENT_TYPES.PIT },
];
export const GetLocationConnectionType = (value) => locationConnectionTypes.find((a) => a.value === value);

export const DIRECTIONS = {
  NORTH: 10,
  NORTH_EAST: 20,
  EAST: 30,
  SOUTH_EAST: 40,
  SOUTH: 50,
  SOUTH_WEST: 60,
  WEST: 70,
  NORTH_WEST: 80,
};
export const directions = [
  { display: "Norte ↑", value: DIRECTIONS.NORTH, baseAngle: 90 },
  { display: "Nordeste ↗", value: DIRECTIONS.NORTH_EAST, baseAngle: 45 },
  { display: "Leste →", value: DIRECTIONS.EAST, baseAngle: 0 },
  { display: "Sudeste ↘", value: DIRECTIONS.SOUTH_EAST, baseAngle: 315 },
  { display: "Sul ↓", value: DIRECTIONS.SOUTH, baseAngle: 270 },
  { display: "Sudoeste ↙", value: DIRECTIONS.SOUTH_WEST, baseAngle: 225 },
  { display: "Oeste ←", value: DIRECTIONS.WEST, baseAngle: 180 },
  { display: "Noroeste ↖", value: DIRECTIONS.NORTH_WEST, baseAngle: 135 },
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
  { display: "Baixa (5% por hora de exploraçao)", value: HAZARDOUSNESS.LOW, color: cc.GetRarity(HAZARDOUSNESS.LOW).color, probability: 0.05 },
  { display: "Média (10% por hora de exploraçao)", value: HAZARDOUSNESS.MEDIUM, color: cc.GetRarity(HAZARDOUSNESS.MEDIUM).color, probability: 0.1 },
  { display: "Alta (15% por hora de exploraçao)", value: HAZARDOUSNESS.HIGH, color: cc.GetRarity(HAZARDOUSNESS.HIGH).color, probability: 0.15 },
  {
    display: "Extrema (20% por hora de exploraçao)",
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
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 30,
  EXTREME: 40,
};
export const groupSizes = [
  { display: "Solitário", value: GROUP_SIZES.SOLO, routineDisplay: "1", min: 1, max: 1 },
  { display: "Pequeno (2)", value: GROUP_SIZES.SMALL, routineDisplay: "2", min: 2, max: 2 },
  { display: "Médio (3)", value: GROUP_SIZES.MEDIUM, routineDisplay: "3", min: 3, max: 3 },
  { display: "Grande (4-6)", value: GROUP_SIZES.LARGE, routineDisplay: "4-6", min: 4, max: 6 },
  { display: "Muito Grande (7-10)", value: GROUP_SIZES.EXTREME, routineDisplay: "7-10", min: 7, max: 10 },
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
};
export const travelPaces = [
  { display: "Descanso", value: TRAVEL_PACES.REST, mobility: 0, fatigue: 0, imminentEncounterProbMod: 1, resultDisplay: "Descanso" },
  { display: "Atividade (x0)", value: TRAVEL_PACES.ACTIVITY, mobility: 0, fatigue: 1, imminentEncounterProbMod: 0.5, resultDisplay: "Atividade" },
  { display: "Devagar (x0.5)", value: TRAVEL_PACES.SLOW, mobility: 0.5, fatigue: 0.5, imminentEncounterProbMod: 0 },
  { display: "Normal (x1)", value: TRAVEL_PACES.NORMAL, mobility: 1, fatigue: 1, imminentEncounterProbMod: 1 },
  { display: "Apressado (x1.5)", value: TRAVEL_PACES.HASTEN, mobility: 1.5, fatigue: 2, imminentEncounterProbMod: 2 },
];
export const GetTravelPace = (value) => travelPaces.find((a) => a.value === value);

export const TRAVEL_MOUNTS = {
  NONE: 10,
  SLOW: 20,
  NORMAL: 30,
  FAST: 40,
  VERY_FAST: 50,
};
export const travelMounts = [
  { display: "Nenhuma", value: TRAVEL_MOUNTS.NONE, mobility: 1, fatigue: 1 },
  { display: "Devagar (x1)", value: TRAVEL_MOUNTS.SLOW, mobility: 1, fatigue: 0.5 },
  { display: "Normal (x1.5)", value: TRAVEL_MOUNTS.NORMAL, mobility: 1.5, fatigue: 0.5 },
  { display: "Rápida (x2)", value: TRAVEL_MOUNTS.FAST, mobility: 2, fatigue: 0.5 },
  // { display: "Muito rápida (x3)", value: TRAVEL_MOUNTS.VERY_FAST, mobility: 3, fatigue: 0.5 },
];
export const GetTravelMount = (value) => travelMounts.find((a) => a.value === value);

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
  SHORT: 10,
  MEDIUM: 20,
  LONG: 30,
};
export const restTimes = [
  { display: "10 minutos", value: REST_TIMES.SHORT, timeInMin: 10 },
  { display: "1 hora", value: REST_TIMES.MEDIUM, timeInMin: 1 * 60 },
  { display: "8 horas", value: REST_TIMES.LONG, timeInMin: 8 * 60 },
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
  CORRIDOR: 5,
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 30,
};
export const roomSizes = [
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
};
export const roomHeights = [
  { display: "Baixa (1,5m)", value: ROOM_HEIGHTS.LOW, metersDisplay: "1,5m", meters: 1.5 },
  { display: "Média (3m)", value: ROOM_HEIGHTS.MEDIUM, metersDisplay: "3m", meters: 3 },
  { display: "Alta (6m)", value: ROOM_HEIGHTS.HIGH, metersDisplay: "6m", meters: 6 },
  { display: "Extrema (9m)", value: ROOM_HEIGHTS.EXTREME, metersDisplay: "9m", meters: 9 },
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
  { display: "Cima esquerdo ↖", value: ROOM_CONNECTION_DIRECTIONS.TOP_LEFT },
  { display: "Cima direito ↗", value: ROOM_CONNECTION_DIRECTIONS.TOP_RIGHT },
  { display: "Baixo esquerdo ↙", value: ROOM_CONNECTION_DIRECTIONS.BOTTOM_LEFT },
  { display: "Baixo direito ↘", value: ROOM_CONNECTION_DIRECTIONS.BOTTOM_RIGHT },
];
export const GetRoomConnectionDirection = (value) => roomConnectionDirections.find((a) => a.value === value);
