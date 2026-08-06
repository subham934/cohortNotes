import React from "react";
import styles from "../src/Button.module.css";
import Button from "./Button";

const App = () => {
  return (
    <div className="flex flex-col">
      <h1 className="text-5xl bg-amber-300 inline-block text-blue-600 font-bold">
        This is App.jsx
      </h1>

      <p className="bg-pink-400 text-[20px] w-fit p-5 mt-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>

      <div className="w-80 h-[80px] bg-amber-400 mt-2">
        <h4>Hello </h4>
      </div>

      <button className={styles.button}>Submit my Styles</button>
      <Button />
    </div>
  );
};

export default App;
