import * as utils from "../utils";
import * as sch from "./skillCheckHelper";
import { GetActionDamangeAndConditionString } from "./combatHelper";
import * as ch from "./creatureHelper";
import * as th from "./treasureHelper";
import * as cc from "../constants/creatureConstants";
import * as tc from "../constants/treasureConstants";

export const GetFoundryFormattedCreature = (creature, level) => {
  const str = ch.GetAttributeValue(creature.attributes.strength);

  let foundryJson = {
    name: creature.name,
    type: "npc",
    img: creature.image,
    data: {
      abilities: GetAbilities(creature, str),
      attributes: GetAttributes(creature, level),
      details: GetDetails(creature, level),
      traits: GetTraits(creature),
      currency: GetCurrency(creature),
      skills: GetSkills(creature),
      spells: GetSpells(creature),
      bonuses: GetBonuses(creature),
      resources: GetResources(creature),
    },
    token: GetToken(creature),
    items: GetItems(creature, level, str),
    effects: GetEffects(creature),
    flags: GetFlags(creature),
  };
  return foundryJson;
};

const GetAbilities = (creature, str) => {
  const dex = ch.GetAttributeValue(creature.attributes.dexterity);
  const con = ch.GetAttributeValue(creature.attributes.constitution);
  const int = ch.GetAttributeValue(creature.attributes.intelligence);
  const wis = ch.GetAttributeValue(creature.attributes.wisdom);
  const cha = ch.GetAttributeValue(creature.attributes.charisma);

  const abilities = {
    str: {
      value: str,
      proficient: 1,
      bonuses: {
        check: 0,
        save: "",
      },
      mod: ch.GetAttributeMod(str),
    },
    dex: {
      value: dex,
      proficient: 1,
      bonuses: {
        check: 0,
        save: "",
      },
      mod: ch.GetAttributeMod(dex),
    },
    con: {
      value: con,
      proficient: 1,
      bonuses: {
        check: 0,
        save: "",
      },
      mod: ch.GetAttributeMod(con),
    },
    int: {
      value: int,
      proficient: 1,
      bonuses: {
        check: 0,
        save: "",
      },
      mod: ch.GetAttributeMod(int),
    },
    wis: {
      value: wis,
      proficient: 1,
      bonuses: {
        check: 0,
        save: "",
      },
      mod: ch.GetAttributeMod(wis),
    },
    cha: {
      value: cha,
      proficient: 1,
      bonuses: {
        check: 0,
        save: "",
      },
      mod: ch.GetAttributeMod(cha),
    },
  };

  return abilities;
};

const GetAttributes = (creature, level) => {
  const hp = ch.GetHPValue(level, creature.hitPoints, creature.attributes.constitution);
  const weakSpots =
    creature.weakSpots.length > 0
      ? `${creature.weakSpots.map((ws) => `${ws}(${Math.round(hp / (creature.weakSpots.length + 2))})`).join(", ")}`
      : null;

  const attributes = {
    ac: {
      flat: null,
      calc: "custom",
      formula: `${ch.GetACValue(creature.armorClass)}`,
      min: 0,
      value: null,
    },
    hp: {
      value: hp,
      min: 0,
      max: hp,
      temp: 0,
      tempmax: 0,
      formula: weakSpots ?? utils.GetValueAsDiceString(hp, true, 0.5),
    },
    init: {
      value: 0,
      bonus: 0,
      mod: 0,
      total: ch.GetInitiativeValue(creature.initiative),
      prof: 0,
    },
    movement: {
      burrow: ch.GetBurrowingValue(creature.movements.burrowing),
      climb: null,
      fly: ch.GetFlyingValue(creature.movements.flying),
      swim: ch.GetSwimmingValue(creature.movements.swimming),
      walk: ch.GetSpeedValue(creature.movements.speed),
      units: "ft",
      hover: false,
    },
    senses: {
      darkvision: ch.GetSenseValue(creature.senses.darkVision),
      blindsight: ch.GetSenseValue(creature.senses.blindSight),
      tremorsense: ch.GetSenseValue(creature.senses.tremorsense),
      truesight: ch.GetSenseValue(creature.senses.trueSight),
      units: "ft",
      special: "",
    },
    spellcasting: "",
    prof: ch.GetProfByLevel(level),
    spelldc: 8,
  };

  return attributes;
};

