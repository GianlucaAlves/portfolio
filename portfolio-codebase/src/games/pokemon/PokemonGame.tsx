import { useEffect, useMemo, useRef, useState } from "react";
import MobileGameControls from "../../components/MobileGameControls";
import { MOVES_DATA, POKEMON_DATA, STARTERS } from "./data/pokemon-data";
import {
  createNewGame,
  loadGame,
  saveGame,
  skipPendingMove,
  teachPendingMove,
  type GameState,
} from "./engine/game-state";
import ExploreScreen from "./screens/ExploreScreen";
import GymScreen from "./screens/GymScreen";
import PartyBagScreen from "./screens/PartyBagScreen";
import ShopScreen from "./screens/ShopScreen";
import TrainerBattleScreen from "./screens/TrainerBattleScreen";

type PokemonGameProps = {
  onExit: () => void;
};

type IntroPhase = "start" | "name" | "starter";
type MainScreen =
  | "main_menu"
  | "explore"
  | "battle"
  | "gym"
  | "party_bag"
  | "shop"
  | "move_learn";

const START_OPTIONS = ["NEW GAME", "LOAD GAME"];
const MENU_OPTIONS = ["BATTLE", "EXPLORE", "GYM", "PARTY", "SHOP", "SAVE", "QUIT"];

function padRight(value: string, size: number) {
  return value.padEnd(size, " ");
}

function getPokemonName(pokemonId: number) {
  return POKEMON_DATA.find((pokemon) => pokemon.id === pokemonId)?.name ?? `#${pokemonId}`;
}

function appendLog(state: GameState, ...messages: string[]) {
  return {
    ...state,
    log: [...state.log, ...messages.filter(Boolean)],
  };
}

