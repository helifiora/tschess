import type { Color } from "../color.ts";
import { Rook } from "./rook.ts";
import { Knight } from "./knight.ts";
import { Pawn } from "./pawn.ts";
import { Queen } from "./queen.ts";
import { King } from "./king.ts";
import { Bishop } from "./bishop.ts";
import { Board } from "../board/board.ts";
import { Position } from "../position.ts";

type PieceFactoryOptions = {
  updateBoard?: boolean;
};

export class PieceFactory {
  #board: Board;
  #updateBoard: boolean;
  constructor(board: Board, options: PieceFactoryOptions = {}) {
    this.#board = board;
    this.#updateBoard = options.updateBoard ?? false;
  }

  createBishop(team: Color, position: Position): Bishop {
    const result = new Bishop(team, position);
    if (this.#updateBoard) {
      this.#board.move(result, position);
    }

    return result;
  }

  createKing(team: Color, position: Position): King {
    const result = new King(team, position);
    if (this.#updateBoard) {
      this.#board.move(result, position);
    }

    return result;
  }

  createKnight(team: Color, position: Position): Knight {
    const result = new Knight(team, position);
    if (this.#updateBoard) {
      this.#board.move(result, position);
    }

    return result;
  }

  createPawn(team: Color, position: Position): Pawn {
    const result = new Pawn(team, position);
    if (this.#updateBoard) {
      this.#board.move(result, position);
    }

    return result;
  }

  createQueen(team: Color, position: Position): Queen {
    const result = new Queen(team, position);
    if (this.#updateBoard) {
      this.#board.move(result, position);
    }

    return result;
  }

  createRook(team: Color, position: Position): Rook {
    const result = new Rook(team, position);
    if (this.#updateBoard) {
      this.#board.move(result, position);
    }

    return result;
  }
}
