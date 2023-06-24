export const creatureXps = [
  200, 450, 700, 1100, 1800, 2300, 2900, 3900, 5000, 5900, 7200, 8400, 10000, 11500, 13000, 15000, 18000, 20000, 22000, 25000, 33000, 41000, 50000,
  62000, 75000, 90000, 105000, 12000, 135000, 155000,
];

export const CREATURE_RARITIES = {
  COMMON: 10,
  UNCOMMON: 20,
  RARE: 30,
  VERY_RARE: 40,
  LEGENDARY: 50,
};
export const creatureRarities = [
  {
    display: "Comum (Nível 1 - 5)",
    treasureDisplay: "Comum",
    value: CREATURE_RARITIES.COMMON,
    weight: 0,
    baseOutputMin: 1,
    baseOutputMax: 5,
    color: "#D3D3D3",
  },
  {
    display: "Incomum (Nível 6 - 10)",
    treasureDisplay: "Incomum",
    value: CREATURE_RARITIES.UNCOMMON,
    weight: 0,
    baseOutputMin: 6,
    baseOutputMax: 10,
    color: "#E9BA41",
  },
  {
    display: "Rara (Nível 11 - 15)",
    treasureDisplay: "Raro",
    value: CREATURE_RARITIES.RARE,
    weight: 0,
    baseOutputMin: 11,
    baseOutputMax: 15,
    color: "#E78C25",
  },
  {
    display: "Muito Rara (Nível 16 - 20)",
    treasureDisplay: "Muito Raro",
    value: CREATURE_RARITIES.VERY_RARE,
    weight: 0,
    baseOutputMin: 16,
    baseOutputMax: 20,
    color: "#B93217",
  },
  {
    display: "Lendária (Nível 21+)",
    treasureDisplay: "Lendário",
    value: CREATURE_RARITIES.LEGENDARY,
    weight: 0,
    baseOutputMin: 21,
    baseOutputMax: 40,
    color: "#5C2280",
  },
];
export const GetRarity = (value) => creatureRarities.find((a) => a.value === value);

export const CREATURE_ENVIRONMENTS = {
  COSMIC: 10,
  CELESTIAL: 20,
  ARTIC: 30,
  MOUNTAIN: 40,
  FOREST: 50,
  PLAIN: 55,
  SWAMP: 60,
  URBAN: 70,
  DESERT: 80,
  AQUATIC: 90,
  SUBTERRANEAN: 100,
  ABISSAL: 110,
  ALL: 1,
};
export const creatureEnvironments = [
  { display: "Cósmico", value: CREATURE_ENVIRONMENTS.COSMIC, weight: 0, color: "#4B0082" },
  { display: "Celestial", value: CREATURE_ENVIRONMENTS.CELESTIAL, weight: 0, color: "#B8860B" },
  { display: "Ártico", value: CREATURE_ENVIRONMENTS.ARTIC, weight: 0, color: "#FFFAFA" },
  { display: "Montanha", value: CREATURE_ENVIRONMENTS.MOUNTAIN, weight: 0, color: "#A9A9A9" },
  { display: "Floresta", value: CREATURE_ENVIRONMENTS.FOREST, weight: 0, color: "#228B22" },
  { display: "Planície", value: CREATURE_ENVIRONMENTS.PLAIN, weight: 0, color: "#90EE90" },
  { display: "Pântano", value: CREATURE_ENVIRONMENTS.SWAMP, weight: 0, color: "#556B2F" },
  { display: "Urbano", value: CREATURE_ENVIRONMENTS.URBAN, weight: 0, color: "#708090" },
  { display: "Deserto", value: CREATURE_ENVIRONMENTS.DESERT, weight: 0, color: "#F4A460" },
  { display: "Aquático", value: CREATURE_ENVIRONMENTS.AQUATIC, weight: 0, color: "#6CD7D7" },
  { display: "Subterrâneo", value: CREATURE_ENVIRONMENTS.SUBTERRANEAN, weight: 0, color: "#808080" },
  { display: "Abissal", value: CREATURE_ENVIRONMENTS.ABISSAL, weight: 0, color: "#8B0000" },
  { display: "Todos", value: CREATURE_ENVIRONMENTS.ALL, weight: 0, color: "#000000" },
];
export const GetEnviroment = (value) => creatureEnvironments.find((e) => e.value === value);

export const CREATURE_SIZES = {
  TINY: 10,
  SMALL: 20,
  MEDIUM: 30,
  LARGE: 40,
  HUGE: 50,
  GARGANTUAN: 60,
};
export const creatureSizes = [
  { display: "Miúdo", value: CREATURE_SIZES.TINY, weight: 1, foundryExport: "tiny", foundryTokenExport: 0.5 },
  { display: "Pequeno", value: CREATURE_SIZES.SMALL, weight: 2, foundryExport: "sm", foundryTokenExport: 1 },
  { display: "Médio", value: CREATURE_SIZES.MEDIUM, weight: 3, foundryExport: "med", foundryTokenExport: 1 },
  { display: "Grande", value: CREATURE_SIZES.LARGE, weight: 4, foundryExport: "lg", foundryTokenExport: 2 },
  { display: "Enorme", value: CREATURE_SIZES.HUGE, weight: 5, foundryExport: "huge", foundryTokenExport: 3 },
  { display: "Imenso", value: CREATURE_SIZES.GARGANTUAN, weight: 6, foundryExport: "grg", foundryTokenExport: 4 },
];
export const GetSize = (value) => creatureSizes.find((s) => s.value === value);

export const CREATURE_TYPES = {
  ABERRATION: 10,
  BEAST: 20,
  CELESTIAL: 30,
  CONSTRUCT: 40,
  DRAGON: 50,
  ELEMENTAL: 60,
  FEY: 70,
  FIEND: 80,
  GIANT: 90,
  HUMANOID: 100,
  MONSTROSITY: 110,
  OOZE: 120,
  PLANT: 130,
  UNDEAD: 140,
};
export const creatureTypes = [
  { display: "Aberração", value: CREATURE_TYPES.ABERRATION, weight: 0 },
  { display: "Besta", value: CREATURE_TYPES.BEAST, weight: 0 },
  { display: "Celestial", value: CREATURE_TYPES.CELESTIAL, weight: 0 },
  { display: "Constructo", value: CREATURE_TYPES.CONSTRUCT, weight: 0 },
  { display: "Corruptor", value: CREATURE_TYPES.FIEND, weight: 0 },
  { display: "Dragão", value: CREATURE_TYPES.DRAGON, weight: 0 },
  { display: "Elemental", value: CREATURE_TYPES.ELEMENTAL, weight: 0 },
  { display: "Fada", value: CREATURE_TYPES.FEY, weight: 0 },
  { display: "Gigante", value: CREATURE_TYPES.GIANT, weight: 0 },
  { display: "Humanóide", value: CREATURE_TYPES.HUMANOID, weight: 0 },
  { display: "Limo", value: CREATURE_TYPES.OOZE, weight: 0 },
  { display: "Monstruosidade", value: CREATURE_TYPES.MONSTROSITY, weight: 0 },
  { display: "Morto-vivo", value: CREATURE_TYPES.UNDEAD, weight: 0 },
  { display: "Planta", value: CREATURE_TYPES.PLANT, weight: 0 },
];
export const GetType = (value) => creatureTypes.find((t) => t.value === value);

