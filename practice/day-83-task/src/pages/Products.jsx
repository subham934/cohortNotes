import React, { useContext } from "react";
import { ProductDataContext } from "../context/ProductContext";
import { Link } from "react-router-dom";

const Products = () => {
  const productData = useContext(ProductDataContext);

  let renderData = "";

  if (productData.length > 0) {
    renderData = productData.map((elem, idx) => {
      return (
        <Link
          target="_blank"
          className="product"
          key={elem.id}
          to={`/products/${elem.id}`}
        >
          <div>
            <img src={elem.images[0]} alt="" />
            <h2>{elem.title}</h2>
          </div>
        </Link>
      );
    });
  }

  return (
    <>
      <div className="allProducts">{renderData}</div>
    </>
  );
};

export default Products;
