//Bestiary filters
export const NONE = "Nenhum";
export const RANDOM = "Aleatório";

export const CREATURE_RARITIES = [
  "Comum (Nível 1 - 5)",
  "Incomum (Nível 6 - 10)",
  "Rara (Nível 11 - 15)",
  "Muito Rara (Nível 16 - 20)",
  "Lendária (Nível 20+)",
];
export const CREATURE_ENVIROMENTS = [
  "Cósmico",
  "Celestial",
  "Ártico",
  "Montanha",
  "Floresta",
  "Pântano",
  "Urbano",
  "Deserto",
  "Aquático",
  "Subterrâneo",
  "Abissal",
];
export const CREATURE_SIZES = ["Miúdo", "Pequeno", "Médio", "Grande", "Enorme", "Imenso"];
export const HUMANOID_CREATURE_TYPE = "Humanóide";
export const CREATURE_TYPES = [
  "Aberração",
  "Besta",
  "Celestial",
  "Constructo",
  "Corruptor",
  "Dragão",
  "Elemental",
  "Fada",
  "Gigante",
  HUMANOID_CREATURE_TYPE,
  "Limo",
  "Monstruosidade",
  "Morto-vivo",
  "Planta",
];

export const DEFAULT_CREATURE_RACE = NONE;
export const CREATURE_RACES = [
  DEFAULT_CREATURE_RACE,
  "Anão",
  "Draconato",
  "Elfo",
  "Meio-elfo",
  "Gnomo",
  "Halfling",
  "Humano",
  "Meio-orc",
  "Tiefling",
];

export const DEFAULT_CREATURE_CLASS = NONE;
export const DEFAULT_CREATURE_SUBCLASS = NONE;
export const CREATURE_CLASSES = [
  { name: "Artifice", subClasses: ["Alquimista", "Armeiro", "Atirador", "Ferreiro de Batalha"] },
  {
    name: "Bárbaro",
    subClasses: [
      "Caminho da Besta",
      "Caminho da Magia Selvagem",
      "Caminho do Arauto da Tempestade",
      "Caminho do Fanático",
      "Caminho do Furioso",
      "Caminho do Guardião Ancestral",
      "Caminho do Guerreiro Totêmico",
    ],
  },
  {
    name: "Bardo",
    subClasses: [
      "Colégio da Bravura",
      "Colégio da Criação",
      "Colégio da Eloquência",
      "Colégio das Espadas",
      "Colégio do Conhecimento",
      "Colégio do Glamour",
      "Colégio dos Sussurros",
    ],
  },
  { name: "Bruxo", subClasses: ["Arquifada", "Celestial", "Corruptor", "Gênio", "Grande Antigo", "Insondável", "Lâmina Maldita"] },
  {
    name: "Clérigo",
    subClasses: [
      "Domínio da Enganação",
      "Domínio da Forja",
      "Domínio da Guerra",
      "Domínio da Luz",
      "Domínio da Natureza",
      "Domínio da Ordem",
      "Domínio da Paz",
      "Domínio da Sepultura",
      "Domínio da Tempestade",
      "Domínio da Vida",
      "Domínio do Conhecimento",
      "Domínio do Crepúsculo",
    ],
  },
  {
    name: "Druida",
    subClasses: [
      "Círculo da Lua",
      "Círculo da Terra",
      "Círculo das Estrelas",
      "Círculo do Fogo Selvagem",
      "Círculo do Pastor",
      "Círculo dos Esporos",
      "Círculo dos Sonhos",
    ],
  },
  {
    name: "Feiticeiro",
    subClasses: [
      "Adepto das Sombras",
      "Alma Cronométrica",
      "Alma Favorecida",
      "Feiticeiro da Tempestade",
      "Linhagem Dracônica",
      "Magia Selvagem",
      "Mente Aberrante",
    ],
  },
  {
    name: "Guerreiro",
    subClasses: [
      "Arqueiro Arcano",
      "Campeão",
      "Cavaleiro",
      "Cavaleiro Arcano",
      "Cavaleiro Rúnico",
      "Guerreiro Psiônico",
      "Mestre de Batalha",
      "Samurai",
    ],
  },
  {
    name: "Ladino",
    subClasses: ["Alma Laminada", "Assassino", "Batedor", "Espadachim", "Fantasma", "Inquiridor", "Ladrão", "Mentor", "Trapasseiro Arcano"],
  },
  {
    name: "Mago",
    subClasses: [
      "Escola de Abjuração",
      "Escola de Adivinhação",
      "Escola de Conjuração",
      "Escola de Encantamento",
      "Escola de Evocação",
      "Escola de Ilusão",
      "Escola de Necromancia",
      "Escola de Transmutação",
      "Lâmina Cantante",
      "Mago de Guerra",
      "Ordem dos Escribas",
    ],
  },
  {
    name: "Monge",
    subClasses: [
      "Caminho da Forma Astral",
      "Caminho da Mão Aberta",
      "Caminho da Misericórdia",
      "Caminho da Sombra",
      "Caminho dos Quatro Elementos",
      "Estilo da Alma Solar",
      "Estilo do Kensei",
      "Estilo do Mestre Bêbado",
    ],
  },
  {
    name: "Paladino",
    subClasses: [
      "Juramento da Conquista",
      "Juramento da Devoção",
      "Juramento da Glória",
      "Juramento da Redenção",
      "Juramento da Vigilância",
      "Juramento da Vingança",
      "Juramento dos Anciões",
    ],
  },
  {
    name: "Patrulheiro",
    subClasses: [
      "Andarilho do Horizonte",
      "Andarilho Feérico",
      "Caçador",
      "Exterminador de Monstros",
      "Mestre das Bestas",
      "Perseguidor Obscuro",
      "Portador do Enxame",
    ],
  },
];

export const DEFAULT_CREATURE_SPEED = "Médio";
export const DEFAULT_CREATURE_MOVEMENT = NONE;
export const CREATURE_SPEED_MOVEMENTS = [DEFAULT_CREATURE_MOVEMENT, "Baixo", DEFAULT_CREATURE_SPEED, "Alto", "Extremo"];
export const CREATURE_FLYING_MOVEMENTS = [DEFAULT_CREATURE_MOVEMENT, "Baixo", "Médio", "Alto", "Extremo"];
export const CREATURE_SWIMMING_MOVEMENTS = [DEFAULT_CREATURE_MOVEMENT, "Baixo", "Médio", "Alto", "Extremo"];
export const CREATURE_BURROWING_MOVEMENTS = [DEFAULT_CREATURE_MOVEMENT, "Baixo", "Médio", "Alto", "Extremo"];

export const DEFAULT_CREATURE_PRIMARY_ALIGNMENT = "Neutro";
export const CREATURE_PRIMARY_ALIGNMENT = ["Caótico", DEFAULT_CREATURE_PRIMARY_ALIGNMENT, "Leal"];
export const DEFAULT_CREATURE_SECONDARY_ALIGNMENT = "Neutro";
export const CREATURE_SECONDARY_ALIGNMENT = ["Mau", DEFAULT_CREATURE_SECONDARY_ALIGNMENT, "Bom"];
