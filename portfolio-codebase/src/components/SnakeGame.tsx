import { useEffect, useRef, useState } from "react";
import MobileGameControls from "./MobileGameControls";

type SnakeGameProps = {
  lang: "en" | "pt";
  onExit: () => void;
};

type Direction = "up" | "down" | "left" | "right";

type Cell = {
  x: number;
  y: number;
};

type GameStatus = "running" | "gameOver";

type GameState = {
  snake: Cell[];
  food: Cell;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  status: GameStatus;
};

const GRID_SIZE = 20;
const BASE_SPEED = 180;
const MIN_SPEED = 75;
const SPEED_STEP = 12;

const directionVectors: Record<Direction, Cell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function isSameCell(a: Cell, b: Cell) {
  return a.x === b.x && a.y === b.y;
}

function isOppositeDirection(current: Direction, next: Direction) {
  return (
    (current === "up" && next === "down") ||
    (current === "down" && next === "up") ||
    (current === "left" && next === "right") ||
    (current === "right" && next === "left")
  );
}

function getSpeed(score: number) {
  return Math.max(MIN_SPEED, BASE_SPEED - Math.floor(score / 5) * SPEED_STEP);
}

function getRandomFoodPosition(snake: Cell[]) {
  const availableCells: Cell[] = [];

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const candidate = { x, y };

      if (!snake.some((segment) => isSameCell(segment, candidate))) {
        availableCells.push(candidate);
      }
    }
  }

  return availableCells[Math.floor(Math.random() * availableCells.length)];
}

function createInitialGameState(): GameState {
  const snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];

  return {
    snake,
    food: getRandomFoodPosition(snake),
    direction: "right",
    nextDirection: "right",
    score: 0,
    status: "running",
  };
}

function cloneGameState(game: GameState): GameState {
  return {
    ...game,
    snake: game.snake.map((segment) => ({ ...segment })),
    food: { ...game.food },
  };
}

export default function SnakeGame({ lang, onExit }: SnakeGameProps) {
  const gameRef = useRef<GameState>(createInitialGameState());
  const [gameState, setGameState] = useState<GameState>(() =>
    cloneGameState(gameRef.current),
  );
  const [speed, setSpeed] = useState(BASE_SPEED);

  function syncGameState() {
    setGameState(cloneGameState(gameRef.current));
  }

  function resetGame() {
    gameRef.current = createInitialGameState();
    setSpeed(BASE_SPEED);
    syncGameState();
  }

  function setDirection(nextDirection: Direction) {
    const game = gameRef.current;

    if (isOppositeDirection(game.direction, nextDirection)) {
      return;
    }

    game.nextDirection = nextDirection;
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key;

      if (key === "ArrowUp") {
        event.preventDefault();
        setDirection("up");
        return;
      }

      if (key === "ArrowDown") {
        event.preventDefault();
        setDirection("down");
        return;
      }

      if (key === "ArrowLeft") {
        event.preventDefault();
        setDirection("left");
        return;
      }

      if (key === "ArrowRight") {
        event.preventDefault();
        setDirection("right");
        return;
      }

      if (key === "Escape" || key.toLowerCase() === "q") {
        event.preventDefault();
        onExit();
        return;
      }

      if (gameRef.current.status === "gameOver" && key.toLowerCase() === "r") {
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

      game.direction = game.nextDirection;

      const vector = directionVectors[game.direction];
      const nextHead = {
        x: game.snake[0].x + vector.x,
        y: game.snake[0].y + vector.y,
      };

      const hitWall =
        nextHead.x < 0 ||
        nextHead.x >= GRID_SIZE ||
        nextHead.y < 0 ||
        nextHead.y >= GRID_SIZE;

      if (hitWall) {
        game.status = "gameOver";
        syncGameState();
        return;
      }

      const willEat = isSameCell(nextHead, game.food);
      const collisionBody = (willEat ? game.snake : game.snake.slice(0, -1)).some(
        (segment) => isSameCell(segment, nextHead),
      );

      if (collisionBody) {
        game.status = "gameOver";
        syncGameState();
        return;
      }

      game.snake.unshift(nextHead);

      if (willEat) {
        game.score += 1;
        game.food = getRandomFoodPosition(game.snake);
        setSpeed(getSpeed(game.score));
      } else {
        game.snake.pop();
      }

      syncGameState();
    }, speed);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [gameState.status, speed]);

  const board = Array.from({ length: GRID_SIZE }, (_, y) =>
    Array.from({ length: GRID_SIZE }, (_, x) => {
      const currentCell = { x, y };
      const snakeIndex = gameState.snake.findIndex((segment) =>
        isSameCell(segment, currentCell),
      );

      if (snakeIndex === 0) {
        return { char: "█", className: "text-green-100" };
      }

      if (snakeIndex > 0) {
        return { char: "█", className: "text-green-400" };
      }

      if (isSameCell(gameState.food, currentCell)) {
        return { char: "◆", className: "text-amber-300" };
      }

      return { char: "·", className: "text-green-900/80" };
    }),
  );

  const scoreLabel = lang === "en" ? "Score" : "Pontos";
  const controlsLabel =
    lang === "en"
      ? "Arrows to move · Q or Esc to quit"
      : "Setas para mover · Q ou Esc para sair";
  const gameOverLabel =
    lang === "en"
      ? `GAME OVER — Score: ${gameState.score} — Press R to restart or Q to quit`
      : `FIM DE JOGO — Pontos: ${gameState.score} — Pressione R para reiniciar ou Q para sair`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 font-mono text-green-300 fade-in">
      <div className="w-full max-w-5xl rounded-md border border-green-500/25 bg-green-950/10 px-4 py-2 text-center text-green-300 shadow-[0_0_18px_rgba(0,255,65,0.08)]">
        <span className="text-green-500/80">{scoreLabel}:</span>{" "}
        <span className="text-green-100 text-sm sm:text-base">{gameState.score}</span>
      </div>

      <div className="w-full max-w-5xl flex-1 rounded-lg border border-green-500/40 bg-black/80 p-4 sm:p-5 shadow-[0_0_22px_rgba(0,255,65,0.14)] flex items-center justify-center">
        <div className="flex justify-center">
          <div className="leading-none select-none">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="h-[1.22em] whitespace-nowrap text-base sm:text-lg md:text-xl">
              {row.map((cell, cellIndex) => (
                <span
                  key={cellIndex}
                  className={`inline-block w-[0.9em] text-center ${cell.className}`}
                >
                  {cell.char}
                </span>
              ))}
            </div>
          ))}
          </div>
        </div>
      </div>

      <div
        className={`text-center text-[10px] sm:text-xs ${
          gameState.status === "gameOver" ? "text-green-200" : "text-green-600"
        }`}
      >
        {gameState.status === "gameOver" ? gameOverLabel : controlsLabel}
      </div>

      <MobileGameControls
        actions={[
          { key: "r", label: "Restart", accent: "primary" },
          { key: "q", label: "Quit", accent: "danger" },
        ]}
      />
    </div>
  );
}
