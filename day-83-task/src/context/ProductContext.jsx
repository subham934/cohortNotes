import { createContext, useEffect, useState } from "react";
import { getAllProductData } from "../api/productApi";

export const ProductDataContext = createContext();

const ProductContext = (props) => {
  const [productData, setProductData] = useState([]);


//   const getData = async () => {
//     const response = await axios.get("https://fakestoreapi.com/products");

//     setProductData(response.data);
//   };


let setData = async () =>{
    // const data = await getAllProductData()
    // setProductData(data)
    setProductData(await getAllProductData())
}

  useEffect(() => {
    // getData();
    setData()
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
