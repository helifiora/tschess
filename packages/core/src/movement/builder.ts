import { type Movement } from "./movement.ts";
import { type Board } from "../board/board.ts";
import { type Position } from "../position.ts";
import { type Piece } from "../piece/piece.ts";
import { type VerticalOptions, Vertical } from "./vertical.ts";
import { type DiagonalOptions, Diagonal } from "./diagonal.ts";
import { type HorizontalOptions, Horizontal } from "./horizontal.ts";
import { LShape } from "./lshape.ts";

type Generator = (board: Board) => Movement;

class MovementBuilder {
  readonly #piece: Piece;
  readonly #steps: Generator[];

  constructor(piece: Piece) {
    this.#piece = piece;
    this.#steps = [];
  }

  addDiagonal(options: DiagonalOptions = {}): MovementBuilder {
    this.#steps.push((board) => new Diagonal(this.#piece, board, options));
    return this;
  }

  addHorizontal(options: HorizontalOptions = {}): MovementBuilder {
    this.#steps.push((board) => new Horizontal(this.#piece, board, options));
    return this;
  }

  addLShape(): MovementBuilder {
    this.#steps.push((board) => new LShape(this.#piece, board));
    return this;
  }

  addVertical(options: VerticalOptions = {}): MovementBuilder {
    this.#steps.push((board) => new Vertical(this.#piece, board, options));
    return this;
  }

  build(board: Board): Iterable<Position> {
    return generate(this.#steps, board);
  }
}

export function createMovementBuilder(piece: Piece): MovementBuilder {
  return new MovementBuilder(piece);
}

function* generate(movements: Generator[], board: Board): Iterable<Position> {
  for (const move of movements) {
    for (const item of move(board)) {
      yield item;
    }
  }
}
