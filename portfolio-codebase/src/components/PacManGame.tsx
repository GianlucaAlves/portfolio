import { useEffect, useRef, useState } from "react";

type PacManGameProps = {
  lang: "en" | "pt";
  onExit: () => void;
};

type Direction = "up" | "down" | "left" | "right";
type Tile = "W" | "." | "o" | " ";
type Status = "running" | "gameOver" | "win";

type Cell = {
  x: number;
  y: number;
};

type Ghost = {
  id: number;
  position: Cell;
  direction: Direction;
  startPosition: Cell;
};

type GameState = {
  map: Tile[][];
  pacman: Cell;
  pacmanStart: Cell;
  direction: Direction;
  nextDirection: Direction;
  ghosts: Ghost[];
  score: number;
  lives: number;
  status: Status;
  vulnerableUntil: number;
  remainingDots: number;
  eventMessage: string;
  eventType: "idle" | "ghostEaten" | "lifeLost";
  eventUntil: number;
};

const BASE_SPEED = 200;

const RAW_MAP = [
  "WWWWWWWWWWWWWWWWWWWWW",
  "WPo....W.....W....oPW",
  "W.WWW.WW.WWW.WW.WWW.W",
  "W...................W",
  "W.WWW.W.WWWWW.W.WWW.W",
  "W.....W...W...W.....W",
  "WWWWW.WWW W WWW.WWWWW",
  "W.....W   G   W.....W",
  "W.WWW.W WWWWW W.WWW.W",
  "W.o... ....... ...o.W",
  "W.WWW.W WWWWW W.WWW.W",
  "W.....W   P   W.....W",
  "WWWWW.WWW W WWW.WWWWW",
  "W.....W...W...W.....W",
  "W.WWW.W.WWWWW.W.WWW.W",
  "W...................W",
  "W.WWW.WW.WWW.WW.WWW.W",
  "Wo....W.....W....G.oW",
  "W.WWWWWWW.W.WWWWWWW.W",
  "WP........G........PW",
  "WWWWWWWWWWWWWWWWWWWWW",
] as const;

const directionVectors: Record<Direction, Cell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function sameCell(a: Cell, b: Cell) {
  return a.x === b.x && a.y === b.y;
}

function cloneMap(map: Tile[][]) {
  return map.map((row) => [...row]);
}

function cloneState(state: GameState): GameState {
  return {
    ...state,
    map: cloneMap(state.map),
    pacman: { ...state.pacman },
    pacmanStart: { ...state.pacmanStart },
    ghosts: state.ghosts.map((ghost) => ({
      ...ghost,
      position: { ...ghost.position },
      startPosition: { ...ghost.startPosition },
    })),
  };
}

function isWall(map: Tile[][], cell: Cell) {
  return (
    cell.y < 0 ||
    cell.y >= map.length ||
    cell.x < 0 ||
    cell.x >= map[0].length ||
    map[cell.y][cell.x] === "W"
  );
}

function getNextCell(cell: Cell, direction: Direction) {
  const vector = directionVectors[direction];
  return { x: cell.x + vector.x, y: cell.y + vector.y };
}

function getValidDirections(map: Tile[][], cell: Cell) {
  return (Object.keys(directionVectors) as Direction[]).filter(
    (direction) => !isWall(map, getNextCell(cell, direction)),
  );
}

function parseMap() {
  const map: Tile[][] = [];
  const ghostStarts: Ghost[] = [];
  let pacmanStart: Cell = { x: 1, y: 1 };
  let remainingDots = 0;
  let ghostId = 0;

  RAW_MAP.forEach((row, y) => {
    const parsedRow: Tile[] = [];

    row.split("").forEach((char, x) => {
      if (char === "P") {
        pacmanStart = { x, y };
        parsedRow.push(" ");
        return;
      }

      if (char === "G") {
        ghostStarts.push({
          id: ghostId,
          position: { x, y },
          startPosition: { x, y },
          direction: "left",
        });
        ghostId += 1;
        parsedRow.push(" ");
        return;
      }

      const tile = char as Tile;
      parsedRow.push(tile);

      if (tile === "." || tile === "o") {
        remainingDots += 1;
      }
    });

    map.push(parsedRow);
  });

  return { map, pacmanStart, ghostStarts, remainingDots };
}

