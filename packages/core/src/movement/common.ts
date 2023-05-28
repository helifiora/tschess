import { Board } from "../board/board.ts";
import { Position } from "../position.ts";
import { invalidPosition } from "../board/table.ts";
import { MovementStatus } from "./movement.ts";
import type { Piece } from "../piece/piece.ts";

type PiecePosition = { piece: Piece | null; position: Position };
export type CommonAcceptanceFn = (board: Board, origin: PiecePosition, target: PiecePosition) => MovementStatus;
interface Options {
  take?: number | null;
  acceptanceFn?: CommonAcceptanceFn | null;
}

export function* commonGenerator(
  board: Board,
  origin: Position,
  increment: Position,
  options: Options = {}
): Generator<Position> {
  const acceptanceFn = options.acceptanceFn ?? defaultAcceptance;
  const take = options.take ?? null;
  const current = origin.clone();
  let count = 0;

  while (true) {
    current.add(increment);
    count += 1;

    if (invalidPosition(current.x, current.y) || hasTakenAllPieces(take, count)) {
      return;
    }

    const originPiece = board.get(origin);
    const targetPiece = board.get(current);

    const movementStatus = acceptanceFn(
      board,
      { piece: originPiece, position: origin },
      { piece: targetPiece, position: current }
    );

    if (movementStatus === MovementStatus.stop) {
      return;
    }

    yield current.clone();

    if (movementStatus === MovementStatus.last) {
      return;
    }
  }
}

function hasTakenAllPieces(take: number | null, count: number): boolean {
  return take !== null && take < count;
}

function defaultAcceptance(board: Board, origin: PiecePosition, target: PiecePosition): MovementStatus {
  if (origin.piece === null || target.piece === null) {
    return MovementStatus.next;
  }

  const isDifferentTeam = origin.piece.color !== target.piece.color;
  return isDifferentTeam ? MovementStatus.last : MovementStatus.stop;
}
