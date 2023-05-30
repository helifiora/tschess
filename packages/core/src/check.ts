import type { Board } from "./board/board.ts";
import type { Position } from "./position.ts";
import type { Color } from "./color.ts";
import { colorInvert } from "./color.ts";

export function isInCheck(clonedBoard: Board, kingColor: Color, kingPosition: Position): boolean {
  const enemyKing = clonedBoard.getKing(colorInvert(kingColor));
  if (enemyKing !== null) {
    enemyKing.changeRecursiveTo(false);
  }

  const enemyPieces = clonedBoard.getTeamPieces(colorInvert(kingColor));
  for (const enemy of enemyPieces) {
    for (const position of enemy.movements(clonedBoard)) {
      if (position.equals(kingPosition)) {
        return true;
      }
    }
  }

  return false;
}
