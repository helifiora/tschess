import { expect, test } from "vitest";
import { pos, Position } from "src/position.ts";
import { Board } from "src/board/mod.ts";
import { King } from "../../src/piece/king.ts";
import { Color } from "../../src/color.ts";
import { Rook } from "../../src/piece/rook.ts";
import { Bishop } from "../../src/piece/bishop.ts";

function positionsToString(values: Position[]): string {
  return values
    .map((a) => a.toString())
    .sort((a, b) => a.localeCompare(b))
    .join(", ");
}

test.each([
  [pos(0, 0), [pos(1, 0), pos(1, 1), pos(0, 1)]],
  [pos(7, 0), [pos(6, 0), pos(6, 1), pos(7, 1)]],
  [pos(0, 7), [pos(1, 7), pos(1, 6), pos(0, 6)]],
  [pos(7, 7), [pos(6, 7), pos(6, 6), pos(7, 6)]],
  [pos(3, 0), [pos(2, 0), pos(2, 1), pos(3, 1), pos(4, 1), pos(4, 0)]],
  [pos(3, 7), [pos(2, 7), pos(2, 6), pos(3, 6), pos(4, 6), pos(4, 7)]],
  [pos(0, 3), [pos(0, 2), pos(1, 2), pos(1, 3), pos(1, 4), pos(0, 4)]],
  [pos(7, 3), [pos(7, 2), pos(6, 2), pos(6, 3), pos(6, 4), pos(7, 4)]],
])("Should get movements when in border - %s", (input: Position, output: Position[]) => {
  const board = Board.empty();
  const king = new King(Color.white);
  board.place(king, input);
  const result = Array.from(king.movements(board));
  expect(positionsToString(result)).toBe(positionsToString(output));
});

test.each([
  [pos(1, 1), [pos(0, 0), pos(1, 0), pos(2, 0), pos(0, 1), pos(2, 1), pos(0, 2), pos(1, 2), pos(2, 2)]],
  [pos(6, 6), [pos(5, 5), pos(6, 5), pos(7, 5), pos(5, 6), pos(7, 6), pos(5, 7), pos(6, 7), pos(7, 7)]],
  [pos(5, 3), [pos(4, 2), pos(5, 2), pos(6, 2), pos(4, 3), pos(6, 3), pos(4, 4), pos(5, 4), pos(6, 4)]],
])("Should get movements when is in middle of the board - %s", (input: Position, output: Position[]) => {
  const board = Board.empty();
  const king = new King(Color.white);
  board.place(king, input);
  const result = Array.from(king.movements(board));
  expect(positionsToString(result)).toBe(positionsToString(output));
});

test.each([
  [pos(0, 0), pos(2, 0), [pos(0, 1)]],
  [pos(6, 6), pos(4, 4), [pos(6, 5), pos(7, 5), pos(5, 6), pos(7, 6), pos(5, 7), pos(6, 7), pos(7, 7)]],
])(
  "Should not get movements when it can be intercept by enemy piece - %s",
  (input: Position, enemy: Position, output: Position[]) => {
    const board = Board.empty();
    const king = new King(Color.white);
    board.place(king, input);
    board.place(new King(Color.black), enemy);
    const result = Array.from(king.movements(board));
    expect(positionsToString(result)).toBe(positionsToString(output));
  }
);

test("Should not have movements", () => {
  const board = Board.empty();
  const king = new King(Color.white);
  board.place(king, pos(5, 5));
  board.place(new Rook(Color.black), pos(3, 4));
  board.place(new Rook(Color.black), pos(7, 6));
  board.place(new King(Color.black), pos(3, 5));
  board.place(new Bishop(Color.black), pos(2, 1));
  const result = Array.from(king.movements(board));
  expect(positionsToString(result)).toBe(positionsToString([]));
});