export const CREATURE_RACES = {
  DWARF: 10,
  DRAGONBORN: 20,
  ELF: 30,
  HALF_ELF: 40,
  GNOME: 50,
  HALFLING: 60,
  HUMAN: 70,
  HALF_ORC: 80,
  TIEFLING: 90,
};
export const creatureRaces = [
  { display: "Anão", value: CREATURE_RACES.DWARF, weight: 0 },
  { display: "Draconato", value: CREATURE_RACES.DRAGONBORN, weight: 0 },
  { display: "Elfo", value: CREATURE_RACES.ELF, weight: 0 },
  { display: "Meio-elfo", value: CREATURE_RACES.HALF_ELF, weight: 0 },
  { display: "Gnomo", value: CREATURE_RACES.GNOME, weight: 0 },
  { display: "Halfling", value: CREATURE_RACES.HALFLING, weight: 0 },
  { display: "Humano", value: CREATURE_RACES.HUMAN, weight: 0 },
  { display: "Meio-orc", value: CREATURE_RACES.HALF_ORC, weight: 0 },
  { display: "Tiefling", value: CREATURE_RACES.TIEFLING, weight: 0 },
];
export const GetRace = (value) => creatureRaces.find((r) => r.value === value);

export const CREATURE_CLASSES = {
  ARTIFICER: 10,
  BARBARIAN: 20,
  BARD: 30,
  CLERIC: 40,
  DRUID: 50,
  FIGHTER: 60,
  MONK: 70,
  PALADIN: 80,
  RANGER: 90,
  ROGUE: 100,
  SORCERER: 110,
  WARLOCK: 120,
  WIZARD: 130,
};
export const CREATURE_ARTIFICER_SUBCLASSES = {
  ALCHEMIST: 10,
  ARMORER: 20,
  ARTILLERIST: 30,
  BATTLE_SMITH: 40,
};
export const CREATURE_BARBARIAN_SUBCLASSES = {
  BERSERKER: 10,
  TOTEM_WARRIOR: 20,
  ANCESTRAL_GUARDIAN: 30,
  STORM_HERALD: 40,
  ZEALOT: 50,
  BEAST: 60,
  WILD_SOUL: 70,
};
export const CREATURE_BARD_SUBCLASSES = {
  COLLEGE_OF_LORE: 10,
  COLLEGE_OF_VALOR: 20,
  COLLEGE_OF_CREATION: 30,
  COLLEGE_OF_GLAMOR: 40,
  COLLEGE_OF_SWORDS: 50,
  COLLEGE_OF_WHISPERS: 60,
  COLLEGE_OF_ELOQUENCE: 70,
};
export const CREATURE_CLERIC_SUBCLASSES = {
  KNOWLEDGE_DOMAIN: 10,
  LIFE_DOMAIN: 20,
  LIGHT_DOMAIN: 30,
  NATURE_DOMAIN: 40,
  TEMPEST_DOMAIN: 50,
  TRICKERY_DOMAIN: 60,
  WAR_DOMAIN: 70,
  TWILIGHT_DOMAIN: 80,
  ORDER_DOMAIN: 90,
  FORGE_DOMAIN: 100,
  GRAVE_DOMAIN: 110,
  PEACE_DOMAIN: 120,
};
export const CREATURE_DRUID_SUBCLASSES = {
  CIRCLE_OF_THE_LAND: 10,
  CIRCLE_OF_THE_MOON: 20,
  CIRCLE_OF_DREAMS: 30,
  CIRCLE_OF_THE_SHEPHERD: 40,
  CIRCLE_OF_SPORES: 50,
  CIRCLE_OF_STARS: 60,
  CIRCLE_OF_WILDFIRE: 70,
};
export const CREATURE_FIGHTER_SUBCLASSES = {
  CHAMPION: 10,
  BATTLE_MASTER: 20,
  ELDRITCH_KNIGHT: 30,
  ARCANE_ARCHER: 40,
  CAVALIER: 50,
  SAMURAI: 60,
  PSI_WARRIOR: 70,
  RUNE_KNIGHT: 80,
};
export const CREATURE_MONK_SUBCLASSES = {
  WAY_OF_THE_OPEN_HAND: 10,
  WAY_OF_THE_SHADOW: 20,
  WAY_OF_THE_FOUR_ELEMENTS: 30,
  WAY_OF_MERCY: 40,
  WAY_OF_THE_ASTRAL_SELF: 50,
  WAY_OF_THE_DRUNKEN_MASTER: 60,
  WAY_OF_THE_KENSEI: 70,
  WAY_OF_THE_SUN_SOUL: 80,
};
export const CREATURE_PALADIN_SUBCLASSES = {
  OATH_OF_DEVOTION: 10,
  OATH_OF_THE_ANCIENTS: 20,
  OATH_OF_VENGEANCE: 30,
  OATH_OF_CONQUEST: 40,
  OATH_OF_REDEMPTION: 50,
  OATH_OF_GLORY: 60,
  OATH_OF_THE_WATCHERS: 70,
};
export const CREATURE_RANGER_SUBCLASSES = {
  FEY_WANDERER: 10,
  SWARMKEEPER: 20,
  GLOOM_STALKER: 30,
  HORIZON_WALKER: 40,
  MONSTER_SLAYER: 50,
  HUNTER: 60,
  BEAST_MASTER: 70,
};
export const CREATURE_ROGUE_SUBCLASSES = {
  THIEF: 10,
  ASSASSIN: 20,
  ARCANE_TRICKSTER: 30,
  INQUISITIVE: 40,
  MASTERMIND: 50,
  SCOUT: 60,
  SWASHBUCKLER: 70,
  PHANTOM: 80,
  SOULKNIFE: 90,
};
export const CREATURE_SORCERER_SUBCLASSES = {
  ABERRANT_MIND: 10,
  CLOCKWORK_SOUL: 20,
  DIVINE_SOUL: 30,
  SHADOW_MAGIC: 40,
  STORM_SORCERY: 50,
  DRACONIC_BLOODLINE: 60,
  WILD_MAGIC: 70,
};
export const CREATURE_WARLOCK_SUBCLASSES = {
  ARCHFEY: 10,
  FIEND: 20,
  GREAT_OLD_ONE: 30,
  CELESTIAL: 40,
  HEXBLADE: 50,
  FATHOMLESS: 60,
  GENIE: 70,
};
export const CREATURE_WIZARD_SUBCLASSES = {
  SCHOOL_OF_ABJURATION: 10,
  SCHOOL_OF_CONJURATION: 20,
  SCHOOL_OF_DIVINATION: 30,
  SCHOOL_OF_ENCHANTMENT: 40,
  SCHOOL_OF_EVOCATION: 50,
  SCHOOL_OF_ILLUSION: 60,
  SCHOOL_OF_NECROMANCY: 70,
  SCHOOL_OF_TRANSMUTATION: 80,
  WAR_MAGIC: 90,
  BLADESINGING: 100,
  ORDER_OF_SCRIBES: 110,
};

