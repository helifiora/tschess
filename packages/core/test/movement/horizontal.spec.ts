import { beforeEach, expect, test } from "vitest";
import { Board } from "src/board/board.ts";
import { Color } from "@tschess/shared";
import { pos, Position } from "src/position.ts";
import { MovementStatus } from "src/movement/movement.ts";
import { Horizontal } from "src/movement/horizontal.ts";

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

test("Should generate positions", () => {
  const piece = board.factory.createKing(Color.white, pos(3, 3));
  const move = new Horizontal(piece, board);
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([
    pos(0, 3),
    pos(1, 3),
    pos(2, 3),
    pos(4, 3),
    pos(5, 3),
    pos(6, 3),
    pos(7, 3),
  ]);
  expect(result).toBe(expected);
});

test("Should generate only left positions", () => {
  const piece = board.factory.createKing(Color.white, pos(7, 3));
  const move = new Horizontal(piece, board);
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([
    pos(0, 3),
    pos(1, 3),
    pos(2, 3),
    pos(3, 3),
    pos(4, 3),
    pos(5, 3),
    pos(6, 3),
  ]);
  expect(result).toBe(expected);
});

test("Should generate only right positions", () => {
  const piece = board.factory.createKing(Color.white, pos(0, 3));
  const move = new Horizontal(piece, board);
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([
    pos(1, 3),
    pos(2, 3),
    pos(3, 3),
    pos(4, 3),
    pos(5, 3),
    pos(6, 3),
    pos(7, 3),
  ]);
  expect(result).toBe(expected);
});

test("Should generate taking 1 position", () => {
  const piece = board.factory.createKing(Color.white, pos(6, 6));
  const move = new Horizontal(piece, board, { take: 1 });
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(7, 6), pos(5, 6)]);
  expect(result).toBe(expected);
});

test("Should generate taking 2 positions", () => {
  const piece = board.factory.createKing(Color.white, pos(3, 3));
  const move = new Horizontal(piece, board, { take: 2 });
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([
    pos(4, 3),
    pos(5, 3),
    pos(2, 3),
    pos(1, 3),
  ]);
  expect(result).toBe(expected);
});

test("Should not include ally piece position (default)", () => {
  const piece = board.factory.createKing(Color.white, pos(0, 3));
  board.factory.createKnight(Color.white, pos(3, 3));
  const move = new Horizontal(piece, board);
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(1, 3), pos(2, 3)]);
  expect(result).toBe(expected);
});

test("Should include enemy piece position (default)", () => {
  const piece = board.factory.createKing(Color.white, pos(0, 3));
  board.factory.createKnight(Color.black, pos(3, 3));
  const move = new Horizontal(piece, board);
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(1, 3), pos(2, 3), pos(3, 3)]);
  expect(result).toBe(expected);
});

test("Should change acceptance criteria", () => {
  const piece = board.factory.createKing(Color.white, pos(0, 3));
  board.factory.createKing(Color.black, pos(3, 3));
  const move = new Horizontal(piece, board, {
    acceptanceFn: (board, origin, target) => {
      if (origin.piece === null || target.piece === null) {
        return MovementStatus.next;
      }

      return MovementStatus.stop;
    },
  });
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(1, 3), pos(2, 3)]);
  expect(result).toBe(expected);
});
