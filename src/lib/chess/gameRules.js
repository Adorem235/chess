import { createPiece } from "./piece";
import { canMove, isValidPawnMove, isValidPawnCapture } from "./pieceMoves";

export function newBoard(){
  const newBoard = Array(8)
        .fill(null)
        .map((_, i) =>
          Array(8)
            .fill(null)
            .map((_, j) => {
              // Initialise black pieces
              if (i === 0) {
                if (j === 0 || j === 7) {
                  return createPiece("black", "rook");
                } else if (j === 1 || j === 6) {
                  return createPiece("black", "knight");
                } else if (j === 2 || j === 5) {
                  return createPiece("black", "bishop");
                } else if (j === 3) {
                  return createPiece("black", "queen");
                } else if (j === 4) {
                  return createPiece("black", "king");
                }
              } else if (i === 1) {
                return createPiece("black", "pawn");
              }
              //initialise white pieces
              else if (i === 6) {
                return createPiece("white", "pawn");
              } else if (i === 7) {
                if (j === 0 || j === 7) {
                  return createPiece("white", "rook");
                } else if (j === 1 || j === 6) {
                  return createPiece("white", "knight");
                } else if (j === 2 || j === 5) {
                  return createPiece("white", "bishop");
                } else if (j === 3) {
                  return createPiece("white", "queen");
                } else if (j === 4) {
                  return createPiece("white", "king");
                }
              }
              return null; // Empty square
            })
        )
        return newBoard;
}

export function isValidMove(board, from, to, piece, prevMove) {
  const targetPiece = board[to.row][to.col];
  const pieceCanMove = canMove(piece, from, to);
  const isSlidingPiece = ["rook", "bishop", "queen"].includes(piece.type);
  const isEmptyDestination = !targetPiece;
  const isEnemy = targetPiece && targetPiece.color !== piece.color;

  if (targetPiece && targetPiece.color === piece.color) return false;

  if (isEnemy) {
    if (
      (isSlidingPiece && pieceCanMove && isPathClear(board, from, to)) ||
      (piece.type === "pawn" && isValidPawnCapture(piece, from, to)) ||
      (piece.type === "king" && pieceCanMove) ||
      (piece.type === "knight" && pieceCanMove)
    ) return true;
  } else if (isEmptyDestination) {
    if(piece.type === "king" && Math.abs(to.col - from.col) == 2){
      if (canCastle(board, piece.color, from, to)){
        return true;
      }
    }
    if (
      (isSlidingPiece && pieceCanMove && isPathClear(board, from, to)) ||
      (piece.type === "pawn" && isValidPawnMove(piece, from, to) && isPathClear(board, from, to)) ||
      (["king", "knight"].includes(piece.type) && pieceCanMove)
    ) return true;

    if (
      piece.type === "pawn" &&
      enPassant(board, piece, to, from, prevMove)
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


 export function simulateMove(board, from, to){
  // Pieces are never mutated, so copying the rows is enough
  const clonedBoard = board.map(row => [...row]);

  const movingPiece = clonedBoard[from.row][from.col];

  // A pawn moving diagonally onto an empty square is en passant: remove the captured pawn
  if (
    movingPiece &&
    movingPiece.type === "pawn" &&
    from.col !== to.col &&
    !clonedBoard[to.row][to.col]
  ) {
    clonedBoard[from.row][to.col] = null;
  }

  clonedBoard[to.row][to.col] = movingPiece;
  clonedBoard[from.row][from.col] = null;

   return clonedBoard;


  }

 export function isCheck(board, color) {
  const kingLocation = findKing(board, color);
  if (!kingLocation) {
    console.log("King not found!");
    return false;
  }

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;

      if (piece.color !== color) {
        const from = { row, col };
        const to = { row: kingLocation.row, col: kingLocation.col };
        const type = piece.type;

        const canThreaten =
          (type === "knight" && canMove(piece, from, to)) ||
          (type === "pawn" && isValidPawnCapture(piece, from, to)) ||
          (["rook", "bishop", "queen"].includes(type) &&
            canMove(piece, from, to) &&
            isPathClear(board, from, to)) ||
          (type === "king" && canMove(piece, from, to));

        if (canThreaten) {
          return true;
        }
      }
    }
  }

  return false;
}


export function findKing(board, color) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (
        piece &&
        piece.type === "king" &&
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
  const row = color === "white" ? 7 : 0;
  const kingStart = board[row][4];

  const kingsideRook = board[row][7];
  const queensideRook = board[row][0];

  const direction = to.col < from.col ? "queenside" : "kingside";

  const rook = direction === "kingside" ? kingsideRook : queensideRook;
  const rookCol = direction === "kingside" ? 7 : 0;
  const pathCols = direction === "kingside" ? [5, 6] : [3, 2];
  // The king's own square is already covered by the isCheck call above
  const castleCols = direction === "kingside" ? [5, 6] : [3, 2];

  // Check the king and rook haven't moved
  if (!kingStart || !rook) return false;
  if (kingStart.type !== "king" || rook.type !== "rook") return false;
  if (kingStart.hasMoved || rook.hasMoved) return false;

  // Check the path between king and rook is clear
  for (let col of pathCols) {
    if (board[row][col]) return false; // space is occupied
  }

  // Simulate king's path to make sure it's not through check
  for (let col of castleCols) {
    const testBoard = simulateMove(board, { row, col: 4 }, { row, col });
    if (isCheck(testBoard, color)) {
      return false;
    }
  }

  // Check if entire path is clear (including between king and rook)
  if (
    isPathClear(board, { row, col: rookCol }, { row, col: 4 }) // rook to king
  ) {
    return true;
  }

  return false;
}

export function checkForCheckmate(board, color, prevMove) {
  if (isCheck(board, color)) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (!piece || piece.color !== color) continue;

        const moves = getAllPossibleMoves(board, piece, { row, col }, prevMove);
        for (const move of moves) {
          const testBoard = simulateMove(board, { row, col }, move);
          if (!isCheck(testBoard, color)) {
            return false; // Found a move that gets out of check
          }
        }
      }
    }
    return true; // No valid moves, and still in check — checkmate
  }
  return false; // Not in check, so can't be checkmate
}


