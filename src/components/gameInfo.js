'use client'

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetGame, selectNotation, selectTurn } from "@/features/game/gameSlice";

export default function GameInfo() {
  const turn = useSelector(selectTurn);
  const notation = useSelector(selectNotation);
  const dispatch = useDispatch();
  return (
    <div className="w-64 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Game Info</h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-1">Current Turn:</h3>
        <p>{turn}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-1">Timer (Coming Soon):</h3>
        <p>00:00</p>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-1">Moves History:</h3>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {notation.map((move, index) => (
            <li key={index}>{move}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-1">Captured Pieces (Coming Soon):</h3>
        <p>None yet</p>
      </div>
      
      <br/>
      <button
        onClick={()=> dispatch(resetGame())}
        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      >
        Reset Game
      </button>
    </div>
  );
}
