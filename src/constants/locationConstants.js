export const LOCATION_SIZES = {
  POINT_OF_INTEREST: 10,
  SMALL: 20,
  MEDIUM: 30,
  LARGE: 40,
  EXTREME: 50,
};
export const locationSizes = [
  { display: "Pequena", value: LOCATION_SIZES.SMALL },
  { display: "Média", value: LOCATION_SIZES.MEDIUM },
  { display: "Grande", value: LOCATION_SIZES.LARGE },
  { display: "Extrema", value: LOCATION_SIZES.EXTREME },
];
export const GetLocationSize = (value) => locationSizes.find((a) => a.value === value);

export const IRREGULAR_TERRAIN_FREQUENCIES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const irregularTerrainFrequencies = [
  { display: "Baixa", value: IRREGULAR_TERRAIN_FREQUENCIES.LOW },
  { display: "Média", value: IRREGULAR_TERRAIN_FREQUENCIES.MEDIUM },
  { display: "Alta", value: IRREGULAR_TERRAIN_FREQUENCIES.HIGH },
  { display: "Extrema", value: IRREGULAR_TERRAIN_FREQUENCIES.EXTREME },
];
export const GetIrregularTerrainFrequency = (value) => irregularTerrainFrequencies.find((a) => a.value === value);

export const PRECIPITATION_FREQUENCIES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const precipitationFrequencies = [
  { display: "Baixa", value: PRECIPITATION_FREQUENCIES.LOW },
  { display: "Média", value: PRECIPITATION_FREQUENCIES.MEDIUM },
  { display: "Alta", value: PRECIPITATION_FREQUENCIES.HIGH },
  { display: "Extrema", value: PRECIPITATION_FREQUENCIES.EXTREME },
];
export const GetPrecipitationFrequency = (value) => precipitationFrequencies.find((a) => a.value === value);

export const INTENSE_TEMPERATURE_FREQUENCIES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const intenseTemperatureFrequencies = [
  { display: "Baixa", value: INTENSE_TEMPERATURE_FREQUENCIES.LOW },
  { display: "Média", value: INTENSE_TEMPERATURE_FREQUENCIES.MEDIUM },
  { display: "Alta", value: INTENSE_TEMPERATURE_FREQUENCIES.HIGH },
  { display: "Extrema", value: INTENSE_TEMPERATURE_FREQUENCIES.EXTREME },
];
export const GetIntenseTemperatureFrequency = (value) => intenseTemperatureFrequencies.find((a) => a.value === value);

export const PANORAMIC_VISIONS = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const panoramicVisions = [
  { display: "Baixa", value: PANORAMIC_VISIONS.LOW },
  { display: "Média", value: PANORAMIC_VISIONS.MEDIUM },
  { display: "Alta", value: PANORAMIC_VISIONS.HIGH },
  { display: "Extrema", value: PANORAMIC_VISIONS.EXTREME },
];
export const GetPanoramicVision = (value) => panoramicVisions.find((a) => a.value === value);

export const REFERENCE_DISTANCES = {
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 30,
  EXTREME: 40,
};
export const referenceDistances = [
  { display: "Pequena", value: REFERENCE_DISTANCES.SMALL },
  { display: "Média", value: REFERENCE_DISTANCES.MEDIUM },
  { display: "Grande", value: REFERENCE_DISTANCES.LARGE },
  { display: "Extrema", value: REFERENCE_DISTANCES.EXTREME },
];
export const GetReferenceDistance = (value) => referenceDistances.find((a) => a.value === value);

export const LOCATION_CONNECTION_TYPES = {
  ROAD: 10,
  RIVER: 20,
};
export const locationConnectionTypes = [
  { display: "Estrada", value: LOCATION_CONNECTION_TYPES.ROAD },
  { display: "Rio", value: LOCATION_CONNECTION_TYPES.RIVER },
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
  { display: "Norte", value: DIRECTIONS.NORTH },
  { display: "Nordeste", value: DIRECTIONS.NORTH_EAST },
  { display: "Leste", value: DIRECTIONS.EAST },
  { display: "Sudeste", value: DIRECTIONS.SOUTH_EAST },
  { display: "Sul", value: DIRECTIONS.SOUTH },
  { display: "Sudoeste", value: DIRECTIONS.SOUTH_WEST },
  { display: "Oeste", value: DIRECTIONS.WEST },
  { display: "Noroeste", value: DIRECTIONS.NORTH_WEST },
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
  { display: "Baixa", value: HAZARDOUSNESS.LOW },
  { display: "Média", value: HAZARDOUSNESS.MEDIUM },
  { display: "Alta", value: HAZARDOUSNESS.HIGH },
  { display: "Extrema", value: HAZARDOUSNESS.EXTREME },
];
export const GetHazardousness = (value) => hazardousness.find((a) => a.value === value);

