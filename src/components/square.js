import Image from "next/image";

export default function Square({ row, col, piece, onSquareClick }) {
  // Determine square color
  const isDark = (row + col) % 2 === 1;
  const bgColor = isDark ? "bg-green-700" : "bg-green-200";


  function renderPiece(piece) {
    if (!piece) return null;
    return (
      <Image
        src={`/piece_icons/${piece.color}_${piece.type}.svg`}
        alt={`${piece.color} ${piece.type}`}
        width={50}
        height={50}
      />
    );
  }

  return (
    <div
      className={`${bgColor} w-16 h-16 flex items-center justify-center`}
      onClick={() => onSquareClick(row, col, piece)}
    >
      {renderPiece(piece)}
    </div>
  );
}