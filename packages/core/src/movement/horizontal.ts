import { Movement } from "./movement.ts";
import { Position } from "../position.ts";
import { Piece } from "../piece/piece.ts";
import { type CommonAcceptanceFn, commonGenerator, type CommonGeneratorOptions } from "./common";
import { Board } from "../board/board.ts";

export type HorizontalOptions = {
  acceptanceFn?: CommonAcceptanceFn;
  take?: number;
};

export class Horizontal extends Movement {
  readonly #options: CommonGeneratorOptions;

  constructor(piece: Piece, board: Board, options: HorizontalOptions = {}) {
    super(piece, board);
    this.#options = { acceptanceFn: options.acceptanceFn, take: options.take };
  }
  *[Symbol.iterator](): Iterator<Position> {
    yield* this.#generateLeft();
    yield* this.#generateRight();
  }

  #generateLeft = () => commonGenerator(this.board, this.piece, [-1, 0], this.#options);

  #generateRight = () => commonGenerator(this.board, this.piece, [1, 0], this.#options);
}
