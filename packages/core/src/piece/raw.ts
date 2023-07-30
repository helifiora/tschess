import type { PieceType, RawPiece } from "@tschess/shared";
import type { Piece } from "./piece.ts";
import { Queen } from "./queen.ts";
import { King } from "./king.ts";
import { Knight } from "./knight.ts";
import { Rook } from "./rook.ts";
import { Pawn } from "./pawn.ts";
import { Bishop } from "./bishop.ts";
import { Position } from "../position.ts";

export function parsePieceToRaw(piece: Piece): RawPiece {
  return {
    color: piece.color,
    type: parsePieceType(piece),
    moveCount: piece.moveCount,
  };
}

export function createPieceFromRaw(raw: RawPiece, position: Position): Piece {
  switch (raw.type) {
    case "bishop":
      return new Bishop(raw.color, position, raw.moveCount ?? 0);
    case "king":
      return new King(raw.color, position, raw.moveCount ?? 0);
    case "knight":
      return new Knight(raw.color, position, raw.moveCount ?? 0);
    case "pawn":
      return new Pawn(raw.color, position, raw.moveCount ?? 0);
    case "queen":
      return new Queen(raw.color, position, raw.moveCount ?? 0);
    case "rook":
      return new Rook(raw.color, position, raw.moveCount ?? 0);
  }
}

export function parsePieceType(piece: Piece): PieceType {
  if (piece instanceof Queen) {
    return "queen";
  }

  if (piece instanceof King) {
    return "king";
  }

  if (piece instanceof Knight) {
    return "knight";
  }

  if (piece instanceof Rook) {
    return "rook";
  }

  if (piece instanceof Pawn) {
    return "pawn";
  }

  if (piece instanceof Bishop) {
    return "bishop";
  }

  throw "unknown type!";
}
