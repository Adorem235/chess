
import Navbar from "../components/navBar";
import Game from "@/components/game";

export default function Home() {
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar at top */}
      <Navbar />
      <Game/>
      
    </div>
  );
}
