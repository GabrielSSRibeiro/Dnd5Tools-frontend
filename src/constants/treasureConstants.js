export const TREASURE_TYPES = {
  GOLD_PIECES: 10,
  MATERIAL: 20,
  EQUIPMENT: 30,
};
export const treasureTypes = [
  { display: "Peças de Ouro", value: TREASURE_TYPES.GOLD_PIECES },
  { display: "Material", value: TREASURE_TYPES.MATERIAL },
  { display: "Equipamento", value: TREASURE_TYPES.EQUIPMENT },
];
export const GetTreasureType = (value) => treasureTypes.find((s) => s.value === value);

export const GOLD_PIECES_QUANTITIES = {
  FEW: 10,
  AVERAGE: 20,
  SEVERAL: 30,
  MANY: 40,
};
export const goldPiecesQuantities = [
  { display: "Pouco", value: GOLD_PIECES_QUANTITIES.FEW },
  { display: "Médio", value: GOLD_PIECES_QUANTITIES.AVERAGE },
  { display: "Muito", value: GOLD_PIECES_QUANTITIES.SEVERAL },
  { display: "Bastante", value: GOLD_PIECES_QUANTITIES.MANY },
];
export const GetGoldPiecesQuantity = (value) => goldPiecesQuantities.find((s) => s.value === value);

export const UNCOMMON_ITEM_MIN_PRICE = 300;

export const MATERIAL_PRICE_INFLATIONS = {
  CHEAP: 10,
  AVERAGE: 20,
  EXPENSIVE: 30,
  ABUSIVE: 40,
};
export const materialPriceInflations = [
  { display: "Barato", value: MATERIAL_PRICE_INFLATIONS.CHEAP },
  { display: "Normal", value: MATERIAL_PRICE_INFLATIONS.AVERAGE },
  { display: "Caro", value: MATERIAL_PRICE_INFLATIONS.EXPENSIVE },
  { display: "Abusivo", value: MATERIAL_PRICE_INFLATIONS.ABUSIVE },
];
export const GetMaterialPriceInflation = (value) => materialPriceInflations.find((s) => s.value === value);

export const MATERIAL_QUANTITIES = {
  FEW: 10,
  AVERAGE: 20,
  SEVERAL: 30,
  MANY: 40,
};
export const materialQuantities = [
  { display: "Pouco (1 tentativa)", resultDisplay: "1 tentativa", value: MATERIAL_QUANTITIES.FEW },
  { display: "Médio (2 tentativas)", resultDisplay: "2 tentativas", value: MATERIAL_QUANTITIES.AVERAGE },
  { display: "Muito (3 tentativas)", resultDisplay: "3 tentativas", value: MATERIAL_QUANTITIES.SEVERAL },
  { display: "Bastante (4 tentativas)", resultDisplay: "4 tentativas", value: MATERIAL_QUANTITIES.MANY },
];
export const GetMaterialQuantity = (value) => materialQuantities.find((s) => s.value === value);

export const MATERIAL_WEIGHTS = {
  IRRELEVANT: 10,
  LIGHT: 20,
  MEDIUM: 30,
  HEAVY: 40,
  EXTREME: 50,
};
export const materialWeigths = [
  { display: "Irrelevante", resultDisplay: "0 kg", value: MATERIAL_WEIGHTS.IRRELEVANT },
  { display: "Leve (5kg)", resultDisplay: "5 kg", value: MATERIAL_WEIGHTS.LIGHT },
  { display: "Médio (10kg)", resultDisplay: "10 kg", value: MATERIAL_WEIGHTS.MEDIUM },
  { display: "Pesado (30kg)", resultDisplay: "30 kg", value: MATERIAL_WEIGHTS.HEAVY },
  { display: "Extremo (70kg)", resultDisplay: "70 kg", value: MATERIAL_WEIGHTS.EXTREME },
];
export const GetMaterialWeigth = (value) => materialWeigths.find((s) => s.value === value);

export const EQUIPMENT_TYPES = {
  WEAPON: 10,
  ARMOR: 20,
  JEWELRY: 30,
  CONSUMABLE: 40,
};
export const equipmentTypes = [
  { display: "Arma", value: EQUIPMENT_TYPES.WEAPON },
  { display: "Armadura", value: EQUIPMENT_TYPES.ARMOR },
  { display: "Acessório", value: EQUIPMENT_TYPES.JEWELRY },
  { display: "Consumível", value: EQUIPMENT_TYPES.CONSUMABLE },
];
export const GetEquipmentType = (value) => equipmentTypes.find((s) => s.value === value);

export const EQUIPMENT_ATTRIBUTES = {
  STRENGTH: 10,
  DEXTERITY: 20,
  CONSTITUTION: 30,
  INTELLIGENCE: 40,
  WISDOM: 50,
  CHARISMA: 60,
};
export const equipmentAttributes = [
  { display: "Força", resultDisplay: "Habilidades de Força", value: EQUIPMENT_ATTRIBUTES.STRENGTH },
  { display: "Destreza", resultDisplay: "Habilidades de Destreza", value: EQUIPMENT_ATTRIBUTES.DEXTERITY },
  // { display: "Constituição", resultDisplay: "Habilidades de Força", value: EQUIPMENT_ATTRIBUTES.CONSTITUTION },
  { display: "Inteligência", resultDisplay: "Habilidades de Inteligência", value: EQUIPMENT_ATTRIBUTES.INTELLIGENCE },
  { display: "Sabedoria", resultDisplay: "Habilidades de Sabedoria", value: EQUIPMENT_ATTRIBUTES.WISDOM },
  { display: "Carisma", resultDisplay: "Habilidades de Carisma", value: EQUIPMENT_ATTRIBUTES.CHARISMA },
];
export const GetEquipmentAttribute = (value) => equipmentAttributes.find((s) => s.value === value);

export const CURSE_AFIX_PROB = 0.1;
