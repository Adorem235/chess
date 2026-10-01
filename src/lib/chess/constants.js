export const COLORS = Object.freeze({
  WHITE: "white",
  BLACK: "black",
});

export const PIECE_TYPES = Object.freeze({
  PAWN: "pawn",
  ROOK: "rook",
  KNIGHT: "knight",
  BISHOP: "bishop",
  QUEEN: "queen",
  KING: "king",
});

const { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING } = PIECE_TYPES;

// Pieces that move any distance in a line and can be blocked
export const SLIDING_PIECES = Object.freeze([ROOK, BISHOP, QUEEN]);

export const PROMOTION_PIECES = Object.freeze([QUEEN, ROOK, BISHOP, KNIGHT]);

export const BOARD_SIZE = 8;

// Row 0 is the 8th rank (black's side), row 7 is the 1st rank (white's side)
export const HOME_ROW = Object.freeze({
  [COLORS.WHITE]: 7,
  [COLORS.BLACK]: 0,
});

export const PAWN_ROW = Object.freeze({
  [COLORS.WHITE]: 6,
  [COLORS.BLACK]: 1,
});

// Back rank piece order from column 0 (a-file) to column 7 (h-file)
export const BACK_RANK_ORDER = Object.freeze([
  ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK,
]);

export const KING_START_COL = 4;

export const CASTLING = Object.freeze({
  kingside: Object.freeze({ kingTo: 6, rookFrom: 7, rookTo: 5, kingPath: [5, 6] }),
  queenside: Object.freeze({ kingTo: 2, rookFrom: 0, rookTo: 3, kingPath: [3, 2] }),
});

// Pawns have no letter in algebraic notation
export const PIECE_LETTERS = Object.freeze({
  [PAWN]: "",
  [ROOK]: "R",
  [KNIGHT]: "N",
  [BISHOP]: "B",
  [QUEEN]: "Q",
  [KING]: "K",
});

export const FILES = Object.freeze(["a", "b", "c", "d", "e", "f", "g", "h"]);
