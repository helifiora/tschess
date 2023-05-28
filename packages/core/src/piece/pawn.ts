import { Piece } from "./piece.ts";

export class Pawn extends Piece {
  clone(): Pawn {
    return new Pawn(this.color);
  }
}
