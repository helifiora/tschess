import { Movement } from "./movement.ts";
import { Position } from "../position.ts";
import type { Piece } from "../piece/piece.ts";
import type { Board } from "../board/board.ts";
import { Direction } from "../direction.ts";
import { chain } from "../chain.ts";
import { type CommonAcceptanceFn, commonGenerator } from "./common.ts";

type Options = {
  direction?: Direction;
  acceptanceFn?: CommonAcceptanceFn;
  take?: number;
};

export class Vertical extends Movement {
  private readonly direction: Direction;
  private readonly acceptanceFn: CommonAcceptanceFn | null;
  private readonly take: number | null;

  constructor(piece: Piece, board: Board, options: Options = {}) {
    super(piece, board);
    this.direction = options.direction ?? Direction.both;
    this.acceptanceFn = options.acceptanceFn ?? null;
    this.take = options.take ?? null;
  }

  [Symbol.iterator](): Iterator<Position> {
    const origin = this.board.getPiecePosition(this.piece);
    if (origin === null) {
      throw new Error("Piece is not on the board!");
    }

    switch (this.direction) {
      case Direction.top:
        return this.generateTop(origin);
      case Direction.bottom:
        return this.generateBottom(origin);
      case Direction.both:
        return chain([this.generateBottom(origin), this.generateTop(origin)]);
    }
  }

  private generateTop(origin: Position): Generator<Position> {
    return commonGenerator(this.board, origin, new Position(0, -1), {
      acceptanceFn: this.acceptanceFn,
      take: this.take,
    });
  }

  private generateBottom(origin: Position): Generator<Position> {
    return commonGenerator(this.board, origin, new Position(0, 1), {
      acceptanceFn: this.acceptanceFn,
      take: this.take,
    });
  }
}
