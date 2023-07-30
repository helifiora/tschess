import { Table } from "./table.ts";
import { pos, Position } from "../position.ts";
import type { Piece } from "../piece/piece.ts";
import { King } from "../piece/king.ts";
import { BoardMultipleKingFound, BoardNoKingFound } from "./errors.ts";
import { createPieceFromRaw, parsePieceToRaw } from "../piece/raw.ts";
import { PieceFactory } from "../piece/factory.ts";
import { type Cell, Color, colorInvert, pipe, type RawPiece } from "@tschess/shared";
import { filter, flatMap, map, some, toArray, toObject } from "@tschess/iterator-helper";

export class Board {
  readonly #table: Table;
  readonly factory = new PieceFactory(this, { updateBoard: true });

  constructor(table: Table) {
    this.#table = table;
  }

  clone(): Board {
    return new Board(this.#table.clone());
  }

  get(position: Position): Piece | null {
    return this.#table.get(position);
  }

  getKing(color: Color): King {
    const result = pipe(
      this.#pieces,
      filter((piece) => piece instanceof King && piece.color === color),
      toArray()
    ) as unknown as King[];

    if (result.length === 0) {
      throw new BoardNoKingFound();
    } else if (result.length > 1) {
      throw new BoardMultipleKingFound(result.length);
    }

    return result.at(0)!;
  }

  getPieces(): Piece[] {
    return Array.from(this.#pieces);
  }

  getTeamPieces(color: Color): Piece[] {
    return pipe(
      this.#pieces,
      filter((piece) => piece.color === color),
      toArray()
    );
  }

  isEmpty(position: Position): boolean {
    return !this.#table.exists(position);
  }

  isOccupied(position: Position): boolean {
    return this.#table.exists(position);
  }

  isPieceInEnemyMoves(piece: Piece): boolean {
    const enemyTeam = colorInvert(piece.color);
    return pipe(
      this.#pieces,
      filter((piece) => piece.color === enemyTeam),
      flatMap((enemy) => enemy.movements(this)),
      some((target) => target.equals(piece.position))
    );
  }

  move(piece: Piece, position: Position): RawPiece | null {
    const removedPiece = this.#removePieceFromPosition(position);
    this.#setPiece(piece, position);
    return removedPiece;
  }

  toData(): Record<Cell, RawPiece> {
    return pipe(
      this.#pieces,
      map((value) => this.#transformPiece(value)),
      toObject(({ raw, cell }) => [cell, raw])
    );
  }

  #removePieceFromPosition(position: Position): RawPiece | null {
    const result = this.#table.get(position);
    if (result === null) {
      return null;
    }

    this.#table.clear(position);
    return parsePieceToRaw(result);
  }

  #setPiece(piece: Piece, position: Position): void {
    if (this.#table.exists(piece.position)) {
      this.#table.clear(piece.position);
    }

    this.#table.put(piece, position);
    piece.position = position;
  }

  #transformPiece(piece: Piece): { raw: RawPiece; cell: Cell } {
    return {
      raw: parsePieceToRaw(piece),
      cell: piece.position.toCell(),
    };
  }

  get #pieces(): Iterable<Piece> {
    return this.#table.generatePiece();
  }

  static empty(): Board {
    return new Board(Table.empty());
  }

  static create(pieces: Partial<Record<Cell, RawPiece>>): Board {
    const board = Board.empty();

    for (const [cell, raw] of Object.entries(pieces)) {
      const position = Position.parse(cell as Cell);
      const piece = createPieceFromRaw(raw, position);
      board.#table.put(piece, position);
    }

    return board;
  }

  static initial(): Board {
    const board = Board.empty();

    // CREATE PAWN PIECES
    for (let i = 0; i < 8; i++) {
      board.factory.createPawn(Color.black, pos(i, 1));
      board.factory.createPawn(Color.white, pos(i, 6));
    }

    board.factory.createRook(Color.black, pos(0, 0));
    board.factory.createKnight(Color.black, pos(1, 0));
    board.factory.createBishop(Color.black, pos(2, 0));
    board.factory.createQueen(Color.black, pos(3, 0));
    board.factory.createKing(Color.black, pos(4, 0));
    board.factory.createBishop(Color.black, pos(5, 0));
    board.factory.createKnight(Color.black, pos(6, 0));
    board.factory.createRook(Color.black, pos(7, 0));

    board.factory.createRook(Color.white, pos(0, 7));
    board.factory.createKnight(Color.white, pos(1, 7));
    board.factory.createBishop(Color.white, pos(2, 7));
    board.factory.createKing(Color.white, pos(3, 7));
    board.factory.createQueen(Color.white, pos(4, 7));
    board.factory.createBishop(Color.white, pos(5, 7));
    board.factory.createKnight(Color.white, pos(6, 7));
    board.factory.createRook(Color.white, pos(7, 7));

    return board;
  }
}
