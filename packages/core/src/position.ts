export class Position {
  constructor(readonly x: number, readonly y: number) {}

  equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }

  toString(): string {
    return `Position[x: ${this.x}, y: ${this.y}]`;
  }
}
