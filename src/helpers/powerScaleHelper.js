import * as cc from "../constants/creatureConstants";

const GetHighestWeight = (options) => Math.max(...options.map((o) => o.weight));

const GetAuraMaxPower = () => {
  let auraWeightTotal = 0;
  auraWeightTotal += GetHighestWeight(cc.creatureAuraReaches);
  auraWeightTotal += GetHighestWeight(cc.damageIntensities);
  auraWeightTotal += GetHighestWeight(cc.damageTypes);
  auraWeightTotal += GetHighestWeight(cc.difficultyClasses);
  auraWeightTotal += GetHighestWeight(cc.conditions);
  auraWeightTotal += GetHighestWeight(cc.conditionDurations);

  return auraWeightTotal;
};

const GetActionMaxPower = () => {
  let actionWeightTotal = 0;
  actionWeightTotal += GetHighestWeight(cc.creatureActionHealingReaches);
  actionWeightTotal += GetHighestWeight(cc.damageIntensities);
  actionWeightTotal += GetHighestWeight(cc.damageTypes);
  actionWeightTotal += GetHighestWeight(cc.difficultyClasses);
  actionWeightTotal += GetHighestWeight(cc.conditions);
  actionWeightTotal += GetHighestWeight(cc.conditionDurations);
  return actionWeightTotal * Math.max(...cc.creatureActionRepetitions.map((o) => o.multiplier));
};

const GetReactionMaxPower = () => {
  let reactionWeightTotal = 0;
  reactionWeightTotal += GetHighestWeight(cc.creatureActionHealingReaches);
  reactionWeightTotal += GetHighestWeight(cc.damageIntensities);
  reactionWeightTotal += GetHighestWeight(cc.damageTypes);
  reactionWeightTotal += GetHighestWeight(cc.difficultyClasses);
  reactionWeightTotal += GetHighestWeight(cc.conditions);
  reactionWeightTotal += GetHighestWeight(cc.conditionDurations);
  reactionWeightTotal += GetHighestWeight(cc.creatureReactionTriggers);

  return reactionWeightTotal;
};

const GetMaxOffensivePower = () => {
  let offensiveWeightTotal = 0;

  offensiveWeightTotal += GetHighestWeight(cc.creatureAttacks);
  offensiveWeightTotal += GetHighestWeight(cc.creatureInitiatives);
  offensiveWeightTotal += GetAuraMaxPower();
  offensiveWeightTotal += GetActionMaxPower();
  offensiveWeightTotal += GetReactionMaxPower() * Math.max(...cc.creatureReactionsPerRound.map((o) => o.number));

  return offensiveWeightTotal;
};

const GetMaxDefensivePower = () => {
  let defensiveWeightTotal = 0;

  defensiveWeightTotal += GetHighestWeight(cc.creatureArmorClasses);
  defensiveWeightTotal += GetHighestWeight(cc.creatureSizes);
  defensiveWeightTotal += GetHighestWeight(cc.creatureSpeedMovements);
  defensiveWeightTotal += GetHighestWeight(cc.creatureFlyingMovements);
  defensiveWeightTotal += GetHighestWeight(cc.creatureSwimmingMovements);
  defensiveWeightTotal += GetHighestWeight(cc.creatureBurrowingMovements);
  defensiveWeightTotal += GetHighestWeight(cc.creatureAttributes) * 6;
  defensiveWeightTotal += GetHighestWeight(cc.creatureHitPoints);
  cc.damageTypes.forEach((dt) => {
    defensiveWeightTotal += GetHighestWeight(dt.damageEffectiveness);
  });
  defensiveWeightTotal += GetHighestWeight(cc.conditions);
  defensiveWeightTotal += GetHighestWeight(cc.creatureSenseReaches) * 4;
  defensiveWeightTotal += GetHighestWeight(cc.creatureLegendaryResistences);
  defensiveWeightTotal += GetHighestWeight(cc.creatureRegenerations);
  defensiveWeightTotal += GetHighestWeight([cc.regenerationNoBreakDamange, ...cc.damageTypes]);

  return defensiveWeightTotal;
};

