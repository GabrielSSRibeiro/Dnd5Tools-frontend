export const GetFoundryFormattedCreature = (creature) => {
  let foundryJson = {
    name: "Skeleton",
    type: "npc",
    img: "https://i.pinimg.com/564x/01/d4/17/01d417c02bd190a056c718650fc9db3b.jpg",
    data: {
      abilities: {
        str: {
          value: 10,
          proficient: 0,
          bonuses: {
            check: 0,
            save: "",
          },
          mod: 0,
        },
        dex: {
          value: 14,
          proficient: 0,
          bonuses: {
            check: 0,
            save: "",
          },
          mod: 2,
        },
        con: {
          value: 15,
          proficient: 0,
          bonuses: {
            check: 0,
            save: "",
          },
          mod: 2,
        },
        int: {
          value: 6,
          proficient: 0,
          bonuses: {
            check: 0,
            save: "",
          },
          mod: -2,
        },
        wis: {
          value: 8,
          proficient: 0,
          bonuses: {
            check: 0,
            save: "",
          },
          mod: -1,
        },
        cha: {
          value: 5,
          proficient: 0,
          bonuses: {
            check: 0,
            save: "",
          },
          mod: -3,
        },
      },
      attributes: {
        ac: {
          flat: null,
          calc: "custom",
          formula: "@attributes.ac.armor + @attributes.ac.dex +1",
          min: 0,
          value: null,
        },
        hp: {
          value: 13,
          min: 0,
          max: 13,
          temp: 0,
          tempmax: 0,
          formula: "2d8 + 4",
        },
        init: {
          value: 0,
          bonus: 0,
          mod: 0,
          total: 2,
          prof: 0,
        },
        movement: {
          burrow: null,
          climb: null,
          fly: null,
          swim: null,
          walk: 30,
          units: "ft",
          hover: false,
        },
        senses: {
          darkvision: 60,
          blindsight: null,
          tremorsense: null,
          truesight: null,
          units: "ft",
          special: "",
        },
        spellcasting: "",
        prof: 2,
        spelldc: 8,
      },
      details: {
        biography: {
          value:
            '<div class="rd__b  rd__b--1"><div class="rd__b  rd__b--2"><p>Skeletons arise when animated by dark magic. They heed the summons of spellcasters who call them from their stony tombs and ancient battlefields, or rise of their own accord in places saturated with death and loss, awakened by stirrings of necromantic energy or the presence of corrupting evil.</p><div class="rd__b  rd__b--3"><span class="rd__h rd__h--3" data-title-index="9"> <span class="entry-title-inner">Animated Dead.</span></span> <p>Whatever sinister force awakens a skeleton infuses its bones with a dark vitality, adhering joint to joint and reassembling dismantled limbs. This energy motivates a skeleton to move and think in a rudimentary fashion, though only as a pale imitation of the way it behaved in life. An animated skeleton retains no connection to its past, although resurrecting a skeleton restores it body and soul, banishing the hateful undead spirit that empowers it.</p><div class="rd__spc-inline-post"></div><p>While most skeletons are the animated remains of dead humans and other humanoids, skeletal undead can be created from the bones of other creatures besides humanoids, giving rise to a host of terrifying and unique forms.</p></div><div class="rd__b  rd__b--3"><span class="rd__h rd__h--3" data-title-index="10"> <span class="entry-title-inner">Obedient Servants.</span></span> <p>Skeletons raised by spell are bound to the will of their creator. They follow orders to the letter, never questioning the tasks their masters give them, regardless of the consequences. Because of their literal interpretation of commands and unwavering obedience, skeletons adapt poorly to changing circumstances. They can\'t read, speak, emote, or communicate in any way except to nod, shake their heads, or point. Still, skeletons are able to accomplish a variety of relatively complex tasks.</p><div class="rd__spc-inline-post"></div><p>A skeleton can fight with weapons and wear armor, can load and fire a catapult or trebuchet, scale a siege ladder, form a shield wall, or dump boiling oil. However, it must receive careful instructions explaining how such tasks are accomplished.</p><p>Although they lack the intellect they possessed in life, skeletons aren\'t mindless. Rather than break its limbs attempting to batter its way through an iron door, a skeleton tries the handle first. If that doesn\'t work, it searches for another way through or around the obstacle.</p></div><div class="rd__b  rd__b--3"><span class="rd__h rd__h--3" data-title-index="11"> <span class="entry-title-inner">Habitual Behaviors.</span></span> <p>Independent skeletons temporarily or permanently free of a master\'s control sometimes pantomime actions from their past lives, their bones echoing the rote behaviors of their former living selves. The skeleton of a miner might lift a pick and start chipping away at stone walls. The skeleton of a guard might strike up a post at a random doorway. The skeleton of a dragon might lie down on a pile of treasure, while the skeleton of a horse crops grass it can\'t eat. Left alone in a ballroom, the skeletons of nobles might continue an eternally unfinished dance.</p><div class="rd__spc-inline-post"></div><p>When skeletons encounter living creatures, the necromantic energy that drives them compels them to kill unless they are commanded by their masters to refrain from doing so. They attack without mercy and fight until destroyed, for skeletons possess little sense of self and even less sense of self-preservation.</p></div><div class="rd__b  rd__b--3"><span class="rd__h rd__h--3" data-title-index="12"> <span class="entry-title-inner">Undead Nature.</span></span> <p>A skeleton doesn\'t require air, food, drink, or sleep.</p><div class="rd__spc-inline-post"></div></div></div></div>',
          public: "",
        },
        alignment: "Lawful Evil",
        race: "",
        type: {
          value: "undead",
          subtype: "",
          swarm: null,
          custom: "",
        },
        environment: "Urban",
        cr: 0.25,
        spellLevel: 0,
        xp: {
          value: 50,
        },
        source: "MM",
        class: {},
      },
      traits: {
        size: "med",
        di: {
          value: ["poison"],
          custom: null,
        },
        dr: {
          value: [],
          custom: null,
        },
        dv: {
          value: ["bludgeoning"],
          custom: null,
        },
        ci: {
          value: ["exhaustion", "poisoned"],
          custom: null,
        },
        languages: {
          value: [],
          custom: "understands all languages it spoke in life but can't speak",
        },
      },
      currency: {
        pp: 0,
        gp: 0,
        ep: 0,
        sp: 0,
        cp: 0,
      },
      skills: {
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
      },
      spells: {
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
      },
      bonuses: {
        mwak: {
          attack: "",
          damage: "",
        },
        rwak: {
          attack: "",
          damage: "",
        },
        msak: {
          attack: "",
          damage: "",
        },
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
      },
      resources: {
        legact: {
          value: 0,
          max: 0,
        },
        legres: {
          value: 0,
          max: 0,
        },
        lair: {
          value: false,
          initiative: 20,
        },
      },
    },
    token: {
      name: "Skeleton",
      img: "assets/srd5e/img/MM/Skeleton.png",
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
      dimSight: 60,
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
    },
    items: [
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
    ],
    effects: [],
    flags: {
      srd5e: {
        page: "bestiary.html",
        source: "MM",
        hash: "skeleton_mm",
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
    },
  };
  return foundryJson;
};
