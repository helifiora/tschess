import { Piece } from "./piece.ts";
import { chain } from "../chain.ts";
import { Diagonal, Horizontal, Vertical } from "../movement/mod.ts";
import type { Board } from "../board/board.ts";
import type { Position } from "../position.ts";

export class Queen extends Piece {
  movements(board: Board): Iterable<Position> {
    return chain([new Diagonal(this, board), new Horizontal(this, board), new Vertical(this, board)]);
  }

  clone(): Queen {
    return new Queen(this.color);
  }
}
