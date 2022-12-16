import * as utils from "../utils";
import {
  goldPiecesQuantities,
  UNCOMMON_ITEM_MIN_PRICE,
  MATERIAL_PRICE_INFLATIONS,
  materialPriceInflations,
  EQUIPMENT_TYPES,
  equipmentTypes,
  CURSE_AFIX_PROB,
} from "../constants/treasureConstants";
import { creatureRarities } from "../constants/creatureConstants";

const rand = utils.randomIntFromInterval;
const avg = utils.averageOfArray;
const variance = utils.randomValueFromVariance;
const randItem = utils.randomItemFromArray;

//Gold pieces ------------------------------------

export const getGoldPiecesAmount = (quantity) => {
  const quantityIndex = goldPiecesQuantities.findIndex((gpq) => gpq.value === quantity);

  const lowerBound = getMaterialSellPrices(materialPriceInflations[quantityIndex])[quantityIndex]();
  const higherBound = getMaterialBuyPrices(materialPriceInflations[quantityIndex].value)[quantityIndex]();

  let amount = Math.round(avg([lowerBound, higherBound]));

  switch (quantityIndex) {
    case 0:
    case 1:
      amount = Math.round(amount / 2);
      break;
    case 3:
      amount = amount * 4;
      break;
    default:
      break;
  }

  return amount;
};

//materials------------------------------------

// const UNCOMMON_ITEM_MIN_PRICE = 100;
// const uncommonItemMaxPrice = 500;
// const rareItemMinPrice = 500;
// const rareItemMaxPrice = 5000;
// const veryRareItemMinPrice = 5000;
// const veryRareItemMaxPrice = 50000;
// const legendaryItemMinPrice = 50000;
// const legendaryItemMaxPrice = 200000;
const RarityFactor = 2.5;

const itemMaxPriceRate = 5;

const uncommonItemMaxPrice = UNCOMMON_ITEM_MIN_PRICE * itemMaxPriceRate;
const rareItemMinPrice = UNCOMMON_ITEM_MIN_PRICE * 1 * RarityFactor;
const rareItemMaxPrice = rareItemMinPrice * itemMaxPriceRate;
const veryRareItemMinPrice = UNCOMMON_ITEM_MIN_PRICE * 2 * RarityFactor;
const veryRareItemMaxPrice = veryRareItemMinPrice * itemMaxPriceRate;
const legendaryItemMinPrice = UNCOMMON_ITEM_MIN_PRICE * 3 * RarityFactor;
const legendaryItemMaxPrice = legendaryItemMinPrice * itemMaxPriceRate;

const sellRate = 0.5;
const craftRate = 0.5;
const materialRate = 0.1;
const inflationVariance = 0.2;

const uncommonItemCraftTimeInDays = () => rand(1, 2);
const rareItemCraftTimeInDays = () => Math.round(avg([uncommonItemCraftTimeInDays() * RarityFactor, uncommonItemCraftTimeInDays() * RarityFactor]));
const veryRareItemCraftTimeInDays = () => Math.round(avg([rareItemCraftTimeInDays() * RarityFactor, rareItemCraftTimeInDays() * RarityFactor]));
const legendaryItemCraftTimeInDays = () =>
  Math.round(avg([veryRareItemCraftTimeInDays() * RarityFactor, veryRareItemCraftTimeInDays() * RarityFactor]));
export const ITEMS_CRAFT_TIMES = [
  () => uncommonItemCraftTimeInDays(),
  () => rareItemCraftTimeInDays(),
  () => veryRareItemCraftTimeInDays(),
  () => legendaryItemCraftTimeInDays(),
];

export const getItemBuyPrices = (value) => {
  const inflationIndex = materialPriceInflations.findIndex((mpi) => mpi.value === value);
  const inflation = materialPriceInflation[inflationIndex];
  return [
    () => Math.round(variance(avg([UNCOMMON_ITEM_MIN_PRICE, uncommonItemMaxPrice]), inflationVariance) * inflation),
    () => Math.round(variance(avg([rareItemMinPrice, rareItemMaxPrice]), inflationVariance) * inflation),
    () => Math.round(variance(avg([veryRareItemMinPrice, veryRareItemMaxPrice]), inflationVariance) * inflation),
    () => Math.round(variance(avg([legendaryItemMinPrice, legendaryItemMaxPrice]), inflationVariance) * inflation),
  ];
};
export const getItemSellPrices = () =>
  getItemBuyPrices(MATERIAL_PRICE_INFLATIONS.AVERAGE).map((itemBuyPrice) => () => Math.round(itemBuyPrice() * sellRate));
export const getItemCraftBuyPrices = (inflation) => getItemBuyPrices(inflation).map((itemBuyPrice) => () => Math.round(itemBuyPrice() * craftRate));
export const getItemCraftSellPrices = () =>
  getItemCraftBuyPrices(MATERIAL_PRICE_INFLATIONS.AVERAGE).map((itemCraftBuyPrice) => () => Math.round(itemCraftBuyPrice() * sellRate));
export const getMaterialBuyPrices = (inflation) =>
  getItemBuyPrices(inflation).map((materialBuyPrice) => () => Math.round(materialBuyPrice() * materialRate));
