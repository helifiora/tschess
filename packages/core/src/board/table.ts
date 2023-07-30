import type { Piece } from "../piece/piece.ts";
import { Position } from "../position.ts";

export class Table {
  static minValue = 0;
  static maxValue = 7;

  readonly #table: Data;

  constructor(value: Data) {
    this.#table = value;
  }

  clone(): Table {
    const data = createData();

    for (const piece of this.generatePiece()) {
      const position = piece.position;
      data[position.y][position.x] = piece.clone();
    }

    return new Table(data);
  }

  clear(position: Position): void {
    this.#table[position.y][position.x] = null;
  }

  exists(position: Position): boolean {
    return this.#table[position.y][position.x] !== null;
  }

  get(position: Position): Piece | null {
    return this.#table[position.y][position.x];
  }

  put(piece: Piece, position: Position): void {
    this.#table[position.y][position.x] = piece;
  }

  *generatePiece(): Generator<Piece> {
    for (const position of Table.generatePosition()) {
      const pieceOrNull = this.#table[position.y][position.x];
      if (pieceOrNull !== null) {
        yield pieceOrNull;
      }
    }
  }

  static isInvalid(x: number, y: number): boolean {
    return !Table.isValid(x, y);
  }

  static isValid(x: number, y: number): boolean {
    const validX = x >= Table.minValue && x <= Table.maxValue;
    const validY = y >= Table.minValue && y <= Table.maxValue;
    return validX && validY;
  }

  static empty(): Table {
    return new Table(createData());
  }

  static *generatePosition(): Generator<Position> {
    for (let y = Table.minValue; y <= Table.maxValue; y++) {
      for (let x = Table.minValue; x <= Table.maxValue; x++) {
        yield new Position(x, y);
      }
    }
  }
}

function createData(): Data {
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

type DataItem = Piece | null;

type DataLine = [
  DataItem,
  DataItem,
  DataItem,
  DataItem,
  DataItem,
  DataItem,
  DataItem,
  DataItem
];

type Data = [
  DataLine,
  DataLine,
  DataLine,
  DataLine,
  DataLine,
  DataLine,
  DataLine,
  DataLine
];
