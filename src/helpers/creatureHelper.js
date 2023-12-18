import * as utils from "../utils";
import * as cc from "../constants/creatureConstants";
import { MIN_DIFICULTY } from "../constants/skillCheckConstants";
import * as sch from "./skillCheckHelper";

export function IsBasicPack(owner) {
  return owner === "basicPack";
}

export function GetProfByLevel(level) {
  return Math.floor(2 + (level - 1) / 4);
}

export function GetAverageLevel(rarity) {
  const { baseOutputMin, baseOutputMax } = cc.GetRarity(rarity);
  return Math.ceil((baseOutputMin + baseOutputMax) / 2);
}

export function GetAttributeMod(attribute) {
  return Math.floor((attribute - 10) / 2);
}

export const GetXpValue = (level) => {
  const baseOutput = cc.creatureXps[level - 1];
  return baseOutput ?? 999999;
};

export const GetAttributeValue = (attribute) => {
  const baseValue = cc.GetAttribute(attribute).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 2);
};

export const GetACValue = (armorClass) => {
  const baseValue = cc.GetArmorClass(armorClass).baseOutput;
  return Math.max(10, utils.randomValueFromVarianceInt(baseValue, cc.CREATURE_ARMOR_CLASS_VARIANCE));
};

export const GetAttackBonusValue = (attack, level) => {
  const baseValue = cc.GetAttackBonus(attack).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, cc.CREATURE_ATTACK_VARIANCE) + GetProfByLevel(level);
};

export const GetHPValue = (level, HP, con) => {
  const conValue = cc.creatureAttributes.find((a) => a.value === con).baseOutput;

  const baseHp = sch.getDamage(HP, level);
  const balanceFactor = 3;
  let hp = (baseHp * conValue) / balanceFactor;
  const hpVariance = 0.1;
  return utils.randomValueFromVariancePercentage(hp, hpVariance);

  // [3, 12, 20].forEach((level) => {
  //   console.log("level:", level);
  //   cc.creatureHitPoints.forEach((hp) => {
  //     cc.creatureAttributes.forEach((a) => {
  //       console.log(`hp(${hp.display})/con(${a.display}):`, GetHPValue(level, hp.value, a.value));
  //     });
  //   });
  // });
};

export const GetInitiativeValue = (initiative) => {
  const baseValue = cc.GetInitiative(initiative).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, cc.CREATURE_INITIATIVE_VARIANCE);
};

export const GetSpeedValue = (speed) => {
  if (speed == null) {
    return null;
  }

  const baseValue = cc.GetSpeed(speed).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};

export const GetFlyingValue = (flying) => {
  if (flying == null) {
    return null;
  }

  const baseValue = cc.GetFlying(flying).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};

export const GetSwimmingValue = (swimming) => {
  if (swimming == null) {
    return null;
  }

  const baseValue = cc.GetSwimming(swimming).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};

export const GetBurrowingValue = (burrowing) => {
  if (burrowing == null) {
    return null;
  }

  const baseValue = cc.GetBurrowing(burrowing).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};

export const GetSenseValue = (sense) => {
  if (sense == null) {
    return null;
  }

  const baseValue = cc.GetSense(sense).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};

export const GetLegendaryResistenciesValue = (legendaryResistency) => {
  if (legendaryResistency == null) {
    return null;
  }

  const baseOutput = cc.GetLegendaryResistency(legendaryResistency).totalNumber;
  return baseOutput;
};

export const GetRegenerationAmountValue = (amount) => {
  if (amount == null) {
    return null;
  }

  const baseOutput = cc.GetRegenerationAmount(amount).amount;
  return baseOutput;
};

export const GetCustomSpecialsForDisplay = (customSpecials) => {
  let customSpecialsForDisplay = customSpecials.filter((cs) => cs.description).map((cs) => cs.description);

  while (customSpecialsForDisplay.length > 3) {
    let shorterDescIndex = customSpecialsForDisplay.indexOf(customSpecialsForDisplay.reduce((a, b) => (a.length <= b.length ? a : b)));
    customSpecialsForDisplay[shorterDescIndex] += `, ${customSpecialsForDisplay[3]}`;
    customSpecialsForDisplay.splice(3, 1);
  }

  return customSpecialsForDisplay;
};

export const GetReactionsPerRoundValue = (rpr) => {
  const baseOutput = cc.GetReactionsPerRound(rpr).number;
  return baseOutput;
};

export const GetAuraReachValue = (reach) => {
  const baseOutput = cc.GetAuraReach(reach).baseOutput;
  return baseOutput;
};

export const GetActionReachValue = (reach, type) => {
  const baseOutput = cc.GetCreatureActionType(type).reaches.find((r) => r.value === reach).display;
  return baseOutput;
};

export const GetDCValue = (difficultyClass, level = null) => {
  const baseValue = cc.GetDifficultyClass(difficultyClass).baseOutput;
  return Math.max(MIN_DIFICULTY, utils.randomValueFromVarianceInt(baseValue, 1) + GetProfByLevel(level ?? 10));
};

export const GetConditionDurationValue = (conditionDuration) => {
  const baseOutput = cc.GetConditionDuration(conditionDuration).baseOutput;
  return baseOutput;
};

export const GetActionSpellValue = (frequency, level) => {
  const highestSpellSlotLevelAvailable = Math.min(9, Math.ceil(level / 2));
  const reducer = cc.creatureActionFrequencies.length - 1 - cc.creatureActionFrequencies.findIndex((f) => f.value === frequency);
  return Math.min(1, highestSpellSlotLevelAvailable - reducer);
};
