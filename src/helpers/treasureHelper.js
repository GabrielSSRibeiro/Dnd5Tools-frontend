import * as utils from "../utils";
import {
  goldPiecesQuantities,
  UNCOMMON_ITEM_MIN_PRICE,
  MATERIAL_PRICE_INFLATIONS,
  materialPriceInflations,
  EQUIPMENT_TYPES,
  equipmentTypes,
  equipmentAttributes,
  CURSE_AFIX_PROB,
} from "../constants/treasureConstants";
import { creatureRarities, damageTypes, conditions } from "../constants/creatureConstants";

const rand = utils.randomIntFromInterval;
const avg = utils.averageOfArray;
const variance = utils.randomValueFromVariancePercentage;
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

//book refs
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
  const inflation = materialPriceInflationRatios[inflationIndex];
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

const materialPriceInflationRatios = [0.5, 1, 1.5, 2];

//Equipamento ------------------------------------

export const getItemAfixes = (type, rarity, damageType, attribute) => {
  let afixTypes = [
    { type: EQUIPMENT_TYPES.WEAPON, getAfixes: () => getWeaponAfixes(damageType) },
    { type: EQUIPMENT_TYPES.ARMOR, getAfixes: () => getArmorAfixes(damageType) },
    { type: EQUIPMENT_TYPES.JEWELRY, getAfixes: () => getJewelryAfixes(attribute) },
    {
      type: EQUIPMENT_TYPES.POTION,
      getAfixes: () => [...getWeaponAfixes(damageType), ...getArmorAfixes(damageType), ...getJewelryAfixes(attribute)],
    },
  ];

  //pull
  let pullsRemaining = creatureRarities.findIndex((er) => er.value === rarity) + 1;
  let pulledAfixes = [];
  let buffedAfixesBaseline = {};

  while (pullsRemaining > 0) {
    const pullOptions = afixTypes.find((at) => at.type === type).getAfixes();
    let pulledAfix = pullOptions[utils.randomIndexFromArrayOfProbs(pullOptions.map((o) => o.probability))];

    if (pulledAfix.isMutable) {
      checkAndApplyCurse(pulledAfixes, pulledAfix, buffedAfixesBaseline);
    }

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

export const getWeaponAfixes = (damageType) => {
  const afixes = [
    {
      name: "Ataque",
      bonus: 1,
      bonusNames: null,
      ignoreBonusNameIfCursed: false,
      probability: 0.3,
      isMutable: true,
      isAggregatable: true,
      infoDisplay: "Ataque",
    },
    {
      name: "Dano",
      bonus: 1,
      bonusNames: damageType ? [damageTypes.find((dt) => dt.value === damageType).display] : null,
      ignoreBonusNameIfCursed: true,
      probability: 0.3,
      isMutable: true,
      isAggregatable: true,
      infoDisplay: "Dano",
    },
    {
      name: "Dado Crítico",
      bonus: 1,
      bonusNames: null,
      ignoreBonusNameIfCursed: false,
      probability: 0.2,
      isMutable: true,
      isAggregatable: true,
      infoDisplay: "Dado Crítico Extra",
    },
    {
      name: "Alcance/Empurra",
      bonus: 1.5,
      bonusNames: null,
      ignoreBonusNameIfCursed: false,
      probability: 0.2,
      isMutable: false,
      isAggregatable: true,
      infoDisplay: "Alcance Corpo a Corpo/Empurra a distância",
    },
  ];

  return afixes;
};

export const getArmorAfixes = (damageType) => {
  const afixes = [
    {
      name: "CA",
      bonus: 1,
      bonusNames: null,
      ignoreBonusNameIfCursed: false,
      probability: 0.2,
      isMutable: true,
      isAggregatable: true,
      infoDisplay: "CA",
    },
    {
      name: "PV Máximo",
      bonus: 6,
      bonusNames: null,
      ignoreBonusNameIfCursed: false,
      probability: 0.3,
      isMutable: true,
      isAggregatable: true,
      infoDisplay: "PV Máximo",
    },
    {
      name: "Deslocamento Base",
      bonus: 3,
      bonusNames: ["m"],
      ignoreBonusNameIfCursed: false,
      probability: 0.25,
      isMutable: true,
      isAggregatable: true,
      infoDisplay: "Deslocamento Base",
    },
    {
      name: "Redução de Dano",
      bonus: 3,
      bonusNames: damageType ? [damageTypes.find((dt) => dt.value === damageType).display] : null,
      ignoreBonusNameIfCursed: false,
      probability: 0.25,
      isMutable: false,
      isAggregatable: true,
      infoDisplay: "Redução de Dano",
    },
  ];

  return afixes;
};

export const getJewelryAfixes = (attribute) => {
  const afixes = [
    {
      name: "Teste Resistência",
      bonus: 1,
      bonusNames: attribute ? [equipmentAttributes.find((ea) => ea.value === attribute).display] : null,
      ignoreBonusNameIfCursed: false,
      probability: 0.2,
      isMutable: true,
      isAggregatable: true,
      infoDisplay: "TR",
    },
    {
      name: "Habilidades",
      bonus: 2,
      bonusNames: attribute ? [equipmentAttributes.find((ea) => ea.value === attribute).display] : null,
      ignoreBonusNameIfCursed: false,
      probability: 0.3,
      isMutable: true,
      isAggregatable: true,
      infoDisplay: "Habilidades",
    },
    {
      name: "CD",
      bonus: 1,
      bonusNames: attribute ? [equipmentAttributes.find((ea) => ea.value === attribute).display] : null,
      ignoreBonusNameIfCursed: false,
      probability: 0.25,
      isMutable: true,
      isAggregatable: true,
      infoDisplay: "CD",
    },
    {
      name: "Resis. Condição",
      bonus: null,
      bonusNames: conditions.map((c) => c.display),
      ignoreBonusNameIfCursed: false,
      probability: 0.25,
      isMutable: false,
      isAggregatable: false,
      infoDisplay: "Resistência a Condição",
    },
  ];

  return afixes;
};

const checkAndApplyCurse = (pulledAfixes, pulledAfix, buffedAfixesBaseline) => {
  //check if it's cursed
  if (pulledAfixes.length !== 0 && !pulledAfixes.every((a) => a.bonus == null) && utils.ProbabilityCheck(CURSE_AFIX_PROB)) {
    //curse this afix
    pulledAfix.bonus = pulledAfix.bonus * -1;

    //buff one of previous non-cursed afixes
    const buffCandidates = pulledAfixes.filter((afix) => afix.bonus > 0);
    const buffAfix = randItem(buffCandidates);

    // add to obj of base values if not yet in there
    if (buffedAfixesBaseline[buffAfix.name] == null) {
      buffedAfixesBaseline[buffAfix.name] = buffAfix.bonus;
    }

    const buffedAfixIndex = pulledAfixes.findIndex((afix) => afix.name === buffAfix.name);
    pulledAfixes[buffedAfixIndex].bonus += buffedAfixesBaseline[buffAfix.name] * 2;
  }
};

const getFormedItemAfixes = (pulledAfixes, type) => {
  let formedItemAfixes = [];
  pulledAfixes.forEach((afix) => {
    const foundAfix = formedItemAfixes.find((itemAfix) => itemAfix.name === afix.name && itemAfix.isAggregatable);
    if (foundAfix) {
      foundAfix.bonus += afix.bonus;
    } else {
      formedItemAfixes.push(utils.clone(afix));
    }
  });

  formedItemAfixes = sortAndTrimItemAfixes(formedItemAfixes);
  applyPotionBonusIfNeeded(formedItemAfixes, type);

  updateBonusIfNeeded(formedItemAfixes);

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

const updateBonusIfNeeded = (itemAfixes) => {
  itemAfixes.forEach((a) => {
    let bonusName = randItem(a.bonusNames);
    if (itemAfixes.some((a) => a.bonus === bonusName)) {
      bonusName = "Outro";
    }

    if (a.bonus > 0) {
      a.bonus = "+" + a.bonus;
    } else if (a.ignoreBonusNameIfCursed) {
      bonusName = null;
    }

    if (bonusName) {
      a.bonus = a.bonus ? `${a.bonus} ${bonusName}` : bonusName;
    }
  });
};

const getItemName = (type, rarity, itemAfixes) => {
  let name = [type, rarity];

  const isCursed = itemAfixes.some((afix) => afix.bonus < 0);
  if (isCursed) {
    name.push("Amaldiçoado");
  }

  return name;
};
