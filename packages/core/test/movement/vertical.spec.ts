import { beforeEach, expect, test } from "vitest";
import { Board } from "src/board/board.ts";
import { Color, colorInvert } from "@tschess/shared";
import { Vertical } from "src/movement/vertical.ts";
import { Direction } from "src/direction.ts";
import { pos, Position } from "src/position.ts";
import { MovementStatus } from "src/movement/movement.ts";

function positionsToString(values: Position[]): string {
  return values
    .map((a) => a.toString())
    .sort((a, b) => a.localeCompare(b))
    .join(", ");
}

let board: Board;

beforeEach(() => {
  board = Board.empty();
});

test("Should generate both direction positions", () => {
  const piece = board.factory.createKing(Color.white, pos(2, 2));
  const move = new Vertical(piece, board);
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([
    pos(2, 0),
    pos(2, 1),
    pos(2, 3),
    pos(2, 4),
    pos(2, 5),
    pos(2, 6),
    pos(2, 7),
  ]);
  expect(result).toBe(expected);
});

test("Should generate top direction positions", () => {
  const piece = board.factory.createKing(Color.white, pos(2, 5));
  const move = new Vertical(piece, board, { direction: Direction.top });
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([
    pos(2, 4),
    pos(2, 3),
    pos(2, 2),
    pos(2, 1),
    pos(2, 0),
  ]);
  expect(result).toBe(expected);
});

test("Should generate bottom direction positions", () => {
  const piece = board.factory.createKing(Color.white, pos(2, 5));
  const move = new Vertical(piece, board, { direction: Direction.bottom });
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(2, 6), pos(2, 7)]);
  expect(result).toBe(expected);
});

test("Should generate taking 1 position", () => {
  const piece = board.factory.createKing(Color.white, pos(6, 6));
  const move = new Vertical(piece, board, { take: 1 });
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(6, 7), pos(6, 5)]);
  expect(result).toBe(expected);
});

test("Should generate taking 2 positions", () => {
  const piece = board.factory.createKing(Color.white, pos(3, 3));
  const move = new Vertical(piece, board, { take: 2 });
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([
    pos(3, 1),
    pos(3, 2),
    pos(3, 4),
    pos(3, 5),
  ]);
  expect(result).toBe(expected);
});

test("Should not include ally piece position (default)", () => {
  const piece = board.factory.createKing(Color.white, pos(3, 0));
  board.factory.createKing(piece.color, pos(3, 3));
  const move = new Vertical(piece, board, { direction: Direction.bottom });
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(3, 1), pos(3, 2)]);
  expect(result).toBe(expected);
});

test("Should include enemy piece position (default)", () => {
  const piece = board.factory.createKing(Color.white, pos(3, 0));
  board.factory.createKing(colorInvert(piece.color), pos(3, 3));
  const move = new Vertical(piece, board, { direction: Direction.bottom });
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(3, 1), pos(3, 2), pos(3, 3)]);
  expect(result).toBe(expected);
});

test("Should change acceptance criteria", () => {
  const piece = board.factory.createKing(Color.white, pos(3, 0));
  board.factory.createKing(colorInvert(piece.color), pos(3, 3));
  const move = new Vertical(piece, board, {
    direction: Direction.bottom,
    acceptanceFn: (board, origin, target) => {
      if (origin.piece === null || target.piece === null) {
        return MovementStatus.next;
      }

      return MovementStatus.stop;
    },
  });
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(3, 1), pos(3, 2)]);
  expect(result).toBe(expected);
});
