import { chain } from "../chain.ts";
import { Piece } from "./piece.ts";
import { Vertical, Horizontal } from "../movement/mod.ts";
import type { Board } from "../board/mod.ts";
import type { Position } from "../position.ts";

export class Rook extends Piece {
  movements(board: Board): Iterable<Position> {
    return chain([new Vertical(this, board), new Horizontal(this, board)]);
  }

  clone(): Rook {
    return new Rook(this.color);
  }
}
