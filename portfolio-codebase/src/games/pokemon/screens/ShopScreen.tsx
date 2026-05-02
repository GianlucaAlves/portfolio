import { useEffect, useRef, useState } from "react";
import MobileGameControls from "../../../components/MobileGameControls";
import { SHOP_ITEMS } from "../data/pokemon-data";
import {
  buyItem,
  type GameState,
  type OwnedPokemon,
} from "../engine/game-state";

type ShopScreenProps = {
  gameState: GameState;
  onExit: (updatedState: GameState) => void;
};

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

function normalizeName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function findShopItem(query: string) {
  const normalized = normalizeName(query);
  if (!normalized) {
    return null;
  }

  const exact =
    SHOP_ITEMS.find((item) => normalizeName(item.name) === normalized) ??
    SHOP_ITEMS.find((item) => item.id === normalized.replace(/\s+/g, "-"));

  if (exact) {
    return exact;
  }

  return (
    SHOP_ITEMS.find((item) => normalizeName(item.name).includes(normalized)) ?? null
  );
}

function getFeedbackClassName(tone: FeedbackTone) {
  if (tone === "success") {
    return "text-green-300";
  }

  if (tone === "error") {
    return "text-red-400";
  }

  return "text-green-700";
}

export default function ShopScreen({ gameState, onExit }: ShopScreenProps) {
  const [localState, setLocalState] = useState<GameState>(() => cloneGameState(gameState));
  const [input, setInput] = useState("");
  const [feedback, setFeedbackMessage] = useState("");
  const [feedbackTone, setFeedbackTone] = useState<FeedbackTone>("info");
  const inputRef = useRef<HTMLInputElement>(null);

  function updateFeedback(message: string, tone: FeedbackTone) {
    setFeedbackTone(tone);
    setFeedbackMessage(message);
  }

  function handlePurchase() {
    const parts = input.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return;
    }

    const lastPart = parts.at(-1) ?? "";
    const quantityCandidate = Number(lastPart);
    const hasQuantity = Number.isFinite(quantityCandidate) && quantityCandidate > 0;
    const quantity = hasQuantity ? quantityCandidate : 1;
    const itemQuery = hasQuantity ? parts.slice(0, -1).join(" ") : parts.join(" ");

    if (!itemQuery.trim()) {
      updateFeedback("Item not found! Try: potion, great ball, antidote...", "error");
      return;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      updateFeedback("Quantity must be a positive number.", "error");
      return;
    }

    const item = findShopItem(itemQuery);
    if (!item) {
      updateFeedback("Item not found! Try: potion, great ball, antidote...", "error");
      return;
    }

    const totalCost = item.price * quantity;
    if (localState.player.money < totalCost) {
      updateFeedback("Not enough money!", "error");
      return;
    }

    const nextState = buyItem(localState, item.id, quantity);
    setLocalState(nextState);
    setInput("");
    updateFeedback(
      `Bought ${quantity}x ${item.name} for $${totalCost}. Remaining: $${nextState.player.money}`,
      "success",
    );
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onExit(localState);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [localState, onExit]);

  return (
    <div className="w-full h-full min-h-[36rem] flex flex-col justify-between gap-4 font-mono text-green-300">
      <div className="space-y-4">
        <div className="text-green-100 text-lg">POKÉMART</div>
        <div className="border-t border-green-500/30" />

        <div className="space-y-1">
          {SHOP_ITEMS.map((item) => (
            <div key={item.id}>
              {item.name.padEnd(15, " ")} ${item.price}
            </div>
          ))}
        </div>

        <div className="border-t border-green-500/30 pt-3">
          Your money:{" "}
          <span className={localState.player.money < 500 ? "text-yellow-300" : "text-green-300"}>
            ${localState.player.money}
          </span>
        </div>

        <div className="space-y-2">
          <div>Buy: [item name] [quantity] (ex: potion 3)</div>
          <div className="flex items-center gap-2">
            <span>&gt;</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handlePurchase();
                }
              }}
              className="w-full bg-transparent outline-none text-green-200"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="border border-green-500/30 p-3 min-h-16 text-sm">
          {feedback ? (
            <div className={getFeedbackClassName(feedbackTone)}>{feedback}</div>
          ) : (
            <div className="text-green-700">
              Stock up before exploring or challenging another trainer.
            </div>
          )}
        </div>
        <div className="text-xs text-green-600">[ESC] Voltar</div>
        <MobileGameControls
          directional={false}
          actions={[
            { key: "Enter", label: "Buy", accent: "primary" },
            { key: "Escape", label: "B" },
          ]}
        />
      </div>
    </div>
  );
}
