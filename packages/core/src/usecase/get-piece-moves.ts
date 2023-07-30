import type { Cell, GameData } from "@tschess/shared";
import type { Result } from "../result.ts";
import { Position } from "../position.ts";
import { Board } from "../board/board.ts";
import { pipe } from "@tschess/shared";
import { filter, map, toArray } from "@tschess/iterator-helper";

export class GetPieceMoves {
  #data: GameData;

  constructor(data: GameData) {
    this.#data = data;
  }

  async execute(cell: Cell): Promise<Result<Cell[], string>> {
    const board = Board.create(this.#data.pieces);

    const position = Position.parse(cell);

    const piece = board.get(position);
    if (piece === null) {
      return { success: false, error: "No piece in position!" };
    }

    if (piece.color !== this.#data.currentTeam) {
      return { success: false, error: "Another turn team!" };
    }

    return pipe(
      piece.movements(board),
      filter((p) => !this.#canCauseCheck(board, piece.position, p)),
      map((p) => p.toCell()),
      toArray(),
      (data) => ({ success: true, data })
    );
  }

  #canCauseCheck(board: Board, origin: Position, target: Position): boolean {
    const cloned = board.clone();
    const originPiece = cloned.get(origin);
    if (originPiece === null) {
      return false;
    }

    cloned.move(originPiece, target);
    const king = cloned.getKing(originPiece.color);
    return cloned.isPieceInEnemyMoves(king);
  }
}