export const creatureClasses = [
  {
    display: "Artifice",
    value: CREATURE_CLASSES.ARTIFICER,
    weight: 0,
    subClasses: [
      { display: "Alquimista", value: CREATURE_ARTIFICER_SUBCLASSES.ALCHEMIST, weight: 0 },
      { display: "Armeiro", value: CREATURE_ARTIFICER_SUBCLASSES.ARMORER, weight: 0 },
      { display: "Atirador", value: CREATURE_ARTIFICER_SUBCLASSES.ARTILLERIST, weight: 0 },
      { display: "Ferreiro de Batalha", value: CREATURE_ARTIFICER_SUBCLASSES.BATTLE_SMITH, weight: 0 },
    ],
  },
  {
    display: "Bárbaro",
    value: CREATURE_CLASSES.BARBARIAN,
    weight: 0,
    subClasses: [
      { display: "Caminho da Besta", value: CREATURE_BARBARIAN_SUBCLASSES.BEAST, weight: 0 },
      { display: "Caminho da Magia Selvagem", value: CREATURE_BARBARIAN_SUBCLASSES.WILD_SOUL, weight: 0 },
      { display: "Caminho do Arauto da Tempestade", value: CREATURE_BARBARIAN_SUBCLASSES.STORM_HERALD, weight: 0 },
      { display: "Caminho do Fanático", value: CREATURE_BARBARIAN_SUBCLASSES.ZEALOT, weight: 0 },
      { display: "Caminho do Furioso", value: CREATURE_BARBARIAN_SUBCLASSES.BERSERKER, weight: 0 },
      { display: "Caminho do Guardião Ancestral", value: CREATURE_BARBARIAN_SUBCLASSES.ANCESTRAL_GUARDIAN, weight: 0 },
      { display: "Caminho do Guerreiro Totêmico", value: CREATURE_BARBARIAN_SUBCLASSES.TOTEM_WARRIOR, weight: 0 },
    ],
  },
  {
    display: "Bardo",
    value: CREATURE_CLASSES.BARD,
    weight: 0,
    subClasses: [
      { display: "Colégio da Bravura", value: CREATURE_BARD_SUBCLASSES.COLLEGE_OF_VALOR, weight: 0 },
      { display: "Colégio da Criação", value: CREATURE_BARD_SUBCLASSES.COLLEGE_OF_CREATION, weight: 0 },
      { display: "Colégio da Eloquência", value: CREATURE_BARD_SUBCLASSES.COLLEGE_OF_ELOQUENCE, weight: 0 },
      { display: "Colégio das Espadas", value: CREATURE_BARD_SUBCLASSES.COLLEGE_OF_SWORDS, weight: 0 },
      { display: "Colégio do Conhecimento", value: CREATURE_BARD_SUBCLASSES.COLLEGE_OF_LORE, weight: 0 },
      { display: "Colégio do Glamour", value: CREATURE_BARD_SUBCLASSES.COLLEGE_OF_GLAMOR, weight: 0 },
      { display: "Colégio dos Sussurros", value: CREATURE_BARD_SUBCLASSES.COLLEGE_OF_WHISPERS, weight: 0 },
    ],
  },
  {
    display: "Bruxo",
    value: CREATURE_CLASSES.WARLOCK,
    weight: 0,
    subClasses: [
      { display: "Arquifada", value: CREATURE_WARLOCK_SUBCLASSES.ARCHFEY, weight: 0 },
      { display: "Celestial", value: CREATURE_WARLOCK_SUBCLASSES.CELESTIAL, weight: 0 },
      { display: "Corruptor", value: CREATURE_WARLOCK_SUBCLASSES.FIEND, weight: 0 },
      { display: "Gênio", value: CREATURE_WARLOCK_SUBCLASSES.GENIE, weight: 0 },
      { display: "Grande Antigo", value: CREATURE_WARLOCK_SUBCLASSES.GREAT_OLD_ONE, weight: 0 },
      { display: "Insondável", value: CREATURE_WARLOCK_SUBCLASSES.FATHOMLESS, weight: 0 },
      { display: "Lâmina Maldita", value: CREATURE_WARLOCK_SUBCLASSES.HEXBLADE, weight: 0 },
    ],
  },
  {
    display: "Clérigo",
    value: CREATURE_CLASSES.CLERIC,
    weight: 0,
    subClasses: [
      { display: "Domínio da Enganação", value: CREATURE_CLERIC_SUBCLASSES.TRICKERY_DOMAIN, weight: 0 },
      { display: "Domínio da Forja", value: CREATURE_CLERIC_SUBCLASSES.FORGE_DOMAIN, weight: 0 },
      { display: "Domínio da Guerra", value: CREATURE_CLERIC_SUBCLASSES.WAR_DOMAIN, weight: 0 },
      { display: "Domínio da Luz", value: CREATURE_CLERIC_SUBCLASSES.LIGHT_DOMAIN, weight: 0 },
      { display: "Domínio da Natureza", value: CREATURE_CLERIC_SUBCLASSES.NATURE_DOMAIN, weight: 0 },
      { display: "Domínio da Ordem", value: CREATURE_CLERIC_SUBCLASSES.ORDER_DOMAIN, weight: 0 },
      { display: "Domínio da Paz", value: CREATURE_CLERIC_SUBCLASSES.PEACE_DOMAIN, weight: 0 },
      { display: "Domínio da Sepultura", value: CREATURE_CLERIC_SUBCLASSES.GRAVE_DOMAIN, weight: 0 },
      { display: "Domínio da Tempestade", value: CREATURE_CLERIC_SUBCLASSES.TEMPEST_DOMAIN, weight: 0 },
      { display: "Domínio da Vida", value: CREATURE_CLERIC_SUBCLASSES.LIFE_DOMAIN, weight: 0 },
      { display: "Domínio do Conhecimento", value: CREATURE_CLERIC_SUBCLASSES.KNOWLEDGE_DOMAIN, weight: 0 },
      { display: "Domínio do Crepúsculo", value: CREATURE_CLERIC_SUBCLASSES.TWILIGHT_DOMAIN, weight: 0 },
    ],
  },
  {
    display: "Druida",
    value: CREATURE_CLASSES.DRUID,
    weight: 0,
    subClasses: [
      { display: "Círculo da Lua", value: CREATURE_DRUID_SUBCLASSES.CIRCLE_OF_THE_MOON, weight: 0 },
      { display: "Círculo da Terra", value: CREATURE_DRUID_SUBCLASSES.CIRCLE_OF_THE_LAND, weight: 0 },
      { display: "Círculo das Estrelas", value: CREATURE_DRUID_SUBCLASSES.CIRCLE_OF_STARS, weight: 0 },
      { display: "Círculo do Fogo Selvagem", value: CREATURE_DRUID_SUBCLASSES.CIRCLE_OF_WILDFIRE, weight: 0 },
      { display: "Círculo do Pastor", value: CREATURE_DRUID_SUBCLASSES.CIRCLE_OF_THE_SHEPHERD, weight: 0 },
      { display: "Círculo dos Esporos", value: CREATURE_DRUID_SUBCLASSES.CIRCLE_OF_SPORES, weight: 0 },
      { display: "Círculo dos Sonhos", value: CREATURE_DRUID_SUBCLASSES.CIRCLE_OF_DREAMS, weight: 0 },
    ],
  },
  {
    display: "Feiticeiro",
    value: CREATURE_CLASSES.SORCERER,
    weight: 0,
    subClasses: [
      { display: "Adepto das Sombras", value: CREATURE_SORCERER_SUBCLASSES.SHADOW_MAGIC, weight: 0 },
      { display: "Alma Cronométrica", value: CREATURE_SORCERER_SUBCLASSES.CLOCKWORK_SOUL, weight: 0 },
      { display: "Alma Favorecida", value: CREATURE_SORCERER_SUBCLASSES.DIVINE_SOUL, weight: 0 },
      { display: "Feiticeiro da Tempestade", value: CREATURE_SORCERER_SUBCLASSES.STORM_SORCERY, weight: 0 },
      { display: "Linhagem Dracônica", value: CREATURE_SORCERER_SUBCLASSES.DRACONIC_BLOODLINE, weight: 0 },
      { display: "Magia Selvagem", value: CREATURE_SORCERER_SUBCLASSES.WILD_MAGIC, weight: 0 },
      { display: "Mente Aberrante", value: CREATURE_SORCERER_SUBCLASSES.ABERRANT_MIND, weight: 0 },
    ],
  },
  {
    display: "Guerreiro",
    value: CREATURE_CLASSES.FIGHTER,
    weight: 0,
    subClasses: [
      { display: "Arqueiro Arcano", value: CREATURE_FIGHTER_SUBCLASSES.ARCANE_ARCHER, weight: 0 },
      { display: "Campeão", value: CREATURE_FIGHTER_SUBCLASSES.CHAMPION, weight: 0 },
      { display: "Cavaleiro", value: CREATURE_FIGHTER_SUBCLASSES.CAVALIER, weight: 0 },
      { display: "Cavaleiro Arcano", value: CREATURE_FIGHTER_SUBCLASSES.ELDRITCH_KNIGHT, weight: 0 },
      { display: "Cavaleiro Rúnico", value: CREATURE_FIGHTER_SUBCLASSES.RUNE_KNIGHT, weight: 0 },
      { display: "Guerreiro Psiônico", value: CREATURE_FIGHTER_SUBCLASSES.PSI_WARRIOR, weight: 0 },
      { display: "Mestre de Batalha", value: CREATURE_FIGHTER_SUBCLASSES.BATTLE_MASTER, weight: 0 },
      { display: "Samurai", value: CREATURE_FIGHTER_SUBCLASSES.SAMURAI, weight: 0 },
    ],
  },
  {
    display: "Ladino",
    value: CREATURE_CLASSES.ROGUE,
    weight: 0,
    subClasses: [
      { display: "Alma Laminada", value: CREATURE_ROGUE_SUBCLASSES.SOULKNIFE, weight: 0 },
      { display: "Assassino", value: CREATURE_ROGUE_SUBCLASSES.ASSASSIN, weight: 0 },
      { display: "Batedor", value: CREATURE_ROGUE_SUBCLASSES.SCOUT, weight: 0 },
      { display: "Espadachim", value: CREATURE_ROGUE_SUBCLASSES.SWASHBUCKLER, weight: 0 },
      { display: "Fantasma", value: CREATURE_ROGUE_SUBCLASSES.PHANTOM, weight: 0 },
      { display: "Inquiridor", value: CREATURE_ROGUE_SUBCLASSES.INQUISITIVE, weight: 0 },
      { display: "Ladrão", value: CREATURE_ROGUE_SUBCLASSES.THIEF, weight: 0 },
      { display: "Mentor", value: CREATURE_ROGUE_SUBCLASSES.MASTERMIND, weight: 0 },
      { display: "Trapasseiro Arcano", value: CREATURE_ROGUE_SUBCLASSES.ARCANE_TRICKSTER, weight: 0 },
    ],
  },
  {
    display: "Mago",
    value: CREATURE_CLASSES.WIZARD,
    weight: 0,
    subClasses: [
      { display: "Escola de Abjuração", value: CREATURE_WIZARD_SUBCLASSES.SCHOOL_OF_ABJURATION, weight: 0 },
      { display: "Escola de Adivinhação", value: CREATURE_WIZARD_SUBCLASSES.SCHOOL_OF_DIVINATION, weight: 0 },
      { display: "Escola de Conjuração", value: CREATURE_WIZARD_SUBCLASSES.SCHOOL_OF_CONJURATION, weight: 0 },
      { display: "Escola de Encantamento", value: CREATURE_WIZARD_SUBCLASSES.SCHOOL_OF_ENCHANTMENT, weight: 0 },
      { display: "Escola de Evocação", value: CREATURE_WIZARD_SUBCLASSES.SCHOOL_OF_EVOCATION, weight: 0 },
      { display: "Escola de Ilusão", value: CREATURE_WIZARD_SUBCLASSES.SCHOOL_OF_ILLUSION, weight: 0 },
      { display: "Escola de Necromancia", value: CREATURE_WIZARD_SUBCLASSES.SCHOOL_OF_NECROMANCY, weight: 0 },
      { display: "Escola de Transmutação", value: CREATURE_WIZARD_SUBCLASSES.SCHOOL_OF_TRANSMUTATION, weight: 0 },
      { display: "Lâmina Cantante", value: CREATURE_WIZARD_SUBCLASSES.BLADESINGING, weight: 0 },
      { display: "Mago de Guerra", value: CREATURE_WIZARD_SUBCLASSES.WAR_MAGIC, weight: 0 },
      { display: "Ordem dos Escribas", value: CREATURE_WIZARD_SUBCLASSES.ORDER_OF_SCRIBES, weight: 0 },
    ],
  },
  {
    display: "Monge",
    value: CREATURE_CLASSES.MONK,
    weight: 0,
    subClasses: [
      { display: "Caminho da Forma Astral", value: CREATURE_MONK_SUBCLASSES.WAY_OF_THE_ASTRAL_SELF, weight: 0 },
      { display: "Caminho da Mão Aberta", value: CREATURE_MONK_SUBCLASSES.WAY_OF_THE_OPEN_HAND, weight: 0 },
      { display: "Caminho da Misericórdia", value: CREATURE_MONK_SUBCLASSES.WAY_OF_MERCY, weight: 0 },
      { display: "Caminho da Sombra", value: CREATURE_MONK_SUBCLASSES.WAY_OF_THE_SHADOW, weight: 0 },
      { display: "Caminho dos Quatro Elementos", value: CREATURE_MONK_SUBCLASSES.WAY_OF_THE_FOUR_ELEMENTS, weight: 0 },
      { display: "Estilo da Alma Solar", value: CREATURE_MONK_SUBCLASSES.WAY_OF_THE_SUN_SOUL, weight: 0 },
      { display: "Estilo do Kensei", value: CREATURE_MONK_SUBCLASSES.WAY_OF_THE_KENSEI, weight: 0 },
      { display: "Estilo do Mestre Bêbado", value: CREATURE_MONK_SUBCLASSES.WAY_OF_THE_DRUNKEN_MASTER, weight: 0 },
    ],
  },
  {
    display: "Paladino",
    value: CREATURE_CLASSES.PALADIN,
    weight: 0,
    subClasses: [
      { display: "Juramento da Conquista", value: CREATURE_PALADIN_SUBCLASSES.OATH_OF_CONQUEST, weight: 0 },
      { display: "Juramento da Devoção", value: CREATURE_PALADIN_SUBCLASSES.OATH_OF_DEVOTION, weight: 0 },
      { display: "Juramento da Glória", value: CREATURE_PALADIN_SUBCLASSES.OATH_OF_GLORY, weight: 0 },
      { display: "Juramento da Redenção", value: CREATURE_PALADIN_SUBCLASSES.OATH_OF_REDEMPTION, weight: 0 },
      { display: "Juramento da Vigilância", value: CREATURE_PALADIN_SUBCLASSES.OATH_OF_THE_WATCHERS, weight: 0 },
      { display: "Juramento da Vingança", value: CREATURE_PALADIN_SUBCLASSES.OATH_OF_VENGEANCE, weight: 0 },
      { display: "Juramento dos Anciões", value: CREATURE_PALADIN_SUBCLASSES.OATH_OF_THE_ANCIENTS, weight: 0 },
    ],
  },
  {
    display: "Patrulheiro",
    value: CREATURE_CLASSES.RANGER,
    weight: 0,
    subClasses: [
      { display: "Andarilho do Horizonte", value: CREATURE_RANGER_SUBCLASSES.HORIZON_WALKER, weight: 0 },
      { display: "Andarilho Feérico", value: CREATURE_RANGER_SUBCLASSES.FEY_WANDERER, weight: 0 },
      { display: "Caçador", value: CREATURE_RANGER_SUBCLASSES.HUNTER, weight: 0 },
      { display: "Exterminador de Monstros", value: CREATURE_RANGER_SUBCLASSES.MONSTER_SLAYER, weight: 0 },
      { display: "Mestre das Bestas", value: CREATURE_RANGER_SUBCLASSES.BEAST_MASTER, weight: 0 },
      { display: "Perseguidor Obscuro", value: CREATURE_RANGER_SUBCLASSES.GLOOM_STALKER, weight: 0 },
      { display: "Portador do Enxame", value: CREATURE_RANGER_SUBCLASSES.SWARMKEEPER, weight: 0 },
    ],
  },
];
export const GetClass = (value) => creatureClasses.find((c) => c.value === value);
export const GetSubClass = (cClass, subClass) => GetClass(cClass)?.subClasses.find((sc) => sc.value === subClass);

