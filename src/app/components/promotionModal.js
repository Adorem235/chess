import React from "react";

export default function PromotionModal({ color, onSelect }) {
  const promotionPieces = ["queen", "rook", "bishop", "knight"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-64">
        <h3 className="text-center text-lg font-semibold mb-4">Promote pawn to:</h3>
        <div className="grid grid-cols-4 gap-2">
          {promotionPieces.map((type) => (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className="hover:scale-105 transition-transform"
            >
              <img
                src={`./piece_icons/${color}_${type}.svg`}
                alt={type}
                className="w-12 h-12 mx-auto"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
