import * as utils from "../utils";
import { GetCondition, damageIntensities } from "../constants/creatureConstants";
import { GetConditionDurationValue, GetDCValue } from "../helpers/creatureHelper";
import { DAMANE_MOD } from "../constants/skillCheckConstants";

const rand = utils.randomIntFromInterval;
const variance = utils.randomValueFromVariancePercentage;

export const getDamage = (damageIntensity, level = null) => {
  const numberOfIterations = 10;
  const iterationsList = utils.createArrayFromInt(numberOfIterations).map((_) => getDamageValue(damageIntensity, level));
  return Math.round(utils.averageOfArray(iterationsList));
};

const getDamageValue = (damageIntensity, level) => {
  const damageIndex = damageIntensities.findIndex((di) => di.value === damageIntensity);
  const intensityFactor = 2;
  const damageMultiplier = Math.pow(intensityFactor, damageIndex + 1 - intensityFactor); // 2^-1, 2^0, 2^1, 2^2
  const damageVariance = 0.15;

  const baseDamage = rand(1, 4) + (level ?? 10);
  let damage = baseDamage * damageMultiplier;
  return variance(damage, damageVariance) + DAMANE_MOD;
};

export const getSkillCheck = (level, checkDifficulty, damageIntensity, condition, conditionDuration) => {
  let skillCheck = [];

  const difficulty = GetDCValue(checkDifficulty, level);
  skillCheck.push({ value: difficulty, name: "Dificuldade" });

  if (damageIntensity) {
    const damage = getDamage(damageIntensity, level);
    skillCheck.push({ value: damage, name: "Dano" });
  }

  if (condition !== null) {
    skillCheck.push({ value: GetCondition(condition).display, name: "Condição" });
  }

  if (conditionDuration) {
    skillCheck.push({ value: GetConditionDurationValue(conditionDuration), name: "Duração" });
  }

  return skillCheck;
};
