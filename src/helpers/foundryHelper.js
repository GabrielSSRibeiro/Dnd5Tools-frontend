import * as utils from "../utils";
import * as ch from "./creatureHelper";
import * as cc from "../constants/creatureConstants";

export const GetFoundryFormattedCreature = (creature) => {
  let foundryJson = {
    name: creature.name,
    type: "npc",
    img: creature.image,
    data: {
      abilities: GetAbilities(creature),
      attributes: GetAttributes(creature),
      details: GetDetails(creature),
      traits: GetTraits(creature),
      currency: GetCurrency(creature),
      skills: GetSkills(creature),
      spells: GetSpells(creature),
      bonuses: GetBonuses(creature),
      resources: GetResources(creature),
    },
    token: GetToken(creature),
    items: GetItems(creature),
    effects: GetEffects(creature),
    flags: GetFlags(creature),
  };
  return foundryJson;
};

const GetAbilities = (creature) => {
  const str = ch.GetAttributeValue(creature.attributes.strength);
  const dex = ch.GetAttributeValue(creature.attributes.dexterity);
  const con = ch.GetAttributeValue(creature.attributes.constitution);
  const int = ch.GetAttributeValue(creature.attributes.intelligence);
  const wis = ch.GetAttributeValue(creature.attributes.wisdom);
  const cha = ch.GetAttributeValue(creature.attributes.charisma);

  const abilities = {
    str: {
      value: str,
      proficient: 0,
      bonuses: {
        check: 0,
        save: "",
      },
      mod: utils.GetAttributeMod(str),
    },
    dex: {
      value: dex,
      proficient: 0,
      bonuses: {
        check: 0,
        save: "",
      },
      mod: utils.GetAttributeMod(dex),
    },
    con: {
      value: con,
      proficient: 0,
      bonuses: {
        check: 0,
        save: "",
      },
      mod: utils.GetAttributeMod(con),
    },
    int: {
      value: int,
      proficient: 0,
      bonuses: {
        check: 0,
        save: "",
      },
      mod: utils.GetAttributeMod(int),
    },
    wis: {
      value: wis,
      proficient: 0,
      bonuses: {
        check: 0,
        save: "",
      },
      mod: utils.GetAttributeMod(wis),
    },
    cha: {
      value: cha,
      proficient: 0,
      bonuses: {
        check: 0,
        save: "",
      },
      mod: utils.GetAttributeMod(cha),
    },
  };

  return abilities;
};

