import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sections from "./components/Sections"; 

const App = () => {
  return (
    <div className="app-div">
      <Navbar brand={"Sheryians"}>
        <h1 className=" text-3xl text-pink-500">Danish bhai</h1>
      </Navbar>
      <Sections>
        <h1 className=" text-3xl text-emerald-500">Hulk Smash</h1>
        <h2 className=" text-3xl text-emerald-500">Avenger Assemble</h2>
      </Sections>
      <Footer />
    </div>
  );
};

export default App;
