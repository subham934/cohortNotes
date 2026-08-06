import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      <h1>Dhar Jewellers</h1>
      <ul>
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "inactive")}
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "inactive")}
          to="/about"
        >
          About
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "inactive")}
          to="/courses"
        >
          Courses
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "inactive")}
          to="/products"
        >
          Products
        </NavLink>
      </ul>
    </div>
  );
};

export default Navbar;
