import { squareClicked } from "@/features/game/gameSlice";
import Image from "next/image";
import { useDispatch } from "react-redux";

export default function Square({ row, col, piece}) {
  // Determine square color
  const isDark = (row + col) % 2 === 1;
  const bgColor = isDark ? "bg-green-700" : "bg-green-200";
  const dispatch = useDispatch();


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
      onClick={() => dispatch(squareClicked({row, col}))}
    >
      {renderPiece(piece)}
    </div>
  );
}