export const CREATURE_MOVEMENTS = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};

export const creatureSpeedMovements = [
  { display: "Baixo (6m)", value: CREATURE_MOVEMENTS.LOW, weight: 1, baseOutput: 20 },
  { display: "Médio (9m)", value: CREATURE_MOVEMENTS.MEDIUM, weight: 2, baseOutput: 30 },
  { display: "Alto (12m)", value: CREATURE_MOVEMENTS.HIGH, weight: 3, baseOutput: 40 },
  { display: "Extremo (18m)", value: CREATURE_MOVEMENTS.EXTREME, weight: 4, baseOutput: 60 },
];
export const GetSpeed = (value) => creatureSpeedMovements.find((a) => a.value === value);

export const creatureFlyingMovements = [
  { display: "Baixo (6m)", value: CREATURE_MOVEMENTS.LOW, weight: 1, baseOutput: 20 },
  { display: "Médio (9m)", value: CREATURE_MOVEMENTS.MEDIUM, weight: 2, baseOutput: 30 },
  { display: "Alto (12m)", value: CREATURE_MOVEMENTS.HIGH, weight: 3, baseOutput: 40 },
  { display: "Extremo (18m)", value: CREATURE_MOVEMENTS.EXTREME, weight: 4, baseOutput: 60 },
];
export const GetFlying = (value) => creatureFlyingMovements.find((a) => a.value === value);

