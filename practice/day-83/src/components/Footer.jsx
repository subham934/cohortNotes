import React from "react";
import { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";

const Footer = () => {
  const [theme, setTheme] = useContext(ThemeDataContext);

  return (
    <div className="foot">
      <h1>Footer</h1>
      <h2>{theme}</h2>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Change Theme
      </button>
    </div>
  );
};

export default Footer;
