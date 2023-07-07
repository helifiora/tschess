import { Piece } from "./piece.ts";
import { CommonAcceptanceFn } from "../movement/common.ts";
import { MovementStatus } from "../movement/movement.ts";
import { createMovementBuilder } from "../movement/builder.ts";
import type { Position } from "../position.ts";
import type { Board } from "../board/board.ts";
import { colorToDirection } from "../color.ts";

export class Pawn extends Piece {
  clone = (): Piece => new Pawn(this);

  movements(board: Board): Iterable<Position> {
    const direction = colorToDirection(this.color);
    return createMovementBuilder(this)
      .addVertical({
        direction,
        take: this.#take,
        acceptanceFn: Pawn.#acceptanceVerticalFn,
      })
      .addDiagonal({
        direction,
        take: 1,
        acceptanceFn: Pawn.#acceptanceDiagonalFn,
      })
      .build(board);
  }

  get #take(): number {
    return this.moveCount === 0 ? 2 : 1;
  }

  static #acceptanceDiagonalFn: CommonAcceptanceFn = (
    board,
    origin,
    target
  ) => {
    if (target.piece === null || target.piece.color === origin.piece.color) {
      return MovementStatus.stop;
    }

    return MovementStatus.next;
  };

  static #acceptanceVerticalFn: CommonAcceptanceFn = (
    board,
    origin,
    target
  ) => {
    if (target.piece !== null) {
      return MovementStatus.stop;
    }

    return MovementStatus.next;
  };
}
