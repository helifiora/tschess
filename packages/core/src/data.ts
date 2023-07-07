import { Color } from "./color.ts";
import { Cell } from "./cell.ts";
import { RawPiece } from "./piece/raw.ts";

export interface GameData {
  readonly pieces: Map<RawPiece, Cell>;
  readonly currentTeam: Color;
  readonly capturedPieces: RawPiece[];
  readonly isCheck: boolean;
}
