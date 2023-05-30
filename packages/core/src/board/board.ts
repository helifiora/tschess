import {
  type Table,
  cloneTable,
  createEmptyTable,
  tablePiecePositionGenerator,
  getTablePiecesMap,
  invalidPosition,
  tablePieceGenerator,
} from "./table.ts";
import type { Position } from "src/position.ts";
import { Color } from "src/color.ts";
import { filter } from "src/generator.ts";
import { type Piece, King } from "src/piece/mod.ts";
import { BoardInvalidPosition, BoardMultipleKingFound } from "./errors.ts";

export class Board {
  private readonly _table: Table;
  private readonly _pieces: Map<Piece, Position>;

  constructor(table: Table) {
    this._table = table;
    this._pieces = getTablePiecesMap(table);
  }

  clone(): Board {
    return new Board(cloneTable(this._table));
  }

  get(position: Position): Piece | null {
    if (invalidPosition(position.x, position.y)) {
      throw new BoardInvalidPosition(position);
    }

    return this._table[position.y][position.x];
  }

  getKing(color: Color): King | null {
    const isTeamKing = (piece: Piece) => piece instanceof King && piece.color === color;

    const result = Array.from(filter(this.pieceGenerator, isTeamKing)) as King[];
    if (result.length === 0) {
      return null;
    } else if (result.length > 1) {
      throw new BoardMultipleKingFound(result.length);
    }

    return result.at(0)!;
  }

  getPiecePosition(piece: Piece): Position | null {
    return this._pieces.get(piece) ?? null;
  }

  getTeamPieces(color: Color): Piece[] {
    return Array.from(filter(this.pieceGenerator, (piece) => piece.color === color));
  }

  isEmpty(position: Position): boolean {
    if (invalidPosition(position.x, position.y)) {
      throw new BoardInvalidPosition(position);
    }

    return this._table[position.y][position.x] === null;
  }

  isOccupied(position: Position): boolean {
    if (invalidPosition(position.x, position.y)) {
      throw new BoardInvalidPosition(position);
    }

    return this._table[position.y][position.x] !== null;
  }

  place(piece: Piece, position: Position): Piece | null {
    if (invalidPosition(position.x, position.y)) {
      throw new BoardInvalidPosition(position);
    }

    const positionValue = this.removePieceFromPosition(position);
    this.clearPiecePosition(piece);

    this.setPosition(piece, position);
    return positionValue;
  }

  private clearPiecePosition(piece: Piece): void {
    const oldPiecePosition = this.getPiecePosition(piece);
    if (oldPiecePosition === null) {
      return;
    }

    this.clearPosition(oldPiecePosition);
  }

  private clearPosition(position: Position): void {
    this._table[position.y][position.x] = null;
  }

  private removePieceFromPosition(position: Position): Piece | null {
    const result = this._table[position.y][position.x];
    if (result === null) {
      return null;
    }

    this._pieces.delete(result);
    this.clearPosition(position);
    return result;
  }

  private setPosition(piece: Piece, position: Position): void {
    this._table[position.y][position.x] = piece;
    this._pieces.set(piece, position);
  }

  private get pieceGenerator(): Generator<Piece> {
    return tablePieceGenerator(this._table);
  }

  private get piecePositionGenerator(): Generator<[Piece, Position]> {
    return tablePiecePositionGenerator(this._table);
  }

  static empty(): Board {
    return new Board(createEmptyTable());
  }
}
