import React from "react";
import Navbar from "./pages/Navbar";
import Section from "./pages/Section";
import Footer from "./pages/Footer";

const App = () => {
  return (
    <div>
      
      <Navbar>
        <h1 className="text-3xl text-white font-bold">Danish Bhai!!!</h1>
      </Navbar>
      
      <Section brand="Dhar Jewellers">
        <h1 className="text-3xl text-red-600 font-bold">Welcome to React</h1>
        <h2 className="text-3xl text-red-600 font-bold">Halku</h2>
      </Section>

      <Footer />
    
    </div>
  );
};

export default App;
