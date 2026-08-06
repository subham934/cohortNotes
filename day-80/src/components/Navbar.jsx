import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <div className="nav">
        <NavLink
          to="/"
          style={({ isActive }) => ({
            color: isActive ? "red" : "black",
            textDecoration: isActive ? "underline" : "none",
          })}

          // className={({ isActive }) => (isActive ? "link activeLink" : "link")}
          // className={({ isActive }) => (isActive ? " activeLink" : "link")}
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          style={({ isActive }) => ({
            color: isActive ? "red" : "black",
          })}
        >
          About
        </NavLink>
        <NavLink
          to="/courses"
          style={({ isActive }) => ({
            color: isActive ? "red" : "black",
          })}
        >
          Courses
        </NavLink>
        
      </div>
    </>
  );
};

export default Navbar;
