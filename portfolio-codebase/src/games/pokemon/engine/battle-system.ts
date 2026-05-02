import {
  MOVES_DATA,
  POKEMON_DATA,
  TYPE_CHART,
  type Move,
  type Pokemon,
  type PokemonType,
} from "../data/pokemon-data";

type BattleStatus =
  | "paralyzed"
  | "burned"
  | "poisoned"
  | "badly_poisoned"
  | "asleep"
  | "frozen";

type BattleStat = "attack" | "defense" | "speed" | "special";
type AccuracyStat = "accuracy" | "evasion";
type StageStat = BattleStat | AccuracyStat;
type BattlePhase = "select" | "animating" | "enemy_turn" | "catch" | "result";

interface BattlePokemon {
  pokemonId: number;
  name: string;
  level: number;
  currentHP: number;
  maxHP: number;
  stats: {
    attack: number;
    defense: number;
    speed: number;
    special: number;
  };
  moves: {
    moveId: string;
    currentPP: number;
    maxPP: number;
  }[];
  status?: BattleStatus;
  statusTurns?: number;
  statStages: {
    attack: number;
    defense: number;
    speed: number;
    special: number;
    accuracy: number;
    evasion: number;
  };
}

interface BattleState {
  phase: BattlePhase;
  playerPokemon: BattlePokemon;
  enemyPokemon: BattlePokemon;
  isWild: boolean;
  log: string[];
  turn: number;
  canRun: boolean;
  catchAttempts: number;
}

type BattleResult = {
  newAttacker: BattlePokemon;
  newDefender: BattlePokemon;
  messages: string[];
  knockedOut: boolean;
};

type CatchResult = {
  caught: boolean;
  chance: number;
  message: string;
};

const STRUGGLE_MOVE: Move = {
  id: "struggle",
  name: "Struggle",
  type: "Normal",
  power: 50,
  accuracy: 100,
  pp: 999,
  category: "physical",
};

const GEN1_MOVE_TYPE_OVERRIDES: Partial<Record<string, PokemonType>> = {
  bite: "Normal",
  gust: "Normal",
  "karate-chop": "Normal",
  "sand-attack": "Normal",
};

const GEN1_SPECIAL_TYPES = new Set<PokemonType>([
  "Fire",
  "Water",
  "Grass",
  "Electric",
  "Ice",
  "Psychic",
  "Dragon",
]);

const TYPELESS_STATUS_MOVES = new Set([
  "mean-look",
  "confuse-ray",
  "smokescreen",
  "sand-attack",
  "growl",
  "tail-whip",
  "leer",
  "harden",
  "defense-curl",
  "withdraw",
  "meditate",
  "focus-energy",
  "agility",
  "string-shot",
  "screech",
]);

const STAT_STAGE_BEHAVIORS: Partial<
  Record<
    string,
    {
      stat: StageStat;
      stages: number;
      target: "self" | "opponent";
    }
  >
> = {
  growl: { stat: "attack", stages: -1, target: "opponent" },
  "tail-whip": { stat: "defense", stages: -1, target: "opponent" },
  leer: { stat: "defense", stages: -1, target: "opponent" },
  smokescreen: { stat: "accuracy", stages: -1, target: "opponent" },
  "sand-attack": { stat: "accuracy", stages: -1, target: "opponent" },
  agility: { stat: "speed", stages: 2, target: "self" },
  harden: { stat: "defense", stages: 1, target: "self" },
  "defense-curl": { stat: "defense", stages: 1, target: "self" },
  withdraw: { stat: "defense", stages: 1, target: "self" },
  meditate: { stat: "attack", stages: 1, target: "self" },
  "focus-energy": { stat: "attack", stages: 1, target: "self" },
  "string-shot": { stat: "speed", stages: -1, target: "opponent" },
  screech: { stat: "defense", stages: -2, target: "opponent" },
  barrier: { stat: "defense", stages: 2, target: "self" },
  "light-screen": { stat: "special", stages: 2, target: "self" },
  reflect: { stat: "defense", stages: 2, target: "self" },
  minimize: { stat: "evasion", stages: 1, target: "self" },
};

const IMMUNITIES: Partial<Record<BattleStatus, PokemonType[]>> = {
  paralyzed: ["Electric"],
  burned: ["Fire"],
  poisoned: ["Poison", "Ghost"],
  badly_poisoned: ["Poison", "Ghost"],
  frozen: ["Ice"],
};

