import { Piece } from "./piece.ts";

export class Bishop extends Piece {
  clone(): Bishop {
    return new Bishop(this.color);
  }
}
