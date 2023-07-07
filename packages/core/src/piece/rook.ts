import { Piece } from "./piece.ts";
import { createMovementBuilder } from "../movement/builder.ts";
import type { Board } from "../board/board.ts";
import type { Position } from "../position.ts";

export class Rook extends Piece {
  clone = (): Rook => new Rook(this);

  movements(board: Board): Iterable<Position> {
    return createMovementBuilder(this)
      .addVertical()
      .addHorizontal()
      .build(board);
  }
}