function createInitialGameState(): GameState {
  const { map, pacmanStart, ghostStarts, remainingDots } = parseMap();

  return {
    map,
    pacman: { ...pacmanStart },
    pacmanStart,
    direction: "right",
    nextDirection: "right",
    ghosts: ghostStarts,
    score: 0,
    lives: 3,
    status: "running",
    vulnerableUntil: 0,
    remainingDots,
    eventMessage: "",
    eventType: "idle",
    eventUntil: 0,
  };
}

function getPacmanChar(direction: Direction) {
  switch (direction) {
    case "up":
      return "ᗧ";
    case "down":
      return "ᗧ";
    case "left":
      return "ᗧ";
    case "right":
      return "ᗧ";
  }
}

export default function PacManGame({ lang, onExit }: PacManGameProps) {
  const gameRef = useRef<GameState>(createInitialGameState());
  const [gameState, setGameState] = useState<GameState>(() =>
    cloneState(gameRef.current),
  );

  function syncState() {
    setGameState(cloneState(gameRef.current));
  }

  function resetEntitiesOnly(game: GameState) {
    game.pacman = { ...game.pacmanStart };
    game.direction = "right";
    game.nextDirection = "right";
    game.ghosts = game.ghosts.map((ghost) => ({
      ...ghost,
      position: { ...ghost.startPosition },
      direction: "left",
    }));
    game.vulnerableUntil = 0;
  }

  function setEvent(
    game: GameState,
    type: "ghostEaten" | "lifeLost",
    message: string,
    durationMs: number,
  ) {
    game.eventType = type;
    game.eventMessage = message;
    game.eventUntil = Date.now() + durationMs;
  }

  function resetGame() {
    gameRef.current = createInitialGameState();
    syncState();
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key;
      const game = gameRef.current;

      if (key === "ArrowUp") {
        event.preventDefault();
        game.nextDirection = "up";
        return;
      }

      if (key === "ArrowDown") {
        event.preventDefault();
        game.nextDirection = "down";
        return;
      }

      if (key === "ArrowLeft") {
        event.preventDefault();
        game.nextDirection = "left";
        return;
      }

      if (key === "ArrowRight") {
        event.preventDefault();
        game.nextDirection = "right";
        return;
      }

      if (key === "Escape" || key.toLowerCase() === "q") {
        event.preventDefault();
        onExit();
        return;
      }

      if (
        (game.status === "gameOver" || game.status === "win") &&
        key.toLowerCase() === "r"
      ) {
        event.preventDefault();
        resetGame();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onExit]);

  useEffect(() => {
    if (gameState.status !== "running") {
      return;
    }

    const intervalId = window.setInterval(() => {
      const game = gameRef.current;

      if (game.status !== "running") {
        return;
      }

      const now = Date.now();

      if (game.eventUntil > 0 && now >= game.eventUntil) {
        game.eventType = "idle";
        game.eventMessage = "";
        game.eventUntil = 0;
      }

      const nextRequestedCell = getNextCell(game.pacman, game.nextDirection);

      if (!isWall(game.map, nextRequestedCell)) {
        game.direction = game.nextDirection;
      }

      const nextPacmanCell = getNextCell(game.pacman, game.direction);

      if (!isWall(game.map, nextPacmanCell)) {
        game.pacman = nextPacmanCell;
      }

      const tile = game.map[game.pacman.y][game.pacman.x];

      if (tile === ".") {
        game.score += 10;
        game.map[game.pacman.y][game.pacman.x] = " ";
        game.remainingDots -= 1;
      } else if (tile === "o") {
        game.score += 50;
        game.map[game.pacman.y][game.pacman.x] = " ";
        game.remainingDots -= 1;
        game.vulnerableUntil = now + 5000;
      }

      game.ghosts = game.ghosts.map((ghost) => {
        const validDirections = getValidDirections(game.map, ghost.position);
        const directionPool = validDirections.includes(ghost.direction)
          ? validDirections
          : validDirections.filter(Boolean);

        const chosenDirection =
          directionPool[Math.floor(Math.random() * directionPool.length)] ??
          ghost.direction;
        const nextGhostCell = getNextCell(ghost.position, chosenDirection);

        return {
          ...ghost,
          direction: chosenDirection,
          position: isWall(game.map, nextGhostCell) ? ghost.position : nextGhostCell,
        };
      });

      const ghostsVulnerable = now < game.vulnerableUntil;
      const collidingGhosts = game.ghosts.filter((ghost) =>
        sameCell(ghost.position, game.pacman),
      );

      if (collidingGhosts.length > 0) {
        if (ghostsVulnerable) {
          const eatenGhostIds = new Set(collidingGhosts.map((ghost) => ghost.id));
          game.score += collidingGhosts.length * 200;
          setEvent(
            game,
            "ghostEaten",
            lang === "en"
              ? `Ghost eaten! +${collidingGhosts.length * 200} points`
              : `Fantasma comido! +${collidingGhosts.length * 200} pontos`,
            900,
          );
          game.ghosts = game.ghosts.map((ghost) =>
            eatenGhostIds.has(ghost.id)
              ? {
                  ...ghost,
                  position: { ...ghost.startPosition },
                  direction: "left",
                }
              : ghost,
          );
        } else {
          game.lives -= 1;
          setEvent(
            game,
            "lifeLost",
            lang === "en"
              ? `Ouch! You lost a life${game.lives > 0 ? "..." : ""}`
              : `Ops! Você perdeu uma vida${game.lives > 0 ? "..." : ""}`,
            1100,
          );

          if (game.lives <= 0) {
            game.status = "gameOver";
          } else {
            resetEntitiesOnly(game);
          }

          syncState();
          return;
        }
      }

      if (game.remainingDots <= 0) {
        game.status = "win";
      }

      syncState();
    }, BASE_SPEED);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [gameState.status]);

  const ghostsVulnerable = Date.now() < gameState.vulnerableUntil;
  const eventActive = gameState.eventUntil > Date.now();
  const livesText = Array.from({ length: gameState.lives }, () => "♥").join(" ");
  const scoreLabel = lang === "en" ? "Score" : "Pontos";
  const livesLabel = lang === "en" ? "Lives" : "Vidas";
  const levelLabel = lang === "en" ? "Level" : "Nível";
  const controlsLabel =
    lang === "en"
      ? "Arrows to move · Q or Esc to quit"
      : "Setas para mover · Q ou Esc para sair";
  const gameOverLabel =
    lang === "en"
      ? `GAME OVER — Score: ${gameState.score} — Press R to restart or Q to quit`
      : `FIM DE JOGO — Pontos: ${gameState.score} — Pressione R para reiniciar ou Q para sair`;
  const winLabel =
    lang === "en"
      ? `YOU WIN! — Score: ${gameState.score} — Press R to play again or Q to quit`
      : `VOCÊ VENCEU! — Pontos: ${gameState.score} — Pressione R para jogar de novo ou Q para sair`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 font-mono text-green-300 fade-in">
      <div
        className={`w-full max-w-6xl rounded-md border px-4 py-3 shadow-[0_0_18px_rgba(0,255,65,0.08)] transition-colors duration-150 ${
          gameState.eventType === "lifeLost" && eventActive
            ? "border-rose-400/60 bg-rose-950/20"
            : gameState.eventType === "ghostEaten" && eventActive
              ? "border-amber-300/60 bg-amber-950/10"
              : "border-green-500/25 bg-green-950/10"
        }`}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-xs sm:text-sm md:text-base">
          <div>
            <span className="text-green-500/80">{scoreLabel}:</span>{" "}
            <span className="text-green-100">{gameState.score}</span>
          </div>
          <div>
            <span className="text-green-500/80">{livesLabel}:</span>{" "}
            <span className="text-rose-300 tracking-[0.2em]">{livesText || "—"}</span>
          </div>
          <div>
            <span className="text-green-500/80">{levelLabel}:</span>{" "}
            <span className="text-green-100">1</span>
          </div>
        </div>
        <div className="mt-2 text-center text-[10px] sm:text-xs text-green-600">
          {eventActive && gameState.eventMessage
            ? gameState.eventMessage
            : ghostsVulnerable
              ? lang === "en"
                ? "Power mode active: ghosts are vulnerable"
                : "Modo de poder ativo: fantasmas vulneráveis"
              : lang === "en"
                ? "Eat all dots, avoid ghosts, and use power pellets wisely"
                : "Coma todos os pontos, evite fantasmas e use os power pellets"}
        </div>
      </div>

      <div
        className={`w-full max-w-6xl flex-1 rounded-lg border p-4 sm:p-5 transition-all duration-150 flex items-center justify-center ${
          gameState.eventType === "lifeLost" && eventActive
            ? "border-rose-400/50 bg-[radial-gradient(circle_at_top,rgba(80,18,30,0.4),rgba(0,0,0,0.9)_55%)] shadow-[0_0_28px_rgba(251,113,133,0.18)] scale-[1.01]"
            : gameState.eventType === "ghostEaten" && eventActive
              ? "border-amber-300/50 bg-[radial-gradient(circle_at_top,rgba(72,52,12,0.35),rgba(0,0,0,0.9)_55%)] shadow-[0_0_28px_rgba(253,224,71,0.14)]"
              : "border-cyan-500/35 bg-[radial-gradient(circle_at_top,rgba(16,40,48,0.45),rgba(0,0,0,0.88)_55%)] shadow-[0_0_24px_rgba(34,211,238,0.12)]"
        }`}
      >
        <div className="flex justify-center">
          <div className="leading-none select-none">
          {gameState.map.map((row, rowIndex) => (
            <div key={rowIndex} className="h-[1.22em] whitespace-nowrap text-base sm:text-lg md:text-xl">
              {row.map((tile, cellIndex) => {
                const cell = { x: cellIndex, y: rowIndex };
                const ghost = gameState.ghosts.find((item) =>
                  sameCell(item.position, cell),
                );

                if (sameCell(gameState.pacman, cell)) {
                  return (
                    <span
                      key={cellIndex}
                      className="inline-block w-[0.9em] text-center font-bold text-amber-300 drop-shadow-[0_0_6px_rgba(253,224,71,0.55)]"
                    >
                      {getPacmanChar(gameState.direction)}
                    </span>
                  );
                }

                if (ghost) {
                  return (
                    <span
                      key={cellIndex}
                      className={`inline-block w-[0.9em] text-center font-bold ${
                        ghostsVulnerable
                          ? "text-cyan-300 drop-shadow-[0_0_6px_rgba(103,232,249,0.5)]"
                          : "text-fuchsia-300 drop-shadow-[0_0_6px_rgba(240,171,252,0.45)]"
                      }`}
                    >
                      {ghostsVulnerable ? "ᗤ" : "ᗣ"}
                    </span>
                  );
                }

                if (tile === "W") {
                  return (
                    <span
                      key={cellIndex}
                      className="inline-block w-[0.9em] text-center font-bold text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.35)]"
                    >
                      █
                    </span>
                  );
                }

                if (tile === ".") {
                  return (
                    <span
                      key={cellIndex}
                      className="inline-block w-[0.9em] text-center text-green-700/90"
                    >
                      ·
                    </span>
                  );
                }

                if (tile === "o") {
                  return (
                    <span
                      key={cellIndex}
                      className="inline-block w-[0.9em] text-center text-amber-200 drop-shadow-[0_0_5px_rgba(253,224,71,0.35)]"
                    >
                      ●
                    </span>
                  );
                }

                return (
                  <span
                    key={cellIndex}
                    className="inline-block w-[0.9em] text-center text-transparent"
                  >
                    {" "}
                  </span>
                );
              })}
            </div>
          ))}
          </div>
        </div>
      </div>

      <div
        className={`text-center text-[10px] sm:text-xs ${
          gameState.status === "running" ? "text-green-600" : "text-green-200"
        }`}
      >
        {gameState.status === "gameOver"
          ? gameOverLabel
          : gameState.status === "win"
            ? winLabel
            : controlsLabel}
      </div>
    </div>
  );
}
