import * as utils from "../utils";
import * as creatureConstants from "../constants/creatureConstants";
import * as skillCheckHelper from "./skillCheckHelper";

export const GetAverageLevel = (creatureRarity) => {
  const rarityObj = creatureConstants.creatureRarities.find((r) => r.value === creatureRarity);

  return Math.round((rarityObj.baseOutputMin + rarityObj.baseOutputMax) / 2);
};

export const GetXpValue = (level) => {
  const baseOutput = creatureConstants.creatureXps[level - 1];
  return baseOutput;
};

export const GetAttributeValue = (attribute) => {
  const baseValue = creatureConstants.creatureAttributes.find((a) => a.value === attribute).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 2);
};

export const GetACValue = (armorClass) => {
  const baseValue = creatureConstants.creatureArmorClasses.find((ac) => ac.value === armorClass).baseOutput;
  return Math.max(10, utils.randomValueFromVarianceInt(baseValue, 2));
};

export const GetHPValue = (level, HP, con) => {
  const conValue = creatureConstants.creatureAttributes.find((a) => a.value === con).baseOutput;

  const baseHp = skillCheckHelper.getDamage(level, HP);
  let hp = (baseHp * conValue) / 2;
  const hpVariance = 0.1;
  return utils.randomValueFromVariancePercentage(hp, hpVariance);

  // [3, 12, 20].forEach((level) => {
  //   console.log("level:", level);
  //   creatureConstants.creatureHitPoints.forEach((hp) => {
  //     creatureConstants.creatureAttributes.forEach((a) => {
  //       console.log(`hp(${hp.display})/con(${a.display}):`, GetHPValue(level, hp.value, a.value));
  //     });
  //   });
  // });
};

export const GetInitiativeValue = (initiative) => {
  const baseValue = creatureConstants.creatureInitiatives.find((i) => i.value === initiative).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 2);
};

export const GetSpeedValue = (speed) => {
  if (speed == null) {
    return null;
  }

  const baseValue = creatureConstants.creatureSpeedMovements.find((m) => m.value === speed).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};
export const GetFlyingValue = (flying) => {
  if (flying == null) {
    return null;
  }

  const baseValue = creatureConstants.creatureFlyingMovements.find((m) => m.value === flying).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};
export const GetSwimmingValue = (swimming) => {
  if (swimming == null) {
    return null;
  }

  const baseValue = creatureConstants.creatureSwimmingMovements.find((m) => m.value === swimming).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};
export const GetBurrowingValue = (burrowing) => {
  if (burrowing == null) {
    return null;
  }

  const baseValue = creatureConstants.creatureBurrowingMovements.find((m) => m.value === burrowing).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};

export const GetSenseValue = (sense) => {
  if (sense == null) {
    return null;
  }

  const baseValue = creatureConstants.creatureSenseReaches.find((s) => s.value === sense).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};

export const GetPrimaryAlignmentValue = (alignment) => {
  const baseOutput = creatureConstants.creaturePrimaryAlignments.find((a) => a.value === alignment).display;
  return baseOutput;
};
export const GetSecondaryAlignmentValue = (alignment) => {
  const baseOutput = creatureConstants.creatureSecondaryAlignments.find((a) => a.value === alignment).display;
  return baseOutput;
};

export const GetRaceValue = (race) => {
  if (race == null) {
    return null;
  }

  const baseOutput = creatureConstants.creatureRaces.find((r) => r.value === race).display;
  return baseOutput;
};

export const GetClassValue = (cClass) => {
  if (cClass == null) {
    return null;
  }

  const baseOutput = creatureConstants.creatureClasses.find((c) => c.value === cClass).display;
  return baseOutput;
};

export const GetSubClassValue = (cClass, subClass) => {
  if (cClass == null || subClass == null) {
    return null;
  }

  const baseOutput = creatureConstants.creatureClasses.find((a) => a.value === cClass).subClasses.find((sc) => sc.value === subClass).display;
  return baseOutput;
};

export const GetTypeValue = (type) => {
  const baseOutput = creatureConstants.creatureTypes.find((a) => a.value === type).display;
  return baseOutput;
};

export const GetEnviromentValue = (environment) => {
  const baseOutput = creatureConstants.creatureEnvironments.find((a) => a.value === environment).display;
  return baseOutput;
};

export const GetSizeValue = (size) => {
  const baseOutput = creatureConstants.creatureSizes.find((a) => a.value === size).display;
  return baseOutput;
};

export const GetLegendaryResistenciesValue = (lr) => {
  if (lr == null) {
    return null;
  }

  const baseOutput = creatureConstants.creatureLegendaryResistences.find((a) => a.value === lr).totalNumber;
  return baseOutput;
};

export const GetReactionsPerRoundValue = (rpr) => {
  const baseOutput = creatureConstants.creatureReactionsPerRound.find((a) => a.value === rpr).number;
  return baseOutput;
};
