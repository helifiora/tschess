import { Direction } from "./direction.ts";

export const enum Color {
  black = "black",
  white = "white",
}

export function colorInvert(color: Color): Color {
  switch (color) {
    case Color.black:
      return Color.white;
    case Color.white:
      return Color.black;
  }
}

export function colorToDirection(color: Color): Direction {
  switch (color) {
    case Color.black:
      return Direction.bottom;
    case Color.white:
      return Direction.top;
  }
}