function getPokemonById(pokemonId: number): Pokemon {
  const pokemon = POKEMON_DATA.find((entry) => entry.id === pokemonId);

  if (!pokemon) {
    throw new Error(`Pokemon not found: ${pokemonId}`);
  }

  return pokemon;
}

function getMoveById(moveId: string): Move {
  if (moveId === "struggle") {
    return STRUGGLE_MOVE;
  }

  const move = MOVES_DATA[moveId];

  if (!move) {
    throw new Error(`Move not found: ${moveId}`);
  }

  const type = GEN1_MOVE_TYPE_OVERRIDES[moveId] ?? move.type;

  return {
    ...move,
    type,
    category:
      move.category === "status"
        ? "status"
        : GEN1_SPECIAL_TYPES.has(type)
          ? "special"
          : "physical",
  };
}

function cloneBattlePokemon(pokemon: BattlePokemon): BattlePokemon {
  return {
    ...pokemon,
    stats: { ...pokemon.stats },
    moves: pokemon.moves.map((move) => ({ ...move })),
    statStages: { ...pokemon.statStages },
  };
}

function getStageMultiplier(stage: number) {
  if (stage === 0) return 1;
  if (stage > 0) return 1 + stage * 0.125;
  return 1 / (1 + Math.abs(stage) * 0.125);
}

function getModifiedStat(pokemon: BattlePokemon, stat: BattleStat) {
  return Math.max(
    1,
    Math.floor(pokemon.stats[stat] * getStageMultiplier(pokemon.statStages[stat])),
  );
}

function getAccuracyMultiplier(attacker: BattlePokemon, defender: BattlePokemon) {
  const accuracy =
    getStageMultiplier(attacker.statStages.accuracy) *
    getStageMultiplier(-defender.statStages.evasion);

  return Math.max(0.25, accuracy);
}

function getTypeEffectiveness(moveType: PokemonType, defenderTypes: PokemonType[]) {
  return defenderTypes.reduce((multiplier, type) => {
    return multiplier * TYPE_CHART[moveType][type];
  }, 1);
}

function getStatusModifier(status?: BattleStatus) {
  if (!status) return 1;
  if (status === "paralyzed" || status === "asleep" || status === "frozen") {
    return 2;
  }
  if (status === "burned" || status === "poisoned" || status === "badly_poisoned") {
    return 1.5;
  }
  return 1;
}

function getMoveSlotsForLevel(pokemon: Pokemon, level: number) {
  const learnedMoves = pokemon.moves
    .filter((entry) => entry.level <= level)
    .sort((a, b) => a.level - b.level)
    .slice(-4);

  const fallbackMoves = pokemon.moves.slice(0, Math.min(4, pokemon.moves.length));
  const selectedMoves = learnedMoves.length > 0 ? learnedMoves : fallbackMoves;

  return selectedMoves.map((entry) => {
    const move = getMoveById(entry.moveId);

    return {
      moveId: entry.moveId,
      currentPP: move.pp,
      maxPP: move.pp,
    };
  });
}

function capitalizeStatus(status: BattleStatus) {
  switch (status) {
    case "paralyzed":
      return "PARALYZED";
    case "burned":
      return "BURNED";
    case "poisoned":
      return "POISONED";
    case "badly_poisoned":
      return "BADLY POISONED";
    case "asleep":
      return "ASLEEP";
    case "frozen":
      return "FROZEN";
  }
}

function getTypeList(pokemon: BattlePokemon) {
  return getPokemonById(pokemon.pokemonId).types;
}

function rollAccuracy(move: Move, attacker: BattlePokemon, defender: BattlePokemon) {
  const effectiveAccuracy = move.accuracy * getAccuracyMultiplier(attacker, defender);
  return Math.random() * 100 <= effectiveAccuracy;
}

function getCriticalMultiplier(attacker: BattlePokemon) {
  const criticalChance = Math.min(getModifiedStat(attacker, "speed") / 512, 0.25);
  return Math.random() < criticalChance ? 1.5 : 1;
}

function getRandomDamageMultiplier() {
  return 0.85 + Math.random() * 0.15;
}

function formatPokemonName(name: string) {
  return name.toUpperCase();
}

function getDefaultNoEffectMessage(move: Move) {
  if (TYPELESS_STATUS_MOVES.has(move.id)) {
    return `${move.name} had no lasting effect!`;
  }

  return `${move.name} had no effect!`;
}

