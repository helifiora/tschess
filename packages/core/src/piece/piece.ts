import type { Color } from "../color.ts";
import type { Position } from "../position.ts";
import type { Board } from "../board/board.ts";
import { iter } from "../iter.ts";

export abstract class Piece {
  readonly color: Color;
  #moveCount: number;
  #position: Position;

  constructor(color: Color, position: Position);
  constructor(color: Color, position: Position, moveCount: number);
  constructor(instance: Piece);
  constructor(
    instanceOrColor: Color | Piece,
    position?: Position,
    moveCount?: number
  ) {
    if (instanceOrColor instanceof Piece) {
      this.color = instanceOrColor.color;
      this.#position = instanceOrColor.#position;
      this.#moveCount = instanceOrColor.#moveCount;
    } else {
      this.color = instanceOrColor;
      this.#position = position!;
      this.#moveCount = moveCount ?? 0;
    }
  }

  canMoveTo(board: Board, target: Position): boolean {
    return iter(this.movements(board)).some((p) => p.equals(target));
  }

  incrementMoveCount(amount: number = 1): void {
    this.#moveCount += amount;
  }

  set position(value: Position) {
    this.#position = value?.clone();
  }

  get position(): Position {
    return this.#position.clone();
  }

  get moveCount(): number {
    return this.#moveCount;
  }

  abstract movements(board: Board): Iterable<Position>;

  abstract clone(): Piece;
}
