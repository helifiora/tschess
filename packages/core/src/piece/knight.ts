import { Piece } from "./piece.ts";
import { Position } from "../position.ts";
import { LShape } from "../movement/lshape.ts";
import { Board } from "../board/board.ts";

export class Knight extends Piece {
  movements(board: Board): Iterable<Position> {
    return new LShape(this, board);
  }

  clone(): Knight {
    return new Knight(this.color);
  }
}
