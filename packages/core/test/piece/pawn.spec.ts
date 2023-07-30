import { beforeEach, describe, expect, test } from "vitest";
import { Color, colorInvert } from "@tschess/shared";
import { Board } from "src/board/board.ts";
import { pos, Position } from "src/position.ts";

function positionsToString(values: Position[]): string {
  return values
    .map((a) => a.toString())
    .sort((a, b) => a.localeCompare(b))
    .join(", ");
}

describe("black pieces - bottom direction", () => {
  let board: Board;

  beforeEach(() => {
    board = Board.empty();
  });

  test.each([
    [pos(0, 1), [pos(0, 2), pos(0, 3)]],
    [pos(1, 1), [pos(1, 2), pos(1, 3)]],
    [pos(2, 1), [pos(2, 2), pos(2, 3)]],
    [pos(3, 1), [pos(3, 2), pos(3, 3)]],
    [pos(4, 1), [pos(4, 2), pos(4, 3)]],
    [pos(5, 1), [pos(5, 2), pos(5, 3)]],
    [pos(6, 1), [pos(6, 2), pos(6, 3)]],
    [pos(7, 1), [pos(7, 2), pos(7, 3)]],
  ])(
    "Should black pieces move to bottom direction (first move) - %s",
    (input: Position, output: Position[]) => {
      const pawn = board.factory.createPawn(Color.black, input);
      const result = Array.from(pawn.movements(board));
      expect(positionsToString(result)).toBe(positionsToString(output));
    }
  );

  test.each([
    [pos(0, 1), [pos(0, 2)]],
    [pos(1, 1), [pos(1, 2)]],
    [pos(2, 1), [pos(2, 2)]],
    [pos(3, 1), [pos(3, 2)]],
    [pos(4, 1), [pos(4, 2)]],
    [pos(5, 1), [pos(5, 2)]],
    [pos(6, 1), [pos(6, 2)]],
    [pos(7, 1), [pos(7, 2)]],
  ])(
    "Should black pieces move to bottom direction - %s",
    (input: Position, output: Position[]) => {
      const pawn = board.factory.createPawn(Color.black, input);
      pawn.incrementMoveCount();
      const result = Array.from(pawn.movements(board));
      expect(positionsToString(result)).toBe(positionsToString(output));
    }
  );

  test.each([
    [pos(0, 1), [pos(1, 2)], [pos(0, 2), pos(0, 3), pos(1, 2)]],
    [
      pos(1, 1),
      [pos(0, 2), pos(2, 2)],
      [pos(1, 2), pos(1, 3), pos(0, 2), pos(2, 2)],
    ],
    [pos(2, 1), [pos(3, 2)], [pos(2, 2), pos(2, 3), pos(3, 2)]],
    [pos(3, 1), [pos(2, 2)], [pos(3, 2), pos(3, 3), pos(2, 2)]],
    [pos(4, 1), [pos(5, 2), pos(7, 2)], [pos(4, 2), pos(4, 3), pos(5, 2)]],
    [pos(5, 1), [pos(6, 2)], [pos(5, 2), pos(5, 3), pos(6, 2)]],
    [pos(6, 1), [pos(5, 0), pos(7, 0)], [pos(6, 2), pos(6, 3)]],
    [pos(7, 1), [pos(6, 2)], [pos(7, 2), pos(7, 3), pos(6, 2)]],
  ])(
    "Should black pieces move to bottom direction and diagonal (first move) - %s",
    (input: Position, enemies: Position[], output: Position[]) => {
      const pawn = board.factory.createPawn(Color.black, input);

      for (const position of enemies) {
        board.factory.createKnight(colorInvert(pawn.color), position);
      }

      const result = Array.from(pawn.movements(board));
      expect(positionsToString(result)).toBe(positionsToString(output));
    }
  );

  test.each([
    [pos(0, 1), [pos(1, 2)], [pos(0, 2), pos(1, 2)]],
    [pos(1, 1), [pos(0, 2), pos(2, 2)], [pos(1, 2), pos(0, 2), pos(2, 2)]],
    [pos(2, 1), [pos(3, 2)], [pos(2, 2), pos(3, 2)]],
    [pos(3, 1), [pos(2, 2)], [pos(3, 2), pos(2, 2)]],
    [pos(4, 1), [pos(5, 2), pos(7, 2)], [pos(4, 2), pos(5, 2)]],
    [pos(5, 1), [pos(6, 2)], [pos(5, 2), pos(6, 2)]],
    [pos(6, 1), [pos(5, 0), pos(7, 0)], [pos(6, 2)]],
    [pos(7, 1), [pos(6, 2)], [pos(7, 2), pos(6, 2)]],
  ])(
    "Should black pieces move to bottom direction and diagonal - %s",
    (input: Position, enemies: Position[], output: Position[]) => {
      const pawn = board.factory.createPawn(Color.black, input);
      pawn.incrementMoveCount();

      for (const item of enemies) {
        board.factory.createKnight(colorInvert(pawn.color), item);
      }

      const result = Array.from(pawn.movements(board));
      expect(positionsToString(result)).toBe(positionsToString(output));
    }
  );

  test.each([
    [pos(0, 1), [pos(1, 2)], [pos(1, 2)]],
    [pos(1, 1), [pos(0, 2), pos(2, 2)], [pos(0, 2), pos(2, 2)]],
    [pos(2, 1), [pos(3, 2)], [pos(3, 2)]],
    [pos(3, 1), [pos(2, 2)], [pos(2, 2)]],
    [pos(4, 1), [pos(5, 2), pos(7, 2)], [pos(5, 2)]],
    [pos(5, 1), [pos(6, 2)], [pos(6, 2)]],
    [pos(6, 1), [pos(5, 0), pos(7, 0)], []],
    [pos(7, 1), [pos(6, 2)], [pos(6, 2)]],
  ])(
    "Should black pieces move diagonal - %s",
    (input: Position, enemies: Position[], output: Position[]) => {
      const pawn = board.factory.createPawn(Color.black, input);
      pawn.incrementMoveCount();

      const newPositionBottom = input.toAdd(0, 1);
      board.factory.createKnight(colorInvert(pawn.color), newPositionBottom);

      for (const item of enemies) {
        board.factory.createKnight(colorInvert(pawn.color), item);
      }

      const result = Array.from(pawn.movements(board));
      expect(positionsToString(result)).toBe(positionsToString(output));
    }
  );
});