const GetAttributes = (creature) => {
  const level = ch.GetAverageLevel(creature.rarity);
  const hp = ch.GetHPValue(level, creature.hitPoints, creature.attributes.constitution);

  const attributes = {
    ac: {
      flat: ch.GetACValue(creature.armorClass),
      calc: "flat",
      formula: "@attributes.ac.armor + @attributes.ac.dex +1",
      min: 0,
      value: null,
    },
    hp: {
      value: hp,
      min: 0,
      max: hp,
      temp: 0,
      tempmax: 0,
      formula: utils.GetValueAsDiceString(hp, true, 0.5),
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
    prof: utils.GetProfByLevel(level),
    spelldc: 8,
  };

  return attributes;
};

const GetDetails = (creature) => {
  const level = ch.GetAverageLevel(creature.rarity);
  const raceAndClasses = [
    ch.GetRaceValue(creature.race),
    ch.GetClassValue(creature.class),
    ch.GetSubClassValue(creature.class, creature.subClass),
    ch.GetClassValue(creature.secondaryClass),
    ch.GetSubClassValue(creature.secondaryClass, creature.secondarySubClass),
  ];

  const details = {
    biography: {
      value: '<div class="rd__b  rd__b--1"><div class="rd__b  rd__b--2"><p>' + creature.description + "</p></div></div>",
      public: "",
    },
    alignment: `${ch.GetPrimaryAlignmentValue(creature.primaryAlignment)} ${ch.GetSecondaryAlignmentValue(creature.secondaryAlignment)}`,
    race: "",
    type: {
      value: "custom",
      subtype: "",
      swarm: null,
      custom: `${ch.GetTypeValue(creature.type)} (${raceAndClasses.filter((i) => i).join(", ")})`,
    },
    environment: ch.GetEnviromentValue(creature.environment),
    cr: level,
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
      value: rpr - 1,
      max: rpr - 1,
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
  const token = {
    name: creature.name,
    img: "icons/creatures/mammals/beast-horned-scaled-glowing-orange.webp",
    displayName: 20,
    actorLink: false,
    width: 1,
    height: 1,
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

const GetItems = (creature) => {
  const items = [
    {
      _id: "Ir3bijTXUagbxUHf",
      name: "Shortsword",
      type: "weapon",
      img: "icons/weapons/swords/sword-guard-brown.webp",
      data: {
        description: {
          value:
            '<div class="rd__b  rd__b--3"><p><i>Melee Weapon Attack:</i> [[/r 1d20+4]] (+4) to hit, reach 5 ft., one target. <i>Hit:</i> 5 ([[/r 1d6 + 2]]) piercing damage.</p><div class="rd__spc-inline-post"></div></div>',
          chat: "",
          unidentified: "",
        },
        source: "MM",
        quantity: 1,
        weight: 2,
        price: 10,
        attunement: 0,
        equipped: true,
        rarity: "",
        identified: false,
        activation: {
          type: "action",
          cost: 1,
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
          value: 5,
          long: 0,
          units: "ft",
        },
        uses: {
          value: null,
          max: "",
          per: "",
        },
        consume: {
          type: "",
          target: "",
          amount: null,
        },
        ability: "dex",
        actionType: "mwak",
        attackBonus: 0,
        chatFlavor: "",
        critical: {
          threshold: null,
          damage: "",
        },
        damage: {
          parts: [["1d6  + @mod", "piercing"]],
          versatile: "",
        },
        formula: "",
        save: {
          ability: "",
          dc: null,
          scaling: "spell",
        },
        armor: {
          value: null,
          dex: null,
        },
        hp: {
          value: 0,
          max: 0,
          dt: null,
          conditions: "",
        },
        weaponType: "martialM",
        baseItem: "shortsword",
        properties: {
          fin: true,
          lgt: true,
          amm: false,
          hvy: false,
          fir: false,
          foc: false,
          lod: false,
          rch: false,
          rel: false,
          ret: false,
          spc: false,
          thr: false,
          two: false,
          ver: false,
        },
        proficient: true,
        attuned: false,
      },
      effects: [],
      folder: null,
      sort: 0,
      permission: {
        default: 0,
        "5QqNlUujvxsRbwxm": 3,
      },
      flags: {
        srd5e: {
          page: "items.html",
          source: "PHB",
          hash: "shortsword_phb",
        },
      },
    },
    {
      _id: "1UP8RDBx4bXX3E0K",
      name: "Shortbow",
      type: "weapon",
      img: "icons/weapons/bows/shortbow-recurve.webp",
      data: {
        description: {
          value:
            '<div class="rd__b  rd__b--3"><p><i>Ranged Weapon Attack:</i> [[/r 1d20+4]] (+4) to hit, range 80/320 ft., one target. <i>Hit:</i> 5 ([[/r 1d6 + 2]]) piercing damage.</p><div class="rd__spc-inline-post"></div></div>',
          chat: "",
          unidentified: "",
        },
        source: "MM",
        quantity: 1,
        weight: 2,
        price: 25,
        attunement: 0,
        equipped: true,
        rarity: "",
        identified: false,
        activation: {
          type: "action",
          cost: 1,
          condition: "",
        },
        duration: {
          value: 0,
          units: "",
        },
        target: {
          value: 0,
          width: null,
          units: "",
          type: "",
        },
        range: {
          value: 80,
          long: 320,
          units: "ft",
        },
        uses: {
          value: null,
          max: "",
          per: "",
        },
        consume: {
          type: "",
          target: "",
          amount: null,
        },
        ability: "dex",
        actionType: "rwak",
        attackBonus: 0,
        chatFlavor: "",
        critical: {
          threshold: null,
          damage: "",
        },
        damage: {
          parts: [["1d6  + @mod", "piercing"]],
          versatile: "",
        },
        formula: "",
        save: {
          ability: "",
          dc: null,
          scaling: "spell",
        },
        armor: {
          value: null,
          dex: null,
        },
        hp: {
          value: 0,
          max: 0,
          dt: null,
          conditions: "",
        },
        weaponType: "simpleR",
        baseItem: "shortbow",
        properties: {
          two: true,
          amm: true,
          hvy: false,
          fin: false,
          fir: false,
          foc: false,
          lgt: false,
          rch: false,
          rel: false,
          ret: false,
          spc: false,
          thr: false,
          ver: false,
          lod: false,
        },
        proficient: true,
        attuned: false,
      },
      effects: [],
      folder: null,
      sort: 0,
      permission: {
        default: 0,
        "5QqNlUujvxsRbwxm": 3,
      },
      flags: {
        srd5e: {
          page: "items.html",
          source: "PHB",
          hash: "shortbow_phb",
        },
      },
    },
  ];

  return items;
};

const GetEffects = (creature) => {
  const effects = [];

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
