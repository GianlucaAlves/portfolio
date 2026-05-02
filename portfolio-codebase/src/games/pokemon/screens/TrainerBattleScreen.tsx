import { useEffect, useMemo, useRef, useState } from "react";
import MobileGameControls from "../../../components/MobileGameControls";
import {
  TRAINERS,
  type Trainer,
} from "../data/pokemon-data";
import {
  createBattlePokemon,
  type BattlePokemon,
} from "../engine/battle-system";
import {
  gainXP,
  type GameState,
  type OwnedPokemon,
} from "../engine/game-state";
import BattleScreen from "./BattleScreen";

type TrainerBattleScreenProps = {
  gameState: GameState;
  onBattleEnd: (updatedState: GameState) => void;
  onExit: () => void;
};

type TrainerBattlePhase =
  | "select"
  | "dialogue"
  | "battle"
  | "trainer_switch"
  | "player_switch"
  | "result";

type BattleSession = {
  key: number;
  playerPokemon: BattlePokemon;
  enemyPokemon: BattlePokemon;
};

function cloneOwnedPokemon(pokemon: OwnedPokemon): OwnedPokemon {
  return {
    ...pokemon,
    moves: pokemon.moves.map((move) => ({ ...move })),
  };
}

function cloneGameState(gameState: GameState): GameState {
  return {
    ...gameState,
    pendingMoveQueue: [...gameState.pendingMoveQueue],
    player: {
      ...gameState.player,
      party: gameState.player.party.map(cloneOwnedPokemon),
      bag: gameState.player.bag.map((item) => ({ ...item })),
      defeatedTrainers: [...gameState.player.defeatedTrainers],
    },
    log: [...gameState.log],
  };
}

function appendLog(gameState: GameState, ...messages: string[]): GameState {
  return {
    ...gameState,
    log: [...gameState.log, ...messages.filter(Boolean)],
  };
}

function firstHealthyPartyIndex(party: OwnedPokemon[]) {
  return party.findIndex((pokemon) => pokemon.currentHP > 0);
}

function maxHpAtLevel(pokemonId: number, level: number) {
  return createBattlePokemon(pokemonId, level).maxHP;
}

function ownedToBattlePokemon(owned: OwnedPokemon): BattlePokemon {
  const base = createBattlePokemon(owned.pokemonId, owned.level);

  return {
    ...base,
    currentHP: owned.currentHP,
    moves: owned.moves.map((move) => ({ ...move })),
    status: owned.status,
  };
}

function getPokemonName(pokemonId: number, level: number) {
  return createBattlePokemon(pokemonId, level).name;
}

function getBattlePartySummary(party: OwnedPokemon[]) {
  return party.map((pokemon, index) => ({
    index,
    name: getPokemonName(pokemon.pokemonId, pokemon.level),
    maxHP: maxHpAtLevel(pokemon.pokemonId, pokemon.level),
    ...pokemon,
  }));
}

function normalizeVisibleLog(messages: string[]) {
  return messages.filter(Boolean).slice(-8);
}

