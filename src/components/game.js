'use client'
import Chessboard from "./chessBoard";
import GameInfo from "./gameInfo";
export default function Game(){


  return (
    <div className="flex flex-grow items-start justify-center gap-4 p-4">
        <GameInfo />
        <Chessboard/>
      </div>

      
  )
};

