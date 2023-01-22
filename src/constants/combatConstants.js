export const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
export const MAX_COMBATS = 7;
export const MAX_CHARACTERS_ALLOWED = 10;
export const MAX_CREATURES_ALLOWED = 30;

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
    display: "Média",
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
    display: "Extrema",
    value: COMBAT_DIFFICULTIES.EXTREME,
    minThreshold: 0.75,
    maxThreshold: 1,
    shortDisplay: "E",
  },
];
export const GetDifficulty = (value) => combatDifficulties.find((a) => a.value === value);
