import * as utils from "../utils";
import * as cc from "../constants/creatureConstants";
import * as tc from "../constants/treasureConstants";
import { MIN_DIFICULTY } from "../constants/skillCheckConstants";
import * as sch from "./skillCheckHelper";

export function IsBasicPack(owner) {
  return owner === "basicPack";
}

export function GetProfByLevel(level) {
  return Math.floor(2 + (level - 1) / 4);
}

export function GetAttributeMod(attribute) {
  return Math.floor((attribute - 10) / 2);
}

export const GetXpValue = (level) => {
  const baseOutput = cc.creatureXps[level - 1];
  return baseOutput ?? 999999;
};

export const GetRarityDisplay = (value) => {
  return cc.creatureRarities.find((a) => a.value === value).display;
};

export const GetAttributeDisplay = (value) => {
  return cc.creatureAttributes.find((a) => a.value === value).display;
};
export const GetAttributeValue = (attribute) => {
  const baseValue = cc.creatureAttributes.find((a) => a.value === attribute).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 2);
};

export const GetACDisplay = (value) => {
  return cc.creatureArmorClasses.find((a) => a.value === value).display;
};
export const GetACValue = (armorClass) => {
  const baseValue = cc.creatureArmorClasses.find((ac) => ac.value === armorClass).baseOutput;
  return Math.max(10, utils.randomValueFromVarianceInt(baseValue, 1));
};

export const GetAttackBonusDisplay = (value) => {
  return cc.creatureAttacks.find((a) => a.value === value).display;
};
export const GetAttackBonusValue = (attack, level) => {
  const baseValue = cc.creatureAttacks.find((ac) => ac.value === attack).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 1) + GetProfByLevel(level);
};

export const GetHPDisplay = (value) => {
  return cc.creatureHitPoints.find((a) => a.value === value).display;
};
export const GetHPValue = (level, HP, con) => {
  const conValue = cc.creatureAttributes.find((a) => a.value === con).baseOutput;

  const baseHp = sch.getDamage(level, HP);
  let hp = (baseHp * conValue) / 2;
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

export const GetInitiativeDisplay = (value) => {
  return cc.creatureInitiatives.find((a) => a.value === value).display;
};
export const GetInitiativeValue = (initiative) => {
  const baseValue = cc.creatureInitiatives.find((i) => i.value === initiative).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 2);
};

export const GetSpeedDisplay = (value) => {
  if (value == null) {
    return null;
  }

  return cc.creatureSpeedMovements.find((a) => a.value === value).display;
};
export const GetSpeedValue = (speed) => {
  if (speed == null) {
    return null;
  }

  const baseValue = cc.creatureSpeedMovements.find((m) => m.value === speed).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};

export const GetFlyingDisplay = (value) => {
  if (value == null) {
    return null;
  }

  return cc.creatureFlyingMovements.find((a) => a.value === value).display;
};
export const GetFlyingValue = (flying) => {
  if (flying == null) {
    return null;
  }

  const baseValue = cc.creatureFlyingMovements.find((m) => m.value === flying).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};

export const GetSwimmingDisplay = (value) => {
  if (value == null) {
    return null;
  }

  return cc.creatureSwimmingMovements.find((a) => a.value === value).display;
};
export const GetSwimmingValue = (swimming) => {
  if (swimming == null) {
    return null;
  }

  const baseValue = cc.creatureSwimmingMovements.find((m) => m.value === swimming).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};

export const GetBurrowingDisplay = (value) => {
  if (value == null) {
    return null;
  }

  return cc.creatureBurrowingMovements.find((a) => a.value === value).display;
};
export const GetBurrowingValue = (burrowing) => {
  if (burrowing == null) {
    return null;
  }

  const baseValue = cc.creatureBurrowingMovements.find((m) => m.value === burrowing).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};

export const GetSenseDisplay = (value) => {
  if (value == null) {
    return null;
  }

  return cc.creatureSenseReaches.find((a) => a.value === value).display;
};
export const GetSenseValue = (sense) => {
  if (sense == null) {
    return null;
  }

  const baseValue = cc.creatureSenseReaches.find((s) => s.value === sense).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};

export const GetPrimaryAlignmentDisplay = (value) => {
  return cc.creaturePrimaryAlignments.find((a) => a.value === value).display;
};
export const GetSecondaryAlignmentDisplay = (value) => {
  return cc.creatureSecondaryAlignments.find((a) => a.value === value).display;
};

export const GetRaceDisplay = (value) => {
  if (value == null) {
    return null;
  }

  return cc.creatureRaces.find((r) => r.value === value).display;
};

