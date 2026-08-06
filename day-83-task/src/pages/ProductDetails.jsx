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

  //   console.log(selectedProduct);

  return (
    <div className="main">
      <div className="productDetails">
        <img src={selectedProduct.image} alt={selectedProduct.title} />
        <h2>{selectedProduct.title}</h2>
        <h5>${selectedProduct.price}</h5>
      </div>
    </div>
  );
};

export default ProductDetails;
