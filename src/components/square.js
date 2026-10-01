import Image from "next/image";
import Piece from "./piece";

export default function Square({ row, col, piece, setPiece, removePiece, onSquareClick }) {
  // Determine square color
  const isDark = (row + col) % 2 === 1;
  const bgColor = isDark ? "bg-green-700" : "bg-green-200";


  // Render the piece (example for pawn)
  function renderPiece(piece) {
    if (!piece) return null;
    switch (piece.getType()) {
      case "pawn":
        return (
          <Image
            src={piece.getColor() === "white" ? "./piece_icons/white_pawn.svg" : "./piece_icons/black_pawn.svg"}
            alt="Pawn"
            width={50}
            height={50}
          />
        );
        case "rook":
        return (
          <Image
            src={piece.getColor() === "white" ? "./piece_icons/white_rook.svg" : "./piece_icons/black_rook.svg"}
            alt="Rook"
            width={50}
            height={32}
          />
        );
        case "knight":
        return (
          <Image
            src={piece.getColor() === "white" ? "./piece_icons/white_knight.svg" : "./piece_icons/black_knight.svg"}
            alt="Knight"
            width={50}
            height={50}
          />
        );
        case "bishop":
        return (
          <Image
            src={piece.getColor() === "white" ? "./piece_icons/white_bishop.svg" : "./piece_icons/black_bishop.svg"}
            alt="Bishop"
            width={50}
            height={50}
          />
        );
        case "queen":
        return (
          <Image
            src={piece.getColor() === "white" ? "./piece_icons/white_queen.svg" : "./piece_icons/black_queen.svg"}
            alt="Queen"
            width={50}
            height={50}
          />
        );
        case "king":
        return (
          <Image
            src={piece.getColor() === "white" ? "./piece_icons/white_king.svg" : "./piece_icons/black_king.svg"}
            alt="King"
            width={50}
            height={50}
          />
        );
    
      // Add cases for other pieces...
      default:
        return null;
    }
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