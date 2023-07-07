import { Position } from "../position.ts";
import { MovementStatus } from "./movement.ts";
import type { Board } from "../board/board.ts";
import type { Piece } from "../piece/piece.ts";

type PieceOrigin = { piece: Piece; position: Position };
type PieceTarget = { piece: Piece | null; position: Position };
export type CommonAcceptanceFn = (
  board: Board,
  origin: PieceOrigin,
  target: PieceTarget
) => MovementStatus;

export interface CommonGeneratorOptions {
  take?: number | null;
  acceptanceFn?: CommonAcceptanceFn | null;
}

export function* commonGenerator(
  board: Board,
  origin: Piece,
  increment: [x: number, y: number],
  options: CommonGeneratorOptions = {}
): Generator<Position> {
  const acceptanceFn = options.acceptanceFn ?? defaultAcceptance;
  const take = options.take ?? null;
  const current = origin.position;
  let count = 1;

  while (true) {
    if (hasTakenAllPieces(take, count)) {
      return;
    }

    try {
      current.add(increment[0], increment[1]);
    } catch (e) {
      return;
    }

    const targetPiece = board.get(current);

    const movementStatus = acceptanceFn(
      board,
      { piece: origin, position: origin.position },
      { piece: targetPiece, position: current }
    );

    if (movementStatus === MovementStatus.stop) {
      return;
    }

    yield current.clone();
    count += 1;

    if (movementStatus === MovementStatus.last) {
      return;
    }
  }
}

function hasTakenAllPieces(take: number | null, count: number): boolean {
  return take !== null && take < count;
}

function defaultAcceptance(
  _: Board,
  origin: PieceTarget,
  target: PieceTarget
): MovementStatus {
  if (origin.piece === null || target.piece === null) {
    return MovementStatus.next;
  }

  const isDifferentTeam = origin.piece.color !== target.piece.color;
  return isDifferentTeam ? MovementStatus.last : MovementStatus.stop;
}
