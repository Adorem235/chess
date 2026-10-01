'use client'
import { useState} from "react";
import Chessboard from "./chessBoard";
import GameInfo from "./gameInfo";

export default function Game(){
const [turn, setTurn] = useState("white");
  const [resetSignal, setResetSignal] = useState(0);
  const [moveList, setMoveList] = useState([])

  const handleReset = () => {
    setResetSignal(prev => prev + 1);
    setTurn("white");
  };

  return (
    <div className="flex flex-grow items-start justify-center gap-4 p-4">
        <GameInfo turn={turn} onReset= {handleReset} moveList={moveList}/>
        <Chessboard turn={turn} setTurn={setTurn} resetSignal = {resetSignal} setMoveList = {setMoveList} />
      </div>

      
  )
};

