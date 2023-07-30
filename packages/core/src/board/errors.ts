import type { Position } from "../position.ts";

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
