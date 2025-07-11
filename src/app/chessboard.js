export default function Chessboard() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="grid grid-cols-8 grid-rows-8 gap-0">
        {[...Array(8)].map((_, i) =>
          [...Array(8)].map((_, j) => (
            <div
              key={`${i}-${j}`}
              className={`w-12 h-12 ${((i + j) % 2 === 0) ? 'bg-white' : 'bg-gray-800'}`}
            ></div>
          ))
        )}
      </div>
    </div>
  );
}