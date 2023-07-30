import { Movement } from "./movement.ts";
import type { Piece } from "../piece/piece.ts";
import type { Position } from "../position.ts";
import { Direction } from "../direction.ts";
import { type CommonAcceptanceFn, commonGenerator, type CommonGeneratorOptions } from "./common";
import { Board } from "../board/board.ts";

export type DiagonalOptions = {
  direction?: Direction;
  acceptanceFn?: CommonAcceptanceFn;
  take?: number;
};

export class Diagonal extends Movement {
  readonly #direction: Direction;
  readonly #options: CommonGeneratorOptions;

  constructor(piece: Piece, board: Board, options: DiagonalOptions = {}) {
    super(piece, board);
    this.#options = { acceptanceFn: options.acceptanceFn, take: options.take };
    this.#direction = options.direction ?? Direction.both;
  }

  *[Symbol.iterator](): Iterator<Position> {
    switch (this.#direction) {
      case Direction.top:
        yield* this.#generateTopLeft();
        yield* this.#generateTopRight();
        return;
      case Direction.bottom:
        yield* this.#generateBottomLeft();
        yield* this.#generateBottomRight();
        return;
      case Direction.both:
        yield* this.#generateTopLeft();
        yield* this.#generateTopRight();
        yield* this.#generateBottomLeft();
        yield* this.#generateBottomRight();
        return;
    }
  }

  #generateTopLeft = () => commonGenerator(this.board, this.piece, [-1, -1], this.#options);

  #generateTopRight = () => commonGenerator(this.board, this.piece, [1, -1], this.#options);

  #generateBottomLeft = () => commonGenerator(this.board, this.piece, [-1, 1], this.#options);

  #generateBottomRight = () => commonGenerator(this.board, this.piece, [1, 1], this.#options);
}
