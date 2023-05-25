import {Piece} from "./piece.ts";

export class King extends Piece {
  clone(): King {
    return new King(this.color);
  }
}