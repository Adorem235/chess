"use client";
import React, { useState } from "react";
import { useEffect } from "react";

import Square from "./square";
import { oppositeColor } from "../lib/chess/piece";
import * as GameRules from '../lib/chess/gameRules';
import { newBoard } from "../lib/chess/board";
import { COLORS } from "../lib/chess/constants";
import PromotionModal from "./promotionModal";

export default function Chessboard({turn, setTurn, resetSignal, moveHistory, setMoveHistory}) {
  // The previous move is always the last entry in the history
  const prevMove = moveHistory[moveHistory.length - 1] ?? null;
  const[checkmate, setCheckmate] = useState(false);
  const[stalemate, setStalemate] = useState(false);
  const [promotionInfo, setPromotionInfo] = useState(null);
  const [inCheck, setCheck]= useState();
  const [board, setBoard] = useState(
    newBoard()
  );

  const [selected, setSelected] = useState(null);

function handleSquareClick(row, col, piece) {
  // No moves once the game is over, or while waiting for a promotion choice
  if (checkmate || stalemate || promotionInfo) {
    return;
  }

  // Nothing selected yet: select one of the current player's pieces
  if (!selected) {
    if (piece && piece.color === turn) {
      setSelected({ row, col, piece });
    }
    return;
  }

  const { row: fromRow, col: fromCol, piece: selectedPiece } = selected;
  const from = { row: fromRow, col: fromCol };
  const to = { row, col };

  if (fromRow === row && fromCol === col) {
    setSelected(null);
    return;
  }

  if (piece && piece.color === turn) {
    setSelected({ row, col, piece });
    return;
  }

  if (!GameRules.isValidMove(board, from, to, selectedPiece, prevMove)) {
    alert("Invalid move.");
    return;
  }

  if (GameRules.isCheck(GameRules.simulateMove(board, from, to), selectedPiece.color)) {
    alert("You can't move into check.");
    return;
  }

  if (GameRules.isPromotionMove(selectedPiece, to)) {
    // Show the pawn on its final square while the player chooses.
    // Keep the board from before the move so the promotion is applied to it, not to the preview.
    setPromotionInfo({ from, to, color: selectedPiece.color, boardBeforeMove: board });
    setBoard(GameRules.applyMove(board, from, to).board);
    setSelected(null);
    return;
  }

  finishMove(GameRules.applyMove(board, from, to));
}

// Records a completed move, updates check status, then checks for mate / stalemate.
// Only uses its arguments so it never reads a stale board or turn from state.
function finishMove({ board: finalBoard, move }) {
  const opponentColor = oppositeColor(move.color);

  // Decide the game state immediately so there's no window where the same player can move again
  const check = GameRules.isCheck(finalBoard, opponentColor);
  const isCheckmate = GameRules.checkForCheckmate(finalBoard, opponentColor, move);
  const isStalemate = !isCheckmate && GameRules.checkForStalemate(finalBoard, opponentColor, move);

  setMoveHistory(prev => [...prev, { ...move, check, checkmate: isCheckmate }]);
  setSelected(null);
  setBoard(finalBoard);
  setCheck(check ? opponentColor : null);

  if (isCheckmate) {
    setCheckmate(true);
    // Delay only the alert so the final position renders before the blocking dialog
    setTimeout(() => alert(`${opponentColor} is in checkmate!`), 100);
  } else if (isStalemate) {
    setStalemate(true);
    setTimeout(() => alert(`${opponentColor} is in stalemate!`), 100);
  } else {
    setTurn(opponentColor);
  }
}

function handlePromotionChoice(newType) {
  if (!promotionInfo) return;

  const { from, to, boardBeforeMove } = promotionInfo;
  setPromotionInfo(null);
  finishMove(GameRules.applyMove(boardBeforeMove, from, to, newType));
}

useEffect(() => {
  setBoard(newBoard());
  setTurn(COLORS.WHITE);
  setCheck(false);
  setCheckmate(false);
  setPromotionInfo(null);
  setMoveHistory([]);
  setSelected(null);
  setStalemate(false);
  }, [resetSignal, setTurn, setMoveHistory]);



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