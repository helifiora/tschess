import { Piece } from "./piece.ts";
import { createMovementBuilder } from "../movement/builder.ts";
import { CommonAcceptanceFn } from "../movement/common.ts";
import { MovementStatus } from "../movement/movement.ts";
import type { Position } from "../position.ts";
import type { Board } from "../board/board.ts";

export class King extends Piece {
  #recursive = true;

  clone(): King {
    const cloned = new King(this);
    cloned.#recursive = false;
    return cloned;
  }

  movements(board: Board): Iterable<Position> {
    const acceptanceFn = this.#recursive ? this.#acceptance : undefined;
    return createMovementBuilder(this)
      .addHorizontal({ take: 1, acceptanceFn })
      .addVertical({ take: 1, acceptanceFn })
      .addDiagonal({ take: 1, acceptanceFn })
      .build(board);
  }

  #acceptance: CommonAcceptanceFn = (board, origin, target) => {
    if (target.piece && target.piece.color === origin.piece.color) {
      return MovementStatus.stop;
    }

    if (this.#canMoveCauseCheck(board, target.position)) {
      return MovementStatus.stop;
    }

    return MovementStatus.next;
  };

  #canMoveCauseCheck = (board: Board, target: Position): boolean => {
    const cloned = board.clone();
    const clonedKing = cloned.get(this.position)!;
    cloned.move(clonedKing, target);
    return cloned.isPieceInEnemyMoves(clonedKing);
  };
}
