import type { Color } from "../color.ts";
import type { Position } from "../position.ts";
import type { Board } from "../board/board.ts";

export abstract class Piece {
  readonly color: Color;

  constructor(color: Color) {
    this.color = color;
  }

  abstract movements(board: Board): Iterable<Position>;

  abstract clone(): Piece;
}