export const ROUTINE_SCHEDULES = {
  DAY: 10,
  NIGHT: 20,
};
export const routineSchedules = [
  { display: "Dia", value: ROUTINE_SCHEDULES.DAY },
  { display: "Noite", value: ROUTINE_SCHEDULES.NIGHT },
];
export const GetRoutineSchedule = (value) => routineSchedules.find((a) => a.value === value);

export const GROUP_SIZES = {
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 30,
  EXTREME: 40,
};
export const groupSizes = [
  { display: "Pequeno (1-2)", value: GROUP_SIZES.SMALL },
  { display: "Médio (2-3)", value: GROUP_SIZES.MEDIUM },
  { display: "Grande (3-4)", value: GROUP_SIZES.LARGE },
  { display: "Extremo (4-5)", value: GROUP_SIZES.EXTREME },
];
export const GetGroupSize = (value) => groupSizes.find((a) => a.value === value);

export const ENCOUNTER_FREQUENCIES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const encounterFrequencies = [
  { display: "Baixa", value: ENCOUNTER_FREQUENCIES.LOW },
  { display: "Média", value: ENCOUNTER_FREQUENCIES.MEDIUM },
  { display: "Alta", value: ENCOUNTER_FREQUENCIES.HIGH },
  { display: "Extrema", value: ENCOUNTER_FREQUENCIES.EXTREME },
];
export const GetEncounterFrequency = (value) => encounterFrequencies.find((a) => a.value === value);

export const ELEMENT_TYPES = {
  RAVINE: 10,
  LAKE: 20,
  STRUCTURE: 30,
  ROCK: 40,
  PLANT: 50,
  OBJECT: 60,
};
export const elementTypes = [
  { display: "Ravina", value: ELEMENT_TYPES.RAVINE },
  { display: "Lago", value: ELEMENT_TYPES.LAKE },
  { display: "Estrutura", value: ELEMENT_TYPES.STRUCTURE },
  { display: "Rocha", value: ELEMENT_TYPES.ROCK, canBeMaterial: true },
  { display: "Planta", value: ELEMENT_TYPES.PLANT, canBeMaterial: true },
  { display: "Objeto", value: ELEMENT_TYPES.OBJECT, canBeMaterial: true },
];
export const GetElementType = (value) => elementTypes.find((a) => a.value === value);

export const ELEMENT_MATERIAL_FREQUENCIES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const elementMaterialFrequencies = [
  { display: "Baixa", value: ELEMENT_MATERIAL_FREQUENCIES.LOW },
  { display: "Média", value: ELEMENT_MATERIAL_FREQUENCIES.MEDIUM },
  { display: "Alta", value: ELEMENT_MATERIAL_FREQUENCIES.HIGH },
  { display: "Extrema", value: ELEMENT_MATERIAL_FREQUENCIES.EXTREME },
];
export const GetElementMaterialFrequency = (value) => elementMaterialFrequencies.find((a) => a.value === value);

export const MATERIAL_EXTRACTION_DIFFICULTIES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const materialExtractionDifficulties = [
  { display: "Baixa", value: MATERIAL_EXTRACTION_DIFFICULTIES.LOW },
  { display: "Média", value: MATERIAL_EXTRACTION_DIFFICULTIES.MEDIUM },
  { display: "Alta", value: MATERIAL_EXTRACTION_DIFFICULTIES.HIGH },
  { display: "Extrema", value: MATERIAL_EXTRACTION_DIFFICULTIES.EXTREME },
];
export const GetMaterialExtractionDifficulty = (value) => materialExtractionDifficulties.find((a) => a.value === value);
