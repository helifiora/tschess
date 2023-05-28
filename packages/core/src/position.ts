export class Position {
  constructor(public x: number, public y: number) {}

  equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }

  toString(): string {
    return `Position[x: ${this.x}, y: ${this.y}]`;
  }

  add(increment: Position): void {
    this.x += increment.x;
    this.y += increment.y;
  }

  toAdd(other: Position): Position {
    return new Position(this.x + other.x, this.y + other.y);
  }

  clone(): Position {
    return new Position(this.x, this.y);
  }
}

export function pos(x: number, y: number): Position {
  return new Position(x, y);
}
