import React from "react";
import Card from "./Card";
import Cart from "./Cart";
import Button from "./Button";

const App = () => {
  const names = ["Anubhav", "Sarthak", "Harsh", "Chetan", "Dhaneshwar", "bixi"];
  return (
    <>
      <div className="text-red-700 text-3xl">
        Vite
        <Card />
      </div>
      <div className="p-10 ">
        <Cart user={"Sarthak"} age={22} />
        <Cart user="Subham" age={30} />
      </div>
      {names.map(function (elem, id) {
        return <Button name={elem} key={id + 1} />;
      })}
    </>
  );
};

export default App;
