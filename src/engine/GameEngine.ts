export interface Cell {
  value: number;
  revealed: boolean;
  flagged: boolean;
}

export interface GameState {
  grid: Cell[][];
  gameOver: boolean;
  gameWon: boolean;
  mineCount: number;
  flagCount: number;
}

export class GameEngine {
  private state: GameState;
  private rows: number;
  private cols: number;
  private mines: number;

  constructor(rows: number, cols: number, mines: number) {
    this.rows = rows;
    this.cols = cols;
    this.mines = mines;
    this.state = {
      grid: [],
      gameOver: false,
      gameWon: false,
      mineCount: mines,
      flagCount: 0
    };
    this.initializeGame();
  }

  private initializeGame(): void {
    this.state.grid = this.generateGrid();
    this.state.gameOver = false;
    this.state.gameWon = false;
    this.state.flagCount = 0;
  }

  private generateGrid(): Cell[][] {
    const grid = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => ({
        value: 0,
        revealed: false,
        flagged: false,
      }))
    );

    let placed = 0;
    while (placed < this.mines) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      if (grid[r][c].value !== -1) {
        grid[r][c].value = -1;
        placed++;
        
        // Update adjacent cell values
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (
              nr >= 0 &&
              nr < this.rows &&
              nc >= 0 &&
              nc < this.cols &&
              grid[nr][nc].value !== -1
            ) {
              grid[nr][nc].value++;
            }
          }
        }
      }
    }
    return grid;
  }

  private floodReveal(grid: Cell[][], r: number, c: number): void {
    const stack = [[r, c]];
    while (stack.length) {
      const [i, j] = stack.pop()!;
      const cell = grid[i][j];
      if (cell.revealed || cell.flagged) continue;
      
      // Create new cell object instead of mutating
      grid[i][j] = { ...cell, revealed: true };
      
      if (cell.value === 0) {
        // Reveal adjacent cells for empty cells
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const ni = i + dr;
            const nj = j + dc;
            if (
              ni >= 0 &&
              ni < this.rows &&
              nj >= 0 && 
              nj < this.cols &&
              !grid[ni][nj].revealed
            ) {
              stack.push([ni, nj]);
            }
          }
        }
      }
    }
  }

  private checkWinCondition(): boolean {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const cell = this.state.grid[i][j];
        if (cell.value !== -1 && !cell.revealed) {
          return false;
        }
      }
    }
    return true;
  }

  public revealCell(r: number, c: number): boolean {
    if (this.state.gameOver || this.state.gameWon) return false;
    
    const cell = this.state.grid[r][c];
    if (cell.flagged || cell.revealed) return false;

    if (cell.value === -1) {
      // Hit a mine - game over
      this.state = {
        ...this.state,
        gameOver: true
      };
      // Create new grid with revealed mine
      this.state.grid = this.state.grid.map((row, i) =>
        row.map((cell, j) =>
          i === r && j === c ? { ...cell, revealed: true } : cell
        )
      );
      this.revealAllMines();
      return false;
    } else {
      // Reveal the cell and flood reveal if necessary
      this.floodReveal(this.state.grid, r, c);
      
      // Check if game is won
      if (this.checkWinCondition()) {
        this.state = {
          ...this.state,
          gameWon: true,
          gameOver: true
        };
      }
      return true;
    }
  }

  public flagCell(r: number, c: number): boolean {
    if (this.state.gameOver || this.state.gameWon) return false;
    
    const cell = this.state.grid[r][c];
    if (cell.revealed) return false;

    if (cell.flagged) {
      // Unflag the cell
      this.state = {
        ...this.state,
        flagCount: this.state.flagCount - 1
      };
      this.state.grid = this.state.grid.map((row, i) =>
        row.map((cell, j) =>
          i === r && j === c ? { ...cell, flagged: false } : cell
        )
      );
    } else {
      // Flag the cell
      this.state = {
        ...this.state,
        flagCount: this.state.flagCount + 1
      };
      this.state.grid = this.state.grid.map((row, i) =>
        row.map((cell, j) =>
          i === r && j === c ? { ...cell, flagged: true } : cell
        )
      );
    }
    
    return true;
  }

  private revealAllMines(): void {
    this.state.grid = this.state.grid.map((row, i) =>
      row.map((cell, j) =>
        cell.value === -1 ? { ...cell, revealed: true } : cell
      )
    );
  }

  public restart(): void {
    this.initializeGame();
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public getGrid(): Cell[][] {
    return this.state.grid.map(row => row.map(cell => ({ ...cell })));
  }

  public isGameOver(): boolean {
    return this.state.gameOver;
  }

  public isGameWon(): boolean {
    return this.state.gameWon;
  }

  public getMineCount(): number {
    return this.state.mineCount;
  }

  public getFlagCount(): number {
    return this.state.flagCount;
  }
}
