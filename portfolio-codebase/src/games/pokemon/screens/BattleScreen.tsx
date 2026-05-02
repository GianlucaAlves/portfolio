import { useEffect, useRef, useState } from "react";
import MobileGameControls from "../../../components/MobileGameControls";
import { MOVES_DATA, SHOP_ITEMS, TRAINERS } from "../data/pokemon-data";
import {
  calculateCatchRate,
  calculateXP,
  createBattlePokemon,
  executeMove,
  getAIMove,
  processStatusEffects,
  type BattlePokemon,
} from "../engine/battle-system";
import type { OwnedPokemon } from "../engine/game-state";

type BattleScreenProps = {
  playerPokemon: BattlePokemon;
  enemyPokemon: BattlePokemon;
  isWild: boolean;
  trainerName?: string;
  playerParty: OwnedPokemon[];
  playerBag: { itemId: string; quantity: number }[];
  onStateSync?: (
    party: OwnedPokemon[],
    bag: { itemId: string; quantity: number }[],
    activePartyIndex: number,
  ) => void;
  onBattleEnd: (result: {
    outcome: "win" | "lose" | "flee";
    xpGained?: number;
    moneyGained?: number;
    caughtPokemon?: OwnedPokemon;
  }) => void;
};

type MenuPhase = "select" | "fight" | "bag" | "pokemon" | "bag_target";
type ActionOption = "FIGHT" | "BAG" | "POKEMON" | "RUN";

type BattleCoreState = {
  phase: MenuPhase;
  playerActive: BattlePokemon;
  enemyActive: BattlePokemon;
  party: OwnedPokemon[];
  bag: { itemId: string; quantity: number }[];
  activePartyIndex: number;
  selectedItemId: string | null;
};

type UsableBagItem = {
  itemId: string;
  quantity: number;
  item: (typeof SHOP_ITEMS)[number];
};

const ACTIONS: ActionOption[] = ["FIGHT", "BAG", "POKEMON", "RUN"];

function cloneBattlePokemon(pokemon: BattlePokemon): BattlePokemon {
  return {
    ...pokemon,
    stats: { ...pokemon.stats },
    moves: pokemon.moves.map((move) => ({ ...move })),
    statStages: { ...pokemon.statStages },
  };
}

function cloneOwnedPokemon(pokemon: OwnedPokemon): OwnedPokemon {
  return {
    ...pokemon,
    moves: pokemon.moves.map((move) => ({ ...move })),
  };
}

function battleToOwnedPokemon(pokemon: BattlePokemon): OwnedPokemon {
  return {
    pokemonId: pokemon.pokemonId,
    level: pokemon.level,
    currentHP: pokemon.currentHP,
    xp: Math.floor(pokemon.level ** 3),
    xpToNextLevel: Math.floor((pokemon.level + 1) ** 3),
    moves: pokemon.moves.map((move) => ({ ...move })),
    status: pokemon.status,
  };
}

function ownedToBattlePokemon(owned: OwnedPokemon, fallback: BattlePokemon): BattlePokemon {
  const base = createBattlePokemon(owned.pokemonId, owned.level);

  return {
    ...base,
    currentHP: owned.currentHP,
    moves: owned.moves.map((move) => ({ ...move })),
    status: owned.status,
    name: fallback.name && fallback.pokemonId === owned.pokemonId ? fallback.name : base.name,
  };
}

function hpBar(currentHP: number, maxHP: number) {
  const total = 10;
  const filled = Math.max(0, Math.min(total, Math.round((currentHP / maxHP) * total)));
  return `${"█".repeat(filled)}${"░".repeat(total - filled)}`;
}

function hpColor(currentHP: number, maxHP: number) {
  const ratio = maxHP === 0 ? 0 : currentHP / maxHP;
  if (ratio > 0.5) return "text-green-400";
  if (ratio > 0.2) return "text-yellow-400";
  return "text-red-400";
}

function logClassName(message: string) {
  if (
    message.includes("super effective") ||
    message.includes("caught") ||
    message.includes("Gotcha")
  ) {
    return "text-green-300";
  }

  if (
    message.includes("not very effective") ||
    message.includes("broke free") ||
    message.includes("failed")
  ) {
    return "text-red-300";
  }

  if (
    message.includes("paralyzed") ||
    message.includes("burned") ||
    message.includes("poison") ||
    message.includes("sleep") ||
    message.includes("frozen")
  ) {
    return "text-yellow-300";
  }

  if (message.includes("damage") || message.includes("took")) {
    return "text-white";
  }

  return "text-green-300";
}