// WHITE PIECES - TOP DIRECTION

describe("white pieces - top direction", () => {
  let board: Board;

  beforeEach(() => {
    board = Board.empty();
  });

  test.each([
    [pos(0, 6), [pos(0, 5), pos(0, 4)]],
    [pos(1, 6), [pos(1, 5), pos(1, 4)]],
    [pos(2, 6), [pos(2, 5), pos(2, 4)]],
    [pos(3, 6), [pos(3, 5), pos(3, 4)]],
    [pos(4, 6), [pos(4, 5), pos(4, 4)]],
    [pos(5, 6), [pos(5, 5), pos(5, 4)]],
    [pos(6, 6), [pos(6, 5), pos(6, 4)]],
    [pos(7, 6), [pos(7, 5), pos(7, 4)]],
  ])(
    "Should white pieces move to top direction (first move) - %s",
    (input: Position, output: Position[]) => {
      const pawn = board.factory.createPawn(Color.white, input);
      const result = Array.from(pawn.movements(board));
      expect(positionsToString(result)).toBe(positionsToString(output));
    }
  );

  test.each([
    [pos(0, 6), [pos(0, 5)]],
    [pos(1, 6), [pos(1, 5)]],
    [pos(2, 6), [pos(2, 5)]],
    [pos(3, 6), [pos(3, 5)]],
    [pos(4, 6), [pos(4, 5)]],
    [pos(5, 6), [pos(5, 5)]],
    [pos(6, 6), [pos(6, 5)]],
    [pos(7, 6), [pos(7, 5)]],
  ])(
    "Should white pieces move to top direction - %s",
    (input: Position, output: Position[]) => {
      const pawn = board.factory.createPawn(Color.white, input);
      pawn.incrementMoveCount();
      const result = Array.from(pawn.movements(board));
      expect(positionsToString(result)).toBe(positionsToString(output));
    }
  );

  test.each([
    [pos(0, 6), [pos(1, 5)], [pos(0, 5), pos(0, 4), pos(1, 5)]],
    [pos(1, 6), [pos(0, 7), pos(0, 5)], [pos(1, 5), pos(1, 4), pos(0, 5)]],
    [pos(2, 6), [pos(3, 5)], [pos(2, 5), pos(2, 4), pos(3, 5)]],
    [pos(3, 6), [pos(2, 5)], [pos(3, 5), pos(3, 4), pos(2, 5)]],
    [pos(4, 6), [pos(5, 5), pos(7, 7)], [pos(4, 5), pos(4, 4), pos(5, 5)]],
    [pos(5, 6), [pos(6, 5)], [pos(5, 5), pos(5, 4), pos(6, 5)]],
    [
      pos(6, 6),
      [pos(7, 5), pos(5, 5)],
      [pos(6, 5), pos(6, 4), pos(7, 5), pos(5, 5)],
    ],
    [pos(7, 6), [pos(6, 5)], [pos(7, 5), pos(7, 4), pos(6, 5)]],
  ])(
    "Should white pieces move to top direction and diagonal (first move) - %s",
    (input: Position, enemies: Position[], output: Position[]) => {
      const pawn = board.factory.createPawn(Color.white, input);

      for (const position of enemies) {
        board.factory.createKnight(colorInvert(pawn.color), position);
      }

      const result = Array.from(pawn.movements(board));
      expect(positionsToString(result)).toBe(positionsToString(output));
    }
  );

  test.each([
    [pos(0, 6), [pos(1, 5)], [pos(0, 5), pos(1, 5)]],
    [pos(1, 6), [pos(0, 7), pos(0, 5)], [pos(1, 5), pos(0, 5)]],
    [pos(2, 6), [pos(3, 5)], [pos(2, 5), pos(3, 5)]],
    [pos(3, 6), [pos(2, 5)], [pos(3, 5), pos(2, 5)]],
    [pos(4, 6), [pos(5, 5), pos(7, 7)], [pos(4, 5), pos(5, 5)]],
    [pos(5, 6), [pos(6, 5)], [pos(5, 5), pos(6, 5)]],
    [pos(6, 6), [pos(7, 5), pos(5, 5)], [pos(6, 5), pos(7, 5), pos(5, 5)]],
    [pos(7, 6), [pos(6, 5)], [pos(7, 5), pos(6, 5)]],
  ])(
    "Should white pieces move to top direction and diagonal - %s",
    (input: Position, enemies: Position[], output: Position[]) => {
      const pawn = board.factory.createPawn(Color.white, input);
      pawn.incrementMoveCount();

      for (const item of enemies) {
        board.factory.createKnight(colorInvert(pawn.color), item);
      }

      const result = Array.from(pawn.movements(board));
      expect(positionsToString(result)).toBe(positionsToString(output));
    }
  );

  test.each([
    [pos(0, 6), [pos(1, 5)], [pos(1, 5)]],
    [pos(1, 6), [pos(0, 7), pos(0, 5)], [pos(0, 5)]],
    [pos(2, 6), [pos(3, 5)], [pos(3, 5)]],
    [pos(3, 6), [pos(2, 5)], [pos(2, 5)]],
    [pos(4, 6), [pos(5, 5), pos(7, 7)], [pos(5, 5)]],
    [pos(5, 6), [pos(6, 5)], [pos(6, 5)]],
    [pos(6, 6), [pos(7, 5), pos(5, 5)], [pos(7, 5), pos(5, 5)]],
    [pos(7, 6), [pos(6, 5)], [pos(6, 5)]],
  ])(
    "Should white pieces move to diagonal - %s",
    (input: Position, enemies: Position[], output: Position[]) => {
      const pawn = board.factory.createPawn(Color.white, input);
      pawn.incrementMoveCount();

      const newPositionEnemy = input.toAdd(0, -1);
      board.factory.createPawn(colorInvert(pawn.color), newPositionEnemy);

      for (const item of enemies) {
        board.factory.createBishop(colorInvert(pawn.color), item);
      }

      const result = Array.from(pawn.movements(board));
      expect(positionsToString(result)).toBe(positionsToString(output));
    }
  );
});
