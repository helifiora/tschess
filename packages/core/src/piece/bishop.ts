import { Piece } from "./piece.ts";
import { createMovementBuilder } from "../movement/builder.ts";
import type { Board } from "../board/board.ts";
import type { Position } from "../position.ts";

export class Bishop extends Piece {
  clone = (): Bishop => new Bishop(this);

  movements(board: Board): Iterable<Position> {
    return createMovementBuilder(this).addDiagonal().build(board);
  }
}
