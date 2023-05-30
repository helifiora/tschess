import type { Color } from "../color.ts";
import type { Position } from "../position.ts";
import type { Board } from "../board/board.ts";

type Options = {
  moveCount?: number;
};

export abstract class Piece {
  readonly color: Color;
  protected moveCount: number;

  constructor(color: Color, options: Options = {}) {
    this.color = color;
    this.moveCount = options.moveCount ?? 0;
  }

  incrementMoveCount(): void;
  incrementMoveCount(amount: number): void;
  incrementMoveCount(amount: number = 1): void {
    this.moveCount += amount;
  }

  abstract movements(board: Board): Iterable<Position>;

  abstract clone(): Piece;
}