export const getMaterialSellPrices = () =>
  getMaterialBuyPrices(MATERIAL_PRICE_INFLATIONS.AVERAGE).map((materialSellPrice) => () => Math.round(materialSellPrice() * sellRate));

const materialPriceInflation = [0.5, 1, 1.5, 2];

//Equipamento ------------------------------------

export const getItemAfixes = (type, rarity, damageType, attribute) => {
  let afixTypes = [
    { type: EQUIPMENT_TYPES.WEAPON, getAfixes: getWeaponAfixes },
    { type: EQUIPMENT_TYPES.ARMOR, getAfixes: getArmorAfixes },
    { type: EQUIPMENT_TYPES.JEWELRY, getAfixes: getJewelryAfixes },
    { type: EQUIPMENT_TYPES.POTION, getAfixes: () => [...getWeaponAfixes(), ...getArmorAfixes(), ...getJewelryAfixes()] },
  ];

  //pull
  let pullsRemaining = creatureRarities.findIndex((er) => er.value === rarity) + 1;
  let pulledAfixes = [];
  let buffedAfixesBaseline = {};

  while (pullsRemaining > 0) {
    let pulledAfix = randItem(afixTypes.find((at) => at.type === type).getAfixes());

    checkAndApplyCurse(pulledAfixes, pulledAfix, buffedAfixesBaseline);

    pulledAfixes.push(pulledAfix);
    pullsRemaining--;
  }

  //set
  let itemAfixes = getFormedItemAfixes(pulledAfixes, type, damageType, attribute);

  //name
  const itemName = getItemName(
    equipmentTypes.find((et) => et.value === type).display,
    creatureRarities.find((er) => er.value === rarity).treasureDisplay,
    itemAfixes
  );

  //add ability here after calculating mechanics and getting text
  return { name: itemName, afixes: itemAfixes };
};

const getWeaponAfixes = () => {
  const afixes = [
    { name: "Ataque", bonus: 1 },
    { name: "Dano", bonus: 2 },
    { name: "Dado Crítico", bonus: 1 },
    // { name: "Alcance dobrado", bonus: 1 },
    // { name: "Deslocamento", bonus: 3 },
    // { name: "Resis a Condição", bonus: 1 },
  ];
  const probability = 1 / afixes.length;

  return afixes.map((afix) => ({ ...afix, probability }));
};

const getArmorAfixes = () => {
  const afixes = [
    { name: "CA", bonus: 1 },
    { name: "PV Máximo", bonus: 6 },
    { name: "Redução de Dano", bonus: 3 },
  ];
  const probability = 1 / afixes.length;

  return afixes.map((afix) => ({ ...afix, probability }));
};

const getJewelryAfixes = () => {
  const afixes = [
    { name: "TR", bonus: 1 },
    { name: "Habilidades", bonus: 2 },
    { name: "Idioma", bonus: 1 },
  ];
  const probability = 1 / afixes.length;

  return afixes.map((afix) => ({ ...afix, probability }));
};

const checkAndApplyCurse = (pulledAfixes, pulledAfix, buffedAfixesBaseline) => {
  //check if it's cursed
  if (pulledAfixes.length !== 0 && utils.ProbabilityCheck(CURSE_AFIX_PROB)) {
    //curse this afix
    pulledAfix.bonus = pulledAfix.bonus * -1;

    //buff one of previous non-cursed afixes
    const buffCandidates = pulledAfixes.filter((afix) => afix.bonus > 0);
    const buffAfix = randItem(buffCandidates);

    // add to array of base values if not yet in there
    if (!buffedAfixesBaseline.hasOwnProperty(buffAfix.name)) {
      buffedAfixesBaseline[buffAfix.name] = buffAfix.bonus;
    }

    const buffAfixIndex = pulledAfixes.findIndex((afix) => afix.name === buffAfix.name);
    pulledAfixes[buffAfixIndex].bonus += buffedAfixesBaseline[buffAfix.name] * 2;
  }
};

const getFormedItemAfixes = (pulledAfixes, type, damageType, attribute) => {
  let formedItemAfixes = [];
  pulledAfixes.forEach((afix) => {
    const foundAfix = formedItemAfixes.find((itemAfix) => itemAfix.name === afix.name);
    if (foundAfix) {
      foundAfix.bonus += afix.bonus;
    } else {
      formedItemAfixes.push({ name: afix.name, bonus: afix.bonus });
    }
  });

  formedItemAfixes = sortAndTrimItemAfixes(formedItemAfixes);
  applyPotionBonusIfNeeded(formedItemAfixes, type);

  return formedItemAfixes;
};

const sortAndTrimItemAfixes = (itemAfixes) => {
  itemAfixes.sort((a, b) => (a.bonus < b.bonus ? 1 : a.bonus === b.bonus ? (a.name > b.name ? 1 : -1) : -1));

  return itemAfixes.filter((itemAfix) => itemAfix.bonus !== 0);
};

const applyPotionBonusIfNeeded = (itemAfixes, type) => {
  if (type === EQUIPMENT_TYPES.POTION) {
    itemAfixes.forEach((afix) => (afix.bonus = afix.bonus * 2));
  }
};

const getItemName = (type, rarity, itemAfixes) => {
  let name = [type, rarity];

  const isCursed = itemAfixes.some((afix) => afix.bonus < 0);
  if (isCursed) {
    name.push("Amaldiçoado");
  }

  return name;
};
