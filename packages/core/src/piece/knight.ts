import {Piece} from "./piece.ts";

export class Knight extends Piece {

  clone(): Knight {
    return new Knight(this.color);
  }

}