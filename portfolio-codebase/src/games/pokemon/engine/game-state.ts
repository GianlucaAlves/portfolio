import {
  MOVES_DATA,
  POKEMON_DATA,
  SHOP_ITEMS,
  type Pokemon,
} from "../data/pokemon-data";
import {
  createBattlePokemon,
  checkEvolution,
  type BattlePokemon,
} from "./battle-system";

type OwnedStatus =
  | "paralyzed"
  | "burned"
  | "poisoned"
  | "badly_poisoned"
  | "asleep"
  | "frozen";

interface OwnedPokemon {
  pokemonId: number;
  nickname?: string;
  level: number;
  currentHP: number;
  xp: number;
  xpToNextLevel: number;
  moves: {
    moveId: string;
    currentPP: number;
    maxPP: number;
  }[];
  status?: OwnedStatus;
}

interface PlayerState {
  name: string;
  money: number;
  party: OwnedPokemon[];
  bag: { itemId: string; quantity: number }[];
  badges: string[];
  eliteFourProgress: number;
  isChampion: boolean;
  defeatedTrainers: string[];
  totalBattles: number;
  totalCaptures: number;
}

interface GameState {
  phase: "start" | "menu" | "battle" | "explore" | "shop" | "party" | "gameover";
  player: PlayerState;
  currentScreen: string;
  log: string[];
  pendingMoveQueue: PendingMoveLearning[];
}

interface PendingMoveLearning {
  partyIndex: number;
  pokemonId: number;
  pokemonName: string;
  level: number;
  moveId: string;
  moveName: string;
}

type WildZone = "forest" | "cave" | "sea" | "grass" | "mountain";

const SAVE_KEY = "pokemon-terminal-save";

const WILD_TABLES: Record<
  WildZone,
  { pokemonIds: number[]; minLevel: number; maxLevel: number }
> = {
  forest: {
    pokemonIds: [10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 25, 26, 35, 39, 46, 69, 43, 44],
    minLevel: 2,
    maxLevel: 15,
  },
  cave: {
    pokemonIds: [41, 42, 52, 53, 66, 67, 74, 75, 95, 104, 105],
    minLevel: 10,
    maxLevel: 30,
  },
  sea: {
    pokemonIds: [54, 55, 60, 61, 72, 73, 79, 80, 86, 87, 90, 91, 98, 99, 116, 117, 118, 119, 120, 121, 129, 130],
    minLevel: 15,
    maxLevel: 40,
  },
  grass: {
    pokemonIds: [1, 4, 7, 16, 17, 19, 20, 21, 22, 23, 24, 27, 28, 29, 32, 33, 36, 37, 38, 43, 44, 45, 46, 47, 48, 49, 50, 51, 56, 57, 58, 59, 63, 64, 69, 70, 84, 85, 102, 103, 114, 128, 132, 133, 137],
    minLevel: 3,
    maxLevel: 25,
  },
  mountain: {
    pokemonIds: [56, 57, 58, 59, 66, 67, 68, 74, 75, 76, 77, 78, 95, 111, 112],
    minLevel: 20,
    maxLevel: 45,
  },
};

function getPokemonById(pokemonId: number): Pokemon {
  const pokemon = POKEMON_DATA.find((entry) => entry.id === pokemonId);

  if (!pokemon) {
    throw new Error(`Pokemon not found: ${pokemonId}`);
  }

  return pokemon;
}

function getItemById(itemId: string) {
  return SHOP_ITEMS.find((item) => item.id === itemId);
}

function maxHpForOwnedPokemon(pokemonId: number, level: number) {
  return createBattlePokemon(pokemonId, level).maxHP;
}

function xpForLevel(level: number) {
  return Math.floor(level ** 3);
}

function appendLog(state: GameState, ...messages: string[]) {
  return {
    ...state,
    log: [...state.log, ...messages.filter(Boolean)],
  };
}

function createMoveSlot(moveId: string) {
  const move = MOVES_DATA[moveId];

  if (!move) {
    throw new Error(`Move not found: ${moveId}`);
  }

  return {
    moveId,
    currentPP: move.pp,
    maxPP: move.pp,
  };
}

