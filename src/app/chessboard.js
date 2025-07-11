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
    console.log("Clicked:", row, col, piece);
    if (selected) {
      const { row: fromRow, col: fromCol, piece: selectedPiece } = selected;
      // Don't allow moving to the same square
      if (fromRow === row && fromCol === col) {
        setSelected(null);
        return;
      }
      // Validate move using the selected piece's move logic
      try {
        // You may want to pass both locations for pawns, etc.
        if (selectedPiece.color !== turn) {
          console.error("You can only move your own pieces.");
        }else if (selectedPiece.canMove(selectedPiece.getLocation(), { row, col })) {
          movePiece(fromRow, fromCol, row, col);
          console.log("Moved piece from", fromRow, fromCol, "to", row, col);
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