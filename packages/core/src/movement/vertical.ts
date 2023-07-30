import { Movement } from "./movement.ts";
import { Direction } from "../direction.ts";
import { Position } from "../position.ts";
import type { Piece } from "../piece/piece.ts";
import { type CommonAcceptanceFn, commonGenerator, type CommonGeneratorOptions } from "./common";
import type { Board } from "../board/board.ts";

export type VerticalOptions = {
  direction?: Direction;
  acceptanceFn?: CommonAcceptanceFn;
  take?: number;
};

export class Vertical extends Movement {
  readonly #direction: Direction;
  readonly #options: CommonGeneratorOptions;

  constructor(piece: Piece, board: Board, options: VerticalOptions = {}) {
    super(piece, board);
    this.#options = { acceptanceFn: options.acceptanceFn, take: options.take };
    this.#direction = options.direction ?? Direction.both;
  }

  *[Symbol.iterator](): Iterator<Position> {
    switch (this.#direction) {
      case Direction.top:
        yield* this.#generateTop();
        return;
      case Direction.bottom:
        yield* this.#generateBottom();
        return;
      case Direction.both:
        yield* this.#generateTop();
        yield* this.#generateBottom();
        return;
    }
  }

  #generateTop(): Iterable<Position> {
    return commonGenerator(this.board, this.piece, [0, -1], this.#options);
  }

  #generateBottom(): Iterable<Position> {
    return commonGenerator(this.board, this.piece, [0, 1], this.#options);
  }
}
