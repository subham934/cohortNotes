import React from "react";
import { Outlet } from "react-router-dom";

const Product = () => {
  return (
    <div>
      <h1 className="text-5xl font-bold underline rounded-2xl fixed left-[50vw] top-[20vh] -translate-1/2 bg-amber-300 px-7 py-5">
        Product Page
      </h1>
      <Outlet />
    </div>
  );
};

export default Product;
