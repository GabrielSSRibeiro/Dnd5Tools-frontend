import { randomIntFromInterval as rand, randomValueFromVariance as variance, GetProfByLevel } from "../utils";

export const DEFAULT_DIFFICULTY = ["Média"];
export const CHECK_DIFFICULTIES = ["Baixa", DEFAULT_DIFFICULTY, "Alta", "Extrema"];
export const DEFAULT_INTENSITY = ["Nenhuma"];
export const DAMAGE_INTENSITIES = [DEFAULT_INTENSITY, "Baixa", "Média", "Alta", "Extrema"];
export const DEFAULT_CONDITION = ["Nenhuma"];

export const CONDITIONS = [
  DEFAULT_CONDITION,
  "Agarrado",
  "Derrubado",
  "Cego/Surdo",
  "Impedido",
  "Amedrontado",
  "Envenenado",
  "Atordoado",
  "Petrificado",
  "Inconsciente",
  "Exaustão",
];

export const MIN_DIFICULTY = 10;

const getDifficulty = (level, checkDifficulty) => {
  const prof = GetProfByLevel(level);
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

export const getSkillCheck = (level, checkDifficulty, condition, damageIntensity) => {
  let skillCheck = [];

  const difficulty = getDifficulty(level, checkDifficulty);
  skillCheck.push({ value: difficulty, name: "Dificuldade" });

  if (condition !== DEFAULT_CONDITION) {
    skillCheck.push({ value: condition, name: "Condição" });
  }

  if (damageIntensity !== DEFAULT_INTENSITY) {
    const damage = getDamage(level, damageIntensity);
    skillCheck.push({ value: damage, name: "Dano" });
  }

  return skillCheck;
};