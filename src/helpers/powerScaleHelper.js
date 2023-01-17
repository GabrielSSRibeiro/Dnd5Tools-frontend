import * as cc from "../constants/creatureConstants";

const GetHighestWeight = (options) => {
  return Math.max(...options.map((o) => o.weight));
};

const GetMaxOffensivePower = () => {
  let offensiveWeightTotal = 100;

  offensiveWeightTotal += GetHighestWeight(cc.creatureArmorClasses);

  return offensiveWeightTotal;
};

const GetMaxDefensivePower = () => {
  let defensiveWeightTotal = 100;

  defensiveWeightTotal += GetHighestWeight(cc.creatureAttacks);

  return defensiveWeightTotal;
};

const GetCreatureOffensivePower = (creature) => {
  let creatureOffensiveWeightTotal = 50;

  creatureOffensiveWeightTotal += cc.GetAttackBonus(creature.attack).weight;

  return creatureOffensiveWeightTotal;
};

const GetCreatureDefensivePower = (creature) => {
  let creatureDefensiveWeightTotal = 50;

  creatureDefensiveWeightTotal += cc.GetArmorClass(creature.armorClass).weight;

  return creatureDefensiveWeightTotal;
};

export const GetCreatureOffensiveRatio = (creature) => {
  return GetCreatureOffensivePower(creature) / GetMaxOffensivePower();
};

export const GetCreatureDefensiveRatio = (creature) => {
  return GetCreatureDefensivePower(creature) / GetMaxDefensivePower();
};
