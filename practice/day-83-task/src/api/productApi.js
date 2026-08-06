import axios from "axios";

export const getAllProductData = async () => {
  const response = await axios.get("https://dummyjson.com/products/");
  return response.data.products;
};
