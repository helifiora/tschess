import { Piece } from "./piece.ts";
import type { Board } from "src/board/mod.ts";
import type { Position } from "src/position.ts";
import { CommonAcceptanceFn } from "../movement/common.ts";
import { MovementStatus } from "../movement/movement.ts";
import { Horizontal } from "../movement/horizontal.ts";
import { Vertical } from "../movement/vertical.ts";
import { Diagonal } from "../movement/diagonal.ts";
import { chain } from "../chain.ts";
import { isInCheck } from "../check.ts";

export class King extends Piece {
  private recursive = true;

  movements(board: Board): Iterable<Position> {
    const options = {
      take: 1,
      acceptanceFn: this.recursive ? King.acceptance : undefined,
    };

    const horizontal = new Horizontal(this, board, options);
    const vertical = new Vertical(this, board, options);
    const diagonal = new Diagonal(this, board, options);

    return chain([horizontal, vertical, diagonal]);
  }

  clone(): King {
    return new King(this.color);
  }

  changeRecursiveTo(value: boolean): void {
    this.recursive = value;
  }

  private static acceptance: CommonAcceptanceFn = (board, origin, target) => {
    if (target.piece && target.piece.color === origin.piece.color) {
      return MovementStatus.stop;
    }

    const boardClone = board.clone();
    const king = boardClone.getKing(origin.piece.color)!;
    boardClone.place(king, target.position.clone());

    if (isInCheck(boardClone, king.color, target.position)) {
      return MovementStatus.stop;
    }

    return MovementStatus.next;
  };
}
