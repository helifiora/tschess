import { Piece } from "./piece.ts";
import { createMovementBuilder } from "../movement/builder.ts";
import type { Position } from "../position.ts";
import type { Board } from "../board/board.ts";

export class Knight extends Piece {
  clone = (): Piece => new Knight(this);

  movements(board: Board): Iterable<Position> {
    return createMovementBuilder(this).addLShape().build(board);
  }
}
