import { COLORS } from "./constants";

export function createPiece(color, type, hasMoved = false) {
  return { color, type, hasMoved };
}

export function oppositeColor(color) {
  return color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
}