export const GetClassDisplay = (value) => {
  if (value == null) {
    return null;
  }

  return cc.creatureClasses.find((c) => c.value === value).display;
};

export const GetSubClassDisplay = (cClass, subClass) => {
  if (cClass == null || subClass == null) {
    return null;
  }

  return cc.creatureClasses.find((c) => c.value === cClass).subClasses.find((sc) => sc.value === subClass).display;
};

export const GetTypeDisplay = (value) => {
  return cc.creatureTypes.find((t) => t.value === value).display;
};

export const GetEnviromentDisplay = (value) => {
  return cc.creatureEnvironments.find((e) => e.value === value).display;
};

export const GetSizeDisplay = (value) => {
  return cc.creatureSizes.find((s) => s.value === value).display;
};

export const GetLegendaryResistenciesDisplay = (value) => {
  if (value == null) {
    return null;
  }

  return cc.creatureLegendaryResistences.find((lr) => lr.value === value).display;
};
export const GetLegendaryResistenciesValue = (lLegendaryResistency) => {
  if (lLegendaryResistency == null) {
    return null;
  }

  const baseOutput = cc.creatureLegendaryResistences.find((lr) => lr.value === lLegendaryResistency).totalNumber;
  return baseOutput;
};

export const GetLanguageDisplay = (value) => {
  return cc.languages.find((s) => s.value === value).display;
};

export const GetRegenerationAmountDisplay = (value) => {
  if (value == null) {
    return null;
  }

  return cc.creatureRegenerations.find((r) => r.value === value).display;
};
export const GetRegenerationAmountValue = (amount) => {
  if (amount == null) {
    return null;
  }

  const baseOutput = cc.creatureRegenerations.find((r) => r.value === amount).amount;
  return baseOutput;
};

export const GetCustomSpecialMultiplierDisplay = (value) => {
  if (value == null) {
    return null;
  }

  return cc.creatureCustomSpecialMultipliers.find((s) => s.value === value).display;
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

export const GetDamageTypeDisplay = (damageType) => {
  return cc.damageTypes.find((dt) => dt.value === damageType).display;
};

export const GetReactionsPerRoundDisplay = (rpr) => {
  return cc.creatureReactionsPerRound.find((crpr) => crpr.value === rpr).display;
};
export const GetReactionsPerRoundValue = (rpr) => {
  const baseOutput = cc.creatureReactionsPerRound.find((crpr) => crpr.value === rpr).number;
  return baseOutput;
};

export const GetAuraReachDisplay = (value) => {
  return cc.creatureAuraReaches.find((s) => s.value === value).display;
};
export const GetAuraReachValue = (reach) => {
  const baseOutput = cc.creatureAuraReaches.find((r) => r.value === reach).baseOutput;
  return baseOutput;
};
export const GetActionReachValue = (reach, type) => {
  const baseOutput = cc.creatureActionTypes.find((t) => t.value === type).reaches.find((r) => r.value === reach).display;
  return baseOutput;
};

export const GetDCValue = (difficultyClass, level) => {
  const baseValue = cc.difficultyClasses.find((dc) => dc.value === difficultyClass).baseOutput;
  return Math.max(MIN_DIFICULTY, utils.randomValueFromVarianceInt(baseValue, 1) + GetProfByLevel(level));
};

export const GetSavingThrowAttributeDisplay = (attribute) => {
  return cc.creatureAttributeNames.find((dt) => dt.value === attribute).display;
};

export const GetConditionDisplay = (condition) => {
  return cc.conditions.find((dt) => dt.value === condition).display;
};

export const GetConditionDurationValue = (conditionDuration) => {
  const baseOutput = cc.conditionDurations.find((dt) => dt.value === conditionDuration).baseOutput;
  return baseOutput;
};

export const GetReactionTriggerDisplay = (trigger) => {
  return cc.creatureReactionTriggers.find((dt) => dt.value === trigger).display;
};

export const GetActionFrequencyDisplay = (frequency) => {
  return cc.creatureActionFrequencies.find((dt) => dt.value === frequency).display;
};

export const GetActionSpellValue = (frequency, level) => {
  const highestSpellSlotLevelAvailable = Math.min(9, Math.ceil(level / 2));
  const reducer = cc.creatureActionFrequencies.length - 1 - cc.creatureActionFrequencies.findIndex((f) => f.value === frequency);
  return Math.min(1, highestSpellSlotLevelAvailable - reducer);
};

export const GetTreasureTypeDisplay = (value) => {
  return tc.treasureTypes.find((s) => s.value === value).display;
};
