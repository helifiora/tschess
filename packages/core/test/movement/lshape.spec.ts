import { test, expect, beforeEach } from "vitest";
import { Board } from "src/board/board.ts";
import { Color, colorInvert } from "@tschess/shared";
import { pos, Position } from "src/position.ts";
import { LShape } from "src/movement/lshape.ts";

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

test("Should generate all positions", () => {
  const piece = board.factory.createKing(Color.black, pos(3, 3));
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
  const piece = board.factory.createKing(Color.black, pos(3, 0));
  const move = new LShape(piece, board);
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([
    pos(1, 1),
    pos(5, 1),
    pos(2, 2),
    pos(4, 2),
  ]);
  expect(result).toBe(expected);
});

test("Should generate bottom right positions", () => {
  const piece = board.factory.createKing(Color.black, pos(0, 0));
  const move = new LShape(piece, board);
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(1, 2), pos(2, 1)]);
  expect(result).toBe(expected);
});

test("Should generate bottom left positions", () => {
  const piece = board.factory.createKing(Color.black, pos(7, 0));
  const move = new LShape(piece, board);
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(6, 2), pos(5, 1)]);
  expect(result).toBe(expected);
});

test("Should generate top positions", () => {
  const piece = board.factory.createKing(Color.black, pos(3, 7));
  const move = new LShape(piece, board);
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([
    pos(1, 6),
    pos(5, 6),
    pos(2, 5),
    pos(4, 5),
  ]);
  expect(result).toBe(expected);
});

test("Should generate top right positions", () => {
  const piece = board.factory.createKing(Color.black, pos(0, 7));
  const move = new LShape(piece, board);
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(1, 5), pos(2, 6)]);
  expect(result).toBe(expected);
});

test("Should generate top left positions", () => {
  const piece = board.factory.createKing(Color.black, pos(7, 7));
  const move = new LShape(piece, board);
  const result = positionsToString(Array.from(move));
  const expected = positionsToString([pos(6, 5), pos(5, 6)]);
  expect(result).toBe(expected);
});

test("Should generation include enemy position", () => {
  const piece = board.factory.createKing(Color.black, pos(3, 3));
  board.factory.createKing(colorInvert(piece.color), pos(4, 1));
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
  const piece = board.factory.createKing(Color.black, pos(3, 3));

  board.factory.createKing(piece.color, pos(4, 1));
  const move = new LShape(piece, board);

  const result = positionsToString(Array.from(move));
  const expected = positionsToString([
    pos(2, 1),
    pos(1, 2),
    pos(5, 2),
    pos(1, 4),
    pos(5, 4),
    pos(2, 5),
    pos(4, 5),
  ]);

  expect(result).toBe(expected);
});
