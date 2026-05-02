import { useEffect, useMemo, useState } from "react";
import MobileGameControls from "../../../components/MobileGameControls";
import { MOVES_DATA, POKEMON_DATA, SHOP_ITEMS } from "../data/pokemon-data";
import {
  useItem,
  type GameState,
  type OwnedPokemon,
} from "../engine/game-state";

type PartyBagScreenProps = {
  gameState: GameState;
  onExit: (updatedState: GameState) => void;
};

type PartyBagPhase = "party" | "bag" | "bag_target";
type FeedbackTone = "success" | "error" | "info";

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

function getPokemonData(pokemonId: number) {
  return POKEMON_DATA.find((entry) => entry.id === pokemonId);
}

function getPokemonName(pokemon: OwnedPokemon) {
  return pokemon.nickname ?? getPokemonData(pokemon.pokemonId)?.name ?? "Unknown";
}

function getMaxHP(pokemon: OwnedPokemon) {
  const species = getPokemonData(pokemon.pokemonId);
  if (!species) {
    return pokemon.currentHP;
  }

  return (
    Math.floor((((species.baseStats.hp + 15) * 2 + 63) * pokemon.level) / 100) +
    pokemon.level +
    10
  );
}

function getStatusLabel(pokemon: OwnedPokemon) {
  return pokemon.status ? pokemon.status.toUpperCase() : "OK";
}

function getHPColor(currentHP: number, maxHP: number) {
  const ratio = maxHP === 0 ? 0 : currentHP / maxHP;
  if (currentHP <= 0 || ratio < 0.2) {
    return "text-red-400";
  }
  if (ratio <= 0.5) {
    return "text-yellow-300";
  }
  return "text-green-300";
}

function getFeedbackClassName(tone: FeedbackTone) {
  if (tone === "success") {
    return "text-green-300";
  }

  if (tone === "error") {
    return "text-red-400";
  }

  return "text-yellow-300";
}

