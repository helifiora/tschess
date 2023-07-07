import type { Board } from "../board/board.ts";
import type { Position } from "../position.ts";
import type { Piece } from "../piece/piece.ts";
import { colorInvert } from "../color.ts";
import { iter } from "../iter.ts";

function isInEnemyMovements(board: Board, piece: Piece): boolean {
  return iter(board.getTeamPieces(colorInvert(piece.color)))
    .flatMap((p) => p.movements(board))
    .some((s) => s.equals(piece.position));
}

export function isMoveCausesCheck(
  board: Board,
  origin: Position,
  target: Position
): boolean {
  const clonedBoard = board.clone();
  const piece = clonedBoard.get(origin);
  if (piece === null) {
    return false;
  }

  clonedBoard.move(piece, target);
  const king = clonedBoard.getKing(piece.color);
  return isInEnemyMovements(clonedBoard, king);
}
