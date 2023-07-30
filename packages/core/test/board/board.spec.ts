import { beforeEach, expect, test } from "vitest";
import { Board } from "src/board/board.ts";
import { pos } from "src/position.ts";
import { Color, colorInvert } from "@tschess/shared";

let board: Board;

beforeEach(() => {
  board = Board.empty();
});

test("Should create an empty board", () => {
  for (let y = 0; y <= 7; y++) {
    for (let x = 0; x <= 7; x++) {
      const position = pos(x, y);
      const result = board.get(position);
      expect(result).toBeNull();
    }
  }
});

test("Should verify if position is empty", () => {
  const position = pos(0, 0);
  expect(board.get(position)).toBeNull();
  expect(board.isEmpty(position)).toBe(true);
});

test("Should verify if position is occupied", () => {
  const position = pos(0, 0);
  const piece = board.factory.createKnight(Color.black, position);
  board.move(piece, position);
  expect(board.get(position)).toBe(piece);
  expect(board.isOccupied(position)).toBe(true);
});

test.each([Color.black, Color.white])("Should retrieve pieces from team [%s]", (color: Color) => {
  const p1 = board.factory.createKnight(color, pos(1, 1));
  const p2 = board.factory.createKnight(color, pos(1, 2));
  const p3 = board.factory.createKnight(color, pos(1, 3));

  board.factory.createKnight(colorInvert(color), pos(5, 5));
  board.factory.createKnight(colorInvert(color), pos(5, 6));
  board.factory.createKnight(colorInvert(color), pos(5, 7));
  const myPieces = new Set([p1, p2, p3]);
  const result = new Set(board.getTeamPieces(color));
  expect(result).toEqual(myPieces);
});

test("Should retrieve king if it exists", () => {
  const piece = board.factory.createKing(Color.black, pos(1, 1));
  const result = board.getKing(Color.black);
  expect(result).toBe(piece);
});

test.skip("Should retrieve king throws an error if it not on board", () => {
  expect(() => board.getKing(Color.black)).toThrowError();
});

test("Should retrieve king throws an error if it has more than 1 king (same team) on board", () => {
  board.factory.createKing(Color.black, pos(1, 1));
  board.factory.createKing(Color.black, pos(1, 2));
  expect(() => board.getKing(Color.black)).toThrowError();
});

test("Should place piece and update position after", () => {
  const piece = board.factory.createKing(Color.black, pos(1, 1));
  board.move(piece, pos(2, 2));
  expect(board.get(pos(1, 1))).toBeNull();
  expect(board.get(pos(2, 2))).toBe(piece);
});

test("Should clone board and pieces", () => {
  const ref1 = board.factory.createKnight(Color.black, pos(1, 2));
  const ref2 = board.factory.createKnight(Color.white, pos(1, 3));
  const ref3 = board.factory.createKing(Color.white, pos(1, 4));
  const ref4 = board.factory.createKing(Color.black, pos(1, 5));

  const clone = board.clone();
  expect(clone).not.toBe(board);
  expect(clone.get(pos(1, 2))).not.toBeNull();
  expect(clone.get(pos(1, 3))).not.toBeNull();
  expect(clone.get(pos(1, 4))).not.toBeNull();
  expect(clone.get(pos(1, 5))).not.toBeNull();
  expect(clone.get(pos(1, 2))).not.toBe(ref1);
  expect(clone.get(pos(1, 3))).not.toBe(ref2);
  expect(clone.get(pos(1, 4))).not.toBe(ref3);
  expect(clone.get(pos(1, 5))).not.toBe(ref4);
});
