export const CREATURE_RARITIES = {
  COMMON: 10,
  UNCOMMON: 20,
  RARE: 30,
  VERY_RARE: 40,
  LEGENDARY: 50,
};
export const creatureRarities = [
  { display: "Comum (Nível 1 - 5)", value: CREATURE_RARITIES.COMMON, weight: 1 },
  { display: "Incomum (Nível 6 - 10)", value: CREATURE_RARITIES.UNCOMMON, weight: 2 },
  { display: "Rara (Nível 11 - 15)", value: CREATURE_RARITIES.RARE, weight: 3 },
  { display: "Muito Rara (Nível 16 - 20)", value: CREATURE_RARITIES.VERY_RARE, weight: 4 },
  { display: "Lendária (Nível 20+)", value: CREATURE_RARITIES.LEGENDARY, weight: 5 },
];

export const CREATURE_ENVIRONMENTS = {
  COSMIC: 10,
  CELESTIAL: 20,
  ARTIC: 30,
  MOUNTAIN: 40,
  FOREST: 50,
  SWAMP: 60,
  URBAN: 70,
  DESERT: 80,
  AQUATIC: 90,
  SUBTERRANEAN: 100,
  ABISSAL: 110,
};
export const creatureEnvironments = [
  { display: "Cósmico", value: CREATURE_ENVIRONMENTS.COSMIC, weight: 0 },
  { display: "Celestial", value: CREATURE_ENVIRONMENTS.CELESTIAL, weight: 0 },
  { display: "Ártico", value: CREATURE_ENVIRONMENTS.ARTIC, weight: 0 },
  { display: "Montanha", value: CREATURE_ENVIRONMENTS.MOUNTAIN, weight: 0 },
  { display: "Floresta", value: CREATURE_ENVIRONMENTS.FOREST, weight: 0 },
  { display: "Pântano", value: CREATURE_ENVIRONMENTS.SWAMP, weight: 0 },
  { display: "Urbano", value: CREATURE_ENVIRONMENTS.URBAN, weight: 0 },
  { display: "Deserto", value: CREATURE_ENVIRONMENTS.DESERT, weight: 0 },
  { display: "Aquático", value: CREATURE_ENVIRONMENTS.AQUATIC, weight: 0 },
  { display: "Subterrâneo", value: CREATURE_ENVIRONMENTS.SUBTERRANEAN, weight: 0 },
  { display: "Abissal", value: CREATURE_ENVIRONMENTS.ABISSAL, weight: 0 },
];

export const CREATURE_SIZES = {
  TINY: 10,
  SMALL: 20,
  MEDIUM: 30,
  LARGE: 40,
  HUGE: 50,
  GARGANTUAN: 60,
};
export const creatureSizes = [
  { display: "Miúdo", value: CREATURE_SIZES.TINY, weight: 1 },
  { display: "Pequeno", value: CREATURE_SIZES.SMALL, weight: 2 },
  { display: "Médio", value: CREATURE_SIZES.MEDIUM, weight: 3 },
  { display: "Grande", value: CREATURE_SIZES.LARGE, weight: 4 },
  { display: "Enorme", value: CREATURE_SIZES.HUGE, weight: 5 },
  { display: "Imenso", value: CREATURE_SIZES.GARGANTUAN, weight: 6 },
];

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

export const CREATURE_MOVEMENTS = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const creatureSpeedMovements = [
  { display: "Baixo", value: CREATURE_MOVEMENTS.LOW, weight: 1 },
  { display: "Médio", value: CREATURE_MOVEMENTS.MEDIUM, weight: 2 },
  { display: "Alto", value: CREATURE_MOVEMENTS.HIGH, weight: 3 },
  { display: "Extremo", value: CREATURE_MOVEMENTS.EXTREME, weight: 4 },
];
export const creatureFlyingMovements = [
  { display: "Baixo", value: CREATURE_MOVEMENTS.LOW, weight: 1 },
  { display: "Médio", value: CREATURE_MOVEMENTS.MEDIUM, weight: 2 },
  { display: "Alto", value: CREATURE_MOVEMENTS.HIGH, weight: 3 },
  { display: "Extremo", value: CREATURE_MOVEMENTS.EXTREME, weight: 4 },
];
export const creatureSwimmingMovements = [
  { display: "Baixo", value: CREATURE_MOVEMENTS.LOW, weight: 1 },
  { display: "Médio", value: CREATURE_MOVEMENTS.MEDIUM, weight: 2 },
  { display: "Alto", value: CREATURE_MOVEMENTS.HIGH, weight: 3 },
  { display: "Extremo", value: CREATURE_MOVEMENTS.EXTREME, weight: 4 },
];
export const creatureBurrowingMovements = [
  { display: "Baixo", value: CREATURE_MOVEMENTS.LOW, weight: 1 },
  { display: "Médio", value: CREATURE_MOVEMENTS.MEDIUM, weight: 2 },
  { display: "Alto", value: CREATURE_MOVEMENTS.HIGH, weight: 3 },
  { display: "Extremo", value: CREATURE_MOVEMENTS.EXTREME, weight: 4 },
];

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