export default function TrainerBattleScreen({
  gameState,
  onBattleEnd,
  onExit,
}: TrainerBattleScreenProps) {
  const [workingState, setWorkingState] = useState<GameState>(() =>
    cloneGameState(gameState),
  );
  const [phase, setPhase] = useState<TrainerBattlePhase>("select");
  const [selectedTrainerIndex, setSelectedTrainerIndex] = useState(0);
  const [visibleLog, setVisibleLog] = useState<string[]>([]);
  const [awaitAnyKey, setAwaitAnyKey] = useState(false);
  const [battleSession, setBattleSession] = useState<BattleSession | null>(null);
  const phaseRef = useRef<TrainerBattlePhase>("select");
  const trainerIndexRef = useRef(0);
  const currentTrainerRef = useRef<Trainer | null>(null);
  const enemyPartyIndexRef = useRef(0);
  const activePlayerIndexRef = useRef(0);
  const participantsRef = useRef<Set<number>>(new Set());
  const accumulatedXPRef = useRef(0);
  const workingStateRef = useRef<GameState>(cloneGameState(gameState));
  const timeoutRef = useRef<number[]>([]);
  const battleKeyRef = useRef(0);

  const availableTrainers = useMemo(
    () =>
      TRAINERS.filter(
        (trainer) =>
          !workingState.player.defeatedTrainers.includes(trainer.id),
      ),
    [workingState.player.defeatedTrainers],
  );

  function syncPhase(nextPhase: TrainerBattlePhase) {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }

  function clearTimers() {
    timeoutRef.current.forEach((id) => window.clearTimeout(id));
    timeoutRef.current = [];
  }

  function schedule(delay: number, callback: () => void) {
    const id = window.setTimeout(callback, delay);
    timeoutRef.current.push(id);
  }

  function setStateAndRef(nextState: GameState) {
    workingStateRef.current = nextState;
    setWorkingState(nextState);
  }

  function finishWithState(nextState: GameState) {
    clearTimers();
    setStateAndRef(nextState);
    onBattleEnd(nextState);
  }

  function updateVisibleLog(...messages: string[]) {
    setVisibleLog(normalizeVisibleLog(messages));
  }

  function pickActiveIndex(party: OwnedPokemon[]) {
    const currentIndex = activePlayerIndexRef.current;
    const currentPokemon = party[currentIndex];

    if (currentPokemon && currentPokemon.currentHP > 0) {
      return currentIndex;
    }

    return Math.max(0, firstHealthyPartyIndex(party));
  }

  function markParticipants(previousParty: OwnedPokemon[], nextParty: OwnedPokemon[]) {
    const ppChangedIndexes: number[] = [];

    nextParty.forEach((pokemon, index) => {
      const previous = previousParty[index];
      if (!previous) {
        return;
      }

      const ppChanged = pokemon.moves.some((move, moveIndex) => {
        const previousMove = previous.moves[moveIndex];
        return previousMove && previousMove.currentPP !== move.currentPP;
      });

      const hpDropped = pokemon.currentHP < previous.currentHP;
      const statusChanged = pokemon.status !== previous.status;

      if (ppChanged || hpDropped || statusChanged) {
        participantsRef.current.add(index);
      }

      if (ppChanged) {
        ppChangedIndexes.push(index);
      }
    });

    if (ppChangedIndexes.length === 1) {
      activePlayerIndexRef.current = ppChangedIndexes[0];
    }
  }

  function syncBattleState(
    party: OwnedPokemon[],
    bag: { itemId: string; quantity: number }[],
  ) {
    const previousState = workingStateRef.current;
    markParticipants(previousState.player.party, party);

    const nextState: GameState = {
      ...previousState,
      player: {
        ...previousState.player,
        party: party.map(cloneOwnedPokemon),
        bag: bag.map((item) => ({ ...item })),
      },
    };

    setStateAndRef(nextState);
  }

  function launchBattle(enemyPartyIndex: number) {
    const trainer = currentTrainerRef.current;
    if (!trainer) {
      return;
    }

    const playerIndex = pickActiveIndex(workingStateRef.current.player.party);
    const activeOwned = workingStateRef.current.player.party[playerIndex];
    const enemySlot = trainer.party[enemyPartyIndex];

    if (!activeOwned || !enemySlot) {
      return;
    }

    activePlayerIndexRef.current = playerIndex;
    participantsRef.current.add(playerIndex);
    battleKeyRef.current += 1;
    setBattleSession({
      key: battleKeyRef.current,
      playerPokemon: ownedToBattlePokemon(activeOwned),
      enemyPokemon: createBattlePokemon(enemySlot.pokemonId, enemySlot.level),
    });
    syncPhase("battle");
  }

  function startTrainerBattle(trainer: Trainer) {
    const activeIndex = firstHealthyPartyIndex(workingStateRef.current.player.party);

    if (activeIndex < 0) {
      const blackoutState = appendLog(
        cloneGameState(workingStateRef.current),
        "All your Pokémon have fainted!",
        "You need to heal your party before battling.",
      );
      setStateAndRef(blackoutState);
      syncPhase("result");
      setAwaitAnyKey(true);
      updateVisibleLog(
        "▸ All your Pokémon have fainted!",
        "▸ You need to heal your party before battling.",
        "▸ Press any key to continue.",
      );
      return;
    }

    currentTrainerRef.current = trainer;
    enemyPartyIndexRef.current = 0;
    activePlayerIndexRef.current = activeIndex;
    participantsRef.current = new Set([activeIndex]);
    accumulatedXPRef.current = 0;
    setBattleSession(null);
    setAwaitAnyKey(true);
    syncPhase("dialogue");
    updateVisibleLog(
      `▸ ${trainer.name}: "${trainer.dialogue.before}"`,
      `▸ ${trainer.name} wants to fight!`,
      "▸ Press any key to start.",
    );
  }

  function finishVictory() {
    const trainer = currentTrainerRef.current;
    if (!trainer) {
      return;
    }

    let nextState = cloneGameState(workingStateRef.current);
    nextState = {
      ...nextState,
      player: {
        ...nextState.player,
        money: nextState.player.money + trainer.reward.money,
        defeatedTrainers: [...nextState.player.defeatedTrainers, trainer.id],
        totalBattles: nextState.player.totalBattles + 1,
      },
    };

    const baselineLogLength = nextState.log.length;
    for (const partyIndex of [...participantsRef.current].sort((a, b) => a - b)) {
      nextState = gainXP(nextState, partyIndex, accumulatedXPRef.current);
    }

    const xpAndEvolutionMessages = nextState.log.slice(baselineLogLength);
    nextState = appendLog(
      nextState,
      `You defeated ${trainer.name}!`,
      `${trainer.name}: "${trainer.dialogue.after}"`,
      `You got $${trainer.reward.money}!`,
    );

    setStateAndRef(nextState);
    syncPhase("result");
    setAwaitAnyKey(true);
    updateVisibleLog(
      `▸ You defeated ${trainer.name}!`,
      `▸ ${trainer.name}: "${trainer.dialogue.after}"`,
      `▸ You got $${trainer.reward.money}!`,
      ...xpAndEvolutionMessages.slice(-3).map((message) => `▸ ${message}`),
      "▸ Press any key to continue.",
    );
  }

  function finishDefeat() {
    const trainer = currentTrainerRef.current;
    let nextState = cloneGameState(workingStateRef.current);

    nextState = {
      ...nextState,
      player: {
        ...nextState.player,
        party: nextState.player.party.map((pokemon) => ({
          ...pokemon,
          currentHP: 1,
          status: undefined,
        })),
      },
    };
    nextState = appendLog(
      nextState,
      "All your Pokémon fainted!",
      trainer ? `${trainer.name}: "${trainer.dialogue.after}"` : "",
      "You blacked out!",
      "You were taken to the last safe place...",
    );

    setStateAndRef(nextState);
    syncPhase("result");
    setAwaitAnyKey(true);
    updateVisibleLog(
      "▸ All your Pokémon fainted!",
      trainer ? `▸ ${trainer.name}: "${trainer.dialogue.after}"` : "",
      "▸ You blacked out!",
      "▸ You were taken to the last safe place...",
      "▸ Press any key to continue.",
    );
  }

  function handleSingleBattleEnd(result: {
    outcome: "win" | "lose" | "flee";
    xpGained?: number;
    moneyGained?: number;
    caughtPokemon?: OwnedPokemon;
  }) {
    const trainer = currentTrainerRef.current;
    if (!trainer) {
      return;
    }

    setBattleSession(null);

    if (result.outcome === "lose") {
      finishDefeat();
      return;
    }

    if (result.outcome === "flee") {
      syncPhase("result");
      setAwaitAnyKey(true);
      updateVisibleLog(
        "▸ You can't run from a trainer battle!",
        "▸ Press any key to continue.",
      );
      return;
    }

    accumulatedXPRef.current += result.xpGained ?? 0;

    const nextEnemyIndex = enemyPartyIndexRef.current + 1;
    if (nextEnemyIndex >= trainer.party.length) {
      finishVictory();
      return;
    }

    enemyPartyIndexRef.current = nextEnemyIndex;
    const nextEnemy = trainer.party[nextEnemyIndex];
    const nextEnemyName = getPokemonName(nextEnemy.pokemonId, nextEnemy.level);

    syncPhase("trainer_switch");
    updateVisibleLog(
      `▸ ${trainer.name}: "${getPokemonName(
        trainer.party[nextEnemyIndex - 1].pokemonId,
        trainer.party[nextEnemyIndex - 1].level,
      )}, return!"`,
      `▸ ${trainer.name} sent out ${nextEnemyName.toUpperCase()}!`,
    );

    schedule(1200, () => {
      launchBattle(nextEnemyIndex);
    });
  }

  useEffect(() => {
    workingStateRef.current = cloneGameState(gameState);
  }, [gameState]);

  useEffect(() => {
    trainerIndexRef.current = selectedTrainerIndex;
  }, [selectedTrainerIndex]);

  useEffect(() => {
    return () => clearTimers();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (phaseRef.current === "battle" || phaseRef.current === "trainer_switch") {
        return;
      }

      if (awaitAnyKey) {
        event.preventDefault();
        setAwaitAnyKey(false);

        if (phaseRef.current === "dialogue") {
          launchBattle(0);
          return;
        }

        if (phaseRef.current === "result") {
          finishWithState(workingStateRef.current);
        }

        return;
      }

      if (phaseRef.current === "select") {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          if (availableTrainers.length > 0) {
            setSelectedTrainerIndex(
              (current) => (current + availableTrainers.length - 1) % availableTrainers.length,
            );
          }
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          if (availableTrainers.length > 0) {
            setSelectedTrainerIndex(
              (current) => (current + 1) % availableTrainers.length,
            );
          }
          return;
        }

        if (event.key === "Enter") {
          event.preventDefault();
          const trainer = availableTrainers[trainerIndexRef.current];
          if (trainer) {
            startTrainerBattle(trainer);
          }
          return;
        }

        if (event.key === "Escape" || event.key.toLowerCase() === "q") {
          event.preventDefault();
          onExit();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [availableTrainers, awaitAnyKey, gameState, onExit]);

  const partySummary = getBattlePartySummary(workingState.player.party);

  if (phase === "battle" && battleSession) {
    return (
      <div className="w-full h-full min-h-[36rem] flex flex-col justify-center">
        <BattleScreen
          key={battleSession.key}
          playerPokemon={battleSession.playerPokemon}
          enemyPokemon={battleSession.enemyPokemon}
          isWild={false}
          trainerName={currentTrainerRef.current?.name}
          playerParty={workingState.player.party}
          playerBag={workingState.player.bag}
          onStateSync={syncBattleState}
          onBattleEnd={handleSingleBattleEnd}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[36rem] flex flex-col justify-between gap-4 font-mono text-green-300">
      <div className="space-y-4">
        <div className="text-green-100 text-lg">BATTLE</div>
        <div className="border-t border-green-500/30" />

        {phase === "select" ? (
          <div className="space-y-4">
            <div>Choose a trainer to battle:</div>
            <div className="space-y-1">
              {availableTrainers.length > 0 ? (
                availableTrainers.map((trainer, index) => (
                  <div key={trainer.id}>
                    {selectedTrainerIndex === index ? "> " : "  "}
                    {index + 1}. {trainer.name.padEnd(18, " ")} (Party:{" "}
                    {trainer.party.length}) ${trainer.reward.money}
                  </div>
                ))
              ) : (
                <div className="text-green-600">
                  All trainers defeated! Come back after exploring.
                </div>
              )}
            </div>
            <div className="text-xs text-green-600">
              [↑↓] Navegar   [Enter] Desafiar   [ESC] Voltar
            </div>
          </div>
        ) : null}

        {phase !== "battle" ? (
          <div className="space-y-2 text-sm sm:text-base">
            {visibleLog.map((message, index) => (
              <div key={`${message}-${index}`}>{message}</div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="border border-green-500/30 p-3 text-xs sm:text-sm">
        {partySummary.map((pokemon) => (
          <div key={`${pokemon.pokemonId}-${pokemon.index}`}>
            {pokemon.index + 1}. {pokemon.nickname ?? pokemon.name} Lv.{pokemon.level} HP:{" "}
            {pokemon.currentHP}/{pokemon.maxHP}
            {pokemon.currentHP <= 0 ? " (fainted)" : ""}
          </div>
        ))}
      </div>
      <MobileGameControls
        actions={[
          { key: "Enter", label: "A", accent: "primary" },
          { key: "Escape", label: "B" },
        ]}
      />
    </div>
  );
}
