import * as utils from "../utils";
import * as cc from "../constants/creatureConstants";
import * as sch from "./skillCheckHelper";

export function GetProfByLevel(level) {
  return Math.floor(2 + (level - 1) / 4);
}

export function GetAttributeMod(attribute) {
  return Math.floor((attribute - 10) / 2);
}

export const GetXpValue = (level) => {
  const baseOutput = cc.creatureXps[level - 1];
  return baseOutput;
};

export const GetAttributeValue = (attribute) => {
  const baseValue = cc.creatureAttributes.find((a) => a.value === attribute).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 2);
};

export const GetACValue = (armorClass) => {
  const baseValue = cc.creatureArmorClasses.find((ac) => ac.value === armorClass).baseOutput;
  return Math.max(10, utils.randomValueFromVarianceInt(baseValue, 1));
};

export const GetAttackBonusValue = (attack) => {
  const baseValue = cc.creatureAttacks.find((ac) => ac.value === attack).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 1);
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

export const GetInitiativeValue = (initiative) => {
  const baseValue = cc.creatureInitiatives.find((i) => i.value === initiative).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 2);
};

export const GetSpeedValue = (speed) => {
  if (speed == null) {
    return null;
  }

  const baseValue = cc.creatureSpeedMovements.find((m) => m.value === speed).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};
export const GetFlyingValue = (flying) => {
  if (flying == null) {
    return null;
  }

  const baseValue = cc.creatureFlyingMovements.find((m) => m.value === flying).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};
export const GetSwimmingValue = (swimming) => {
  if (swimming == null) {
    return null;
  }

  const baseValue = cc.creatureSwimmingMovements.find((m) => m.value === swimming).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};
export const GetBurrowingValue = (burrowing) => {
  if (burrowing == null) {
    return null;
  }

  const baseValue = cc.creatureBurrowingMovements.find((m) => m.value === burrowing).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};

export const GetSenseValue = (sense) => {
  if (sense == null) {
    return null;
  }

  const baseValue = cc.creatureSenseReaches.find((s) => s.value === sense).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};

export const GetPrimaryAlignmentValue = (alignment) => {
  const baseOutput = cc.creaturePrimaryAlignments.find((a) => a.value === alignment).display;
  return baseOutput;
};
export const GetSecondaryAlignmentValue = (alignment) => {
  const baseOutput = cc.creatureSecondaryAlignments.find((a) => a.value === alignment).display;
  return baseOutput;
};

export const GetRaceValue = (race) => {
  if (race == null) {
    return null;
  }

  const baseOutput = cc.creatureRaces.find((r) => r.value === race).display;
  return baseOutput;
};

export const GetClassValue = (cClass) => {
  if (cClass == null) {
    return null;
  }

  const baseOutput = cc.creatureClasses.find((c) => c.value === cClass).display;
  return baseOutput;
};

export const GetSubClassValue = (cClass, subClass) => {
  if (cClass == null || subClass == null) {
    return null;
  }

  const baseOutput = cc.creatureClasses.find((c) => c.value === cClass).subClasses.find((sc) => sc.value === subClass).display;
  return baseOutput;
};

export const GetTypeValue = (type) => {
  const baseOutput = cc.creatureTypes.find((t) => t.value === type).display;
  return baseOutput;
};

export const GetEnviromentValue = (environment) => {
  const baseOutput = cc.creatureEnvironments.find((e) => e.value === environment).display;
  return baseOutput;
};

export const GetSizeValue = (size) => {
  const baseOutput = cc.creatureSizes.find((s) => s.value === size).display;
  return baseOutput;
};

export const GetLegendaryResistenciesValue = (lLegendaryResistency) => {
  if (lLegendaryResistency == null) {
    return null;
  }

  const baseOutput = cc.creatureLegendaryResistences.find((lr) => lr.value === lLegendaryResistency).totalNumber;
  return baseOutput;
};

export const GetRegenerationAmountValue = (amount) => {
  if (amount == null) {
    return null;
  }

  const baseOutput = cc.creatureRegenerations.find((r) => r.value === amount).amount;
  return baseOutput;
};

export const GetDamageTypeValue = (damageType) => {
  const baseOutput = cc.damageTypes.find((dt) => dt.value === damageType).display;
  return baseOutput;
};

export const GetReactionsPerRoundValue = (rpr) => {
  const baseOutput = cc.creatureReactionsPerRound.find((crpr) => crpr.value === rpr).number;
  return baseOutput;
};

export const GetAuraReachValue = (reach) => {
  const baseOutput = cc.creatureAuraReaches.find((r) => r.value === reach).baseOutput;
  return baseOutput;
};
export const GetActionReachValue = (reach, type) => {
  const baseOutput = cc.creatureActionTypes.find((t) => t.value === type).reaches.find((r) => r.value === reach).display;
  return baseOutput;
};

export const GetDCValue = (difficultyClass) => {
  const baseValue = cc.difficultyClasses.find((dc) => dc.value === difficultyClass).baseOutput;
  return Math.max(10, utils.randomValueFromVarianceInt(baseValue, 2));
};
export const GetSavingThrowAttributeValue = (attribute) => {
  const baseOutput = cc.creatureAttributeNames.find((dt) => dt.value === attribute).display;
  return baseOutput;
};

export const GetConditionValue = (condition) => {
  const baseOutput = cc.conditions.find((dt) => dt.value === condition).display;
  return baseOutput;
};
export const GetConditionDurationValue = (conditionDuration) => {
  const baseOutput = cc.conditionDurations.find((dt) => dt.value === conditionDuration).baseOutput;
  return baseOutput;
};

export const GetReactionTriggerValue = (trigger) => {
  const baseOutput = cc.creatureReactionTriggers.find((dt) => dt.value === trigger).display;
  return baseOutput;
};

export const GetActionFrequencyValue = (frequency) => {
  const baseOutput = cc.creatureActionFrequencies.find((dt) => dt.value === frequency).display;
  return baseOutput;
};

export const GetActionSpellValue = (frequency, level) => {
  const highestSpellSlotLevelAvailable = Math.min(9, Math.ceil(level / 2));
  const reducer = cc.creatureActionFrequencies.length - 1 - cc.creatureActionFrequencies.findIndex((f) => f.value === frequency);
  return Math.min(1, highestSpellSlotLevelAvailable - reducer);
};
