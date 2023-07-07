import type { Position } from "../position.ts";
import { Color } from "../color.ts";

export class NoPieceInPositionError extends Error {
  constructor(readonly position: Position) {
    super();
  }
}

export class AnotherTeamTurnError extends Error {
  constructor(readonly currentTeam: Color, readonly positionTeam: Color) {
    super();
  }
}

export class PieceMovementNotAllowedError extends Error {}
