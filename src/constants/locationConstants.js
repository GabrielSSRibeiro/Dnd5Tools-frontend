export const LOCATION_SIZES = {
  POINT_OF_INTEREST: 10,
  SMALL: 20,
  MEDIUM: 30,
  LARGE: 40,
  EXTREME: 50,
};
export const locationSizes = [
  { display: "Ponto de Interesse", value: LOCATION_SIZES.POINT_OF_INTEREST },
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

export const LOCATION_CONNECTIONS = {
  ROAD: 10,
  RIVER: 20,
};
export const locationConnections = [
  { display: "Estrada", value: LOCATION_CONNECTIONS.ROAD },
  { display: "Rio", value: LOCATION_CONNECTIONS.RIVER },
];
export const GetLocationConnection = (value) => locationConnections.find((a) => a.value === value);

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

export const PACK_SIZES = {
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 30,
  EXTREME: 40,
};
export const packSizes = [
  { display: "Pequena", value: PACK_SIZES.SMALL },
  { display: "Média", value: PACK_SIZES.MEDIUM },
  { display: "Grande", value: PACK_SIZES.LARGE },
  { display: "Extrema", value: PACK_SIZES.EXTREME },
];
export const GetPackSize = (value) => packSizes.find((a) => a.value === value);

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

export const POINT_OF_INTEREST_TYPES = {
  RAVINE: 10,
  LAKE: 20,
  STRUCTURE: 30,
  ROCK: 40,
  PLANT: 50,
  OBJECT: 60,
};
export const pointOfInterestTypes = [
  { display: "Ravina", value: POINT_OF_INTEREST_TYPES.RAVINE },
  { display: "Lago", value: POINT_OF_INTEREST_TYPES.LAKE },
  { display: "Estrutura", value: POINT_OF_INTEREST_TYPES.STRUCTURE },
  { display: "Rocha", value: POINT_OF_INTEREST_TYPES.ROCK },
  { display: "Planta", value: POINT_OF_INTEREST_TYPES.PLANT },
  { display: "Objeto", value: POINT_OF_INTEREST_TYPES.OBJECT },
];
export const GetPointOfInterestType = (value) => pointOfInterestTypes.find((a) => a.value === value);

export const POINT_OF_INTEREST_MATERIAL_FREQUENCIES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const pointOfInterestMaterialFrequencies = [
  { display: "Baixa", value: POINT_OF_INTEREST_MATERIAL_FREQUENCIES.LOW },
  { display: "Média", value: POINT_OF_INTEREST_MATERIAL_FREQUENCIES.MEDIUM },
  { display: "Alta", value: POINT_OF_INTEREST_MATERIAL_FREQUENCIES.HIGH },
  { display: "Extrema", value: POINT_OF_INTEREST_MATERIAL_FREQUENCIES.EXTREME },
];
export const GetPointOfInterestMaterialFrequency = (value) => pointOfInterestMaterialFrequencies.find((a) => a.value === value);

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
