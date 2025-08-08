import React from "react";

export default function GameInfo({ turn, onReset }) {
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
        <h3 className="font-semibold mb-1">Moves History (Coming Soon):</h3>
        <ul className="list-disc list-inside text-sm text-gray-600">
          <li>e4</li>
          <li>e5</li>
          <li>Nf3</li>
          <li>...</li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-1">Captured Pieces (Coming Soon):</h3>
        <p>None yet</p>
      </div>
      
      <br/>
      <button
        onClick={onReset}
        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      >
        Reset Game
      </button>
    </div>
  );
}
