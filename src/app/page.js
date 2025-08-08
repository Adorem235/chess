import Chessboard from "./components/chessboard";
import Navbar from "./components/navbar";
export default function Home() {
  return (
  <div className="flex flex-col min-h-screen bg-gray-100">
    {/* Navbar at top */}
    <Navbar />

    {/* Main content centered */}
    <main className="flex-grow flex items-center justify-center">
      <Chessboard />
    </main>
  </div>
);

}