export const creatureSwimmingMovements = [
  { display: "Baixo (6m)", value: CREATURE_MOVEMENTS.LOW, weight: 1, baseOutput: 20 },
  { display: "Médio (9m)", value: CREATURE_MOVEMENTS.MEDIUM, weight: 2, baseOutput: 30 },
  { display: "Alto (12m)", value: CREATURE_MOVEMENTS.HIGH, weight: 3, baseOutput: 40 },
  { display: "Extremo (18m)", value: CREATURE_MOVEMENTS.EXTREME, weight: 4, baseOutput: 60 },
];
export const GetSwimming = (value) => creatureSwimmingMovements.find((a) => a.value === value);

export const creatureBurrowingMovements = [
  { display: "Baixo (6m)", value: CREATURE_MOVEMENTS.LOW, weight: 1, baseOutput: 20 },
  { display: "Médio (9m)", value: CREATURE_MOVEMENTS.MEDIUM, weight: 2, baseOutput: 30 },
  { display: "Alto (12m)", value: CREATURE_MOVEMENTS.HIGH, weight: 3, baseOutput: 40 },
  { display: "Extremo (18m)", value: CREATURE_MOVEMENTS.EXTREME, weight: 4, baseOutput: 60 },
];
export const GetBurrowing = (value) => creatureBurrowingMovements.find((a) => a.value === value);

export const CREATURE_PRIMARY_ALIGNMENTS = {
  CHAOTIC: 10,
  NEUTRAL: 20,
  LAWFUL: 30,
};
export const creaturePrimaryAlignments = [
  { display: "Caótico", value: CREATURE_PRIMARY_ALIGNMENTS.CHAOTIC, weight: 0 },
  { display: "Neutro", value: CREATURE_PRIMARY_ALIGNMENTS.NEUTRAL, weight: 0 },
  { display: "Leal", value: CREATURE_PRIMARY_ALIGNMENTS.LAWFUL, weight: 0 },
];
export const GetPrimaryAlignment = (value) => creaturePrimaryAlignments.find((a) => a.value === value);

export const CREATURE_SECONDARY_ALIGNMENTS = {
  EVIL: 10,
  NEUTRAL: 20,
  GOOD: 30,
};
export const creatureSecondaryAlignments = [
  { display: "Mau", value: CREATURE_SECONDARY_ALIGNMENTS.EVIL, weight: 0 },
  { display: "Neutro", value: CREATURE_SECONDARY_ALIGNMENTS.NEUTRAL, weight: 0 },
  { display: "Bom", value: CREATURE_SECONDARY_ALIGNMENTS.GOOD, weight: 0 },
];
export const GetSecondaryAlignment = (value) => creatureSecondaryAlignments.find((a) => a.value === value);

export const CREATURE_ATTRIBUTES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const creatureAttributes = [
  { display: "Baixo (6-10)", value: CREATURE_ATTRIBUTES.LOW, weight: 1, baseOutput: 8 },
  { display: "Médio (12-16)", value: CREATURE_ATTRIBUTES.MEDIUM, weight: 2, baseOutput: 14 },
  { display: "Alto (18-22)", value: CREATURE_ATTRIBUTES.HIGH, weight: 3, baseOutput: 20 },
  { display: "Extremo (24-28)", value: CREATURE_ATTRIBUTES.EXTREME, weight: 4, baseOutput: 26 },
];
export const GetAttribute = (value) => creatureAttributes.find((a) => a.value === value);

export const CREATURE_ATTRIBUTE_NAMES = {
  STRENGTH: 10,
  DEXTERITY: 20,
  CONSTITUTION: 30,
  INTELLIGENCE: 40,
  WISDOM: 50,
  CHARISMA: 60,
};
export const creatureAttributeNames = [
  { display: "Força", value: CREATURE_ATTRIBUTE_NAMES.STRENGTH, weight: 0, foundryDisplay: "str" },
  { display: "Destreza", value: CREATURE_ATTRIBUTE_NAMES.DEXTERITY, weight: 0, foundryDisplay: "dex" },
  { display: "Constituiçao", value: CREATURE_ATTRIBUTE_NAMES.CONSTITUTION, weight: 0, foundryDisplay: "con" },
  { display: "Inteligencia", value: CREATURE_ATTRIBUTE_NAMES.INTELLIGENCE, weight: 0, foundryDisplay: "int" },
  { display: "Sabedoria", value: CREATURE_ATTRIBUTE_NAMES.WISDOM, weight: 0, foundryDisplay: "wis" },
  { display: "Carisma", value: CREATURE_ATTRIBUTE_NAMES.CHARISMA, weight: 0, foundryDisplay: "cha" },
];
export const GetSavingThrowAttribute = (value) => creatureAttributeNames.find((i) => i.value === value);

export const CREATURE_HIT_POINTS = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const creatureHitPoints = [
  { display: "Baixo", value: CREATURE_HIT_POINTS.LOW, weight: 1 },
  { display: "Médio", value: CREATURE_HIT_POINTS.MEDIUM, weight: 2 },
  { display: "Alto", value: CREATURE_HIT_POINTS.HIGH, weight: 3 },
  { display: "Extremo", value: CREATURE_HIT_POINTS.EXTREME, weight: 4 },
];
export const GetHitPoints = (value) => creatureHitPoints.find((a) => a.value === value);

export const CREATURE_ATTACKS = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const creatureAttacks = [
  { display: "Baixo", value: CREATURE_ATTACKS.LOW, weight: 1, baseOutput: 2 },
  { display: "Médio", value: CREATURE_ATTACKS.MEDIUM, weight: 2, baseOutput: 4 },
  { display: "Alto", value: CREATURE_ATTACKS.HIGH, weight: 3, baseOutput: 6 },
  { display: "Extremo", value: CREATURE_ATTACKS.EXTREME, weight: 4, baseOutput: 8 },
];
export const GetAttackBonus = (value) => creatureAttacks.find((a) => a.value === value);

export const CREATURE_ARMOR_CLASSES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const creatureArmorClasses = [
  { display: "Baixa (10-12)", value: CREATURE_ARMOR_CLASSES.LOW, weight: 1, baseOutput: 11 },
  { display: "Média (14-16)", value: CREATURE_ARMOR_CLASSES.MEDIUM, weight: 2, baseOutput: 15 },
  { display: "Alta (18-20)", value: CREATURE_ARMOR_CLASSES.HIGH, weight: 3, baseOutput: 19 },
  { display: "Extrema (22-24)", value: CREATURE_ARMOR_CLASSES.EXTREME, weight: 4, baseOutput: 23 },
];
export const GetArmorClass = (value) => creatureArmorClasses.find((a) => a.value === value);

