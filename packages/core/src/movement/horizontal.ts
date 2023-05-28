import { Movement } from "./movement.ts";
import { pos, Position } from "src/position.ts";
import { Piece } from "src/piece/piece.ts";
import { Board } from "src/board/board.ts";
import { CommonAcceptanceFn, commonGenerator } from "./common.ts";
import { chain } from "src/chain.ts";

type Options = {
  acceptanceFn?: CommonAcceptanceFn;
  take?: number;
};

export class Horizontal extends Movement {
  private readonly take: number | null;
  private readonly acceptanceFn: CommonAcceptanceFn | null;
  constructor(piece: Piece, board: Board, options: Options = {}) {
    super(piece, board);
    this.take = options.take ?? null;
    this.acceptanceFn = options.acceptanceFn ?? null;
  }
  [Symbol.iterator](): Iterator<Position> {
    const origin = this.board.getPiecePosition(this.piece);
    if (origin === null) {
      throw new Error("Piece is not on the board!");
    }

    return chain([this.generateLeft(origin), this.generateRight(origin)]);
  }

  private generateLeft(origin: Position): Generator<Position> {
    return commonGenerator(this.board, origin, pos(-1, 0), {
      acceptanceFn: this.acceptanceFn,
      take: this.take,
    });
  }

  private generateRight(origin: Position): Generator<Position> {
    return commonGenerator(this.board, origin, pos(1, 0), {
      acceptanceFn: this.acceptanceFn,
      take: this.take,
    });
  }
}