const GetCreatureOffensivePower = (creature) => {
  let creatureOffensiveWeightTotal = 0;

  creatureOffensiveWeightTotal += cc.GetAttackBonus(creature.attack).weight;
  creatureOffensiveWeightTotal += cc.GetInitiative(creature.initiative).weight;

  let auraWeightTotal = 0;
  if (creature.aura.creatureActionPowerTotalPercentage) {
    auraWeightTotal = cc.GetCreatureActionPowerTotalPercentage(creature.aura.creatureActionPowerTotalPercentage).powerTotal * GetAuraMaxPower();
  } else {
    auraWeightTotal += cc.GetAuraReach(creature.aura.reach).weight;
    auraWeightTotal += cc.GetDamageIntensity(creature.aura.damageIntensity)?.weight ?? 0;
    auraWeightTotal += cc.GetDamageType(creature.aura.damageType)?.weight ?? 0;
    auraWeightTotal += cc.GetDifficultyClass(creature.aura.difficultyClass)?.weight ?? 0;
    auraWeightTotal += cc.GetCondition(creature.aura.condition)?.weight ?? 0;
    auraWeightTotal += cc.GetConditionDuration(creature.aura.conditionDuration)?.weight ?? 0;
  }
  creatureOffensiveWeightTotal += auraWeightTotal;

  if (creature.actions.length > 0) {
    let actionsWeightTotal = 0;
    creature.actions.forEach((action) => {
      let actionWeightTotal = 0;
      if (action.creatureActionPowerTotalPercentage) {
        actionWeightTotal = cc.GetCreatureActionPowerTotalPercentage(action.creatureActionPowerTotalPercentage).powerTotal * GetActionMaxPower();
      } else {
        actionWeightTotal += cc.GetCreatureActionType(action.type).reaches.find((r) => r.value === action.reach).weight;
        actionWeightTotal += cc.GetDamageIntensity(action.damageIntensity)?.weight ?? 0;
        actionWeightTotal += cc.GetDamageType(action.damageType)?.weight ?? 0;
        actionWeightTotal += cc.GetDifficultyClass(action.difficultyClass)?.weight ?? 0;
        actionWeightTotal += cc.GetCondition(action.condition)?.weight ?? 0;
        actionWeightTotal += cc.GetConditionDuration(action.conditionDuration)?.weight ?? 0;
        actionWeightTotal = actionWeightTotal * cc.GetActionRepetitions(action.repetitions).multiplier;
        actionWeightTotal = actionWeightTotal * (1 / (cc.GetActionFrequency(action.frequency).cooldown + 1));
        actionsWeightTotal += actionWeightTotal;
      }
    });
    creatureOffensiveWeightTotal += Math.round(actionsWeightTotal / creature.actions.length);
  }

  if (creature.reactions.length > 0) {
    let reactionsWeightTotal = 0;
    creature.reactions.forEach((reaction) => {
      let reactionWeightTotal = 0;
      if (reaction.creatureActionPowerTotalPercentage) {
        reactionWeightTotal =
          cc.GetCreatureActionPowerTotalPercentage(reaction.creatureActionPowerTotalPercentage).powerTotal * GetReactionMaxPower();
      } else {
        reactionWeightTotal += cc.GetCreatureActionType(reaction.type).reaches.find((r) => r.value === reaction.reach).weight;
        reactionWeightTotal += cc.GetDamageIntensity(reaction.damageIntensity)?.weight ?? 0;
        reactionWeightTotal += cc.GetDamageType(reaction.damageType)?.weight ?? 0;
        reactionWeightTotal += cc.GetDifficultyClass(reaction.difficultyClass)?.weight ?? 0;
        reactionWeightTotal += cc.GetCondition(reaction.condition)?.weight ?? 0;
        reactionWeightTotal += cc.GetConditionDuration(reaction.conditionDuration)?.weight ?? 0;
        reactionWeightTotal = reactionWeightTotal * (1 / (cc.GetActionFrequency(reaction.frequency).cooldown + 1));
        reactionsWeightTotal += reactionWeightTotal;
      }
    });
    creatureOffensiveWeightTotal +=
      Math.round(reactionsWeightTotal / creature.reactions.length) * cc.GetReactionsPerRound(creature.reactionsPerRound).number;
  }

  return creatureOffensiveWeightTotal;
};