export const CREATURE_INITIATIVES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const creatureInitiatives = [
  { display: "Baixa", value: CREATURE_INITIATIVES.LOW, weight: 1, baseOutput: -2 },
  { display: "Média", value: CREATURE_INITIATIVES.MEDIUM, weight: 2, baseOutput: 2 },
  { display: "Alta", value: CREATURE_INITIATIVES.HIGH, weight: 3, baseOutput: 6 },
  { display: "Extrema", value: CREATURE_INITIATIVES.EXTREME, weight: 4, baseOutput: 10 },
];
export const GetInitiative = (value) => creatureInitiatives.find((a) => a.value === value);

export const DAMAGES_EFFECTIVENESS = {
  VULNERABLE: 10,
  NORMAL: 20,
  RESISTENT: 30,
  IMMUNE: 40,
};
export const physicalDamagesEffectiveness = [
  { display: "Vulnerável", value: DAMAGES_EFFECTIVENESS.VULNERABLE, weight: 1 },
  { display: "Normal", value: DAMAGES_EFFECTIVENESS.NORMAL, weight: 2 },
  { display: "Resistente", value: DAMAGES_EFFECTIVENESS.RESISTENT, weight: 3 },
  { display: "Imune", value: DAMAGES_EFFECTIVENESS.IMMUNE, weight: 4 },
];
export const magicalDamagesEffectiveness = [
  { display: "Vulnerável", value: DAMAGES_EFFECTIVENESS.VULNERABLE, weight: 1 },
  { display: "Normal", value: DAMAGES_EFFECTIVENESS.NORMAL, weight: 2 },
  { display: "Resistente", value: DAMAGES_EFFECTIVENESS.RESISTENT, weight: 3 },
  { display: "Imune", value: DAMAGES_EFFECTIVENESS.IMMUNE, weight: 4 },
];

export const DAMAGE_TYPES = {
  SLASHING: 10,
  BLUDGEONING: 20,
  PIERCING: 30,
  ACID: 40,
  COLD: 50,
  FIRE: 60,
  FORCE: 70,
  LIGHTNING: 80,
  NECROTIC: 90,
  POISON: 100,
  PSYCHIC: 110,
  RADIANT: 120,
  THUNDER: 130,
};
export const damageTypes = [
  { display: "Cortante", value: DAMAGE_TYPES.SLASHING, damageEffectiveness: physicalDamagesEffectiveness, weight: 1, foundryDisplay: "slashing" },
  {
    display: "Perfurante",
    value: DAMAGE_TYPES.BLUDGEONING,
    damageEffectiveness: physicalDamagesEffectiveness,
    weight: 1,
    foundryDisplay: "piercing",
  },
  { display: "Concussao", value: DAMAGE_TYPES.PIERCING, damageEffectiveness: physicalDamagesEffectiveness, weight: 1, foundryDisplay: "bludgeoning" },
  { display: "Ácido", value: DAMAGE_TYPES.ACID, damageEffectiveness: magicalDamagesEffectiveness, weight: 2, foundryDisplay: "acid" },
  { display: "Elétrico", value: DAMAGE_TYPES.LIGHTNING, damageEffectiveness: magicalDamagesEffectiveness, weight: 2, foundryDisplay: "lightning" },
  { display: "Energia", value: DAMAGE_TYPES.FORCE, damageEffectiveness: magicalDamagesEffectiveness, weight: 3, foundryDisplay: "force" },
  { display: "Fogo", value: DAMAGE_TYPES.FIRE, damageEffectiveness: magicalDamagesEffectiveness, weight: 2, foundryDisplay: "fire" },
  { display: "Frio", value: DAMAGE_TYPES.COLD, damageEffectiveness: magicalDamagesEffectiveness, weight: 2, foundryDisplay: "cold" },
  { display: "Necrótico", value: DAMAGE_TYPES.NECROTIC, damageEffectiveness: magicalDamagesEffectiveness, weight: 3, foundryDisplay: "necrotic" },
  { display: "Psíquico", value: DAMAGE_TYPES.PSYCHIC, damageEffectiveness: magicalDamagesEffectiveness, weight: 3, foundryDisplay: "psychic" },
  { display: "Radiante", value: DAMAGE_TYPES.RADIANT, damageEffectiveness: magicalDamagesEffectiveness, weight: 3, foundryDisplay: "radiant" },
  { display: "Trovejante", value: DAMAGE_TYPES.THUNDER, damageEffectiveness: magicalDamagesEffectiveness, weight: 2, foundryDisplay: "thunder" },
  { display: "Veneno", value: DAMAGE_TYPES.POISON, damageEffectiveness: magicalDamagesEffectiveness, weight: 2, foundryDisplay: "poison" },
];
export const regenerationNoBreakDamange = { value: null, weight: 4 };
export const GetDamageType = (value) => damageTypes.find((i) => i.value === value);

export const CONDITIONS = {
  GRAPPLED: 10,
  PRONE: 20,
  BLINDED: 30,
  RESTRAINED: 40,
  POISONED: 50,
  FRIGHTENED: 60,
  STUNNED: 70,
  CHARMED: 75,
  PARALYZED: 80,
  PETRIFIED: 90,
  UNCONSCIOUS: 100,
  EXHAUSTION: 110,
};
export const conditions = [
  { display: "Agarrado", value: CONDITIONS.GRAPPLED, weight: 1 },
  { display: "Derrubado", value: CONDITIONS.PRONE, weight: 2 },
  { display: "Cego/Surdo", value: CONDITIONS.BLINDED, weight: 3 },
  { display: "Impedido", value: CONDITIONS.RESTRAINED, weight: 4 },
  { display: "Envenenado", value: CONDITIONS.POISONED, weight: 5 },
  { display: "Amedrontado", value: CONDITIONS.FRIGHTENED, weight: 6 },
  { display: "Atordoado", value: CONDITIONS.STUNNED, weight: 7 },
  { display: "Enfeitiçado", value: CONDITIONS.CHARMED, weight: 7 },
  { display: "Paralizado", value: CONDITIONS.PARALYZED, weight: 8 },
  { display: "Petrificado", value: CONDITIONS.PETRIFIED, weight: 9 },
  { display: "Exaustao", value: CONDITIONS.EXHAUSTION, weight: 10 },
];
export const GetCondition = (value) => conditions.find((i) => i.value === value);

export const CONDITION_DURATIONS = {
  SHORT: 10,
  MEDIUM: 20,
  LONG: 30,
  EXTREME: 40,
};
export const conditionDurations = [
  { display: "Baixa (1 turno)", value: CONDITION_DURATIONS.SHORT, weight: 1, baseOutput: "1 turno" },
  { display: "Média (1 minuto)", value: CONDITION_DURATIONS.MEDIUM, weight: 2, baseOutput: "1 minuto" },
  { display: "Alta (1 hora)", value: CONDITION_DURATIONS.LONG, weight: 3, baseOutput: "1 hora" },
  { display: "Extrema (1 dia)", value: CONDITION_DURATIONS.EXTREME, weight: 4, baseOutput: "1 dia" },
];
export const GetConditionDuration = (value) => conditionDurations.find((i) => i.value === value);

export const LANGUAGES = {
  COMMON: 10,
  UNDERCOMMON: 20,
  ABYSSAL: 30,
  DWARVISH: 40,
  CELESTIAL: 50,
  DRACONIC: 60,
  ELVISH: 70,
  GIANT: 80,
  GNOMISH: 90,
  HALFLING: 100,
  INFERNAL: 110,
  ORC: 120,
  PRIMORDIAL: 130,
  SYLVAN: 140,
  DEEP_SPEECH: 150,
};
export const languages = [
  { display: "Comum", value: LANGUAGES.COMMON, weight: 0 },
  { display: "Subcomum", value: LANGUAGES.UNDERCOMMON, weight: 0 },
  { display: "Abissal", value: LANGUAGES.ABYSSAL, weight: 0 },
  { display: "Anão", value: LANGUAGES.DWARVISH, weight: 0 },
  { display: "Celestial", value: LANGUAGES.CELESTIAL, weight: 0 },
  { display: "Dracônico", value: LANGUAGES.DRACONIC, weight: 0 },
  { display: "Élfico", value: LANGUAGES.ELVISH, weight: 0 },
  { display: "Gigante", value: LANGUAGES.GIANT, weight: 0 },
  { display: "Gnômico", value: LANGUAGES.GNOMISH, weight: 0 },
  { display: "Halfling", value: LANGUAGES.HALFLING, weight: 0 },
  { display: "Infernal", value: LANGUAGES.INFERNAL, weight: 0 },
  { display: "Orc", value: LANGUAGES.ORC, weight: 0 },
  { display: "Primordial", value: LANGUAGES.PRIMORDIAL, weight: 0 },
  { display: "Silvestre", value: LANGUAGES.SYLVAN, weight: 0 },
  { display: "Subterrâneo", value: LANGUAGES.DEEP_SPEECH, weight: 0 },
];
export const GetLanguage = (value) => languages.find((s) => s.value === value);

