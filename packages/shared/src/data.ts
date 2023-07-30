import { Color } from "./color.ts";
import type { Cell } from "./cell.ts";

export interface GameData {
  readonly pieces: Partial<Record<Cell, RawPiece>>;
  readonly currentTeam: Color;
  readonly capturedPieces: readonly RawPiece[];
}

export interface GameDataResult extends GameData {
  readonly isCheck: Color | null;
  readonly isCheckmate: boolean;
}

export type PieceType =
  | "bishop"
  | "king"
  | "knight"
  | "pawn"
  | "queen"
  | "rook";

export interface RawPiece {
  readonly color: Color;
  readonly type: PieceType;
  readonly moveCount?: number;
}
