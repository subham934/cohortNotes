import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeThemeToBrown,
  changeThemeToDark,
  changeThemeToLight,
} from "../redux/slices/themeSlice";

const Navbar = () => {
  const theme = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();
  return (
    <div>
      <h1>Current Theme is {theme}</h1>

      <button
        onClick={() => {
          dispatch(changeThemeToLight());
        }}
      >
        Light
      </button>
      <button
        onClick={() => {
          dispatch(changeThemeToDark());
        }}
      >
        Dark
      </button>
      <button
        onClick={() => {
          dispatch(changeThemeToBrown());
        }}
      >
        Brown
      </button>
    </div>
  );
};

export default Navbar;
