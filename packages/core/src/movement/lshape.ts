import { Movement } from "./movement.ts";
import { Position } from "../position.ts";
import { invalidPosition } from "../board/table.ts";

export class LShape extends Movement {
  *[Symbol.iterator](): Iterator<Position> {
    const origin = this.board.getPiecePosition(this.piece);
    if (origin === null) {
      return;
    }

    for (const increment of this.increments()) {
      const next = origin.toAdd(increment);
      if (this.canGenerate(next)) {
        yield next;
      }
    }
  }

  private canGenerate(next: Position): boolean {
    if (invalidPosition(next.x, next.y)) {
      return false;
    }

    const positionValue = this.board.get(next);
    if (positionValue === null) {
      return true;
    }

    return this.piece.color !== positionValue.color;
  }

  private increments(): Position[] {
    return [
      new Position(-2, -1),
      new Position(-2, 1),
      new Position(-1, -2),
      new Position(-1, 2),
      new Position(1, -2),
      new Position(1, 2),
      new Position(2, -1),
      new Position(2, 1),
    ];
  }
}
