import React from "react";
import { Link, Outlet } from "react-router-dom";
const Product = () => {
  return (
    <div>
      <h1 className="text-5xl font-bold underline rounded-2xl fixed  left-[50vw] -translate-x-1/2 bg-amber-300 px-7 py-5">
        PRODUCT PAGE
      </h1>

      <div className="flex gap-5">
        <Link className="text-xl font-semibold underline" to="/product/men">Men's Collection</Link>
        <Link className="text-xl font-semibold underline" to="/product/women">Women's Collection</Link>
      </div>

      <Outlet />
    </div>
  );
};

export default Product;
