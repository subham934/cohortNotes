import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <div className="flex justify-between items-center px-8 py-3 bg-rose-400 mb-10 text-white">
        <h1 className="text-4xl font-bold">Navbar</h1>

        <div className="flex gap-8 items-center">
          <NavLink
            to="/"
            className={(e) =>
              `px-5 py-2 font-black rounded ${e.isActive ? "text-red-500  bg-rose-200" : "text-white"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={(e) =>
              `px-5 py-2 font-black rounded ${e.isActive ? "text-red-500  bg-rose-200" : "text-white"}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/product"
            className={(e) =>
              `px-5 py-2 font-black rounded ${e.isActive ? "text-red-500  bg-rose-200" : "text-white"}`
            }
          >
            Product
          </NavLink>
          <NavLink
            to="/courses"
            className={(e) =>
              `px-5 py-2 font-black rounded ${e.isActive ? "text-red-500  bg-rose-200" : "text-white"}`
            }
          >
            Courses
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;