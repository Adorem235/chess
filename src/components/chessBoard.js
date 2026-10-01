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