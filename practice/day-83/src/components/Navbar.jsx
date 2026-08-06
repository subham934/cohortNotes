import React from "react";
import { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";

const Navbar = () => {
  const [theme, setTheme] = useContext(ThemeDataContext);

  return (
    <div className="nav">
      <h1>Navbar </h1>
      <h2> {theme}</h2>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Change Theme</button>
    </div>
  );
};

export default Navbar;