function getTrainerReward(trainerName?: string) {
  if (!trainerName) {
    return { money: 0, xp: 0 };
  }

  const trainer = TRAINERS.find((entry) => entry.name === trainerName);
  return trainer?.reward ?? { money: 0, xp: 0 };
}

function normalizeBag(entries: { itemId: string; quantity: number }[]) {
  return entries.filter((entry) => entry.quantity > 0);
}

function canActAfterStatusMessage(pokemon: BattlePokemon, message: string) {
  if (!pokemon.status) return true;
  if (pokemon.status === "paralyzed" && message.includes("fully paralyzed")) return false;
  if (pokemon.status === "asleep" && message.includes("fast asleep")) return false;
  if (pokemon.status === "frozen" && message.includes("frozen solid")) return false;
  return true;
}

type TurnActionResult = "continue" | "player_ko" | "enemy_ko" | "skipped";

export default function BattleScreen({
  playerPokemon,
  enemyPokemon,
  isWild,
  trainerName,
  playerParty,
  playerBag,
  onStateSync,
  onBattleEnd,
}: BattleScreenProps) {
  const battleRef = useRef<BattleCoreState>({
    phase: "select",
    playerActive: cloneBattlePokemon(playerPokemon),
    enemyActive: cloneBattlePokemon(enemyPokemon),
    party: playerParty.map(cloneOwnedPokemon),
    bag: [...playerBag],
    activePartyIndex: 0,
    selectedItemId: null,
  });
  const timeoutRef = useRef<number[]>([]);
  const [menuPhase, setMenuPhase] = useState<MenuPhase>("select");
  const [actionIndex, setActionIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [playerRender, setPlayerRender] = useState<BattlePokemon>(
    cloneBattlePokemon(playerPokemon),
  );
  const [enemyRender, setEnemyRender] = useState<BattlePokemon>(
    cloneBattlePokemon(enemyPokemon),
  );
  const [visibleLog, setVisibleLog] = useState<string[]>([
    isWild
      ? `A wild ${enemyPokemon.name.toUpperCase()} appeared!`
      : `${trainerName ?? "Trainer"} sent out ${enemyPokemon.name.toUpperCase()}!`,
  ]);
  const [renderParty, setRenderParty] = useState<OwnedPokemon[]>(
    playerParty.map(cloneOwnedPokemon),
  );
  const [renderBag, setRenderBag] = useState(playerBag);
  const [animating, setAnimating] = useState(false);

  const usableBagItems = normalizeBag(renderBag).reduce<UsableBagItem[]>(
    (items, entry) => {
      const item = SHOP_ITEMS.find((shopItem) => shopItem.id === entry.itemId);

      if (!item) {
        return items;
      }

      if (
        item.effect === "heal" ||
        item.effect === "status_cure" ||
        item.effect === "revive" ||
        (isWild && item.effect === "pokeball")
      ) {
        items.push({
          itemId: entry.itemId,
          quantity: entry.quantity,
          item,
        });
      }

      return items;
    },
    [],
  );

  const selectableParty = renderParty.map((pokemon, index) => ({ pokemon, index }));

  function clearTimers() {
    timeoutRef.current.forEach((id) => window.clearTimeout(id));
    timeoutRef.current = [];
  }

  function syncRender() {
    setPlayerRender(cloneBattlePokemon(battleRef.current.playerActive));
    setEnemyRender(cloneBattlePokemon(battleRef.current.enemyActive));
    setRenderParty(battleRef.current.party.map(cloneOwnedPokemon));
    setRenderBag([...battleRef.current.bag]);
    setMenuPhase(battleRef.current.phase);
    onStateSync?.(
      battleRef.current.party.map(cloneOwnedPokemon),
      [...battleRef.current.bag],
      battleRef.current.activePartyIndex,
    );
  }

  function schedule(delay: number, callback: () => void) {
    const id = window.setTimeout(callback, delay);
    timeoutRef.current.push(id);
  }

  function revealMessages(messages: string[]) {
    setAnimating(true);

    messages.forEach((message, index) => {
      schedule(index * 600, () => {
        setVisibleLog((current) => [...current, message].slice(-4));
      });
    });

    return new Promise<void>((resolve) => {
      schedule(messages.length * 600, () => {
        setAnimating(false);
        resolve();
      });
    });
  }

  function updateOwnedFromBattle() {
    const activeIndex = battleRef.current.activePartyIndex;
    const activeOwned = battleToOwnedPokemon(battleRef.current.playerActive);

    battleRef.current.party = battleRef.current.party.map((pokemon, index) =>
      index === activeIndex ? activeOwned : pokemon,
    );
    syncRender();
  }

  async function finishBattle(result: {
    outcome: "win" | "lose" | "flee";
    xpGained?: number;
    moneyGained?: number;
    caughtPokemon?: OwnedPokemon;
  }) {
    clearTimers();
    setAnimating(false);
    onStateSync?.(
      battleRef.current.party.map(cloneOwnedPokemon),
      [...battleRef.current.bag],
      battleRef.current.activePartyIndex,
    );
    onBattleEnd(result);
  }

  async function handleWin(caughtPokemon?: OwnedPokemon) {
    const xpGained = caughtPokemon
      ? undefined
      : calculateXP(
          battleRef.current.enemyActive,
          battleRef.current.enemyActive.level,
          isWild,
        );
    const moneyGained = isWild ? undefined : getTrainerReward(trainerName).money;

    await finishBattle({
      outcome: "win",
      xpGained,
      moneyGained,
      caughtPokemon,
    });
  }

  async function handlePlayerKO() {
    updateOwnedFromBattle();
    const hasHealthyPokemon = battleRef.current.party.some((pokemon) => pokemon.currentHP > 0);

    if (!hasHealthyPokemon) {
      await finishBattle({ outcome: "lose" });
      return;
    }

    battleRef.current.phase = "pokemon";
    syncRender();
    setVisibleLog((current) => [...current, "Choose another Pokémon!"].slice(-4));
  }

  async function runEnemyAction(): Promise<TurnActionResult> {
    const startStatus = processStatusEffects(battleRef.current.enemyActive);
    battleRef.current.enemyActive = startStatus.pokemon;
    syncRender();

    if (startStatus.message) {
      await revealMessages([startStatus.message]);
    }

    if (startStatus.message && !canActAfterStatusMessage(startStatus.pokemon, startStatus.message)) {
      return "skipped";
    }

    const moveId = getAIMove(
      battleRef.current.enemyActive,
      battleRef.current.playerActive,
    );
    const moveName = MOVES_DATA[moveId]?.name ?? "Struggle";
    const result = executeMove(
      battleRef.current.enemyActive,
      battleRef.current.playerActive,
      moveId,
      false,
    );

    battleRef.current.enemyActive = result.newAttacker;
    battleRef.current.playerActive = result.newDefender;
    updateOwnedFromBattle();
    await revealMessages([`Enemy used ${moveName}!`, ...result.messages.slice(1)]);

    if (result.knockedOut || battleRef.current.playerActive.currentHP <= 0) {
      await revealMessages([`${battleRef.current.playerActive.name.toUpperCase()} fainted!`]);
      return "player_ko";
    }

    return "continue";
  }

  async function runPlayerAction(moveId: string): Promise<TurnActionResult> {
    const startStatus = processStatusEffects(battleRef.current.playerActive);
    battleRef.current.playerActive = startStatus.pokemon;
    updateOwnedFromBattle();

    if (startStatus.message) {
      await revealMessages([startStatus.message]);
    }

    if (
      startStatus.message &&
      !canActAfterStatusMessage(startStatus.pokemon, startStatus.message)
    ) {
      return "skipped";
    }

    const result = executeMove(
      battleRef.current.playerActive,
      battleRef.current.enemyActive,
      moveId,
      true,
    );

    battleRef.current.playerActive = result.newAttacker;
    battleRef.current.enemyActive = result.newDefender;
    updateOwnedFromBattle();
    await revealMessages(result.messages);

    if (result.knockedOut || battleRef.current.enemyActive.currentHP <= 0) {
      await revealMessages([`${battleRef.current.enemyActive.name.toUpperCase()} fainted!`]);
      return "enemy_ko";
    }

    return "continue";
  }

  function playerActsFirst() {
    const playerSpeed = battleRef.current.playerActive.stats.speed;
    const enemySpeed = battleRef.current.enemyActive.stats.speed;

    if (playerSpeed > enemySpeed) {
      return true;
    }

    if (enemySpeed > playerSpeed) {
      return false;
    }

    return Math.random() > 0.5;
  }

  async function runEnemyTurn() {
    battleRef.current.phase = "select";
    syncRender();

    const result = await runEnemyAction();

    if (result === "player_ko") {
      await handlePlayerKO();
      return;
    }

    battleRef.current.phase = "select";
    syncRender();
  }

  async function runPlayerMove(moveId: string) {
    battleRef.current.phase = "select";
    syncRender();

    const playerFirst = playerActsFirst();
    const firstResult = playerFirst
      ? await runPlayerAction(moveId)
      : await runEnemyAction();

    if (firstResult === "enemy_ko") {
      await handleWin();
      return;
    }

    if (firstResult === "player_ko") {
      await handlePlayerKO();
      return;
    }

    if (
      battleRef.current.playerActive.currentHP <= 0 ||
      battleRef.current.enemyActive.currentHP <= 0
    ) {
      battleRef.current.phase = "select";
      syncRender();
      return;
    }

    const secondResult = playerFirst
      ? await runEnemyAction()
      : await runPlayerAction(moveId);

    if (secondResult === "enemy_ko") {
      await handleWin();
      return;
    }

    if (secondResult === "player_ko") {
      await handlePlayerKO();
      return;
    }

    battleRef.current.phase = "select";
    syncRender();
  }

  async function handleCapture(itemId: string) {
    const bagEntry = battleRef.current.bag.find((entry) => entry.itemId === itemId);
    const item = SHOP_ITEMS.find((entry) => entry.id === itemId);

    if (!bagEntry || !item) return;

    battleRef.current.bag = normalizeBag(
      battleRef.current.bag.map((entry) =>
        entry.itemId === itemId
          ? { ...entry, quantity: entry.quantity - 1 }
          : entry,
      ),
    );
    syncRender();

    const catchResult = calculateCatchRate(
      battleRef.current.enemyActive,
      item.value,
    );

    await revealMessages([
      `You threw a ${item.name}!`,
      "[  •••  ]",
      "[  ···  ]",
      "[  •••  ]",
      catchResult.message,
    ]);

    if (catchResult.caught) {
      await handleWin(battleToOwnedPokemon(battleRef.current.enemyActive));
      return;
    }

    await runEnemyTurn();
  }

  async function useBattleItem(itemId: string, partyIndex: number) {
    const item = SHOP_ITEMS.find((entry) => entry.id === itemId);
    const bagEntry = battleRef.current.bag.find((entry) => entry.itemId === itemId);
    const ownedTarget = battleRef.current.party[partyIndex];

    if (!item || !bagEntry || !ownedTarget) return;

    if (item.effect === "pokeball") {
      await handleCapture(itemId);
      return;
    }

    const targetBattle =
      partyIndex === battleRef.current.activePartyIndex
        ? battleRef.current.playerActive
        : ownedToBattlePokemon(ownedTarget, battleRef.current.playerActive);

    if (item.effect === "heal") {
      targetBattle.currentHP = Math.min(
        targetBattle.maxHP,
        targetBattle.currentHP + (item.value >= 9999 ? targetBattle.maxHP : item.value),
      );
    } else if (item.effect === "status_cure") {
      targetBattle.status = undefined;
      targetBattle.statusTurns = 0;
    } else if (item.effect === "revive" && targetBattle.currentHP <= 0) {
      targetBattle.currentHP = Math.max(1, Math.floor(targetBattle.maxHP / 2));
    }

    const nextOwned = battleToOwnedPokemon(targetBattle);
    battleRef.current.party = battleRef.current.party.map((pokemon, index) =>
      index === partyIndex ? nextOwned : pokemon,
    );

    if (partyIndex === battleRef.current.activePartyIndex) {
      battleRef.current.playerActive = targetBattle;
    }

    battleRef.current.bag = normalizeBag(
      battleRef.current.bag.map((entry) =>
        entry.itemId === itemId
          ? { ...entry, quantity: entry.quantity - 1 }
          : entry,
      ),
    );

    battleRef.current.phase = "select";
    battleRef.current.selectedItemId = null;
    syncRender();
    setVisibleLog((current) => [...current, `${nextOwned.nickname ?? targetBattle.name} used ${item.name}!`].slice(-4));
    await runEnemyTurn();
  }

  async function switchPokemon(partyIndex: number) {
    const selected = battleRef.current.party[partyIndex];
    if (!selected || partyIndex === battleRef.current.activePartyIndex || selected.currentHP <= 0) {
      return;
    }

    battleRef.current.activePartyIndex = partyIndex;
    battleRef.current.playerActive = ownedToBattlePokemon(
      selected,
      battleRef.current.playerActive,
    );
    battleRef.current.phase = "select";
    syncRender();
    setVisibleLog((current) => [...current, `Go! ${(selected.nickname ?? battleRef.current.playerActive.name).toUpperCase()}!`].slice(-4));
    await runEnemyTurn();
  }

  useEffect(() => {
    return () => clearTimers();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (animating) {
        return;
      }

      if (menuPhase === "select") {
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          event.preventDefault();
          setActionIndex((current) => (current + ACTIONS.length - 1) % ACTIONS.length);
          return;
        }

        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          event.preventDefault();
          setActionIndex((current) => (current + 1) % ACTIONS.length);
          return;
        }

        if (event.key === "Enter") {
          event.preventDefault();
          const action = ACTIONS[actionIndex];

          if (action === "RUN") {
            if (!isWild) {
              setVisibleLog((current) => [...current, "Can't run from a trainer battle!"].slice(-4));
              return;
            }

            if (Math.random() <= 0.7) {
              void finishBattle({ outcome: "flee" });
            } else {
              setVisibleLog((current) => [...current, "Couldn't escape!"].slice(-4));
              void runEnemyTurn();
            }
            return;
          }

          battleRef.current.phase =
            action === "FIGHT" ? "fight" : action === "BAG" ? "bag" : "pokemon";
          syncRender();
          setSubIndex(0);
        }

        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        if (menuPhase === "bag_target") {
          battleRef.current.phase = "bag";
        } else {
          battleRef.current.phase = "select";
        }
        syncRender();
        return;
      }

      if (menuPhase === "fight") {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          setSubIndex((current) =>
            (current + playerRender.moves.length - 1) % playerRender.moves.length,
          );
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          setSubIndex((current) => (current + 1) % playerRender.moves.length);
          return;
        }

        if (event.key === "Enter") {
          event.preventDefault();
          const selectedMove = playerRender.moves[subIndex];
          if (selectedMove) {
            void runPlayerMove(selectedMove.moveId);
          }
        }

        return;
      }

      if (menuPhase === "bag") {
        if (usableBagItems.length === 0) {
          return;
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          setSubIndex((current) => (current + usableBagItems.length - 1) % usableBagItems.length);
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          setSubIndex((current) => (current + 1) % usableBagItems.length);
          return;
        }

        if (event.key === "Enter") {
          event.preventDefault();
          const selectedItem = usableBagItems[subIndex];
          if (!selectedItem) return;

          if (selectedItem.item.effect === "pokeball") {
            void handleCapture(selectedItem.itemId);
            return;
          }

          battleRef.current.phase = "bag_target";
          battleRef.current.selectedItemId = selectedItem.itemId;
          syncRender();
          setTargetIndex(0);
        }

        return;
      }

      if (menuPhase === "bag_target") {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          setTargetIndex((current) =>
            (current + selectableParty.length - 1) % selectableParty.length,
          );
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          setTargetIndex((current) => (current + 1) % selectableParty.length);
          return;
        }

        if (event.key === "Enter") {
          event.preventDefault();
          const target = selectableParty[targetIndex];
          if (target && battleRef.current.selectedItemId) {
            void useBattleItem(battleRef.current.selectedItemId, target.index);
          }
        }

        return;
      }

      if (menuPhase === "pokemon") {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          setSubIndex((current) => (current + selectableParty.length - 1) % selectableParty.length);
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          setSubIndex((current) => (current + 1) % selectableParty.length);
          return;
        }

        if (event.key === "Enter") {
          event.preventDefault();
          const selected = selectableParty[subIndex];
          if (selected) {
            void switchPokemon(selected.index);
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    actionIndex,
    animating,
    isWild,
    menuPhase,
    playerRender.moves,
    selectableParty,
    subIndex,
    targetIndex,
    usableBagItems,
  ]);

  return (
    <div className="w-full h-full flex flex-col gap-4 font-mono text-green-300">
      <div className="border border-green-500/40">
        <div className="border-b border-green-500/30 px-3 py-2 flex items-center justify-between">
          <span>
            {isWild ? "Wild" : trainerName ?? "Trainer"}{" "}
            {enemyRender.name.toUpperCase()}
          </span>
          <span>Lv.{enemyRender.level}</span>
        </div>
        <div className="px-3 py-2">
          <span className="text-green-600">HP:</span>{" "}
          <span className={hpColor(enemyRender.currentHP, enemyRender.maxHP)}>
            {hpBar(enemyRender.currentHP, enemyRender.maxHP)}
          </span>{" "}
          {enemyRender.currentHP}/{enemyRender.maxHP}
        </div>
        <div className="border-y border-green-500/30 px-3 py-2 flex items-center justify-between">
          <span>{playerRender.name.toUpperCase()}</span>
          <span>Lv.{playerRender.level}</span>
        </div>
        <div className="px-3 py-2">
          <span className="text-green-600">HP:</span>{" "}
          <span className={hpColor(playerRender.currentHP, playerRender.maxHP)}>
            {hpBar(playerRender.currentHP, playerRender.maxHP)}
          </span>{" "}
          {playerRender.currentHP}/{playerRender.maxHP}
        </div>
        <div className="px-3 py-2">
          <span className="text-green-600">Status:</span>{" "}
          {playerRender.status ? playerRender.status : "—"}
        </div>
        <div className="border-t border-green-500/30 px-3 py-3 min-h-28">
          {menuPhase === "select" ? (
            <div className="grid grid-cols-2 gap-y-2">
              {ACTIONS.map((action, index) => (
                <div
                  key={action}
                  className={!isWild && action === "RUN" ? "text-green-800" : ""}
                >
                  {actionIndex === index ? "> " : "  "}
                  {action}
                </div>
              ))}
            </div>
          ) : null}

          {menuPhase === "fight" ? (
            <div className="space-y-1">
              <div>Choose a move:</div>
              {playerRender.moves.map((moveSlot, index) => {
                const move = MOVES_DATA[moveSlot.moveId];
                return (
                  <div key={moveSlot.moveId}>
                    {subIndex === index ? "> " : "  "}
                    {index + 1}. {(move?.name ?? moveSlot.moveId).padEnd(12, " ")}
                    <span className={moveSlot.currentPP === 0 ? "text-red-500" : ""}>
                      PP: {moveSlot.currentPP}/{moveSlot.maxPP}
                    </span>{" "}
                    <span className="text-green-600">({move?.type ?? "Normal"})</span>
                  </div>
                );
              })}
            </div>
          ) : null}

          {menuPhase === "bag" ? (
            <div className="space-y-1">
              <div>Use an item:</div>
              {usableBagItems.map((entry, index) => (
                <div key={entry.itemId}>
                  {subIndex === index ? "> " : "  "}
                  {entry.item.name.padEnd(14, " ")} x{entry.quantity}
                </div>
              ))}
            </div>
          ) : null}

          {menuPhase === "pokemon" ? (
            <div className="space-y-1">
              <div>Switch Pokémon:</div>
              {selectableParty.map(({ pokemon, index }, listIndex) => {
                const isActive = index === battleRef.current.activePartyIndex;
                const fainted = pokemon.currentHP <= 0;
                return (
                  <div
                    key={`${pokemon.pokemonId}-${index}`}
                    className={fainted ? "text-red-500" : ""}
                  >
                    {subIndex === listIndex ? "> " : "  "}
                    {index + 1}. {getPokemonName(pokemon.pokemonId).padEnd(10, " ")}
                    HP: {`${pokemon.currentHP}/${createBattlePokemon(pokemon.pokemonId, pokemon.level).maxHP}`.padEnd(8, " ")}
                    Lv.{pokemon.level}
                    {isActive ? " (active)" : fainted ? " (fainted)" : ""}
                  </div>
                );
              })}
            </div>
          ) : null}

          {menuPhase === "bag_target" ? (
            <div className="space-y-1">
              <div>Choose a Pokémon:</div>
              {selectableParty.map(({ pokemon, index }, listIndex) => (
                <div
                  key={`${pokemon.pokemonId}-${index}`}
                  className={pokemon.currentHP <= 0 ? "text-red-500" : ""}
                >
                  {targetIndex === listIndex ? "> " : "  "}
                  {index + 1}. {getPokemonName(pokemon.pokemonId)}{" "}
                  HP: {pokemon.currentHP}/{createBattlePokemon(pokemon.pokemonId, pokemon.level).maxHP}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="min-h-24 space-y-1 text-sm">
        {visibleLog.slice(-4).map((message, index) => (
          <div key={`${message}-${index}`} className={logClassName(message)}>
            ▸ {message}
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

function getPokemonName(pokemonId: number) {
  return createBattlePokemon(pokemonId, 1).name;
}
