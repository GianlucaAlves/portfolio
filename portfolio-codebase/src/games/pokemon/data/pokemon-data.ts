export type PokemonType =
  | 'Normal'
  | 'Fire'
  | 'Water'
  | 'Grass'
  | 'Electric'
  | 'Ice'
  | 'Fighting'
  | 'Poison'
  | 'Ground'
  | 'Flying'
  | 'Psychic'
  | 'Bug'
  | 'Rock'
  | 'Ghost'
  | 'Dragon';

export type MoveCategory = 'physical' | 'special' | 'status';
export type MoveEffect = 'paralyze' | 'burn' | 'sleep' | 'poison' | 'freeze' | 'stat_boost';

export interface Move {
  id: string;
  name: string;
  type: PokemonType;
  power: number;
  accuracy: number;
  pp: number;
  category: MoveCategory;
  effect?: MoveEffect;
  effectChance?: number;
}

export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  baseStats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    special: number;
  };
  moves: {
    level: number;
    moveId: string;
  }[];
  evolution?: {
    level: number;
    evolvesTo: number;
  };
  catchRate: number;
  baseXP: number;
  ascii: string;
}

export interface Trainer {
  id: string;
  name: string;
  party: { pokemonId: number; level: number }[];
  reward: { money: number; xp: number };
  dialogue: { before: string; after: string };
}

export interface GymLeader {
  id: string;
  name: string;
  city: string;
  badgeName: string;
  badgeEmoji: string;
  specialty: PokemonType;
  requiredBadges: number;
  party: { pokemonId: number; level: number; moves: string[] }[];
  reward: { money: number; xp: number };
  dialogue: { before: string; after: string };
}

export interface EliteFour {
  id: string;
  name: string;
  title: string;
  specialty: PokemonType;
  order: number;
  party: { pokemonId: number; level: number; moves: string[] }[];
  reward: { money: number; xp: number };
  dialogue: { before: string; after: string };
}

export interface Item {
  id: string;
  name: string;
  price: number;
  effect: 'heal' | 'pokeball' | 'revive' | 'status_cure';
  value: number;
}

export const TYPE_CHART: Record<PokemonType, Record<PokemonType, number>> = {
  "Normal": {
    "Normal": 1,
    "Fire": 1,
    "Water": 1,
    "Grass": 1,
    "Electric": 1,
    "Ice": 1,
    "Fighting": 1,
    "Poison": 1,
    "Ground": 1,
    "Flying": 1,
    "Psychic": 1,
    "Bug": 1,
    "Rock": 0.5,
    "Ghost": 0,
    "Dragon": 1
  },
  "Fire": {
    "Normal": 1,
    "Fire": 0.5,
    "Water": 0.5,
    "Grass": 2,
    "Electric": 1,
    "Ice": 2,
    "Fighting": 1,
    "Poison": 1,
    "Ground": 1,
    "Flying": 1,
    "Psychic": 1,
    "Bug": 2,
    "Rock": 0.5,
    "Ghost": 1,
    "Dragon": 0.5
  },
  "Water": {
    "Normal": 1,
    "Fire": 2,
    "Water": 0.5,
    "Grass": 0.5,
    "Electric": 1,
    "Ice": 1,
    "Fighting": 1,
    "Poison": 1,
    "Ground": 2,
    "Flying": 1,
    "Psychic": 1,
    "Bug": 1,
    "Rock": 2,
    "Ghost": 1,
    "Dragon": 0.5
  },
  "Grass": {
    "Normal": 1,
    "Fire": 0.5,
    "Water": 2,
    "Grass": 0.5,
    "Electric": 1,
    "Ice": 1,
    "Fighting": 1,
    "Poison": 0.5,
    "Ground": 2,
    "Flying": 0.5,
    "Psychic": 1,
    "Bug": 0.5,
    "Rock": 2,
    "Ghost": 1,
    "Dragon": 0.5
  },
  "Electric": {
    "Normal": 1,
    "Fire": 1,
    "Water": 2,
    "Grass": 0.5,
    "Electric": 0.5,
    "Ice": 1,
    "Fighting": 1,
    "Poison": 1,
    "Ground": 0,
    "Flying": 2,
    "Psychic": 1,
    "Bug": 1,
    "Rock": 1,
    "Ghost": 1,
    "Dragon": 0.5
  },
  "Ice": {
    "Normal": 1,
    "Fire": 0.5,
    "Water": 0.5,
    "Grass": 2,
    "Electric": 1,
    "Ice": 0.5,
    "Fighting": 1,
    "Poison": 1,
    "Ground": 2,
    "Flying": 2,
    "Psychic": 1,
    "Bug": 1,
    "Rock": 1,
    "Ghost": 1,
    "Dragon": 2
  },
  "Fighting": {
    "Normal": 2,
    "Fire": 1,
    "Water": 1,
    "Grass": 1,
    "Electric": 1,
    "Ice": 2,
    "Fighting": 1,
    "Poison": 0.5,
    "Ground": 1,
    "Flying": 0.5,
    "Psychic": 0.5,
    "Bug": 0.5,
    "Rock": 2,
    "Ghost": 0,
    "Dragon": 1
  },
  "Poison": {
    "Normal": 1,
    "Fire": 1,
    "Water": 1,
    "Grass": 2,
    "Electric": 1,
    "Ice": 1,
    "Fighting": 1,
    "Poison": 0.5,
    "Ground": 0.5,
    "Flying": 1,
    "Psychic": 1,
    "Bug": 2,
    "Rock": 0.5,
    "Ghost": 0.5,
    "Dragon": 1
  },
  "Ground": {
    "Normal": 1,
    "Fire": 2,
    "Water": 1,
    "Grass": 0.5,
    "Electric": 2,
    "Ice": 1,
    "Fighting": 1,
    "Poison": 2,
    "Ground": 1,
    "Flying": 0,
    "Psychic": 1,
    "Bug": 0.5,
    "Rock": 2,
    "Ghost": 1,
    "Dragon": 1
  },
  "Flying": {
    "Normal": 1,
    "Fire": 1,
    "Water": 1,
    "Grass": 2,
    "Electric": 0.5,
    "Ice": 1,
    "Fighting": 2,
    "Poison": 1,
    "Ground": 1,
    "Flying": 1,
    "Psychic": 1,
    "Bug": 2,
    "Rock": 0.5,
    "Ghost": 1,
    "Dragon": 1
  },
  "Psychic": {
    "Normal": 1,
    "Fire": 1,
    "Water": 1,
    "Grass": 1,
    "Electric": 1,
    "Ice": 1,
    "Fighting": 2,
    "Poison": 2,
    "Ground": 1,
    "Flying": 1,
    "Psychic": 0.5,
    "Bug": 1,
    "Rock": 1,
    "Ghost": 0,
    "Dragon": 1
  },
  "Bug": {
    "Normal": 1,
    "Fire": 0.5,
    "Water": 1,
    "Grass": 2,
    "Electric": 1,
    "Ice": 1,
    "Fighting": 0.5,
    "Poison": 2,
    "Ground": 1,
    "Flying": 0.5,
    "Psychic": 2,
    "Bug": 1,
    "Rock": 1,
    "Ghost": 0.5,
    "Dragon": 1
  },
  "Rock": {
    "Normal": 1,
    "Fire": 2,
    "Water": 1,
    "Grass": 1,
    "Electric": 1,
    "Ice": 2,
    "Fighting": 0.5,
    "Poison": 1,
    "Ground": 0.5,
    "Flying": 2,
    "Psychic": 1,
    "Bug": 2,
    "Rock": 1,
    "Ghost": 1,
    "Dragon": 1
  },
  "Ghost": {
    "Normal": 0,
    "Fire": 1,
    "Water": 1,
    "Grass": 1,
    "Electric": 1,
    "Ice": 1,
    "Fighting": 1,
    "Poison": 1,
    "Ground": 1,
    "Flying": 1,
    "Psychic": 0,
    "Bug": 1,
    "Rock": 1,
    "Ghost": 2,
    "Dragon": 1
  },
  "Dragon": {
    "Normal": 1,
    "Fire": 1,
    "Water": 1,
    "Grass": 1,
    "Electric": 1,
    "Ice": 1,
    "Fighting": 1,
    "Poison": 1,
    "Ground": 1,
    "Flying": 1,
    "Psychic": 1,
    "Bug": 1,
    "Rock": 1,
    "Ghost": 1,
    "Dragon": 2
  }
} as const;

export const MOVES_DATA: Record<string, Move> = {
  "tackle": {
    "id": "tackle",
    "name": "Tackle",
    "type": "Normal",
    "power": 40,
    "accuracy": 100,
    "pp": 35,
    "category": "physical"
  },
  "scratch": {
    "id": "scratch",
    "name": "Scratch",
    "type": "Normal",
    "power": 40,
    "accuracy": 100,
    "pp": 35,
    "category": "physical"
  },
  "ember": {
    "id": "ember",
    "name": "Ember",
    "type": "Fire",
    "power": 40,
    "accuracy": 100,
    "pp": 25,
    "category": "special",
    "effect": "burn",
    "effectChance": 10
  },
  "water-gun": {
    "id": "water-gun",
    "name": "Water Gun",
    "type": "Water",
    "power": 40,
    "accuracy": 100,
    "pp": 25,
    "category": "special"
  },
  "vine-whip": {
    "id": "vine-whip",
    "name": "Vine Whip",
    "type": "Grass",
    "power": 45,
    "accuracy": 100,
    "pp": 25,
    "category": "special"
  },
  "thunderbolt": {
    "id": "thunderbolt",
    "name": "Thunderbolt",
    "type": "Electric",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "category": "special",
    "effect": "paralyze",
    "effectChance": 10
  },
  "thunder": {
    "id": "thunder",
    "name": "Thunder",
    "type": "Electric",
    "power": 110,
    "accuracy": 70,
    "pp": 10,
    "category": "special",
    "effect": "paralyze",
    "effectChance": 30
  },
  "flamethrower": {
    "id": "flamethrower",
    "name": "Flamethrower",
    "type": "Fire",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "category": "special",
    "effect": "burn",
    "effectChance": 10
  },
  "fire-blast": {
    "id": "fire-blast",
    "name": "Fire Blast",
    "type": "Fire",
    "power": 110,
    "accuracy": 85,
    "pp": 5,
    "category": "special",
    "effect": "burn",
    "effectChance": 10
  },
  "surf": {
    "id": "surf",
    "name": "Surf",
    "type": "Water",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "category": "special"
  },
  "blizzard": {
    "id": "blizzard",
    "name": "Blizzard",
    "type": "Ice",
    "power": 110,
    "accuracy": 70,
    "pp": 5,
    "category": "special",
    "effect": "freeze",
    "effectChance": 10
  },
  "ice-beam": {
    "id": "ice-beam",
    "name": "Ice Beam",
    "type": "Ice",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "category": "special",
    "effect": "freeze",
    "effectChance": 10
  },
  "psychic": {
    "id": "psychic",
    "name": "Psychic",
    "type": "Psychic",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "category": "special",
    "effect": "stat_boost",
    "effectChance": 10
  },
  "hyper-beam": {
    "id": "hyper-beam",
    "name": "Hyper Beam",
    "type": "Normal",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "category": "physical"
  },
  "solar-beam": {
    "id": "solar-beam",
    "name": "Solar Beam",
    "type": "Grass",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "category": "special"
  },
  "earthquake": {
    "id": "earthquake",
    "name": "Earthquake",
    "type": "Ground",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "category": "physical"
  },
  "body-slam": {
    "id": "body-slam",
    "name": "Body Slam",
    "type": "Normal",
    "power": 85,
    "accuracy": 100,
    "pp": 15,
    "category": "physical",
    "effect": "paralyze",
    "effectChance": 30
  },
  "double-edge": {
    "id": "double-edge",
    "name": "Double-Edge",
    "type": "Normal",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "category": "physical"
  },
  "quick-attack": {
    "id": "quick-attack",
    "name": "Quick Attack",
    "type": "Normal",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "category": "physical"
  },
  "slash": {
    "id": "slash",
    "name": "Slash",
    "type": "Normal",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "category": "physical"
  },
  "growl": {
    "id": "growl",
    "name": "Growl",
    "type": "Normal",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "category": "status",
    "effect": "stat_boost"
  },
  "tail-whip": {
    "id": "tail-whip",
    "name": "Tail Whip",
    "type": "Normal",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "category": "status",
    "effect": "stat_boost"
  },
  "leer": {
    "id": "leer",
    "name": "Leer",
    "type": "Normal",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "category": "status",
    "effect": "stat_boost",
    "effectChance": 100
  },
  "smokescreen": {
    "id": "smokescreen",
    "name": "Smokescreen",
    "type": "Normal",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "category": "status",
    "effect": "stat_boost"
  },
  "sand-attack": {
    "id": "sand-attack",
    "name": "Sand Attack",
    "type": "Ground",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "category": "status",
    "effect": "stat_boost"
  },
  "thunder-wave": {
    "id": "thunder-wave",
    "name": "Thunder Wave",
    "type": "Electric",
    "power": 0,
    "accuracy": 90,
    "pp": 20,
    "category": "status",
    "effect": "paralyze"
  },
  "toxic": {
    "id": "toxic",
    "name": "Toxic",
    "type": "Poison",
    "power": 0,
    "accuracy": 90,
    "pp": 10,
    "category": "status",
    "effect": "poison"
  },
  "agility": {
    "id": "agility",
    "name": "Agility",
    "type": "Psychic",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "category": "status",
    "effect": "stat_boost"
  },
  "harden": {
    "id": "harden",
    "name": "Harden",
    "type": "Normal",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "category": "status",
    "effect": "stat_boost"
  },
  "defense-curl": {
    "id": "defense-curl",
    "name": "Defense Curl",
    "type": "Normal",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "category": "status",
    "effect": "stat_boost"
  },
  "withdraw": {
    "id": "withdraw",
    "name": "Withdraw",
    "type": "Water",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "category": "status",
    "effect": "stat_boost"
  },
  "meditate": {
    "id": "meditate",
    "name": "Meditate",
    "type": "Psychic",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "category": "status",
    "effect": "stat_boost"
  },
  "focus-energy": {
    "id": "focus-energy",
    "name": "Focus Energy",
    "type": "Normal",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "category": "status"
  },
  "bite": {
    "id": "bite",
    "name": "Bite",
    "type": "Normal",
    "power": 60,
    "accuracy": 100,
    "pp": 25,
    "category": "physical"
  },
  "headbutt": {
    "id": "headbutt",
    "name": "Headbutt",
    "type": "Normal",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "category": "physical"
  },
  "wing-attack": {
    "id": "wing-attack",
    "name": "Wing Attack",
    "type": "Flying",
    "power": 60,
    "accuracy": 100,
    "pp": 35,
    "category": "physical"
  },
  "gust": {
    "id": "gust",
    "name": "Gust",
    "type": "Flying",
    "power": 40,
    "accuracy": 100,
    "pp": 35,
    "category": "physical"
  },
  "swift": {
    "id": "swift",
    "name": "Swift",
    "type": "Normal",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "category": "physical"
  },
  "wrap": {
    "id": "wrap",
    "name": "Wrap",
    "type": "Normal",
    "power": 15,
    "accuracy": 90,
    "pp": 20,
    "category": "physical"
  },
  "pound": {
    "id": "pound",
    "name": "Pound",
    "type": "Normal",
    "power": 40,
    "accuracy": 100,
    "pp": 35,
    "category": "physical"
  },
  "karate-chop": {
    "id": "karate-chop",
    "name": "Karate Chop",
    "type": "Fighting",
    "power": 50,
    "accuracy": 100,
    "pp": 25,
    "category": "physical"
  },
  "razor-leaf": {
    "id": "razor-leaf",
    "name": "Razor Leaf",
    "type": "Grass",
    "power": 55,
    "accuracy": 95,
    "pp": 25,
    "category": "special"
  },
  "string-shot": {
    "id": "string-shot",
    "name": "String Shot",
    "type": "Bug",
    "power": 0,
    "accuracy": 95,
    "pp": 40,
    "category": "status",
    "effect": "stat_boost"
  },
  "poison-sting": {
    "id": "poison-sting",
    "name": "Poison Sting",
    "type": "Poison",
    "power": 15,
    "accuracy": 100,
    "pp": 35,
    "category": "physical",
    "effect": "poison",
    "effectChance": 30
  },
  "leech-seed": {
    "id": "leech-seed",
    "name": "Leech Seed",
    "type": "Grass",
    "power": 0,
    "accuracy": 90,
    "pp": 10,
    "category": "status"
  },
  "night-shade": {
    "id": "night-shade",
    "name": "Night Shade",
    "type": "Ghost",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "category": "physical"
  },
  "mean-look": {
    "id": "mean-look",
    "name": "Mean Look",
    "type": "Normal",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "category": "status"
  },
  "hypnosis": {
    "id": "hypnosis",
    "name": "Hypnosis",
    "type": "Psychic",
    "power": 0,
    "accuracy": 60,
    "pp": 20,
    "category": "status",
    "effect": "sleep"
  },
  "dream-eater": {
    "id": "dream-eater",
    "name": "Dream Eater",
    "type": "Psychic",
    "power": 100,
    "accuracy": 100,
    "pp": 15,
    "category": "special"
  },
  "confuse-ray": {
    "id": "confuse-ray",
    "name": "Confuse Ray",
    "type": "Ghost",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "category": "status"
  },
  "screech": {
    "id": "screech",
    "name": "Screech",
    "type": "Normal",
    "power": 0,
    "accuracy": 85,
    "pp": 40,
    "category": "status",
    "effect": "stat_boost"
  },
  "acid": {
    "id": "acid",
    "name": "Acid",
    "type": "Poison",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "category": "physical",
    "effect": "stat_boost",
    "effectChance": 10
  },
  "sludge": {
    "id": "sludge",
    "name": "Sludge",
    "type": "Poison",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "category": "physical",
    "effect": "poison",
    "effectChance": 30
  },
  "smog": {
    "id": "smog",
    "name": "Smog",
    "type": "Poison",
    "power": 30,
    "accuracy": 70,
    "pp": 20,
    "category": "physical",
    "effect": "poison",
    "effectChance": 40
  },
  "bubble": {
    "id": "bubble",
    "name": "Bubble",
    "type": "Water",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "category": "special",
    "effect": "stat_boost",
    "effectChance": 10
  },
  "bubble-beam": {
    "id": "bubble-beam",
    "name": "BubbleBeam",
    "type": "Water",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "category": "special",
    "effect": "stat_boost",
    "effectChance": 10
  },
    "clamp": {
      "id": "clamp",
      "name": "Clamp",
      "type": "Water",
      "power": 35,
      "accuracy": 85,
      "pp": 15,
      "category": "special"
    },
    "bide": {
      "id": "bide",
      "name": "Bide",
      "type": "Normal",
      "power": 0,
      "accuracy": 100,
      "pp": 10,
      "category": "status"
    },
    "sonicboom": {
      "id": "sonicboom",
      "name": "SonicBoom",
      "type": "Normal",
      "power": 1,
      "accuracy": 90,
      "pp": 20,
      "category": "special"
    },
    "thundershock": {
      "id": "thundershock",
      "name": "Thundershock",
      "type": "Electric",
      "power": 40,
      "accuracy": 100,
      "pp": 30,
      "category": "special",
      "effect": "paralyze",
      "effectChance": 10
    },
    "poisonpowder": {
      "id": "poisonpowder",
      "name": "Poisonpowder",
      "type": "Poison",
      "power": 0,
      "accuracy": 75,
      "pp": 35,
      "category": "status",
      "effect": "poison"
    },
    "sleep-powder": {
      "id": "sleep-powder",
      "name": "Sleep Powder",
      "type": "Grass",
      "power": 0,
      "accuracy": 75,
      "pp": 15,
      "category": "status",
      "effect": "sleep"
    },
    "bind": {
      "id": "bind",
      "name": "Bind",
      "type": "Normal",
      "power": 15,
      "accuracy": 85,
      "pp": 20,
      "category": "physical"
    },
    "constrict": {
      "id": "constrict",
      "name": "Constrict",
      "type": "Normal",
      "power": 10,
      "accuracy": 100,
      "pp": 35,
      "category": "physical",
      "effect": "stat_boost",
      "effectChance": 10
    },
    "mega-drain": {
      "id": "mega-drain",
      "name": "Mega Drain",
      "type": "Grass",
      "power": 40,
      "accuracy": 100,
      "pp": 10,
      "category": "special"
    },
    "petal-dance": {
      "id": "petal-dance",
      "name": "Petal Dance",
      "type": "Grass",
      "power": 70,
      "accuracy": 100,
      "pp": 20,
      "category": "special"
    },
    "poison-gas": {
      "id": "poison-gas",
      "name": "Poison Gas",
      "type": "Poison",
      "power": 0,
      "accuracy": 55,
      "pp": 40,
      "category": "status",
      "effect": "poison"
    },
    "minimize": {
      "id": "minimize",
      "name": "Minimize",
      "type": "Normal",
      "power": 0,
      "accuracy": 100,
      "pp": 20,
      "category": "status",
      "effect": "stat_boost"
    },
    "selfdestruct": {
      "id": "selfdestruct",
      "name": "Selfdestruct",
      "type": "Normal",
      "power": 130,
      "accuracy": 100,
      "pp": 5,
      "category": "physical"
    },
    "confusion": {
      "id": "confusion",
      "name": "Confusion",
      "type": "Psychic",
      "power": 50,
      "accuracy": 100,
      "pp": 25,
      "category": "special"
    },
    "barrier": {
      "id": "barrier",
      "name": "Barrier",
      "type": "Psychic",
      "power": 0,
      "accuracy": 100,
      "pp": 30,
      "category": "status",
      "effect": "stat_boost"
    },
    "light-screen": {
      "id": "light-screen",
      "name": "Light Screen",
      "type": "Psychic",
      "power": 0,
      "accuracy": 100,
      "pp": 30,
      "category": "status",
      "effect": "stat_boost"
    },
    "doubleslap": {
      "id": "doubleslap",
      "name": "Doubleslap",
      "type": "Normal",
      "power": 30,
      "accuracy": 85,
      "pp": 10,
      "category": "physical"
    },
    "stun-spore": {
      "id": "stun-spore",
      "name": "Stun Spore",
      "type": "Grass",
      "power": 0,
      "accuracy": 75,
      "pp": 30,
      "category": "status",
      "effect": "paralyze"
    },
    "psybeam": {
      "id": "psybeam",
      "name": "Psybeam",
      "type": "Psychic",
      "power": 65,
      "accuracy": 100,
      "pp": 20,
      "category": "special"
    },
    "psywave": {
      "id": "psywave",
      "name": "Psywave",
      "type": "Psychic",
      "power": 1,
      "accuracy": 100,
      "pp": 15,
      "category": "special"
    },
    "reflect": {
      "id": "reflect",
      "name": "Reflect",
      "type": "Psychic",
      "power": 0,
      "accuracy": 100,
      "pp": 20,
      "category": "status",
      "effect": "stat_boost"
    },
    "take-down": {
      "id": "take-down",
      "name": "Take Down",
      "type": "Normal",
      "power": 90,
      "accuracy": 85,
      "pp": 20,
      "category": "physical"
    },
    "fire-spin": {
      "id": "fire-spin",
      "name": "Fire Spin",
      "type": "Fire",
      "power": 15,
      "accuracy": 70,
      "pp": 15,
      "category": "special"
    },
    "roar": {
      "id": "roar",
      "name": "Roar",
      "type": "Normal",
      "power": 0,
      "accuracy": 100,
      "pp": 20,
      "category": "status"
    },
    "stomp": {
      "id": "stomp",
      "name": "Stomp",
      "type": "Normal",
      "power": 65,
      "accuracy": 100,
      "pp": 20,
      "category": "physical"
    },
    "fury-attack": {
      "id": "fury-attack",
      "name": "Fury Attack",
      "type": "Normal",
      "power": 15,
      "accuracy": 85,
      "pp": 20,
      "category": "physical"
    },
    "horn-attack": {
      "id": "horn-attack",
      "name": "Horn Attack",
      "type": "Normal",
      "power": 65,
      "accuracy": 100,
      "pp": 25,
      "category": "physical"
    },
    "thrash": {
      "id": "thrash",
      "name": "Thrash",
      "type": "Normal",
      "power": 90,
      "accuracy": 100,
      "pp": 20,
      "category": "physical"
    },
    "fissure": {
      "id": "fissure",
      "name": "Fissure",
      "type": "Ground",
      "power": 1,
      "accuracy": 30,
      "pp": 5,
      "category": "physical"
    },
    "horn-drill": {
      "id": "horn-drill",
      "name": "Horn Drill",
      "type": "Normal",
      "power": 1,
      "accuracy": 30,
      "pp": 5,
      "category": "physical"
    },
    "recover": {
      "id": "recover",
      "name": "Recover",
      "type": "Normal",
      "power": 0,
      "accuracy": 100,
      "pp": 20,
      "category": "status"
    },
    "rest": {
      "id": "rest",
      "name": "Rest",
      "type": "Psychic",
      "power": 0,
      "accuracy": 100,
      "pp": 10,
      "category": "status"
    },
    "aurora-beam": {
      "id": "aurora-beam",
      "name": "Aurora Beam",
      "type": "Ice",
      "power": 65,
      "accuracy": 100,
      "pp": 20,
      "category": "special",
      "effect": "stat_boost",
      "effectChance": 10
    },
    "supersonic": {
      "id": "supersonic",
      "name": "Supersonic",
      "type": "Normal",
      "power": 0,
      "accuracy": 55,
      "pp": 20,
      "category": "status"
    },
    "lovely-kiss": {
      "id": "lovely-kiss",
      "name": "Lovely Kiss",
      "type": "Normal",
      "power": 0,
      "accuracy": 75,
      "pp": 10,
      "category": "status",
      "effect": "sleep"
    },
    "ice-punch": {
      "id": "ice-punch",
      "name": "Ice Punch",
      "type": "Ice",
      "power": 75,
      "accuracy": 100,
      "pp": 15,
      "category": "special",
      "effect": "freeze",
      "effectChance": 10
    },
    "hydro-pump": {
      "id": "hydro-pump",
      "name": "Hydro Pump",
      "type": "Water",
      "power": 110,
      "accuracy": 80,
      "pp": 5,
      "category": "special"
    },
    "rock-throw": {
      "id": "rock-throw",
      "name": "Rock Throw",
      "type": "Rock",
      "power": 50,
      "accuracy": 90,
      "pp": 15,
      "category": "physical"
    },
    "rage": {
      "id": "rage",
      "name": "Rage",
      "type": "Normal",
      "power": 20,
      "accuracy": 100,
      "pp": 20,
      "category": "physical"
    },
    "thunder-punch": {
      "id": "thunder-punch",
      "name": "ThunderPunch",
      "type": "Electric",
      "power": 75,
      "accuracy": 100,
      "pp": 15,
      "category": "special",
      "effect": "paralyze",
      "effectChance": 10
    },
    "fire-punch": {
      "id": "fire-punch",
      "name": "Fire Punch",
      "type": "Fire",
      "power": 75,
      "accuracy": 100,
      "pp": 15,
      "category": "special",
      "effect": "burn",
      "effectChance": 10
    },
    "mega-punch": {
      "id": "mega-punch",
      "name": "Mega Punch",
      "type": "Normal",
      "power": 80,
      "accuracy": 85,
      "pp": 20,
      "category": "physical"
    },
    "double-kick": {
      "id": "double-kick",
      "name": "Double Kick",
      "type": "Fighting",
      "power": 30,
      "accuracy": 100,
      "pp": 30,
      "category": "physical"
    },
    "jump-kick": {
      "id": "jump-kick",
      "name": "Jump Kick",
      "type": "Fighting",
      "power": 100,
      "accuracy": 95,
      "pp": 10,
      "category": "physical"
    },
    "rolling-kick": {
      "id": "rolling-kick",
      "name": "Rolling Kick",
      "type": "Fighting",
      "power": 60,
      "accuracy": 85,
      "pp": 15,
      "category": "physical"
    },
    "rock-slide": {
      "id": "rock-slide",
      "name": "Rock Slide",
      "type": "Rock",
      "power": 75,
      "accuracy": 90,
      "pp": 10,
      "category": "physical"
    },
    "submission": {
      "id": "submission",
      "name": "Submission",
      "type": "Fighting",
      "power": 80,
      "accuracy": 80,
      "pp": 20,
      "category": "physical"
    },
    "glare": {
      "id": "glare",
      "name": "Glare",
      "type": "Normal",
      "power": 0,
      "accuracy": 75,
      "pp": 30,
      "category": "status",
      "effect": "paralyze"
    },
    "dragon-rage": {
      "id": "dragon-rage",
      "name": "Dragon Rage",
      "type": "Dragon",
      "power": 1,
      "accuracy": 100,
      "pp": 10,
      "category": "special"
    },
    "mirror-move": {
      "id": "mirror-move",
      "name": "Mirror Move",
      "type": "Flying",
      "power": 0,
      "accuracy": 100,
      "pp": 20,
      "category": "status"
    },
    "whirlwind": {
      "id": "whirlwind",
      "name": "Whirlwind",
      "type": "Normal",
      "power": 0,
      "accuracy": 100,
      "pp": 20,
      "category": "status"
    },
    "disable": {
      "id": "disable",
      "name": "Disable",
      "type": "Normal",
      "power": 0,
      "accuracy": 55,
      "pp": 20,
      "category": "status"
    },
    "leech-life": {
      "id": "leech-life",
      "name": "Leech Life",
      "type": "Bug",
      "power": 20,
      "accuracy": 100,
      "pp": 15,
      "category": "physical"
    },
    "dig": {
      "id": "dig",
      "name": "Dig",
    "type": "Ground",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "category": "physical"
  },
  "fly": {
    "id": "fly",
    "name": "Fly",
    "type": "Flying",
    "power": 90,
    "accuracy": 95,
    "pp": 15,
    "category": "physical"
  }
} as const;