const GetDetails = (creature, level) => {
  const raceAndClasses = [
    cc.GetRace(creature.race)?.display,
    cc.GetClass(creature.class)?.display,
    cc.GetSubClass(creature.class, creature.subClass)?.display,
    cc.GetClass(creature.secondaryClass)?.display,
    cc.GetSubClass(creature.secondaryClass, creature.secondarySubClass)?.display,
  ];

  const details = {
    biography: {
      value: `<div class="rd__b  rd__b--1"><div class="rd__b  rd__b--2"><p>${creature.description ?? ""}</p></div></div>`,
      public: "",
    },
    alignment: `${cc.GetPrimaryAlignment(creature.primaryAlignment).display} ${cc.GetSecondaryAlignment(creature.secondaryAlignment).display}`,
    race: "",
    type: {
      value: "custom",
      subtype: `${raceAndClasses.filter((i) => i).join(", ")}`,
      swarm: null,
      custom: `${cc.GetType(creature.type).display}`,
    },
    environment: cc.GetEnviroment(creature.environment).display,
    cr: level > 30 ? 30 : level,
    spellLevel: 0,
    xp: {
      value: ch.GetXpValue(level),
    },
    source: "Dnd5Tools",
    class: {},
  };

  return details;
};

const GetTraits = (creature) => {
  const traits = {
    size: cc.creatureSizes.find((s) => s.value === creature.size).foundryExport,
    di: {
      value: [],
      custom: cc.damageTypes
        .filter((dt) =>
          creature.damagesEffectiveness.some(
            (cde) => cde.type === dt.value && cde.value === dt.damageEffectiveness.find((de) => de.value === cc.DAMAGES_EFFECTIVENESS.IMMUNE).value
          )
        )
        .map((dt) => dt.display)
        .join(";"),
    },
    dr: {
      value: [],
      custom: cc.damageTypes
        .filter((dt) =>
          creature.damagesEffectiveness.some(
            (cde) => cde.type === dt.value && cde.value === dt.damageEffectiveness.find((de) => de.value === cc.DAMAGES_EFFECTIVENESS.RESISTENT).value
          )
        )
        .map((dt) => dt.display)
        .join(";"),
    },
    dv: {
      value: [],
      custom: cc.damageTypes
        .filter((dt) =>
          creature.damagesEffectiveness.some(
            (cde) =>
              cde.type === dt.value && cde.value === dt.damageEffectiveness.find((de) => de.value === cc.DAMAGES_EFFECTIVENESS.VULNERABLE).value
          )
        )
        .map((dt) => dt.display)
        .join(";"),
    },
    ci: {
      value: [],
      custom: cc.conditions
        .filter((c) => creature.conditionImmunities.includes(c.value))
        .map((c) => c.display)
        .join(";"),
    },
    languages: {
      value: [],
      custom: cc.languages
        .filter((l) => creature.languages.includes(l.value))
        .map((l) => l.display)
        .join(";"),
    },
  };

  return traits;
};

const GetCurrency = (creature) => {
  //nao usado por enqaunto. Ate PO é dado como item de inventorio
  const currency = {
    pp: 0,
    gp: 0,
    ep: 0,
    sp: 0,
    cp: 0,
  };

  return currency;
};

