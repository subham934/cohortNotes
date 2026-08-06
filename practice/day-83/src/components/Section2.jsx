import React from "react";
import { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";

const Section2 = () => {
  const [theme, setTheme] = useContext(ThemeDataContext);

  return (
    <div>
      <h2>Section2</h2>
      <p>{theme}</p>
    </div>
  );
};

export default Section2;
