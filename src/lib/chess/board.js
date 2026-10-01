import { createPiece } from "./piece";
import { COLORS, PIECE_TYPES, BOARD_SIZE, HOME_ROW, PAWN_ROW, BACK_RANK_ORDER } from "./constants";

export function newBoard(){
  return Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, col) => {
      for (const color of [COLORS.WHITE, COLORS.BLACK]) {
        if (row === HOME_ROW[color]) return createPiece(color, BACK_RANK_ORDER[col]);
        if (row === PAWN_ROW[color]) return createPiece(color, PIECE_TYPES.PAWN);
      }
      return null; // Empty square
    })
  );
}
