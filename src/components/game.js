'use client'
import { useState} from "react";
import Chessboard from "./chessBoard";
import GameInfo from "./gameInfo";
import { COLORS } from "../lib/chess/constants";

export default function Game(){
const [turn, setTurn] = useState(COLORS.WHITE);
  const [resetSignal, setResetSignal] = useState(0);
  const [moveHistory, setMoveHistory] = useState([])

  const handleReset = () => {
    setResetSignal(prev => prev + 1);
    setTurn(COLORS.WHITE);
  };

  return (
    <div className="flex flex-grow items-start justify-center gap-4 p-4">
        <GameInfo turn={turn} onReset= {handleReset} moveHistory={moveHistory}/>
        <Chessboard turn={turn} setTurn={setTurn} resetSignal = {resetSignal} moveHistory={moveHistory} setMoveHistory={setMoveHistory} />
      </div>

      
  )
};