function getStatusMoveOutcome(
  attacker: BattlePokemon,
  defender: BattlePokemon,
  move: Move,
): { attacker: BattlePokemon; defender: BattlePokemon; messages: string[] } {
  const behavior = STAT_STAGE_BEHAVIORS[move.id];

  if (behavior) {
    if (behavior.target === "self") {
      const result = applyStatStage(attacker, behavior.stat, behavior.stages);
      return {
        attacker: result.pokemon,
        defender,
        messages: [result.message],
      };
    }

    const result = applyStatStage(defender, behavior.stat, behavior.stages);
    return {
      attacker,
      defender: result.pokemon,
      messages: [result.message],
    };
  }

  if (move.id === "recover") {
    const nextAttacker = cloneBattlePokemon(attacker);
    nextAttacker.currentHP = Math.min(
      nextAttacker.maxHP,
      nextAttacker.currentHP + Math.floor(nextAttacker.maxHP / 2),
    );
    return {
      attacker: nextAttacker,
      defender,
      messages: [`${formatPokemonName(attacker.name)} recovered health!`],
    };
  }

  if (move.id === "rest") {
    const nextAttacker = cloneBattlePokemon(attacker);
    nextAttacker.currentHP = nextAttacker.maxHP;
    nextAttacker.status = "asleep";
    nextAttacker.statusTurns = 2;
    return {
      attacker: nextAttacker,
      defender,
      messages: [
        `${formatPokemonName(attacker.name)} went to sleep!`,
        `${formatPokemonName(attacker.name)} restored its HP!`,
      ],
    };
  }

  if (
    move.effect === "paralyze" ||
    move.effect === "burn" ||
    move.effect === "sleep" ||
    move.effect === "poison" ||
    move.effect === "freeze"
  ) {
    const statusMap: Record<
      Exclude<Move["effect"], undefined | "stat_boost">,
      BattleStatus
    > = {
      paralyze: "paralyzed",
      burn: "burned",
      sleep: "asleep",
      poison: "poisoned",
      freeze: "frozen",
    };

    const status = move.effect === "poison" && move.id === "toxic"
      ? "badly_poisoned"
      : statusMap[move.effect];
    const result = applyStatusEffect(defender, status);
    return {
      attacker,
      defender: result.pokemon,
      messages: [result.message],
    };
  }

  return {
    attacker,
    defender,
    messages: [getDefaultNoEffectMessage(move)],
  };
}

function applyResidualDamage(pokemon: BattlePokemon, amount: number) {
  const nextPokemon = cloneBattlePokemon(pokemon);
  nextPokemon.currentHP = Math.max(0, nextPokemon.currentHP - amount);
  return nextPokemon;
}

function getMoveSlot(pokemon: BattlePokemon, moveId: string) {
  return pokemon.moves.find((move) => move.moveId === moveId);
}

function decrementMovePP(pokemon: BattlePokemon, moveId: string) {
  const nextPokemon = cloneBattlePokemon(pokemon);
  const moveSlot = nextPokemon.moves.find((entry) => entry.moveId === moveId);

  if (moveSlot && moveSlot.currentPP > 0) {
    moveSlot.currentPP -= 1;
  }

  return nextPokemon;
}

function canApplySecondaryEffect(move: Move) {
  return (
    move.effect &&
    move.effect !== "stat_boost" &&
    typeof move.effectChance === "number" &&
    Math.random() * 100 < move.effectChance
  );
}

function createBattlePokemon(pokemonId: number, level: number): BattlePokemon {
  const pokemon = getPokemonById(pokemonId);

  const maxHP =
    Math.floor((((pokemon.baseStats.hp + 15) * 2 + 63) * level) / 100) +
    level +
    10;

  const calculateStat = (baseStat: number) =>
    Math.floor((((baseStat + 15) * 2 + 63) * level) / 100) + 5;

  return {
    pokemonId,
    name: pokemon.name,
    level,
    currentHP: maxHP,
    maxHP,
    stats: {
      attack: calculateStat(pokemon.baseStats.attack),
      defense: calculateStat(pokemon.baseStats.defense),
      speed: calculateStat(pokemon.baseStats.speed),
      special: calculateStat(pokemon.baseStats.special),
    },
    moves: getMoveSlotsForLevel(pokemon, level),
    statStages: {
      attack: 0,
      defense: 0,
      speed: 0,
      special: 0,
      accuracy: 0,
      evasion: 0,
    },
  };
}