function createOwnedPokemonFromBattle(battlePokemon: BattlePokemon): OwnedPokemon {
  return {
    pokemonId: battlePokemon.pokemonId,
    level: battlePokemon.level,
    currentHP: battlePokemon.currentHP,
    xp: xpForLevel(battlePokemon.level),
    xpToNextLevel: xpForLevel(battlePokemon.level + 1),
    moves: battlePokemon.moves.map((move) => ({ ...move })),
    status: battlePokemon.status,
  };
}

function syncOwnedMoves(currentMoves: OwnedPokemon["moves"]) {
  return currentMoves.map((move) => {
    const moveData = MOVES_DATA[move.moveId];

    if (!moveData) {
      return { ...move };
    }

    return {
      ...move,
      currentPP: Math.min(move.currentPP, moveData.pp),
      maxPP: moveData.pp,
    };
  });
}

function queueMoveLearning(
  state: GameState,
  partyIndex: number,
  pokemonId: number,
  level: number,
  moveId: string,
) {
  const move = MOVES_DATA[moveId];
  const species = getPokemonById(pokemonId);

  if (!move) {
    return state;
  }

  return {
    ...state,
    pendingMoveQueue: [
      ...state.pendingMoveQueue,
      {
        partyIndex,
        pokemonId,
        pokemonName: species.name,
        level,
        moveId,
        moveName: move.name,
      },
    ],
  };
}

function createNewGame(playerName: string, starterId: number): GameState {
  const starterBattle = createBattlePokemon(starterId, 5);
  const starter = createOwnedPokemonFromBattle(starterBattle);

  return {
    phase: "menu",
    currentScreen: "main_menu",
    log: [`Welcome, ${playerName}!`, `You chose ${starterBattle.name}!`],
    pendingMoveQueue: [],
    player: {
      name: playerName,
      money: 3000,
      party: [starter],
      bag: [{ itemId: "poke-ball", quantity: 5 }],
      badges: [],
      eliteFourProgress: 0,
      isChampion: false,
      defeatedTrainers: [],
      totalBattles: 0,
      totalCaptures: 0,
    },
  };
}

function gainXP(state: GameState, partyIndex: number, xp: number): GameState {
  const target = state.player.party[partyIndex];
  if (!target) {
    return appendLog(state, "That party slot is empty.");
  }

  let nextState: GameState = {
    ...state,
    player: {
      ...state.player,
      party: state.player.party.map((pokemon) => ({
        ...pokemon,
        moves: pokemon.moves.map((move) => ({ ...move })),
      })),
    },
    log: [...state.log],
  };

  const partyPokemon = nextState.player.party[partyIndex];
  partyPokemon.xp += xp;
  nextState.log.push(`${getPokemonById(partyPokemon.pokemonId).name} gained ${xp} XP!`);

  while (partyPokemon.xp >= partyPokemon.xpToNextLevel) {
    const oldMaxHP = maxHpForOwnedPokemon(partyPokemon.pokemonId, partyPokemon.level);

    partyPokemon.level += 1;
    partyPokemon.xpToNextLevel = xpForLevel(partyPokemon.level + 1);

    const levelData = createBattlePokemon(partyPokemon.pokemonId, partyPokemon.level);
    const newMaxHP = levelData.maxHP;
    const hpDelta = newMaxHP - oldMaxHP;
    partyPokemon.currentHP = Math.max(1, partyPokemon.currentHP + hpDelta);
    partyPokemon.moves = syncOwnedMoves(partyPokemon.moves);

    nextState.log.push(
      `${getPokemonById(partyPokemon.pokemonId).name} grew to Lv.${partyPokemon.level}!`,
    );

    const species = getPokemonById(partyPokemon.pokemonId);
    const learnedMoveIds = species.moves
      .filter((entry) => entry.level === partyPokemon.level)
      .map((entry) => entry.moveId);

    for (const moveId of learnedMoveIds) {
      if (partyPokemon.moves.some((move) => move.moveId === moveId)) {
        continue;
      }

      const moveName = MOVES_DATA[moveId]?.name ?? moveId;

      if (partyPokemon.moves.length < 4) {
        partyPokemon.moves = [...partyPokemon.moves, createMoveSlot(moveId)];
        nextState.log.push(`${species.name} learned ${moveName}!`);
        continue;
      }

      nextState.log.push(`${species.name} is trying to learn ${moveName}!`);
      nextState.log.push(`But ${species.name} can't learn more than 4 moves.`);
      nextState = queueMoveLearning(
        nextState,
        partyIndex,
        partyPokemon.pokemonId,
        partyPokemon.level,
        moveId,
      );
    }

    const evolvesTo = checkEvolution(
      {
        pokemonId: partyPokemon.pokemonId,
        name: species.name,
        level: partyPokemon.level,
        currentHP: partyPokemon.currentHP,
        maxHP: newMaxHP,
        stats: levelData.stats,
        moves: levelData.moves,
        status: partyPokemon.status,
        statStages: {
          attack: 0,
          defense: 0,
          speed: 0,
          special: 0,
          accuracy: 0,
          evasion: 0,
        },
      },
      partyPokemon.level,
    );

    if (evolvesTo) {
      const oldName = species.name;
      const evolved = getPokemonById(evolvesTo);
      const evolvedMaxHP = maxHpForOwnedPokemon(evolvesTo, partyPokemon.level);

      partyPokemon.pokemonId = evolvesTo;
      partyPokemon.currentHP = Math.min(evolvedMaxHP, Math.max(1, partyPokemon.currentHP));
      partyPokemon.moves = syncOwnedMoves(partyPokemon.moves);

      nextState.log.push(`${oldName} evolved into ${evolved.name}!`);
    }
  }

  return nextState;
}

