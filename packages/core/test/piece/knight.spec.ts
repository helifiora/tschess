import { beforeEach, expect, test } from "vitest";
import { pos, Position } from "src/position";
import { Board } from "src/board/mod";
import { Color, colorInvert } from "src/color";

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
  [pos(0, 3), [pos(1, 1), pos(1, 5), pos(2, 2), pos(2, 4)]],
  [pos(0, 4), [pos(1, 2), pos(1, 6), pos(2, 3), pos(2, 5)]],
  [pos(3, 0), [pos(1, 1), pos(5, 1), pos(2, 2), pos(4, 2)]],
  [pos(4, 0), [pos(2, 1), pos(6, 1), pos(3, 2), pos(5, 2)]],
  [pos(3, 7), [pos(1, 6), pos(5, 6), pos(2, 5), pos(4, 5)]],
  [pos(4, 7), [pos(2, 6), pos(6, 6), pos(3, 5), pos(5, 5)]],
  [pos(7, 3), [pos(6, 1), pos(6, 5), pos(5, 2), pos(5, 4)]],
  [pos(7, 4), [pos(6, 2), pos(6, 6), pos(5, 3), pos(5, 5)]],
])(
  "Should get movements when in middle corner position - %s",
  (input: Position, output: Position[]) => {
    const knight = board.factory.createKnight(Color.white, input);
    const result = Array.from(knight.movements(board));
    expect(positionsToString(result)).toBe(positionsToString(output));
  }
);

test.each([
  [pos(0, 0), [pos(1, 2), pos(2, 1)]],
  [pos(7, 0), [pos(5, 1), pos(6, 2)]],
  [pos(0, 7), [pos(2, 6), pos(1, 5)]],
  [pos(7, 7), [pos(6, 5), pos(5, 6)]],
])(
  "Should get movements when in corner position - %s",
  (input: Position, output: Position[]) => {
    const knight = board.factory.createKnight(Color.white, input);
    const result = Array.from(knight.movements(board));
    expect(positionsToString(result)).toBe(positionsToString(output));
  }
);

test.each([
  [
    pos(2, 2),
    [
      pos(1, 0),
      pos(0, 1),
      pos(3, 0),
      pos(0, 3),
      pos(4, 1),
      pos(4, 3),
      pos(1, 4),
      pos(3, 4),
    ],
  ],
  [
    pos(5, 5),
    [
      pos(4, 3),
      pos(6, 3),
      pos(3, 4),
      pos(7, 4),
      pos(3, 6),
      pos(7, 6),
      pos(4, 7),
      pos(6, 7),
    ],
  ],
  [
    pos(4, 3),
    [
      pos(3, 1),
      pos(5, 1),
      pos(2, 2),
      pos(6, 2),
      pos(2, 4),
      pos(6, 4),
      pos(3, 5),
      pos(5, 5),
    ],
  ],
])(
  "Should get all movements when knight is in middle of the board - %s",
  (input: Position, output: Position[]) => {
    const knight = board.factory.createKnight(Color.white, input);
    const result = Array.from(knight.movements(board));
    expect(positionsToString(result)).toBe(positionsToString(output));
  }
);

test.each([
  [
    pos(2, 2),
    [pos(4, 1), pos(0, 1)],
    [pos(1, 0), pos(3, 0), pos(0, 3), pos(4, 3), pos(1, 4), pos(3, 4)],
  ],
  [
    pos(5, 5),
    [pos(6, 3), pos(7, 4), pos(6, 7), pos(4, 7)],
    [pos(4, 3), pos(3, 4), pos(3, 6), pos(7, 6)],
  ],
  [
    pos(4, 3),
    [pos(6, 4)],
    [
      pos(3, 1),
      pos(5, 1),
      pos(2, 2),
      pos(6, 2),
      pos(2, 4),
      pos(3, 5),
      pos(5, 5),
    ],
  ],
])(
  "Should not get movements os allies position - %s",
  (input: Position, allies: Position[], output: Position[]) => {
    const knight = board.factory.createKnight(Color.white, input);

    for (const position of allies) {
      board.factory.createKnight(knight.color, position);
    }

    const result = Array.from(knight.movements(board));
    expect(positionsToString(result)).toBe(positionsToString(output));
  }
);

test.each([
  [
    pos(2, 2),
    [pos(1, 0), pos(3, 0), pos(0, 3)],
    [
      pos(1, 0),
      pos(0, 1),
      pos(3, 0),
      pos(0, 3),
      pos(4, 1),
      pos(4, 3),
      pos(1, 4),
      pos(3, 4),
    ],
  ],
  [
    pos(5, 5),
    [pos(4, 3), pos(3, 4), pos(7, 4), pos(3, 6)],
    [
      pos(4, 3),
      pos(6, 3),
      pos(3, 4),
      pos(7, 4),
      pos(3, 6),
      pos(7, 6),
      pos(4, 7),
      pos(6, 7),
    ],
  ],
  [
    pos(4, 3),
    [pos(2, 2), pos(6, 4), pos(3, 5)],
    [
      pos(3, 1),
      pos(5, 1),
      pos(2, 2),
      pos(6, 2),
      pos(2, 4),
      pos(6, 4),
      pos(3, 5),
      pos(5, 5),
    ],
  ],
])(
  "Should get movements of enemies position - %s",
  (input: Position, enemies: Position[], output: Position[]) => {
    const knight = board.factory.createKnight(Color.white, input);

    for (const other of enemies) {
      board.factory.createKnight(colorInvert(knight.color), other);
    }

    const result = Array.from(knight.movements(board));
    expect(positionsToString(result)).toBe(positionsToString(output));
  }
);
