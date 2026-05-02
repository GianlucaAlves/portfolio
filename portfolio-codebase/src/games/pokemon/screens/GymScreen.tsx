import { useEffect, useMemo, useRef, useState } from "react";
import MobileGameControls from "../../../components/MobileGameControls";
import {
  ELITE_FOUR,
  GYM_LEADERS,
  MOVES_DATA,
  type EliteFour,
  type GymLeader,
} from "../data/pokemon-data";
import { createBattlePokemon, type BattlePokemon } from "../engine/battle-system";
import { gainXP, type GameState, type OwnedPokemon } from "../engine/game-state";
import BattleScreen from "./BattleScreen";

type GymScreenProps = {
  gameState: GameState;
  onGymEnd: (updatedState: GameState) => void;
  onExit: () => void;
};

type GymPhase =
  | "select"
  | "dialogue"
  | "battle"
  | "result"
  | "league_intro"
  | "elite_battle"
  | "champion"
  | "ending";

type BattleSession = {
  key: number;
  playerPokemon: BattlePokemon;
  enemyPokemon: BattlePokemon;
};

type OpponentKind = "gym" | "elite";

type CurrentOpponent = {
  kind: OpponentKind;
  gymLeader?: GymLeader;
  eliteMember?: EliteFour;
};

type SelectionOption =
  | {
      key: string;
      type: "leader";
      leader: GymLeader;
    }
  | {
      key: string;
      type: "league";
      leader: null;
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
      badges: [...gameState.player.badges],
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

function badgeIdFromName(badgeName: string) {
  return badgeName.toLowerCase().replace(/\s+badge$/, "").replace(/\s+/g, "-");
}

function firstHealthyPartyIndex(party: OwnedPokemon[]) {
  return party.findIndex((pokemon) => pokemon.currentHP > 0);
}

function maxHpAtLevel(pokemonId: number, level: number) {
  return createBattlePokemon(pokemonId, level).maxHP;
}

function normalizeMoveId(move: string) {
  const normalized = move
    .toLowerCase()
    .replace(/[().']/g, "")
    .replace(/\s+/g, "-");

  const aliases: Record<string, string> = {
    bubblebeam: "bubble-beam",
    thunderpunch: "thunder-punch",
  };

  return aliases[normalized] ?? normalized;
}

function createConfiguredBattlePokemon(
  pokemonId: number,
  level: number,
  moves: string[],
): BattlePokemon {
  const base = createBattlePokemon(pokemonId, level);
  const mappedMoves = moves
    .map((moveName) => {
      const moveId = normalizeMoveId(moveName);
      const moveData = MOVES_DATA[moveId];

      if (!moveData) {
        return null;
      }

      return {
        moveId,
        currentPP: moveData.pp,
        maxPP: moveData.pp,
      };
    })
    .filter((move): move is NonNullable<typeof move> => Boolean(move));

  return {
    ...base,
    moves: mappedMoves.length > 0 ? mappedMoves.slice(0, 4) : base.moves,
  };
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

function getBattlePartySummary(party: OwnedPokemon[]) {
  return party.map((pokemon, index) => ({
    index,
    name: createBattlePokemon(pokemon.pokemonId, pokemon.level).name,
    maxHP: maxHpAtLevel(pokemon.pokemonId, pokemon.level),
    ...pokemon,
  }));
}

function normalizeVisibleLog(messages: string[]) {
  return messages.filter(Boolean).slice(-10);
}

function getPokedexCount(state: GameState) {
  return new Set(state.player.party.map((pokemon) => pokemon.pokemonId)).size;
}

export default function GymScreen({ gameState, onGymEnd, onExit }: GymScreenProps) {
  const [workingState, setWorkingState] = useState<GameState>(() => cloneGameState(gameState));
  const [phase, setPhase] = useState<GymPhase>("select");
  const [selectionIndex, setSelectionIndex] = useState(0);
  const [visibleLog, setVisibleLog] = useState<string[]>([]);
  const [awaitAnyKey, setAwaitAnyKey] = useState(false);
  const [battleSession, setBattleSession] = useState<BattleSession | null>(null);
  const phaseRef = useRef<GymPhase>("select");
  const selectionRef = useRef(0);
  const opponentRef = useRef<CurrentOpponent | null>(null);
  const enemyPartyIndexRef = useRef(0);
  const activePlayerIndexRef = useRef(0);
  const participantsRef = useRef<Set<number>>(new Set());
  const accumulatedXPRef = useRef(0);
  const workingStateRef = useRef<GameState>(cloneGameState(gameState));
  const timeoutRef = useRef<number[]>([]);
  const battleKeyRef = useRef(0);
  const pendingNextStepRef = useRef<(() => void) | null>(null);

  const defeatedBadgeIds = workingState.player.badges;

  const availableLeaders = useMemo(
    () =>
      GYM_LEADERS.filter(
        (leader) =>
          leader.requiredBadges <= defeatedBadgeIds.length &&
          !defeatedBadgeIds.includes(badgeIdFromName(leader.badgeName)),
      ),
    [defeatedBadgeIds],
  );

  const defeatedLeaders = useMemo(
    () =>
      GYM_LEADERS.filter((leader) =>
        defeatedBadgeIds.includes(badgeIdFromName(leader.badgeName)),
      ),
    [defeatedBadgeIds],
  );

  const selectionOptions = useMemo<SelectionOption[]>(() => {
    const leaderOptions: SelectionOption[] = availableLeaders.map((leader) => ({
      key: leader.id,
      type: "leader",
      leader,
    }));

    if (workingState.player.badges.length === 8) {
      leaderOptions.push({
        key: "pokemon-league",
        type: "league" as const,
        leader: null,
      });
    }

    return leaderOptions;
  }, [availableLeaders, workingState.player.badges.length]);

  function syncPhase(nextPhase: GymPhase) {
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

  function finishWithState(nextState: GameState) {
    clearTimers();
    setStateAndRef(nextState);
    onGymEnd(nextState);
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

  function currentOpponentName() {
    if (opponentRef.current?.kind === "gym") {
      return opponentRef.current.gymLeader?.name ?? "Gym Leader";
    }

    return opponentRef.current?.eliteMember?.name ?? "Elite Four";
  }

  function currentOpponentParty() {
    if (opponentRef.current?.kind === "gym") {
      return opponentRef.current.gymLeader?.party ?? [];
    }

    return opponentRef.current?.eliteMember?.party ?? [];
  }

  function launchBattle(enemyPartyIndex: number) {
    const opponentParty = currentOpponentParty();
    const enemySlot = opponentParty[enemyPartyIndex];

    if (!enemySlot) {
      return;
    }

    const playerIndex = pickActiveIndex(workingStateRef.current.player.party);
    const activeOwned = workingStateRef.current.player.party[playerIndex];

    if (!activeOwned) {
      return;
    }

    activePlayerIndexRef.current = playerIndex;
    participantsRef.current.add(playerIndex);
    battleKeyRef.current += 1;
    setBattleSession({
      key: battleKeyRef.current,
      playerPokemon: ownedToBattlePokemon(activeOwned),
      enemyPokemon: createConfiguredBattlePokemon(
        enemySlot.pokemonId,
        enemySlot.level,
        enemySlot.moves,
      ),
    });
    syncPhase(opponentRef.current?.kind === "elite" ? "elite_battle" : "battle");
  }

  function applyAccumulatedXP(nextState: GameState) {
    let updatedState = nextState;

    for (const partyIndex of [...participantsRef.current].sort((a, b) => a - b)) {
      updatedState = gainXP(updatedState, partyIndex, accumulatedXPRef.current);
    }

    return updatedState;
  }

  function resetBattleTracking() {
    participantsRef.current = new Set();
    accumulatedXPRef.current = 0;
  }

  function prepareGymBattle(leader: GymLeader) {
    const activeIndex = firstHealthyPartyIndex(workingStateRef.current.player.party);

    if (activeIndex < 0) {
      syncPhase("result");
      setAwaitAnyKey(true);
      updateVisibleLog(
        "▸ All your Pokémon have fainted!",
        "▸ Heal your party before challenging a Gym.",
        "▸ Press any key to continue.",
      );
      return;
    }

    opponentRef.current = { kind: "gym", gymLeader: leader };
    enemyPartyIndexRef.current = 0;
    activePlayerIndexRef.current = activeIndex;
    resetBattleTracking();
    participantsRef.current.add(activeIndex);
    pendingNextStepRef.current = () => launchBattle(0);
    syncPhase("dialogue");
    setAwaitAnyKey(true);
    updateVisibleLog(
      `▸ Entering ${leader.city} Gym...`,
      `▸ ${leader.name}: "${leader.dialogue.before}"`,
      "▸ Press any key to battle.",
    );
  }

  function prepareLeagueIntro() {
    const activeIndex = firstHealthyPartyIndex(workingStateRef.current.player.party);

    if (activeIndex < 0) {
      syncPhase("result");
      setAwaitAnyKey(true);
      updateVisibleLog(
        "▸ All your Pokémon have fainted!",
        "▸ Heal your party before entering the League.",
        "▸ Press any key to continue.",
      );
      return;
    }

    activePlayerIndexRef.current = activeIndex;
    pendingNextStepRef.current = () => {
      resetBattleTracking();
      participantsRef.current.add(activePlayerIndexRef.current);
      opponentRef.current = { kind: "elite", eliteMember: ELITE_FOUR[0] };
      enemyPartyIndexRef.current = 0;
      launchBattle(0);
    };
    syncPhase("league_intro");
    setAwaitAnyKey(true);
    updateVisibleLog(
      "▸ You enter the Pokémon League...",
      "▸ Four trainers await. Defeat them all to face the Champion!",
      "▸ There are no Pokémon Centers inside. Prepare wisely.",
      "▸ Press any key to begin.",
    );
  }

  function finishGymVictory() {
    const leader = opponentRef.current?.gymLeader;
    if (!leader) {
      return;
    }

    const badgeId = badgeIdFromName(leader.badgeName);
    let nextState = cloneGameState(workingStateRef.current);
    nextState = applyAccumulatedXP(nextState);
    nextState = {
      ...nextState,
      player: {
        ...nextState.player,
        badges: nextState.player.badges.includes(badgeId)
          ? nextState.player.badges
          : [...nextState.player.badges, badgeId],
        money: nextState.player.money + leader.reward.money,
        totalBattles: nextState.player.totalBattles + 1,
      },
    };
    nextState = appendLog(
      nextState,
      `${leader.name}: "${leader.dialogue.after}"`,
      `You received the ${leader.badgeName}!`,
    );

    setStateAndRef(nextState);
    syncPhase("result");
    setAwaitAnyKey(true);
    pendingNextStepRef.current = () => finishWithState(nextState);
    updateVisibleLog(
      `▸ ${leader.name}: "${leader.dialogue.after}"`,
      `▸ ★ You received the ${leader.badgeName}! ${leader.badgeEmoji}`,
      `▸ Badges: ${GYM_LEADERS.filter((entry) =>
        nextState.player.badges.includes(badgeIdFromName(entry.badgeName)),
      )
        .map((entry) => entry.badgeEmoji)
        .join(" ")} (${nextState.player.badges.length}/8)`,
      `▸ Reward: $${leader.reward.money}`,
      "▸ Press any key to continue.",
    );
  }

  function finishLeagueDefeat() {
    let nextState = cloneGameState(workingStateRef.current);
    nextState = {
      ...nextState,
      player: {
        ...nextState.player,
        eliteFourProgress: 0,
        party: nextState.player.party.map((pokemon) => ({
          ...pokemon,
          currentHP: 1,
          status: undefined,
        })),
      },
    };
    nextState = appendLog(
      nextState,
      "You blacked out in the Pokémon League!",
      "Your Elite Four progress was reset.",
    );

    setStateAndRef(nextState);
    syncPhase("result");
    setAwaitAnyKey(true);
    pendingNextStepRef.current = () => finishWithState(nextState);
    updateVisibleLog(
      "▸ All your Pokémon fainted!",
      "▸ You blacked out!",
      "▸ You were returned to the League entrance.",
      "▸ Elite Four progress reset to 0.",
      "▸ Press any key to continue.",
    );
  }

  function finishGymDefeat() {
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
      "You blacked out!",
      "You were taken back to the last safe place...",
    );

    setStateAndRef(nextState);
    syncPhase("result");
    setAwaitAnyKey(true);
    pendingNextStepRef.current = () => finishWithState(nextState);
    updateVisibleLog(
      "▸ All your Pokémon fainted!",
      "▸ You blacked out!",
      "▸ You were taken back to the last safe place...",
      "▸ Press any key to continue.",
    );
  }

  function advanceLeagueAfterVictory() {
    const eliteMember = opponentRef.current?.eliteMember;
    if (!eliteMember) {
      return;
    }

    let nextState = cloneGameState(workingStateRef.current);
    nextState = applyAccumulatedXP(nextState);
    nextState = {
      ...nextState,
      player: {
        ...nextState.player,
        money: nextState.player.money + eliteMember.reward.money,
        eliteFourProgress: eliteMember.order < 5 ? eliteMember.order : 4,
        totalBattles: nextState.player.totalBattles,
      },
    };
    setStateAndRef(nextState);

    if (eliteMember.order < 4) {
      const nextElite = ELITE_FOUR[eliteMember.order];
      pendingNextStepRef.current = () => {
        opponentRef.current = { kind: "elite", eliteMember: nextElite };
        enemyPartyIndexRef.current = 0;
        resetBattleTracking();
        participantsRef.current.add(pickActiveIndex(workingStateRef.current.player.party));
        launchBattle(0);
      };
      syncPhase("result");
      setAwaitAnyKey(true);
      updateVisibleLog(
        `▸ ${eliteMember.name} defeated! Proceed to ${nextElite.name}...`,
        "▸ Press any key to continue.",
      );
      return;
    }

    if (eliteMember.order === 4) {
      const champion = ELITE_FOUR[4];
      pendingNextStepRef.current = () => {
        opponentRef.current = { kind: "elite", eliteMember: champion };
        enemyPartyIndexRef.current = 0;
        resetBattleTracking();
        participantsRef.current.add(pickActiveIndex(workingStateRef.current.player.party));
        launchBattle(0);
      };
      syncPhase("champion");
      setAwaitAnyKey(true);
      updateVisibleLog(
        "▸ ???: \"So! You made it here!\"",
        "▸ Blue: \"I was waiting for you! I knew you'd come!\"",
        "▸ This is it — the Final Battle!",
        "▸ Press any key to continue.",
      );
      return;
    }

    const championPokemon = nextState.player.party.reduce((best, current) =>
      current.level > best.level ? current : best,
    );
    const finalState = {
      ...nextState,
      player: {
        ...nextState.player,
        isChampion: true,
        totalBattles: nextState.player.totalBattles + 1,
      },
    };
    setStateAndRef(finalState);
    syncPhase("ending");
    setAwaitAnyKey(true);
    pendingNextStepRef.current = () => finishWithState(finalState);
    updateVisibleLog(
      "▸ Your adventure has been added to the Hall of Fame!",
      "▸ Press any key to continue playing (postgame).",
    );
    setVisibleLog((current) =>
      normalizeVisibleLog([
        ...current,
        `Trainer: ${finalState.player.name}`,
        `Champion Pokémon: ${createBattlePokemon(championPokemon.pokemonId, championPokemon.level).name} Lv.${championPokemon.level}`,
      ]),
    );
  }

  function handleSingleBattleEnd(result: {
    outcome: "win" | "lose" | "flee";
    xpGained?: number;
  }) {
    setBattleSession(null);

      if (result.outcome === "lose") {
        if (opponentRef.current?.kind === "elite") {
          finishLeagueDefeat();
        } else {
          finishGymDefeat();
        }
        return;
      }

    if (result.outcome === "flee") {
      syncPhase("result");
      setAwaitAnyKey(true);
      pendingNextStepRef.current = () => finishWithState(workingStateRef.current);
      updateVisibleLog(
        "▸ You can't run from this battle!",
        "▸ Press any key to continue.",
      );
      return;
    }

    accumulatedXPRef.current += result.xpGained ?? 0;

    const nextEnemyIndex = enemyPartyIndexRef.current + 1;
    const opponentParty = currentOpponentParty();
    if (nextEnemyIndex >= opponentParty.length) {
      if (opponentRef.current?.kind === "gym") {
        finishGymVictory();
      } else {
        advanceLeagueAfterVictory();
      }
      return;
    }

    enemyPartyIndexRef.current = nextEnemyIndex;
    const nextEnemy = opponentParty[nextEnemyIndex];
    const nextEnemyName = createBattlePokemon(nextEnemy.pokemonId, nextEnemy.level).name;
    syncPhase("result");
    setAwaitAnyKey(true);
    pendingNextStepRef.current = () => launchBattle(nextEnemyIndex);
    updateVisibleLog(
      `▸ ${currentOpponentName()}: "${createBattlePokemon(
        opponentParty[nextEnemyIndex - 1].pokemonId,
        opponentParty[nextEnemyIndex - 1].level,
      ).name}, return!"`,
      `▸ ${currentOpponentName()} sent out ${nextEnemyName.toUpperCase()}!`,
      "▸ Press any key to continue.",
    );
  }

  useEffect(() => {
    workingStateRef.current = cloneGameState(gameState);
  }, [gameState]);

  useEffect(() => {
    selectionRef.current = selectionIndex;
  }, [selectionIndex]);

  useEffect(() => {
    return () => clearTimers();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (phaseRef.current === "battle" || phaseRef.current === "elite_battle") {
        return;
      }

      if (awaitAnyKey) {
        event.preventDefault();
        setAwaitAnyKey(false);
        const nextStep = pendingNextStepRef.current;
        pendingNextStepRef.current = null;
        nextStep?.();
        return;
      }

      if (phaseRef.current === "select") {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          if (selectionOptions.length > 0) {
            setSelectionIndex(
              (current) => (current + selectionOptions.length - 1) % selectionOptions.length,
            );
          }
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          if (selectionOptions.length > 0) {
            setSelectionIndex((current) => (current + 1) % selectionOptions.length);
          }
          return;
        }

        if (event.key === "Enter") {
          event.preventDefault();
          const selected = selectionOptions[selectionRef.current];
          if (!selected) {
            return;
          }

          if (selected.type === "league") {
            prepareLeagueIntro();
            return;
          }

          if (selected.leader) {
            prepareGymBattle(selected.leader);
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
  }, [awaitAnyKey, onExit, selectionOptions]);

  const partySummary = getBattlePartySummary(workingState.player.party);
  const badgeIcons = GYM_LEADERS.filter((leader) =>
    workingState.player.badges.includes(badgeIdFromName(leader.badgeName)),
  )
    .map((leader) => leader.badgeEmoji)
    .join(" ");

  if ((phase === "battle" || phase === "elite_battle") && battleSession) {
    return (
      <div className="w-full h-full min-h-[36rem] flex flex-col justify-center">
        <BattleScreen
          key={battleSession.key}
          playerPokemon={battleSession.playerPokemon}
          enemyPokemon={battleSession.enemyPokemon}
          isWild={false}
          trainerName={currentOpponentName()}
          playerParty={workingState.player.party}
          playerBag={workingState.player.bag}
          onStateSync={syncBattleState}
          onBattleEnd={handleSingleBattleEnd}
        />
      </div>
    );
  }

  if (phase === "ending") {
    const championPokemon = workingState.player.party.reduce((best, current) =>
      current.level > best.level ? current : best,
    );

    return (
      <div className="w-full h-full min-h-[36rem] flex flex-col justify-between gap-4 font-mono text-green-300">
        <pre className="border border-green-500/30 p-4 whitespace-pre-wrap text-sm">
{`╔════════════════════════════════════════════╗
║          CONGRATULATIONS!                 ║
║                                            ║
║   You are the new Pokémon Champion!       ║
║                                            ║
║   Trainer: ${workingState.player.name.padEnd(28, " ")}║
║   Champion Pokémon: ${`${createBattlePokemon(championPokemon.pokemonId, championPokemon.level).name} Lv.${championPokemon.level}`.padEnd(18, " ")}║
║   Total Battles: ${String(workingState.player.totalBattles).padEnd(24, " ")}║
║   Total Captures: ${String(workingState.player.totalCaptures).padEnd(23, " ")}║
║   Pokédex: ${`${getPokedexCount(workingState)}/151`.padEnd(29, " ")}║
╚════════════════════════════════════════════╝`}
        </pre>

        <div className="space-y-2 text-sm sm:text-base">
          {visibleLog.map((message, index) => (
            <div key={`${message}-${index}`}>{message}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[36rem] flex flex-col justify-between gap-4 font-mono text-green-300">
      <div className="space-y-4">
        <div className="text-green-100 text-lg">GYM CHALLENGE</div>
        <div className="border-t border-green-500/30" />

        {phase === "select" ? (
          <div className="space-y-4">
            <div>{`Badges: ${badgeIcons || "—"}   (${workingState.player.badges.length}/8)`}</div>

            <div className="space-y-1">
              <div className="text-green-100">Available:</div>
              {selectionOptions.length > 0 ? (
                selectionOptions.map((option, index) =>
                  option.type === "league" ? (
                    <div key={option.key}>
                      {selectionIndex === index ? "> " : "  "}
                      ENTER POKEMON LEAGUE
                    </div>
                  ) : (
                    <div key={option.key}>
                      {selectionIndex === index ? "> " : "  "}
                      {index + 1}. {option.leader.name.padEnd(11, " ")} — {option.leader.city.padEnd(13, " ")} ({option.leader.specialty}) {option.leader.badgeEmoji} {option.leader.badgeName}
                    </div>
                  ),
                )
              ) : (
                <div className="text-green-600">No new Gym challenge available right now.</div>
              )}
            </div>

            <div className="space-y-1">
              <div className="text-green-100">Defeated:</div>
              {defeatedLeaders.length > 0 ? (
                defeatedLeaders.map((leader) => (
                  <div key={leader.id}>
                    ✓ {leader.name.padEnd(11, " ")} — {leader.badgeName} {leader.badgeEmoji}
                  </div>
                ))
              ) : (
                <div className="text-green-600">No Gym Badges yet.</div>
              )}
            </div>

            <div className="text-xs text-green-600">[↑↓] Navegar   [Enter] Desafiar   [ESC] Voltar</div>
          </div>
        ) : (
          <div className="space-y-2 text-sm sm:text-base">
            {visibleLog.map((message, index) => (
              <div key={`${message}-${index}`}>{message}</div>
            ))}
          </div>
        )}
      </div>

      <div className="border border-green-500/30 p-3 text-xs sm:text-sm">
        {partySummary.map((pokemon) => (
          <div key={`${pokemon.pokemonId}-${pokemon.index}`}>
            {pokemon.index + 1}. {pokemon.nickname ?? pokemon.name} Lv.{pokemon.level} HP: {pokemon.currentHP}/{pokemon.maxHP}
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
