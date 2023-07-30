import { Color } from "@tschess/shared";

export const enum Direction {
  top = "top",
  bottom = "bottom",
  both = "both",
}

export function colorToDirection(color: Color): Direction {
  switch (color) {
    case Color.black:
      return Direction.bottom;
    case Color.white:
      return Direction.top;
  }
}
