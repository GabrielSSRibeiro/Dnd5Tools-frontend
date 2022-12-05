import * as utils from "../utils";

export const DEFAULT_TREASURE_TYPE = "Material";
export const TREASURE_TYPES = ["Peças de Ouro", DEFAULT_TREASURE_TYPE, "Equipamento"];

export const DEFAULT_GOLD_PIECES_QUANTITIES = "Médio";
export const GOLD_PIECES_QUANTITIES = ["Pouco", DEFAULT_GOLD_PIECES_QUANTITIES, "Muito", "Bastante"];

export const UNCOMMON_ITEM_MIN_PRICE = 300;

export const DEFAULT_MATERIAL_PRICE_INFLATIONS = "Normal";
export const MATERIAL_PRICE_INFLATIONS = ["Barato", DEFAULT_MATERIAL_PRICE_INFLATIONS, "Caro", "Abusivo"];

export const EQUIPMENT_TYPES = ["Arma", "Armadura", "Acessório", "Poçao"];
export const EQUIPMENT_RARITIES = ["Comum", "Incomum", "Raro", "Muito Raro"];

export const PRIMARY_AFIX_PROB = 8 / 10;
export const SECONDARY_AFIX_PROB = utils.TrimDecimalPlaces((1 - PRIMARY_AFIX_PROB) / 2);
export const CURSE_AFIX_PROB = 1 / 10;
