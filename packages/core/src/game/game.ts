import { Board } from "../board/board.ts";
import { Color, colorInvert } from "../color.ts";
import type { Position } from "../position.ts";
import {
  AnotherTeamTurnError,
  NoPieceInPositionError,
  PieceMovementNotAllowedError,
} from "./errors.ts";
import { Piece } from "../piece/piece.ts";
import { iter } from "../iter.ts";
import { GameData } from "../data.ts";
import { parsePieceToRaw, RawPiece } from "../piece/raw.ts";

export class Game {
  #board: Board;
  #currentTeam: Color;
  #capturedPieces: RawPiece[];

  private constructor(board: Board, current: Color, captured: RawPiece[]) {
    this.#board = board;
    this.#currentTeam = current;
    this.#capturedPieces = captured;
  }

  play(origin: Position, destiny: Position): void {
    const originPiece = this.#board.get(origin);
    if (originPiece === null) {
      throw new NoPieceInPositionError(origin);
    }

    if (originPiece.color !== this.#currentTeam) {
      throw new AnotherTeamTurnError(this.#currentTeam, originPiece.color);
    }

    if (!originPiece.canMoveTo(this.#board, destiny)) {
      throw new PieceMovementNotAllowedError();
    }

    const destinyValue = this.#board.move(originPiece, destiny);
    originPiece.incrementMoveCount();

    if (destinyValue !== null) {
      this.#capturedPieces.push(destinyValue);
    }

    this.#currentTeam = colorInvert(this.#currentTeam);
  }

  moves(position: Position): Position[] {
    const piece = this.#board.get(position);
    if (piece === null) {
      throw new NoPieceInPositionError(position);
    }

    if (piece.color !== this.#currentTeam) {
      throw new AnotherTeamTurnError(this.#currentTeam, piece.color);
    }

    return this.#getPieceMoves(piece);
  }

  toData(): GameData {
    const pieces = iter(this.#board.getPieces())
      .map((piece) => ({
        raw: parsePieceToRaw(piece),
        cell: piece.position.toCell(),
      }))
      .toMap(({ raw, cell }) => [raw, cell]);

    return {
      pieces,
      currentTeam: this.#currentTeam,
      capturedPieces: this.#capturedPieces,
      isCheck: false,
    };
  }

  get #isCheckmate(): Color | null {
    const teamInCheck = this.#isCheck;
    if (teamInCheck === null) {
      return null;
    }

    return this.#canUndoCheck(teamInCheck) ? null : teamInCheck;
  }

  get #isCheck(): Color | null {
    if (this.#isTeamInCheck(this.#currentTeam)) {
      return this.#currentTeam;
    }

    const otherTeam = colorInvert(this.#currentTeam);
    if (this.#isTeamInCheck(otherTeam)) {
      return otherTeam;
    }

    return null;
  }

  static fromData(data: GameData): Game {
    const board = Board.create(data.pieces);
    return new Game(board, data.currentTeam, data.capturedPieces);
  }

  static initial(): Game {
    const board = Board.initial();
    const team = Color.white;
    return new Game(board, team, []);
  }

  #getPieceMoves(piece: Piece): Position[] {
    return iter(piece.movements(this.#board))
      .filter((p) => !this.#canPieceMoveCausesCheck(piece.position, p))
      .toArray();
  }

  #isTeamInCheck(color: Color): boolean {
    const cloned = this.#board.clone();
    const king = cloned.getKing(color);
    return cloned.isPieceInEnemyMoves(king);
  }

  #canPieceMoveCausesCheck(origin: Position, target: Position): boolean {
    const cloned = this.#board.clone();
    const originPiece = cloned.get(origin);
    if (originPiece === null) {
      return false;
    }

    cloned.move(originPiece, target);
    const king = cloned.getKing(originPiece.color);
    return cloned.isPieceInEnemyMoves(king);
  }

  #canUndoCheck(team: Color): boolean {
    return iter(this.#board.getTeamPieces(team))
      .flatMapWithEntryValue((piece) => piece.movements(this.#board))
      .some(([t, p]) => !this.#canPieceMoveCausesCheck(p.position, t));
  }
}
