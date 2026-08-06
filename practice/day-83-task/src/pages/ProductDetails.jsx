import React, { useContext } from "react";
import { ProductDataContext } from "../context/ProductContext";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const productData = useContext(ProductDataContext);

  const { productId } = useParams();

  let selectedProduct = "";
  if (productData.length > 0) {
    selectedProduct = productData.find((elem) => productId == elem.id);
  }

  return (
    <div>
      <div>
        <img src={selectedProduct.thumbnail} alt="" />
        <h2>{selectedProduct.title}</h2>
        <p>{selectedProduct.description}</p>
        <h5>${selectedProduct.price}</h5>
      </div>
    </div>
  );
};

export default ProductDetails;
