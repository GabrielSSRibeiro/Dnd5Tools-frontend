import * as utils from "../../../../utils";
import {
  MIN_DIFICULTY,
  CHECK_DIFFICULTIES,
  DEFAULT_INTENSITY,
  DAMAGE_INTENSITIES,
  DEFAULT_CONDITION_DURATION,
  CONDITION_DURATIONS,
} from "../../../../data/skillCheckConstants";
import { conditions } from "../../../../data/creatureConstants";

const rand = utils.randomIntFromInterval;
const variance = utils.randomIntFromInterval;

const getDifficulty = (level, checkDifficulty) => {
  const prof = utils.GetProfByLevel(level);
  const difficultyIndex = CHECK_DIFFICULTIES.indexOf(checkDifficulty);
  const difficultyFactor = 5;
  const difficultyVariance = 0.1;

  let difficulty = (difficultyIndex + 1) * difficultyFactor + prof;
  difficulty = variance(difficulty, difficultyVariance);

  return Math.max(difficulty, MIN_DIFICULTY);
};

const getDamage = (level, damageIntensity) => {
  const damageIndex = DAMAGE_INTENSITIES.indexOf(damageIntensity);
  const intensityFactor = 2;
  const damageMultiplier = Math.pow(intensityFactor, damageIndex - intensityFactor); // 2^-1, 2^0, 2^1, 2^2
  const damageVariance = 0.1;

  const baseDamage = rand(1, 4) + level;
  let damage = baseDamage * damageMultiplier;

  return variance(damage, damageVariance);
};

export const getSkillCheck = (level, checkDifficulty, damageIntensity, condition, conditionDuration) => {
  let skillCheck = [];

  const difficulty = getDifficulty(level, checkDifficulty);
  skillCheck.push({ value: difficulty, name: "Dificuldade" });

  if (damageIntensity !== DEFAULT_INTENSITY) {
    const damage = getDamage(level, damageIntensity);
    skillCheck.push({ value: damage, name: "Dano" });
  }

  if (condition !== null) {
    skillCheck.push({ value: conditions.find((c) => c.value === condition).display, name: "Condição" });
  }

  if (conditionDuration !== DEFAULT_CONDITION_DURATION) {
    const conditionDurationTimes = CONDITION_DURATIONS.filter((cd) => cd !== DEFAULT_CONDITION_DURATION).map(
      (cd) => cd.split(")")[0].split("(").reverse()[0]
    );

    skillCheck.push({ value: conditionDurationTimes[CONDITION_DURATIONS.indexOf(conditionDuration)], name: "Duração" });
  }

  return skillCheck;
};