function teachPendingMove(state: GameState, moveIndexToReplace: number): GameState {
  const pending = state.pendingMoveQueue[0];

  if (!pending) {
    return state;
  }

  const target = state.player.party[pending.partyIndex];
  if (!target || moveIndexToReplace < 0 || moveIndexToReplace >= target.moves.length) {
    return appendLog(state, "That move can't be replaced.");
  }

  const nextState: GameState = {
    ...state,
    player: {
      ...state.player,
      party: state.player.party.map((pokemon) => ({
        ...pokemon,
        moves: pokemon.moves.map((move) => ({ ...move })),
      })),
    },
    log: [...state.log],
    pendingMoveQueue: state.pendingMoveQueue.slice(1),
  };

  const partyPokemon = nextState.player.party[pending.partyIndex];
  const forgottenMove = partyPokemon.moves[moveIndexToReplace];
  partyPokemon.moves.splice(moveIndexToReplace, 1, createMoveSlot(pending.moveId));

  nextState.log.push(
    `${pending.pokemonName} forgot ${MOVES_DATA[forgottenMove.moveId]?.name ?? forgottenMove.moveId}!`,
  );
  nextState.log.push(`${pending.pokemonName} learned ${pending.moveName}!`);

  return nextState;
}

function skipPendingMove(state: GameState): GameState {
  const pending = state.pendingMoveQueue[0];

  if (!pending) {
    return state;
  }

  return appendLog(
    {
      ...state,
      pendingMoveQueue: state.pendingMoveQueue.slice(1),
    },
    `${pending.pokemonName} did not learn ${pending.moveName}.`,
  );
}

function addToParty(state: GameState, pokemon: OwnedPokemon): GameState {
  if (state.player.party.length >= 6) {
    return appendLog(state, "Party is full!");
  }

  return appendLog(
    {
      ...state,
      player: {
        ...state.player,
        party: [...state.player.party, { ...pokemon, moves: pokemon.moves.map((move) => ({ ...move })) }],
        totalCaptures: state.player.totalCaptures + 1,
      },
    },
    `${getPokemonById(pokemon.pokemonId).name} joined your party!`,
  );
}

