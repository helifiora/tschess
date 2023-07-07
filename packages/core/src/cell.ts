import { Position } from "./position.ts";

export type Column = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

export type Row = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export class Cell {
  readonly value: string;

  constructor(readonly row: Row, readonly column: Column) {
    this.value = `${column}${row}`;
  }

  toPosition(): Position {
    const x = "abcdefgh".indexOf(this.column);
    const y = 8 - this.row;
    return new Position(x, y);
  }

  static parseRaw(rawRow: number, rawColumn: string): Cell {
    if (!isRawColumn(rawColumn) || !isRawRow(rawRow)) {
      throw new Error("Could not parse cell!");
    }

    return new Cell(rawRow, rawColumn);
  }

  static parseNumber(rowNumber: number, columnNumber: number): Cell {
    if (!isRawRow(rowNumber) || columnNumber < 1 || columnNumber > 8) {
      throw new Error("Could not parse cell!");
    }

    const column = "abcdefgh".at(columnNumber - 1) as Column;
    return new Cell(rowNumber, column);
  }
}

function isRawColumn(value: string): value is Column {
  return "abcdefgh".indexOf(value) >= 0;
}

function isRawRow(value: number): value is Row {
  return value >= 1 && value <= 8;
}
