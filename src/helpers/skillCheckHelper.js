import * as utils from "../utils";
import { damageIntensities } from "../constants/creatureConstants";
import { GetConditionDisplay, GetConditionDurationValue, GetDCValue } from "../helpers/creatureHelper";

const rand = utils.randomIntFromInterval;
const variance = utils.randomValueFromVariancePercentage;

export const getDamage = (level, damageIntensity) => {
  const damageIndex = damageIntensities.findIndex((di) => di.value === damageIntensity);
  const intensityFactor = 2;
  const damageMultiplier = Math.pow(intensityFactor, damageIndex + 1 - intensityFactor); // 2^-1, 2^0, 2^1, 2^2
  const damageVariance = 0.1;

  const baseDamage = rand(1, 4) + level;
  let damage = baseDamage * damageMultiplier;
  return variance(damage, damageVariance);
};

export const getSkillCheck = (level, checkDifficulty, damageIntensity, condition, conditionDuration) => {
  let skillCheck = [];

  const difficulty = GetDCValue(checkDifficulty, level);
  skillCheck.push({ value: difficulty, name: "Dificuldade" });

  if (damageIntensity) {
    const damage = getDamage(level, damageIntensity);
    skillCheck.push({ value: damage, name: "Dano" });
  }

  if (condition !== null) {
    skillCheck.push({ value: GetConditionDisplay(condition), name: "Condição" });
  }

  if (conditionDuration) {
    skillCheck.push({ value: GetConditionDurationValue(conditionDuration), name: "Duração" });
  }

  return skillCheck;
};