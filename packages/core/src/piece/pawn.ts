import { Piece } from "./piece.ts";
import type { Position } from "src/position.ts";
import type { Board } from "src/board/mod.ts";
import { Vertical } from "../movement/vertical.ts";
import { fromColor } from "../direction.ts";
import { CommonAcceptanceFn } from "../movement/common.ts";
import { MovementStatus } from "../movement/movement.ts";
import { Diagonal } from "../movement/diagonal.ts";
import { chain } from "../chain.ts";

export class Pawn extends Piece {
  movements(board: Board): Iterable<Position> {
    const direction = fromColor(this.color);

    const vertical = new Vertical(this, board, {
      direction,
      take: this.take(),
      acceptanceFn: Pawn.acceptanceVerticalFn,
    });

    const diagonal = new Diagonal(this, board, {
      direction,
      take: 1,
      acceptanceFn: Pawn.acceptanceDiagonalFn,
    });

    return chain([vertical, diagonal]);
  }

  clone(): Pawn {
    return new Pawn(this.color);
  }

  private take(): number {
    return this.moveCount === 0 ? 2 : 1;
  }

  private static acceptanceDiagonalFn: CommonAcceptanceFn = (board, origin, target) => {
    if (target.piece === null || target.piece.color === origin.piece.color) {
      return MovementStatus.stop;
    }

    return MovementStatus.next;
  };

  private static acceptanceVerticalFn: CommonAcceptanceFn = (board, origin, target) => {
    if (target.piece !== null) {
      return MovementStatus.stop;
    }

    return MovementStatus.next;
  };
}
