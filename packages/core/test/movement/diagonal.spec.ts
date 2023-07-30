import { beforeEach, expect, test } from "vitest";
import { Board } from "src/board/board.ts";
import { Color, colorInvert } from "@tschess/shared";
import { Direction } from "src/direction";
import { pos, Position } from "src/position";
import { MovementStatus } from "../../src/movement/movement";
import { Diagonal } from "../../src/movement/diagonal";

let board: Board;

beforeEach(() => {
  board = Board.empty();
});

function positionsToString(values: Position[]): string {
  return values
    .map((a) => a.toString())
    .sort((a, b) => a.localeCompare(b))
    .join(", ");
}

test("Should generate both direction positions", () => {
  const piece = board.factory.createKing(Color.white, pos(2, 2));
  const move = new Diagonal(piece, board);
  const result = Array.from(move);
  const expected = [
    pos(0, 0),
    pos(1, 1),
    pos(3, 3),
    pos(4, 4),
    pos(5, 5),
    pos(6, 6),
    pos(7, 7),
    pos(0, 4),
    pos(1, 3),
    pos(3, 1),
    pos(4, 0),
  ];

  expect(positionsToString(result)).toBe(positionsToString(expected));
});

test("Should generate top direction positions", () => {
  const piece = board.factory.createKing(Color.white, pos(2, 2));
  const move = new Diagonal(piece, board, { direction: Direction.top });
  const result = Array.from(move);
  const expected = [pos(0, 0), pos(1, 1), pos(3, 1), pos(4, 0)];
  expect(positionsToString(result)).toBe(positionsToString(expected));
});

test("Should generate bottom direction positions", () => {
  const piece = board.factory.createKing(Color.white, pos(5, 5));
  const move = new Diagonal(piece, board, { direction: Direction.bottom });
  const result = Array.from(move);
  const expected = [pos(6, 6), pos(7, 7), pos(4, 6), pos(3, 7)];
  expect(positionsToString(result)).toBe(positionsToString(expected));
});

test("Should generate taking 1 position", () => {
  const piece = board.factory.createKing(Color.white, pos(5, 5));
  const move = new Diagonal(piece, board, { take: 1 });
  const result = Array.from(move);
  const expected = [pos(6, 6), pos(4, 6), pos(4, 4), pos(6, 4)];
  expect(positionsToString(result)).toBe(positionsToString(expected));
});

test("Should generate taking 2 positions", () => {
  const piece = board.factory.createKing(Color.white, pos(3, 3));
  const move = new Diagonal(piece, board, { take: 2 });

  const result = Array.from(move);
  const expected = [
    pos(2, 2),
    pos(1, 1),
    pos(2, 4),
    pos(1, 5),
    pos(4, 2),
    pos(5, 1),
    pos(4, 4),
    pos(5, 5),
  ];

  expect(positionsToString(result)).toBe(positionsToString(expected));
});

test("Should not include ally piece position (default)", () => {
  const piece = board.factory.createKing(Color.white, pos(2, 0));
  board.factory.createKnight(piece.color, pos(5, 3));

  const move = new Diagonal(piece, board, { direction: Direction.bottom });

  const result = Array.from(move);
  const expected = [pos(3, 1), pos(4, 2), pos(1, 1), pos(0, 2)];
  expect(positionsToString(result)).toBe(positionsToString(expected));
});

test("Should include enemy piece position (default)", () => {
  const piece = board.factory.createKing(Color.white, pos(2, 0));
  board.factory.createKing(colorInvert(piece.color), pos(5, 3));

  const move = new Diagonal(piece, board, { direction: Direction.bottom });
  const result = Array.from(move);
  const expected = [pos(3, 1), pos(4, 2), pos(5, 3), pos(1, 1), pos(0, 2)];
  expect(positionsToString(result)).toBe(positionsToString(expected));
});

test("Should change acceptance criteria", () => {
  const piece = board.factory.createKing(Color.white, pos(2, 0));
  board.factory.createKing(colorInvert(piece.color), pos(5, 3));

  const move = new Diagonal(piece, board, {
    direction: Direction.bottom,
    acceptanceFn: (board, origin, target) => {
      if (origin.piece === null || target.piece === null) {
        return MovementStatus.next;
      }

      return MovementStatus.stop;
    },
  });
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([
    pos(3, 1),
    pos(4, 2),
    pos(1, 1),
    pos(0, 2),
  ]);
  expect(result).toBe(expected);
});
