import type {Color} from "../color.ts";

export abstract class Piece {
  readonly color: Color;

  constructor(color: Color) {
    this.color = color;
  }

  abstract clone(): Piece;
}