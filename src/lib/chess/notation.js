import { BOARD_SIZE, PIECE_TYPES, PIECE_LETTERS, FILES } from "./constants";

// Converts a move record (see applyMove in gameRules) to algebraic notation, e.g. Nf3, exd5, O-O, e8=Q+
// Does not yet add disambiguation when two identical pieces can reach the same square (e.g. Nbd2)
export function convertToChessNotation(move){
  //1st rank is where row = 7
  //1st file is where col = 0
  const suffix = move.checkmate ? "#" : move.check ? "+" : "";

  if (move.castle) {
    return (move.castle === "kingside" ? "O-O" : "O-O-O") + suffix;
  }

  // Pawns have no letter, but pawn captures name the file the pawn came from
  const pieceLetter = move.piece === PIECE_TYPES.PAWN && move.captured
    ? FILES[move.from.col]
    : PIECE_LETTERS[move.piece];
  const capture = move.captured ? "x" : "";
  const square = FILES[move.to.col] + (BOARD_SIZE - move.to.row);
  const promotion = move.promotion ? "=" + PIECE_LETTERS[move.promotion] : "";

  return pieceLetter + capture + square + promotion + suffix;
}
