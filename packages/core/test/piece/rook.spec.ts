import { expect, test } from "vitest";
import { pos, Position } from "src/position.ts";
import { Board } from "src/board/mod.ts";
import { Knight, Rook } from "src/piece/mod.ts";
import { Color } from "../../src/color.ts";

function positionsToString(values: Position[]): string {
  return values
    .map((a) => a.toString())
    .sort((a, b) => a.localeCompare(b))
    .join(", ");
}

test.each([
  [
    pos(0, 3),
    [
      pos(0, 2),
      pos(0, 1),
      pos(0, 0),
      pos(0, 4),
      pos(0, 5),
      pos(0, 6),
      pos(0, 7),
      pos(1, 3),
      pos(2, 3),
      pos(3, 3),
      pos(4, 3),
      pos(5, 3),
      pos(6, 3),
      pos(7, 3),
    ],
  ],
  [
    pos(0, 4),
    [
      pos(0, 3),
      pos(0, 2),
      pos(0, 1),
      pos(0, 0),
      pos(0, 5),
      pos(0, 6),
      pos(0, 7),
      pos(1, 4),
      pos(2, 4),
      pos(3, 4),
      pos(4, 4),
      pos(5, 4),
      pos(6, 4),
      pos(7, 4),
    ],
  ],
  [
    pos(3, 0),
    [
      pos(3, 1),
      pos(3, 2),
      pos(3, 3),
      pos(3, 4),
      pos(3, 5),
      pos(3, 6),
      pos(3, 7),
      pos(2, 0),
      pos(1, 0),
      pos(0, 0),
      pos(4, 0),
      pos(5, 0),
      pos(6, 0),
      pos(7, 0),
    ],
  ],
  [
    pos(4, 0),
    [
      pos(4, 1),
      pos(4, 2),
      pos(4, 3),
      pos(4, 4),
      pos(4, 5),
      pos(4, 6),
      pos(4, 7),
      pos(3, 0),
      pos(2, 0),
      pos(1, 0),
      pos(0, 0),
      pos(5, 0),
      pos(6, 0),
      pos(7, 0),
    ],
  ],
  [
    pos(3, 7),
    [
      pos(3, 6),
      pos(3, 5),
      pos(3, 4),
      pos(3, 3),
      pos(3, 2),
      pos(3, 1),
      pos(3, 0),
      pos(2, 7),
      pos(1, 7),
      pos(0, 7),
      pos(4, 7),
      pos(5, 7),
      pos(6, 7),
      pos(7, 7),
    ],
  ],
  [
    pos(4, 7),
    [
      pos(4, 6),
      pos(4, 5),
      pos(4, 4),
      pos(4, 3),
      pos(4, 2),
      pos(4, 1),
      pos(4, 0),
      pos(3, 7),
      pos(2, 7),
      pos(1, 7),
      pos(0, 7),
      pos(5, 7),
      pos(6, 7),
      pos(7, 7),
    ],
  ],
  [
    pos(7, 3),
    [
      pos(7, 2),
      pos(7, 1),
      pos(7, 0),
      pos(7, 4),
      pos(7, 5),
      pos(7, 6),
      pos(7, 7),
      pos(6, 3),
      pos(5, 3),
      pos(4, 3),
      pos(3, 3),
      pos(2, 3),
      pos(1, 3),
      pos(0, 3),
    ],
  ],
  [
    pos(7, 4),
    [
      pos(7, 3),
      pos(7, 2),
      pos(7, 1),
      pos(7, 0),
      pos(7, 5),
      pos(7, 6),
      pos(7, 7),
      pos(6, 4),
      pos(5, 4),
      pos(4, 4),
      pos(3, 4),
      pos(2, 4),
      pos(1, 4),
      pos(0, 4),
    ],
  ],
])("Should get movements when in middle corner - %s", (input: Position, output: Position[]) => {
  const board = Board.empty();
  const rook = new Rook(Color.black);
  board.place(rook, input);
  const result = positionsToString(Array.from(rook.movements(board)));
  const expected = positionsToString(output);
  expect(result).toBe(expected);
});

