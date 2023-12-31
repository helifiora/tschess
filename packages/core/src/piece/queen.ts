import { Piece } from "./piece";
import { createMovementBuilder } from "../movement/builder";
import type { Board } from "../board/board.ts";
import type { Position } from "../position.ts";

export class Queen extends Piece {
  clone = (): Piece => new Queen(this);

  movements(board: Board): Iterable<Position> {
    return createMovementBuilder(this)
      .addDiagonal()
      .addHorizontal()
      .addVertical()
      .build(board);
  }
}
