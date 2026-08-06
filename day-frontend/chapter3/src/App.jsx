import React from "react";
import Mainroutes from "./routes/Mainroutes";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="bg-gray-800 text-white font-thin w-full min-h-screen py-10 px-[10%]">
      <Navbar />
      <Mainroutes />
    </div>
  );
};

export default App;