const GetSkills = (creature) => {
  const skills = {
    acr: {
      value: 0,
      ability: "dex",
      bonuses: {
        check: 0,
        passive: "",
      },
    },
    ani: {
      value: 0,
      ability: "wis",
      bonuses: {
        check: 0,
        passive: "",
      },
    },
    arc: {
      value: 0,
      ability: "int",
      bonuses: {
        check: 0,
        passive: "",
      },
    },
    ath: {
      value: 0,
      ability: "str",
      bonuses: {
        check: 0,
        passive: "",
      },
    },
    dec: {
      value: 0,
      ability: "cha",
      bonuses: {
        check: 0,
        passive: "",
      },
    },
    his: {
      value: 0,
      ability: "int",
      bonuses: {
        check: 0,
        passive: "",
      },
    },
    ins: {
      value: 0,
      ability: "wis",
      bonuses: {
        check: 0,
        passive: "",
      },
    },
    itm: {
      value: 0,
      ability: "cha",
      bonuses: {
        check: 0,
        passive: "",
      },
    },
    inv: {
      value: 0,
      ability: "int",
      bonuses: {
        check: 0,
        passive: "",
      },
    },
    med: {
      value: 0,
      ability: "wis",
      bonuses: {
        check: 0,
        passive: "",
      },
    },
    nat: {
      value: 0,
      ability: "int",
      bonuses: {
        check: 0,
        passive: "",
      },
    },
    prc: {
      value: 0,
      ability: "wis",
      bonuses: {
        check: 0,
        passive: "",
      },
    },
    prf: {
      value: 0,
      ability: "cha",
      bonuses: {
        check: 0,
        passive: "",
      },
    },
    per: {
      value: 0,
      ability: "cha",
      bonuses: {
        check: 0,
        passive: "",
      },
    },
    rel: {
      value: 0,
      ability: "int",
      bonuses: {
        check: 0,
        passive: "",
      },
    },
    slt: {
      value: 0,
      ability: "dex",
      bonuses: {
        check: 0,
        passive: "",
      },
    },
    ste: {
      value: 0,
      ability: "dex",
      bonuses: {
        check: 0,
        passive: "",
      },
    },
    sur: {
      value: 0,
      ability: "wis",
      bonuses: {
        check: 0,
        passive: "",
      },
    },
  };

  return skills;
};

const GetSpells = (creature) => {
  const spells = {
    spell1: {
      value: 0,
      override: null,
      max: 0,
    },
    spell2: {
      value: 0,
      override: null,
      max: 0,
    },
    spell3: {
      value: 0,
      override: null,
      max: 0,
    },
    spell4: {
      value: 0,
      override: null,
      max: 0,
    },
    spell5: {
      value: 0,
      override: null,
      max: 0,
    },
    spell6: {
      value: 0,
      override: null,
      max: 0,
    },
    spell7: {
      value: 0,
      override: null,
      max: 0,
    },
    spell8: {
      value: 0,
      override: null,
      max: 0,
    },
    spell9: {
      value: 0,
      override: null,
      max: 0,
    },
    pact: {
      value: 0,
      override: null,
    },
    spell0: {
      value: 0,
      max: 0,
    },
  };

  return spells;
};

const GetBonuses = (creature) => {
  const bonuses = {
    //melee weapon attack
    mwak: {
      attack: "",
      damage: "",
    },
    //ranged weapon attack
    rwak: {
      attack: "",
      damage: "",
    },
    //melee spell attack
    msak: {
      attack: "",
      damage: "",
    },
    //ranged spell attack
    rsak: {
      attack: "",
      damage: "",
    },
    abilities: {
      check: "",
      save: "",
      skill: "",
    },
    spell: {
      dc: "",
    },
  };

  return bonuses;
};

const GetResources = (creature) => {
  const lr = ch.GetLegendaryResistenciesValue(creature.legendaryResistences);
  const rpr = ch.GetReactionsPerRoundValue(creature.reactionsPerRound);

  const resources = {
    legact: {
      value: rpr,
      max: rpr,
    },
    legres: {
      value: lr,
      max: lr,
    },
    lair: {
      value: false,
      initiative: 20,
    },
  };
  return resources;
};

