import { createPiece, oppositeColor } from "./piece";
import { canMove, isValidPawnMove, isValidPawnCapture } from "./pieceMoves";
import { PIECE_TYPES, SLIDING_PIECES, BOARD_SIZE, HOME_ROW, KING_START_COL, CASTLING } from "./constants";



export function isValidMove(board, from, to, piece, prevMove) {
  const targetPiece = board[to.row][to.col];
  const pieceCanMove = canMove(piece, from, to);
  const isSlidingPiece = SLIDING_PIECES.includes(piece.type);
  const isEmptyDestination = !targetPiece;
  const isEnemy = targetPiece && targetPiece.color !== piece.color;

  if (targetPiece && targetPiece.color === piece.color) return false;

  if (isEnemy) {
    if (
      (isSlidingPiece && pieceCanMove && isPathClear(board, from, to)) ||
      (piece.type === PIECE_TYPES.PAWN && isValidPawnCapture(piece, from, to)) ||
      (piece.type === PIECE_TYPES.KING && pieceCanMove) ||
      (piece.type === PIECE_TYPES.KNIGHT && pieceCanMove)
    ) return true;
  } else if (isEmptyDestination) {
    // Castling: the king moves two columns along its own home row
    if (isCastlingMove(piece, from, to) && from.row === HOME_ROW[piece.color] && to.row === from.row) {
      if (canCastle(board, piece.color, from, to)){
        return true;
      }
    }
    if (
      (isSlidingPiece && pieceCanMove && isPathClear(board, from, to)) ||
      (piece.type === PIECE_TYPES.PAWN && isValidPawnMove(piece, from, to) && isPathClear(board, from, to)) ||
      ([PIECE_TYPES.KING, PIECE_TYPES.KNIGHT].includes(piece.type) && pieceCanMove)
    ) return true;

    if (
      piece.type === PIECE_TYPES.PAWN &&
      enPassant(piece, from, to, prevMove)
    ) return true;
  }

  return false;
}



 export function isPathClear(board, from, to) {
    const dRow = Math.sign(to.row - from.row);
    const dCol = Math.sign(to.col - from.col);

    let currRow = from.row + dRow;
    let currCol = from.col + dCol;

    while (currRow !== to.row || currCol !== to.col) {
      if (board[currRow][currCol]) {
        return false; // There is a piece in the way
      }
      currRow += dRow;
      currCol += dCol;
    }
    return true;
  }


// Returns the board after a move, without the move record. Used to test "what if" positions.
export function simulateMove(board, from, to){
  return applyMove(board, from, to).board;
}

function isCastlingMove(piece, from, to) {
  return piece.type === PIECE_TYPES.KING && Math.abs(to.col - from.col) === 2;
}

// A pawn moving diagonally onto an empty square can only be en passant
function isEnPassantCapture(board, from, to) {
  const piece = board[from.row][from.col];
  return piece.type === PIECE_TYPES.PAWN && from.col !== to.col && !board[to.row][to.col];
}

export function isPromotionMove(piece, to) {
  return piece.type === PIECE_TYPES.PAWN && to.row === HOME_ROW[oppositeColor(piece.color)];
}

// Plays a move that has already been validated. Never modifies the board passed in.
// Returns the new board and a record describing the move.
// Without a promotionType a promoting pawn stays a pawn, which lets the UI show it while the player chooses.
export function applyMove(board, from, to, promotionType = null) {
  const piece = board[from.row][from.col];
  const nextBoard = board.map(row => [...row]);

  const enPassantCapture = isEnPassantCapture(board, from, to);
  const captured = enPassantCapture ? board[from.row][to.col] : board[to.row][to.col];
  const promotion = promotionType && isPromotionMove(piece, to) ? promotionType : null;

  nextBoard[from.row][from.col] = null;
  nextBoard[to.row][to.col] = createPiece(piece.color, promotion ?? piece.type, true);

  if (enPassantCapture) {
    nextBoard[from.row][to.col] = null;
  }

  let castle = null;
  if (isCastlingMove(piece, from, to)) {
    castle = to.col === CASTLING.kingside.kingTo ? "kingside" : "queenside";
    const { rookFrom, rookTo } = CASTLING[castle];
    const rook = board[from.row][rookFrom];
    nextBoard[from.row][rookTo] = createPiece(rook.color, rook.type, true);
    nextBoard[from.row][rookFrom] = null;
  }

  const move = {
    piece: piece.type,
    color: piece.color,
    from,
    to,
    captured: captured ? captured.type : null,
    castle,
    promotion,
  };

  return { board: nextBoard, move };
}

 export function isCheck(board, color) {
  const kingLocation = findKing(board, color);
  if (!kingLocation) {
    return false;
  }

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (!piece) continue;

      if (piece.color !== color) {
        const from = { row, col };
        const to = { row: kingLocation.row, col: kingLocation.col };
        const type = piece.type;

        const canThreaten =
          (type === PIECE_TYPES.KNIGHT && canMove(piece, from, to)) ||
          (type === PIECE_TYPES.PAWN && isValidPawnCapture(piece, from, to)) ||
          (SLIDING_PIECES.includes(type) &&
            canMove(piece, from, to) &&
            isPathClear(board, from, to)) ||
          (type === PIECE_TYPES.KING && canMove(piece, from, to));

        if (canThreaten) {
          return true;
        }
      }
    }
  }

  return false;
}


