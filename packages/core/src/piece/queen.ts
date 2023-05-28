import { Piece } from "./piece.ts";

export class Queen extends Piece {
  clone(): Queen {
    return new Queen(this.color);
  }
}