function calculateDamage(
  attacker: BattlePokemon,
  defender: BattlePokemon,
  move: Move,
) {
  if (move.power <= 0) return 0;

  if (move.id === "night-shade") {
    return attacker.level;
  }

  if (move.id === "sonicboom") {
    return 20;
  }

  if (move.id === "dragon-rage") {
    return 40;
  }

  if (move.id === "psywave") {
    return Math.max(1, Math.floor(attacker.level * (0.5 + Math.random())));
  }

  if (move.id === "fissure" || move.id === "horn-drill") {
    return defender.currentHP;
  }

  const attackStat =
    move.category === "special"
      ? getModifiedStat(attacker, "special")
      : getModifiedStat(attacker, "attack");
  const defenseStat =
    move.category === "special"
      ? getModifiedStat(defender, "special")
      : getModifiedStat(defender, "defense");

  const levelFactor = Math.floor((2 * attacker.level) / 5 + 2);
  const baseDamage =
    Math.floor(
      Math.floor((levelFactor * move.power * attackStat) / defenseStat / 50) + 2,
    ) || 1;

  const stab = getTypeList(attacker).includes(move.type) ? 1.5 : 1;
  const typeEffectiveness = getTypeEffectiveness(move.type, getTypeList(defender));
  const critical = getCriticalMultiplier(attacker);
  const random = getRandomDamageMultiplier();

  return Math.max(
    1,
    Math.floor(baseDamage * critical * random * stab * typeEffectiveness),
  );
}

function applyStatStage(
  pokemon: BattlePokemon,
  stat: StageStat,
  stages: number,
): { pokemon: BattlePokemon; message: string } {
  const nextPokemon = cloneBattlePokemon(pokemon);
  const currentStage = nextPokemon.statStages[stat];
  const nextStage = Math.max(-6, Math.min(6, currentStage + stages));
  const diff = nextStage - currentStage;
  const statLabel = stat.toUpperCase();

  if (diff === 0) {
    return {
      pokemon: nextPokemon,
      message:
        stages > 0
          ? `${formatPokemonName(pokemon.name)}'s ${statLabel} won't go higher!`
          : `${formatPokemonName(pokemon.name)}'s ${statLabel} won't go lower!`,
    };
  }

  nextPokemon.statStages[stat] = nextStage;

  return {
    pokemon: nextPokemon,
    message:
      diff > 0
        ? `${formatPokemonName(pokemon.name)}'s ${statLabel} rose!`
        : `${formatPokemonName(pokemon.name)}'s ${statLabel} fell!`,
  };
}

function applyStatusEffect(
  pokemon: BattlePokemon,
  status: BattleStatus,
): { pokemon: BattlePokemon; message: string } {
  const nextPokemon = cloneBattlePokemon(pokemon);

  if (nextPokemon.status) {
    return {
      pokemon: nextPokemon,
      message: `${formatPokemonName(pokemon.name)} already has a status condition!`,
    };
  }

  const typeList = getTypeList(nextPokemon);
  const immuneTypes = IMMUNITIES[status] ?? [];

  if (immuneTypes.some((type) => typeList.includes(type))) {
    return {
      pokemon: nextPokemon,
      message: `${formatPokemonName(pokemon.name)} is immune to ${capitalizeStatus(status)}!`,
    };
  }

  nextPokemon.status = status;

  if (status === "asleep") {
    nextPokemon.statusTurns = 1 + Math.floor(Math.random() * 7);
  } else if (status === "badly_poisoned") {
    nextPokemon.statusTurns = 1;
  } else {
    nextPokemon.statusTurns = 0;
  }

  return {
    pokemon: nextPokemon,
    message: `${formatPokemonName(pokemon.name)} was ${capitalizeStatus(status)}!`,
  };
}

