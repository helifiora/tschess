import { Table } from "./board/table.ts";
import type { Cell } from "@tschess/shared";

export class Position {
  #x: number;
  #y: number;

  constructor(x: number, y: number) {
    if (Table.isInvalid(x, y)) {
      throw new Error("Invalid Position!");
    }

    this.#x = x;
    this.#y = y;
  }

  get x(): number {
    return this.#x;
  }

  get y(): number {
    return this.#y;
  }

  equals(other: Position): boolean {
    return this.#x === other.x && this.#y === other.y;
  }

  toString(): string {
    return `Position[x: ${this.x}, y: ${this.y}]`;
  }

  add(x: number, y: number): void {
    if (Table.isInvalid(this.#x + x, this.#y + y)) {
      throw new Error("Invalid Position!");
    }

    this.#x += x;
    this.#y += y;
  }

  toAdd(x: number, y: number): Position {
    return new Position(this.#x + x, this.#y + y);
  }

  toCell(): Cell {
    const column = "abcdefgh".at(this.x);
    const row = 8 - this.y;
    return `${column}${row}` as Cell;
  }

  canAdd(x: number, y: number): boolean {
    return Table.isValid(this.#x + x, this.#y + y);
  }

  clone(): Position {
    return new Position(this.#x, this.#y);
  }

  static parse(cell: Cell): Position {
    const x = "abcdefgh".indexOf(cell[0]);
    const y = 8 - Number(cell[1]);
    return new Position(x, y);
  }
}

export function pos(x: number, y: number): Position {
  return new Position(x, y);
}