export function findKing(board, color) {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (
        piece &&
        piece.type === PIECE_TYPES.KING &&
        piece.color === color
      ) {
        return { row, col };
      }
    }
  }
  return null; // King not found
}

export function canCastle(board, color, from, to) {
  if(isCheck(board, color)){
    return false;
  }
  const row = HOME_ROW[color];
  const kingStart = board[row][KING_START_COL];

  const side = to.col < from.col ? CASTLING.queenside : CASTLING.kingside;

  const rook = board[row][side.rookFrom];
  // Check the king and rook haven't moved
  if (!kingStart || !rook) return false;
  if (kingStart.type !== PIECE_TYPES.KING || rook.type !== PIECE_TYPES.ROOK) return false;
  if (kingStart.hasMoved || rook.hasMoved) return false;

  // Every square between king and rook must be empty (includes the b-file on the queenside)
  if (!isPathClear(board, { row, col: side.rookFrom }, { row, col: KING_START_COL })) return false;

  // Simulate king's path to make sure it's not through check
  for (let col of side.kingPath) {
    const testBoard = simulateMove(board, { row, col: KING_START_COL }, { row, col });
    if (isCheck(testBoard, color)) {
      return false;
    }
  }


  return true;
}

export function checkForCheckmate(board, color, prevMove) {
  return isCheck(board, color) && !hasAnyLegalMove(board, color, prevMove);
}

export function checkForStalemate(board, color, prevMove) {
  return !isCheck(board, color) && !hasAnyLegalMove(board, color, prevMove);
}

export function hasAnyLegalMove(board, color, prevMove) {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (!piece || piece.color !== color) continue;

      if (getLegalMoves(board, piece, { row, col }, prevMove).length > 0) {
        return true;
      }
    }
  }
  return false;
}


export function getAllPossibleMoves(board, piece, startLocation, prevMove){
  let moveList = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        let destination = {row, col}
        // isValidMove covers captures, castling and en passant; canMove alone would skip pawn captures
        if(isValidMove(board, startLocation, destination, piece, prevMove)){
          moveList.push({row,col})

        }

      }
    }
    return moveList;

}

// Possible moves that don't leave the player's own king in check
export function getLegalMoves(board, piece, startLocation, prevMove){
  return getAllPossibleMoves(board, piece, startLocation, prevMove).filter(
    move => !isCheck(simulateMove(board, startLocation, move), piece.color)
  );
}


export function enPassant(piece, from, to, prevMove) {
  if (
    !prevMove ||
    piece.type !== PIECE_TYPES.PAWN ||
    !isValidPawnCapture(piece, from, to)
  ) {
    return false;
  }

  const lastMovedPieceWasPawn = prevMove.piece === PIECE_TYPES.PAWN;
  const correctColor = prevMove.color === oppositeColor(piece.color);
  const movedTwoSquares = Math.abs(prevMove.from.row - prevMove.to.row) === 2;

  const sameRow = from.row === prevMove.to.row;
  const sameCol = to.col === prevMove.to.col;

  if (
    lastMovedPieceWasPawn &&
    correctColor &&
    movedTwoSquares &&
    sameRow &&
    sameCol
  ) {
    return true;
  }

  return false;
}