export default function PokemonGame({ onExit }: PokemonGameProps) {
  const [introPhase, setIntroPhase] = useState<IntroPhase>("start");
  const [screen, setScreen] = useState<MainScreen>("main_menu");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [savedGame, setSavedGame] = useState<GameState | null>(null);
  const [startSelection, setStartSelection] = useState(0);
  const [menuSelection, setMenuSelection] = useState(0);
  const [moveChoiceSelection, setMoveChoiceSelection] = useState(0);
  const [nameInput, setNameInput] = useState("");
  const [starterSelection, setStarterSelection] = useState(0);
  const menuSelectionRef = useRef(0);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const starterList = useMemo(
    () => STARTERS.map((id) => POKEMON_DATA.find((pokemon) => pokemon.id === id)!),
    [],
  );

  useEffect(() => {
    const loaded = loadGame();
    setSavedGame(loaded);
  }, []);

  useEffect(() => {
    menuSelectionRef.current = menuSelection;
  }, [menuSelection]);

  useEffect(() => {
    if (gameState && screen === "main_menu") {
      saveGame(gameState);
      setSavedGame(gameState);
    }
  }, [gameState, screen]);

  useEffect(() => {
    if (screen === "move_learn" && gameState && gameState.pendingMoveQueue.length === 0) {
      showMainMenu();
    }
  }, [gameState, screen]);

  useEffect(() => {
    if (!gameState && introPhase === "name") {
      nameInputRef.current?.focus();
    }
  }, [gameState, introPhase]);

  function openMainMenu(nextState: GameState) {
    const hasPendingMoveChoice = nextState.pendingMoveQueue.length > 0;

    setGameState({
      ...nextState,
      phase: "menu",
      currentScreen: hasPendingMoveChoice ? "move_learn" : "main_menu",
    });
    setScreen(hasPendingMoveChoice ? "move_learn" : "main_menu");
    if (hasPendingMoveChoice) {
      setMoveChoiceSelection(0);
    } else {
      setMenuSelection(0);
    }
  }

  function showMainMenu() {
    setScreen("main_menu");
    setMenuSelection(0);
    setGameState((current) =>
      current
        ? {
            ...current,
            phase: "menu",
            currentScreen: "main_menu",
          }
        : current,
    );
  }

  function startNewGame() {
    const starterId = STARTERS[starterSelection];
    const nextState = createNewGame(nameInput.trim(), starterId);
    openMainMenu(nextState);
  }

  function loadExistingGame() {
    if (!savedGame) {
      return;
    }

    openMainMenu(savedGame);
  }

  function handleMenuConfirm() {
    if (!gameState) {
      return;
    }

    const selected = MENU_OPTIONS[menuSelectionRef.current];

    if (selected === "BATTLE") {
      setScreen("battle");
      return;
    }

    if (selected === "EXPLORE") {
      setScreen("explore");
      return;
    }

    if (selected === "PARTY") {
      setScreen("party_bag");
      return;
    }

    if (selected === "GYM") {
      setScreen("gym");
      return;
    }

    if (selected === "SHOP") {
      setScreen("shop");
      return;
    }

    if (selected === "SAVE") {
      const nextState = appendLog(gameState, "Game saved successfully.");
      saveGame(nextState);
      setSavedGame(nextState);
      setGameState(nextState);
      return;
    }

    if (selected === "QUIT") {
      onExit();
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!gameState) {
        if (introPhase === "start") {
          if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            setStartSelection((current) => (current === 0 ? 1 : 0));
            return;
          }

          if (event.key === "Enter") {
            event.preventDefault();
            if (startSelection === 0) {
              setIntroPhase("name");
            } else if (savedGame) {
              loadExistingGame();
            }
            return;
          }

          if (event.key === "Escape" || event.key.toLowerCase() === "q") {
            event.preventDefault();
            onExit();
          }

          return;
        }

        if (introPhase === "name") {
          if (event.key === "Enter") {
            event.preventDefault();
            if (nameInput.trim()) {
              setIntroPhase("starter");
            }
            return;
          }

          if (event.key === "Escape") {
            event.preventDefault();
            setIntroPhase("start");
            return;
          }

          return;
        }

        if (introPhase === "starter") {
          if (["1", "2", "3"].includes(event.key)) {
            event.preventDefault();
            setStarterSelection(Number(event.key) - 1);
            return;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            setStarterSelection((current) => (current + 2) % 3);
            return;
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();
            setStarterSelection((current) => (current + 1) % 3);
            return;
          }

          if (event.key === "Enter") {
            event.preventDefault();
            if (nameInput.trim()) {
              startNewGame();
            }
            return;
          }

          if (event.key === "Escape") {
            event.preventDefault();
            setIntroPhase("name");
          }
        }

        return;
      }

      if (screen !== "main_menu") {
        if (screen === "move_learn") {
          const pending = gameState.pendingMoveQueue[0];
          const moveOptions = gameState.player.party[pending?.partyIndex ?? -1]?.moves ?? [];
          const totalOptions = moveOptions.length + 1;

          if (event.key === "ArrowUp") {
            event.preventDefault();
            setMoveChoiceSelection((current) => (current + totalOptions - 1) % totalOptions);
            return;
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();
            setMoveChoiceSelection((current) => (current + 1) % totalOptions);
            return;
          }

          if (event.key === "Enter" && pending) {
            event.preventDefault();

            if (moveChoiceSelection === moveOptions.length) {
              openMainMenu(skipPendingMove(gameState));
              return;
            }

            openMainMenu(teachPendingMove(gameState, moveChoiceSelection));
          }
        }

        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setMenuSelection((current) => (current + MENU_OPTIONS.length - 1) % MENU_OPTIONS.length);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setMenuSelection((current) => (current + 1) % MENU_OPTIONS.length);
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        handleMenuConfirm();
        return;
      }

      if (event.key === "Escape" || event.key.toLowerCase() === "q") {
        event.preventDefault();
        onExit();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    gameState,
    introPhase,
    moveChoiceSelection,
    onExit,
    savedGame,
    screen,
    startSelection,
    starterSelection,
  ]);

  if (!gameState && introPhase === "start") {
    const loadDisabled = !savedGame;

    return (
      <div className="w-full h-full min-h-[36rem] flex flex-col justify-center items-center gap-6 font-mono text-green-300">
        <pre className="text-center text-green-400 whitespace-pre text-xs sm:text-sm leading-none">
{`  ╔════════════════════════════════╗
  ║     POKÉMON TERMINAL  v1.0    ║
  ║         Generation I          ║
  ╚════════════════════════════════╝`}
        </pre>

        <div className="space-y-2 text-sm sm:text-base">
          {START_OPTIONS.map((option, index) => (
            <div
              key={option}
              className={
                index === startSelection
                  ? "text-green-100"
                  : loadDisabled && option === "LOAD GAME"
                    ? "text-green-800"
                    : ""
              }
            >
              {index === startSelection ? "> " : "  "}
              {option}
              {option === "LOAD GAME" && loadDisabled ? "  (disabled)" : ""}
            </div>
          ))}
        </div>

        <div className="text-xs text-green-600">
          [↑↓] Navigate   [Enter] Confirm   [Q] Exit
        </div>
        <MobileGameControls
          actions={[
            { key: "Enter", label: "A", accent: "primary" },
            { key: "q", label: "Quit", accent: "danger" },
          ]}
        />
      </div>
    );
  }

  if (!gameState && introPhase === "name") {
    return (
      <div className="w-full h-full min-h-[36rem] flex flex-col justify-center items-center gap-3 font-mono text-green-300">
        <div>What is your name, trainer?</div>
        <label className="flex w-full max-w-xs items-center gap-2 text-green-100">
          <span>&gt;</span>
          <input
            ref={nameInputRef}
            value={nameInput}
            maxLength={10}
            onChange={(event) => setNameInput(event.target.value.slice(0, 10))}
            onKeyDown={(event) => {
              if (event.key === "Enter" && nameInput.trim()) {
                event.preventDefault();
                setIntroPhase("starter");
              }

              if (event.key === "Escape") {
                event.preventDefault();
                setIntroPhase("start");
              }
            }}
            className="w-full bg-transparent outline-none text-green-100"
          />
        </label>
        <div className="text-xs text-green-600">[Enter] Confirm   [ESC] Back</div>
        <MobileGameControls
          directional={false}
          actions={[
            { key: "Enter", label: "A", accent: "primary" },
            { key: "Escape", label: "B" },
          ]}
        />
      </div>
    );
  }

  if (!gameState && introPhase === "starter") {
    return (
      <div className="w-full h-full min-h-[36rem] flex flex-col justify-center items-center gap-4 font-mono text-green-300">
        <div>Choose your starter Pokémon:</div>
        <div className="space-y-2">
          {starterList.map((starter, index) => (
            <div key={starter.id}>
              {starterSelection === index ? "> " : "  "}
              {index + 1}. {padRight(starter.name, 11)} ({starter.types.join("/")})
            </div>
          ))}
        </div>
        <div className="text-xs text-green-600">[1-3] Choose   [Enter] Confirm</div>
        <MobileGameControls
          actions={[
            { key: "Enter", label: "A", accent: "primary" },
            { key: "Escape", label: "B" },
          ]}
        />
      </div>
    );
  }

  if (!gameState) {
    return null;
  }

  if (screen === "explore") {
    return (
      <ExploreScreen
        gameState={gameState}
        onExploreEnd={(updatedState) => setGameState(updatedState)}
        onExit={showMainMenu}
      />
    );
  }

  if (screen === "move_learn") {
    const pending = gameState.pendingMoveQueue[0];
    const targetPokemon = pending ? gameState.player.party[pending.partyIndex] : null;
    const currentMoves = targetPokemon?.moves ?? [];

    if (!pending || !targetPokemon) {
      return null;
    }

    return (
      <div className="w-full h-full min-h-[36rem] flex flex-col justify-between gap-4 font-mono text-green-300">
        <div className="space-y-4">
          <div className="text-green-100 text-lg">{pending.pokemonName.toUpperCase()}</div>
          <div className="border-t border-green-500/30" />
          <div>{`${pending.pokemonName} is trying to learn ${pending.moveName}!`}</div>
          <div>But it already knows 4 moves.</div>
          <div>Choose a move to forget:</div>
          <div className="space-y-1">
            {currentMoves.map((move, index) => (
              <div key={`${move.moveId}-${index}`}>
                {moveChoiceSelection === index ? "> " : "  "}
                {index + 1}. {MOVES_DATA[move.moveId]?.name ?? move.moveId}
              </div>
            ))}
            <div>
              {moveChoiceSelection === currentMoves.length ? "> " : "  "}
              {currentMoves.length + 1}. STOP LEARNING {pending.moveName.toUpperCase()}
            </div>
          </div>
          <div className="text-xs text-green-600">[↑↓] Navigate   [Enter] Confirm</div>
        </div>

        <div className="min-h-24 border border-green-500/30 p-3 text-xs sm:text-sm">
          <div>{`New move: ${pending.moveName}`}</div>
          <div>{`Level learned: Lv.${pending.level}`}</div>
        </div>
        <MobileGameControls
          actions={[{ key: "Enter", label: "A", accent: "primary" }]}
        />
      </div>
    );
  }

  if (screen === "battle") {
    return (
      <TrainerBattleScreen
        gameState={gameState}
        onBattleEnd={(updatedState) => openMainMenu(updatedState)}
        onExit={showMainMenu}
      />
    );
  }

  if (screen === "gym") {
    return (
      <GymScreen
        gameState={gameState}
        onGymEnd={(updatedState) => openMainMenu(updatedState)}
        onExit={showMainMenu}
      />
    );
  }

  if (screen === "party_bag") {
    return (
      <PartyBagScreen
        gameState={gameState}
        onExit={(updatedState) => openMainMenu(updatedState)}
      />
    );
  }

  if (screen === "shop") {
    return (
      <ShopScreen
        gameState={gameState}
        onExit={(updatedState) => openMainMenu(updatedState)}
      />
    );
  }

  const leadPokemon = gameState.player.party[0];
  const lastLogs = gameState.log.slice(-4);

  return (
    <div className="w-full h-full min-h-[36rem] flex flex-col justify-between gap-4 font-mono text-green-300">
      <div className="space-y-4">
        <pre className="border border-green-500/30 p-3 text-sm whitespace-pre-wrap">
{`┌─────────────────────────────────┐
│  Trainer: ${padRight(gameState.player.name.toUpperCase(), 10)} $${padRight(String(gameState.player.money), 7)}│
│  Party: ${padRight(
  `${getPokemonName(leadPokemon?.pokemonId ?? 0)} Lv.${leadPokemon?.level ?? 0}`,
  18,
)} HP:${leadPokemon && leadPokemon.currentHP > 0 ? "✓" : "✝"}   │
└─────────────────────────────────┘`}
        </pre>

        <div className="space-y-1">
          {MENU_OPTIONS.map((option, index) => (
            <div key={option}>
              {menuSelection === index ? "> " : "  "}
              {option}
            </div>
          ))}
        </div>

        <div className="text-xs text-green-600">[↑↓] Navigate   [Enter] Confirm</div>
      </div>

      <div className="min-h-24 border border-green-500/30 p-3 text-xs sm:text-sm">
        {lastLogs.length === 0 ? (
          <div>No recent events.</div>
        ) : (
          lastLogs.map((message, index) => <div key={`${message}-${index}`}>{`> ${message}`}</div>)
        )}
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
