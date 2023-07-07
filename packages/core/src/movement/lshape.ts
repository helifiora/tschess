import { Movement } from "./movement.ts";
import type { Position } from "../position.ts";

export class LShape extends Movement {
  *[Symbol.iterator](): Iterator<Position> {
    const origin = this.piece.position;

    for (const increment of this.#increments()) {
      if (!origin.canAdd(increment[0], increment[1])) {
        continue;
      }

      const next = origin.toAdd(increment[0], increment[1]);

      if (this.#canGenerate(next)) {
        yield next;
      }
    }
  }

  #canGenerate(next: Position): boolean {
    const positionValue = this.board.get(next);
    if (positionValue === null) {
      return true;
    }

    return this.piece.color !== positionValue.color;
  }

  #increments(): [x: number, y: number][] {
    return [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];
  }
}
