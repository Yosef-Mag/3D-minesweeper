import { GameCell } from "./GameCell";
import { GameStateManager } from "./GameStateManager";
import { type GameState, type Cell } from "./GameEngine";
import { useEffect, useState, useCallback, memo, useMemo } from "react";

interface IGameBoardProps {
  gameManager: GameStateManager;
}

export const GameBoard = ({ gameManager }: IGameBoardProps) => {
  const [gameState, setGameState] = useState<GameState>(gameManager.getState());

  useEffect(() => {
    const unsubscribe = gameManager.subscribe(setGameState);
    return unsubscribe;
  }, [gameManager]);

  const handleReveal = useCallback(
    (r: number, c: number) => {
      gameManager.revealCell(r, c);
    },
    [gameManager]
  );

  const handleFlag = useCallback(
    (r: number, c: number) => {
      gameManager.flagCell(r, c);
    },
    [gameManager]
  );

  const cellPositions = useMemo(() => {
    const positions: [number, number, number][][] = [];
    for (let i = 0; i < gameState.grid.length; i++) {
      positions[i] = [];
      for (let j = 0; j < gameState.grid[0].length; j++) {
        positions[i][j] = [
          i - gameState.grid.length / 2 + 0.5,
          0,
          j - gameState.grid[0].length / 2 + 0.5,
        ];
      }
    }
    return positions;
  }, [gameState.grid.length, gameState.grid[0].length]);

  const cellCallbacks = useMemo(() => {
    const callbacks: { reveal: () => void; flag: () => void }[][] = [];
    for (let i = 0; i < gameState.grid.length; i++) {
      callbacks[i] = [];
      for (let j = 0; j < gameState.grid[0].length; j++) {
        const row = i;
        const col = j;
        callbacks[i][j] = {
          reveal: () => handleReveal(row, col),
          flag: () => handleFlag(row, col),
        };
      }
    }
    return callbacks;
  }, [
    handleReveal,
    handleFlag,
    gameState.grid.length,
    gameState.grid[0].length,
  ]);

  return (
    <group>
      {gameState.grid.map((row: Cell[], i: number) =>
        row.map((cell: Cell, j: number) => (
          <GameCell
            key={`${i}-${j}`}
            cell={cell}
            position={cellPositions[i][j]}
            onReveal={cellCallbacks[i][j].reveal}
            onFlag={cellCallbacks[i][j].flag}
            showAll={gameState.gameOver}
          />
        ))
      )}
    </group>
  );
};
