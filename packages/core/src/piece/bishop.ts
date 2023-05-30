import { Piece } from "./piece.ts";
import { Diagonal } from "src/movement/mod.ts";
import type { Board } from "src/board/mod.ts";
import type { Position } from "src/position.ts";

export class Bishop extends Piece {
  movements(board: Board): Iterable<Position> {
    return new Diagonal(this, board);
  }

  clone(): Bishop {
    return new Bishop(this.color);
  }
}
