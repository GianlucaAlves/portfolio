import { useEffect, useMemo, useState } from "react";
import { MOVES_DATA, SHOP_ITEMS } from "./data/pokemon-data";
import {
  calculateCatchRate,
  executeMove,
  processStatusEffects,
  type BattlePokemon,
} from "./engine/battle-system";
import type { OwnedPokemon } from "./engine/game-state";

type BagEntry = { itemId: string; quantity: number };

type BattleScreenProps = {
  playerPokemon: BattlePokemon;
  enemyPokemon: BattlePokemon;
  isWild: boolean;
  trainerName?: string;
  onBattleEnd: (
    result: "win" | "lose" | "flee",
    catchedPokemon?: OwnedPokemon,
  ) => void;
  party?: OwnedPokemon[];
  bag?: BagEntry[];
  onPartyBagChange?: (party: OwnedPokemon[], bag: BagEntry[]) => void;
};

type MenuMode = "actions" | "fight" | "bag" | "pokemon";
type ActionOption = "FIGHT" | "BAG" | "POKEMON" | "RUN";

const ACTIONS: ActionOption[] = ["FIGHT", "BAG", "POKEMON", "RUN"];

function battleToOwned(pokemon: BattlePokemon): OwnedPokemon {
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

function ownedToBattle(
  owned: OwnedPokemon,
  fallback: BattlePokemon,
): BattlePokemon {
  return {
    ...fallback,
    pokemonId: owned.pokemonId,
    level: owned.level,
    currentHP: owned.currentHP,
    moves: owned.moves.map((move) => ({ ...move })),
    status: owned.status,
  };
}

function healthBar(current: number, max: number, size = 10) {
  const ratio = max <= 0 ? 0 : current / max;
  const filled = Math.max(0, Math.min(size, Math.round(ratio * size)));
  return `${"█".repeat(filled)}${"░".repeat(size - filled)}`;
}

function normalizeBag(bag: BagEntry[]) {
  return bag.filter((entry) => entry.quantity > 0);
}

export default function BattleScreen({
  playerPokemon,
  enemyPokemon,
  isWild,
  trainerName,
  onBattleEnd,
  party = [],
  bag = [],
  onPartyBagChange,
}: BattleScreenProps) {
  const [mode, setMode] = useState<MenuMode>("actions");
  const [actionIndex, setActionIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [playerActive, setPlayerActive] = useState(playerPokemon);
  const [enemyActive, setEnemyActive] = useState(enemyPokemon);
  const [localParty, setLocalParty] = useState<OwnedPokemon[]>(
    party.length > 0 ? party.map((entry) => ({ ...entry, moves: entry.moves.map((move) => ({ ...move })) })) : [battleToOwned(playerPokemon)],
  );
  const [localBag, setLocalBag] = useState<BagEntry[]>(bag);
  const [log, setLog] = useState<string[]>([]);
  const [currentPartyIndex, setCurrentPartyIndex] = useState(0);

  const usableBagItems = useMemo(
    () =>
      normalizeBag(localBag).filter((entry) => {
        const item = SHOP_ITEMS.find((shopItem) => shopItem.id === entry.itemId);
        if (!item) return false;
        return isWild || item.effect !== "pokeball";
      }),
    [isWild, localBag],
  );

  const switchableParty = useMemo(
    () =>
      localParty
        .map((pokemon, index) => ({ pokemon, index }))
        .filter(
          ({ pokemon, index }) =>
            index !== currentPartyIndex && pokemon.currentHP > 0,
        ),
    [currentPartyIndex, localParty],
  );

  useEffect(() => {
    setPlayerActive(playerPokemon);
  }, [playerPokemon]);

  useEffect(() => {
    setEnemyActive(enemyPokemon);
  }, [enemyPokemon]);

  useEffect(() => {
    setLocalParty(
      party.length > 0
        ? party.map((entry) => ({
            ...entry,
            moves: entry.moves.map((move) => ({ ...move })),
          }))
        : [battleToOwned(playerPokemon)],
    );
  }, [party, playerPokemon]);

  useEffect(() => {
    setLocalBag(bag);
  }, [bag]);

  function syncPartyBag(nextParty: OwnedPokemon[], nextBag: BagEntry[]) {
    setLocalParty(nextParty);
    setLocalBag(nextBag);
    onPartyBagChange?.(nextParty, nextBag);
  }

  function pushLog(...messages: string[]) {
    setLog((current) => [...current, ...messages.filter(Boolean)].slice(-6));
  }

  function updatePartyMemberFromBattle(index: number, battlePokemon: BattlePokemon) {
    const nextParty = localParty.map((owned, ownedIndex) =>
      ownedIndex === index
        ? {
            ...owned,
            pokemonId: battlePokemon.pokemonId,
            level: battlePokemon.level,
            currentHP: battlePokemon.currentHP,
            moves: battlePokemon.moves.map((move) => ({ ...move })),
            status: battlePokemon.status,
          }
        : owned,
    );
    syncPartyBag(nextParty, localBag);
  }

  function finishBattle(result: "win" | "lose" | "flee", catchedPokemon?: OwnedPokemon) {
    updatePartyMemberFromBattle(currentPartyIndex, playerActive);
    onBattleEnd(result, catchedPokemon);
  }

  function advanceTurnWithMove(selectedMoveId: string) {
    let actingPlayer = playerActive;
    let actingEnemy = enemyActive;
    const messages: string[] = [];

    const playerStatusResult = processStatusEffects(actingPlayer);
    actingPlayer = playerStatusResult.pokemon;
    if (playerStatusResult.message) {
      messages.push(playerStatusResult.message);
    }

    const playerCanAct =
      !(
        (actingPlayer.status === "paralyzed" &&
          playerStatusResult.message.includes("fully paralyzed")) ||
        (actingPlayer.status === "asleep" &&
          !playerStatusResult.message.includes("woke up")) ||
        (actingPlayer.status === "frozen" &&
          !playerStatusResult.message.includes("thawed"))
      );

    if (!playerCanAct) {
      setPlayerActive(actingPlayer);
      updatePartyMemberFromBattle(currentPartyIndex, actingPlayer);
      pushLog(...messages);
      setMode("actions");
      return;
    }

    const playerSpeed = actingPlayer.stats.speed;
    const enemySpeed = actingEnemy.stats.speed;
    const playerFirst = playerSpeed >= enemySpeed;

    const runPlayerAttack = () => {
      const result = executeMove(actingPlayer, actingEnemy, selectedMoveId, true);
      actingPlayer = result.newAttacker;
      actingEnemy = result.newDefender;
      messages.push(...result.messages);
      return result.knockedOut;
    };

    const runEnemyAttack = () => {
      const enemyStatusResult = processStatusEffects(actingEnemy);
      actingEnemy = enemyStatusResult.pokemon;
      if (enemyStatusResult.message) {
        messages.push(enemyStatusResult.message);
      }

      const enemyCanAct =
        !(
          (actingEnemy.status === "paralyzed" &&
            enemyStatusResult.message.includes("fully paralyzed")) ||
          (actingEnemy.status === "asleep" &&
            !enemyStatusResult.message.includes("woke up")) ||
          (actingEnemy.status === "frozen" &&
            !enemyStatusResult.message.includes("thawed"))
        );

      if (!enemyCanAct) {
        return false;
      }

      const availableMove =
        actingEnemy.moves.find((move) => move.currentPP > 0)?.moveId ??
        actingEnemy.moves[0]?.moveId ??
        "struggle";
      const result = executeMove(actingEnemy, actingPlayer, availableMove, false);
      actingEnemy = result.newAttacker;
      actingPlayer = result.newDefender;
      messages.push(...result.messages);
      return result.knockedOut;
    };

    const playerKO = playerFirst ? runPlayerAttack() : runEnemyAttack();
    if (playerKO) {
      setPlayerActive(actingPlayer);
      setEnemyActive(actingEnemy);
      updatePartyMemberFromBattle(currentPartyIndex, actingPlayer);
      pushLog(...messages, `${enemyActive.name} fainted!`);
      finishBattle("win");
      return;
    }

    const enemyKO = playerFirst ? runEnemyAttack() : runPlayerAttack();
    if (enemyKO) {
      const nextParty = localParty.map((owned, index) =>
        index === currentPartyIndex
          ? {
              ...owned,
              currentHP: actingPlayer.currentHP,
              moves: actingPlayer.moves.map((move) => ({ ...move })),
              status: actingPlayer.status,
            }
          : owned,
      );
      const nextSwitchable = nextParty
        .map((pokemon, index) => ({ pokemon, index }))
        .filter(({ pokemon }) => pokemon.currentHP > 0);

      setPlayerActive(actingPlayer);
      setEnemyActive(actingEnemy);
      syncPartyBag(nextParty, localBag);
      pushLog(...messages, `${actingPlayer.name} fainted!`);

      if (nextSwitchable.length === 0) {
        finishBattle("lose");
        return;
      }

      const replacement =
        nextSwitchable.find((entry) => entry.index !== currentPartyIndex) ??
        nextSwitchable[0];
      const fallbackBattle = playerPokemon;
      setCurrentPartyIndex(replacement.index);
      setPlayerActive(ownedToBattle(replacement.pokemon, fallbackBattle));
      pushLog(`Go! ${replacement.pokemon.nickname ?? replacement.pokemon.pokemonId}!`);
    } else {
      setPlayerActive(actingPlayer);
      setEnemyActive(actingEnemy);
      updatePartyMemberFromBattle(currentPartyIndex, actingPlayer);
      pushLog(...messages);
    }

    setMode("actions");
  }

  function handleActionConfirm(action: ActionOption) {
    if (action === "FIGHT") {
      setMode("fight");
      setSubIndex(0);
      return;
    }

    if (action === "BAG") {
      setMode("bag");
      setSubIndex(0);
      return;
    }

    if (action === "POKEMON") {
      setMode("pokemon");
      setSubIndex(0);
      return;
    }

    if (action === "RUN") {
      if (isWild) {
        pushLog("You got away safely!");
        finishBattle("flee");
      } else {
        pushLog("No running from a trainer battle!");
      }
    }
  }

  function useBagItem() {
    const entry = usableBagItems[subIndex];
    if (!entry) return;

    const item = SHOP_ITEMS.find((shopItem) => shopItem.id === entry.itemId);
    if (!item) return;

    if (item.effect === "pokeball") {
      const nextBag = normalizeBag(
        localBag.map((bagEntry) =>
          bagEntry.itemId === entry.itemId
            ? { ...bagEntry, quantity: bagEntry.quantity - 1 }
            : bagEntry,
        ),
      );
      syncPartyBag(localParty, nextBag);

      const catchResult = calculateCatchRate(
        enemyActive,
        item.value,
      );
      pushLog(`You threw a ${item.name}!`, catchResult.message);

      if (catchResult.caught) {
        finishBattle("win", battleToOwned(enemyActive));
      } else {
        setMode("actions");
      }
      return;
    }

    const nextParty = localParty.map((pokemon, index) => {
      if (index !== currentPartyIndex) return pokemon;

      const nextPokemon = {
        ...pokemon,
        moves: pokemon.moves.map((move) => ({ ...move })),
      };

      if (item.effect === "heal") {
        nextPokemon.currentHP = Math.min(
          playerActive.maxHP,
          nextPokemon.currentHP +
            (item.value >= 9999 ? playerActive.maxHP : item.value),
        );
      }

      if (item.effect === "status_cure") {
        nextPokemon.status = undefined;
      }

      if (item.effect === "revive" && nextPokemon.currentHP <= 0) {
        nextPokemon.currentHP = Math.max(1, Math.floor(playerActive.maxHP / 2));
      }

      return nextPokemon;
    });

    const updatedOwned = nextParty[currentPartyIndex];
    const updatedBattle = {
      ...playerActive,
      currentHP: updatedOwned.currentHP,
      status: updatedOwned.status,
    };
    setPlayerActive(updatedBattle);

    const nextBag = normalizeBag(
      localBag.map((bagEntry) =>
        bagEntry.itemId === entry.itemId
          ? { ...bagEntry, quantity: bagEntry.quantity - 1 }
          : bagEntry,
      ),
    );
    syncPartyBag(nextParty, nextBag);
    pushLog(`${playerActive.name} used ${item.name}!`);
    setMode("actions");
  }

  function switchPokemon() {
    const selected = switchableParty[subIndex];
    if (!selected) return;

    const fallbackBattle = playerPokemon;
    setCurrentPartyIndex(selected.index);
    setPlayerActive(ownedToBattle(selected.pokemon, fallbackBattle));
    pushLog(`Go! ${selected.pokemon.nickname ?? selected.pokemon.pokemonId}!`);
    setMode("actions");
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (mode === "actions") {
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
          handleActionConfirm(ACTIONS[actionIndex]);
        }

        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setMode("actions");
        return;
      }

      const listLength =
        mode === "fight"
          ? playerActive.moves.length
          : mode === "bag"
            ? usableBagItems.length
            : switchableParty.length;

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSubIndex((current) => (current + Math.max(1, listLength) - 1) % Math.max(1, listLength));
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSubIndex((current) => (current + 1) % Math.max(1, listLength));
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        if (mode === "fight") {
          const selectedMove = playerActive.moves[subIndex];
          if (selectedMove) {
            advanceTurnWithMove(selectedMove.moveId);
          }
          return;
        }

        if (mode === "bag") {
          useBagItem();
          return;
        }

        if (mode === "pokemon") {
          switchPokemon();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    actionIndex,
    mode,
    playerActive,
    usableBagItems,
    switchableParty,
    localBag,
    localParty,
    enemyActive,
    currentPartyIndex,
  ]);

  const actionRows = [
    ACTIONS.slice(0, 2),
    ACTIONS.slice(2, 4),
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between rounded-lg border border-green-500/40 bg-black/85 p-4 text-green-300">
      <div className="border border-green-500/30">
        <div className="border-b border-green-500/30 px-3 py-2">
          {isWild ? "Wild" : trainerName ?? "Trainer"} {enemyActive.name.toUpperCase()}{" "}
          <span className="text-green-500">Lv.{enemyActive.level}</span>
        </div>
        <div className="px-3 py-2">
          HP: {healthBar(enemyActive.currentHP, enemyActive.maxHP)}{" "}
          {enemyActive.currentHP}/{enemyActive.maxHP}
        </div>
        <div className="border-y border-green-500/30 px-3 py-2">
          {playerActive.name.toUpperCase()}{" "}
          <span className="text-green-500">Lv.{playerActive.level}</span>
        </div>
        <div className="px-3 py-2">
          HP: {healthBar(playerActive.currentHP, playerActive.maxHP)}{" "}
          {playerActive.currentHP}/{playerActive.maxHP}
        </div>
        <div className="px-3 py-2">
          Status: {playerActive.status ? playerActive.status.toUpperCase() : "—"}
        </div>
      </div>

      <div className="border border-green-500/30 px-3 py-3">
        {mode === "actions" ? (
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {actionRows.flat().map((action, index) => (
              <div key={action}>
                {actionIndex === index ? "> " : "  "}
                {action}
              </div>
            ))}
          </div>
        ) : null}

        {mode === "fight" ? (
          <div className="space-y-1">
            {playerActive.moves.map((moveSlot, index) => {
              const move = MOVES_DATA[moveSlot.moveId];
              return (
                <div key={moveSlot.moveId}>
                  {subIndex === index ? "> " : "  "}
                  {move?.name ?? moveSlot.moveId}{" "}
                  <span className="text-green-600">
                    PP {moveSlot.currentPP}/{moveSlot.maxPP}
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}

        {mode === "bag" ? (
          <div className="space-y-1">
            {usableBagItems.length === 0 ? (
              <div>No usable items.</div>
            ) : (
              usableBagItems.map((entry, index) => {
                const item = SHOP_ITEMS.find((shopItem) => shopItem.id === entry.itemId);
                return (
                  <div key={entry.itemId}>
                    {subIndex === index ? "> " : "  "}
                    {item?.name ?? entry.itemId} x{entry.quantity}
                  </div>
                );
              })
            )}
          </div>
        ) : null}

        {mode === "pokemon" ? (
          <div className="space-y-1">
            {switchableParty.length === 0 ? (
              <div>No other Pokemon can battle.</div>
            ) : (
              switchableParty.map(({ pokemon, index }) => (
                <div key={`${pokemon.pokemonId}-${index}`}>
                  {subIndex === index ? "> " : "  "}
                  {(pokemon.nickname ?? `#${pokemon.pokemonId}`)} Lv.{pokemon.level} HP{" "}
                  {pokemon.currentHP}
                </div>
              ))
            )}
          </div>
        ) : null}
      </div>

      <div className="min-h-20 border border-green-500/30 px-3 py-2 text-sm">
        {log.length === 0 ? (
          <>
            <div>{isWild ? "A wild battle began!" : `${trainerName} wants to fight!`}</div>
            <div>Choose an action.</div>
          </>
        ) : (
          log.slice(-3).map((message, index) => <div key={`${message}-${index}`}>{" > "}{message}</div>)
        )}
      </div>
    </div>
  );
}