export const CREATURE_SENSE_REACHES = {
  SHORT: 10,
  MEDIUM: 20,
  LONG: 30,
  EXTREME: 40,
};
export const creatureSenseReaches = [
  { display: "Curto (3m)", value: CREATURE_SENSE_REACHES.SHORT, weight: 1, baseOutput: 10 },
  { display: "Médio (6m)", value: CREATURE_SENSE_REACHES.MEDIUM, weight: 2, baseOutput: 20 },
  { display: "Longo (9m)", value: CREATURE_SENSE_REACHES.LONG, weight: 3, baseOutput: 30 },
  { display: "Extremo (18m)", value: CREATURE_SENSE_REACHES.EXTREME, weight: 4, baseOutput: 60 },
];
export const GetSense = (value) => creatureSenseReaches.find((a) => a.value === value);

export const CREATURE_LEGENDARY_RESISTENCES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const creatureLegendaryResistences = [
  { display: "Baixa (1 uso)", value: CREATURE_LEGENDARY_RESISTENCES.LOW, weight: 1, totalNumber: 1 },
  { display: "Média (2 uso)", value: CREATURE_LEGENDARY_RESISTENCES.MEDIUM, weight: 2, totalNumber: 2 },
  { display: "Alta (3 uso)", value: CREATURE_LEGENDARY_RESISTENCES.HIGH, weight: 3, totalNumber: 3 },
  { display: "Extrema (4 uso)", value: CREATURE_LEGENDARY_RESISTENCES.EXTREME, weight: 4, totalNumber: 4 },
];
export const GetLegendaryResistency = (value) => creatureLegendaryResistences.find((lr) => lr.value === value);

export const CREATURE_REGENERATIONS = {
  WEAK: 10,
  MEDIUM: 20,
  STRONG: 30,
  EXTREME: 40,
};
export const creatureRegenerations = [
  { display: "Fraca (5 PV)", value: CREATURE_REGENERATIONS.WEAK, weight: 1, amount: 5 },
  { display: "Média (10 PV)", value: CREATURE_REGENERATIONS.MEDIUM, weight: 2, amount: 10 },
  { display: "Forte (15 PV)", value: CREATURE_REGENERATIONS.STRONG, weight: 3, amount: 15 },
  { display: "Extrema (20 PV)", value: CREATURE_REGENERATIONS.EXTREME, weight: 4, amount: 20 },
];
export const GetRegenerationAmount = (value) => creatureRegenerations.find((r) => r.value === value);

export const CREATURE_CUSTOM_SPECIAL_MULTIPLIERS = {
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 30,
  EXTREME: 40,
};
export const creatureCustomSpecialMultipliers = [
  { display: "Pequeno (Extra 10%)", value: CREATURE_CUSTOM_SPECIAL_MULTIPLIERS.SMALL, weight: 0, multiplier: 0.1 },
  { display: "Média (Extra 20%)", value: CREATURE_CUSTOM_SPECIAL_MULTIPLIERS.MEDIUM, weight: 0, multiplier: 0.2 },
  { display: "Grande (Extra 50%)", value: CREATURE_CUSTOM_SPECIAL_MULTIPLIERS.LARGE, weight: 0, multiplier: 0.5 },
  { display: "Extrema (Extra 100%)", value: CREATURE_CUSTOM_SPECIAL_MULTIPLIERS.EXTREME, weight: 0, multiplier: 1 },
];
export const GetCustomSpecialMultiplier = (value) => creatureCustomSpecialMultipliers.find((s) => s.value === value);

export const CREATURE_REACTIONS_PER_ROUND = {
  NORMAL: 10,
  EXTRA_LOW: 20,
  EXTRA_HIGH: 30,
  EXTRA_EXTREME: 40,
};
export const creatureReactionsPerRound = [
  { display: "Normal (1 uso)", value: CREATURE_REACTIONS_PER_ROUND.NORMAL, weight: 1, number: 1 },
  { display: "Extra Pouca (2 usos)", value: CREATURE_REACTIONS_PER_ROUND.EXTRA_LOW, weight: 2, number: 2 },
  { display: "Extra Muita (3 usos)", value: CREATURE_REACTIONS_PER_ROUND.EXTRA_HIGH, weight: 3, number: 3 },
  { display: "Extra Extrema (5 usos)", value: CREATURE_REACTIONS_PER_ROUND.EXTRA_EXTREME, weight: 5, number: 5 },
];
export const GetReactionsPerRound = (value) => creatureReactionsPerRound.find((i) => i.value === value);

export const CREATURE_ACTION_POWER_TOTAL_PERCENTAGES = {
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 30,
  EXTREME: 40,
};
export const creatureActionPowerTotalPercentages = [
  { display: "10% do Máximo", value: CREATURE_ACTION_POWER_TOTAL_PERCENTAGES.SMALL, weight: 0, powerTotal: 0.1 },
  { display: "20% do Máximo", value: CREATURE_ACTION_POWER_TOTAL_PERCENTAGES.MEDIUM, weight: 0, powerTotal: 0.2 },
  { display: "50% do Máximo", value: CREATURE_ACTION_POWER_TOTAL_PERCENTAGES.LARGE, weight: 0, powerTotal: 0.5 },
  { display: "100% do Máximo", value: CREATURE_ACTION_POWER_TOTAL_PERCENTAGES.EXTREME, weight: 0, powerTotal: 1 },
];
export const GetCreatureActionPowerTotalPercentage = (value) => creatureActionPowerTotalPercentages.find((i) => i.value === value);

export const CREATURE_ACTION_ATTACK_REACHES = {
  MELEE_CLOSE: 10,
  MELEE_EXTRA: 20,
  MELEE_FAR: 30,
  RANGED_CLOSE: 40,
  RANGED_EXTRA: 50,
  RANGED_FAR: 60,
};
export const creatureActionAttackReaches = [
  { display: "Corpo a Corpo, 1,5m", value: CREATURE_ACTION_ATTACK_REACHES.MELEE_CLOSE, weight: 1, isMelee: true },
  { display: "Corpo a Corpo, 3m", value: CREATURE_ACTION_ATTACK_REACHES.MELEE_EXTRA, weight: 2, isMelee: true },
  { display: "Corpo a Corpo, 4,5m", value: CREATURE_ACTION_ATTACK_REACHES.MELEE_FAR, weight: 3, isMelee: true },
  { display: "Distância, 9m", value: CREATURE_ACTION_ATTACK_REACHES.RANGED_CLOSE, weight: 4, isMelee: false },
  { display: "Distância, 18m", value: CREATURE_ACTION_ATTACK_REACHES.RANGED_EXTRA, weight: 5, isMelee: false },
  { display: "Distância, 36-90m", value: CREATURE_ACTION_ATTACK_REACHES.RANGED_FAR, weight: 6, isMelee: false },
];
export const GetCreatureActionAttackReaches = (value) => creatureActionAttackReaches.find((i) => i.value === value);

