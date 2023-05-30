import { Color } from "./color.ts";

export const enum Direction {
  top = "top",
  bottom = "bottom",
  both = "both",
}

export function fromColor(color: Color): Direction {
  switch (color) {
    case Color.black:
      return Direction.bottom;
    case Color.white:
      return Direction.top;
  }
}