const GetCreatureDefensivePower = (creature) => {
  let creatureDefensiveWeightTotal = 0;

  creatureDefensiveWeightTotal += cc.GetArmorClass(creature.armorClass).weight;
  creatureDefensiveWeightTotal += cc.GetSize(creature.size).weight;
  creatureDefensiveWeightTotal += cc.GetSpeed(creature.movements.speed)?.weight ?? 0;
  creatureDefensiveWeightTotal += cc.GetFlying(creature.movements.flying)?.weight ?? 0;
  creatureDefensiveWeightTotal += cc.GetSwimming(creature.movements.swimming)?.weight ?? 0;
  creatureDefensiveWeightTotal += cc.GetBurrowing(creature.movements.burrowing)?.weight ?? 0;
  creatureDefensiveWeightTotal += cc.GetAttribute(creature.attributes.strength).weight;
  creatureDefensiveWeightTotal += cc.GetAttribute(creature.attributes.dexterity).weight;
  creatureDefensiveWeightTotal += cc.GetAttribute(creature.attributes.constitution).weight;
  creatureDefensiveWeightTotal += cc.GetAttribute(creature.attributes.intelligence).weight;
  creatureDefensiveWeightTotal += cc.GetAttribute(creature.attributes.wisdom).weight;
  creatureDefensiveWeightTotal += cc.GetAttribute(creature.attributes.charisma).weight;
  creatureDefensiveWeightTotal += cc.GetHitPoints(creature.hitPoints).weight;
  creature.damagesEffectiveness.forEach((de) => {
    creatureDefensiveWeightTotal += cc.GetDamageType(de.type).damageEffectiveness.find((d) => d.value === de.value).weight;
  });
  creature.conditionImmunities.forEach((c) => {
    creatureDefensiveWeightTotal += cc.GetCondition(c);
  });
  creatureDefensiveWeightTotal += cc.GetSense(creature.senses.darkVision)?.weight ?? 0;
  creatureDefensiveWeightTotal += cc.GetSense(creature.senses.tremorsense)?.weight ?? 0;
  creatureDefensiveWeightTotal += cc.GetSense(creature.senses.blindSight)?.weight ?? 0;
  creatureDefensiveWeightTotal += cc.GetSense(creature.senses.trueSight)?.weight ?? 0;
  creatureDefensiveWeightTotal += cc.GetLegendaryResistency(creature.legendaryResistences)?.weight ?? 0;
  creatureDefensiveWeightTotal += cc.GetRegenerationAmount(creature.regeneration.amount)?.weight ?? 0;
  creatureDefensiveWeightTotal +=
    [cc.regenerationNoBreakDamange, ...cc.damageTypes].find((dt) => dt.value === creature.regeneration.breakDamage)?.weight ?? 0;

  return creatureDefensiveWeightTotal;
};

const GetCreatureExtraMultiplier = (customSpecials) => {
  let extraMultiplier = customSpecials.map((cs) => cc.GetCustomSpecialMultiplier(cs.multiplier)?.multiplier ?? 0).reduce((a, b) => a + b, 0);
  return 1 + extraMultiplier;
};

const GetCreatureRarityFactor = (creature) => {
  let rarityFactor = 1;
  return rarityFactor;
};

export const GetCreatureOffensiveRatio = (creature) => {
  const extraMultiplier = GetCreatureExtraMultiplier(creature.customSpecials);
  const rarityFactor = GetCreatureRarityFactor(creature);
  return (GetCreatureOffensivePower(creature) * extraMultiplier * rarityFactor) / GetMaxOffensivePower();
};

export const GetCreatureDefensiveRatio = (creature) => {
  const extraMultiplier = GetCreatureExtraMultiplier(creature.customSpecials);
  const rarityFactor = GetCreatureRarityFactor(creature);
  return (GetCreatureDefensivePower(creature) * extraMultiplier * rarityFactor) / GetMaxDefensivePower();
};