export const POKEMON_DATA: Pokemon[] = [
  {
    "id": 1,
    "name": "Bulbasaur",
    "types": [
      "Grass",
      "Poison"
    ],
    "baseStats": {
      "hp": 45,
      "attack": 49,
      "defense": 49,
      "speed": 45,
      "special": 65
    },
    "moves": [
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 7,
        "moveId": "leech-seed"
      },
      {
        "level": 13,
        "moveId": "vine-whip"
      },
      {
        "level": 27,
        "moveId": "razor-leaf"
      },
      {
        "level": 45,
        "moveId": "poison-sting"
      },
      {
        "level": 48,
        "moveId": "solar-beam"
      },
      {
        "level": 52,
        "moveId": "acid"
      }
    ],
    "evolution": {
      "level": 16,
      "evolvesTo": 2
    },
    "catchRate": 45,
    "baseXP": 64,
    "ascii": "B"
  },
  {
    "id": 2,
    "name": "Ivysaur",
    "types": [
      "Grass",
      "Poison"
    ],
    "baseStats": {
      "hp": 60,
      "attack": 62,
      "defense": 63,
      "speed": 60,
      "special": 80
    },
    "moves": [
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 1,
        "moveId": "leech-seed"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 13,
        "moveId": "vine-whip"
      },
      {
        "level": 30,
        "moveId": "razor-leaf"
      },
      {
        "level": 45,
        "moveId": "poison-sting"
      },
      {
        "level": 52,
        "moveId": "acid"
      },
      {
        "level": 54,
        "moveId": "solar-beam"
      }
    ],
    "evolution": {
      "level": 32,
      "evolvesTo": 3
    },
    "catchRate": 45,
    "baseXP": 142,
    "ascii": "I"
  },
  {
    "id": 3,
    "name": "Venusaur",
    "types": [
      "Grass",
      "Poison"
    ],
    "baseStats": {
      "hp": 80,
      "attack": 82,
      "defense": 83,
      "speed": 80,
      "special": 100
    },
    "moves": [
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 1,
        "moveId": "leech-seed"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 1,
        "moveId": "vine-whip"
      },
      {
        "level": 30,
        "moveId": "razor-leaf"
      },
      {
        "level": 45,
        "moveId": "poison-sting"
      },
      {
        "level": 52,
        "moveId": "acid"
      },
      {
        "level": 65,
        "moveId": "solar-beam"
      }
    ],
    "catchRate": 45,
    "baseXP": 236,
    "ascii": "V"
  },
  {
    "id": 4,
    "name": "Charmander",
    "types": [
      "Fire"
    ],
    "baseStats": {
      "hp": 39,
      "attack": 52,
      "defense": 43,
      "speed": 65,
      "special": 60
    },
    "moves": [
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 9,
        "moveId": "ember"
      },
      {
        "level": 15,
        "moveId": "leer"
      },
      {
        "level": 30,
        "moveId": "slash"
      },
      {
        "level": 38,
        "moveId": "flamethrower"
      },
      {
        "level": 45,
        "moveId": "smokescreen"
      },
      {
        "level": 52,
        "moveId": "fire-blast"
      }
    ],
    "evolution": {
      "level": 16,
      "evolvesTo": 5
    },
    "catchRate": 45,
    "baseXP": 62,
    "ascii": "C"
  },
  {
    "id": 5,
    "name": "Charmeleon",
    "types": [
      "Fire"
    ],
    "baseStats": {
      "hp": 58,
      "attack": 64,
      "defense": 58,
      "speed": 80,
      "special": 80
    },
    "moves": [
      {
        "level": 1,
        "moveId": "ember"
      },
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 15,
        "moveId": "leer"
      },
      {
        "level": 33,
        "moveId": "slash"
      },
      {
        "level": 42,
        "moveId": "flamethrower"
      },
      {
        "level": 45,
        "moveId": "smokescreen"
      },
      {
        "level": 52,
        "moveId": "fire-blast"
      }
    ],
    "evolution": {
      "level": 36,
      "evolvesTo": 6
    },
    "catchRate": 45,
    "baseXP": 142,
    "ascii": "C"
  },
  {
    "id": 6,
    "name": "Charizard",
    "types": [
      "Fire",
      "Flying"
    ],
    "baseStats": {
      "hp": 78,
      "attack": 84,
      "defense": 78,
      "speed": 100,
      "special": 109
    },
    "moves": [
      {
        "level": 1,
        "moveId": "ember"
      },
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 36,
        "moveId": "slash"
      },
      {
        "level": 45,
        "moveId": "smokescreen"
      },
      {
        "level": 46,
        "moveId": "flamethrower"
      },
      {
        "level": 52,
        "moveId": "fire-blast"
      }
    ],
    "catchRate": 45,
    "baseXP": 240,
    "ascii": "C"
  },
  {
    "id": 7,
    "name": "Squirtle",
    "types": [
      "Water"
    ],
    "baseStats": {
      "hp": 44,
      "attack": 48,
      "defense": 65,
      "speed": 43,
      "special": 50
    },
    "moves": [
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 8,
        "moveId": "bubble"
      },
      {
        "level": 15,
        "moveId": "water-gun"
      },
      {
        "level": 22,
        "moveId": "bite"
      },
      {
        "level": 28,
        "moveId": "withdraw"
      },
      {
        "level": 45,
        "moveId": "bubble-beam"
      },
      {
        "level": 52,
        "moveId": "surf"
      }
    ],
    "evolution": {
      "level": 16,
      "evolvesTo": 8
    },
    "catchRate": 45,
    "baseXP": 63,
    "ascii": "S"
  },
  {
    "id": 8,
    "name": "Wartortle",
    "types": [
      "Water"
    ],
    "baseStats": {
      "hp": 59,
      "attack": 63,
      "defense": 80,
      "speed": 58,
      "special": 65
    },
    "moves": [
      {
        "level": 1,
        "moveId": "bubble"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 15,
        "moveId": "water-gun"
      },
      {
        "level": 24,
        "moveId": "bite"
      },
      {
        "level": 31,
        "moveId": "withdraw"
      },
      {
        "level": 45,
        "moveId": "bubble-beam"
      },
      {
        "level": 52,
        "moveId": "surf"
      }
    ],
    "evolution": {
      "level": 36,
      "evolvesTo": 9
    },
    "catchRate": 45,
    "baseXP": 142,
    "ascii": "W"
  },
  {
    "id": 9,
    "name": "Blastoise",
    "types": [
      "Water"
    ],
    "baseStats": {
      "hp": 79,
      "attack": 83,
      "defense": 100,
      "speed": 78,
      "special": 85
    },
    "moves": [
      {
        "level": 1,
        "moveId": "bubble"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 1,
        "moveId": "water-gun"
      },
      {
        "level": 24,
        "moveId": "bite"
      },
      {
        "level": 31,
        "moveId": "withdraw"
      },
      {
        "level": 45,
        "moveId": "bubble-beam"
      },
      {
        "level": 52,
        "moveId": "surf"
      }
    ],
    "catchRate": 45,
    "baseXP": 239,
    "ascii": "B"
  },
  {
    "id": 10,
    "name": "Caterpie",
    "types": [
      "Bug"
    ],
    "baseStats": {
      "hp": 45,
      "attack": 30,
      "defense": 35,
      "speed": 45,
      "special": 20
    },
    "moves": [
      {
        "level": 1,
        "moveId": "string-shot"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 15,
        "moveId": "poison-sting"
      },
      {
        "level": 22,
        "moveId": "leech-seed"
      },
      {
        "level": 30,
        "moveId": "headbutt"
      },
      {
        "level": 38,
        "moveId": "swift"
      },
      {
        "level": 45,
        "moveId": "body-slam"
      }
    ],
    "evolution": {
      "level": 7,
      "evolvesTo": 11
    },
    "catchRate": 255,
    "baseXP": 39,
    "ascii": "C"
  },
  {
    "id": 11,
    "name": "Metapod",
    "types": [
      "Bug"
    ],
    "baseStats": {
      "hp": 50,
      "attack": 20,
      "defense": 55,
      "speed": 30,
      "special": 25
    },
    "moves": [
      {
        "level": 1,
        "moveId": "harden"
      },
      {
        "level": 8,
        "moveId": "string-shot"
      },
      {
        "level": 15,
        "moveId": "poison-sting"
      },
      {
        "level": 22,
        "moveId": "leech-seed"
      },
      {
        "level": 30,
        "moveId": "headbutt"
      },
      {
        "level": 38,
        "moveId": "tackle"
      },
      {
        "level": 45,
        "moveId": "swift"
      },
      {
        "level": 52,
        "moveId": "body-slam"
      }
    ],
    "evolution": {
      "level": 10,
      "evolvesTo": 12
    },
    "catchRate": 120,
    "baseXP": 72,
    "ascii": "M"
  },
  {
    "id": 12,
    "name": "Butterfree",
    "types": [
      "Bug",
      "Flying"
    ],
    "baseStats": {
      "hp": 60,
      "attack": 45,
      "defense": 50,
      "speed": 70,
      "special": 90
    },
    "moves": [
      {
        "level": 8,
        "moveId": "string-shot"
      },
      {
        "level": 15,
        "moveId": "poison-sting"
      },
      {
        "level": 22,
        "moveId": "leech-seed"
      },
      {
        "level": 28,
        "moveId": "gust"
      },
      {
        "level": 30,
        "moveId": "headbutt"
      },
      {
        "level": 38,
        "moveId": "wing-attack"
      },
      {
        "level": 45,
        "moveId": "quick-attack"
      },
      {
        "level": 52,
        "moveId": "fly"
      }
    ],
    "catchRate": 45,
    "baseXP": 178,
    "ascii": "B"
  },
  {
    "id": 13,
    "name": "Weedle",
    "types": [
      "Bug",
      "Poison"
    ],
    "baseStats": {
      "hp": 40,
      "attack": 35,
      "defense": 30,
      "speed": 50,
      "special": 20
    },
    "moves": [
      {
        "level": 1,
        "moveId": "poison-sting"
      },
      {
        "level": 1,
        "moveId": "string-shot"
      },
      {
        "level": 15,
        "moveId": "leech-seed"
      },
      {
        "level": 22,
        "moveId": "headbutt"
      },
      {
        "level": 30,
        "moveId": "acid"
      },
      {
        "level": 38,
        "moveId": "sludge"
      },
      {
        "level": 45,
        "moveId": "toxic"
      },
      {
        "level": 52,
        "moveId": "tackle"
      }
    ],
    "evolution": {
      "level": 7,
      "evolvesTo": 14
    },
    "catchRate": 255,
    "baseXP": 39,
    "ascii": "W"
  },
  {
    "id": 14,
    "name": "Kakuna",
    "types": [
      "Bug",
      "Poison"
    ],
    "baseStats": {
      "hp": 45,
      "attack": 25,
      "defense": 50,
      "speed": 35,
      "special": 25
    },
    "moves": [
      {
        "level": 1,
        "moveId": "harden"
      },
      {
        "level": 8,
        "moveId": "string-shot"
      },
      {
        "level": 15,
        "moveId": "poison-sting"
      },
      {
        "level": 22,
        "moveId": "leech-seed"
      },
      {
        "level": 30,
        "moveId": "headbutt"
      },
      {
        "level": 38,
        "moveId": "acid"
      },
      {
        "level": 45,
        "moveId": "sludge"
      },
      {
        "level": 52,
        "moveId": "toxic"
      }
    ],
    "evolution": {
      "level": 10,
      "evolvesTo": 15
    },
    "catchRate": 120,
    "baseXP": 72,
    "ascii": "K"
  },
  {
    "id": 15,
    "name": "Beedrill",
    "types": [
      "Bug",
      "Poison"
    ],
    "baseStats": {
      "hp": 65,
      "attack": 90,
      "defense": 40,
      "speed": 75,
      "special": 45
    },
    "moves": [
      {
        "level": 15,
        "moveId": "string-shot"
      },
      {
        "level": 16,
        "moveId": "focus-energy"
      },
      {
        "level": 22,
        "moveId": "poison-sting"
      },
      {
        "level": 30,
        "moveId": "leech-seed"
      },
      {
        "level": 35,
        "moveId": "agility"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 45,
        "moveId": "acid"
      },
      {
        "level": 52,
        "moveId": "sludge"
      }
    ],
    "catchRate": 45,
    "baseXP": 178,
    "ascii": "B"
  },
  {
    "id": 16,
    "name": "Pidgey",
    "types": [
      "Normal",
      "Flying"
    ],
    "baseStats": {
      "hp": 40,
      "attack": 45,
      "defense": 40,
      "speed": 56,
      "special": 35
    },
    "moves": [
      {
        "level": 1,
        "moveId": "gust"
      },
      {
        "level": 5,
        "moveId": "sand-attack"
      },
      {
        "level": 12,
        "moveId": "quick-attack"
      },
      {
        "level": 28,
        "moveId": "wing-attack"
      },
      {
        "level": 36,
        "moveId": "agility"
      },
      {
        "level": 38,
        "moveId": "tackle"
      },
      {
        "level": 45,
        "moveId": "swift"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "evolution": {
      "level": 18,
      "evolvesTo": 17
    },
    "catchRate": 255,
    "baseXP": 50,
    "ascii": "P"
  },
  {
    "id": 17,
    "name": "Pidgeotto",
    "types": [
      "Normal",
      "Flying"
    ],
    "baseStats": {
      "hp": 63,
      "attack": 60,
      "defense": 55,
      "speed": 71,
      "special": 50
    },
    "moves": [
      {
        "level": 1,
        "moveId": "gust"
      },
      {
        "level": 1,
        "moveId": "sand-attack"
      },
      {
        "level": 12,
        "moveId": "quick-attack"
      },
      {
        "level": 31,
        "moveId": "wing-attack"
      },
      {
        "level": 38,
        "moveId": "tackle"
      },
      {
        "level": 40,
        "moveId": "agility"
      },
      {
        "level": 45,
        "moveId": "swift"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "evolution": {
      "level": 36,
      "evolvesTo": 18
    },
    "catchRate": 120,
    "baseXP": 122,
    "ascii": "P"
  },
  {
    "id": 18,
    "name": "Pidgeot",
    "types": [
      "Normal",
      "Flying"
    ],
    "baseStats": {
      "hp": 83,
      "attack": 80,
      "defense": 75,
      "speed": 101,
      "special": 70
    },
    "moves": [
      {
        "level": 1,
        "moveId": "gust"
      },
      {
        "level": 1,
        "moveId": "quick-attack"
      },
      {
        "level": 1,
        "moveId": "sand-attack"
      },
      {
        "level": 31,
        "moveId": "wing-attack"
      },
      {
        "level": 38,
        "moveId": "tackle"
      },
      {
        "level": 44,
        "moveId": "agility"
      },
      {
        "level": 45,
        "moveId": "swift"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "catchRate": 45,
    "baseXP": 216,
    "ascii": "P"
  },
  {
    "id": 19,
    "name": "Rattata",
    "types": [
      "Normal"
    ],
    "baseStats": {
      "hp": 30,
      "attack": 56,
      "defense": 35,
      "speed": 72,
      "special": 25
    },
    "moves": [
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 7,
        "moveId": "quick-attack"
      },
      {
        "level": 23,
        "moveId": "focus-energy"
      },
      {
        "level": 30,
        "moveId": "swift"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 45,
        "moveId": "body-slam"
      },
      {
        "level": 52,
        "moveId": "double-edge"
      }
    ],
    "evolution": {
      "level": 20,
      "evolvesTo": 20
    },
    "catchRate": 255,
    "baseXP": 51,
    "ascii": "R"
  },
  {
    "id": 20,
    "name": "Raticate",
    "types": [
      "Normal"
    ],
    "baseStats": {
      "hp": 55,
      "attack": 81,
      "defense": 60,
      "speed": 97,
      "special": 50
    },
    "moves": [
      {
        "level": 1,
        "moveId": "quick-attack"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 27,
        "moveId": "focus-energy"
      },
      {
        "level": 30,
        "moveId": "swift"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 45,
        "moveId": "body-slam"
      },
      {
        "level": 52,
        "moveId": "double-edge"
      }
    ],
    "catchRate": 127,
    "baseXP": 145,
    "ascii": "R"
  },
  {
    "id": 21,
    "name": "Spearow",
    "types": [
      "Normal",
      "Flying"
    ],
    "baseStats": {
      "hp": 40,
      "attack": 60,
      "defense": 30,
      "speed": 70,
      "special": 31
    },
    "moves": [
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 9,
        "moveId": "leer"
      },
      {
        "level": 22,
        "moveId": "tackle"
      },
      {
        "level": 30,
        "moveId": "swift"
      },
      {
        "level": 36,
        "moveId": "agility"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 45,
        "moveId": "body-slam"
      },
      {
        "level": 52,
        "moveId": "double-edge"
      }
    ],
    "evolution": {
      "level": 20,
      "evolvesTo": 22
    },
    "catchRate": 255,
    "baseXP": 52,
    "ascii": "S"
  },
  {
    "id": 22,
    "name": "Fearow",
    "types": [
      "Normal",
      "Flying"
    ],
    "baseStats": {
      "hp": 65,
      "attack": 90,
      "defense": 65,
      "speed": 100,
      "special": 61
    },
    "moves": [
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 22,
        "moveId": "tackle"
      },
      {
        "level": 30,
        "moveId": "swift"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 43,
        "moveId": "agility"
      },
      {
        "level": 45,
        "moveId": "body-slam"
      },
      {
        "level": 52,
        "moveId": "double-edge"
      }
    ],
    "catchRate": 90,
    "baseXP": 155,
    "ascii": "F"
  },
  {
    "id": 23,
    "name": "Ekans",
    "types": [
      "Poison"
    ],
    "baseStats": {
      "hp": 35,
      "attack": 60,
      "defense": 44,
      "speed": 55,
      "special": 40
    },
    "moves": [
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 1,
        "moveId": "wrap"
      },
      {
        "level": 10,
        "moveId": "poison-sting"
      },
      {
        "level": 17,
        "moveId": "bite"
      },
      {
        "level": 31,
        "moveId": "screech"
      },
      {
        "level": 38,
        "moveId": "acid"
      },
      {
        "level": 45,
        "moveId": "sludge"
      },
      {
        "level": 52,
        "moveId": "toxic"
      }
    ],
    "evolution": {
      "level": 22,
      "evolvesTo": 24
    },
    "catchRate": 255,
    "baseXP": 58,
    "ascii": "E"
  },
  {
    "id": 24,
    "name": "Arbok",
    "types": [
      "Poison"
    ],
    "baseStats": {
      "hp": 60,
      "attack": 95,
      "defense": 69,
      "speed": 80,
      "special": 65
    },
    "moves": [
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 1,
        "moveId": "poison-sting"
      },
      {
        "level": 1,
        "moveId": "wrap"
      },
      {
        "level": 17,
        "moveId": "bite"
      },
      {
        "level": 36,
        "moveId": "screech"
      },
      {
        "level": 45,
        "moveId": "sludge"
      },
      {
        "level": 47,
        "moveId": "acid"
      },
      {
        "level": 52,
        "moveId": "toxic"
      }
    ],
    "catchRate": 90,
    "baseXP": 157,
    "ascii": "A"
  },
  {
    "id": 25,
    "name": "Pikachu",
    "types": [
      "Electric"
    ],
    "baseStats": {
      "hp": 35,
      "attack": 55,
      "defense": 40,
      "speed": 90,
      "special": 50
    },
    "moves": [
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 6,
        "moveId": "tail-whip"
      },
      {
        "level": 8,
        "moveId": "thunder-wave"
      },
      {
        "level": 11,
        "moveId": "quick-attack"
      },
      {
        "level": 26,
        "moveId": "swift"
      },
      {
        "level": 26,
        "moveId": "thunderbolt"
      },
      {
        "level": 33,
        "moveId": "agility"
      },
      {
        "level": 41,
        "moveId": "thunder"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": -1
    },
    "catchRate": 190,
    "baseXP": 112,
    "ascii": "P"
  },
  {
    "id": 26,
    "name": "Raichu",
    "types": [
      "Electric"
    ],
    "baseStats": {
      "hp": 60,
      "attack": 90,
      "defense": 55,
      "speed": 110,
      "special": 90
    },
    "moves": [
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 1,
        "moveId": "thunder-wave"
      },
      {
        "level": 15,
        "moveId": "swift"
      },
      {
        "level": 22,
        "moveId": "thunderbolt"
      },
      {
        "level": 30,
        "moveId": "thunder"
      },
      {
        "level": 38,
        "moveId": "tackle"
      },
      {
        "level": 45,
        "moveId": "headbutt"
      },
      {
        "level": 52,
        "moveId": "body-slam"
      }
    ],
    "catchRate": 75,
    "baseXP": 218,
    "ascii": "R"
  },
  {
    "id": 27,
    "name": "Sandshrew",
    "types": [
      "Ground"
    ],
    "baseStats": {
      "hp": 50,
      "attack": 75,
      "defense": 85,
      "speed": 40,
      "special": 20
    },
    "moves": [
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 10,
        "moveId": "sand-attack"
      },
      {
        "level": 17,
        "moveId": "slash"
      },
      {
        "level": 24,
        "moveId": "poison-sting"
      },
      {
        "level": 31,
        "moveId": "swift"
      },
      {
        "level": 38,
        "moveId": "dig"
      },
      {
        "level": 45,
        "moveId": "earthquake"
      },
      {
        "level": 52,
        "moveId": "tackle"
      }
    ],
    "evolution": {
      "level": 22,
      "evolvesTo": 28
    },
    "catchRate": 255,
    "baseXP": 60,
    "ascii": "S"
  },
  {
    "id": 28,
    "name": "Sandslash",
    "types": [
      "Ground"
    ],
    "baseStats": {
      "hp": 75,
      "attack": 100,
      "defense": 110,
      "speed": 65,
      "special": 45
    },
    "moves": [
      {
        "level": 1,
        "moveId": "sand-attack"
      },
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 17,
        "moveId": "slash"
      },
      {
        "level": 27,
        "moveId": "poison-sting"
      },
      {
        "level": 36,
        "moveId": "swift"
      },
      {
        "level": 38,
        "moveId": "dig"
      },
      {
        "level": 45,
        "moveId": "earthquake"
      },
      {
        "level": 52,
        "moveId": "tackle"
      }
    ],
    "catchRate": 90,
    "baseXP": 158,
    "ascii": "S"
  },
  {
    "id": 29,
    "name": "Nidoran-F",
    "types": [
      "Poison"
    ],
    "baseStats": {
      "hp": 55,
      "attack": 47,
      "defense": 52,
      "speed": 41,
      "special": 40
    },
    "moves": [
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 8,
        "moveId": "scratch"
      },
      {
        "level": 14,
        "moveId": "poison-sting"
      },
      {
        "level": 21,
        "moveId": "tail-whip"
      },
      {
        "level": 29,
        "moveId": "bite"
      },
      {
        "level": 45,
        "moveId": "acid"
      },
      {
        "level": 52,
        "moveId": "sludge"
      }
    ],
    "evolution": {
      "level": 16,
      "evolvesTo": 30
    },
    "catchRate": 235,
    "baseXP": 55,
    "ascii": "F"
  },
  {
    "id": 30,
    "name": "Nidorina",
    "types": [
      "Poison"
    ],
    "baseStats": {
      "hp": 70,
      "attack": 62,
      "defense": 67,
      "speed": 56,
      "special": 55
    },
    "moves": [
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 14,
        "moveId": "poison-sting"
      },
      {
        "level": 23,
        "moveId": "tail-whip"
      },
      {
        "level": 32,
        "moveId": "bite"
      },
      {
        "level": 45,
        "moveId": "acid"
      },
      {
        "level": 52,
        "moveId": "sludge"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": -1
    },
    "catchRate": 120,
    "baseXP": 128,
    "ascii": "N"
  },
  {
    "id": 31,
    "name": "Nidoqueen",
    "types": [
      "Poison",
      "Ground"
    ],
    "baseStats": {
      "hp": 90,
      "attack": 92,
      "defense": 87,
      "speed": 76,
      "special": 75
    },
    "moves": [
      {
        "level": 1,
        "moveId": "body-slam"
      },
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 14,
        "moveId": "poison-sting"
      },
      {
        "level": 38,
        "moveId": "acid"
      },
      {
        "level": 45,
        "moveId": "sludge"
      },
      {
        "level": 52,
        "moveId": "toxic"
      }
    ],
    "catchRate": 45,
    "baseXP": 227,
    "ascii": "N"
  },
  {
    "id": 32,
    "name": "Nidoran-M",
    "types": [
      "Poison"
    ],
    "baseStats": {
      "hp": 46,
      "attack": 57,
      "defense": 40,
      "speed": 50,
      "special": 40
    },
    "moves": [
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 14,
        "moveId": "poison-sting"
      },
      {
        "level": 21,
        "moveId": "focus-energy"
      },
      {
        "level": 30,
        "moveId": "acid"
      },
      {
        "level": 38,
        "moveId": "sludge"
      },
      {
        "level": 45,
        "moveId": "toxic"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "evolution": {
      "level": 16,
      "evolvesTo": 33
    },
    "catchRate": 235,
    "baseXP": 55,
    "ascii": "M"
  },
  {
    "id": 33,
    "name": "Nidorino",
    "types": [
      "Poison"
    ],
    "baseStats": {
      "hp": 61,
      "attack": 72,
      "defense": 57,
      "speed": 65,
      "special": 55
    },
    "moves": [
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 14,
        "moveId": "poison-sting"
      },
      {
        "level": 23,
        "moveId": "focus-energy"
      },
      {
        "level": 30,
        "moveId": "acid"
      },
      {
        "level": 38,
        "moveId": "sludge"
      },
      {
        "level": 45,
        "moveId": "toxic"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": -1
    },
    "catchRate": 120,
    "baseXP": 128,
    "ascii": "N"
  },
  {
    "id": 34,
    "name": "Nidoking",
    "types": [
      "Poison",
      "Ground"
    ],
    "baseStats": {
      "hp": 81,
      "attack": 102,
      "defense": 77,
      "speed": 85,
      "special": 85
    },
    "moves": [
      {
        "level": 1,
        "moveId": "poison-sting"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 15,
        "moveId": "acid"
      },
      {
        "level": 22,
        "moveId": "sludge"
      },
      {
        "level": 30,
        "moveId": "toxic"
      },
      {
        "level": 38,
        "moveId": "sand-attack"
      },
      {
        "level": 45,
        "moveId": "dig"
      },
      {
        "level": 52,
        "moveId": "earthquake"
      }
    ],
    "catchRate": 45,
    "baseXP": 227,
    "ascii": "N"
  },
  {
    "id": 35,
    "name": "Clefairy",
    "types": [
      "Normal"
    ],
    "baseStats": {
      "hp": 70,
      "attack": 45,
      "defense": 48,
      "speed": 35,
      "special": 60
    },
    "moves": [
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 1,
        "moveId": "pound"
      },
      {
        "level": 22,
        "moveId": "tackle"
      },
      {
        "level": 30,
        "moveId": "headbutt"
      },
      {
        "level": 38,
        "moveId": "swift"
      },
      {
        "level": 39,
        "moveId": "defense-curl"
      },
      {
        "level": 45,
        "moveId": "body-slam"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": -1
    },
    "catchRate": 150,
    "baseXP": 113,
    "ascii": "C"
  },
  {
    "id": 36,
    "name": "Clefable",
    "types": [
      "Normal"
    ],
    "baseStats": {
      "hp": 95,
      "attack": 70,
      "defense": 73,
      "speed": 60,
      "special": 95
    },
    "moves": [
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 8,
        "moveId": "headbutt"
      },
      {
        "level": 15,
        "moveId": "swift"
      },
      {
        "level": 22,
        "moveId": "body-slam"
      }
    ],
    "catchRate": 25,
    "baseXP": 217,
    "ascii": "C"
  },
  {
    "id": 37,
    "name": "Vulpix",
    "types": [
      "Fire"
    ],
    "baseStats": {
      "hp": 38,
      "attack": 41,
      "defense": 40,
      "speed": 65,
      "special": 50
    },
    "moves": [
      {
        "level": 1,
        "moveId": "ember"
      },
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 16,
        "moveId": "quick-attack"
      },
      {
        "level": 28,
        "moveId": "confuse-ray"
      },
      {
        "level": 35,
        "moveId": "flamethrower"
      },
      {
        "level": 38,
        "moveId": "smokescreen"
      },
      {
        "level": 45,
        "moveId": "fire-blast"
      },
      {
        "level": 52,
        "moveId": "tackle"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": -1
    },
    "catchRate": 190,
    "baseXP": 60,
    "ascii": "V"
  },
  {
    "id": 38,
    "name": "Ninetales",
    "types": [
      "Fire"
    ],
    "baseStats": {
      "hp": 73,
      "attack": 76,
      "defense": 75,
      "speed": 100,
      "special": 81
    },
    "moves": [
      {
        "level": 1,
        "moveId": "ember"
      },
      {
        "level": 1,
        "moveId": "quick-attack"
      },
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 22,
        "moveId": "smokescreen"
      },
      {
        "level": 30,
        "moveId": "flamethrower"
      },
      {
        "level": 38,
        "moveId": "fire-blast"
      },
      {
        "level": 45,
        "moveId": "tackle"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "catchRate": 75,
    "baseXP": 177,
    "ascii": "N"
  },
  {
    "id": 39,
    "name": "Jigglypuff",
    "types": [
      "Normal"
    ],
    "baseStats": {
      "hp": 115,
      "attack": 45,
      "defense": 20,
      "speed": 20,
      "special": 45
    },
    "moves": [
      {
        "level": 9,
        "moveId": "pound"
      },
      {
        "level": 19,
        "moveId": "defense-curl"
      },
      {
        "level": 30,
        "moveId": "tackle"
      },
      {
        "level": 34,
        "moveId": "body-slam"
      },
      {
        "level": 38,
        "moveId": "swift"
      },
      {
        "level": 39,
        "moveId": "double-edge"
      },
      {
        "level": 45,
        "moveId": "headbutt"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": -1
    },
    "catchRate": 170,
    "baseXP": 95,
    "ascii": "J"
  },
  {
    "id": 40,
    "name": "Wigglytuff",
    "types": [
      "Normal"
    ],
    "baseStats": {
      "hp": 140,
      "attack": 70,
      "defense": 45,
      "speed": 45,
      "special": 85
    },
    "moves": [
      {
        "level": 1,
        "moveId": "defense-curl"
      },
      {
        "level": 8,
        "moveId": "tackle"
      },
      {
        "level": 15,
        "moveId": "swift"
      },
      {
        "level": 22,
        "moveId": "headbutt"
      },
      {
        "level": 30,
        "moveId": "body-slam"
      },
      {
        "level": 38,
        "moveId": "double-edge"
      }
    ],
    "catchRate": 50,
    "baseXP": 196,
    "ascii": "W"
  },
  {
    "id": 41,
    "name": "Zubat",
    "types": [
      "Poison",
      "Flying"
    ],
    "baseStats": {
      "hp": 40,
      "attack": 45,
      "defense": 35,
      "speed": 55,
      "special": 30
    },
    "moves": [
      {
        "level": 15,
        "moveId": "bite"
      },
      {
        "level": 21,
        "moveId": "confuse-ray"
      },
      {
        "level": 22,
        "moveId": "poison-sting"
      },
      {
        "level": 28,
        "moveId": "wing-attack"
      },
      {
        "level": 30,
        "moveId": "acid"
      },
      {
        "level": 38,
        "moveId": "sludge"
      },
      {
        "level": 45,
        "moveId": "toxic"
      },
      {
        "level": 52,
        "moveId": "gust"
      }
    ],
    "evolution": {
      "level": 22,
      "evolvesTo": 42
    },
    "catchRate": 255,
    "baseXP": 49,
    "ascii": "Z"
  },
  {
    "id": 42,
    "name": "Golbat",
    "types": [
      "Poison",
      "Flying"
    ],
    "baseStats": {
      "hp": 75,
      "attack": 80,
      "defense": 70,
      "speed": 90,
      "special": 65
    },
    "moves": [
      {
        "level": 1,
        "moveId": "bite"
      },
      {
        "level": 1,
        "moveId": "screech"
      },
      {
        "level": 21,
        "moveId": "confuse-ray"
      },
      {
        "level": 30,
        "moveId": "poison-sting"
      },
      {
        "level": 32,
        "moveId": "wing-attack"
      },
      {
        "level": 38,
        "moveId": "acid"
      },
      {
        "level": 45,
        "moveId": "sludge"
      },
      {
        "level": 52,
        "moveId": "toxic"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": 169
    },
    "catchRate": 90,
    "baseXP": 159,
    "ascii": "G"
  },
  {
    "id": 43,
    "name": "Oddish",
    "types": [
      "Grass",
      "Poison"
    ],
    "baseStats": {
      "hp": 45,
      "attack": 50,
      "defense": 55,
      "speed": 30,
      "special": 75
    },
    "moves": [
      {
        "level": 15,
        "moveId": "growl"
      },
      {
        "level": 22,
        "moveId": "vine-whip"
      },
      {
        "level": 24,
        "moveId": "acid"
      },
      {
        "level": 30,
        "moveId": "leech-seed"
      },
      {
        "level": 38,
        "moveId": "razor-leaf"
      },
      {
        "level": 45,
        "moveId": "poison-sting"
      },
      {
        "level": 46,
        "moveId": "solar-beam"
      },
      {
        "level": 52,
        "moveId": "sludge"
      }
    ],
    "evolution": {
      "level": 21,
      "evolvesTo": 44
    },
    "catchRate": 255,
    "baseXP": 64,
    "ascii": "O"
  },
  {
    "id": 44,
    "name": "Gloom",
    "types": [
      "Grass",
      "Poison"
    ],
    "baseStats": {
      "hp": 60,
      "attack": 65,
      "defense": 70,
      "speed": 40,
      "special": 85
    },
    "moves": [
      {
        "level": 15,
        "moveId": "growl"
      },
      {
        "level": 22,
        "moveId": "vine-whip"
      },
      {
        "level": 28,
        "moveId": "acid"
      },
      {
        "level": 30,
        "moveId": "leech-seed"
      },
      {
        "level": 38,
        "moveId": "razor-leaf"
      },
      {
        "level": 45,
        "moveId": "poison-sting"
      },
      {
        "level": 52,
        "moveId": "sludge"
      },
      {
        "level": 52,
        "moveId": "solar-beam"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": -1
    },
    "catchRate": 120,
    "baseXP": 138,
    "ascii": "G"
  },
  {
    "id": 45,
    "name": "Vileplume",
    "types": [
      "Grass",
      "Poison"
    ],
    "baseStats": {
      "hp": 75,
      "attack": 80,
      "defense": 85,
      "speed": 50,
      "special": 110
    },
    "moves": [
      {
        "level": 1,
        "moveId": "acid"
      },
      {
        "level": 8,
        "moveId": "growl"
      },
      {
        "level": 15,
        "moveId": "vine-whip"
      },
      {
        "level": 22,
        "moveId": "leech-seed"
      },
      {
        "level": 30,
        "moveId": "razor-leaf"
      },
      {
        "level": 38,
        "moveId": "solar-beam"
      },
      {
        "level": 45,
        "moveId": "poison-sting"
      },
      {
        "level": 52,
        "moveId": "sludge"
      }
    ],
    "catchRate": 45,
    "baseXP": 221,
    "ascii": "V"
  },
  {
    "id": 46,
    "name": "Paras",
    "types": [
      "Bug",
      "Grass"
    ],
    "baseStats": {
      "hp": 35,
      "attack": 70,
      "defense": 55,
      "speed": 25,
      "special": 45
    },
    "moves": [
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 15,
        "moveId": "string-shot"
      },
      {
        "level": 22,
        "moveId": "poison-sting"
      },
      {
        "level": 30,
        "moveId": "leech-seed"
      },
      {
        "level": 34,
        "moveId": "slash"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 45,
        "moveId": "growl"
      },
      {
        "level": 52,
        "moveId": "vine-whip"
      }
    ],
    "evolution": {
      "level": 24,
      "evolvesTo": 47
    },
    "catchRate": 190,
    "baseXP": 57,
    "ascii": "P"
  },
  {
    "id": 47,
    "name": "Parasect",
    "types": [
      "Bug",
      "Grass"
    ],
    "baseStats": {
      "hp": 60,
      "attack": 95,
      "defense": 80,
      "speed": 30,
      "special": 60
    },
    "moves": [
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 15,
        "moveId": "string-shot"
      },
      {
        "level": 22,
        "moveId": "poison-sting"
      },
      {
        "level": 30,
        "moveId": "leech-seed"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 39,
        "moveId": "slash"
      },
      {
        "level": 45,
        "moveId": "growl"
      },
      {
        "level": 52,
        "moveId": "vine-whip"
      }
    ],
    "catchRate": 75,
    "baseXP": 142,
    "ascii": "P"
  },
  {
    "id": 48,
    "name": "Venonat",
    "types": [
      "Bug",
      "Poison"
    ],
    "baseStats": {
      "hp": 60,
      "attack": 55,
      "defense": 50,
      "speed": 45,
      "special": 40
    },
    "moves": [
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 15,
        "moveId": "string-shot"
      },
      {
        "level": 22,
        "moveId": "poison-sting"
      },
      {
        "level": 30,
        "moveId": "leech-seed"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 43,
        "moveId": "psychic"
      },
      {
        "level": 45,
        "moveId": "acid"
      },
      {
        "level": 52,
        "moveId": "sludge"
      }
    ],
    "evolution": {
      "level": 31,
      "evolvesTo": 49
    },
    "catchRate": 190,
    "baseXP": 61,
    "ascii": "V"
  },
  {
    "id": 49,
    "name": "Venomoth",
    "types": [
      "Bug",
      "Poison"
    ],
    "baseStats": {
      "hp": 70,
      "attack": 65,
      "defense": 60,
      "speed": 90,
      "special": 90
    },
    "moves": [
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 15,
        "moveId": "string-shot"
      },
      {
        "level": 22,
        "moveId": "poison-sting"
      },
      {
        "level": 30,
        "moveId": "leech-seed"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 45,
        "moveId": "acid"
      },
      {
        "level": 50,
        "moveId": "psychic"
      },
      {
        "level": 52,
        "moveId": "sludge"
      }
    ],
    "catchRate": 75,
    "baseXP": 158,
    "ascii": "V"
  },
  {
    "id": 50,
    "name": "Diglett",
    "types": [
      "Ground"
    ],
    "baseStats": {
      "hp": 10,
      "attack": 55,
      "defense": 25,
      "speed": 95,
      "special": 35
    },
    "moves": [
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 15,
        "moveId": "growl"
      },
      {
        "level": 19,
        "moveId": "dig"
      },
      {
        "level": 24,
        "moveId": "sand-attack"
      },
      {
        "level": 31,
        "moveId": "slash"
      },
      {
        "level": 40,
        "moveId": "earthquake"
      },
      {
        "level": 45,
        "moveId": "tackle"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "evolution": {
      "level": 26,
      "evolvesTo": 51
    },
    "catchRate": 255,
    "baseXP": 53,
    "ascii": "D"
  },
  {
    "id": 51,
    "name": "Dugtrio",
    "types": [
      "Ground"
    ],
    "baseStats": {
      "hp": 35,
      "attack": 100,
      "defense": 50,
      "speed": 120,
      "special": 50
    },
    "moves": [
      {
        "level": 1,
        "moveId": "dig"
      },
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 24,
        "moveId": "sand-attack"
      },
      {
        "level": 35,
        "moveId": "slash"
      },
      {
        "level": 45,
        "moveId": "tackle"
      },
      {
        "level": 47,
        "moveId": "earthquake"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "catchRate": 50,
    "baseXP": 149,
    "ascii": "D"
  },
  {
    "id": 52,
    "name": "Meowth",
    "types": [
      "Normal"
    ],
    "baseStats": {
      "hp": 40,
      "attack": 45,
      "defense": 35,
      "speed": 90,
      "special": 40
    },
    "moves": [
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 12,
        "moveId": "bite"
      },
      {
        "level": 24,
        "moveId": "screech"
      },
      {
        "level": 38,
        "moveId": "tackle"
      },
      {
        "level": 44,
        "moveId": "slash"
      },
      {
        "level": 45,
        "moveId": "swift"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": -1
    },
    "catchRate": 255,
    "baseXP": 58,
    "ascii": "M"
  },
  {
    "id": 53,
    "name": "Persian",
    "types": [
      "Normal"
    ],
    "baseStats": {
      "hp": 65,
      "attack": 70,
      "defense": 60,
      "speed": 115,
      "special": 65
    },
    "moves": [
      {
        "level": 1,
        "moveId": "bite"
      },
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 1,
        "moveId": "screech"
      },
      {
        "level": 38,
        "moveId": "tackle"
      },
      {
        "level": 45,
        "moveId": "swift"
      },
      {
        "level": 51,
        "moveId": "slash"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "catchRate": 90,
    "baseXP": 154,
    "ascii": "P"
  },
  {
    "id": 54,
    "name": "Psyduck",
    "types": [
      "Water"
    ],
    "baseStats": {
      "hp": 50,
      "attack": 52,
      "defense": 48,
      "speed": 55,
      "special": 65
    },
    "moves": [
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 15,
        "moveId": "bubble"
      },
      {
        "level": 22,
        "moveId": "water-gun"
      },
      {
        "level": 28,
        "moveId": "tail-whip"
      },
      {
        "level": 30,
        "moveId": "bubble-beam"
      },
      {
        "level": 38,
        "moveId": "surf"
      },
      {
        "level": 45,
        "moveId": "tackle"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "evolution": {
      "level": 33,
      "evolvesTo": 55
    },
    "catchRate": 190,
    "baseXP": 64,
    "ascii": "P"
  },
  {
    "id": 55,
    "name": "Golduck",
    "types": [
      "Water"
    ],
    "baseStats": {
      "hp": 80,
      "attack": 82,
      "defense": 78,
      "speed": 85,
      "special": 95
    },
    "moves": [
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 15,
        "moveId": "bubble"
      },
      {
        "level": 22,
        "moveId": "water-gun"
      },
      {
        "level": 30,
        "moveId": "bubble-beam"
      },
      {
        "level": 38,
        "moveId": "surf"
      },
      {
        "level": 45,
        "moveId": "tackle"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "catchRate": 75,
    "baseXP": 175,
    "ascii": "G"
  },
  {
    "id": 56,
    "name": "Mankey",
    "types": [
      "Fighting"
    ],
    "baseStats": {
      "hp": 40,
      "attack": 80,
      "defense": 35,
      "speed": 70,
      "special": 35
    },
    "moves": [
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 15,
        "moveId": "karate-chop"
      },
      {
        "level": 27,
        "moveId": "focus-energy"
      },
      {
        "level": 38,
        "moveId": "meditate"
      },
      {
        "level": 45,
        "moveId": "headbutt"
      },
      {
        "level": 45,
        "moveId": "screech"
      },
      {
        "level": 52,
        "moveId": "tackle"
      }
    ],
    "evolution": {
      "level": 28,
      "evolvesTo": 57
    },
    "catchRate": 190,
    "baseXP": 61,
    "ascii": "M"
  },
  {
    "id": 57,
    "name": "Primeape",
    "types": [
      "Fighting"
    ],
    "baseStats": {
      "hp": 65,
      "attack": 105,
      "defense": 60,
      "speed": 95,
      "special": 60
    },
    "moves": [
      {
        "level": 1,
        "moveId": "karate-chop"
      },
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 27,
        "moveId": "focus-energy"
      },
      {
        "level": 38,
        "moveId": "meditate"
      },
      {
        "level": 45,
        "moveId": "headbutt"
      },
      {
        "level": 45,
        "moveId": "screech"
      },
      {
        "level": 52,
        "moveId": "tackle"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": 979
    },
    "catchRate": 75,
    "baseXP": 159,
    "ascii": "P"
  },
  {
    "id": 58,
    "name": "Growlithe",
    "types": [
      "Fire"
    ],
    "baseStats": {
      "hp": 55,
      "attack": 70,
      "defense": 45,
      "speed": 60,
      "special": 70
    },
    "moves": [
      {
        "level": 1,
        "moveId": "bite"
      },
      {
        "level": 18,
        "moveId": "ember"
      },
      {
        "level": 23,
        "moveId": "leer"
      },
      {
        "level": 38,
        "moveId": "smokescreen"
      },
      {
        "level": 39,
        "moveId": "agility"
      },
      {
        "level": 45,
        "moveId": "fire-blast"
      },
      {
        "level": 50,
        "moveId": "flamethrower"
      },
      {
        "level": 52,
        "moveId": "tackle"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": -1
    },
    "catchRate": 190,
    "baseXP": 70,
    "ascii": "G"
  },
  {
    "id": 59,
    "name": "Arcanine",
    "types": [
      "Fire"
    ],
    "baseStats": {
      "hp": 90,
      "attack": 110,
      "defense": 80,
      "speed": 95,
      "special": 100
    },
    "moves": [
      {
        "level": 1,
        "moveId": "ember"
      },
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 15,
        "moveId": "smokescreen"
      },
      {
        "level": 22,
        "moveId": "flamethrower"
      },
      {
        "level": 30,
        "moveId": "fire-blast"
      },
      {
        "level": 38,
        "moveId": "tackle"
      },
      {
        "level": 45,
        "moveId": "headbutt"
      },
      {
        "level": 52,
        "moveId": "swift"
      }
    ],
    "catchRate": 75,
    "baseXP": 194,
    "ascii": "A"
  },
  {
    "id": 60,
    "name": "Poliwag",
    "types": [
      "Water"
    ],
    "baseStats": {
      "hp": 40,
      "attack": 50,
      "defense": 40,
      "speed": 90,
      "special": 40
    },
    "moves": [
      {
        "level": 1,
        "moveId": "bubble"
      },
      {
        "level": 16,
        "moveId": "hypnosis"
      },
      {
        "level": 19,
        "moveId": "water-gun"
      },
      {
        "level": 30,
        "moveId": "bubble-beam"
      },
      {
        "level": 31,
        "moveId": "body-slam"
      },
      {
        "level": 38,
        "moveId": "surf"
      },
      {
        "level": 45,
        "moveId": "tackle"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "evolution": {
      "level": 25,
      "evolvesTo": 61
    },
    "catchRate": 255,
    "baseXP": 60,
    "ascii": "P"
  },
  {
    "id": 61,
    "name": "Poliwhirl",
    "types": [
      "Water"
    ],
    "baseStats": {
      "hp": 65,
      "attack": 65,
      "defense": 65,
      "speed": 90,
      "special": 50
    },
    "moves": [
      {
        "level": 1,
        "moveId": "bubble"
      },
      {
        "level": 1,
        "moveId": "hypnosis"
      },
      {
        "level": 1,
        "moveId": "water-gun"
      },
      {
        "level": 30,
        "moveId": "bubble-beam"
      },
      {
        "level": 33,
        "moveId": "body-slam"
      },
      {
        "level": 38,
        "moveId": "surf"
      },
      {
        "level": 45,
        "moveId": "tackle"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": -1
    },
    "catchRate": 120,
    "baseXP": 135,
    "ascii": "P"
  },
  {
    "id": 62,
    "name": "Poliwrath",
    "types": [
      "Water",
      "Fighting"
    ],
    "baseStats": {
      "hp": 90,
      "attack": 95,
      "defense": 95,
      "speed": 70,
      "special": 70
    },
    "moves": [
      {
        "level": 1,
        "moveId": "body-slam"
      },
      {
        "level": 1,
        "moveId": "hypnosis"
      },
      {
        "level": 1,
        "moveId": "water-gun"
      },
      {
        "level": 22,
        "moveId": "bubble"
      },
      {
        "level": 30,
        "moveId": "bubble-beam"
      },
      {
        "level": 38,
        "moveId": "surf"
      },
      {
        "level": 45,
        "moveId": "karate-chop"
      },
      {
        "level": 52,
        "moveId": "meditate"
      }
    ],
    "catchRate": 45,
    "baseXP": 230,
    "ascii": "P"
  },
  {
    "id": 63,
    "name": "Abra",
    "types": [
      "Psychic"
    ],
    "baseStats": {
      "hp": 25,
      "attack": 20,
      "defense": 15,
      "speed": 90,
      "special": 105
    },
    "moves": [
      {
        "level": 1,
        "moveId": "hypnosis"
      },
      {
        "level": 8,
        "moveId": "confuse-ray"
      },
      {
        "level": 15,
        "moveId": "psychic"
      },
      {
        "level": 22,
        "moveId": "dream-eater"
      },
      {
        "level": 30,
        "moveId": "tackle"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 45,
        "moveId": "swift"
      },
      {
        "level": 52,
        "moveId": "body-slam"
      }
    ],
    "evolution": {
      "level": 16,
      "evolvesTo": 64
    },
    "catchRate": 200,
    "baseXP": 62,
    "ascii": "A"
  },
  {
    "id": 64,
    "name": "Kadabra",
    "types": [
      "Psychic"
    ],
    "baseStats": {
      "hp": 40,
      "attack": 35,
      "defense": 30,
      "speed": 105,
      "special": 120
    },
    "moves": [
      {
        "level": 8,
        "moveId": "hypnosis"
      },
      {
        "level": 15,
        "moveId": "confuse-ray"
      },
      {
        "level": 22,
        "moveId": "dream-eater"
      },
      {
        "level": 30,
        "moveId": "tackle"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 38,
        "moveId": "psychic"
      },
      {
        "level": 45,
        "moveId": "swift"
      },
      {
        "level": 52,
        "moveId": "body-slam"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": 65
    },
    "catchRate": 100,
    "baseXP": 140,
    "ascii": "K"
  },
  {
    "id": 65,
    "name": "Alakazam",
    "types": [
      "Psychic"
    ],
    "baseStats": {
      "hp": 55,
      "attack": 50,
      "defense": 45,
      "speed": 120,
      "special": 135
    },
    "moves": [
      {
        "level": 8,
        "moveId": "hypnosis"
      },
      {
        "level": 15,
        "moveId": "confuse-ray"
      },
      {
        "level": 22,
        "moveId": "dream-eater"
      },
      {
        "level": 30,
        "moveId": "tackle"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 38,
        "moveId": "psychic"
      },
      {
        "level": 45,
        "moveId": "swift"
      },
      {
        "level": 52,
        "moveId": "body-slam"
      }
    ],
    "catchRate": 50,
    "baseXP": 225,
    "ascii": "A"
  },
  {
    "id": 66,
    "name": "Machop",
    "types": [
      "Fighting"
    ],
    "baseStats": {
      "hp": 70,
      "attack": 80,
      "defense": 50,
      "speed": 35,
      "special": 35
    },
    "moves": [
      {
        "level": 1,
        "moveId": "karate-chop"
      },
      {
        "level": 22,
        "moveId": "meditate"
      },
      {
        "level": 25,
        "moveId": "leer"
      },
      {
        "level": 30,
        "moveId": "headbutt"
      },
      {
        "level": 32,
        "moveId": "focus-energy"
      },
      {
        "level": 38,
        "moveId": "tackle"
      },
      {
        "level": 45,
        "moveId": "swift"
      },
      {
        "level": 52,
        "moveId": "body-slam"
      }
    ],
    "evolution": {
      "level": 28,
      "evolvesTo": 67
    },
    "catchRate": 180,
    "baseXP": 61,
    "ascii": "M"
  },
  {
    "id": 67,
    "name": "Machoke",
    "types": [
      "Fighting"
    ],
    "baseStats": {
      "hp": 80,
      "attack": 100,
      "defense": 70,
      "speed": 45,
      "special": 50
    },
    "moves": [
      {
        "level": 1,
        "moveId": "karate-chop"
      },
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 22,
        "moveId": "meditate"
      },
      {
        "level": 30,
        "moveId": "headbutt"
      },
      {
        "level": 36,
        "moveId": "focus-energy"
      },
      {
        "level": 38,
        "moveId": "tackle"
      },
      {
        "level": 45,
        "moveId": "swift"
      },
      {
        "level": 52,
        "moveId": "body-slam"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": 68
    },
    "catchRate": 90,
    "baseXP": 142,
    "ascii": "M"
  },
  {
    "id": 68,
    "name": "Machamp",
    "types": [
      "Fighting"
    ],
    "baseStats": {
      "hp": 90,
      "attack": 130,
      "defense": 80,
      "speed": 55,
      "special": 65
    },
    "moves": [
      {
        "level": 1,
        "moveId": "karate-chop"
      },
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 22,
        "moveId": "meditate"
      },
      {
        "level": 30,
        "moveId": "headbutt"
      },
      {
        "level": 36,
        "moveId": "focus-energy"
      },
      {
        "level": 38,
        "moveId": "tackle"
      },
      {
        "level": 45,
        "moveId": "swift"
      },
      {
        "level": 52,
        "moveId": "body-slam"
      }
    ],
    "catchRate": 45,
    "baseXP": 227,
    "ascii": "M"
  },
  {
    "id": 69,
    "name": "Bellsprout",
    "types": [
      "Grass",
      "Poison"
    ],
    "baseStats": {
      "hp": 50,
      "attack": 75,
      "defense": 35,
      "speed": 40,
      "special": 70
    },
    "moves": [
      {
        "level": 1,
        "moveId": "vine-whip"
      },
      {
        "level": 13,
        "moveId": "wrap"
      },
      {
        "level": 26,
        "moveId": "acid"
      },
      {
        "level": 30,
        "moveId": "growl"
      },
      {
        "level": 33,
        "moveId": "razor-leaf"
      },
      {
        "level": 38,
        "moveId": "leech-seed"
      },
      {
        "level": 45,
        "moveId": "solar-beam"
      },
      {
        "level": 52,
        "moveId": "poison-sting"
      }
    ],
    "evolution": {
      "level": 21,
      "evolvesTo": 70
    },
    "catchRate": 255,
    "baseXP": 60,
    "ascii": "B"
  },
  {
    "id": 70,
    "name": "Weepinbell",
    "types": [
      "Grass",
      "Poison"
    ],
    "baseStats": {
      "hp": 65,
      "attack": 90,
      "defense": 50,
      "speed": 55,
      "special": 85
    },
    "moves": [
      {
        "level": 1,
        "moveId": "vine-whip"
      },
      {
        "level": 1,
        "moveId": "wrap"
      },
      {
        "level": 29,
        "moveId": "acid"
      },
      {
        "level": 30,
        "moveId": "growl"
      },
      {
        "level": 38,
        "moveId": "leech-seed"
      },
      {
        "level": 38,
        "moveId": "razor-leaf"
      },
      {
        "level": 45,
        "moveId": "solar-beam"
      },
      {
        "level": 52,
        "moveId": "poison-sting"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": -1
    },
    "catchRate": 120,
    "baseXP": 137,
    "ascii": "W"
  },
  {
    "id": 71,
    "name": "Victreebel",
    "types": [
      "Grass",
      "Poison"
    ],
    "baseStats": {
      "hp": 80,
      "attack": 105,
      "defense": 65,
      "speed": 70,
      "special": 100
    },
    "moves": [
      {
        "level": 1,
        "moveId": "acid"
      },
      {
        "level": 1,
        "moveId": "razor-leaf"
      },
      {
        "level": 13,
        "moveId": "wrap"
      },
      {
        "level": 22,
        "moveId": "growl"
      },
      {
        "level": 30,
        "moveId": "vine-whip"
      },
      {
        "level": 38,
        "moveId": "leech-seed"
      },
      {
        "level": 45,
        "moveId": "solar-beam"
      },
      {
        "level": 52,
        "moveId": "poison-sting"
      }
    ],
    "catchRate": 45,
    "baseXP": 221,
    "ascii": "V"
  },
  {
    "id": 72,
    "name": "Tentacool",
    "types": [
      "Water",
      "Poison"
    ],
    "baseStats": {
      "hp": 40,
      "attack": 40,
      "defense": 35,
      "speed": 70,
      "special": 50
    },
    "moves": [
      {
        "level": 1,
        "moveId": "acid"
      },
      {
        "level": 13,
        "moveId": "wrap"
      },
      {
        "level": 18,
        "moveId": "poison-sting"
      },
      {
        "level": 22,
        "moveId": "water-gun"
      },
      {
        "level": 38,
        "moveId": "bubble"
      },
      {
        "level": 40,
        "moveId": "screech"
      },
      {
        "level": 45,
        "moveId": "bubble-beam"
      },
      {
        "level": 52,
        "moveId": "surf"
      }
    ],
    "evolution": {
      "level": 30,
      "evolvesTo": 73
    },
    "catchRate": 190,
    "baseXP": 67,
    "ascii": "T"
  },
  {
    "id": 73,
    "name": "Tentacruel",
    "types": [
      "Water",
      "Poison"
    ],
    "baseStats": {
      "hp": 80,
      "attack": 70,
      "defense": 65,
      "speed": 100,
      "special": 80
    },
    "moves": [
      {
        "level": 1,
        "moveId": "acid"
      },
      {
        "level": 1,
        "moveId": "wrap"
      },
      {
        "level": 18,
        "moveId": "poison-sting"
      },
      {
        "level": 22,
        "moveId": "water-gun"
      },
      {
        "level": 38,
        "moveId": "bubble"
      },
      {
        "level": 43,
        "moveId": "screech"
      },
      {
        "level": 45,
        "moveId": "bubble-beam"
      },
      {
        "level": 52,
        "moveId": "surf"
      }
    ],
    "catchRate": 60,
    "baseXP": 180,
    "ascii": "T"
  },
  {
    "id": 74,
    "name": "Geodude",
    "types": [
      "Rock",
      "Ground"
    ],
    "baseStats": {
      "hp": 40,
      "attack": 80,
      "defense": 100,
      "speed": 20,
      "special": 30
    },
    "moves": [
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 11,
        "moveId": "defense-curl"
      },
      {
        "level": 26,
        "moveId": "harden"
      },
      {
        "level": 30,
        "moveId": "headbutt"
      },
      {
        "level": 31,
        "moveId": "earthquake"
      },
      {
        "level": 38,
        "moveId": "sand-attack"
      },
      {
        "level": 45,
        "moveId": "dig"
      },
      {
        "level": 52,
        "moveId": "swift"
      }
    ],
    "evolution": {
      "level": 25,
      "evolvesTo": 75
    },
    "catchRate": 255,
    "baseXP": 60,
    "ascii": "G"
  },
  {
    "id": 75,
    "name": "Graveler",
    "types": [
      "Rock",
      "Ground"
    ],
    "baseStats": {
      "hp": 55,
      "attack": 95,
      "defense": 115,
      "speed": 35,
      "special": 45
    },
    "moves": [
      {
        "level": 1,
        "moveId": "defense-curl"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 29,
        "moveId": "harden"
      },
      {
        "level": 30,
        "moveId": "headbutt"
      },
      {
        "level": 36,
        "moveId": "earthquake"
      },
      {
        "level": 38,
        "moveId": "sand-attack"
      },
      {
        "level": 45,
        "moveId": "dig"
      },
      {
        "level": 52,
        "moveId": "swift"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": 76
    },
    "catchRate": 120,
    "baseXP": 137,
    "ascii": "G"
  },
  {
    "id": 76,
    "name": "Golem",
    "types": [
      "Rock",
      "Ground"
    ],
    "baseStats": {
      "hp": 80,
      "attack": 120,
      "defense": 130,
      "speed": 45,
      "special": 55
    },
    "moves": [
      {
        "level": 1,
        "moveId": "defense-curl"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 29,
        "moveId": "harden"
      },
      {
        "level": 30,
        "moveId": "headbutt"
      },
      {
        "level": 36,
        "moveId": "earthquake"
      },
      {
        "level": 38,
        "moveId": "sand-attack"
      },
      {
        "level": 45,
        "moveId": "dig"
      },
      {
        "level": 52,
        "moveId": "swift"
      }
    ],
    "catchRate": 45,
    "baseXP": 223,
    "ascii": "G"
  },
  {
    "id": 77,
    "name": "Ponyta",
    "types": [
      "Fire"
    ],
    "baseStats": {
      "hp": 50,
      "attack": 85,
      "defense": 55,
      "speed": 90,
      "special": 65
    },
    "moves": [
      {
        "level": 1,
        "moveId": "ember"
      },
      {
        "level": 30,
        "moveId": "smokescreen"
      },
      {
        "level": 30,
        "moveId": "tail-whip"
      },
      {
        "level": 35,
        "moveId": "growl"
      },
      {
        "level": 38,
        "moveId": "flamethrower"
      },
      {
        "level": 45,
        "moveId": "fire-blast"
      },
      {
        "level": 48,
        "moveId": "agility"
      },
      {
        "level": 52,
        "moveId": "tackle"
      }
    ],
    "evolution": {
      "level": 40,
      "evolvesTo": 78
    },
    "catchRate": 190,
    "baseXP": 82,
    "ascii": "P"
  },
  {
    "id": 78,
    "name": "Rapidash",
    "types": [
      "Fire"
    ],
    "baseStats": {
      "hp": 65,
      "attack": 100,
      "defense": 70,
      "speed": 105,
      "special": 80
    },
    "moves": [
      {
        "level": 1,
        "moveId": "ember"
      },
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 30,
        "moveId": "smokescreen"
      },
      {
        "level": 38,
        "moveId": "flamethrower"
      },
      {
        "level": 45,
        "moveId": "fire-blast"
      },
      {
        "level": 52,
        "moveId": "tackle"
      },
      {
        "level": 55,
        "moveId": "agility"
      }
    ],
    "catchRate": 60,
    "baseXP": 175,
    "ascii": "R"
  },
  {
    "id": 79,
    "name": "Slowpoke",
    "types": [
      "Water",
      "Psychic"
    ],
    "baseStats": {
      "hp": 90,
      "attack": 65,
      "defense": 65,
      "speed": 15,
      "special": 40
    },
    "moves": [
      {
        "level": 22,
        "moveId": "headbutt"
      },
      {
        "level": 27,
        "moveId": "growl"
      },
      {
        "level": 30,
        "moveId": "bubble"
      },
      {
        "level": 33,
        "moveId": "water-gun"
      },
      {
        "level": 38,
        "moveId": "bubble-beam"
      },
      {
        "level": 45,
        "moveId": "surf"
      },
      {
        "level": 48,
        "moveId": "psychic"
      },
      {
        "level": 52,
        "moveId": "hypnosis"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": -1
    },
    "catchRate": 190,
    "baseXP": 63,
    "ascii": "S"
  },
  {
    "id": 80,
    "name": "Slowbro",
    "types": [
      "Water",
      "Psychic"
    ],
    "baseStats": {
      "hp": 95,
      "attack": 75,
      "defense": 110,
      "speed": 30,
      "special": 100
    },
    "moves": [
      {
        "level": 1,
        "moveId": "headbutt"
      },
      {
        "level": 27,
        "moveId": "growl"
      },
      {
        "level": 33,
        "moveId": "water-gun"
      },
      {
        "level": 37,
        "moveId": "withdraw"
      },
      {
        "level": 38,
        "moveId": "bubble"
      },
      {
        "level": 45,
        "moveId": "bubble-beam"
      },
      {
        "level": 52,
        "moveId": "surf"
      },
      {
        "level": 55,
        "moveId": "psychic"
      }
    ],
    "catchRate": 75,
    "baseXP": 172,
    "ascii": "S"
  },
  {
    "id": 81,
    "name": "Magnemite",
    "types": [
      "Electric"
    ],
    "baseStats": {
      "hp": 25,
      "attack": 35,
      "defense": 70,
      "speed": 45,
      "special": 95
    },
    "moves": [
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 30,
        "moveId": "thunderbolt"
      },
      {
        "level": 35,
        "moveId": "thunder-wave"
      },
      {
        "level": 38,
        "moveId": "thunder"
      },
      {
        "level": 41,
        "moveId": "swift"
      },
      {
        "level": 45,
        "moveId": "headbutt"
      },
      {
        "level": 47,
        "moveId": "screech"
      },
      {
        "level": 52,
        "moveId": "body-slam"
      }
    ],
    "evolution": {
      "level": 30,
      "evolvesTo": 82
    },
    "catchRate": 190,
    "baseXP": 65,
    "ascii": "M"
  },
  {
    "id": 82,
    "name": "Magneton",
    "types": [
      "Electric"
    ],
    "baseStats": {
      "hp": 50,
      "attack": 60,
      "defense": 95,
      "speed": 70,
      "special": 120
    },
    "moves": [
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 30,
        "moveId": "thunderbolt"
      },
      {
        "level": 38,
        "moveId": "thunder"
      },
      {
        "level": 38,
        "moveId": "thunder-wave"
      },
      {
        "level": 45,
        "moveId": "headbutt"
      },
      {
        "level": 46,
        "moveId": "swift"
      },
      {
        "level": 52,
        "moveId": "body-slam"
      },
      {
        "level": 54,
        "moveId": "screech"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": 462
    },
    "catchRate": 60,
    "baseXP": 163,
    "ascii": "M"
  },
  {
    "id": 83,
    "name": "Farfetchd",
    "types": [
      "Normal",
      "Flying"
    ],
    "baseStats": {
      "hp": 52,
      "attack": 90,
      "defense": 55,
      "speed": 60,
      "special": 58
    },
    "moves": [
      {
        "level": 1,
        "moveId": "sand-attack"
      },
      {
        "level": 7,
        "moveId": "leer"
      },
      {
        "level": 30,
        "moveId": "tackle"
      },
      {
        "level": 31,
        "moveId": "agility"
      },
      {
        "level": 38,
        "moveId": "swift"
      },
      {
        "level": 39,
        "moveId": "slash"
      },
      {
        "level": 45,
        "moveId": "headbutt"
      },
      {
        "level": 52,
        "moveId": "body-slam"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": 865
    },
    "catchRate": 45,
    "baseXP": 132,
    "ascii": "F"
  },
  {
    "id": 84,
    "name": "Doduo",
    "types": [
      "Normal",
      "Flying"
    ],
    "baseStats": {
      "hp": 35,
      "attack": 85,
      "defense": 45,
      "speed": 75,
      "special": 35
    },
    "moves": [
      {
        "level": 15,
        "moveId": "tackle"
      },
      {
        "level": 20,
        "moveId": "growl"
      },
      {
        "level": 22,
        "moveId": "swift"
      },
      {
        "level": 30,
        "moveId": "headbutt"
      },
      {
        "level": 38,
        "moveId": "body-slam"
      },
      {
        "level": 44,
        "moveId": "agility"
      },
      {
        "level": 45,
        "moveId": "double-edge"
      },
      {
        "level": 52,
        "moveId": "gust"
      }
    ],
    "evolution": {
      "level": 31,
      "evolvesTo": 85
    },
    "catchRate": 190,
    "baseXP": 62,
    "ascii": "D"
  },
  {
    "id": 85,
    "name": "Dodrio",
    "types": [
      "Normal",
      "Flying"
    ],
    "baseStats": {
      "hp": 60,
      "attack": 110,
      "defense": 70,
      "speed": 110,
      "special": 60
    },
    "moves": [
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 15,
        "moveId": "tackle"
      },
      {
        "level": 22,
        "moveId": "swift"
      },
      {
        "level": 30,
        "moveId": "headbutt"
      },
      {
        "level": 38,
        "moveId": "body-slam"
      },
      {
        "level": 45,
        "moveId": "double-edge"
      },
      {
        "level": 51,
        "moveId": "agility"
      },
      {
        "level": 52,
        "moveId": "gust"
      }
    ],
    "catchRate": 45,
    "baseXP": 165,
    "ascii": "D"
  },
  {
    "id": 86,
    "name": "Seel",
    "types": [
      "Water"
    ],
    "baseStats": {
      "hp": 65,
      "attack": 45,
      "defense": 55,
      "speed": 45,
      "special": 45
    },
    "moves": [
      {
        "level": 1,
        "moveId": "headbutt"
      },
      {
        "level": 22,
        "moveId": "bubble"
      },
      {
        "level": 30,
        "moveId": "growl"
      },
      {
        "level": 30,
        "moveId": "water-gun"
      },
      {
        "level": 38,
        "moveId": "bubble-beam"
      },
      {
        "level": 45,
        "moveId": "surf"
      },
      {
        "level": 50,
        "moveId": "ice-beam"
      },
      {
        "level": 52,
        "moveId": "tackle"
      }
    ],
    "evolution": {
      "level": 34,
      "evolvesTo": 87
    },
    "catchRate": 190,
    "baseXP": 65,
    "ascii": "S"
  },
  {
    "id": 87,
    "name": "Dewgong",
    "types": [
      "Water",
      "Ice"
    ],
    "baseStats": {
      "hp": 90,
      "attack": 70,
      "defense": 80,
      "speed": 70,
      "special": 70
    },
    "moves": [
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 1,
        "moveId": "headbutt"
      },
      {
        "level": 22,
        "moveId": "bubble"
      },
      {
        "level": 30,
        "moveId": "water-gun"
      },
      {
        "level": 38,
        "moveId": "bubble-beam"
      },
      {
        "level": 45,
        "moveId": "surf"
      },
      {
        "level": 52,
        "moveId": "blizzard"
      },
      {
        "level": 56,
        "moveId": "ice-beam"
      }
    ],
    "catchRate": 75,
    "baseXP": 166,
    "ascii": "D"
  },
  {
    "id": 88,
    "name": "Grimer",
    "types": [
      "Poison"
    ],
    "baseStats": {
      "hp": 80,
      "attack": 80,
      "defense": 50,
      "speed": 25,
      "special": 40
    },
    "moves": [
      {
        "level": 1,
        "moveId": "pound"
      },
      {
        "level": 30,
        "moveId": "poison-sting"
      },
      {
        "level": 37,
        "moveId": "sludge"
      },
      {
        "level": 38,
        "moveId": "acid"
      },
      {
        "level": 42,
        "moveId": "harden"
      },
      {
        "level": 45,
        "moveId": "toxic"
      },
      {
        "level": 48,
        "moveId": "screech"
      },
      {
        "level": 52,
        "moveId": "tackle"
      }
    ],
    "evolution": {
      "level": 38,
      "evolvesTo": 89
    },
    "catchRate": 190,
    "baseXP": 65,
    "ascii": "G"
  },
  {
    "id": 89,
    "name": "Muk",
    "types": [
      "Poison"
    ],
    "baseStats": {
      "hp": 105,
      "attack": 105,
      "defense": 75,
      "speed": 50,
      "special": 65
    },
    "moves": [
      {
        "level": 1,
        "moveId": "pound"
      },
      {
        "level": 30,
        "moveId": "poison-sting"
      },
      {
        "level": 37,
        "moveId": "sludge"
      },
      {
        "level": 38,
        "moveId": "acid"
      },
      {
        "level": 45,
        "moveId": "harden"
      },
      {
        "level": 45,
        "moveId": "toxic"
      },
      {
        "level": 52,
        "moveId": "tackle"
      },
      {
        "level": 53,
        "moveId": "screech"
      }
    ],
    "catchRate": 75,
    "baseXP": 175,
    "ascii": "M"
  },
  {
    "id": 90,
    "name": "Shellder",
    "types": [
      "Water"
    ],
    "baseStats": {
      "hp": 30,
      "attack": 65,
      "defense": 100,
      "speed": 40,
      "special": 45
    },
    "moves": [
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 1,
        "moveId": "withdraw"
      },
      {
        "level": 23,
        "moveId": "clamp"
      },
      {
        "level": 38,
        "moveId": "bubble"
      },
      {
        "level": 39,
        "moveId": "leer"
      },
      {
        "level": 45,
        "moveId": "water-gun"
      },
      {
        "level": 50,
        "moveId": "ice-beam"
      },
      {
        "level": 52,
        "moveId": "bubble-beam"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": -1
    },
    "catchRate": 190,
    "baseXP": 61,
    "ascii": "S"
  },
  {
    "id": 91,
    "name": "Cloyster",
    "types": [
      "Water",
      "Ice"
    ],
    "baseStats": {
      "hp": 50,
      "attack": 95,
      "defense": 180,
      "speed": 70,
      "special": 85
    },
    "moves": [
      {
        "level": 1,
        "moveId": "clamp"
      },
      {
        "level": 1,
        "moveId": "withdraw"
      },
      {
        "level": 15,
        "moveId": "bubble"
      },
      {
        "level": 22,
        "moveId": "water-gun"
      },
      {
        "level": 30,
        "moveId": "bubble-beam"
      },
      {
        "level": 38,
        "moveId": "surf"
      },
      {
        "level": 45,
        "moveId": "headbutt"
      },
      {
        "level": 52,
        "moveId": "ice-beam"
      }
    ],
    "catchRate": 60,
    "baseXP": 184,
    "ascii": "C"
  },
  {
    "id": 92,
    "name": "Gastly",
    "types": [
      "Ghost",
      "Poison"
    ],
    "baseStats": {
      "hp": 30,
      "attack": 35,
      "defense": 30,
      "speed": 80,
      "special": 100
    },
    "moves": [
      {
        "level": 1,
        "moveId": "confuse-ray"
      },
      {
        "level": 1,
        "moveId": "night-shade"
      },
      {
        "level": 27,
        "moveId": "hypnosis"
      },
      {
        "level": 30,
        "moveId": "mean-look"
      },
      {
        "level": 35,
        "moveId": "dream-eater"
      },
      {
        "level": 38,
        "moveId": "poison-sting"
      },
      {
        "level": 45,
        "moveId": "acid"
      },
      {
        "level": 52,
        "moveId": "sludge"
      }
    ],
    "evolution": {
      "level": 25,
      "evolvesTo": 93
    },
    "catchRate": 190,
    "baseXP": 62,
    "ascii": "G"
  },
  {
    "id": 93,
    "name": "Haunter",
    "types": [
      "Ghost",
      "Poison"
    ],
    "baseStats": {
      "hp": 45,
      "attack": 50,
      "defense": 45,
      "speed": 95,
      "special": 115
    },
    "moves": [
      {
        "level": 1,
        "moveId": "confuse-ray"
      },
      {
        "level": 1,
        "moveId": "night-shade"
      },
      {
        "level": 29,
        "moveId": "hypnosis"
      },
      {
        "level": 30,
        "moveId": "mean-look"
      },
      {
        "level": 38,
        "moveId": "dream-eater"
      },
      {
        "level": 38,
        "moveId": "poison-sting"
      },
      {
        "level": 45,
        "moveId": "acid"
      },
      {
        "level": 52,
        "moveId": "sludge"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": 94
    },
    "catchRate": 90,
    "baseXP": 142,
    "ascii": "H"
  },
  {
    "id": 94,
    "name": "Gengar",
    "types": [
      "Ghost",
      "Poison"
    ],
    "baseStats": {
      "hp": 60,
      "attack": 65,
      "defense": 60,
      "speed": 110,
      "special": 130
    },
    "moves": [
      {
        "level": 1,
        "moveId": "confuse-ray"
      },
      {
        "level": 1,
        "moveId": "night-shade"
      },
      {
        "level": 29,
        "moveId": "hypnosis"
      },
      {
        "level": 30,
        "moveId": "mean-look"
      },
      {
        "level": 38,
        "moveId": "dream-eater"
      },
      {
        "level": 38,
        "moveId": "poison-sting"
      },
      {
        "level": 45,
        "moveId": "acid"
      },
      {
        "level": 52,
        "moveId": "sludge"
      }
    ],
    "catchRate": 45,
    "baseXP": 225,
    "ascii": "G"
  },
  {
    "id": 95,
    "name": "Onix",
    "types": [
      "Rock",
      "Ground"
    ],
    "baseStats": {
      "hp": 35,
      "attack": 45,
      "defense": 160,
      "speed": 70,
      "special": 30
    },
    "moves": [
      {
        "level": 1,
        "moveId": "screech"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 22,
        "moveId": "defense-curl"
      },
      {
        "level": 30,
        "moveId": "headbutt"
      },
      {
        "level": 38,
        "moveId": "earthquake"
      },
      {
        "level": 43,
        "moveId": "harden"
      },
      {
        "level": 45,
        "moveId": "sand-attack"
      },
      {
        "level": 52,
        "moveId": "dig"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": 208
    },
    "catchRate": 45,
    "baseXP": 77,
    "ascii": "O"
  },
  {
    "id": 96,
    "name": "Drowzee",
    "types": [
      "Psychic"
    ],
    "baseStats": {
      "hp": 60,
      "attack": 48,
      "defense": 45,
      "speed": 42,
      "special": 43
    },
    "moves": [
      {
        "level": 1,
        "moveId": "hypnosis"
      },
      {
        "level": 1,
        "moveId": "pound"
      },
      {
        "level": 24,
        "moveId": "headbutt"
      },
      {
        "level": 32,
        "moveId": "psychic"
      },
      {
        "level": 37,
        "moveId": "meditate"
      },
      {
        "level": 38,
        "moveId": "confuse-ray"
      },
      {
        "level": 45,
        "moveId": "dream-eater"
      },
      {
        "level": 52,
        "moveId": "tackle"
      }
    ],
    "evolution": {
      "level": 26,
      "evolvesTo": 97
    },
    "catchRate": 190,
    "baseXP": 66,
    "ascii": "D"
  },
  {
    "id": 97,
    "name": "Hypno",
    "types": [
      "Psychic"
    ],
    "baseStats": {
      "hp": 85,
      "attack": 73,
      "defense": 70,
      "speed": 67,
      "special": 73
    },
    "moves": [
      {
        "level": 1,
        "moveId": "hypnosis"
      },
      {
        "level": 1,
        "moveId": "pound"
      },
      {
        "level": 24,
        "moveId": "headbutt"
      },
      {
        "level": 37,
        "moveId": "psychic"
      },
      {
        "level": 38,
        "moveId": "confuse-ray"
      },
      {
        "level": 43,
        "moveId": "meditate"
      },
      {
        "level": 45,
        "moveId": "dream-eater"
      },
      {
        "level": 52,
        "moveId": "tackle"
      }
    ],
    "catchRate": 75,
    "baseXP": 169,
    "ascii": "H"
  },
  {
    "id": 98,
    "name": "Krabby",
    "types": [
      "Water"
    ],
    "baseStats": {
      "hp": 30,
      "attack": 105,
      "defense": 90,
      "speed": 50,
      "special": 25
    },
    "moves": [
      {
        "level": 1,
        "moveId": "bubble"
      },
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 22,
        "moveId": "water-gun"
      },
      {
        "level": 30,
        "moveId": "bubble-beam"
      },
      {
        "level": 38,
        "moveId": "surf"
      },
      {
        "level": 40,
        "moveId": "harden"
      },
      {
        "level": 45,
        "moveId": "tackle"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "evolution": {
      "level": 28,
      "evolvesTo": 99
    },
    "catchRate": 225,
    "baseXP": 65,
    "ascii": "K"
  },
  {
    "id": 99,
    "name": "Kingler",
    "types": [
      "Water"
    ],
    "baseStats": {
      "hp": 55,
      "attack": 130,
      "defense": 115,
      "speed": 75,
      "special": 50
    },
    "moves": [
      {
        "level": 1,
        "moveId": "bubble"
      },
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 22,
        "moveId": "water-gun"
      },
      {
        "level": 30,
        "moveId": "bubble-beam"
      },
      {
        "level": 38,
        "moveId": "surf"
      },
      {
        "level": 45,
        "moveId": "tackle"
      },
      {
        "level": 49,
        "moveId": "harden"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "catchRate": 60,
    "baseXP": 166,
    "ascii": "K"
  },
  {
    "id": 100,
    "name": "Voltorb",
    "types": [
      "Electric"
    ],
    "baseStats": {
      "hp": 40,
      "attack": 30,
      "defense": 50,
      "speed": 100,
      "special": 55
    },
    "moves": [
      {
        "level": 1,
        "moveId": "screech"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 22,
        "moveId": "thunder-wave"
      },
      {
        "level": 30,
        "moveId": "thunderbolt"
      },
      {
        "level": 36,
        "moveId": "swift"
      },
      {
        "level": 38,
        "moveId": "thunder"
      },
      {
        "level": 45,
        "moveId": "headbutt"
      },
      {
        "level": 52,
        "moveId": "body-slam"
      }
    ],
    "evolution": {
      "level": 30,
      "evolvesTo": 101
    },
    "catchRate": 190,
    "baseXP": 66,
    "ascii": "V"
  },
  {
    "id": 101,
    "name": "Electrode",
    "types": [
      "Electric"
    ],
    "baseStats": {
      "hp": 60,
      "attack": 50,
      "defense": 70,
      "speed": 150,
      "special": 80
    },
    "moves": [
      {
        "level": 1,
        "moveId": "screech"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 22,
        "moveId": "thunder-wave"
      },
      {
        "level": 30,
        "moveId": "thunderbolt"
      },
      {
        "level": 38,
        "moveId": "thunder"
      },
      {
        "level": 40,
        "moveId": "swift"
      },
      {
        "level": 45,
        "moveId": "headbutt"
      },
      {
        "level": 52,
        "moveId": "body-slam"
      }
    ],
    "catchRate": 60,
    "baseXP": 172,
    "ascii": "E"
  },
  {
    "id": 102,
    "name": "Exeggcute",
    "types": [
      "Grass",
      "Psychic"
    ],
    "baseStats": {
      "hp": 60,
      "attack": 40,
      "defense": 80,
      "speed": 40,
      "special": 60
    },
    "moves": [
      {
        "level": 1,
        "moveId": "hypnosis"
      },
      {
        "level": 22,
        "moveId": "growl"
      },
      {
        "level": 28,
        "moveId": "leech-seed"
      },
      {
        "level": 30,
        "moveId": "vine-whip"
      },
      {
        "level": 38,
        "moveId": "razor-leaf"
      },
      {
        "level": 42,
        "moveId": "solar-beam"
      },
      {
        "level": 45,
        "moveId": "confuse-ray"
      },
      {
        "level": 52,
        "moveId": "psychic"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": -1
    },
    "catchRate": 90,
    "baseXP": 65,
    "ascii": "E"
  },
  {
    "id": 103,
    "name": "Exeggutor",
    "types": [
      "Grass",
      "Psychic"
    ],
    "baseStats": {
      "hp": 95,
      "attack": 95,
      "defense": 85,
      "speed": 55,
      "special": 125
    },
    "moves": [
      {
        "level": 1,
        "moveId": "hypnosis"
      },
      {
        "level": 8,
        "moveId": "growl"
      },
      {
        "level": 15,
        "moveId": "vine-whip"
      },
      {
        "level": 22,
        "moveId": "leech-seed"
      },
      {
        "level": 30,
        "moveId": "razor-leaf"
      },
      {
        "level": 38,
        "moveId": "solar-beam"
      },
      {
        "level": 45,
        "moveId": "confuse-ray"
      },
      {
        "level": 52,
        "moveId": "psychic"
      }
    ],
    "catchRate": 45,
    "baseXP": 186,
    "ascii": "E"
  },
  {
    "id": 104,
    "name": "Cubone",
    "types": [
      "Ground"
    ],
    "baseStats": {
      "hp": 50,
      "attack": 50,
      "defense": 95,
      "speed": 35,
      "special": 40
    },
    "moves": [
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 13,
        "moveId": "tail-whip"
      },
      {
        "level": 18,
        "moveId": "headbutt"
      },
      {
        "level": 25,
        "moveId": "leer"
      },
      {
        "level": 31,
        "moveId": "focus-energy"
      },
      {
        "level": 38,
        "moveId": "sand-attack"
      },
      {
        "level": 45,
        "moveId": "dig"
      },
      {
        "level": 52,
        "moveId": "earthquake"
      }
    ],
    "evolution": {
      "level": 28,
      "evolvesTo": 105
    },
    "catchRate": 190,
    "baseXP": 64,
    "ascii": "C"
  },
  {
    "id": 105,
    "name": "Marowak",
    "types": [
      "Ground"
    ],
    "baseStats": {
      "hp": 60,
      "attack": 80,
      "defense": 110,
      "speed": 45,
      "special": 50
    },
    "moves": [
      {
        "level": 1,
        "moveId": "focus-energy"
      },
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 18,
        "moveId": "headbutt"
      },
      {
        "level": 38,
        "moveId": "sand-attack"
      },
      {
        "level": 45,
        "moveId": "dig"
      },
      {
        "level": 52,
        "moveId": "earthquake"
      }
    ],
    "catchRate": 75,
    "baseXP": 149,
    "ascii": "M"
  },
  {
    "id": 106,
    "name": "Hitmonlee",
    "types": [
      "Fighting"
    ],
    "baseStats": {
      "hp": 50,
      "attack": 120,
      "defense": 53,
      "speed": 87,
      "special": 35
    },
    "moves": [
      {
        "level": 1,
        "moveId": "meditate"
      },
      {
        "level": 15,
        "moveId": "karate-chop"
      },
      {
        "level": 22,
        "moveId": "headbutt"
      },
      {
        "level": 30,
        "moveId": "tackle"
      },
      {
        "level": 38,
        "moveId": "swift"
      },
      {
        "level": 43,
        "moveId": "focus-energy"
      },
      {
        "level": 45,
        "moveId": "body-slam"
      }
    ],
    "catchRate": 45,
    "baseXP": 159,
    "ascii": "H"
  },
  {
    "id": 107,
    "name": "Hitmonchan",
    "types": [
      "Fighting"
    ],
    "baseStats": {
      "hp": 50,
      "attack": 105,
      "defense": 79,
      "speed": 76,
      "special": 35
    },
    "moves": [
      {
        "level": 1,
        "moveId": "agility"
      },
      {
        "level": 8,
        "moveId": "karate-chop"
      },
      {
        "level": 15,
        "moveId": "meditate"
      },
      {
        "level": 22,
        "moveId": "focus-energy"
      },
      {
        "level": 30,
        "moveId": "headbutt"
      },
      {
        "level": 38,
        "moveId": "tackle"
      },
      {
        "level": 45,
        "moveId": "swift"
      },
      {
        "level": 52,
        "moveId": "body-slam"
      }
    ],
    "catchRate": 45,
    "baseXP": 159,
    "ascii": "H"
  },
  {
    "id": 108,
    "name": "Lickitung",
    "types": [
      "Normal"
    ],
    "baseStats": {
      "hp": 90,
      "attack": 55,
      "defense": 75,
      "speed": 30,
      "special": 60
    },
    "moves": [
      {
        "level": 1,
        "moveId": "wrap"
      },
      {
        "level": 22,
        "moveId": "tackle"
      },
      {
        "level": 23,
        "moveId": "defense-curl"
      },
      {
        "level": 30,
        "moveId": "swift"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 39,
        "moveId": "screech"
      },
      {
        "level": 45,
        "moveId": "body-slam"
      },
      {
        "level": 52,
        "moveId": "double-edge"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": 463
    },
    "catchRate": 45,
    "baseXP": 77,
    "ascii": "L"
  },
  {
    "id": 109,
    "name": "Koffing",
    "types": [
      "Poison"
    ],
    "baseStats": {
      "hp": 40,
      "attack": 65,
      "defense": 95,
      "speed": 35,
      "special": 60
    },
    "moves": [
      {
        "level": 1,
        "moveId": "smog"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 30,
        "moveId": "poison-sting"
      },
      {
        "level": 32,
        "moveId": "sludge"
      },
      {
        "level": 37,
        "moveId": "smokescreen"
      },
      {
        "level": 38,
        "moveId": "acid"
      },
      {
        "level": 45,
        "moveId": "toxic"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "evolution": {
      "level": 35,
      "evolvesTo": 110
    },
    "catchRate": 190,
    "baseXP": 68,
    "ascii": "K"
  },
  {
    "id": 110,
    "name": "Weezing",
    "types": [
      "Poison"
    ],
    "baseStats": {
      "hp": 65,
      "attack": 90,
      "defense": 120,
      "speed": 60,
      "special": 85
    },
    "moves": [
      {
        "level": 1,
        "moveId": "sludge"
      },
      {
        "level": 1,
        "moveId": "smog"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 30,
        "moveId": "poison-sting"
      },
      {
        "level": 38,
        "moveId": "acid"
      },
      {
        "level": 39,
        "moveId": "smokescreen"
      },
      {
        "level": 45,
        "moveId": "toxic"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "catchRate": 60,
    "baseXP": 172,
    "ascii": "W"
  },
  {
    "id": 111,
    "name": "Rhyhorn",
    "types": [
      "Ground",
      "Rock"
    ],
    "baseStats": {
      "hp": 80,
      "attack": 85,
      "defense": 95,
      "speed": 25,
      "special": 30
    },
    "moves": [
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 15,
        "moveId": "sand-attack"
      },
      {
        "level": 22,
        "moveId": "dig"
      },
      {
        "level": 30,
        "moveId": "earthquake"
      },
      {
        "level": 38,
        "moveId": "harden"
      },
      {
        "level": 45,
        "moveId": "defense-curl"
      },
      {
        "level": 50,
        "moveId": "leer"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "evolution": {
      "level": 42,
      "evolvesTo": 112
    },
    "catchRate": 120,
    "baseXP": 69,
    "ascii": "R"
  },
  {
    "id": 112,
    "name": "Rhydon",
    "types": [
      "Ground",
      "Rock"
    ],
    "baseStats": {
      "hp": 105,
      "attack": 130,
      "defense": 120,
      "speed": 40,
      "special": 45
    },
    "moves": [
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 15,
        "moveId": "sand-attack"
      },
      {
        "level": 22,
        "moveId": "dig"
      },
      {
        "level": 30,
        "moveId": "earthquake"
      },
      {
        "level": 38,
        "moveId": "harden"
      },
      {
        "level": 45,
        "moveId": "defense-curl"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      },
      {
        "level": 55,
        "moveId": "leer"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": 464
    },
    "catchRate": 60,
    "baseXP": 170,
    "ascii": "R"
  },
  {
    "id": 113,
    "name": "Chansey",
    "types": [
      "Normal"
    ],
    "baseStats": {
      "hp": 250,
      "attack": 5,
      "defense": 5,
      "speed": 50,
      "special": 35
    },
    "moves": [
      {
        "level": 1,
        "moveId": "pound"
      },
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 30,
        "moveId": "growl"
      },
      {
        "level": 38,
        "moveId": "tackle"
      },
      {
        "level": 44,
        "moveId": "defense-curl"
      },
      {
        "level": 45,
        "moveId": "swift"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      },
      {
        "level": 54,
        "moveId": "double-edge"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": 242
    },
    "catchRate": 30,
    "baseXP": 395,
    "ascii": "C"
  },
  {
    "id": 114,
    "name": "Tangela",
    "types": [
      "Grass"
    ],
    "baseStats": {
      "hp": 65,
      "attack": 55,
      "defense": 115,
      "speed": 60,
      "special": 100
    },
    "moves": [
      {
        "level": 8,
        "moveId": "growl"
      },
      {
        "level": 15,
        "moveId": "leech-seed"
      },
      {
        "level": 22,
        "moveId": "razor-leaf"
      },
      {
        "level": 29,
        "moveId": "vine-whip"
      },
      {
        "level": 30,
        "moveId": "solar-beam"
      },
      {
        "level": 38,
        "moveId": "tackle"
      },
      {
        "level": 45,
        "moveId": "headbutt"
      },
      {
        "level": 52,
        "moveId": "swift"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": 465
    },
    "catchRate": 45,
    "baseXP": 87,
    "ascii": "T"
  },
  {
    "id": 115,
    "name": "Kangaskhan",
    "types": [
      "Normal"
    ],
    "baseStats": {
      "hp": 105,
      "attack": 95,
      "defense": 80,
      "speed": 90,
      "special": 40
    },
    "moves": [
      {
        "level": 22,
        "moveId": "tackle"
      },
      {
        "level": 26,
        "moveId": "bite"
      },
      {
        "level": 30,
        "moveId": "swift"
      },
      {
        "level": 31,
        "moveId": "tail-whip"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 41,
        "moveId": "leer"
      },
      {
        "level": 45,
        "moveId": "body-slam"
      },
      {
        "level": 52,
        "moveId": "double-edge"
      }
    ],
    "catchRate": 45,
    "baseXP": 172,
    "ascii": "K"
  },
  {
    "id": 116,
    "name": "Horsea",
    "types": [
      "Water"
    ],
    "baseStats": {
      "hp": 30,
      "attack": 40,
      "defense": 70,
      "speed": 60,
      "special": 70
    },
    "moves": [
      {
        "level": 1,
        "moveId": "bubble"
      },
      {
        "level": 19,
        "moveId": "smokescreen"
      },
      {
        "level": 24,
        "moveId": "leer"
      },
      {
        "level": 30,
        "moveId": "water-gun"
      },
      {
        "level": 37,
        "moveId": "agility"
      },
      {
        "level": 38,
        "moveId": "bubble-beam"
      },
      {
        "level": 45,
        "moveId": "surf"
      },
      {
        "level": 52,
        "moveId": "tackle"
      }
    ],
    "evolution": {
      "level": 32,
      "evolvesTo": 117
    },
    "catchRate": 225,
    "baseXP": 59,
    "ascii": "H"
  },
  {
    "id": 117,
    "name": "Seadra",
    "types": [
      "Water"
    ],
    "baseStats": {
      "hp": 55,
      "attack": 65,
      "defense": 95,
      "speed": 85,
      "special": 95
    },
    "moves": [
      {
        "level": 1,
        "moveId": "bubble"
      },
      {
        "level": 1,
        "moveId": "smokescreen"
      },
      {
        "level": 24,
        "moveId": "leer"
      },
      {
        "level": 30,
        "moveId": "water-gun"
      },
      {
        "level": 38,
        "moveId": "bubble-beam"
      },
      {
        "level": 41,
        "moveId": "agility"
      },
      {
        "level": 45,
        "moveId": "surf"
      },
      {
        "level": 52,
        "moveId": "tackle"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": 230
    },
    "catchRate": 75,
    "baseXP": 154,
    "ascii": "S"
  },
  {
    "id": 118,
    "name": "Goldeen",
    "types": [
      "Water"
    ],
    "baseStats": {
      "hp": 45,
      "attack": 67,
      "defense": 60,
      "speed": 63,
      "special": 35
    },
    "moves": [
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 15,
        "moveId": "bubble"
      },
      {
        "level": 22,
        "moveId": "water-gun"
      },
      {
        "level": 30,
        "moveId": "bubble-beam"
      },
      {
        "level": 38,
        "moveId": "surf"
      },
      {
        "level": 45,
        "moveId": "tackle"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      },
      {
        "level": 54,
        "moveId": "agility"
      }
    ],
    "evolution": {
      "level": 33,
      "evolvesTo": 119
    },
    "catchRate": 225,
    "baseXP": 64,
    "ascii": "G"
  },
  {
    "id": 119,
    "name": "Seaking",
    "types": [
      "Water"
    ],
    "baseStats": {
      "hp": 80,
      "attack": 92,
      "defense": 65,
      "speed": 68,
      "special": 65
    },
    "moves": [
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 15,
        "moveId": "bubble"
      },
      {
        "level": 22,
        "moveId": "water-gun"
      },
      {
        "level": 30,
        "moveId": "bubble-beam"
      },
      {
        "level": 38,
        "moveId": "surf"
      },
      {
        "level": 45,
        "moveId": "tackle"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      },
      {
        "level": 54,
        "moveId": "agility"
      }
    ],
    "catchRate": 60,
    "baseXP": 158,
    "ascii": "S"
  },
  {
    "id": 120,
    "name": "Staryu",
    "types": [
      "Water"
    ],
    "baseStats": {
      "hp": 30,
      "attack": 45,
      "defense": 55,
      "speed": 85,
      "special": 70
    },
    "moves": [
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 17,
        "moveId": "water-gun"
      },
      {
        "level": 22,
        "moveId": "harden"
      },
      {
        "level": 30,
        "moveId": "bubble"
      },
      {
        "level": 32,
        "moveId": "swift"
      },
      {
        "level": 38,
        "moveId": "bubble-beam"
      },
      {
        "level": 45,
        "moveId": "surf"
      },
      {
        "level": 52,
        "moveId": "headbutt"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": -1
    },
    "catchRate": 225,
    "baseXP": 68,
    "ascii": "S"
  },
  {
    "id": 121,
    "name": "Starmie",
    "types": [
      "Water",
      "Psychic"
    ],
    "baseStats": {
      "hp": 60,
      "attack": 75,
      "defense": 85,
      "speed": 115,
      "special": 100
    },
    "moves": [
      {
        "level": 1,
        "moveId": "harden"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 1,
        "moveId": "water-gun"
      },
      {
        "level": 22,
        "moveId": "bubble"
      },
      {
        "level": 30,
        "moveId": "bubble-beam"
      },
      {
        "level": 38,
        "moveId": "surf"
      },
      {
        "level": 45,
        "moveId": "hypnosis"
      },
      {
        "level": 52,
        "moveId": "confuse-ray"
      }
    ],
    "catchRate": 60,
    "baseXP": 182,
    "ascii": "S"
  },
  {
    "id": 122,
    "name": "Mr. Mime",
    "types": [
      "Psychic"
    ],
    "baseStats": {
      "hp": 40,
      "attack": 45,
      "defense": 65,
      "speed": 90,
      "special": 100
    },
    "moves": [
      {
        "level": 8,
        "moveId": "hypnosis"
      },
      {
        "level": 15,
        "moveId": "confuse-ray"
      },
      {
        "level": 22,
        "moveId": "psychic"
      },
      {
        "level": 30,
        "moveId": "dream-eater"
      },
      {
        "level": 38,
        "moveId": "tackle"
      },
      {
        "level": 39,
        "moveId": "meditate"
      },
      {
        "level": 45,
        "moveId": "headbutt"
      },
      {
        "level": 52,
        "moveId": "swift"
      }
    ],
    "evolution": {
      "level": 42,
      "evolvesTo": 866
    },
    "catchRate": 45,
    "baseXP": 161,
    "ascii": "M"
  },
  {
    "id": 123,
    "name": "Scyther",
    "types": [
      "Bug",
      "Flying"
    ],
    "baseStats": {
      "hp": 70,
      "attack": 110,
      "defense": 80,
      "speed": 105,
      "special": 55
    },
    "moves": [
      {
        "level": 1,
        "moveId": "quick-attack"
      },
      {
        "level": 17,
        "moveId": "leer"
      },
      {
        "level": 20,
        "moveId": "focus-energy"
      },
      {
        "level": 29,
        "moveId": "slash"
      },
      {
        "level": 42,
        "moveId": "agility"
      },
      {
        "level": 45,
        "moveId": "string-shot"
      },
      {
        "level": 50,
        "moveId": "wing-attack"
      },
      {
        "level": 52,
        "moveId": "poison-sting"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": -1
    },
    "catchRate": 45,
    "baseXP": 100,
    "ascii": "S"
  },
  {
    "id": 124,
    "name": "Jynx",
    "types": [
      "Ice",
      "Psychic"
    ],
    "baseStats": {
      "hp": 65,
      "attack": 50,
      "defense": 35,
      "speed": 95,
      "special": 115
    },
    "moves": [
      {
        "level": 1,
        "moveId": "pound"
      },
      {
        "level": 22,
        "moveId": "headbutt"
      },
      {
        "level": 30,
        "moveId": "ice-beam"
      },
      {
        "level": 38,
        "moveId": "hypnosis"
      },
      {
        "level": 39,
        "moveId": "body-slam"
      },
      {
        "level": 45,
        "moveId": "confuse-ray"
      },
      {
        "level": 52,
        "moveId": "psychic"
      },
      {
        "level": 58,
        "moveId": "blizzard"
      }
    ],
    "catchRate": 45,
    "baseXP": 159,
    "ascii": "J"
  },
  {
    "id": 125,
    "name": "Electabuzz",
    "types": [
      "Electric"
    ],
    "baseStats": {
      "hp": 65,
      "attack": 83,
      "defense": 57,
      "speed": 105,
      "special": 95
    },
    "moves": [
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 1,
        "moveId": "quick-attack"
      },
      {
        "level": 30,
        "moveId": "thunder-wave"
      },
      {
        "level": 37,
        "moveId": "screech"
      },
      {
        "level": 38,
        "moveId": "swift"
      },
      {
        "level": 45,
        "moveId": "thunderbolt"
      },
      {
        "level": 52,
        "moveId": "tackle"
      },
      {
        "level": 54,
        "moveId": "thunder"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": 466
    },
    "catchRate": 45,
    "baseXP": 172,
    "ascii": "E"
  },
  {
    "id": 126,
    "name": "Magmar",
    "types": [
      "Fire"
    ],
    "baseStats": {
      "hp": 65,
      "attack": 95,
      "defense": 57,
      "speed": 93,
      "special": 100
    },
    "moves": [
      {
        "level": 1,
        "moveId": "ember"
      },
      {
        "level": 36,
        "moveId": "leer"
      },
      {
        "level": 39,
        "moveId": "confuse-ray"
      },
      {
        "level": 45,
        "moveId": "fire-blast"
      },
      {
        "level": 48,
        "moveId": "smokescreen"
      },
      {
        "level": 52,
        "moveId": "smog"
      },
      {
        "level": 52,
        "moveId": "tackle"
      },
      {
        "level": 55,
        "moveId": "flamethrower"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": 467
    },
    "catchRate": 45,
    "baseXP": 173,
    "ascii": "M"
  },
  {
    "id": 127,
    "name": "Pinsir",
    "types": [
      "Bug"
    ],
    "baseStats": {
      "hp": 65,
      "attack": 125,
      "defense": 100,
      "speed": 85,
      "special": 55
    },
    "moves": [
      {
        "level": 22,
        "moveId": "string-shot"
      },
      {
        "level": 30,
        "moveId": "poison-sting"
      },
      {
        "level": 36,
        "moveId": "focus-energy"
      },
      {
        "level": 38,
        "moveId": "leech-seed"
      },
      {
        "level": 43,
        "moveId": "harden"
      },
      {
        "level": 45,
        "moveId": "headbutt"
      },
      {
        "level": 49,
        "moveId": "slash"
      },
      {
        "level": 52,
        "moveId": "tackle"
      }
    ],
    "catchRate": 45,
    "baseXP": 175,
    "ascii": "P"
  },
  {
    "id": 128,
    "name": "Tauros",
    "types": [
      "Normal"
    ],
    "baseStats": {
      "hp": 75,
      "attack": 100,
      "defense": 95,
      "speed": 110,
      "special": 40
    },
    "moves": [
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 22,
        "moveId": "swift"
      },
      {
        "level": 28,
        "moveId": "tail-whip"
      },
      {
        "level": 30,
        "moveId": "headbutt"
      },
      {
        "level": 35,
        "moveId": "leer"
      },
      {
        "level": 38,
        "moveId": "body-slam"
      },
      {
        "level": 45,
        "moveId": "double-edge"
      }
    ],
    "catchRate": 45,
    "baseXP": 172,
    "ascii": "T"
  },
  {
    "id": 129,
    "name": "Magikarp",
    "types": [
      "Water"
    ],
    "baseStats": {
      "hp": 20,
      "attack": 10,
      "defense": 55,
      "speed": 80,
      "special": 15
    },
    "moves": [
      {
        "level": 8,
        "moveId": "bubble"
      },
      {
        "level": 15,
        "moveId": "tackle"
      },
      {
        "level": 15,
        "moveId": "water-gun"
      },
      {
        "level": 22,
        "moveId": "bubble-beam"
      },
      {
        "level": 30,
        "moveId": "surf"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 45,
        "moveId": "swift"
      },
      {
        "level": 52,
        "moveId": "body-slam"
      }
    ],
    "evolution": {
      "level": 20,
      "evolvesTo": 130
    },
    "catchRate": 255,
    "baseXP": 40,
    "ascii": "M"
  },
  {
    "id": 130,
    "name": "Gyarados",
    "types": [
      "Water",
      "Flying"
    ],
    "baseStats": {
      "hp": 95,
      "attack": 125,
      "defense": 79,
      "speed": 81,
      "special": 60
    },
    "moves": [
      {
        "level": 1,
        "moveId": "bite"
      },
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 30,
        "moveId": "bubble"
      },
      {
        "level": 38,
        "moveId": "water-gun"
      },
      {
        "level": 45,
        "moveId": "bubble-beam"
      },
      {
        "level": 52,
        "moveId": "hyper-beam"
      },
      {
        "level": 52,
        "moveId": "surf"
      }
    ],
    "catchRate": 45,
    "baseXP": 189,
    "ascii": "G"
  },
  {
    "id": 131,
    "name": "Lapras",
    "types": [
      "Water",
      "Ice"
    ],
    "baseStats": {
      "hp": 130,
      "attack": 85,
      "defense": 80,
      "speed": 60,
      "special": 85
    },
    "moves": [
      {
        "level": 1,
        "moveId": "growl"
      },
      {
        "level": 1,
        "moveId": "water-gun"
      },
      {
        "level": 25,
        "moveId": "body-slam"
      },
      {
        "level": 31,
        "moveId": "confuse-ray"
      },
      {
        "level": 38,
        "moveId": "bubble"
      },
      {
        "level": 38,
        "moveId": "ice-beam"
      },
      {
        "level": 45,
        "moveId": "bubble-beam"
      },
      {
        "level": 52,
        "moveId": "surf"
      }
    ],
    "catchRate": 45,
    "baseXP": 187,
    "ascii": "L"
  },
  {
    "id": 132,
    "name": "Ditto",
    "types": [
      "Normal"
    ],
    "baseStats": {
      "hp": 48,
      "attack": 48,
      "defense": 48,
      "speed": 48,
      "special": 48
    },
    "moves": [
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 8,
        "moveId": "swift"
      },
      {
        "level": 15,
        "moveId": "headbutt"
      },
      {
        "level": 22,
        "moveId": "body-slam"
      },
      {
        "level": 30,
        "moveId": "double-edge"
      }
    ],
    "catchRate": 35,
    "baseXP": 101,
    "ascii": "D"
  },
  {
    "id": 133,
    "name": "Eevee",
    "types": [
      "Normal"
    ],
    "baseStats": {
      "hp": 55,
      "attack": 55,
      "defense": 50,
      "speed": 55,
      "special": 45
    },
    "moves": [
      {
        "level": 1,
        "moveId": "sand-attack"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 16,
        "moveId": "growl"
      },
      {
        "level": 23,
        "moveId": "quick-attack"
      },
      {
        "level": 30,
        "moveId": "bite"
      },
      {
        "level": 36,
        "moveId": "focus-energy"
      },
      {
        "level": 52,
        "moveId": "swift"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": -1
    },
    "catchRate": 45,
    "baseXP": 65,
    "ascii": "E"
  },
  {
    "id": 134,
    "name": "Vaporeon",
    "types": [
      "Water"
    ],
    "baseStats": {
      "hp": 130,
      "attack": 65,
      "defense": 60,
      "speed": 65,
      "special": 110
    },
    "moves": [
      {
        "level": 1,
        "moveId": "quick-attack"
      },
      {
        "level": 1,
        "moveId": "sand-attack"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 1,
        "moveId": "water-gun"
      },
      {
        "level": 30,
        "moveId": "bite"
      },
      {
        "level": 45,
        "moveId": "bubble"
      },
      {
        "level": 52,
        "moveId": "bubble-beam"
      }
    ],
    "catchRate": 45,
    "baseXP": 184,
    "ascii": "V"
  },
  {
    "id": 135,
    "name": "Jolteon",
    "types": [
      "Electric"
    ],
    "baseStats": {
      "hp": 65,
      "attack": 65,
      "defense": 60,
      "speed": 130,
      "special": 110
    },
    "moves": [
      {
        "level": 1,
        "moveId": "quick-attack"
      },
      {
        "level": 1,
        "moveId": "sand-attack"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 40,
        "moveId": "thunder-wave"
      },
      {
        "level": 44,
        "moveId": "agility"
      },
      {
        "level": 52,
        "moveId": "swift"
      },
      {
        "level": 52,
        "moveId": "thunder"
      }
    ],
    "catchRate": 45,
    "baseXP": 184,
    "ascii": "J"
  },
  {
    "id": 136,
    "name": "Flareon",
    "types": [
      "Fire"
    ],
    "baseStats": {
      "hp": 65,
      "attack": 130,
      "defense": 60,
      "speed": 65,
      "special": 95
    },
    "moves": [
      {
        "level": 1,
        "moveId": "ember"
      },
      {
        "level": 1,
        "moveId": "quick-attack"
      },
      {
        "level": 1,
        "moveId": "sand-attack"
      },
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 1,
        "moveId": "tail-whip"
      },
      {
        "level": 30,
        "moveId": "bite"
      },
      {
        "level": 42,
        "moveId": "leer"
      },
      {
        "level": 42,
        "moveId": "smog"
      }
    ],
    "catchRate": 45,
    "baseXP": 184,
    "ascii": "F"
  },
  {
    "id": 137,
    "name": "Porygon",
    "types": [
      "Normal"
    ],
    "baseStats": {
      "hp": 65,
      "attack": 60,
      "defense": 70,
      "speed": 40,
      "special": 85
    },
    "moves": [
      {
        "level": 1,
        "moveId": "tackle"
      },
      {
        "level": 15,
        "moveId": "swift"
      },
      {
        "level": 22,
        "moveId": "headbutt"
      },
      {
        "level": 30,
        "moveId": "body-slam"
      },
      {
        "level": 35,
        "moveId": "agility"
      },
      {
        "level": 38,
        "moveId": "double-edge"
      }
    ],
    "evolution": {
      "level": 0,
      "evolvesTo": 233
    },
    "catchRate": 45,
    "baseXP": 79,
    "ascii": "P"
  },
  {
    "id": 138,
    "name": "Omanyte",
    "types": [
      "Rock",
      "Water"
    ],
    "baseStats": {
      "hp": 35,
      "attack": 40,
      "defense": 100,
      "speed": 35,
      "special": 90
    },
    "moves": [
      {
        "level": 1,
        "moveId": "water-gun"
      },
      {
        "level": 1,
        "moveId": "withdraw"
      },
      {
        "level": 22,
        "moveId": "harden"
      },
      {
        "level": 30,
        "moveId": "defense-curl"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 39,
        "moveId": "leer"
      },
      {
        "level": 45,
        "moveId": "earthquake"
      },
      {
        "level": 52,
        "moveId": "bubble"
      }
    ],
    "evolution": {
      "level": 40,
      "evolvesTo": 139
    },
    "catchRate": 45,
    "baseXP": 71,
    "ascii": "O"
  },
  {
    "id": 139,
    "name": "Omastar",
    "types": [
      "Rock",
      "Water"
    ],
    "baseStats": {
      "hp": 70,
      "attack": 60,
      "defense": 125,
      "speed": 55,
      "special": 115
    },
    "moves": [
      {
        "level": 1,
        "moveId": "water-gun"
      },
      {
        "level": 1,
        "moveId": "withdraw"
      },
      {
        "level": 22,
        "moveId": "harden"
      },
      {
        "level": 30,
        "moveId": "defense-curl"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 39,
        "moveId": "leer"
      },
      {
        "level": 45,
        "moveId": "earthquake"
      },
      {
        "level": 52,
        "moveId": "bubble"
      }
    ],
    "catchRate": 45,
    "baseXP": 173,
    "ascii": "O"
  },
  {
    "id": 140,
    "name": "Kabuto",
    "types": [
      "Rock",
      "Water"
    ],
    "baseStats": {
      "hp": 30,
      "attack": 80,
      "defense": 90,
      "speed": 55,
      "special": 55
    },
    "moves": [
      {
        "level": 1,
        "moveId": "harden"
      },
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 30,
        "moveId": "defense-curl"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 39,
        "moveId": "slash"
      },
      {
        "level": 44,
        "moveId": "leer"
      },
      {
        "level": 45,
        "moveId": "earthquake"
      },
      {
        "level": 52,
        "moveId": "bubble"
      }
    ],
    "evolution": {
      "level": 40,
      "evolvesTo": 141
    },
    "catchRate": 45,
    "baseXP": 71,
    "ascii": "K"
  },
  {
    "id": 141,
    "name": "Kabutops",
    "types": [
      "Rock",
      "Water"
    ],
    "baseStats": {
      "hp": 60,
      "attack": 115,
      "defense": 105,
      "speed": 80,
      "special": 65
    },
    "moves": [
      {
        "level": 1,
        "moveId": "harden"
      },
      {
        "level": 1,
        "moveId": "scratch"
      },
      {
        "level": 30,
        "moveId": "defense-curl"
      },
      {
        "level": 38,
        "moveId": "headbutt"
      },
      {
        "level": 39,
        "moveId": "slash"
      },
      {
        "level": 45,
        "moveId": "earthquake"
      },
      {
        "level": 46,
        "moveId": "leer"
      },
      {
        "level": 52,
        "moveId": "bubble"
      }
    ],
    "catchRate": 45,
    "baseXP": 173,
    "ascii": "K"
  },
  {
    "id": 142,
    "name": "Aerodactyl",
    "types": [
      "Rock",
      "Flying"
    ],
    "baseStats": {
      "hp": 80,
      "attack": 105,
      "defense": 65,
      "speed": 130,
      "special": 60
    },
    "moves": [
      {
        "level": 1,
        "moveId": "agility"
      },
      {
        "level": 1,
        "moveId": "wing-attack"
      },
      {
        "level": 30,
        "moveId": "harden"
      },
      {
        "level": 38,
        "moveId": "bite"
      },
      {
        "level": 38,
        "moveId": "defense-curl"
      },
      {
        "level": 45,
        "moveId": "headbutt"
      },
      {
        "level": 52,
        "moveId": "earthquake"
      },
      {
        "level": 54,
        "moveId": "hyper-beam"
      }
    ],
    "catchRate": 45,
    "baseXP": 180,
    "ascii": "A"
  },
  {
    "id": 143,
    "name": "Snorlax",
    "types": [
      "Normal"
    ],
    "baseStats": {
      "hp": 160,
      "attack": 110,
      "defense": 65,
      "speed": 30,
      "special": 65
    },
    "moves": [
      {
        "level": 1,
        "moveId": "headbutt"
      },
      {
        "level": 35,
        "moveId": "body-slam"
      },
      {
        "level": 38,
        "moveId": "tackle"
      },
      {
        "level": 41,
        "moveId": "harden"
      },
      {
        "level": 45,
        "moveId": "swift"
      },
      {
        "level": 48,
        "moveId": "double-edge"
      },
      {
        "level": 56,
        "moveId": "hyper-beam"
      }
    ],
    "catchRate": 25,
    "baseXP": 189,
    "ascii": "S"
  },
  {
    "id": 144,
    "name": "Articuno",
    "types": [
      "Ice",
      "Flying"
    ],
    "baseStats": {
      "hp": 90,
      "attack": 85,
      "defense": 100,
      "speed": 85,
      "special": 95
    },
    "moves": [
      {
        "level": 1,
        "moveId": "ice-beam"
      },
      {
        "level": 22,
        "moveId": "headbutt"
      },
      {
        "level": 30,
        "moveId": "gust"
      },
      {
        "level": 38,
        "moveId": "wing-attack"
      },
      {
        "level": 45,
        "moveId": "quick-attack"
      },
      {
        "level": 51,
        "moveId": "blizzard"
      },
      {
        "level": 52,
        "moveId": "fly"
      },
      {
        "level": 55,
        "moveId": "agility"
      }
    ],
    "catchRate": 3,
    "baseXP": 261,
    "ascii": "A"
  },
  {
    "id": 145,
    "name": "Zapdos",
    "types": [
      "Electric",
      "Flying"
    ],
    "baseStats": {
      "hp": 90,
      "attack": 90,
      "defense": 85,
      "speed": 100,
      "special": 125
    },
    "moves": [
      {
        "level": 15,
        "moveId": "thunder-wave"
      },
      {
        "level": 22,
        "moveId": "swift"
      },
      {
        "level": 30,
        "moveId": "thunderbolt"
      },
      {
        "level": 38,
        "moveId": "gust"
      },
      {
        "level": 45,
        "moveId": "wing-attack"
      },
      {
        "level": 51,
        "moveId": "thunder"
      },
      {
        "level": 52,
        "moveId": "quick-attack"
      },
      {
        "level": 55,
        "moveId": "agility"
      }
    ],
    "catchRate": 3,
    "baseXP": 261,
    "ascii": "Z"
  },
  {
    "id": 146,
    "name": "Moltres",
    "types": [
      "Fire",
      "Flying"
    ],
    "baseStats": {
      "hp": 90,
      "attack": 100,
      "defense": 90,
      "speed": 90,
      "special": 125
    },
    "moves": [
      {
        "level": 15,
        "moveId": "ember"
      },
      {
        "level": 22,
        "moveId": "smokescreen"
      },
      {
        "level": 30,
        "moveId": "flamethrower"
      },
      {
        "level": 38,
        "moveId": "fire-blast"
      },
      {
        "level": 45,
        "moveId": "gust"
      },
      {
        "level": 51,
        "moveId": "leer"
      },
      {
        "level": 52,
        "moveId": "wing-attack"
      },
      {
        "level": 55,
        "moveId": "agility"
      }
    ],
    "catchRate": 3,
    "baseXP": 261,
    "ascii": "M"
  },
  {
    "id": 147,
    "name": "Dratini",
    "types": [
      "Dragon"
    ],
    "baseStats": {
      "hp": 41,
      "attack": 64,
      "defense": 45,
      "speed": 50,
      "special": 50
    },
    "moves": [
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 1,
        "moveId": "wrap"
      },
      {
        "level": 10,
        "moveId": "thunder-wave"
      },
      {
        "level": 20,
        "moveId": "agility"
      },
      {
        "level": 38,
        "moveId": "swift"
      },
      {
        "level": 45,
        "moveId": "thunderbolt"
      },
      {
        "level": 50,
        "moveId": "hyper-beam"
      },
      {
        "level": 52,
        "moveId": "tackle"
      }
    ],
    "evolution": {
      "level": 30,
      "evolvesTo": 148
    },
    "catchRate": 45,
    "baseXP": 60,
    "ascii": "D"
  },
  {
    "id": 148,
    "name": "Dragonair",
    "types": [
      "Dragon"
    ],
    "baseStats": {
      "hp": 61,
      "attack": 84,
      "defense": 65,
      "speed": 70,
      "special": 70
    },
    "moves": [
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 1,
        "moveId": "thunder-wave"
      },
      {
        "level": 1,
        "moveId": "wrap"
      },
      {
        "level": 20,
        "moveId": "agility"
      },
      {
        "level": 38,
        "moveId": "swift"
      },
      {
        "level": 45,
        "moveId": "thunderbolt"
      },
      {
        "level": 52,
        "moveId": "tackle"
      },
      {
        "level": 55,
        "moveId": "hyper-beam"
      }
    ],
    "evolution": {
      "level": 55,
      "evolvesTo": 149
    },
    "catchRate": 45,
    "baseXP": 147,
    "ascii": "D"
  },
  {
    "id": 149,
    "name": "Dragonite",
    "types": [
      "Dragon",
      "Flying"
    ],
    "baseStats": {
      "hp": 91,
      "attack": 134,
      "defense": 95,
      "speed": 80,
      "special": 100
    },
    "moves": [
      {
        "level": 1,
        "moveId": "agility"
      },
      {
        "level": 1,
        "moveId": "leer"
      },
      {
        "level": 1,
        "moveId": "thunder-wave"
      },
      {
        "level": 1,
        "moveId": "wrap"
      },
      {
        "level": 38,
        "moveId": "swift"
      },
      {
        "level": 45,
        "moveId": "thunderbolt"
      },
      {
        "level": 52,
        "moveId": "gust"
      },
      {
        "level": 60,
        "moveId": "hyper-beam"
      }
    ],
    "catchRate": 45,
    "baseXP": 270,
    "ascii": "D"
  },
  {
    "id": 150,
    "name": "Mewtwo",
    "types": [
      "Psychic"
    ],
    "baseStats": {
      "hp": 106,
      "attack": 110,
      "defense": 90,
      "speed": 130,
      "special": 154
    },
    "moves": [
      {
        "level": 1,
        "moveId": "psychic"
      },
      {
        "level": 1,
        "moveId": "swift"
      },
      {
        "level": 15,
        "moveId": "hypnosis"
      },
      {
        "level": 22,
        "moveId": "confuse-ray"
      },
      {
        "level": 30,
        "moveId": "dream-eater"
      },
      {
        "level": 38,
        "moveId": "tackle"
      },
      {
        "level": 45,
        "moveId": "headbutt"
      },
      {
        "level": 52,
        "moveId": "body-slam"
      }
    ],
    "catchRate": 3,
    "baseXP": 306,
    "ascii": "M"
  },
  {
    "id": 151,
    "name": "Mew",
    "types": [
      "Psychic"
    ],
    "baseStats": {
      "hp": 100,
      "attack": 100,
      "defense": 100,
      "speed": 100,
      "special": 100
    },
    "moves": [
      {
        "level": 1,
        "moveId": "pound"
      },
      {
        "level": 15,
        "moveId": "hypnosis"
      },
      {
        "level": 22,
        "moveId": "confuse-ray"
      },
      {
        "level": 30,
        "moveId": "dream-eater"
      },
      {
        "level": 38,
        "moveId": "tackle"
      },
      {
        "level": 40,
        "moveId": "psychic"
      },
      {
        "level": 45,
        "moveId": "headbutt"
      },
      {
        "level": 52,
        "moveId": "swift"
      }
    ],
    "catchRate": 45,
    "baseXP": 270,
    "ascii": "M"
  }
] as const;

export const TRAINERS: Trainer[] = [
  {
    "id": "youngster-joey",
    "name": "Youngster Joey",
    "party": [
      {
        "pokemonId": 19,
        "level": 7
      },
      {
        "pokemonId": 16,
        "level": 6
      }
    ],
    "reward": {
      "money": 80,
      "xp": 120
    },
    "dialogue": {
      "before": "My Rattata is in the top percentage of Rattata!",
      "after": "No way! My best pal lost!"
    }
  },
  {
    "id": "bug-catcher-sam",
    "name": "Bug Catcher Sam",
    "party": [
      {
        "pokemonId": 10,
        "level": 6
      },
      {
        "pokemonId": 13,
        "level": 7
      },
      {
        "pokemonId": 14,
        "level": 7
      }
    ],
    "reward": {
      "money": 70,
      "xp": 100
    },
    "dialogue": {
      "before": "Bug Pokemon are cool and tough!",
      "after": "Maybe I need stronger bugs..."
    }
  },
  {
    "id": "lass-anna",
    "name": "Lass Anna",
    "party": [
      {
        "pokemonId": 39,
        "level": 8
      },
      {
        "pokemonId": 35,
        "level": 8
      }
    ],
    "reward": {
      "money": 120,
      "xp": 160
    },
    "dialogue": {
      "before": "I like cute Pokemon more than strong ones!",
      "after": "They are still adorable..."
    }
  },
  {
    "id": "hiker-bruce",
    "name": "Hiker Bruce",
    "party": [
      {
        "pokemonId": 74,
        "level": 10
      },
      {
        "pokemonId": 95,
        "level": 11
      }
    ],
    "reward": {
      "money": 200,
      "xp": 220
    },
    "dialogue": {
      "before": "Feel the power of rock-hard determination!",
      "after": "You cracked my defense..."
    }
  },
  {
    "id": "sailor-duke",
    "name": "Sailor Duke",
    "party": [
      {
        "pokemonId": 66,
        "level": 12
      },
      {
        "pokemonId": 72,
        "level": 11
      }
    ],
    "reward": {
      "money": 220,
      "xp": 240
    },
    "dialogue": {
      "before": "Ahoy! Let us battle on the open sea!",
      "after": "You have sea legs after all."
    }
  },
  {
    "id": "rocket-grunt-1",
    "name": "Rocket Grunt",
    "party": [
      {
        "pokemonId": 52,
        "level": 12
      },
      {
        "pokemonId": 109,
        "level": 12
      },
      {
        "pokemonId": 23,
        "level": 11
      }
    ],
    "reward": {
      "money": 280,
      "xp": 300
    },
    "dialogue": {
      "before": "Hand over your valuables... and your Pokemon!",
      "after": "The Boss will hear about this!"
    }
  },
  {
    "id": "scientist-ross",
    "name": "Scientist Ross",
    "party": [
      {
        "pokemonId": 81,
        "level": 15
      },
      {
        "pokemonId": 137,
        "level": 14
      }
    ],
    "reward": {
      "money": 320,
      "xp": 340
    },
    "dialogue": {
      "before": "Observe this perfectly controlled experiment.",
      "after": "The data is... unexpected."
    }
  },
  {
    "id": "psychic-mira",
    "name": "Psychic Mira",
    "party": [
      {
        "pokemonId": 63,
        "level": 16
      },
      {
        "pokemonId": 79,
        "level": 15
      }
    ],
    "reward": {
      "money": 300,
      "xp": 360
    },
    "dialogue": {
      "before": "I foresaw this battle in a dream.",
      "after": "My vision must have been clouded."
    }
  },
  {
    "id": "ace-trainer-rex",
    "name": "Ace Trainer Rex",
    "party": [
      {
        "pokemonId": 58,
        "level": 18
      },
      {
        "pokemonId": 25,
        "level": 18
      },
      {
        "pokemonId": 7,
        "level": 18
      }
    ],
    "reward": {
      "money": 420,
      "xp": 520
    },
    "dialogue": {
      "before": "A balanced team wins balanced battles.",
      "after": "That was a textbook defeat."
    }
  },
  {
    "id": "rocket-grunt-elite",
    "name": "Rocket Grunt Elite",
    "party": [
      {
        "pokemonId": 41,
        "level": 20
      },
      {
        "pokemonId": 24,
        "level": 21
      },
      {
        "pokemonId": 53,
        "level": 21
      }
    ],
    "reward": {
      "money": 500,
      "xp": 650
    },
    "dialogue": {
      "before": "Team Rocket does not lose to kids!",
      "after": "Retreat! This mission is busted!"
    }
  }
] as const;

export const SHOP_ITEMS: Item[] = [
  {
    "id": "potion",
    "name": "Potion",
    "price": 300,
    "effect": "heal",
    "value": 20
  },
  {
    "id": "super-potion",
    "name": "Super Potion",
    "price": 700,
    "effect": "heal",
    "value": 50
  },
  {
    "id": "hyper-potion",
    "name": "Hyper Potion",
    "price": 1200,
    "effect": "heal",
    "value": 200
  },
  {
    "id": "full-restore",
    "name": "Full Restore",
    "price": 3000,
    "effect": "heal",
    "value": 9999
  },
  {
    "id": "revive",
    "name": "Revive",
    "price": 1500,
    "effect": "revive",
    "value": 50
  },
  {
    "id": "poke-ball",
    "name": "Poke Ball",
    "price": 200,
    "effect": "pokeball",
    "value": 1
  },
  {
    "id": "great-ball",
    "name": "Great Ball",
    "price": 600,
    "effect": "pokeball",
    "value": 1.5
  },
  {
    "id": "ultra-ball",
    "name": "Ultra Ball",
    "price": 1200,
    "effect": "pokeball",
    "value": 2
  },
  {
    "id": "antidote",
    "name": "Antidote",
    "price": 100,
    "effect": "status_cure",
    "value": 1
  },
  {
    "id": "paralyze-heal",
    "name": "Paralyze Heal",
    "price": 200,
    "effect": "status_cure",
    "value": 1
  },
  {
    "id": "awakening",
    "name": "Awakening",
    "price": 250,
    "effect": "status_cure",
    "value": 1
  },
  {
    "id": "ice-heal",
    "name": "Ice Heal",
    "price": 250,
    "effect": "status_cure",
    "value": 1
  },
  {
    "id": "full-heal",
    "name": "Full Heal",
    "price": 600,
    "effect": "status_cure",
    "value": 1
  }
] as const;

export const STARTERS = [1, 4, 7] as const;

const EXTRA_TRAINERS: Trainer[] = [
  {
    id: "youngster-ben",
    name: "Youngster Ben",
    party: [{ pokemonId: 19, level: 7 }, { pokemonId: 23, level: 9 }],
    reward: { money: 200, xp: 140 },
    dialogue: { before: "Check out my route team!", after: "I need stronger training..." },
  },
  {
    id: "bug-catcher-rick",
    name: "Bug Catcher Rick",
    party: [{ pokemonId: 10, level: 6 }, { pokemonId: 13, level: 6 }, { pokemonId: 10, level: 6 }],
    reward: { money: 150, xp: 120 },
    dialogue: { before: "Bugs are everywhere out here!", after: "They were all squashed..." },
  },
  {
    id: "lass-dana",
    name: "Lass Dana",
    party: [{ pokemonId: 29, level: 8 }, { pokemonId: 35, level: 10 }],
    reward: { money: 300, xp: 180 },
    dialogue: { before: "Cute Pokémon can still win!", after: "Oh no, my favorites!" },
  },
  {
    id: "youngster-tommy",
    name: "Youngster Tommy",
    party: [{ pokemonId: 27, level: 10 }, { pokemonId: 19, level: 12 }],
    reward: { money: 250, xp: 180 },
    dialogue: { before: "My team is quick on its feet!", after: "I got outsped..." },
  },
  {
    id: "bug-catcher-doug",
    name: "Bug Catcher Doug",
    party: [{ pokemonId: 10, level: 10 }, { pokemonId: 11, level: 12 }],
    reward: { money: 200, xp: 170 },
    dialogue: { before: "My cocoon is about to evolve!", after: "Maybe not yet..." },
  },
  {
    id: "lass-paige",
    name: "Lass Paige",
    party: [{ pokemonId: 39, level: 11 }, { pokemonId: 35, level: 11 }],
    reward: { money: 300, xp: 200 },
    dialogue: { before: "These two are adorable together!", after: "Still adorable, at least..." },
  },
  {
    id: "youngster-calvin",
    name: "Youngster Calvin",
    party: [{ pokemonId: 21, level: 13 }, { pokemonId: 23, level: 13 }],
    reward: { money: 300, xp: 220 },
    dialogue: { before: "Aerial support and poison pressure!", after: "That combo did not last." },
  },
  {
    id: "bug-catcher-ed",
    name: "Bug Catcher Ed",
    party: [{ pokemonId: 15, level: 15 }, { pokemonId: 10, level: 12 }],
    reward: { money: 250, xp: 240 },
    dialogue: { before: "My Beedrill is the star of the woods!", after: "It was blown away..." },
  },
  {
    id: "lass-julia",
    name: "Lass Julia",
    party: [{ pokemonId: 19, level: 14 }, { pokemonId: 16, level: 14 }],
    reward: { money: 350, xp: 240 },
    dialogue: { before: "Simple teams can still be strong!", after: "That was anything but simple." },
  },
  {
    id: "youngster-allen",
    name: "Youngster Allen",
    party: [{ pokemonId: 19, level: 15 }, { pokemonId: 27, level: 15 }],
    reward: { money: 350, xp: 260 },
    dialogue: { before: "I've trained all morning for this!", after: "I need another morning..." },
  },
  {
    id: "hiker-jim",
    name: "Hiker Jim",
    party: [{ pokemonId: 74, level: 18 }, { pokemonId: 66, level: 18 }],
    reward: { money: 600, xp: 380 },
    dialogue: { before: "Nothing beats mountain training!", after: "You knocked the rocks loose..." },
  },
  {
    id: "rocket-grunt-rex",
    name: "Rocket Grunt Rex",
    party: [{ pokemonId: 27, level: 18 }, { pokemonId: 19, level: 18 }, { pokemonId: 41, level: 20 }],
    reward: { money: 500, xp: 420 },
    dialogue: { before: "Do what I say if you know what's good for you!", after: "The boss won't like this..." },
  },
  {
    id: "sailor-huey",
    name: "Sailor Huey",
    party: [{ pokemonId: 72, level: 20 }, { pokemonId: 90, level: 22 }],
    reward: { money: 700, xp: 480 },
    dialogue: { before: "Sea spray keeps my team sharp!", after: "Washed overboard..." },
  },
  {
    id: "rocket-grunt-orville",
    name: "Rocket Grunt Orville",
    party: [{ pokemonId: 23, level: 20 }, { pokemonId: 41, level: 22 }, { pokemonId: 109, level: 22 }],
    reward: { money: 600, xp: 500 },
    dialogue: { before: "Team Rocket's poison pressure will break you!", after: "My lineup fizzled out..." },
  },
  {
    id: "hiker-slim",
    name: "Hiker Slim",
    party: [{ pokemonId: 74, level: 22 }, { pokemonId: 75, level: 24 }],
    reward: { money: 700, xp: 540 },
    dialogue: { before: "I've got rock-solid endurance!", after: "Crumbled..." },
  },
  {
    id: "picnicker-carol",
    name: "Picnicker Carol",
    party: [{ pokemonId: 43, level: 22 }, { pokemonId: 69, level: 22 }],
    reward: { money: 600, xp: 470 },
    dialogue: { before: "A garden battle is still a battle!", after: "My flowers wilted..." },
  },
  {
    id: "camper-shane",
    name: "Camper Shane",
    party: [{ pokemonId: 33, level: 24 }, { pokemonId: 58, level: 24 }],
    reward: { money: 700, xp: 560 },
    dialogue: { before: "My campfire team never backs down!", after: "The fire went out..." },
  },
  {
    id: "pokemaniac-olaf",
    name: "Pokemaniac Olaf",
    party: [{ pokemonId: 79, level: 25 }, { pokemonId: 35, level: 25 }],
    reward: { money: 1500, xp: 650 },
    dialogue: { before: "Rare Pokémon are my obsession!", after: "I got carried away again..." },
  },
  {
    id: "rocket-grunt-arnie",
    name: "Rocket Grunt Arnie",
    party: [{ pokemonId: 24, level: 26 }, { pokemonId: 110, level: 26 }],
    reward: { money: 700, xp: 640 },
    dialogue: { before: "You're in the way of Rocket business!", after: "Our plans keep falling apart..." },
  },
  {
    id: "swimmer-jenny",
    name: "Swimmer Jenny",
    party: [{ pokemonId: 116, level: 28 }, { pokemonId: 73, level: 28 }],
    reward: { money: 800, xp: 700 },
    dialogue: { before: "Current and tide are on my side!", after: "The current turned..." },
  },
  {
    id: "tamer-cole",
    name: "Tamer Cole",
    party: [{ pokemonId: 59, level: 32 }, { pokemonId: 57, level: 32 }],
    reward: { money: 1200, xp: 980 },
    dialogue: { before: "These two fight like wild beasts!", after: "They've been tamed..." },
  },
  {
    id: "cooltrainer-may",
    name: "Cooltrainer May",
    party: [{ pokemonId: 53, level: 35 }, { pokemonId: 36, level: 35 }],
    reward: { money: 2000, xp: 1150 },
    dialogue: { before: "Style and strength go together.", after: "You have both..." },
  },
  {
    id: "rocket-boss",
    name: "Rocket Boss",
    party: [{ pokemonId: 24, level: 37 }, { pokemonId: 111, level: 37 }, { pokemonId: 53, level: 38 }],
    reward: { money: 1800, xp: 1250 },
    dialogue: { before: "You meddled in Rocket affairs for the last time!", after: "This isn't over..." },
  },
  {
    id: "cooltrainer-wilton",
    name: "Cooltrainer Wilton",
    party: [{ pokemonId: 40, level: 40 }, { pokemonId: 36, level: 42 }],
    reward: { money: 2500, xp: 1400 },
    dialogue: { before: "Polished teams demand polished wins.", after: "Outclassed..." },
  },
  {
    id: "juggler-kirk",
    name: "Juggler Kirk",
    party: [{ pokemonId: 64, level: 38 }, { pokemonId: 97, level: 40 }],
    reward: { money: 2000, xp: 1320 },
    dialogue: { before: "Watch closely. The mind can outplay the body!", after: "I dropped the act..." },
  },
  {
    id: "blackbelt-hitoshi",
    name: "Blackbelt Hitoshi",
    party: [{ pokemonId: 68, level: 43 }, { pokemonId: 107, level: 43 }],
    reward: { money: 2200, xp: 1500 },
    dialogue: { before: "Discipline and fists will carry me!", after: "I still have much to learn." },
  },
  {
    id: "cooltrainer-kate",
    name: "Cooltrainer Kate",
    party: [{ pokemonId: 38, level: 44 }, { pokemonId: 78, level: 44 }],
    reward: { money: 2500, xp: 1580 },
    dialogue: { before: "Grace and speed make a perfect team.", after: "You were faster and sharper." },
  },
  {
    id: "juggler-nate",
    name: "Juggler Nate",
    party: [{ pokemonId: 94, level: 46 }, { pokemonId: 65, level: 46 }],
    reward: { money: 2800, xp: 1700 },
    dialogue: { before: "This show ends with a knockout!", after: "I lost the crowd..." },
  },
  {
    id: "cooltrainer-alexa",
    name: "Cooltrainer Alexa",
    party: [{ pokemonId: 134, level: 48 }, { pokemonId: 136, level: 48 }],
    reward: { money: 3000, xp: 1820 },
    dialogue: { before: "Evolution stones made this team elite.", after: "Your team evolved past mine..." },
  },
  {
    id: "cooltrainer-beau",
    name: "Cooltrainer Beau",
    party: [{ pokemonId: 103, level: 50 }, { pokemonId: 121, level: 50 }, { pokemonId: 128, level: 50 }],
    reward: { money: 3500, xp: 2100 },
    dialogue: { before: "This is the caliber of a final-route trainer.", after: "You belong beyond the routes." },
  },
];

(TRAINERS as unknown as Trainer[]).push(...EXTRA_TRAINERS);

export const GYM_LEADERS: GymLeader[] = [
  {
    id: "brock",
    name: "Brock",
    city: "Pewter City",
    badgeName: "Boulder Badge",
    badgeEmoji: "⬟",
    specialty: "Rock",
    requiredBadges: 0,
    party: [
      { pokemonId: 74, level: 12, moves: ["Tackle", "Defense Curl"] },
      { pokemonId: 95, level: 14, moves: ["Tackle", "Screech", "Bide"] },
    ],
    reward: { money: 1400, xp: 600 },
    dialogue: {
      before: "I'm Brock! I'm Pewter's Gym Leader! My rock-hard willpower is evident in my Pokémon!",
      after: "That's a great Pokémon you have! You've won the Boulder Badge!",
    },
  },
  {
    id: "misty",
    name: "Misty",
    city: "Cerulean City",
    badgeName: "Cascade Badge",
    badgeEmoji: "💧",
    specialty: "Water",
    requiredBadges: 1,
    party: [
      { pokemonId: 120, level: 18, moves: ["Tackle", "Water Gun"] },
      { pokemonId: 121, level: 21, moves: ["Tackle", "Water Gun", "Harden", "BubbleBeam"] },
    ],
    reward: { money: 2100, xp: 900 },
    dialogue: {
      before: "Misty's my name! Water Pokémon are my specialty!",
      after: "Wow! You're too much! All right! You can have the Cascade Badge!",
    },
  },
  {
    id: "lt-surge",
    name: "Lt. Surge",
    city: "Vermilion City",
    badgeName: "Thunder Badge",
    badgeEmoji: "⚡",
    specialty: "Electric",
    requiredBadges: 2,
    party: [
      { pokemonId: 100, level: 21, moves: ["Tackle", "Screech", "SonicBoom"] },
      { pokemonId: 25, level: 18, moves: ["Thundershock", "Thunder Wave", "Growl", "Quick Attack"] },
      { pokemonId: 26, level: 24, moves: ["Thunderbolt", "Thundershock", "Thunder Wave", "Growl"] },
    ],
    reward: { money: 2400, xp: 1100 },
    dialogue: {
      before: "Hey, kid! What do you think you're doing here?",
      after: "Whoa! You're the real deal, kid! Fine then, take the Thunder Badge!",
    },
  },
  {
    id: "erika",
    name: "Erika",
    city: "Celadon City",
    badgeName: "Rainbow Badge",
    badgeEmoji: "🌿",
    specialty: "Grass",
    requiredBadges: 3,
    party: [
      { pokemonId: 71, level: 29, moves: ["Wrap", "Poisonpowder", "Sleep Powder", "Razor Leaf"] },
      { pokemonId: 114, level: 24, moves: ["Bind", "Constrict"] },
      { pokemonId: 45, level: 29, moves: ["Poisonpowder", "Mega Drain", "Sleep Powder", "Petal Dance"] },
    ],
    reward: { money: 2900, xp: 1400 },
    dialogue: {
      before: "Oh! I had no idea you wished to challenge me. Very well, but I shall not lose.",
      after: "I concede defeat. You are remarkably strong. I present you the Rainbow Badge.",
    },
  },
  {
    id: "koga",
    name: "Koga",
    city: "Fuchsia City",
    badgeName: "Soul Badge",
    badgeEmoji: "☠",
    specialty: "Poison",
    requiredBadges: 4,
    party: [
      { pokemonId: 109, level: 37, moves: ["Tackle", "Smog", "Sludge", "Smokescreen"] },
      { pokemonId: 89, level: 39, moves: ["Disable", "Poison Gas", "Minimize", "Sludge"] },
      { pokemonId: 109, level: 37, moves: ["Tackle", "Smog", "Sludge", "Smokescreen"] },
      { pokemonId: 110, level: 43, moves: ["Smog", "Sludge", "Toxic", "Selfdestruct"] },
    ],
    reward: { money: 4300, xp: 2100 },
    dialogue: {
      before: "Fwahahaha! A mere child like you dares to challenge me?",
      after: "You have proven your worth! Here, take the Soul Badge!",
    },
  },
  {
    id: "sabrina",
    name: "Sabrina",
    city: "Saffron City",
    badgeName: "Marsh Badge",
    badgeEmoji: "👁",
    specialty: "Psychic",
    requiredBadges: 5,
    party: [
      { pokemonId: 64, level: 38, moves: ["Disable", "Psybeam", "Recover", "Psychic"] },
      { pokemonId: 122, level: 37, moves: ["Confusion", "Barrier", "Light Screen", "Doubleslap"] },
      { pokemonId: 49, level: 38, moves: ["Poisonpowder", "Leech Life", "Stun Spore", "Psybeam"] },
      { pokemonId: 65, level: 43, moves: ["Psybeam", "Recover", "Psywave", "Reflect"] },
    ],
    reward: { money: 4300, xp: 2300 },
    dialogue: {
      before: "I knew you were coming... and yet I still welcome this challenge.",
      after: "I admit this loss. Take the Marsh Badge.",
    },
  },
  {
    id: "blaine",
    name: "Blaine",
    city: "Cinnabar Island",
    badgeName: "Volcano Badge",
    badgeEmoji: "🔥",
    specialty: "Fire",
    requiredBadges: 6,
    party: [
      { pokemonId: 58, level: 42, moves: ["Ember", "Leer", "Take Down", "Agility"] },
      { pokemonId: 77, level: 40, moves: ["Tail Whip", "Stomp", "Growl", "Fire Spin"] },
      { pokemonId: 78, level: 42, moves: ["Tail Whip", "Stomp", "Growl", "Fire Spin"] },
      { pokemonId: 59, level: 47, moves: ["Roar", "Ember", "Take Down", "Fire Blast"] },
    ],
    reward: { money: 4700, xp: 2500 },
    dialogue: {
      before: "Hah! I am Blaine! The red-hot Gym Leader of Cinnabar!",
      after: "I have burned out! You have earned the Volcano Badge!",
    },
  },
  {
    id: "giovanni",
    name: "Giovanni",
    city: "Viridian City",
    badgeName: "Earth Badge",
    badgeEmoji: "🌍",
    specialty: "Ground",
    requiredBadges: 7,
    party: [
      { pokemonId: 111, level: 45, moves: ["Stomp", "Tail Whip", "Fury Attack", "Horn Attack"] },
      { pokemonId: 51, level: 42, moves: ["Growl", "Dig", "Sand Attack", "Slash"] },
      { pokemonId: 31, level: 44, moves: ["Scratch", "Tail Whip", "Poison Sting", "Body Slam"] },
      { pokemonId: 34, level: 45, moves: ["Tackle", "Horn Attack", "Poison Sting", "Thrash"] },
      { pokemonId: 112, level: 50, moves: ["Stomp", "Tail Whip", "Fissure", "Horn Drill"] },
    ],
    reward: { money: 5000, xp: 2800 },
    dialogue: {
      before: "So! You have come for the final badge. I accept your challenge.",
      after: "Ha! That was a truly intense fight. Here, take the Earth Badge!",
    },
  },
];

export const ELITE_FOUR: EliteFour[] = [
  {
    id: "lorelei",
    name: "Lorelei",
    title: "Elite Four",
    specialty: "Ice",
    order: 1,
    party: [
      { pokemonId: 87, level: 54, moves: ["Headbutt", "Ice Beam", "Rest", "Take Down"] },
      { pokemonId: 91, level: 53, moves: ["Aurora Beam", "Clamp", "Supersonic", "Ice Beam"] },
      { pokemonId: 80, level: 54, moves: ["Water Gun", "Withdraw", "Confusion", "Headbutt"] },
      { pokemonId: 124, level: 56, moves: ["Lovely Kiss", "Ice Punch", "Body Slam", "Thrash"] },
      { pokemonId: 131, level: 60, moves: ["Blizzard", "Body Slam", "Confuse Ray", "Hydro Pump"] },
    ],
    reward: { money: 6000, xp: 4000 },
    dialogue: {
      before: "No one can best me when it comes to icy Pokémon!",
      after: "You are better than I thought. Go on ahead.",
    },
  },
  {
    id: "bruno",
    name: "Bruno",
    title: "Elite Four",
    specialty: "Fighting",
    order: 2,
    party: [
      { pokemonId: 95, level: 53, moves: ["Rock Throw", "Rage", "Tackle", "Bind"] },
      { pokemonId: 107, level: 55, moves: ["ThunderPunch", "Ice Punch", "Fire Punch", "Mega Punch"] },
      { pokemonId: 106, level: 55, moves: ["Double Kick", "Jump Kick", "Rolling Kick", "Focus Energy"] },
      { pokemonId: 95, level: 56, moves: ["Earthquake", "Rock Slide", "Slam", "Dig"] },
      { pokemonId: 68, level: 58, moves: ["Karate Chop", "Strength", "Submission", "Leer"] },
    ],
    reward: { money: 5800, xp: 4200 },
    dialogue: {
      before: "I am Bruno of the Elite Four! Through rigorous training, people and Pokémon can become stronger!",
      after: "Why? How could I lose? My job is done. Go face your next challenge!",
    },
  },
  {
    id: "agatha",
    name: "Agatha",
    title: "Elite Four",
    specialty: "Ghost",
    order: 3,
    party: [
      { pokemonId: 94, level: 54, moves: ["Hypnosis", "Dream Eater", "Confuse Ray", "Night Shade"] },
      { pokemonId: 93, level: 53, moves: ["Hypnosis", "Night Shade", "Confuse Ray", "Dream Eater"] },
      { pokemonId: 94, level: 58, moves: ["Toxic", "Confuse Ray", "Night Shade", "Psychic"] },
      { pokemonId: 24, level: 58, moves: ["Glare", "Bite", "Acid", "Screech"] },
      { pokemonId: 94, level: 60, moves: ["Thunderbolt", "Psychic", "Confuse Ray", "Hypnosis"] },
    ],
    reward: { money: 6000, xp: 4300 },
    dialogue: {
      before: "I hear Oak's taken a lot of interest in you, child!",
      after: "Oh ho! You're something special, child!",
    },
  },
  {
    id: "lance",
    name: "Lance",
    title: "Elite Four",
    specialty: "Dragon",
    order: 4,
    party: [
      { pokemonId: 130, level: 58, moves: ["Hydro Pump", "Dragon Rage", "Leer", "Hyper Beam"] },
      { pokemonId: 148, level: 56, moves: ["Wrap", "Thunder Wave", "Agility", "Slam"] },
      { pokemonId: 148, level: 56, moves: ["Wrap", "Thunder Wave", "Agility", "Slam"] },
      { pokemonId: 142, level: 60, moves: ["Wing Attack", "Hyper Beam", "Supersonic", "Take Down"] },
      { pokemonId: 149, level: 62, moves: ["Thunder Wave", "Agility", "Slam", "Hyper Beam"] },
    ],
    reward: { money: 6200, xp: 4600 },
    dialogue: {
      before: "I am Lance, the dragon master! You still need to prove your worth!",
      after: "You have become a true master. The Champion awaits you.",
    },
  },
  {
    id: "blue",
    name: "Blue",
    title: "Champion",
    specialty: "Normal",
    order: 5,
    party: [
      { pokemonId: 18, level: 61, moves: ["Wing Attack", "Mirror Move", "Quick Attack", "Whirlwind"] },
      { pokemonId: 65, level: 59, moves: ["Psychic", "Recover", "Reflect", "Psybeam"] },
      { pokemonId: 112, level: 61, moves: ["Earthquake", "Horn Drill", "Rock Slide", "Stomp"] },
      { pokemonId: 59, level: 61, moves: ["Fire Blast", "Take Down", "Roar", "Ember"] },
      { pokemonId: 103, level: 61, moves: ["Sleep Powder", "Stomp", "Solar Beam", "Psychic"] },
      { pokemonId: 9, level: 65, moves: ["Hydro Pump", "Blizzard", "Bite", "Withdraw"] },
    ],
    reward: { money: 10000, xp: 6000 },
    dialogue: {
      before: "So! You made it here! I was waiting for you! I knew you'd come!",
      after: "No! That can't be! You beat me at the very end!",
    },
  },
];
