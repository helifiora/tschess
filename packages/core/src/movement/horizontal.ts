import { Movement } from "./movement.ts";
import { Position } from "src/position.ts";
import { Piece } from "src/piece/piece.ts";
import { CommonAcceptanceFn, commonGenerator, CommonGeneratorOptions } from "./common.ts";
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
