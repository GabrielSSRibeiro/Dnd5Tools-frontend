import * as utils from "../utils";

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

export const EQUIPMENT_TYPES = {
  WEAPON: 10,
  ARMOR: 20,
  JEWELRY: 30,
  POTION: 40,
};
export const equipmentTypes = [
  { display: "Arma", value: EQUIPMENT_TYPES.WEAPON },
  { display: "Armadura", value: EQUIPMENT_TYPES.ARMOR },
  { display: "Acessório", value: EQUIPMENT_TYPES.JEWELRY },
  { display: "Poçao", value: EQUIPMENT_TYPES.POTION },
];

export const EQUIPMENT_RARITIES = {
  COMMON: 10,
  UNCOMMON: 20,
  RARE: 30,
  VERY_RATRE: 40,
};
export const equipmentRarities = [
  { display: "Comum", value: EQUIPMENT_RARITIES.COMMON },
  { display: "Incomum", value: EQUIPMENT_RARITIES.UNCOMMON },
  { display: "Raro", value: EQUIPMENT_RARITIES.RARE },
  { display: "Muito Raro", value: EQUIPMENT_RARITIES.VERY_RATRE },
];

export const PRIMARY_AFIX_PROB = 8 / 10;
export const SECONDARY_AFIX_PROB = utils.TrimDecimalPlaces((1 - PRIMARY_AFIX_PROB) / 2);
export const CURSE_AFIX_PROB = 1 / 10;
