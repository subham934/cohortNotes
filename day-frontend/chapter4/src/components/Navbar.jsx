import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex justify-center items-center gap-x-5 font-bold text-xl mb-10">
      <NavLink className={(e) => `px-5 py-2 rounded ${e.isActive ? "text-red-500  bg-rose-200" : ""}`} to="/">
        Home
      </NavLink>
      <NavLink className={(e) => `px-5 py-2 rounded ${e.isActive ? "text-red-500  bg-rose-200" : ""}`} to="/recipes">
        Recipes
      </NavLink>
      <NavLink className={(e) => `px-5 py-2 rounded ${e.isActive ? "text-red-500  bg-rose-200" : ""}`} to="/about">
        About
      </NavLink>
      <NavLink className={(e) => `px-5 py-2 rounded ${e.isActive ? "text-red-500  bg-rose-200" : ""}`} to="/create-recipe">
        Create Recipe
      </NavLink>
      <NavLink className={(e) => `px-5 py-2 rounded ${e.isActive ? "text-red-500  bg-rose-200" : ""}`} to="/fav">
        Favorite
      </NavLink>
    </div>
  );
};

export default Navbar;