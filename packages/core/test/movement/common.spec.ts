import { expect, test } from "vitest";
import { Board } from "../../src/board/mod.ts";
import { commonGenerator } from "../../src/movement/common.ts";
import { pos, Position } from "../../src/position.ts";
import { King } from "../../src/piece/king.ts";
import { Color } from "../../src/color.ts";
import { MovementStatus } from "../../src/movement/movement.ts";

function positionsToString(values: Position[]): string {
  return values
    .map((a) => a.toString())
    .sort((a, b) => a.localeCompare(b))
    .join(", ");
}

test("Should generate diagonal line", () => {
  const board = Board.empty();
  board.place(new King(Color.white), pos(0, 0));
  const result = positionsToString(Array.from(commonGenerator(board, pos(0, 0), pos(1, 1))));
  const expected = positionsToString([pos(1, 1), pos(2, 2), pos(3, 3), pos(4, 4), pos(5, 5), pos(6, 6), pos(7, 7)]);
  expect(result).toBe(expected);
});

test("Should generate diagonal line (with pieces)", () => {
  const board = Board.empty();
  board.place(new King(Color.white), pos(7, 0));
  board.place(new King(Color.white), pos(4, 3));
  const result = positionsToString(Array.from(commonGenerator(board, pos(7, 0), pos(-1, 1))));
  const expected = positionsToString([pos(6, 1), pos(5, 2)]);
  expect(result).toBe(expected);
});

test("Should generate horizontal line", () => {
  const board = Board.empty();
  board.place(new King(Color.white), pos(0, 0));
  const result = positionsToString(Array.from(commonGenerator(board, pos(0, 0), pos(1, 0))));
  const expected = positionsToString([pos(1, 0), pos(2, 0), pos(3, 0), pos(4, 0), pos(5, 0), pos(6, 0), pos(7, 0)]);
  expect(result).toBe(expected);
});

test("Should generate horizontal line (with pieces)", () => {
  const board = Board.empty();
  board.place(new King(Color.white), pos(7, 3));
  board.place(new King(Color.white), pos(4, 3));
  const result = positionsToString(Array.from(commonGenerator(board, pos(7, 3), pos(-1, 0))));
  const expected = positionsToString([pos(6, 3), pos(5, 3)]);
  expect(result).toBe(expected);
});

test("Should generate vertical line", () => {
  const board = Board.empty();
  board.place(new King(Color.white), pos(0, 0));
  const result = positionsToString(Array.from(commonGenerator(board, pos(0, 0), pos(0, 1))));
  const expected = positionsToString([pos(0, 1), pos(0, 2), pos(0, 3), pos(0, 4), pos(0, 5), pos(0, 6), pos(0, 7)]);
  expect(result).toBe(expected);
});

test("Should generate vertical line (with pieces)", () => {
  const board = Board.empty();
  board.place(new King(Color.white), pos(2, 7));
  board.place(new King(Color.white), pos(2, 4));
  const result = positionsToString(Array.from(commonGenerator(board, pos(2, 7), pos(0, -1))));
  const expected = positionsToString([pos(2, 6), pos(2, 5)]);
  expect(result).toBe(expected);
});

test("Should generate line and take 3", () => {
  const board = Board.empty();
  board.place(new King(Color.white), pos(0, 0));

  const generator = commonGenerator(board, pos(0, 0), pos(1, 0), {
    take: 3,
  });
  const result = positionsToString(Array.from(generator));
  const expected = positionsToString([pos(1, 0), pos(2, 0), pos(3, 0)]);
  expect(result).toBe(expected);
});

test("Should generate line and change criteria", () => {
  const board = Board.empty();
  board.place(new King(Color.white), pos(0, 0));
  board.place(new King(Color.black), pos(1, 0));
  board.place(new King(Color.black), pos(2, 0));
  board.place(new King(Color.black), pos(3, 0));
  board.place(new King(Color.black), pos(4, 0));
  const generator = commonGenerator(board, pos(0, 0), pos(1, 0), {
    acceptanceFn: (board, origin, target) => {
      if (origin.piece === null || target.piece === null) {
        return MovementStatus.stop;
      }

      return origin.piece.color !== target.piece.color ? MovementStatus.next : MovementStatus.stop;
    },
  });
  const result = positionsToString(Array.from(generator));
  const expected = positionsToString([pos(1, 0), pos(2, 0), pos(3, 0), pos(4, 0)]);
  expect(result).toBe(expected);
});