const GetToken = (creature) => {
  const size = cc.creatureSizes.find((s) => s.value === creature.size).foundryTokenExport;

  const token = {
    name: creature.name,
    img: "icons/creatures/mammals/beast-horned-scaled-glowing-orange.webp",
    displayName: 20,
    actorLink: false,
    width: size,
    height: size,
    scale: 1,
    mirrorX: false,
    mirrorY: false,
    lockRotation: false,
    rotation: 0,
    alpha: 1,
    vision: true,
    dimSight: ch.GetSenseValue(creature.senses.darkVision),
    brightSight: 0,
    sightAngle: 0,
    light: {
      alpha: 0.5,
      angle: 0,
      bright: 0,
      coloration: 1,
      dim: 0,
      gradual: true,
      luminosity: 0.5,
      saturation: 0,
      contrast: 0,
      shadows: 0,
      animation: {
        speed: 5,
        intensity: 5,
        reverse: false,
      },
      darkness: {
        min: 0,
        max: 1,
      },
    },
    disposition: -1,
    displayBars: 40,
    bar1: {
      attribute: "attributes.hp",
    },
    bar2: {
      attribute: null,
    },
    flags: {},
    randomImg: false,
    elevation: 0,
    actorData: {},
    effects: [],
  };

  return token;
};

