import { Movement } from "./movement.ts";
import type { Piece } from "src/piece/piece.ts";
import type { Board } from "src/board/board.ts";
import type { Position } from "src/position.ts";
import { Direction } from "../direction.ts";
import { CommonAcceptanceFn, commonGenerator } from "./common.ts";
import { pos } from "src/position.ts";
import { chain } from "../chain.ts";

type Options = {
  direction?: Direction;
  acceptanceFn?: CommonAcceptanceFn;
  take?: number;
};

export class Diagonal extends Movement {
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
        return chain([this.generateTopLeft(origin), this.generateTopRight(origin)]);
      case Direction.bottom:
        return chain([this.generateBottomLeft(origin), this.generateBottomRight(origin)]);
      case Direction.both:
        return chain([
          this.generateTopLeft(origin),
          this.generateTopRight(origin),
          this.generateBottomLeft(origin),
          this.generateBottomRight(origin),
        ]);
    }
  }

  private generateTopLeft(origin: Position): Generator<Position> {
    return commonGenerator(this.board, origin, pos(-1, -1), {
      acceptanceFn: this.acceptanceFn,
      take: this.take,
    });
  }
  private generateTopRight(origin: Position): Generator<Position> {
    return commonGenerator(this.board, origin, pos(1, -1), {
      acceptanceFn: this.acceptanceFn,
      take: this.take,
    });
  }

  private generateBottomLeft(origin: Position): Generator<Position> {
    return commonGenerator(this.board, origin, pos(-1, 1), {
      acceptanceFn: this.acceptanceFn,
      take: this.take,
    });
  }

  private generateBottomRight(origin: Position): Generator<Position> {
    return commonGenerator(this.board, origin, pos(1, 1), {
      acceptanceFn: this.acceptanceFn,
      take: this.take,
    });
  }
}
