import { randomIntFromInterval as rand, randomItemFromArray as randItem, GetProfByLevel, TrimDecimalPlaces, ProbabilityCheck } from "../utils";

export const TREASURE_TYPES = ["Peças de Ouro", "Material", "Equipamento"];

//Gold pieces
export const GOLD_PIECES_QUANTITIES = ["Pouco", "Médio", "Muito", "Bastante"];
export const GOLD_PIECES_AMOUNT = "";

//materials
const uncommonItemMinPrice = 100;
const uncommonItemMaxPrice = 500;
const rareItemMinPrice = 500;
const rareItemMaxPrice = 5000;
const veryRareItemMinPrice = 5000;
const veryRareItemMaxPrice = 50000;
const legendaryItemMinPrice = 50000;
const legendaryItemMaxPrice = 200000;

const sellRate = 0.5;
const craftRate = 0.5;
const materialRate = 0.1;

export const getItemBuyPrices = [
  () => rand(uncommonItemMinPrice, uncommonItemMaxPrice),
  () => rand(rareItemMinPrice, rareItemMaxPrice),
  () => rand(veryRareItemMinPrice, veryRareItemMaxPrice),
  () => rand(legendaryItemMinPrice, legendaryItemMaxPrice),
];
export const getItemSellPrices = getItemBuyPrices.map((itemBuyPrice) => () => itemBuyPrice() / sellRate);
export const getItemCraftBuyPrices = getItemBuyPrices.map((itemBuyPrice) => () => itemBuyPrice() / craftRate);
export const getItemCraftSellPrices = getItemCraftBuyPrices.map((itemCraftBuyPrice) => () => itemCraftBuyPrice() / sellRate);
export const getMaterialBuyPrices = getItemBuyPrices.map((materialBuyPrice) => () => materialBuyPrice() / materialRate);
export const getMaterialSellPrices = getMaterialBuyPrices.map((materialSellPrice) => () => materialSellPrice() / sellRate);

export const MATERIAL_PRICE_INFLATIONS = ["Barato", "Normal", "Caro", "Abusivo"];

//Equipment
const potion = "Poçao";
export const EQUIPMENT_TYPES = ["Arma", "Armadura", "Acessório", potion];
export const EQUIPMENT_RARITIES = ["Incomum", "Raro", "Muito Raro", "Lendário"];

const offensiveAfixes = (level) => {
  const bonus = GetProfByLevel(level) / 2;

  const afixes = [
    { name: "Ataque", bonus },
    { name: "Dano", bonus },
  ];
  const probability = 1 / afixes.length;

  return afixes.map((afix) => ({ ...afix, probability }));
};

const defensiveAfixes = (level) => {
  const afixes = [
    { name: "CA", bonus: GetProfByLevel(level) / 2 },
    { name: "PV", bonus: GetProfByLevel(level) * 2 },
  ];
  const probability = 1 / afixes.length;

  return afixes.map((afix) => ({ ...afix, probability }));
};

//to avoid athletics power peaks, strength and dexterity abilities are in the same pool
// const strengthAbilities = ["Atletismo"];
// const dexterityAbilities = ["Acrobacia", "Furtividade", "Prestidigitação"];
const dexterityAbilities = ["Atletismo", "Acrobacia", "Furtividade", "Prestidigitação"];
const intelligenceAbilities = ["Arcanismo", "História", "Investigação", "Natureza", "Religião"];
const wisdomAbilities = ["Adestrar Animais", "Intuição", "Medicina", "Percepção", "Sobrevivência"];
const charismathAbilities = ["Atuação", "Enganação", "Intimidação", "Persuasão"];

const utilityAfixes = (level) => {
  const bonus = GetProfByLevel(level) / 2;

  const afixes = [
    // { name: randItem(strengthAbilities), bonus },
    { name: randItem(dexterityAbilities), bonus },
    { name: randItem(intelligenceAbilities), bonus },
    { name: randItem(wisdomAbilities), bonus },
    { name: randItem(charismathAbilities), bonus },
  ];
  const probability = 1 / afixes.length;

  return afixes.map((afix) => ({ ...afix, probability }));
};

