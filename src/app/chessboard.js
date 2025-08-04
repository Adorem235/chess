"use client";
import React, { useState } from "react";
import Square from "./square";
import Piece from "./piece";

export default function Chessboard() {
  // Initialize an 8x8 board with pawns for demonstration
  const [prevMove, setPrevMove] = useState();
  const[checkmate, setCheckmate] = useState(false);
  const[stalemate, setStalemate] = useState(false);
  const [promotionInfo, setPromotionInfo] = useState(null);
  const [turn, setTurn] = useState("white");
  const [inCheck, setCheck]= useState();
  const [board, setBoard] = useState(
    Array(8)
      .fill(null)
      .map((_, i) =>
        Array(8)
          .fill(null)
          .map((_, j) => {
            // Initialise black pieces
            if (i === 0) {
              if (j === 0 || j === 7) {
                return new Piece("black", "rook", { row: i, col: j });
              } else if (j === 1 || j === 6) {
                return new Piece("black", "knight", { row: i, col: j });
              } else if (j === 2 || j === 5) {
                return new Piece("black", "bishop", { row: i, col: j });
              } else if (j === 3) {
                return new Piece("black", "queen", { row: i, col: j });
              } else if (j === 4) {
                return new Piece("black", "king", { row: i, col: j });
              }
            } else if (i === 1) {
              return new Piece("black", "pawn", { row: i, col: j });
            }
            //initialise white pieces
            else if (i === 6) {
              return new Piece("white", "pawn", { row: i, col: j });
            } else if (i === 7) {
              if (j === 0 || j === 7) {
                return new Piece("white", "rook", { row: i, col: j });
              } else if (j === 1 || j === 6) {
                return new Piece("white", "knight", { row: i, col: j });
              } else if (j === 2 || j === 5) {
                return new Piece("white", "bishop", { row: i, col: j });
              } else if (j === 3) {
                return new Piece("white", "queen", { row: i, col: j });
              } else if (j === 4) {
                return new Piece("white", "king", { row: i, col: j });
              }
            }
            return null; // Empty square
          })
      )
  );

  const [selected, setSelected] = useState(null);

  // Set a piece at a specific square
  function setPiece(row, col, piece) {
    setBoard(prev =>
      prev.map((r, i) =>
        i === row
          ? r.map((sq, j) => (j === col ? piece : sq))
          : r
      )
    );
  }

  // Remove a piece at a specific square



function handleSquareClick(row, col, piece) {
  if (checkmate === true) {
    console.log(`${piece?.color || "A player"} is in checkmate`);
    return;
  }

  if (selected) {
    const { row: fromRow, col: fromCol, piece: selectedPiece } = selected;
    const from = { row: fromRow, col: fromCol };
    const to = { row, col };

    if (fromRow === row && fromCol === col) {
      setSelected(null);
      return;
    }

    if (piece && piece.color === turn && piece !== selectedPiece) {
      setSelected({ row, col, piece });
      return;
    }

    if (selectedPiece.color !== turn) {
      alert("You can only move your own pieces.");
      setSelected(null);
      return;
    }

    if (!isValidMove(board, from, to, selectedPiece)) {
      alert("Invalid move.");
      return;
    }

    const testBoard = simulateMove(board, from, to);
    if (isCheck(testBoard, selectedPiece.color)) {
      alert("You can't move into check.");
      return;
    }

    const newBoard = board.map((r, i) =>
      r.map((sq, j) => {
        if (i === fromRow && j === fromCol) return null;
        if (i === row && j === col)
          return new Piece(selectedPiece.color, selectedPiece.getType(), { row, col });
        return sq;
      })
    );

    // Handle castling
    if (selectedPiece.getType() === "king" && Math.abs(to.col - from.col) === 2) {
      const row = from.row;

      // King-side castle
      if (to.col === 6) {
        const rook = board[row][7];
        newBoard[row][5] = new Piece(rook.color, rook.getType(), { row, col: 5 });
        newBoard[row][7] = null;
      }

      // Queen-side castle
      else if (to.col === 2) {
        const rook = board[row][0];
        newBoard[row][3] = new Piece(rook.color, rook.getType(), { row, col: 3 });
        newBoard[row][0] = null;
      }
    }

    const movedPiece = newBoard[row][col];

    if (["king", "rook"].includes(movedPiece.getType())) {
      movedPiece.setHasMoved();
    }

    // Handle en passant
    if (
      selectedPiece.getType() === "pawn" &&
      enPassant(board, selectedPiece, to, from, prevMove)
    ) {
      const direction = selectedPiece.color === "white" ? 1 : -1;
      newBoard[to.row + direction][to.col] = null;
    }

    if (isCheck(newBoard, turn)) {
      alert("You are in check.");
      setSelected(null);
      return;
    }
    //handle promotion
    if (
      movedPiece.getType() === "pawn" &&
      (row === 0 || row === 7)
    ) {
      // Temporarily keep the pawn there, then open modal
      setPromotionInfo({ row, col, color: movedPiece.color });
      setBoard(newBoard);          // Show the pawn in its final square
      return;                      // Exit early; wait for user choice
    }

    // Update state
    setPrevMove({
      from,
      to,
      piece: selectedPiece.getType(),
      color: selectedPiece.color,
    });

    setSelected(null);
    setBoard(newBoard);

    const opponentColor = turn === "white" ? "black" : "white";
    setTimeout(() => {
      if (checkForCheckmate(newBoard, opponentColor)) {
        setCheckmate(true);
        alert(`${opponentColor} is in checkmate!`);
      } else if (checkForStalemate(newBoard, opponentColor)) {
        alert(`${opponentColor} is in stalemate!`);
       setStalemate(true);
      } else {
        setTurn(opponentColor);
      }
    }, 100);
  } else if (piece && piece.color === turn) {
    setSelected({ row, col, piece });
    console.log("Selected piece at", row, col);
  }
}




function isValidMove(board, from, to, piece) {
  const targetPiece = board[to.row][to.col];
  const canMove = piece.canMove(from, to);
  const isSlidingPiece = ["rook", "bishop", "queen"].includes(piece.getType());
  const isEmptyDestination = !targetPiece;
  const isEnemy = targetPiece && targetPiece.color !== piece.color;

  if (targetPiece && targetPiece.color === piece.color) return false;

  if (isEnemy) {
    if (
      (isSlidingPiece && canMove && isPathClear(board, from, to)) ||
      (piece.getType() === "pawn" && piece.isValidPawnCapture(from, to)) ||
      (piece.getType() === "king" && canMove)
    ) return true;
  } else if (isEmptyDestination) {
    if(piece.getType() === "king" && Math.abs(to.col - from.col) == 2){
      if (canCastle(board, piece.color, from, to)){
        return true;
      }
    }
    if (
      (isSlidingPiece && canMove && isPathClear(board, from, to)) ||
      (piece.getType() === "pawn" && piece.isValidPawnMove(from, to)) ||
      (["king", "knight"].includes(piece.getType()) && canMove)
    ) return true;

    if (
      piece.getType() === "pawn" &&
      enPassant(board, piece, to, from, prevMove)
    ) return true;
  }

  return false;
}



  function isPathClear(board, from, to) {
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


  function simulateMove(board, from, to){
    const clonedBoard = board.map(row =>
    row.map(cell => cell ? Object.assign(Object.create(Object.getPrototypeOf(cell)), cell) : null)
  );

  const movingPiece = clonedBoard[from.row][from.col];

  clonedBoard[to.row][to.col] = movingPiece;
  clonedBoard[from.row][from.col] = null;
  if (movingPiece) {
    movingPiece.setLocation({ row: to.row, col: to.col });
  }

   return clonedBoard;


  }

 function isCheck(board, color) {
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
        const type = piece.getType?.() || piece.type;

        const canThreaten =
          (type === "knight" && piece.canMove(from, to)) ||
          (type === "pawn" && piece.isValidPawnCapture?.(from, to)) ||
          (["rook", "bishop", "queen"].includes(type) &&
            piece.canMove(from, to) &&
            isPathClear(board, from, to)) ||
          (type === "king" && piece.canMove(from, to));

        if (canThreaten) {
          console.log(`King is in check from ${type} at ${row},${col}`);
          setCheck(color);
          
          return true;
        }
      }
    }
  }

  setCheck(null);
  return false;
}


 function findKing(board, color) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (
        piece &&
        piece.getType() === "king" &&
        piece.color === color
      ) {
        console.log("king is at " + row + "," + col);
        return { row, col };
      }
    }
  }
  return null; // King not found
}
function canCastle(board, color, from, to) {
  const row = color === "white" ? 7 : 0;
  const kingStart = board[row][4];

  const kingsideRook = board[row][7];
  const queensideRook = board[row][0];

  const direction = to.col < from.col ? "queenside" : "kingside";

  const rook = direction === "kingside" ? kingsideRook : queensideRook;
  const rookCol = direction === "kingside" ? 7 : 0;
  const pathCols = direction === "kingside" ? [5, 6] : [3, 2];
  const castleCols = direction === "kingside" ? [4, 5, 6] : [4, 3, 2];

  // Check the king and rook haven't moved
  if (!kingStart || !rook) return false;
  if (kingStart.getType() !== "king" || rook.getType() !== "rook") return false;
  if (kingStart.getHasMoved() || rook.getHasMoved()) return false;

  // Check the path between king and rook is clear
  for (let col of pathCols) {
    if (board[row][col]) return false; // space is occupied
  }

  // Simulate king's path to make sure it's not through check
  for (let col of castleCols) {
    const testBoard = simulateMove(board, { row, col: 4 }, { row, col });
    if (isCheck(testBoard, color)) {
      alert("You can't castle through check.");
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

function checkForCheckmate(board, color) {
  if (isCheck(board, color)) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (!piece || piece.color !== color) continue;

        const moves = getAllPossibleMoves(board, piece, { row, col });
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


function getAllPossibleMoves(board, piece, startLocation){
  let moveList = [];
  console.log(piece, startLocation);
  for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        let destination = {row, col}
        if(piece.canMove(startLocation, destination) && isValidMove(board, startLocation, destination, piece)){
          moveList.push({row,col})

        }

      }
    }
    return moveList;

}

function checkForStalemate(board, color) {
  if (isCheck(board, color)) {
    return false; // If the player is in check, it's not stalemate
  }

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      const startLocation = { row, col };

      if (piece && piece.color === color) {
        const moves = getAllPossibleMoves(board, piece, startLocation);

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


function enPassant(board, piece, to, from, prevMove) {
  if (
    !prevMove ||
    piece.getType() !== "pawn" ||
    !piece.isValidPawnCapture(from, to)
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

function handlePromotionChoice(newType) {
  if (!promotionInfo) return;

  // Create the promoted piece
  const { row: pRow, col: pCol, color } = promotionInfo;
  setBoard(prev =>
    prev.map((r, i) =>
      r.map((sq, j) =>
        i === pRow && j === pCol
          ? new Piece(color, newType, { row: pRow, col: pCol })
          : sq
      )
    )
  );

  // Clear modal & finish turn
  setPromotionInfo(null);

  // After promotion the move is complete; check for mate / stalemate
  const nextColor = color === "white" ? "black" : "white";
  const b = board;             // latest board is now in state
  if (checkForCheckmate(b, nextColor)) {
    setCheckmate(true);
    alert(`${nextColor} is in checkmate!`);
  } else if (checkForStalemate(b, nextColor)) {
    alert(`${nextColor} is in stalemate!`);
  } else {
    setTurn(nextColor);
  }
}



  return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="mb-4 text-center">
      <h1 className="text-2xl mb-4">{turn}&apos;s Turn</h1>
      <h1 className="text-2xl mb-4">{inCheck} is in check</h1>
    </div>
    <div className="grid grid-cols-8 grid-rows-8 gap-0">
      {board.map((rowArr, i) =>
        rowArr.map((piece, j) => (
          <Square
            key={`${i}-${j}`}
            row={i}
            col={j}
            piece={piece}
            setPiece={p => setPiece(i, j, p)}
            removePiece={() => removePiece(i, j)}
            onSquareClick={handleSquareClick}
          />
        ))
      )}
    </div>

    {promotionInfo && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
    <div className="bg-white rounded-lg p-4 shadow-lg space-y-2 text-center">
      <p className="font-semibold mb-2">
        Promote&nbsp;to&nbsp;?
      </p>
      {["queen", "rook", "bishop", "knight"].map(t => (
        <button
          key={t}
          className="px-3 py-1 m-1 border rounded hover:bg-gray-200"
          onClick={() => handlePromotionChoice(t)}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  </div>
)}
  </div>
);
}