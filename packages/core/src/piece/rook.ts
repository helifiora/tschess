import { Piece } from "./piece.ts";

export class Rook extends Piece {
  clone(): Rook {
    return new Rook(this.color);
  }
}