const primaryAfixProb = 8 / 10;
const secondaryAfixProb = TrimDecimalPlaces((1 - primaryAfixProb) / 2);
const curseAfixProb = 1 / 10;

const getPulledAfixType = (afixTypes) => {
  return afixTypes
    .sort((a, b) => (a.probability > b.probability ? 1 : -1))
    .find((type, index) => ProbabilityCheck(type.probability) || index === afixTypes.length - 1)
    .type();
};

const checkAndApplyCurse = (pulledAfixes, pulledAfix, buffedAfixesBaseline) => {
  //check if it's cursed
  if (pulledAfixes.length !== 0 && ProbabilityCheck(curseAfixProb)) {
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

const formItemAfixes = (pulledAfixes, itemAfixes) => {
  pulledAfixes.forEach((afix) => {
    const foundAfix = itemAfixes.find((itemAfix) => itemAfix.name === afix.name);
    if (!foundAfix) {
      itemAfixes.push({ name: afix.name, bonus: afix.bonus });
    } else {
      foundAfix.bonus += afix.bonus;
    }
  });
};

const sortAndTrimItemAfixes = (itemAfixes) => {
  itemAfixes.sort((a, b) => (a.bonus < b.bonus ? 1 : a.bonus === b.bonus ? (a.name > b.name ? 1 : -1) : -1));

  return itemAfixes.filter((itemAfix) => itemAfix.bonus !== 0);
};

const checkAndApplyPotion = (itemType, itemAfixes) => {
  if (itemType === potion) {
    itemAfixes.forEach((afix) => (afix.bonus = afix.bonus * 2));
  }
};

const getItemName = (type, rarity, itemAfixes) => {
  let name = [type, rarity];

  if (itemAfixes.some((afix) => afix.bonus < 0)) {
    name.push("Amaldiçoado");
  }

  return name;
};

export const getItemAfixes = (level, type, rarity) => {
  let afixTypes = [{ type: () => offensiveAfixes(level) }, { type: () => defensiveAfixes(level) }, { type: () => utilityAfixes(level) }];
  const typeIndex = EQUIPMENT_TYPES.indexOf(type);

  //if not last(potion), use weighted probs
  if (typeIndex <= afixTypes.length - 1) {
    afixTypes = afixTypes.map((afix, index) => ({ ...afix, probability: index === typeIndex ? primaryAfixProb : secondaryAfixProb }));
  } else {
    afixTypes = afixTypes.map((afix) => ({ ...afix, probability: 1 / afixTypes.length }));
  }

  let pullsRemaining = EQUIPMENT_RARITIES.indexOf(rarity) + 1;
  let pulledAfixes = [];
  let utilityAfixIndex = -1;
  let buffedAfixesBaseline = {};

  while (pullsRemaining > 0) {
    const pulledAfixType = getPulledAfixType(afixTypes);

    let pulledAfix = randItem(pulledAfixType);

    // check And Apply Utility Synergy
    if (pulledAfixType.length === utilityAfixes().length) {
      if (utilityAfixIndex >= 0) {
        pulledAfix = pulledAfixType[utilityAfixIndex];
      } else {
        utilityAfixIndex = pulledAfixType.findIndex((aflixType) => aflixType.name === pulledAfix.name);
      }
    }

    checkAndApplyCurse(pulledAfixes, pulledAfix, buffedAfixesBaseline);

    pulledAfixes.push(pulledAfix);
    pullsRemaining--;
  }

  let itemAfixes = [];
  formItemAfixes(pulledAfixes, itemAfixes);

  itemAfixes = sortAndTrimItemAfixes(itemAfixes);

  checkAndApplyPotion(type, itemAfixes);

  const itemName = getItemName(type, rarity, itemAfixes);

  return { name: itemName, afixes: itemAfixes };
};
