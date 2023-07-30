import type { Piece } from "../piece/piece.ts";
import type { Board } from "../board/board.ts";
import type { Position } from "../position.ts";

export abstract class Movement implements Iterable<Position> {
  constructor(protected piece: Piece, protected board: Board) {}

  abstract [Symbol.iterator](): Iterator<Position>;
}

export const enum MovementStatus {
  next = "next",
  last = "last",
  stop = "stop",
}
