import { expect, test } from "vitest";
import { Color } from "@tschess/shared";
import { King } from "src/piece/king.ts";
import { Table } from "src/board/table.ts";
import { pos } from "src/position.ts";
import { Knight } from "src/piece/knight.ts";

test("Should clone all table and pieces", () => {
  const table = Table.empty();
  const ref1 = new Knight(Color.black, pos(2, 1));
  const ref2 = new Knight(Color.white, pos(3, 1));
  const ref3 = new King(Color.white, pos(4, 1));
  const ref4 = new King(Color.black, pos(5, 1));
  table.put(ref1, pos(2, 1));
  table.put(ref2, pos(3, 1));
  table.put(ref3, pos(4, 1));
  table.put(ref4, pos(5, 1));

  const clone = table.clone();
  expect(clone).not.toBe(table);
  expect(clone.get(pos(2, 1))).not.toBeNull();
  expect(clone.get(pos(3, 1))).not.toBeNull();
  expect(clone.get(pos(4, 1))).not.toBeNull();
  expect(clone.get(pos(5, 1))).not.toBeNull();
  expect(clone.get(pos(2, 1))).not.toBe(ref1);
  expect(clone.get(pos(3, 1))).not.toBe(ref2);
  expect(clone.get(pos(4, 1))).not.toBe(ref3);
  expect(clone.get(pos(5, 1))).not.toBe(ref4);
});

test("Should create an empty table", () => {
  const table = Table.empty();
  for (let y = Table.minValue; y <= Table.maxValue; y++) {
    for (let x = Table.minValue; x <= Table.maxValue; x++) {
      expect(table.get(pos(x, y))).toBeNull();
    }
  }
});

test("Should verify valid position", () => {
  for (let y = Table.minValue; y <= Table.maxValue; y++) {
    for (let x = Table.minValue; x <= Table.maxValue; x++) {
      expect(Table.isValid(x, y)).toBe(true);
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
    expect(Table.isInvalid(x, y)).toBe(true);
  }
});

test("Should generate every position", () => {
  const positions = new Set<string>();
  for (let y = Table.minValue; y <= Table.maxValue; y++) {
    for (let x = Table.minValue; x <= Table.maxValue; x++) {
      positions.add(pos(x, y).toString());
    }
  }

  for (const item of Table.generatePosition()) {
    if (positions.has(item.toString())) {
      positions.delete(item.toString());
    }
  }

  expect(positions.size).toBe(0);
});

test("Should generate only pieces in the board (with position)", () => {
  const table = Table.empty();
  const ref1 = new King(Color.white, pos(0, 0));
  const ref2 = new Knight(Color.white, pos(0, 1));
  const ref3 = new King(Color.black, pos(0, 2));
  const ref4 = new Knight(Color.black, pos(0, 5));

  table.put(ref1, pos(0, 0));
  table.put(ref2, pos(0, 1));
  table.put(ref3, pos(0, 2));
  table.put(ref4, pos(0, 5));

  const expectedPieces = new Set([ref1, ref2, ref3, ref4]);
  const expectedPositions = new Set([
    pos(0, 0).toString(),
    pos(0, 1).toString(),
    pos(0, 2).toString(),
    pos(0, 5).toString(),
  ]);

  for (const piece of table.generatePiece()) {
    expect(expectedPieces.has(piece)).toBe(true);
    expect(expectedPositions.has(piece.position.toString())).toBe(true);
  }
});

test("Should generate only pieces in the board", () => {
  const table = Table.empty();
  const ref1 = new King(Color.white, pos(0, 0));
  const ref2 = new Knight(Color.white, pos(1, 0));
  const ref3 = new King(Color.black, pos(2, 0));
  const ref4 = new Knight(Color.black, pos(5, 0));

  table.put(ref1, pos(0, 0));
  table.put(ref2, pos(1, 0));
  table.put(ref3, pos(2, 0));
  table.put(ref4, pos(5, 0));

  const expectedPieces = new Set([ref1, ref2, ref3, ref4]);

  for (const piece of table.generatePiece()) {
    expect(expectedPieces.has(piece)).toBe(true);
  }
});
