"use client";
import React, { useState } from "react";
import Square from "./square";
import Piece from "./piece";

export default function Chessboard() {
  // Initialize an 8x8 board with pawns for demonstration
  const [turn, setTurn] = useState("white");
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
  function removePiece(row, col) {
    setPiece(row, col, null);
  }
  function movePiece(fromRow, fromCol, toRow, toCol) {
  setBoard(prev => {
    const piece = prev[fromRow][fromCol];
    if (!piece) return prev;
    const newPiece = new Piece(piece.color, piece.type, { row: toRow, col: toCol });
    const newBoard = prev.map((row, i) =>
      row.map((sq, j) => {
        if (i === fromRow && j === fromCol) return null;
        if (i === toRow && j === toCol) return newPiece;
        return sq;
      })
    );
    return newBoard;
  });
  setTurn(prevTurn => (prevTurn === "white" ? "black" : "white"));
}

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

      try {
        if (selectedPiece.color !== turn) {
          alert("You can only move your own pieces.");
        }
        // If destination has a piece
        else if (targetPiece) {
          if (targetPiece.color === selectedPiece.color) {
            alert("You can't capture your own piece.");
          } else {
            // Sliding pieces: check path
            if (
              (["rook", "bishop", "queen"].includes(selectedPiece.getType()) &&
                selectedPiece.canMove(from, to) &&
                isPathClear(board, from, to)) ||
              // Pawn capture
              (selectedPiece.getType() === "pawn" &&
                selectedPiece.isValidPawnCapture(from, to))
            ) {
              movePiece(fromRow, fromCol, row, col);
              console.log("Captured piece at", row, col);
              if (turn === "white"){
                isCheck("black")

              } else{
                isCheck("white")
              }
  
            } else {
              alert("Invalid capture move.");
            }
          }
        }
        // If destination is empty
        else {
          if (
            (["rook", "bishop", "queen"].includes(selectedPiece.getType()) &&
              selectedPiece.canMove(from, to) &&
              isPathClear(board, from, to)) ||
            (selectedPiece.getType() === "pawn" &&
              selectedPiece.isValidPawnMove(from, to)) ||
            (["king", "knight"].includes(selectedPiece.getType()) &&
              selectedPiece.canMove(from, to))
          ) {
            movePiece(fromRow, fromCol, row, col);
            console.log("Moved piece from", fromRow, fromCol, "to", row, col);
            if (turn === "white"){
                isCheck("black")

              } else{
                isCheck("white")
              }
          } else {
            console.error("Invalid move.");
          }
        }
      } catch (e) {
        console.error(e);
      }
      setSelected(null);
    } else if (piece) {
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

 function isCheck(color){
 const kingLocation = findKing(color);
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      const from= {row,col}
      const to = {row: kingLocation.row, col: kingLocation.col}
      if(piece){
        if (piece.canMove(from, to)) {
        console.log("king is in check");
        return { row, col };
      } else{
        console.log("not in check")
      }

      }
      
    }
  }
  return null; // King not found
  
 }
 function findKing(color) {
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