import { useEffect, useMemo, useRef, useState } from "react";
import MobileGameControls from "../../../components/MobileGameControls";
import { createBattlePokemon, type BattlePokemon } from "../engine/battle-system";
import {
  addToParty,
  gainXP,
  getRandomWildPokemon,
  type GameState,
  type OwnedPokemon,
} from "../engine/game-state";
import BattleScreen from "./BattleScreen";

type ExploreScreenProps = {
  gameState: GameState;
  onExploreEnd: (updatedState: GameState) => void;
  onExit: () => void;
};

type ExplorePhase =
  | "zone_select"
  | "walking"
  | "encounter"
  | "battle"
  | "result";

type ZoneKey = "forest" | "grass" | "cave" | "mountain" | "sea";

type BattleContext = {
  zone: ZoneKey;
  playerPartyIndex: number;
  enemyPokemon: BattlePokemon;
};

const ZONES: {
  key: ZoneKey | "center";
  label: string;
  range: string;
  icon: string;
}[] = [
  { key: "forest", label: "Forest", range: "Lv. 2-15", icon: "🌲" },
  { key: "grass", label: "Grass", range: "Lv. 3-25", icon: "🌿" },
  { key: "cave", label: "Cave", range: "Lv. 10-30", icon: "🪨" },
  { key: "mountain", label: "Mountain", range: "Lv. 20-45", icon: "⛰" },
  { key: "sea", label: "Sea", range: "Lv. 15-40", icon: "🌊" },
  {
    key: "center",
    label: "Pokémon Center",
    range: "Cure all Pokémon — FREE",
    icon: "+",
  },
];

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

function ownedToBattlePokemon(owned: OwnedPokemon): BattlePokemon {
  const base = createBattlePokemon(owned.pokemonId, owned.level);

  return {
    ...base,
    currentHP: owned.currentHP,
    moves: owned.moves.map((move) => ({ ...move })),
    status: owned.status,
  };
}

function maxHpAtLevel(pokemonId: number, level: number) {
  return createBattlePokemon(pokemonId, level).maxHP;
}

function restoreAtCenter(gameState: GameState) {
  return {
    ...gameState,
    player: {
      ...gameState.player,
      party: gameState.player.party.map((pokemon) => {
        const full = createBattlePokemon(pokemon.pokemonId, pokemon.level);
        return {
          ...pokemon,
          currentHP: full.maxHP,
          moves: full.moves.map((move) => ({
            moveId: move.moveId,
            currentPP: move.maxPP,
            maxPP: move.maxPP,
          })),
          status: undefined,
        };
      }),
    },
  };
}

function reviveAfterBlackout(gameState: GameState) {
  return {
    ...gameState,
    player: {
      ...gameState.player,
      party: gameState.player.party.map((pokemon) => ({
        ...pokemon,
        currentHP: 1,
        status: undefined,
      })),
    },
  };
}