export const CREATURE_ATTRIBUTES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const creatureAttributes = [
  { display: "Baixo", value: CREATURE_ATTRIBUTES.LOW, weight: 1 },
  { display: "Médio", value: CREATURE_ATTRIBUTES.MEDIUM, weight: 2 },
  { display: "Alto", value: CREATURE_ATTRIBUTES.HIGH, weight: 3 },
  { display: "Extremo", value: CREATURE_ATTRIBUTES.EXTREME, weight: 4 },
];

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

export const CREATURE_ATTACKS = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const creatureAttacks = [
  { display: "Baixo", value: CREATURE_ATTACKS.LOW, weight: 1 },
  { display: "Médio", value: CREATURE_ATTACKS.MEDIUM, weight: 2 },
  { display: "Alto", value: CREATURE_ATTACKS.HIGH, weight: 3 },
  { display: "Extremo", value: CREATURE_ATTACKS.EXTREME, weight: 4 },
];

export const CREATURE_ARMOR_CLASS = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const creatureArmorClass = [
  { display: "Baixa", value: CREATURE_ARMOR_CLASS.LOW, weight: 1 },
  { display: "Média", value: CREATURE_ARMOR_CLASS.MEDIUM, weight: 2 },
  { display: "Alta", value: CREATURE_ARMOR_CLASS.HIGH, weight: 3 },
  { display: "Extrema", value: CREATURE_ARMOR_CLASS.EXTREME, weight: 4 },
];

export const CREATURE_INITIATIVES = {
  LOW: 10,
  MEDIUM: 20,
  HIGH: 30,
  EXTREME: 40,
};
export const creatureInitiatives = [
  { display: "Baixa", value: CREATURE_INITIATIVES.LOW, weight: 1 },
  { display: "Média", value: CREATURE_INITIATIVES.MEDIUM, weight: 2 },
  { display: "Alta", value: CREATURE_INITIATIVES.HIGH, weight: 3 },
  { display: "Extrema", value: CREATURE_INITIATIVES.EXTREME, weight: 4 },
];

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
  { display: "Cortante", value: DAMAGE_TYPES.SLASHING, damageEffectiveness: physicalDamagesEffectiveness },
  { display: "Perfurante", value: DAMAGE_TYPES.BLUDGEONING, damageEffectiveness: physicalDamagesEffectiveness },
  { display: "Concussão", value: DAMAGE_TYPES.PIERCING, damageEffectiveness: physicalDamagesEffectiveness },
  { display: "Ácido", value: DAMAGE_TYPES.ACID, damageEffectiveness: magicalDamagesEffectiveness },
  { display: "Elétrico", value: DAMAGE_TYPES.LIGHTNING, damageEffectiveness: magicalDamagesEffectiveness },
  { display: "Energia", value: DAMAGE_TYPES.FORCE, damageEffectiveness: magicalDamagesEffectiveness },
  { display: "Fogo", value: DAMAGE_TYPES.FIRE, damageEffectiveness: magicalDamagesEffectiveness },
  { display: "Frio", value: DAMAGE_TYPES.COLD, damageEffectiveness: magicalDamagesEffectiveness },
  { display: "Necrótico", value: DAMAGE_TYPES.NECROTIC, damageEffectiveness: magicalDamagesEffectiveness },
  { display: "Psíquico", value: DAMAGE_TYPES.PSYCHIC, damageEffectiveness: magicalDamagesEffectiveness },
  { display: "Radiante", value: DAMAGE_TYPES.RADIANT, damageEffectiveness: magicalDamagesEffectiveness },
  { display: "Trovejante", value: DAMAGE_TYPES.THUNDER, damageEffectiveness: magicalDamagesEffectiveness },
  { display: "Veneno", value: DAMAGE_TYPES.POISON, damageEffectiveness: magicalDamagesEffectiveness },
];

export const CONDITIONS = {
  GRAPPLED: 10,
  PRONE: 20,
  BLINDED: 30,
  RESTRAINED: 40,
  POISONED: 50,
  FRIGHTENED: 60,
  STUNNED: 70,
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
  { display: "Atordoado/Incapacitado", value: CONDITIONS.STUNNED, weight: 7 },
  { display: "Paralizado", value: CONDITIONS.PARALYZED, weight: 8 },
  { display: "Petrificado", value: CONDITIONS.PETRIFIED, weight: 9 },
  { display: "Inconsciente", value: CONDITIONS.UNCONSCIOUS, weight: 10 },
  { display: "Exaustão", value: CONDITIONS.EXHAUSTION, weight: 11 },
];
