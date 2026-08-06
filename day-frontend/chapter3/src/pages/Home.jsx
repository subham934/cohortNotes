import React, { useEffect } from "react";
import axios from "../utils/axios";

const Home = () => {
  const getProduct = async () => {
    try {
      const response = await axios.get("/products");
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // ye tab chalta hai jab component MOUNT hota hai
    console.log("Home.jsx Mounted");
    getProduct();

    // ye tab chalta hai jab component UNMOUNT hota hai
    return () => {
      console.log("Home.jsx Unmounted");
    };
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <button onClick={getProduct} className="cursor-pointer">
        Get Products
      </button>
    </div>
  );
};

export default Home;