export default function ExploreScreen({
  gameState,
  onExploreEnd,
  onExit,
}: ExploreScreenProps) {
  const [workingState, setWorkingState] = useState<GameState>(() =>
    cloneGameState(gameState),
  );
  const [phase, setPhase] = useState<ExplorePhase>("zone_select");
  const [zoneIndex, setZoneIndex] = useState(0);
  const [visibleLog, setVisibleLog] = useState<string[]>([]);
  const [awaitAnyKey, setAwaitAnyKey] = useState(false);
  const [battleContext, setBattleContext] = useState<BattleContext | null>(null);
  const phaseRef = useRef<ExplorePhase>("zone_select");
  const zoneRef = useRef<number>(0);
  const workingStateRef = useRef<GameState>(cloneGameState(gameState));
  const timeoutRef = useRef<number[]>([]);

  const lastLogs = useMemo(() => visibleLog.slice(-4), [visibleLog]);

  function syncPhase(nextPhase: ExplorePhase) {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }

  function clearTimers() {
    timeoutRef.current.forEach((id) => window.clearTimeout(id));
    timeoutRef.current = [];
  }

  function setStateAndRef(nextState: GameState) {
    workingStateRef.current = nextState;
    setWorkingState(nextState);
  }

  function schedule(delay: number, callback: () => void) {
    const id = window.setTimeout(callback, delay);
    timeoutRef.current.push(id);
  }

  function pushVisibleLog(...messages: string[]) {
    setVisibleLog((current) => [...current, ...messages.filter(Boolean)].slice(-8));
  }

  function finishAndExit(nextState: GameState) {
    clearTimers();
    workingStateRef.current = nextState;
    onExploreEnd(nextState);
    onExit();
  }

  function returnToZoneSelect(...messages: string[]) {
    syncPhase("zone_select");
    setAwaitAnyKey(false);
    if (messages.length > 0) {
      pushVisibleLog(...messages);
    }
  }

  function syncBattleState(
    party: OwnedPokemon[],
    bag: { itemId: string; quantity: number }[],
  ) {
    const nextState = {
      ...workingStateRef.current,
      player: {
        ...workingStateRef.current.player,
        party: party.map(cloneOwnedPokemon),
        bag: bag.map((item) => ({ ...item })),
      },
    };
    setStateAndRef(nextState);
  }

  function runPokemonCenter() {
    clearTimers();
    syncPhase("walking");
    setVisibleLog([]);

    const messages = [
      "Welcome to the Pokémon Center!",
      "We'll take your Pokémon for a while...",
      "...",
      "Your Pokémon have been restored to full health!",
      "Please come again!",
    ];

    messages.forEach((message, index) => {
      schedule(index * 800, () => {
        pushVisibleLog(`▸ ${message}`);
      });
    });

    schedule(messages.length * 800, () => {
      const healedState = restoreAtCenter(workingStateRef.current);
      const updated = appendLog(healedState, ...messages);
      setStateAndRef(updated);
      finishAndExit(updated);
    });
  }

  function startZoneWalk(zone: ZoneKey) {
    const activePartyIndex = firstHealthyPartyIndex(workingStateRef.current.player.party);

    if (activePartyIndex < 0) {
      syncPhase("result");
      setVisibleLog([
        "▸ All your Pokémon have fainted!",
        "▸ Visit a Pokémon Center before exploring.",
        "▸ Press any key to return.",
      ]);
      setAwaitAnyKey(true);
      return;
    }

    clearTimers();
    syncPhase("walking");
    setVisibleLog([]);

    const zoneName = ZONES.find((entry) => entry.key === zone)?.label ?? zone;
    const introMessages = [
      `You enter the ${zoneName}...`,
      "Walking through tall grass...",
      "...",
    ];

    introMessages.forEach((message, index) => {
      schedule(index * 800, () => {
        pushVisibleLog(`▸ ${message}`);
      });
    });

    schedule(introMessages.length * 800, () => {
      if (Math.random() > 0.7) {
        syncPhase("result");
        setVisibleLog((current) => [
          ...current,
          "▸ You walked for a while but found nothing...",
          "▸ Press any key to continue.",
        ]);
        setAwaitAnyKey(true);
        return;
      }

      const wild = getRandomWildPokemon(zone);
      const enemyPokemon = createBattlePokemon(wild.pokemonId, wild.level);
      setBattleContext({
        zone,
        playerPartyIndex: activePartyIndex,
        enemyPokemon,
      });
      syncPhase("encounter");
      setVisibleLog((current) => [
        ...current,
        `▸ A wild ${enemyPokemon.name.toUpperCase()} appeared! (Lv. ${enemyPokemon.level})`,
      ]);

      schedule(1000, () => {
        syncPhase("battle");
      });
    });
  }

  function handleBattleEnd(result: {
    outcome: "win" | "lose" | "flee";
    xpGained?: number;
    moneyGained?: number;
    caughtPokemon?: OwnedPokemon;
  }) {
    if (!battleContext) return;

    let nextState = cloneGameState(workingStateRef.current);
    syncPhase("result");
    setBattleContext(null);

    if (result.outcome === "win") {
      if (typeof result.xpGained === "number") {
        nextState = gainXP(nextState, battleContext.playerPartyIndex, result.xpGained);
      }

      const messages: string[] = [];

      if (result.caughtPokemon) {
        if (nextState.player.party.length >= 6) {
          messages.push(
            `▸ Your party is full! ${result.caughtPokemon.nickname ?? createBattlePokemon(result.caughtPokemon.pokemonId, result.caughtPokemon.level).name.toUpperCase()} was released...`,
          );
        } else {
          nextState = addToParty(nextState, result.caughtPokemon);
          messages.push(
            `▸ ${createBattlePokemon(result.caughtPokemon.pokemonId, result.caughtPokemon.level).name.toUpperCase()} was added to your party!`,
          );
        }
      } else {
        messages.push("▸ You won the battle!");
      }

      nextState = appendLog(nextState, ...messages.map((message) => message.replace(/^▸\s*/, "")));
      setStateAndRef(nextState);
      setVisibleLog(messages.length > 0 ? messages : ["▸ Battle complete!"]);
      setAwaitAnyKey(true);
      return;
    }

    if (result.outcome === "lose") {
      const recoveredState = appendLog(
        reviveAfterBlackout(nextState),
        "You blacked out!",
        "You were taken to the last safe place...",
      );
      setStateAndRef(recoveredState);
      setVisibleLog([
        "▸ You blacked out!",
        "▸ You were taken to the last safe place...",
      ]);
      finishAndExit(recoveredState);
      return;
    }

    if (result.outcome === "flee") {
      const updatedState = appendLog(nextState, "Got away safely!");
      setStateAndRef(updatedState);
      setVisibleLog(["▸ Got away safely!"]);
      setAwaitAnyKey(true);
    }
  }

  useEffect(() => {
    zoneRef.current = zoneIndex;
  }, [zoneIndex]);

  useEffect(() => {
    workingStateRef.current = workingState;
  }, [workingState]);

  useEffect(() => {
    return () => clearTimers();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (phaseRef.current === "battle" || phaseRef.current === "walking") {
        return;
      }

      if (awaitAnyKey) {
        event.preventDefault();
        returnToZoneSelect();
        return;
      }

      if (phaseRef.current === "zone_select") {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          setZoneIndex((current) => (current + ZONES.length - 1) % ZONES.length);
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          setZoneIndex((current) => (current + 1) % ZONES.length);
          return;
        }

        if (event.key === "Enter") {
          event.preventDefault();
          const selected = ZONES[zoneRef.current];
          if (!selected) return;

          if (selected.key === "center") {
            runPokemonCenter();
            return;
          }

          startZoneWalk(selected.key);
          return;
        }

        if (event.key === "Escape" || event.key.toLowerCase() === "q") {
          event.preventDefault();
          finishAndExit(workingState);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [awaitAnyKey, workingState]);

  if (phase === "battle" && battleContext) {
    const activeOwned = workingState.player.party[battleContext.playerPartyIndex];

    return (
      <div className="w-full h-full min-h-[36rem] flex flex-col justify-center">
        <BattleScreen
          playerPokemon={ownedToBattlePokemon(activeOwned)}
          enemyPokemon={battleContext.enemyPokemon}
          isWild
          playerParty={workingState.player.party}
          playerBag={workingState.player.bag}
          onStateSync={syncBattleState}
          onBattleEnd={handleBattleEnd}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[36rem] flex flex-col justify-between gap-4 font-mono text-green-300">
      <div className="space-y-4">
        <div className="text-green-100 text-lg">EXPLORE</div>
        <div className="border-t border-green-500/30" />

        {phase === "zone_select" ? (
          <div className="space-y-4">
            <div>Choose a zone:</div>
            <div className="space-y-1">
              {ZONES.map((zone, index) => (
                <div key={zone.key}>
                  {zoneIndex === index ? "> " : "  "}
                  {index + 1}. {zone.label.padEnd(14, " ")} ({zone.range}){" "}
                  <span className="text-green-600">{zone.icon}</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-green-600">
              [↑↓] Navegar   [Enter] Entrar   [ESC] Voltar
            </div>
          </div>
        ) : null}

        {phase === "walking" || phase === "encounter" || phase === "result" ? (
          <div className="space-y-2 text-sm sm:text-base">
            {lastLogs.map((message, index) => (
              <div key={`${message}-${index}`}>{message}</div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="border border-green-500/30 p-3 text-xs sm:text-sm">
        {workingState.player.party.map((pokemon, index) => (
          <div key={`${pokemon.pokemonId}-${index}`}>
            {index + 1}. {createBattlePokemon(pokemon.pokemonId, pokemon.level).name} Lv.
            {pokemon.level} HP: {pokemon.currentHP}/
            {maxHpAtLevel(pokemon.pokemonId, pokemon.level)}
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