export function getAllPossibleMoves(board, piece, startLocation, prevMove){
  let moveList = [];
  for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        let destination = {row, col}
        // isValidMove covers captures, castling and en passant; canMove alone would skip pawn captures
        if(isValidMove(board, startLocation, destination, piece, prevMove)){
          moveList.push({row,col})

        }

      }
    }
    return moveList;

}

export function checkForStalemate(board, color, prevMove) {
  if (isCheck(board, color)) {
    return false; // If the player is in check, it's not stalemate
  }

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      const startLocation = { row, col };

      if (piece && piece.color === color) {
        const moves = getAllPossibleMoves(board, piece, startLocation, prevMove);

        for (const move of moves) {
          const simulated = simulateMove(board, startLocation, move);
          if (!isCheck(simulated, color)) {
            return false; // Found a legal move — not stalemate
          }
        }
      }
    }
  }

  return true; // No legal moves and not in check = stalemate
}


export function enPassant(board, piece, to, from, prevMove) {
  if (
    !prevMove ||
    piece.type !== "pawn" ||
    !isValidPawnCapture(piece, from, to)
  ) {
    return false;
  }

  const lastMovedPieceWasPawn = prevMove.piece === "pawn";
  const opponentColor = piece.color === "white" ? "black" : "white";
  const correctColor = prevMove.color === opponentColor;
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

export function convertToChessNotation(move){
  var convertedMove;
  var pieceType;
  var square = {row: "", col:""};
  var mofifier;
  switch(move.piece){
    case 'pawn':
        pieceType = '';
        break;
      case 'rook':
       pieceType = 'R';
       break;
      case 'knight':
        pieceType = 'N';
        break;
      case 'bishop':
       pieceType = 'B';
       break;
      case 'queen':
        pieceType = 'Q';
        break;
      case 'king':
        pieceType = 'K'
  }
  switch(move.to.row){
    case 0 :
      square.row = "8"
      break;
    case 1 :
      square.row = "7"
      break;
    case 2 :
      square.row = "6"
      break;
    case 3 :
      square.row = "5"
      break;
    case 4 :
      square.row = "4"
      break;
    case 5 :
      square.row = "3"
      break;
    case 6 :
      square.row = "2"
      break;
    case 7 :
      square.row = "1"
  }
  switch(move.to.col){
    case 0 :
      square.col = "a"
      break;
    case 1 :
      square.col = "b"
      break;
    case 2 :
      square.col = "c"
      break;
    case 3 :
      square.col = "d"
      break;
    case 4 :
      square.col = "e"
      break;
    case 5 :
      square.col = "f"
      break;
    case 6 :
      square.col = "g"
      break;
    case 7 :
      square.col = "h"
  }
  convertedMove = pieceType + square.col + square.row
  return convertedMove
  //1st rank is where row = 7
  //1st file os where col = 0
}

