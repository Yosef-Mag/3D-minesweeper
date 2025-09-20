import { GameEngine, type GameState } from './GameEngine';

export class GameStateManager {
  private engine: GameEngine;
  private subscribers: Set<(state: GameState) => void> = new Set();

  constructor(rows: number, cols: number, mines: number) {
    this.engine = new GameEngine(rows, cols, mines);
  }

  public subscribe(callback: (state: GameState) => void): () => void {
    this.subscribers.add(callback);
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    const state = this.engine.getState();
    this.subscribers.forEach(callback => callback(state));
  }

  public revealCell(r: number, c: number): boolean {
    const success = this.engine.revealCell(r, c);
    this.notifySubscribers();
    return success;
  }

  public flagCell(r: number, c: number): boolean {
    const success = this.engine.flagCell(r, c);
    this.notifySubscribers();
    return success;
  }

  public restart(): void {
    this.engine.restart();
    this.notifySubscribers();
  }

  public getState(): GameState {
    return this.engine.getState();
  }

  public getGrid() {
    return this.engine.getGrid();
  }

  public isGameOver(): boolean {
    return this.engine.isGameOver();
  }

  public isGameWon(): boolean {
    return this.engine.isGameWon();
  }

  public getMineCount(): number {
    return this.engine.getMineCount();
  }

  public getFlagCount(): number {
    return this.engine.getFlagCount();
  }
}
