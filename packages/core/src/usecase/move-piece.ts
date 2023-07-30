import { type Cell, Color, colorInvert, type GameData, type GameDataResult, pipe } from "@tschess/shared";
import { filter, flatMapWithEntry, isEmpty } from "@tschess/iterator-helper";
import type { Result } from "../result.ts";
import { Board } from "../board/board.ts";
import { Position } from "../position.ts";

export class MovePiece {
  #data: GameData;

  constructor(data: GameData) {
    this.#data = data;
  }

  async execute(originCell: Cell, targetCell: Cell): Promise<Result<GameDataResult, string>> {
    const board = Board.create(this.#data.pieces);
    const origin = Position.parse(originCell);
    const target = Position.parse(targetCell);

    const capturedPieces = [...this.#data.capturedPieces];

    const originPiece = board.get(origin);
    if (originPiece === null) {
      return { success: false, error: "No piece in position!" };
    }

    if (originPiece.color !== this.#data.currentTeam) {
      return { success: false, error: "Another turn team!" };
    }

    if (!originPiece.canMoveTo(board, target)) {
      return { success: false, error: "Piece can't move to target position!" };
    }

    const targetValue = board.move(originPiece, target);
    originPiece.incrementMoveCount();

    if (targetValue !== null) {
      capturedPieces.push(targetValue);
    }

    const nextTeamTurn = colorInvert(this.#data.currentTeam);
    const checked = this.#isCheck(board);
    const checkmate = checked ? this.#isCheckmate(board, checked) : false;

    return {
      success: true,
      data: {
        pieces: board.toData(),
        currentTeam: nextTeamTurn,
        isCheck: checked,
        isCheckmate: checkmate,
        capturedPieces,
      },
    };
  }

  #isCheck(board: Board): Color | null {
    for (const color of [Color.black, Color.white]) {
      const king = board.getKing(color);
      if (board.isPieceInEnemyMoves(king)) {
        return color;
      }
    }

    return null;
  }

  #isCheckmate(board: Board, checked: Color): boolean {
    return pipe(
      board.getTeamPieces(checked),
      flatMapWithEntry((piece) => piece.movements(board)),
      filter(([target, piece]) => this.#canUndoCheck(board, piece.position, target)),
      isEmpty()
    );
  }

  #canUndoCheck(board: Board, origin: Position, target: Position): boolean {
    const cloned = board.clone();
    const originPiece = cloned.get(origin)!;
    cloned.move(originPiece, target);
    const king = cloned.getKing(originPiece.color);
    return !cloned.isPieceInEnemyMoves(king);
  }
}

/**
 *   #canUndoCheck(team: Color): boolean {
 *     return iter(this.#board.getTeamPieces(team))
 *       .flatMapWithEntryValue((piece) => piece.movements(this.#board))
 *       .some(([t, p]) => !this.#canPieceMoveCausesCheck(p.position, t));
 *   }
 *
 */
