import { test, expect, describe } from "vitest";
import { filter, map, toArray } from "../src/generator";

describe("map", () => {
  test("should map collection from lower to uppercase", () => {
    const names = ["ana", "del", "gray", "ruben", "nunes"];
    const upperCase = map<string, string>((n) => n.toUpperCase());
    const result = toArray()(upperCase(names));
    expect(result).toEqual(["ANA", "DEL", "GRAY", "RUBEN", "NUNES"]);
  });

  test("should map collection from object to boolean", () => {
    const people = [{ age: 18 }, { age: 60 }, { age: 90 }, { age: 54 }];

    const canRetire = map<{ age: number }, boolean>((p) => p.age > 55);
    const result = toArray()(canRetire(people));
    expect(result).toEqual([false, true, true, false]);
  });

  test("should combine filter and map with object collection using condition", () => {
    const people = [
      { name: "Heli", age: 18 },
      { name: "Elton", age: 60 },
      { name: "Anto", age: 90 },
      { name: "Nio", age: 54 },
    ];

    const canRetire = filter<{ name: string; age: number }>((p) => p.age > 55);
    const mapRetires = map<{ name: string; age: number }, string>((p) =>
      p.name.toUpperCase()
    );

    const result = toArray()(mapRetires(canRetire(people)));
    expect(result).toEqual(["ELTON", "ANTO"]);
  });
});
