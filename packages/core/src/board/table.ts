import type { Piece } from "src/piece/mod.ts";
import { Position } from "src/position.ts";

export type TableItem = Piece | null;

export const tableMinValue = 0;
export const tableMaxValue = 7;

export type Table = [
  [TableItem, TableItem, TableItem, TableItem, TableItem, TableItem, TableItem, TableItem],
  [TableItem, TableItem, TableItem, TableItem, TableItem, TableItem, TableItem, TableItem],
  [TableItem, TableItem, TableItem, TableItem, TableItem, TableItem, TableItem, TableItem],
  [TableItem, TableItem, TableItem, TableItem, TableItem, TableItem, TableItem, TableItem],
  [TableItem, TableItem, TableItem, TableItem, TableItem, TableItem, TableItem, TableItem],
  [TableItem, TableItem, TableItem, TableItem, TableItem, TableItem, TableItem, TableItem],
  [TableItem, TableItem, TableItem, TableItem, TableItem, TableItem, TableItem, TableItem],
  [TableItem, TableItem, TableItem, TableItem, TableItem, TableItem, TableItem, TableItem]
];

export function cloneTable(table: Table): Table {
  const result = createEmptyTable();

  for (const [piece, position] of tablePiecePositionGenerator(table)) {
    result[position.y][position.x] = piece.clone();
  }

  return result;
}

export function createEmptyTable(): Table {
  return [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];
}

export function getTablePiecesMap(table: Table): Map<Piece, Position> {
  const result = new Map<Piece, Position>();
  for (const [piece, position] of tablePiecePositionGenerator(table)) {
    result.set(piece, position);
  }

  return result;
}

export function invalidPosition(x: number, y: number): boolean {
  return !validPosition(x, y);
}

export function* tablePieceGenerator(table: Table): Generator<Piece> {
  for (const position of tablePositionGenerator()) {
    const pieceOrNull = table[position.y][position.x];
    if (pieceOrNull !== null) {
      yield pieceOrNull;
    }
  }
}

export function* tablePiecePositionGenerator(table: Table): Generator<[Piece, Position]> {
  for (const position of tablePositionGenerator()) {
    const pieceOrNull = table[position.y][position.x];
    if (pieceOrNull !== null) {
      yield [pieceOrNull, position];
    }
  }
}

export function* tablePositionGenerator(): Generator<Position> {
  for (let y = tableMinValue; y <= tableMaxValue; y++) {
    for (let x = tableMinValue; x <= tableMaxValue; x++) {
      yield new Position(x, y);
    }
  }
}

export function validPosition(x: number, y: number): boolean {
  const validX = x >= tableMinValue && x <= tableMaxValue;
  const validY = y >= tableMinValue && y <= tableMaxValue;
  return validX && validY;
}
