import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="nav">
      <NavLink
        to="/"
        //   style={({ isActive }) => ({ color: isActive ? "red" : "white" })}
        className={({ isActive }) => (isActive ? "active" : "inactive")}
      >
        Home
      </NavLink>
      <NavLink
        to="/about"
        //   style={({ isActive }) => ({ color: isActive ? "red" : "white" })}
        className={({ isActive }) => (isActive ? "active" : "inactive")}
      >
        About
      </NavLink>
      <NavLink
        to="/courses"
        // style={({ isActive }) => ({ color: isActive ? "red" : "white" })}
        className={({ isActive }) => (isActive ? "active" : "inactive")}
      >
        Courses
      </NavLink>
    </div>
  );
};

export default Navbar;
