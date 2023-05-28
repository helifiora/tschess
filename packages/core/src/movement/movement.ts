import { Piece } from "../piece/piece.ts";
import { Board } from "../board/board.ts";
import { Position } from "src/position.ts";

export abstract class Movement implements Iterable<Position> {
  constructor(protected piece: Piece, protected board: Board) {}

  abstract [Symbol.iterator](): Iterator<Position>;
}

export const enum MovementStatus {
  next = "next",
  last = "last",
  stop = "stop",
}
