import { beforeEach, expect, test } from "vitest";
import { pos, Position } from "src/position.ts";
import { Board } from "src/board/board.ts";
import { Color, colorInvert } from "@tschess/shared";

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

test.each([
  [pos(0, 0), [pos(1, 0), pos(1, 1), pos(0, 1)]],
  [pos(7, 0), [pos(6, 0), pos(6, 1), pos(7, 1)]],
  [pos(0, 7), [pos(1, 7), pos(1, 6), pos(0, 6)]],
  [pos(7, 7), [pos(6, 7), pos(6, 6), pos(7, 6)]],
  [pos(3, 0), [pos(2, 0), pos(2, 1), pos(3, 1), pos(4, 1), pos(4, 0)]],
  [pos(3, 7), [pos(2, 7), pos(2, 6), pos(3, 6), pos(4, 6), pos(4, 7)]],
  [pos(0, 3), [pos(0, 2), pos(1, 2), pos(1, 3), pos(1, 4), pos(0, 4)]],
  [pos(7, 3), [pos(7, 2), pos(6, 2), pos(6, 3), pos(6, 4), pos(7, 4)]],
])(
  "Should get movements when in border - %s",
  (input: Position, output: Position[]) => {
    const king = board.factory.createKing(Color.black, input);
    const result = Array.from(king.movements(board));
    expect(positionsToString(result)).toBe(positionsToString(output));
  }
);

test.each([
  [
    pos(1, 1),
    [
      pos(0, 0),
      pos(1, 0),
      pos(2, 0),
      pos(0, 1),
      pos(2, 1),
      pos(0, 2),
      pos(1, 2),
      pos(2, 2),
    ],
  ],
  [
    pos(6, 6),
    [
      pos(5, 5),
      pos(6, 5),
      pos(7, 5),
      pos(5, 6),
      pos(7, 6),
      pos(5, 7),
      pos(6, 7),
      pos(7, 7),
    ],
  ],
  [
    pos(5, 3),
    [
      pos(4, 2),
      pos(5, 2),
      pos(6, 2),
      pos(4, 3),
      pos(6, 3),
      pos(4, 4),
      pos(5, 4),
      pos(6, 4),
    ],
  ],
])(
  "Should get movements when is in middle of the board - %s",
  (input: Position, output: Position[]) => {
    const king = board.factory.createKing(Color.black, input);
    const result = Array.from(king.movements(board));
    expect(positionsToString(result)).toBe(positionsToString(output));
  }
);

test.each([
  [pos(0, 0), pos(2, 0), [pos(0, 1)]],
  [
    pos(6, 6),
    pos(4, 4),
    [
      pos(6, 5),
      pos(7, 5),
      pos(5, 6),
      pos(7, 6),
      pos(5, 7),
      pos(6, 7),
      pos(7, 7),
    ],
  ],
])(
  "Should not get movements when it can be intercept by enemy piece - %s",
  (input: Position, enemy: Position, output: Position[]) => {
    const king = board.factory.createKing(Color.black, input);

    board.factory.createKing(colorInvert(king.color), enemy);

    const result = Array.from(king.movements(board));
    expect(positionsToString(result)).toBe(positionsToString(output));
  }
);

test("Should not have movements", () => {
  const king = board.factory.createKing(Color.black, pos(5, 5));
  const enemyColor = colorInvert(king.color);
  board.factory.createRook(enemyColor, pos(3, 4));
  board.factory.createRook(enemyColor, pos(7, 6));
  board.factory.createKing(enemyColor, pos(3, 5));
  board.factory.createBishop(enemyColor, pos(2, 1));
  const result = Array.from(king.movements(board));

  expect(positionsToString(result)).toBe(positionsToString([]));
});