test.each([
  [
    pos(0, 0),
    [
      pos(1, 0),
      pos(2, 0),
      pos(3, 0),
      pos(4, 0),
      pos(5, 0),
      pos(6, 0),
      pos(7, 0),
      pos(0, 1),
      pos(0, 2),
      pos(0, 3),
      pos(0, 4),
      pos(0, 5),
      pos(0, 6),
      pos(0, 7),
    ],
  ],
  [
    pos(7, 0),
    [
      pos(0, 0),
      pos(1, 0),
      pos(2, 0),
      pos(3, 0),
      pos(4, 0),
      pos(5, 0),
      pos(6, 0),
      pos(7, 1),
      pos(7, 2),
      pos(7, 3),
      pos(7, 4),
      pos(7, 5),
      pos(7, 6),
      pos(7, 7),
    ],
  ],
  [
    pos(0, 7),
    [
      pos(1, 7),
      pos(2, 7),
      pos(3, 7),
      pos(4, 7),
      pos(5, 7),
      pos(6, 7),
      pos(7, 7),
      pos(0, 0),
      pos(0, 1),
      pos(0, 2),
      pos(0, 3),
      pos(0, 4),
      pos(0, 5),
      pos(0, 6),
    ],
  ],
  [
    pos(7, 7),
    [
      pos(7, 0),
      pos(7, 1),
      pos(7, 2),
      pos(7, 3),
      pos(7, 4),
      pos(7, 5),
      pos(7, 6),
      pos(0, 7),
      pos(1, 7),
      pos(2, 7),
      pos(3, 7),
      pos(4, 7),
      pos(5, 7),
      pos(6, 7),
    ],
  ],
])("Should get movements when in corner - %s", (input: Position, output: Position[]) => {
  const board = Board.empty();
  const rook = new Rook(Color.black);
  board.place(rook, input);
  const result = positionsToString(Array.from(rook.movements(board)));
  const expected = positionsToString(output);
  expect(result).toBe(expected);
});

test.each([
  [
    pos(2, 2),
    [
      pos(2, 1),
      pos(2, 0),
      pos(1, 2),
      pos(0, 2),
      pos(2, 3),
      pos(2, 4),
      pos(2, 5),
      pos(2, 6),
      pos(2, 7),
      pos(3, 2),
      pos(4, 2),
      pos(5, 2),
      pos(6, 2),
      pos(7, 2),
    ],
  ],
])("Should get movements when in middle of board - %s", (input: Position, output: Position[]) => {
  const board = Board.empty();
  const rook = new Rook(Color.black);
  board.place(rook, input);
  const result = positionsToString(Array.from(rook.movements(board)));
  const expected = positionsToString(output);
  expect(result).toBe(expected);
});

test.each([
  [
    pos(4, 4),
    [pos(4, 2), pos(2, 4)],
    [pos(4, 3), pos(3, 4), pos(4, 5), pos(4, 6), pos(4, 7), pos(5, 4), pos(6, 4), pos(7, 4)],
  ],
])("Should not get movements of allies - %s", (input: Position, allies: Position[], output: Position[]) => {
  const board = Board.empty();
  const rook = new Rook(Color.black);
  board.place(rook, input);

  for (const item of allies) {
    board.place(new Knight(Color.black), item);
  }

  const result = positionsToString(Array.from(rook.movements(board)));
  const expected = positionsToString(output);
  expect(result).toBe(expected);
});

test.each([
  [
    pos(4, 4),
    [pos(4, 2), pos(2, 4)],
    [pos(4, 2), pos(2, 4), pos(4, 3), pos(3, 4), pos(4, 5), pos(4, 6), pos(4, 7), pos(5, 4), pos(6, 4), pos(7, 4)],
  ],
])("Should get movements of enemies - %s", (input: Position, allies: Position[], output: Position[]) => {
  const board = Board.empty();
  const rook = new Rook(Color.black);
  board.place(rook, input);

  for (const item of allies) {
    board.place(new Knight(Color.white), item);
  }

  const result = positionsToString(Array.from(rook.movements(board)));
  const expected = positionsToString(output);
  expect(result).toBe(expected);
});
