"use client";
import React, { useState } from "react";
import Navbar from "./components/navbar";
import Chessboard from "../components/chessBoard"
import GameInfo from "./components/gameInfo";

export default function Home() {
  const [turn, setTurn] = useState("white");
  const [resetSignal, setResetSignal] = useState(0);
  const [moveList, setMoveList] = useState([])

  const handleReset = () => {
    setResetSignal(prev => prev + 1);
    setTurn("white");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar at top */}
      <Navbar />

      {/* Main content area: GameInfo sidebar + Chessboard */}
      <main className="flex flex-grow items-start justify-center gap-4 p-4">
        <GameInfo turn={turn} onReset= {handleReset} moveList={moveList}/>
        <Chessboard turn={turn} setTurn={setTurn} resetSignal = {resetSignal} setMoveList = {setMoveList} moveList= {moveList} />
      </main>
    </div>
  );
}
