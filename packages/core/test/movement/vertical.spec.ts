import { expect, test } from "vitest";
import { Board } from "src/board/mod.ts";
import { King, Knight } from "src/piece/mod.ts";
import { Color } from "src/color.ts";
import { Vertical } from "src/movement/vertical.ts";
import { Direction } from "src/direction.ts";
import { pos, Position } from "src/position.ts";
import { MovementStatus } from "../../src/movement/movement.ts";

function positionsToString(values: Position[]): string {
  return values
    .map((a) => a.toString())
    .sort((a, b) => a.localeCompare(b))
    .join(", ");
}

test("Should generate both direction positions", () => {
  const board = Board.empty();
  const piece = new King(Color.white);
  board.place(piece, pos(2, 2));
  const move = new Vertical(piece, board);
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(2, 0), pos(2, 1), pos(2, 3), pos(2, 4), pos(2, 5), pos(2, 6), pos(2, 7)]);
  expect(result).toBe(expected);
});

test("Should generate top direction positions", () => {
  const board = Board.empty();
  const piece = new King(Color.white);
  board.place(piece, pos(2, 5));
  const move = new Vertical(piece, board, { direction: Direction.top });
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(2, 4), pos(2, 3), pos(2, 2), pos(2, 1), pos(2, 0)]);
  expect(result).toBe(expected);
});

test("Should generate bottom direction positions", () => {
  const board = Board.empty();
  const piece = new King(Color.white);
  board.place(piece, pos(2, 5));
  const move = new Vertical(piece, board, { direction: Direction.bottom });
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(2, 6), pos(2, 7)]);
  expect(result).toBe(expected);
});

test("Should generate taking 1 position", () => {
  const board = Board.empty();
  const piece = new King(Color.white);
  board.place(piece, pos(6, 6));
  const move = new Vertical(piece, board, { take: 1 });
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(6, 7), pos(6, 5)]);
  expect(result).toBe(expected);
});

test("Should generate taking 2 positions", () => {
  const board = Board.empty();
  const piece = new King(Color.white);
  board.place(piece, pos(3, 3));
  const move = new Vertical(piece, board, { take: 2 });
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(3, 1), pos(3, 2), pos(3, 4), pos(3, 5)]);
  expect(result).toBe(expected);
});

test("Should not include ally piece position (default)", () => {
  const board = Board.empty();
  const piece = new King(Color.white);
  board.place(piece, pos(3, 0));
  board.place(new Knight(Color.white), pos(3, 3));
  const move = new Vertical(piece, board, { direction: Direction.bottom });
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(3, 1), pos(3, 2)]);
  expect(result).toBe(expected);
});

test("Should include enemy piece position (default)", () => {
  const board = Board.empty();
  const piece = new King(Color.white);
  board.place(piece, pos(3, 0));
  board.place(new Knight(Color.black), pos(3, 3));
  const move = new Vertical(piece, board, { direction: Direction.bottom });
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(3, 1), pos(3, 2), pos(3, 3)]);
  expect(result).toBe(expected);
});

test("Should change acceptance criteria", () => {
  const board = Board.empty();
  const piece = new King(Color.white);
  board.place(piece, pos(3, 0));
  board.place(new Knight(Color.black), pos(3, 3));
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
