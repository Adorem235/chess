'use client'
import Navbar from "../components/navBar";
import Game from "@/components/game";
import { Provider } from "react-redux";
import { store } from "@/store";
export default function Home() {
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      
      <Provider store={store}>
        <Navbar />
        <Game/>
      </Provider>
      
      
    </div>
  );
}