function useItem(state: GameState, itemId: string, partyIndex: number): GameState {
  const item = getItemById(itemId);
  const bagEntry = state.player.bag.find((entry) => entry.itemId === itemId);
  const target = state.player.party[partyIndex];

  if (!bagEntry || bagEntry.quantity <= 0) {
    return appendLog(state, "You don't have that item!");
  }

  if (!item) {
    return appendLog(state, "That item does not exist.");
  }

  if (!target) {
    return appendLog(state, "That party slot is empty.");
  }

  if (item.effect === "pokeball") {
    return appendLog(state, "You can't use that item outside of battle!");
  }

  const nextState: GameState = {
    ...state,
    player: {
      ...state.player,
      party: state.player.party.map((pokemon) => ({
        ...pokemon,
        moves: pokemon.moves.map((move) => ({ ...move })),
      })),
      bag: state.player.bag
        .map((entry) =>
          entry.itemId === itemId ? { ...entry, quantity: entry.quantity - 1 } : entry,
        )
        .filter((entry) => entry.quantity > 0),
    },
    log: [...state.log],
  };

  const nextPokemon = nextState.player.party[partyIndex];
  const maxHP = maxHpForOwnedPokemon(nextPokemon.pokemonId, nextPokemon.level);

  if (item.effect === "heal") {
    nextPokemon.currentHP = Math.min(
      maxHP,
      nextPokemon.currentHP + (item.value >= 9999 ? maxHP : item.value),
    );
    nextState.log.push(`${getPokemonById(nextPokemon.pokemonId).name} recovered HP!`);
  } else if (item.effect === "revive") {
    if (nextPokemon.currentHP > 0) {
      nextState.log.push(`${getPokemonById(nextPokemon.pokemonId).name} does not need a Revive.`);
      return nextState;
    }

    nextPokemon.currentHP = Math.max(1, Math.floor(maxHP / 2));
    nextState.log.push(`${getPokemonById(nextPokemon.pokemonId).name} was revived!`);
  } else if (item.effect === "status_cure") {
    if (!nextPokemon.status) {
      nextState.log.push(`${getPokemonById(nextPokemon.pokemonId).name} has no status condition.`);
      return nextState;
    }

    nextPokemon.status = undefined;
    nextState.log.push(`${getPokemonById(nextPokemon.pokemonId).name} was cured!`);
  }

  return nextState;
}

function buyItem(state: GameState, itemId: string, quantity: number): GameState {
  const item = getItemById(itemId);

  if (!item || quantity <= 0) {
    return appendLog(state, "Invalid purchase.");
  }

  const totalCost = item.price * quantity;
  if (state.player.money < totalCost) {
    return appendLog(state, "Not enough money!");
  }

  const existing = state.player.bag.find((entry) => entry.itemId === itemId);

  return appendLog(
    {
      ...state,
      player: {
        ...state.player,
        money: state.player.money - totalCost,
        bag: existing
          ? state.player.bag.map((entry) =>
              entry.itemId === itemId
                ? { ...entry, quantity: entry.quantity + quantity }
                : entry,
            )
          : [...state.player.bag, { itemId, quantity }],
      },
    },
    `Bought ${quantity} ${item.name}${quantity > 1 ? "s" : ""}!`,
  );
}

function getRandomWildPokemon(zone: string): { pokemonId: number; level: number } {
  const table = WILD_TABLES[zone as WildZone] ?? WILD_TABLES.grass;
  const pokemonId =
    table.pokemonIds[Math.floor(Math.random() * table.pokemonIds.length)];
  const level =
    table.minLevel +
    Math.floor(Math.random() * (table.maxLevel - table.minLevel + 1));

  return { pokemonId, level };
}

function saveGame(state: GameState): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadGame(): GameState | null {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<GameState>;

    if (!parsed.player || !parsed.log || !parsed.currentScreen || !parsed.phase) {
      return null;
    }

    return {
      ...parsed,
      pendingMoveQueue: parsed.pendingMoveQueue ?? [],
      player: {
        ...parsed.player,
        badges: parsed.player.badges ?? [],
        eliteFourProgress: parsed.player.eliteFourProgress ?? 0,
        isChampion: parsed.player.isChampion ?? false,
      },
    } as GameState;
  } catch {
    return null;
  }
}

function getPartyStatus(state: GameState): string {
  const lines = ["  PARTY:"];

  state.player.party.forEach((pokemon, index) => {
    const species = getPokemonById(pokemon.pokemonId);
    const maxHP = maxHpForOwnedPokemon(pokemon.pokemonId, pokemon.level);
    const alive = pokemon.currentHP > 0;
    const status = alive ? "♥" : "✝ (fainted)";
    const name = (pokemon.nickname ?? species.name).padEnd(10, " ");
    const level = `Lv.${pokemon.level}`.padEnd(6, " ");
    const hp = `HP: ${pokemon.currentHP}/${maxHP}`.padEnd(11, " ");

    lines.push(`  ${index + 1}. ${name} ${level} ${hp} ${status}`);
  });

  return lines.join("\n");
}

export {
  createNewGame,
  gainXP,
  teachPendingMove,
  skipPendingMove,
  addToParty,
  useItem,
  buyItem,
  getRandomWildPokemon,
  saveGame,
  loadGame,
  getPartyStatus,
};

export type { OwnedPokemon, PlayerState, GameState, PendingMoveLearning };