export default function PartyBagScreen({
  gameState,
  onExit,
}: PartyBagScreenProps) {
  const [localState, setLocalState] = useState<GameState>(() => cloneGameState(gameState));
  const [phase, setPhase] = useState<PartyBagPhase>("party");
  const [bagIndex, setBagIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackTone, setFeedbackTone] = useState<FeedbackTone>("info");

  const bagEntries = useMemo(
    () =>
      localState.player.bag
        .map((entry) => ({
          ...entry,
          item: SHOP_ITEMS.find((item) => item.id === entry.itemId),
        }))
        .filter((entry) => entry.item),
    [localState.player.bag],
  );

  function setMessage(message: string, tone: FeedbackTone) {
    setFeedback(message);
    setFeedbackTone(tone);
  }

  function validateItemUse(itemId: string, partyIndex: number) {
    const bagEntry = localState.player.bag.find((entry) => entry.itemId === itemId);
    const item = SHOP_ITEMS.find((entry) => entry.id === itemId);
    const target = localState.player.party[partyIndex];

    if (!bagEntry || bagEntry.quantity <= 0 || !item || !target) {
      return { ok: false, message: "You don't have that item!" };
    }

    if (item.effect === "pokeball") {
      return { ok: false, message: "Can't use that here!" };
    }

    const maxHP = getMaxHP(target);

    if (item.effect === "heal" && target.currentHP >= maxHP) {
      return { ok: false, message: "HP is already full!" };
    }

    if (item.effect === "revive" && target.currentHP > 0) {
      return { ok: false, message: "Pokémon hasn't fainted!" };
    }

    if (item.effect === "status_cure" && !target.status) {
      return { ok: false, message: "No status condition!" };
    }

    return { ok: true, message: "" };
  }

  function handleUseItem(itemId: string, partyIndex: number) {
    const validation = validateItemUse(itemId, partyIndex);

    if (!validation.ok) {
      setMessage(validation.message, "error");
      return;
    }

    const item = SHOP_ITEMS.find((entry) => entry.id === itemId);
    const nextState = useItem(localState, itemId, partyIndex);
    const targetName = getPokemonName(nextState.player.party[partyIndex]);

    setLocalState(nextState);
    setPhase("bag");
    setSelectedItemId(null);
    setTargetIndex(0);
    setMessage(`${item?.name ?? "Item"} used on ${targetName}!`, "success");
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (phase === "party") {
        if (event.key === "Escape") {
          event.preventDefault();
          onExit(localState);
          return;
        }

        if (
          event.key.toLowerCase() === "b" ||
          event.key === "ArrowRight" ||
          event.key === "Enter"
        ) {
          event.preventDefault();
          setPhase("bag");
          setBagIndex(0);
        }

        return;
      }

      if (phase === "bag") {
        if (event.key === "Escape") {
          event.preventDefault();
          setPhase("party");
          return;
        }

        if (bagEntries.length === 0) {
          return;
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          setBagIndex((current) => (current + bagEntries.length - 1) % bagEntries.length);
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          setBagIndex((current) => (current + 1) % bagEntries.length);
          return;
        }

        if (event.key === "Enter") {
          event.preventDefault();
          const selected = bagEntries[bagIndex];
          if (!selected?.item) {
            return;
          }

          setSelectedItemId(selected.item.id);
          setTargetIndex(0);
          setPhase("bag_target");
        }

        return;
      }

      if (phase === "bag_target") {
        if (event.key === "Escape") {
          event.preventDefault();
          setPhase("bag");
          setSelectedItemId(null);
          return;
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          setTargetIndex(
            (current) =>
              (current + localState.player.party.length - 1) % localState.player.party.length,
          );
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          setTargetIndex((current) => (current + 1) % localState.player.party.length);
          return;
        }

        if (event.key === "Enter" && selectedItemId) {
          event.preventDefault();
          handleUseItem(selectedItemId, targetIndex);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [bagEntries, bagIndex, localState, onExit, phase, selectedItemId, targetIndex]);

  return (
    <div className="w-full h-full min-h-[36rem] flex flex-col justify-between gap-4 font-mono text-green-300">
      <div className="space-y-4">
        <div className="text-green-100 text-lg">
          {phase === "party" ? "YOUR PARTY" : "BAG"}
        </div>
        <div className="border-t border-green-500/30" />

        {phase === "party" ? (
          <div className="space-y-5">
            {localState.player.party.map((pokemon, index) => {
              const species = getPokemonData(pokemon.pokemonId);
              const maxHP = getMaxHP(pokemon);
              const hpClassName = getHPColor(pokemon.currentHP, maxHP);
              const fainted = pokemon.currentHP <= 0;

              return (
                <div key={`${pokemon.pokemonId}-${index}`} className="space-y-1">
                  <div className={fainted ? "text-red-400" : "text-green-300"}>
                    {index + 1}. {getPokemonName(pokemon).toUpperCase().padEnd(12, " ")} Lv.
                    {pokemon.level}   <span className={hpClassName}>HP: {pokemon.currentHP}/{maxHP}</span>
                    {fainted ? "   (fainted)" : ""}
                  </div>
                  <div className="text-green-200">
                    Type: {species?.types.join("/") ?? "Unknown"}
                  </div>
                  <div className="text-green-200">
                    Moves:{" "}
                    {pokemon.moves
                      .map((move) => MOVES_DATA[move.moveId]?.name ?? move.moveId)
                      .join(" | ")}
                  </div>
                  <div className="text-green-200">
                    XP: {pokemon.xp} / {pokemon.xpToNextLevel}
                  </div>
                  <div className={pokemon.status ? "text-yellow-300" : "text-green-200"}>
                    Status: {getStatusLabel(pokemon)}
                  </div>
                </div>
              );
            })}
            <div className="border-t border-green-500/30 pt-3 text-xs text-green-600">
              [B] Bag   [ESC] Voltar
            </div>
          </div>
        ) : null}

        {phase === "bag" ? (
          <div className="space-y-4">
            <div className="space-y-1">
              {bagEntries.length > 0 ? (
                bagEntries.map((entry, index) => (
                  <div key={entry.itemId}>
                    {bagIndex === index ? "> " : "  "}
                    {entry.item?.name.padEnd(14, " ")} x{entry.quantity}
                  </div>
                ))
              ) : (
                <div className="text-yellow-300">Your bag is empty.</div>
              )}
            </div>
            <div className="text-xs text-green-600">
              [↑↓] Navigate   [Enter] Use   [ESC] Back
            </div>
          </div>
        ) : null}

        {phase === "bag_target" ? (
          <div className="space-y-4">
            <div>Select a Pokémon:</div>
            <div className="space-y-1">
              {localState.player.party.map((pokemon, index) => {
                const maxHP = getMaxHP(pokemon);
                return (
                  <div
                    key={`${pokemon.pokemonId}-${index}`}
                    className={pokemon.currentHP <= 0 ? "text-red-400" : ""}
                  >
                    {targetIndex === index ? "> " : "  "}
                    {index + 1}. {getPokemonName(pokemon).padEnd(12, " ")} HP:{" "}
                    {pokemon.currentHP}/{maxHP}
                    {pokemon.status ? `  ${pokemon.status.toUpperCase()}` : ""}
                  </div>
                );
              })}
            </div>
            <div className="text-xs text-green-600">
              [↑↓] Navigate   [Enter] Confirm   [ESC] Back
            </div>
          </div>
        ) : null}
      </div>

      <div className="border border-green-500/30 p-3 min-h-16 text-sm">
        {feedback ? (
          <div className={getFeedbackClassName(feedbackTone)}>{feedback}</div>
        ) : (
          <div className="text-green-700">
            {phase === "party"
              ? "Review your team and open the bag when needed."
              : "Choose an item and then a target Pokémon."}
          </div>
        )}
      </div>
      <MobileGameControls
        actions={[
          { key: "Enter", label: phase === "party" ? "Bag" : "A", accent: "primary" },
          { key: "Escape", label: "B" },
        ]}
      />
    </div>
  );
}
