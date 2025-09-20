import { useEffect, useState } from "react";
import { GameStateManager, type GameState } from "../../engine";

interface IHUDProps {
  gameManager: GameStateManager;
  onMainMenu: () => void;
}

const HUD = ({ gameManager, onMainMenu }: IHUDProps) => {
  const [gameState, setGameState] = useState<GameState>(gameManager.getState());
  const [time, setTime] = useState(0);

  useEffect(() => {
    const unsubscribe = gameManager.subscribe(setGameState);
    return unsubscribe;
  }, [gameManager]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (!gameState.gameOver) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.gameOver]);

  useEffect(() => {
    setTime(0);
  }, [gameState.gameOver, gameState.gameWon]);

  return (
    <div className="z-10 absolute top-0 left-0 w-full p-4 flex justify-between items-center text-white font-mono">
      {/* Left: Mines counter */}
      <div className="bg-black/60 px-3 py-1 rounded-md shadow-lg">
        💣 {gameState.mineCount - gameState.flagCount}
      </div>

      {/* Center: Title */}
      <div className="text-xl font-bold tracking-widest drop-shadow-md">
        3D Minesweeper
      </div>

      {/* Right: Timer & Main Menu button */}
      <div className="flex items-center space-x-2">
        <div className="bg-black/60 px-3 py-1 rounded-md shadow-lg">
          ⏱ {time}s
        </div>
        <button
          className="cursor-pointer bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded-md shadow-lg ml-2"
          onClick={onMainMenu}
        >
          Main Menu
        </button>
      </div>

      {/* Overlay on game end */}
      {gameState.gameOver && (
        <div className="absolute h-screen w-screen inset-0 flex items-center justify-center bg-black/70">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">
              {gameState.gameWon ? "🎉 You Win!" : "💥 Game Over"}
            </h1>
            <button
              className="cursor-pointer bg-teal-600 hover:bg-teal-700 px-6 py-2 rounded-md shadow-lg"
              onClick={() => gameManager.restart()}
            >
              Restart
            </button>

            <button
              className="cursor-pointer bg-gray-700 hover:bg-gray-800 px-6 py-2 rounded-md shadow-lg ml-4"
              onClick={onMainMenu}
            >
              Main Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default HUD;
