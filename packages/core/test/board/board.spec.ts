import { expect, test } from "vitest";
import { Board } from "src/board/mod.ts";
import { Position } from "src/position.ts";
import { King, Knight } from "src/piece/mod.ts";
import { Color, colorInvert } from "src/color.ts";

test("Should create an empty board", () => {
  const board = Board.empty();

  for (let y = 0; y <= 7; y++) {
    for (let x = 0; x <= 7; x++) {
      const position = new Position(x, y);
      const result = board.get(position);
      expect(result).toBeNull();
    }
  }
});

test("Should verify if position is empty", () => {
  const board = Board.empty();
  const position = new Position(0, 0);
  expect(board.get(position)).toBeNull();
  expect(board.isEmpty(position)).toBe(true);
});

test("Should verify if position is occupied", () => {
  const board = Board.empty();
  const position = new Position(0, 0);
  const piece = new Knight(Color.black);
  board.place(piece, position);
  expect(board.get(position)).toBe(piece);
  expect(board.isOccupied(position)).toBe(true);
});

test.each([Color.black, Color.white])("Should retrieve pieces from team [%s]", (color: Color) => {
  const board = Board.empty();
  const p1 = new Knight(color);
  const p2 = new Knight(color);
  const p3 = new Knight(color);
  board.place(p1, new Position(1, 1));
  board.place(p2, new Position(1, 2));
  board.place(p3, new Position(1, 3));
  board.place(new Knight(colorInvert(color)), new Position(5, 5));
  board.place(new Knight(colorInvert(color)), new Position(5, 6));
  board.place(new Knight(colorInvert(color)), new Position(5, 7));
  const myPieces = new Set([p1, p2, p3]);
  const result = new Set(board.getTeamPieces(color));
  expect(result).toEqual(myPieces);
});

test("Should retrieve king if it exists", () => {
  const board = Board.empty();
  const piece = new King(Color.black);
  board.place(piece, new Position(1, 1));
  const result = board.getKing(Color.black);
  expect(result).toBe(piece);
});

test("Should retrieve king throws an error if it not on board", () => {
  const board = Board.empty();
  expect(() => board.getKing(Color.black)).toThrowError();
});

test("Should retrieve king throws an error if it has more than 1 king (same team) on board", () => {
  const board = Board.empty();
  board.place(new King(Color.black), new Position(1, 1));
  board.place(new King(Color.black), new Position(1, 2));
  expect(() => board.getKing(Color.black)).toThrowError();
});

test("Should place piece and update position after", () => {
  const board = Board.empty();
  const piece = new King(Color.black);
  board.place(piece, new Position(1, 1));
  board.place(piece, new Position(2, 2));
  expect(board.get(new Position(1, 1))).toBeNull();
  expect(board.get(new Position(2, 2))).toBe(piece);
});

test("Should clone board and pieces", () => {
  const board = Board.empty();
  const ref1 = new Knight(Color.black);
  const ref2 = new Knight(Color.white);
  const ref3 = new King(Color.white);
  const ref4 = new King(Color.black);

  board.place(ref1, new Position(1, 2));
  board.place(ref2, new Position(1, 3));
  board.place(ref3, new Position(1, 4));
  board.place(ref4, new Position(1, 5));

  const clone = board.clone();
  expect(clone).not.toBe(board);
  expect(clone.get(new Position(1, 2))).not.toBeNull();
  expect(clone.get(new Position(1, 3))).not.toBeNull();
  expect(clone.get(new Position(1, 4))).not.toBeNull();
  expect(clone.get(new Position(1, 5))).not.toBeNull();
  expect(clone.get(new Position(1, 2))).not.toBe(ref1);
  expect(clone.get(new Position(1, 3))).not.toBe(ref2);
  expect(clone.get(new Position(1, 4))).not.toBe(ref3);
  expect(clone.get(new Position(1, 5))).not.toBe(ref4);
});
