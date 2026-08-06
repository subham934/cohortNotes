import React from "react";
import { useContext } from "react";
import { ThemeDataContext } from "../context/ThemeContext";

const Footer = () => {
  const data = useContext(ThemeDataContext);
  const [theme, setTheme] = useContext(ThemeDataContext);

  return (
    <div className="foot">
      <h1>Footer</h1>
      {data}
      <button
        onClick={() => {
          if (theme == "Light") {
            setTheme("Dark");
          } else {
            setTheme("Light");
          }
        }}
      >
        Change Theme 
      </button>
    </div>
  );
};

export default Footer;