const GetItems = (creature, level, str) => {
  let items = [];

  if (creature.regeneration.amount != null) {
    items.push(GetFoundryExportRegeneration(creature.regeneration));
  }

  if (creature.customSpecials.length > 0) {
    ch.GetCustomSpecialsForDisplay(creature.customSpecials).forEach((cs) => {
      items.push(GetFoundryExportCustomSpecial(cs));
    });
  }

  if (creature.aura) {
    items.push(GetFoundryExportAura(creature.aura, creature.attack, str, level));
  }

  if (creature.actions.length > 0) {
    creature.actions.forEach((a) => {
      items.push(GetFoundryExportAction(a, creature.attack, str, level));
    });
  }

  if (creature.reactions.length > 0) {
    creature.reactions.forEach((r) => {
      items.push(GetFoundryExportReaction(r, creature.attack, str, level));
    });
  }

  if (creature.treasures.length > 0) {
    creature.treasures.forEach((t) => {
      items.push(GetFoundryExportTreasure(t, creature.actions, level));
    });
  }

  return items;
};
const GetActionName = (name, reach, repetitions, frequency, weakSpot) => {
  let actionName = name;

  if (repetitions > 1) {
    actionName += ` (${reach}, Multiaçao x${repetitions})`;
  } else {
    actionName += ` (${reach})`;
  }

  if (frequency || weakSpot) {
    actionName += " -";
  }

  if (frequency != null) {
    actionName += ` ${frequency}`;
  }

  if (weakSpot) {
    actionName += ` (${weakSpot})`;
  }

  return actionName;
};
const GetActionTypeAndIcon = (type, reach, isSpell = false) => {
  let actionType = "other";
  let icon = "modules/plutonium/media/icon/mighty-force.svg";

  if (type === cc.CREATURE_ACTION_TYPES.ATTACK) {
    const isMelee = cc.creatureActionAttackReaches.find((t) => t.value === reach).isMelee;
    if (isMelee && !isSpell) {
      actionType = "mwak";
      icon = "modules/plutonium/media/icon/sword-brandish.svg";
    } else if (!isMelee && !isSpell) {
      actionType = "rwak";
      icon = "modules/plutonium/media/icon/pocket-bow.svg";
    } else if (isMelee && isSpell) {
      actionType = "msak";
      icon = "modules/plutonium/media/icon/crystal-wand.svg";
    } else if (!isMelee && isSpell) {
      actionType = "rsak";
      icon = "modules/plutonium/media/icon/spell-book.svg";
    }
  } else if (type === cc.CREATURE_ACTION_TYPES.SAVING_THROW) {
    actionType = "save";
    icon = "modules/plutonium/media/icon/dragon-breath.svg";
  } else if (type === cc.CREATURE_ACTION_TYPES.HEALING) {
    actionType = "heal";
    icon = "modules/plutonium/media/icon/parmecia.svg";
  }

  return { actionType, icon };
};
const GetActionDamageParts = (action, level) => {
  let damageParts = [];
  if (action.damageIntensity != null) {
    let part = [];

    const damage = sch.getDamage(level, action.damageIntensity);
    part.push(utils.GetValueAsDiceString(damage, true));

    if (action.type !== cc.CREATURE_ACTION_TYPES.HEALING) {
      part.push(cc.damageTypes.find((dt) => dt.value === action.damageType).foundryDisplay);
    }

    damageParts.push(part);
  }

  return damageParts;
};
const GetActionAttackBonus = (action, attack, level, str) => {
  let attackBonus = 0;
  if (action.type === cc.CREATURE_ACTION_TYPES.ATTACK) {
    attackBonus = ch.GetAttackBonusValue(attack, level) - ch.GetProfByLevel(level) - ch.GetAttributeMod(str);
  }

  return attackBonus;
};
const GetFoundryExportRegeneration = (regeneration) => {
  return {
    _id: "custom",
    name: "Regeneração",
    type: "feat",
    img: "modules/plutonium/media/icon/mighty-force.svg",
    data: {
      description: {
        value: `<div class="rd__b  rd__b--3"><p>Regenera <strong>${ch.GetRegenerationAmountValue(
          regeneration.amount
        )}</strong> no começo do turno. Esse efeito não acontece no turno se a criatura sofrer dano de <strong>${
          cc.GetDamageType(regeneration.breakDamage)?.display
        }</strong></p></div></div>`,
        chat: "",
        unidentified: "",
      },
      source: "dnd5Tools",
      activation: {
        type: "",
        cost: 0,
        condition: "",
      },
      duration: {
        value: null,
        units: "",
      },
      target: {
        value: null,
        width: null,
        units: "",
        type: "",
      },
      range: {
        value: null,
        long: null,
        units: "",
      },
      uses: {
        value: null,
        max: "",
        per: null,
      },
      consume: {
        type: null,
        target: null,
        amount: null,
      },
      ability: null,
      actionType: "other",
      attackBonus: 0,
      chatFlavor: "",
      critical: {
        threshold: null,
        damage: "",
      },
      damage: {
        parts: [],
        versatile: "",
      },
      formula: "",
      save: {
        ability: "",
        dc: null,
        scaling: "flat",
      },
      requirements: "",
      recharge: {
        value: null,
        charged: false,
      },
    },
    effects: [],
    folder: null,
    sort: 0,
    permission: {
      default: 0,
    },
    flags: {},
  };
};
const GetFoundryExportCustomSpecial = (customSpecial) => {
  return {
    _id: "custom",
    name: customSpecial,
    type: "feat",
    img: "modules/plutonium/media/icon/mighty-force.svg",
    data: {
      description: {
        value: "",
        chat: "",
        unidentified: "",
      },
      source: "dnd5Tools",
      activation: {
        type: "",
        cost: 0,
        condition: "",
      },
      duration: {
        value: null,
        units: "",
      },
      target: {
        value: null,
        width: null,
        units: "",
        type: "",
      },
      range: {
        value: null,
        long: null,
        units: "",
      },
      uses: {
        value: null,
        max: "",
        per: null,
      },
      consume: {
        type: null,
        target: null,
        amount: null,
      },
      ability: null,
      actionType: "other",
      attackBonus: 0,
      chatFlavor: "",
      critical: {
        threshold: null,
        damage: "",
      },
      damage: {
        parts: [],
        versatile: "",
      },
      formula: "",
      save: {
        ability: "",
        dc: null,
        scaling: "flat",
      },
      requirements: "",
      recharge: {
        value: null,
        charged: false,
      },
    },
    effects: [],
    folder: null,
    sort: 0,
    permission: {
      default: 0,
    },
    flags: {},
  };
};
const GetFoundryExportAura = (aura, attack, str, level) => {
  const description = `Alcance ${ch.GetAuraReachValue(aura.reach)}${GetActionDamangeAndConditionString(aura, level, "strong")}`;
  const actionTypeAndIcon = GetActionTypeAndIcon(aura.type);

  return {
    _id: "custom",
    name: GetActionName(aura.name, ch.GetAuraReachValue(aura.reach), null, null, null, aura.associatedWeakSpot),
    type: "feat",
    img: actionTypeAndIcon.icon,
    data: {
      description: {
        value: `<div class="rd__b  rd__b--3"><p>${description}</p><p>${aura.description ?? ""}</p></div></div>`,
        chat: "",
        unidentified: "",
      },
      source: "dnd5Tools",
      activation: {
        type: "",
        cost: 0,
        condition: "",
      },
      duration: {
        value: null,
        units: "",
      },
      target: {
        value: null,
        width: null,
        units: "",
        type: "",
      },
      range: {
        value: null,
        long: null,
        units: "",
      },
      uses: {
        value: null,
        max: "",
        per: null,
      },
      consume: {
        type: null,
        target: null,
        amount: null,
      },
      ability: null,
      actionType: actionTypeAndIcon.actionType,
      attackBonus: GetActionAttackBonus(aura, attack, level, str),
      chatFlavor: aura.description ?? "",
      critical: {
        threshold: null,
        damage: "",
      },
      damage: {
        parts: GetActionDamageParts(aura, level),
        versatile: "",
      },
      formula: "",
      save: {
        ability: aura.savingThrowAttribute ? cc.creatureAttributeNames.find((an) => an.value === aura.savingThrowAttribute).foundryDisplay : "",
        dc: aura.difficultyClass ? ch.GetDCValue(aura.difficultyClass, level) : null,
        scaling: "flat",
      },
      requirements: "",
      recharge: {
        value: null,
        charged: false,
      },
    },
    effects: [],
    folder: null,
    sort: 0,
    permission: {
      default: 0,
    },
    flags: {},
  };
};
const GetFoundryExportAction = (action, attack, str, level) => {
  let description = "";
  if (action.isSpell) {
    description += `(Magia de Nível ${ch.GetActionSpellValue(action.frequency, level)} - V,S)<br />`;
  }
  description += `${ch.GetActionReachValue(action.reach, action.type)}${GetActionDamangeAndConditionString(action, level, "strong")}`;

  const actionTypeAndIcon = GetActionTypeAndIcon(action.type, action.reach, action.isSpell);

  return {
    _id: "custom",
    name: GetActionName(
      action.name,
      ch.GetActionReachValue(action.reach, action.type),
      cc.GetActionRepetitions(action.repetitions).multiplier,
      cc.GetActionFrequency(action.frequency).display,
      action.associatedWeakSpot
    ),
    type: "feat",
    img: actionTypeAndIcon.icon,
    data: {
      description: {
        value: `<div class="rd__b  rd__b--3"><p>${description}</p><p>${action.description ?? ""}</p></div></div>`,
        chat: "",
        unidentified: "",
      },
      source: "dnd5Tools",
      activation: {
        type: "action",
        cost: 0,
        condition: "",
      },
      duration: {
        value: null,
        units: "",
      },
      target: {
        value: null,
        width: null,
        units: "",
        type: "",
      },
      range: {
        value: null,
        long: null,
        units: "",
      },
      uses: {
        value: null,
        max: "",
        per: null,
      },
      consume: {
        type: null,
        target: null,
        amount: null,
      },
      ability: null,
      actionType: actionTypeAndIcon.actionType,
      attackBonus: GetActionAttackBonus(action, attack, level, str),
      chatFlavor: action.description ?? "",
      critical: {
        threshold: null,
        damage: "",
      },
      damage: {
        parts: GetActionDamageParts(action, level),
        versatile: "",
      },
      formula: "",
      save: {
        ability: action.savingThrowAttribute ? cc.creatureAttributeNames.find((an) => an.value === action.savingThrowAttribute).foundryDisplay : "",
        dc: action.difficultyClass ? ch.GetDCValue(action.difficultyClass, level) : null,
        scaling: "flat",
      },
      requirements: "",
      recharge: {
        value: null,
        charged: false,
      },
    },
    effects: [],
    folder: null,
    sort: 0,
    permission: {
      default: 0,
    },
    flags: {},
  };
};
const GetFoundryExportReaction = (reaction, attack, str, level) => {
  let description = "";
  if (reaction.isSpell) {
    description += `(Magia de Nível ${ch.GetActionSpellValue(reaction.frequency, level)} - V,S)<br />`;
  }
  description += `${reaction.triggerDescription ?? cc.GetReactionTrigger(reaction.trigger).display}, ${ch.GetActionReachValue(
    reaction.reach,
    reaction.type
  )}${GetActionDamangeAndConditionString(reaction, level, "strong")}`;

  const actionTypeAndIcon = GetActionTypeAndIcon(reaction.type, reaction.reach, reaction.isSpell);

  return {
    _id: "custom",
    name: GetActionName(
      reaction.name,
      `${cc.GetReactionTrigger(reaction.trigger).display}, ${ch.GetActionReachValue(reaction.reach, reaction.type)}`,
      1,
      cc.GetActionFrequency(reaction.frequency).display,
      reaction.associatedWeakSpot
    ),
    type: "feat",
    img: actionTypeAndIcon.icon,
    data: {
      description: {
        value: `<div class="rd__b  rd__b--3"><p>${description}</p><p>${reaction.description ?? ""}</p></div></div>`,
        chat: "",
        unidentified: "",
      },
      source: "dnd5Tools",
      activation: {
        type: "reaction",
        cost: 0,
        condition: "",
      },
      duration: {
        value: null,
        units: "",
      },
      target: {
        value: null,
        width: null,
        units: "",
        type: "",
      },
      range: {
        value: null,
        long: null,
        units: "",
      },
      uses: {
        value: null,
        max: "",
        per: null,
      },
      consume: {
        type: "attribute",
        target: "resources.legact.value",
        amount: 1,
      },
      ability: null,
      actionType: actionTypeAndIcon.actionType,
      attackBonus: GetActionAttackBonus(reaction, attack, level, str),
      chatFlavor: reaction.description ?? "",
      critical: {
        threshold: null,
        damage: "",
      },
      damage: {
        parts: GetActionDamageParts(reaction, level),
        versatile: "",
      },
      formula: "",
      save: {
        ability: reaction.savingThrowAttribute
          ? cc.creatureAttributeNames.find((an) => an.value === reaction.savingThrowAttribute).foundryDisplay
          : "",
        dc: reaction.difficultyClass ? ch.GetDCValue(reaction.difficultyClass, level) : null,
        scaling: "flat",
      },
      requirements: "",
      recharge: {
        value: null,
        charged: false,
      },
    },
    effects: [],
    folder: null,
    sort: 0,
    permission: {
      default: 0,
    },
    flags: {},
  };
};
const GetFoundryExportTreasure = (treasure, actions, level) => {
  let name = treasure.name;
  let description = "";
  let img = "";

  if (treasure.type === tc.TREASURE_TYPES.GOLD_PIECES) {
    description = `${th.getGoldPiecesAmount(treasure.goldPieces.quantity)} PO`;
    img = "modules/plutonium/media/icon/cash.svg";
  } else if (treasure.type === tc.TREASURE_TYPES.MATERIAL) {
    name += ` (${th.GetTreasureRarityValue(treasure.material.rarity)})`;
    description = `Peso: ${th.GetMaterialWeightValue(treasure.material.weight)}, Forja: ${th.GetMaterialQuantityValue(treasure.material.quantity)}`;
    img = "modules/plutonium/media/icon/diablo-skull.svg";
  } else if (treasure.type === tc.TREASURE_TYPES.EQUIPMENT) {
    if (!treasure.equipment.ability || treasure.equipment.rarity === cc.CREATURE_RARITIES.LEGENDARY) {
      const generatedItem = th.getItemAfixes(
        treasure.equipment.type,
        treasure.equipment.rarity,
        treasure.equipment.damageType,
        treasure.equipment.attribute
      );
      description += `<p><strong>${generatedItem.name.join(" ")}</strong></p>`;
      description += `<p>${generatedItem.afixes.map((a) => `${a.name}: ${a.bonus}`).join(", ")}</p><br />`;
    }

    if (treasure.equipment.ability) {
      const action = actions.find((a) => a.name === treasure.equipment.ability);

      description += `<p><strong>${action.name}</strong>`;
      let repetitions = cc.GetActionRepetitions(action.repetitions).multiplier;
      if (repetitions > 1) {
        description += ` <strong>(Multiaçao x${repetitions})</strong>`;
      }
      description += ` (Ação, ${th.GetEquipAbilityDailyCharges(action.frequency)} carga(s) por dia)</p>`;
      description += `<p>${ch.GetActionReachValue(action.reach, action.type)}${GetActionDamangeAndConditionString(action, level, "strong")}</p>`;
    }
    img = "modules/plutonium/media/icon/breastplate.svg";
  }

  return {
    _id: "custom",
    name: name,
    type: "equipment",
    img: img,
    data: {
      description: {
        value: `<div class="rd__b  rd__b--3"><p>${description}</p><p>${treasure.description ?? ""}</p></div></div>`,
        chat: "",
        unidentified: "",
      },
      source: "dnd5Tools",
      activation: {
        type: "",
        cost: 0,
        condition: "",
      },
      duration: {
        value: null,
        units: "",
      },
      target: {
        value: null,
        width: null,
        units: "",
        type: "",
      },
      range: {
        value: null,
        long: null,
        units: "",
      },
      uses: {
        value: null,
        max: "",
        per: null,
      },
      consume: {
        type: null,
        target: null,
        amount: null,
      },
      ability: null,
      actionType: "other",
      attackBonus: 0,
      chatFlavor: "",
      critical: {
        threshold: null,
        damage: "",
      },
      damage: {
        parts: [],
        versatile: "",
      },
      formula: "",
      save: {
        ability: "",
        dc: null,
        scaling: "flat",
      },
      requirements: "",
      recharge: {
        value: null,
        charged: false,
      },
    },
    effects: [],
    folder: null,
    sort: 0,
    permission: {
      default: 0,
    },
    flags: {},
  };
};

