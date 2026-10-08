"use client";
import React from "react";
import Square from "./square";
import PromotionModal from "./promotionModal";
import { useSelector } from "react-redux";
import { selectDisplayBoard, selectPendingPromotion } from "@/features/game/gameSlice";

export default function Chessboard() {
  const pendingPromotion = useSelector(selectPendingPromotion);
  const board = useSelector(selectDisplayBoard);

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
          />
        ))
      )}
    </div>

    {/* Promotion Modal */}
    {pendingPromotion && (
      <PromotionModal/>
    )}
  </div>
);

}