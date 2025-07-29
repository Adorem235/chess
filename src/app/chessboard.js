"use client";
import React, { useState } from "react";
import Square from "./square";
import Piece from "./piece";

export default function Chessboard() {
  // Initialize an 8x8 board with pawns for demonstration
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
  if (selected) {
    const { row: fromRow, col: fromCol, piece: selectedPiece } = selected;
    const targetPiece = board[row][col];
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

    const canMove = selectedPiece.canMove(from, to);
    const isSlidingPiece = ["rook", "bishop", "queen"].includes(selectedPiece.getType());
    const isEmptyDestination = !targetPiece;
    const isEnemy = targetPiece && targetPiece.color !== selectedPiece.color;

    let validMove = false;

    // Determine if move is valid
    if (isEnemy) {
      if (
        (isSlidingPiece && canMove && isPathClear(board, from, to)) ||
        (selectedPiece.getType() === "pawn" && selectedPiece.isValidPawnCapture(from, to))
      ) {
        validMove = true;
      } else {
        alert("Invalid capture move.");
      }
    } else if (isEmptyDestination) {
      if (
        (isSlidingPiece && canMove && isPathClear(board, from, to)) ||
        (selectedPiece.getType() === "pawn" && selectedPiece.isValidPawnMove(from, to)) ||
        (["king", "knight"].includes(selectedPiece.getType()) && canMove)
      ) {
        validMove = true;
      } else {
        alert("Invalid move.");
      }
    } else {
      alert("You can't capture your own piece.");
    }

    if (validMove) {
      // Update board and check for check on opponent
      const newBoard = board.map((r, i) =>
        r.map((sq, j) => {
          if (i === fromRow && j === fromCol) return null;
          if (i === row && j === col)
            return new Piece(selectedPiece.color, selectedPiece.getType(), { row, col });
          return sq;
        })
      );
      if(isCheck(newBoard, turn)) {
        alert("you are in check");
        setSelected(null);
        return false;
      } else{
        
        setSelected(null);
        setBoard(newBoard);
        const nextTurn = turn === "white" ? "black" : "white";
        setTurn(nextTurn);
        isCheck(newBoard, nextTurn);

      }

      
    }

  } else if (piece && piece.color === turn) {
    setSelected({ row, col, piece });
    console.log("Selected piece at", row, col);
  }
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

 function isCheck(board, color) {
  const kingLocation = findKing(board, color);
  if (!kingLocation) {
    console.log("King not found!");
    return null;
  }

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      const from = { row, col };
      const to = { row: kingLocation.row, col: kingLocation.col };

      if (piece && piece.color !== color) {
        if (piece.canMove(from, to) && isPathClear(board, from, to)) {
          console.log("King is in check from", piece);
          setCheck(color);
          return true;
        }
      }
    }
  }

  setCheck(null);
  console.log(color + " is not in check");
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
  </div>
);
}