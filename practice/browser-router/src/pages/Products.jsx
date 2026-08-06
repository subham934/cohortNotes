import React from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
const Products = () => {
  return (
    <div className="products">
      <h1>Products</h1>

      <div className="product-links">
        <Link to="/products/men">Men's Items</Link>
        <Link to="/products/women">Women's Items</Link>
      </div>

      <Outlet />
    </div>
  );
};

export default Products;
