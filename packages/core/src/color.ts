export const enum Color {
  black = "black",
  white = "white"
}

export function colorInvert(color: Color): Color {
  switch (color) {
    case Color.black:
      return Color.white;
    case Color.white:
      return Color.black;
  }
}