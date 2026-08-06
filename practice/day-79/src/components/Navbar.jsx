import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <div className="flex justify-between px-8 py-4 bg-pink-400 mb-10 items-center">
        <h2 className="text-4xl">Navbar</h2>
        <div className="flex gap-8 text-2xl">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/product">Product</Link>
          <Link to="/courses">Courses</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
