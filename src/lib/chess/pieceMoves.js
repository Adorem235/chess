import { COLORS, PIECE_TYPES, PAWN_ROW } from "./constants";

export function canMove(piece, from, to) {
    switch (piece.type) {
      case PIECE_TYPES.PAWN:
        return isValidPawnMove(piece, from, to);
      case PIECE_TYPES.ROOK:
        return isValidRookMove(from, to);
      case PIECE_TYPES.KNIGHT:
        return isValidKnightMove(from, to);
      case PIECE_TYPES.BISHOP:
        return isValidBishopMove(from, to);
      case PIECE_TYPES.QUEEN:
        return isValidQueenMove(from, to);
      case PIECE_TYPES.KING:
        return isValidKingMove(from, to);
      default:
        return false;
    }
  }


export function isValidPawnMove(piece, currentLocation, newLocation) {
    // If the pawn is black
    if(piece.color === COLORS.BLACK) {
    if(currentLocation.row === PAWN_ROW[COLORS.BLACK] && newLocation.row === PAWN_ROW[COLORS.BLACK] + 2 && currentLocation.col === newLocation.col) {
      return true;
    } else if (newLocation.row === currentLocation.row + 1 && newLocation.col === currentLocation.col) {
      return true;
    }
    return false;
    }
    // If the pawn is white
    else{
 
    if(currentLocation.row === PAWN_ROW[COLORS.WHITE] && newLocation.row === PAWN_ROW[COLORS.WHITE] - 2 && currentLocation.col === newLocation.col) {
      return true;
    } else if (newLocation.row === currentLocation.row - 1 && newLocation.col === currentLocation.col) {
      return true;
    }

    }
    return false;
}


export function isValidPawnCapture(piece, currentLocation, newLocation) {
  // If the pawn is black
  if (piece.color === COLORS.BLACK) {
    if (
  newLocation.row === currentLocation.row + 1 &&
  Math.abs(newLocation.col - currentLocation.col) === 1
) {
  return true; // Black pawn capturing diagonally
}
  }
    // If the pawn is white
  else{

    if (newLocation.row === currentLocation.row - 1 && Math.abs(newLocation.col - currentLocation.col) === 1) {
      return true;
    }
  }
  return false;

  }

export function isValidRookMove(currentLocation,newLocation) {
    if( currentLocation.row === newLocation.row || currentLocation.col === newLocation.col) {
      return true;
    }
    return false;
  }


export function isValidKnightMove(currentLocation,newLocation) {
    if (
      (Math.abs(currentLocation.row - newLocation.row) === 2 && Math.abs(currentLocation.col - newLocation.col) === 1) ||
      (Math.abs(currentLocation.row - newLocation.row) === 1 && Math.abs(currentLocation.col - newLocation.col) === 2)
    ) {
      
      return true;
    }
    return false;
  }


export function isValidBishopMove(currentLocation,newLocation) {
    if (
      Math.abs(currentLocation.row - newLocation.row) === Math.abs(currentLocation.col - newLocation.col)
    ) {
      return true;
    }
    return false;
  }


export function isValidQueenMove(currentLocation,newLocation) {
    if (
      isValidRookMove(currentLocation, newLocation) ||
      isValidBishopMove(currentLocation, newLocation)
    ) {
      return true;
    }
    return false;
  }


export function isValidKingMove(currentLocation,newLocation) {
    // Logic specific to king movement
    if (
      Math.abs(currentLocation.row - newLocation.row) <= 1 &&
      Math.abs(currentLocation.col - newLocation.col) <= 1
    ) {
      return true;
    }
    return false;
  }