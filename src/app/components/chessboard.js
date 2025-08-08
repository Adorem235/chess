"use client";
import React, { useState } from "react";
import { useEffect } from "react";

import Square from "../models/square";
import Piece from "../models/piece";
import * as GameRules from '../logic/gameRules';
import PromotionModal from "./promotionModal";

export default function Chessboard({turn, setTurn, resetSignal}) {
  // Initialize an 8x8 board with pawns for demonstration
  const [prevMove, setPrevMove] = useState(null);
  const[checkmate, setCheckmate] = useState(false);
  const[stalemate, setStalemate] = useState(false);
  const [promotionInfo, setPromotionInfo] = useState(null);
  const [inCheck, setCheck]= useState();
  const [board, setBoard] = useState(
    GameRules.newBoard()
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

    if (!GameRules.isValidMove(board, from, to, selectedPiece, prevMove)) {
      alert("Invalid move.");
      return;
    }

    const testBoard = GameRules.simulateMove(board, from, to);
    if (GameRules.isCheck(testBoard, selectedPiece.color)) {
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
      GameRules.enPassant(board, selectedPiece, to, from, prevMove)
    ) {
      const direction = selectedPiece.color === "white" ? 1 : -1;
      newBoard[to.row + direction][to.col] = null;
    }

    if (GameRules.isCheck(newBoard, turn)) {
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

    if (GameRules.isCheck(newBoard, opponentColor)) {
      setCheck(`${opponentColor}`);
    } else {
      setCheck(null);
    }

    
    setTimeout(() => {
      if (GameRules.checkForCheckmate(newBoard, opponentColor)) {
        setCheckmate(true);
        alert(`${opponentColor} is in checkmate!`);
      } else if (GameRules.checkForStalemate(newBoard, opponentColor)) {
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
  if (GameRules.checkForCheckmate(b, nextColor)) {
    setCheckmate(true);
    alert(`${nextColor} is in checkmate!`);
  } else if (GameRules.checkForStalemate(b, nextColor)) {
    alert(`${nextColor} is in stalemate!`);
  } else {
    setTurn(nextColor);
  }
}

useEffect(() => {
  setBoard(GameRules.newBoard());
  setTurn("white");
  setCheck(false);
  setCheckmate(false);
  setPrevMove(null);
  setPromotionInfo(null);;
  }, [resetSignal]);



return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">

    {/* Chessboard */}
    <div className="grid grid-cols-8 grid-rows-8 gap-0">
      {board.map((rowArr, i) =>
        rowArr.map((piece, j) => (
          <Square
            key={`${i}-${j}`}
            row={i}
            col={j}
            piece={piece}
            setPiece={(p) => setPiece(i, j, p)}
            removePiece={() => removePiece(i, j)}
            onSquareClick={handleSquareClick}
          />
        ))
      )}
    </div>

    {/* Promotion Modal */}
    {promotionInfo && (
      <PromotionModal
        color={promotionInfo.color}
        onSelect={(newType) => handlePromotionChoice(newType)}
      />
    )}
  </div>
);

}