function processStatusEffects(
  pokemon: BattlePokemon,
): { pokemon: BattlePokemon; message: string; damaged: boolean } {
  const nextPokemon = cloneBattlePokemon(pokemon);

  if (!nextPokemon.status) {
    return { pokemon: nextPokemon, message: "", damaged: false };
  }

  if (nextPokemon.status === "burned") {
    const damage = Math.max(1, Math.floor(nextPokemon.maxHP / 8));
    const damagedPokemon = applyResidualDamage(nextPokemon, damage);
    return {
      pokemon: damagedPokemon,
      message: `${formatPokemonName(pokemon.name)} is hurt by its burn!`,
      damaged: true,
    };
  }

  if (nextPokemon.status === "poisoned") {
    const damage = Math.max(1, Math.floor(nextPokemon.maxHP / 16));
    const damagedPokemon = applyResidualDamage(nextPokemon, damage);
    damagedPokemon.statusTurns = 0;
    return {
      pokemon: damagedPokemon,
      message: `${formatPokemonName(pokemon.name)} is hurt by poison!`,
      damaged: true,
    };
  }

  if (nextPokemon.status === "badly_poisoned") {
    const poisonCounter = Math.max(1, nextPokemon.statusTurns ?? 1);
    const damage = Math.max(1, Math.floor((nextPokemon.maxHP / 16) * poisonCounter));
    const damagedPokemon = applyResidualDamage(nextPokemon, damage);
    damagedPokemon.statusTurns = poisonCounter + 1;
    return {
      pokemon: damagedPokemon,
      message: `${formatPokemonName(pokemon.name)} is hurt by poison!`,
      damaged: true,
    };
  }

  if (nextPokemon.status === "paralyzed") {
    if (Math.random() < 0.25) {
      return {
        pokemon: nextPokemon,
        message: `${formatPokemonName(pokemon.name)} is fully paralyzed!`,
        damaged: false,
      };
    }

    return { pokemon: nextPokemon, message: "", damaged: false };
  }

  if (nextPokemon.status === "asleep") {
    const turnsRemaining = nextPokemon.statusTurns ?? 1;

    if (turnsRemaining <= 1) {
      nextPokemon.status = undefined;
      nextPokemon.statusTurns = 0;
      return {
        pokemon: nextPokemon,
        message: `${formatPokemonName(pokemon.name)} woke up!`,
        damaged: false,
      };
    }

    nextPokemon.statusTurns = turnsRemaining - 1;
    return {
      pokemon: nextPokemon,
      message: `${formatPokemonName(pokemon.name)} is fast asleep!`,
      damaged: false,
    };
  }

  if (nextPokemon.status === "frozen") {
    if (Math.random() < 0.1) {
      nextPokemon.status = undefined;
      nextPokemon.statusTurns = 0;
      return {
        pokemon: nextPokemon,
        message: `${formatPokemonName(pokemon.name)} thawed out!`,
        damaged: false,
      };
    }

    return {
      pokemon: nextPokemon,
      message: `${formatPokemonName(pokemon.name)} is frozen solid!`,
      damaged: false,
    };
  }

  return { pokemon: nextPokemon, message: "", damaged: false };
}

function executeMove(
  attacker: BattlePokemon,
  defender: BattlePokemon,
  moveId: string,
  attackerIsPlayer: boolean,
): BattleResult {
  let nextAttacker = cloneBattlePokemon(attacker);
  let nextDefender = cloneBattlePokemon(defender);
  const messages: string[] = [];

  const requestedMoveSlot = getMoveSlot(nextAttacker, moveId);
  const move =
    requestedMoveSlot && requestedMoveSlot.currentPP > 0
      ? getMoveById(moveId)
      : STRUGGLE_MOVE;

  if (move.id !== "struggle") {
    nextAttacker = decrementMovePP(nextAttacker, move.id);
  }

  const moveUserName = attackerIsPlayer ? "Your" : "Enemy";
  messages.push(`${moveUserName} ${nextAttacker.name} used ${move.name}!`);

  if (!rollAccuracy(move, nextAttacker, nextDefender)) {
    messages.push("But it missed!");
    return {
      newAttacker: nextAttacker,
      newDefender: nextDefender,
      messages,
      knockedOut: false,
    };
  }

  if (move.category === "status") {
    const outcome = getStatusMoveOutcome(nextAttacker, nextDefender, move);
    nextAttacker = outcome.attacker;
    nextDefender = outcome.defender;
    messages.push(...outcome.messages);

    return {
      newAttacker: nextAttacker,
      newDefender: nextDefender,
      messages,
      knockedOut: false,
    };
  }

  const damage = calculateDamage(nextAttacker, nextDefender, move);
  nextDefender.currentHP = Math.max(0, nextDefender.currentHP - damage);
  messages.push(`${formatPokemonName(nextDefender.name)} took ${damage} damage!`);

  const typeEffectiveness = getTypeEffectiveness(move.type, getTypeList(nextDefender));
  if (typeEffectiveness === 0) {
    messages.push("It had no effect!");
  } else if (typeEffectiveness > 1) {
    messages.push("It's super effective!");
  } else if (typeEffectiveness < 1) {
    messages.push("It's not very effective...");
  }

  if (canApplySecondaryEffect(move) && nextDefender.currentHP > 0) {
    const statusMap: Partial<
      Record<Exclude<Move["effect"], undefined | "stat_boost">, BattleStatus>
    > = {
      paralyze: "paralyzed",
      burn: "burned",
      sleep: "asleep",
      poison: "poisoned",
      freeze: "frozen",
    };

    const status =
      move.effect && move.effect !== "stat_boost"
        ? move.effect === "poison" && move.id === "toxic"
          ? "badly_poisoned"
          : statusMap[move.effect]
        : undefined;
    if (status) {
      const statusResult = applyStatusEffect(nextDefender, status);
      nextDefender = statusResult.pokemon;
      messages.push(statusResult.message);
    }
  }

  if (
    (move.id === "mega-drain" || move.id === "leech-life" || move.id === "dream-eater") &&
    damage > 0
  ) {
    const recovered = Math.max(1, Math.floor(damage / 2));
    nextAttacker.currentHP = Math.min(nextAttacker.maxHP, nextAttacker.currentHP + recovered);
    messages.push(`${formatPokemonName(nextAttacker.name)} absorbed health!`);
  }

  if (move.id === "selfdestruct") {
    nextAttacker.currentHP = 0;
    messages.push(`${formatPokemonName(nextAttacker.name)} fainted from the blast!`);
  }

  if (move.id === "struggle") {
    const recoil = Math.max(1, Math.floor(damage / 2));
    nextAttacker.currentHP = Math.max(0, nextAttacker.currentHP - recoil);
    messages.push(`${formatPokemonName(nextAttacker.name)} is hit by recoil!`);
  }

  return {
    newAttacker: nextAttacker,
    newDefender: nextDefender,
    messages,
    knockedOut: nextDefender.currentHP <= 0,
  };
}

