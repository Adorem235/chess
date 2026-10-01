"use client";
import React, { useState } from "react";
import { useEffect } from "react";

import Square from "./square";
import { createPiece } from "../lib/chess/piece";
import * as GameRules from '../lib/chess/gameRules';
import PromotionModal from "./promotionModal";

export default function Chessboard({turn, setTurn, resetSignal, setMoveList}) {
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

function handleSquareClick(row, col, piece) {
  // No moves once the game is over, or while waiting for a promotion choice
  if (checkmate || stalemate || promotionInfo) {
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
        // Kings and rooks are marked as moved so they can no longer castle
        if (i === row && j === col)
          return createPiece(
            selectedPiece.color,
            selectedPiece.type,
            ["king", "rook"].includes(selectedPiece.type)
          );
        return sq;
      })
    );

    // Handle castling
    if (selectedPiece.type === "king" && Math.abs(to.col - from.col) === 2) {
      const row = from.row;

      // King-side castle
      if (to.col === 6) {
        const rook = board[row][7];
        newBoard[row][5] = createPiece(rook.color, rook.type, true);
        newBoard[row][7] = null;
      }

      // Queen-side castle
      else if (to.col === 2) {
        const rook = board[row][0];
        newBoard[row][3] = createPiece(rook.color, rook.type, true);
        newBoard[row][0] = null;
      }
    }

    const movedPiece = newBoard[row][col];

    // Handle en passant
    if (
      selectedPiece.type === "pawn" &&
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
      movedPiece.type === "pawn" &&
      (row === 0 || row === 7)
    ) {
      // Keep the pawn on its final square and wait for the user's choice.
      // Store the board and move so handlePromotionChoice doesn't rely on stale state.
      setPromotionInfo({ row, col, color: movedPiece.color, from, to, board: newBoard });
      setSelected(null);
      setBoard(newBoard);
      return;
    }

    finishMove(newBoard, from, to, selectedPiece.type, selectedPiece.color);
  } else if (piece && piece.color === turn) {
    setSelected({ row, col, piece });
  }
}

// Records a completed move, updates check status, then checks for mate / stalemate.
// Only uses its arguments so it never reads a stale board or turn from state.
function finishMove(finalBoard, from, to, pieceType, color) {
  const lastMove = { from, to, piece: pieceType, color };
  setPrevMove(lastMove);

  const move = { to, from, piece: pieceType };
  setMoveList(prev => [...prev, GameRules.convertToChessNotation(move)]);

  setSelected(null);
  setBoard(finalBoard);
  const opponentColor = color === "white" ? "black" : "white";

  if (GameRules.isCheck(finalBoard, opponentColor)) {
    setCheck(`${opponentColor}`);
  } else {
    setCheck(null);
  }

  // Decide the game state immediately so there's no window where the same player can move again
  if (GameRules.checkForCheckmate(finalBoard, opponentColor, lastMove)) {
    setCheckmate(true);
    // Delay only the alert so the final position renders before the blocking dialog
    setTimeout(() => alert(`${opponentColor} is in checkmate!`), 100);
  } else if (GameRules.checkForStalemate(finalBoard, opponentColor, lastMove)) {
    setStalemate(true);
    setTimeout(() => alert(`${opponentColor} is in stalemate!`), 100);
  } else {
    setTurn(opponentColor);
  }
}

function handlePromotionChoice(newType) {
  if (!promotionInfo) return;

  // Build the promoted board from the stored post-move board, not from state
  const { row: pRow, col: pCol, color, from, to, board: pawnBoard } = promotionInfo;
  const promotedBoard = pawnBoard.map((r, i) =>
    r.map((sq, j) =>
      i === pRow && j === pCol
        ? createPiece(color, newType)
        : sq
    )
  );

  setPromotionInfo(null);
  finishMove(promotedBoard, from, to, "pawn", color);
}

useEffect(() => {
  setBoard(GameRules.newBoard());
  setTurn("white");
  setCheck(false);
  setCheckmate(false);
  setPrevMove(null);
  setPromotionInfo(null);
  setMoveList([])
  setSelected(null);
  setStalemate(false);
  }, [resetSignal, setTurn, setMoveList]);



return (
  <div className="flex flex-col items-center justify-start bg-gray-100">

    {/* Chessboard */}
    <div className="grid grid-cols-8 grid-rows-8 gap-0">
      {board.map((rowArr, i) =>
        rowArr.map((piece, j) => (
          <Square
            key={`${i}-${j}`}
            row={i}
            col={j}
            piece={piece}
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