export const CREATURE_ACTION_SAVING_THROW_REACHES = {
  LINE_CLOSE: 10,
  LINE_MEDIUM: 20,
  LINE_FAR: 30,
  CONE_SHORT: 40,
  CONE_MEDIUM: 50,
  CONE_LARGE: 60,
  SPHERE_SMALL: 70,
  SPHERE_MEDIUM: 80,
  SHEPRE_BIG: 90,
};
export const creatureActionSavingThrowReaches = [
  { display: "Linha, 3m", value: CREATURE_ACTION_SAVING_THROW_REACHES.LINE_CLOSE, weight: 1 },
  { display: "Linha, 9m", value: CREATURE_ACTION_SAVING_THROW_REACHES.LINE_MEDIUM, weight: 2 },
  { display: "Linha, 18m", value: CREATURE_ACTION_SAVING_THROW_REACHES.LINE_FAR, weight: 3 },
  { display: "Cone, 1,5m", value: CREATURE_ACTION_SAVING_THROW_REACHES.CONE_SHORT, weight: 1 },
  { display: "Cone, 4,5m", value: CREATURE_ACTION_SAVING_THROW_REACHES.CONE_MEDIUM, weight: 2 },
  { display: "Cone, 9m", value: CREATURE_ACTION_SAVING_THROW_REACHES.CONE_LARGE, weight: 3 },
  { display: "Esfera, 1,5m", value: CREATURE_ACTION_SAVING_THROW_REACHES.SPHERE_SMALL, weight: 2 },
  { display: "Esfera, 3m", value: CREATURE_ACTION_SAVING_THROW_REACHES.SPHERE_MEDIUM, weight: 3 },
  { display: "Esfera, 6m", value: CREATURE_ACTION_SAVING_THROW_REACHES.SHEPRE_BIG, weight: 4 },
];
export const GetCreatureActionSavingThrowReache = (value) => creatureActionSavingThrowReaches.find((i) => i.value === value);

export const creatureActionHealingReaches = [...creatureActionAttackReaches, ...creatureActionSavingThrowReaches];

export const CREATURE_ACTION_TYPES = {
  ATTACK: 10,
  SAVING_THROW: 20,
  HEALING: 30,
  EFFECT: 40,
};
export const creatureActionTypes = [
  { display: "Ataque", value: CREATURE_ACTION_TYPES.ATTACK, weight: 0, reaches: creatureActionAttackReaches },
  { display: "Teste de Resistência", value: CREATURE_ACTION_TYPES.SAVING_THROW, weight: 0, reaches: creatureActionSavingThrowReaches },
  { display: "Cura", value: CREATURE_ACTION_TYPES.HEALING, weight: 0, reaches: creatureActionHealingReaches },
  { display: "Efeito", value: CREATURE_ACTION_TYPES.EFFECT, weight: 0, reaches: creatureActionHealingReaches },
];
export const GetCreatureActionType = (value) => creatureActionTypes.find((i) => i.value === value);

export const CREATURE_ACTION_FREQUENCIES = {
  COMMON: 10,
  UNCOMMON: 20,
  RARE: 30,
  VERY_RARE: 40,
};
export const creatureActionFrequencies = [
  { display: "Comum", value: CREATURE_ACTION_FREQUENCIES.COMMON, weight: 0, cooldown: 0, probability: 1 },
  { display: "Incomum", value: CREATURE_ACTION_FREQUENCIES.UNCOMMON, weight: 0, cooldown: 1, probability: 0.5 },
  { display: "Raro", value: CREATURE_ACTION_FREQUENCIES.RARE, weight: 0, cooldown: 2, probability: 0.25 },
  { display: "Muito Raro", value: CREATURE_ACTION_FREQUENCIES.VERY_RARE, weight: 0, cooldown: 3, probability: 0.1 },
];
export const GetActionFrequency = (value) => creatureActionFrequencies.find((i) => i.value === value);

export const DAMAGE_INTENSITIES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const damageIntensities = [
  { display: "Baixa", value: DAMAGE_INTENSITIES.LOW, weight: 1 },
  { display: "Média", value: DAMAGE_INTENSITIES.MEDIUM, weight: 2 },
  { display: "Alta", value: DAMAGE_INTENSITIES.HIGH, weight: 3 },
  { display: "Extrema", value: DAMAGE_INTENSITIES.EXTREME, weight: 4 },
];
export const GetDamageIntensity = (value) => damageIntensities.find((i) => i.value === value);

export const DIFFICULTY_CLASSES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const difficultyClasses = [
  { display: "Baixa", value: DIFFICULTY_CLASSES.LOW, weight: 1, baseOutput: 10 },
  { display: "Média", value: DIFFICULTY_CLASSES.MEDIUM, weight: 2, baseOutput: 12 },
  { display: "Alta", value: DIFFICULTY_CLASSES.HIGH, weight: 3, baseOutput: 14 },
  { display: "Extrema", value: DIFFICULTY_CLASSES.EXTREME, weight: 4, baseOutput: 16 },
];
export const GetDifficultyClass = (value) => difficultyClasses.find((i) => i.value === value);

export const CREATURE_REACTION_TRIGGERS = {
  ON_DAMAGE_TAKEN: 10,
  ON_ALLY_DEATH: 20,
  ON_END_OF_PLAYER_TURN: 30,
  OTHER: 40,
};
export const creatureReactionTriggers = [
  { display: "Ao sofrer dano", value: CREATURE_REACTION_TRIGGERS.ON_DAMAGE_TAKEN, weight: 1 },
  { display: "Quando um aliado morre", value: CREATURE_REACTION_TRIGGERS.ON_ALLY_DEATH, weight: 1 },
  { display: "Ao final do turno de jogador", value: CREATURE_REACTION_TRIGGERS.ON_END_OF_PLAYER_TURN, weight: 3 },
  { display: "Outro", value: CREATURE_REACTION_TRIGGERS.OTHER, weight: 1 },
];
export const GetReactionTrigger = (value) => creatureReactionTriggers.find((i) => i.value === value);

export const CREATURE_AURA_REACHES = {
  SHORT: 10,
  MEDIUM: 20,
  LONG: 30,
  EXTREME: 40,
};
export const creatureAuraReaches = [
  { display: "Curto (1,5m)", value: CREATURE_AURA_REACHES.SHORT, weight: 1, baseOutput: "1,5m", foundryExport: 5 },
  { display: "Médio (3m)", value: CREATURE_AURA_REACHES.MEDIUM, weight: 2, baseOutput: "3m", foundryExport: 10 },
  { display: "Alto (4,5m)", value: CREATURE_AURA_REACHES.LONG, weight: 3, baseOutput: "4,5m", foundryExport: 15 },
  { display: "Extremo (6m)", value: CREATURE_AURA_REACHES.EXTREME, weight: 4, baseOutput: "6m", foundryExport: 20 },
];
export const GetAuraReach = (value) => creatureAuraReaches.find((s) => s.value === value);

export const CREATURE_ACTION_REPETITIONS = {
  NORMAL: 10,
  MULTIACTION_COMMOM: 20,
  MULTIACTION_EXTRA: 30,
  MULTIACTION_EXTREME: 40,
};
export const creatureActionRepetitions = [
  { display: "Normal (x1)", value: CREATURE_ACTION_REPETITIONS.NORMAL, weight: 0, multiplier: 1 },
  { display: "Multiação comum (x2)", value: CREATURE_ACTION_REPETITIONS.MULTIACTION_COMMOM, weight: 0, multiplier: 2 },
  { display: "Multiação extra (x3)", value: CREATURE_ACTION_REPETITIONS.MULTIACTION_EXTRA, weight: 0, multiplier: 3 },
  { display: "Multiação extrema (x4)", value: CREATURE_ACTION_REPETITIONS.MULTIACTION_EXTREME, weight: 0, multiplier: 4 },
];
export const GetActionRepetitions = (value) => creatureActionRepetitions.find((s) => s.value === value);
