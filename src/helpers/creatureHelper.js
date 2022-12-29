import * as utils from "../utils";
import * as creatureConstants from "../constants/creatureConstants";
import * as skillCheckHelper from "./skillCheckHelper";

export const GetAttributeValue = (attribute) => {
  const baseValue = creatureConstants.creatureAttributes.find((a) => a.value === attribute).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 2);
};

export const GetACValue = (armorClass) => {
  const baseValue = creatureConstants.creatureArmorClasses.find((a) => a.value === armorClass).baseOutput;
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
  const baseValue = creatureConstants.creatureInitiatives.find((a) => a.value === initiative).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 2);
};

export const GetSpeedValue = (speed) => {
  if (speed == null) {
    return null;
  }

  const baseValue = creatureConstants.creatureSpeedMovements.find((a) => a.value === speed).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};
export const GetFlyingValue = (flying) => {
  if (flying == null) {
    return null;
  }

  const baseValue = creatureConstants.creatureFlyingMovements.find((a) => a.value === flying).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};
export const GetSwimmingValue = (swimming) => {
  if (swimming == null) {
    return null;
  }

  const baseValue = creatureConstants.creatureSwimmingMovements.find((a) => a.value === swimming).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};
export const GetBurrowingValue = (burrowing) => {
  if (burrowing == null) {
    return null;
  }

  const baseValue = creatureConstants.creatureBurrowingMovements.find((a) => a.value === burrowing).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};

export const GetSenseValue = (sense) => {
  if (sense == null) {
    return null;
  }

  const baseValue = creatureConstants.creatureSenseReaches.find((a) => a.value === sense).baseOutput;
  return utils.randomValueFromVarianceInt(baseValue, 0);
};
console.log(utils.randomValueFromVarianceInt(30, 0));
