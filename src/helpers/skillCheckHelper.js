import * as utils from "../utils";
import { MIN_DIFICULTY } from "../constants/skillCheckConstants";
import { damageIntensities, difficultyClasses } from "../constants/creatureConstants";
import { GetProfByLevel, GetConditionValue, GetConditionDurationValue } from "../helpers/creatureHelper";

const rand = utils.randomIntFromInterval;
const variance = utils.randomValueFromVariancePercentage;

export const getDifficulty = (level, checkDifficulty) => {
  const prof = GetProfByLevel(level);
  const difficultyIndex = difficultyClasses.findIndex((dc) => dc.value === checkDifficulty);
  const difficultyFactor = 5;

  let difficulty = (difficultyIndex + 1) * difficultyFactor + prof;
  // const difficultyVariance = 0.1;
  // difficulty = variance(difficulty, difficultyVariance);
  difficulty = utils.randomIntFromInterval(difficulty - 1, difficulty + 1);

  return Math.max(difficulty, MIN_DIFICULTY);
};

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

  const difficulty = getDifficulty(level, checkDifficulty);
  skillCheck.push({ value: difficulty, name: "Dificuldade" });

  if (damageIntensity) {
    const damage = getDamage(level, damageIntensity);
    skillCheck.push({ value: damage, name: "Dano" });
  }

  if (condition !== null) {
    skillCheck.push({ value: GetConditionValue(condition), name: "Condição" });
  }

  if (conditionDuration) {
    skillCheck.push({ value: GetConditionDurationValue(conditionDuration), name: "Duração" });
  }

  return skillCheck;
};
