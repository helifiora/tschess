import { test, expect } from "vitest";
import { Board } from "src/board/mod.ts";
import { Knight } from "src/piece/mod.ts";
import { Color } from "src/color.ts";
import { pos, Position } from "src/position.ts";
import { LShape } from "src/movement/lshape.ts";

function positionsToString(values: Position[]): string {
  return values
    .map((a) => a.toString())
    .sort((a, b) => a.localeCompare(b))
    .join(", ");
}

test("Should generate all positions", () => {
  const board = Board.empty();
  const piece = new Knight(Color.black);
  board.place(piece, pos(3, 3));
  const move = new LShape(piece, board);

  const result = positionsToString(Array.from(move));
  const expected = positionsToString([
    pos(2, 1),
    pos(4, 1),
    pos(1, 2),
    pos(5, 2),
    pos(1, 4),
    pos(5, 4),
    pos(2, 5),
    pos(4, 5),
  ]);

  expect(result).toBe(expected);
});

test("Should generate bottom positions", () => {
  const board = Board.empty();
  const piece = new Knight(Color.black);
  board.place(piece, pos(3, 0));
  const move = new LShape(piece, board);

  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(1, 1), pos(5, 1), pos(2, 2), pos(4, 2)]);

  expect(result).toBe(expected);
});

test("Should generate bottom right positions", () => {
  const board = Board.empty();
  const piece = new Knight(Color.black);
  board.place(piece, pos(0, 0));
  const move = new LShape(piece, board);

  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(1, 2), pos(2, 1)]);

  expect(result).toBe(expected);
});

test("Should generate bottom left positions", () => {
  const board = Board.empty();
  const piece = new Knight(Color.black);
  board.place(piece, pos(7, 0));
  const move = new LShape(piece, board);

  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(6, 2), pos(5, 1)]);

  expect(result).toBe(expected);
});

test("Should generate top positions", () => {
  const board = Board.empty();
  const piece = new Knight(Color.black);
  board.place(piece, pos(3, 7));
  const move = new LShape(piece, board);

  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(1, 6), pos(5, 6), pos(2, 5), pos(4, 5)]);

  expect(result).toBe(expected);
});

test("Should generate top right positions", () => {
  const board = Board.empty();
  const piece = new Knight(Color.black);
  board.place(piece, pos(0, 7));
  const move = new LShape(piece, board);

  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(1, 5), pos(2, 6)]);

  expect(result).toBe(expected);
});

test("Should generate top left positions", () => {
  const board = Board.empty();
  const piece = new Knight(Color.black);
  board.place(piece, pos(7, 7));
  const move = new LShape(piece, board);

  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(6, 5), pos(5, 6)]);

  expect(result).toBe(expected);
});

test("Should generation include enemy position", () => {
  const board = Board.empty();
  const piece = new Knight(Color.black);
  board.place(piece, pos(3, 3));
  board.place(new Knight(Color.white), pos(4, 1));
  const move = new LShape(piece, board);

  const result = positionsToString(Array.from(move));
  const expected = positionsToString([
    pos(2, 1),
    pos(1, 2),
    pos(5, 2),
    pos(4, 1),
    pos(1, 4),
    pos(5, 4),
    pos(2, 5),
    pos(4, 5),
  ]);

  expect(result).toBe(expected);
});

test("Should generation not include ally position", () => {
  const board = Board.empty();
  const piece = new Knight(Color.black);
  board.place(piece, pos(3, 3));
  board.place(new Knight(Color.black), pos(4, 1));
  const move = new LShape(piece, board);

  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(2, 1), pos(1, 2), pos(5, 2), pos(1, 4), pos(5, 4), pos(2, 5), pos(4, 5)]);

  expect(result).toBe(expected);
});
