import { expect, test } from "vitest";
import { Knight, King } from "src/piece/mod.ts";
import { Color } from "src/color.ts";
import {
  cloneTable,
  createEmptyTable,
  invalidPosition,
  tableMaxValue,
  tableMinValue,
  tablePieceGenerator,
  tablePiecePositionGenerator,
  tablePositionGenerator,
  validPosition,
} from "src/board/table.ts";
import { pos } from "src/position.ts";

test("Should clone all table and pieces", () => {
  const table = createEmptyTable();
  const ref1 = new Knight(Color.black);
  const ref2 = new Knight(Color.white);
  const ref3 = new King(Color.white);
  const ref4 = new King(Color.black);
  table[1][2] = ref1;
  table[1][3] = ref2;
  table[1][4] = ref3;
  table[1][5] = ref4;

  const clone = cloneTable(table);
  expect(clone).not.toBe(table);
  expect(clone[1][2]).not.toBeNull();
  expect(clone[1][3]).not.toBeNull();
  expect(clone[1][4]).not.toBeNull();
  expect(clone[1][5]).not.toBeNull();
  expect(clone[1][2]).not.toBe(ref1);
  expect(clone[1][3]).not.toBe(ref2);
  expect(clone[1][4]).not.toBe(ref3);
  expect(clone[1][5]).not.toBe(ref4);
});

test("Should create an empty table", () => {
  const table = createEmptyTable();
  for (let y = tableMinValue; y <= tableMaxValue; y++) {
    for (let x = tableMinValue; x <= tableMaxValue; x++) {
      expect(table[y][x]).toBeNull();
    }
  }
});

test("Should verify valid position", () => {
  for (let y = tableMinValue; y <= tableMaxValue; y++) {
    for (let x = tableMinValue; x <= tableMaxValue; x++) {
      expect(validPosition(x, y)).toBe(true);
    }
  }
});

test("Should verify invalid position", () => {
  const values: [number, number][] = [
    [-1, 0],
    [8, 0],
    [0, -1],
    [0, 8],
  ];
  for (const [x, y] of values) {
    expect(invalidPosition(x, y)).toBe(true);
  }
});

test("Should generate every position", () => {
  const positions = new Set<string>();
  for (let y = tableMinValue; y <= tableMaxValue; y++) {
    for (let x = tableMinValue; x <= tableMaxValue; x++) {
      positions.add(pos(x, y).toString());
    }
  }

  for (const item of tablePositionGenerator()) {
    if (positions.has(item.toString())) {
      positions.delete(item.toString());
    }
  }

  expect(positions.size).toBe(0);
});

test("Should generate only pieces in the board (with position)", () => {
  const table = createEmptyTable();
  const ref1 = new King(Color.white);
  const ref2 = new Knight(Color.white);
  const ref3 = new King(Color.black);
  const ref4 = new Knight(Color.black);

  table[0][0] = ref1;
  table[1][0] = ref2;
  table[2][0] = ref3;
  table[5][0] = ref4;

  const expectedPieces = new Set([ref1, ref2, ref3, ref4]);
  const expectedPositions = new Set([
    pos(0, 0).toString(),
    pos(0, 1).toString(),
    pos(0, 2).toString(),
    pos(0, 5).toString(),
  ]);

  for (const [piece, position] of tablePiecePositionGenerator(table)) {
    expect(expectedPieces.has(piece)).toBe(true);
    expect(expectedPositions.has(position.toString())).toBe(true);
  }
});

test("Should generate only pieces in the board", () => {
  const table = createEmptyTable();
  const ref1 = new King(Color.white);
  const ref2 = new Knight(Color.white);
  const ref3 = new King(Color.black);
  const ref4 = new Knight(Color.black);

  table[0][0] = ref1;
  table[1][0] = ref2;
  table[2][0] = ref3;
  table[5][0] = ref4;

  const expectedPieces = new Set([ref1, ref2, ref3, ref4]);

  for (const piece of tablePieceGenerator(table)) {
    expect(expectedPieces.has(piece)).toBe(true);
  }
});
