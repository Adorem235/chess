"use client";
import React, { useState } from "react";
import Square from "./square";
import Piece from "./piece";

export default function Chessboard() {
  // Initialize an 8x8 board with pawns for demonstration
  const [board, setBoard] = useState(
    Array(8)
      .fill(null)
      .map((_, i) =>
        Array(8)
          .fill(null)
          .map((_, j) =>
            i === 1 ? new Piece("white", "pawn", { row: i, col: j }) : null
          )
      )
  );

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
            />
          ))
        )}
      </div>
    </div>
  );
}