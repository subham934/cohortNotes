import React, { createContext, useEffect, useState } from "react";
import { getAllProductData } from "../api/productApi";

export const ProductDataContext = createContext();

const ProductContext = (props) => {
  const [productData, setProductData] = useState([]);


  //   const getData = async () => {
//     const response = await axios.get("https://dummyjson.com/products/");
//     // console.log(response.data.products);
//     setProductData(response.data.products);
//   };

    const setData = async ()=>{
        const data =  await getAllProductData();
        setProductData(data)
    }


  useEffect(() => {
    setData();
  }, []);

  return (
    <div>
      <ProductDataContext.Provider value={productData}>
        {props.children}
      </ProductDataContext.Provider>
    </div>
  );
};

export default ProductContext;
 