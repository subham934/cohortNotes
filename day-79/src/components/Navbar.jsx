import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <div className="flex justify-between items-center px-8 py-4 bg-pink-500 mb-10 text-white">
        <h2 className="text-4xl">Navbar</h2>
        <input type="text" className="border-2" />
        <div className="flex gap-8 items-center">
          <Link className="text-2xl" to="/">
            Home
          </Link>
          <Link className="text-2xl" to="/about">
            About
          </Link>
          <Link className="text-2xl" to="/product">
            Product
          </Link>
          <Link className="text-2xl" to="/courses">
            Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