const GetEffects = (creature) => {
  const effects = [
    {
      _id: "Comportamento Agressivo",
      changes: [
        {
          key: "data.bonuses.All-Attacks",
          mode: 2,
          value: "floor(@prof / 2)",
          priority: "20",
        },
        {
          key: "data.attributes.ac.formula",
          mode: 2,
          value: "- floor(@prof / 2)",
          priority: "20",
        },
      ],
      disabled: true,
      duration: {
        startTime: 0,
        startRound: 0,
        startTurn: 0,
      },
      icon: "icons/svg/sword.svg",
      label: "Comportamento Agressivo",
      origin: "Actor.vBv8R7NQcWlOKtN6",
      transfer: false,
      flags: {
        dae: {
          transfer: true,
          macroRepeat: "none",
          specialDuration: [],
        },
        core: {
          statusId: "",
        },
      },
      tint: "",
      selectedKey: ["data.bonuses.All-Attacks", "data.attributes.ac.formula"],
    },
    {
      _id: "Comportamento Defensivo",
      changes: [
        {
          key: "data.bonuses.All-Attacks",
          mode: 2,
          value: "- floor(@prof / 2)",
          priority: "20",
        },
        {
          key: "data.attributes.ac.formula",
          mode: 2,
          value: "+ floor(@prof / 2)",
          priority: "20",
        },
      ],
      disabled: true,
      duration: {
        startTime: 0,
        startRound: 0,
        startTurn: 0,
      },
      icon: "icons/svg/shield.svg",
      label: "Comportamento Defensivo",
      origin: "Actor.vBv8R7NQcWlOKtN6",
      transfer: false,
      flags: {
        dae: {
          transfer: true,
          macroRepeat: "none",
          specialDuration: [],
        },
        core: {
          statusId: "",
        },
      },
      tint: "",
      selectedKey: ["data.bonuses.All-Attacks", "data.attributes.ac.formula"],
    },
  ];

  return effects;
};

const GetFlags = (creature) => {
  const flags = {
    srd5e: {
      page: "bestiary.html",
      source: "dnd5Tools",
      hash: "custom",
    },
    core: {
      sheetClass: "dnd5e.MonsterBlock5e",
    },
    monsterblock: {
      "theme-choice": "default",
    },
    exportSource: {
      world: "colisao-universal",
      system: "dnd5e",
      coreVersion: "9.269",
      systemVersion: "1.5.7",
    },
  };

  return flags;
};
