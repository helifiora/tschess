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
  [
    pos(0, 3),
    [
      pos(1, 2),
      pos(2, 1),
      pos(3, 0),
      pos(1, 4),
      pos(2, 5),
      pos(3, 6),
      pos(4, 7),
    ],
  ],
  [
    pos(0, 4),
    [
      pos(1, 3),
      pos(2, 2),
      pos(3, 1),
      pos(4, 0),
      pos(1, 5),
      pos(2, 6),
      pos(3, 7),
    ],
  ],
  [
    pos(3, 0),
    [
      pos(4, 1),
      pos(5, 2),
      pos(6, 3),
      pos(7, 4),
      pos(2, 1),
      pos(1, 2),
      pos(0, 3),
    ],
  ],
  [
    pos(4, 0),
    [
      pos(5, 1),
      pos(6, 2),
      pos(7, 3),
      pos(3, 1),
      pos(2, 2),
      pos(1, 3),
      pos(0, 4),
    ],
  ],
  [
    pos(3, 7),
    [
      pos(4, 6),
      pos(5, 5),
      pos(6, 4),
      pos(7, 3),
      pos(2, 6),
      pos(1, 5),
      pos(0, 4),
    ],
  ],
  [
    pos(4, 7),
    [
      pos(5, 6),
      pos(6, 5),
      pos(7, 4),
      pos(3, 6),
      pos(2, 5),
      pos(1, 4),
      pos(0, 3),
    ],
  ],
  [
    pos(7, 3),
    [
      pos(6, 4),
      pos(5, 5),
      pos(4, 6),
      pos(3, 7),
      pos(6, 2),
      pos(5, 1),
      pos(4, 0),
    ],
  ],
  [
    pos(7, 4),
    [
      pos(6, 5),
      pos(5, 6),
      pos(4, 7),
      pos(6, 3),
      pos(5, 2),
      pos(4, 1),
      pos(3, 0),
    ],
  ],
])(
  "Should get movements when in middle corner - %s",
  (input: Position, output: Position[]) => {
    const bishop = board.factory.createBishop(Color.black, input);
    const result = Array.from(bishop.movements(board));
    expect(positionsToString(result)).toBe(positionsToString(output));
  }
);

test.each([
  [
    pos(0, 0),
    [
      pos(1, 1),
      pos(2, 2),
      pos(3, 3),
      pos(4, 4),
      pos(5, 5),
      pos(6, 6),
      pos(7, 7),
    ],
  ],
  [
    pos(7, 7),
    [
      pos(0, 0),
      pos(1, 1),
      pos(2, 2),
      pos(3, 3),
      pos(4, 4),
      pos(5, 5),
      pos(6, 6),
    ],
  ],
  [
    pos(7, 0),
    [
      pos(0, 7),
      pos(6, 1),
      pos(5, 2),
      pos(4, 3),
      pos(3, 4),
      pos(2, 5),
      pos(1, 6),
    ],
  ],
  [
    pos(0, 7),
    [
      pos(6, 1),
      pos(5, 2),
      pos(4, 3),
      pos(3, 4),
      pos(2, 5),
      pos(1, 6),
      pos(7, 0),
    ],
  ],
])(
  "Should get movements when in corner - %s",
  (input: Position, output: Position[]) => {
    const bishop = board.factory.createBishop(Color.black, input);
    const result = Array.from(bishop.movements(board));
    expect(positionsToString(result)).toBe(positionsToString(output));
  }
);

test.each([
  [
    pos(2, 2),
    [
      pos(1, 1),
      pos(0, 0),
      pos(3, 1),
      pos(4, 0),
      pos(1, 3),
      pos(0, 4),
      pos(3, 3),
      pos(4, 4),
      pos(5, 5),
      pos(6, 6),
      pos(7, 7),
    ],
  ],
  [
    pos(6, 6),
    [
      pos(5, 5),
      pos(4, 4),
      pos(3, 3),
      pos(2, 2),
      pos(1, 1),
      pos(0, 0),
      pos(7, 5),
      pos(5, 7),
      pos(7, 7),
    ],
  ],
  [
    pos(3, 5),
    [
      pos(2, 4),
      pos(1, 3),
      pos(0, 2),
      pos(4, 4),
      pos(5, 3),
      pos(6, 2),
      pos(7, 1),
      pos(2, 6),
      pos(1, 7),
      pos(4, 6),
      pos(5, 7),
    ],
  ],
  [
    pos(4, 2),
    [
      pos(3, 1),
      pos(2, 0),
      pos(5, 1),
      pos(6, 0),
      pos(3, 3),
      pos(2, 4),
      pos(1, 5),
      pos(0, 6),
      pos(5, 3),
      pos(6, 4),
      pos(7, 5),
    ],
  ],
])(
  "Should get movements when in middle of the board - %s",
  (input: Position, output: Position[]) => {
    const bishop = board.factory.createBishop(Color.black, input);
    const result = Array.from(bishop.movements(board));
    expect(positionsToString(result)).toBe(positionsToString(output));
  }
);

test.each([
  [
    pos(2, 2),
    [pos(5, 5), pos(0, 0)],
    [
      pos(1, 1),
      pos(3, 1),
      pos(4, 0),
      pos(1, 3),
      pos(0, 4),
      pos(3, 3),
      pos(4, 4),
    ],
  ],
])(
  "Should not get movements of allies - %s",
  (input: Position, allies: Position[], output: Position[]) => {
    const bishop = board.factory.createBishop(Color.black, input);

    for (const position of allies) {
      board.factory.createRook(bishop.color, position);
    }

    const result = Array.from(bishop.movements(board));
    expect(positionsToString(result)).toBe(positionsToString(output));
  }
);

test.each([
  [
    pos(2, 2),
    [pos(5, 5), pos(0, 0)],
    [
      pos(5, 5),
      pos(0, 0),
      pos(1, 1),
      pos(3, 1),
      pos(4, 0),
      pos(1, 3),
      pos(0, 4),
      pos(3, 3),
      pos(4, 4),
    ],
  ],
])(
  "Should get movements of enemies - %s",
  (input: Position, allies: Position[], output: Position[]) => {
    const bishop = board.factory.createBishop(Color.black, input);

    for (const position of allies) {
      board.factory.createRook(colorInvert(bishop.color), position);
    }

    const result = Array.from(bishop.movements(board));
    expect(positionsToString(result)).toBe(positionsToString(output));
  }
);
