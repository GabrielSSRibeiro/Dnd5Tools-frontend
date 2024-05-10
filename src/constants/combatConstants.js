export const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
export const MAX_COMBATS = 7;
export const MAX_CHARACTERS_ALLOWED = 10;
export const MAX_CREATURES_ALLOWED = 30;
export const MAX_DIFFICULTY_LEVEL_VARIANCE = 2;

export const COMBAT_DIFFICULTIES = {
  EASY: 10,
  MEDIUM: 20,
  HARD: 30,
  EXTREME: 40,
};
export const combatDifficulties = [
  {
    display: "Fácil",
    value: COMBAT_DIFFICULTIES.EASY,
    minThreshold: 0,
    maxThreshold: 0.25,
    shortDisplay: "F",
  },
  {
    display: "Médio",
    value: COMBAT_DIFFICULTIES.MEDIUM,
    minThreshold: 0.25,
    maxThreshold: 0.5,
    shortDisplay: "M",
  },
  {
    display: "Díficil",
    value: COMBAT_DIFFICULTIES.HARD,
    minThreshold: 0.5,
    maxThreshold: 0.75,
    shortDisplay: "D",
  },
  {
    display: "Extremo",
    value: COMBAT_DIFFICULTIES.EXTREME,
    minThreshold: 0.75,
    maxThreshold: 1,
    shortDisplay: "E",
  },
];
export const GetDifficulty = (value) => combatDifficulties.find((a) => a.value === value);

export const COMBAT_ACHIEVEMENTS = {
  OVERCOME_CHALLANGE: 10,
  NEUTRALIZE_SMALL_CREATURE: 15,
  NEUTRALIZE_CREATURE: 20,
  UNCOVER_SECRET: 30,
  COMPLETE_QUEST: 40,
};
export const combatAchievements = [
  {
    display: "Superar desafio",
    value: COMBAT_ACHIEVEMENTS.OVERCOME_CHALLANGE,
    multiplier: 0.1,
  },
  {
    display: "Criatura menor",
    value: COMBAT_ACHIEVEMENTS.NEUTRALIZE_SMALL_CREATURE,
    multiplier: 0.1,
  },
  {
    display: "Criatura maior",
    value: COMBAT_ACHIEVEMENTS.NEUTRALIZE_CREATURE,
    multiplier: 1,
  },
  {
    display: "Descobrir segredo",
    value: COMBAT_ACHIEVEMENTS.UNCOVER_SECRET,
    multiplier: 1,
  },
  {
    display: "Completar missao",
    value: COMBAT_ACHIEVEMENTS.COMPLETE_QUEST,
    multiplier: 2,
  },
];
export const GetCombatAchievement = (value) => combatAchievements.find((a) => a.value === value);

export const SYSTEM_TYPES = {
  DND_5E: 10,
};
export const systemTypes = [
  {
    display: "D&D 5e",
    value: SYSTEM_TYPES.DND_5E,
  },
];
export const GetSystemType = (value) => systemTypes.find((a) => a.value === value);
