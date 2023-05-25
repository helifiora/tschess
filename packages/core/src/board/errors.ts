import type { Position } from "src/position.ts";

export class BoardInvalidPosition extends Error {
  constructor(readonly position: Position) {
    super();
  }
}

export class BoardNoKingFound extends Error {
  constructor() {
    super();
  }
}

export class BoardMultipleKingFound extends Error {
  constructor(readonly quantity: number) {
    super();
  }
}
