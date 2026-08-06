import React from "react";
import { Link } from "react-router-dom";

const Product = () => {
  return (
    <div>
      <h1 className="text-[70px] underline font-bold fixed uppercase left-[50vw]  -translate-x-1/2">
        Product Page
      </h1>

      <div className="flex gap-5 absolute top-1/3 left-1/2 -translate-x-1/2">
        <Link className="px-3 py-1 bg-green-600 rounded-3xl border-0 outline-0 text-shadow-amber-50" to="/product/men">Men's Collection</Link>
        <Link className="px-3 py-1 bg-green-600 rounded-3xl border-0 outline-0 text-shadow-amber-50" to="/product/women">Women's Collection</Link>
      </div>
    </div>
  );
};

export default Product;