function calculateCatchRate(
  pokemon: BattlePokemon,
  ballModifier: number,
  statusModifier: number = getStatusModifier(pokemon.status),
): CatchResult {
  const pokemonData = getPokemonById(pokemon.pokemonId);
  const currentHP = Math.max(1, pokemon.currentHP);
  const missingHealthRatio = 1 - currentHP / pokemon.maxHP;
  const healthFactor = 0.08 + 0.92 * missingHealthRatio ** 1.75;
  const levelFactor = Math.max(0.25, 1 - (pokemon.level - 1) / 120);
  const chance = Math.max(
    0.01,
    Math.min(
      0.95,
      (pokemonData.catchRate / 255) *
        0.55 *
        healthFactor *
        ballModifier *
        statusModifier *
        levelFactor,
    ),
  );
  const caught = Math.random() < chance;

  return {
    caught,
    chance,
    message: caught
      ? `Gotcha! ${pokemon.name} was caught!`
      : `${pokemon.name} broke free!`,
  };
}

function calculateXP(
  defeatedPokemon: BattlePokemon,
  level: number,
  isWild: boolean,
) {
  const pokemonData = getPokemonById(defeatedPokemon.pokemonId);
  const battleTypeModifier = isWild ? 1 : 1.5;

  return Math.floor((pokemonData.baseXP * level) / 7 * battleTypeModifier);
}

function getAIMove(enemyPokemon: BattlePokemon, playerPokemon: BattlePokemon) {
  const usableMoves = enemyPokemon.moves.filter((move) => move.currentPP > 0);

  if (usableMoves.length === 0) {
    return "struggle";
  }

  const superEffectiveMoves = usableMoves.filter((moveSlot) => {
    const move = getMoveById(moveSlot.moveId);
    return getTypeEffectiveness(move.type, getTypeList(playerPokemon)) > 1;
  });

  if (superEffectiveMoves.length > 0 && Math.random() < 0.7) {
    return superEffectiveMoves[
      Math.floor(Math.random() * superEffectiveMoves.length)
    ].moveId;
  }

  return usableMoves[Math.floor(Math.random() * usableMoves.length)].moveId;
}

function checkEvolution(pokemon: BattlePokemon, currentLevel: number) {
  const pokemonData = getPokemonById(pokemon.pokemonId);

  if (!pokemonData.evolution) {
    return null;
  }

  if (pokemonData.evolution.level <= 0) {
    return null;
  }

  return currentLevel >= pokemonData.evolution.level
    ? pokemonData.evolution.evolvesTo
    : null;
}

export {
  createBattlePokemon,
  calculateDamage,
  applyStatStage,
  applyStatusEffect,
  processStatusEffects,
  executeMove,
  calculateCatchRate,
  calculateXP,
  getAIMove,
  checkEvolution,
};

export type { BattlePokemon, BattleState };
