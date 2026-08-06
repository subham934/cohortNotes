today we will study api calling



we will create a axios.jsx file 

-----------------------
src > utils > axios.jsx
-----------------------

import axios from "axios";

const instance = axios.create({
  baseURL: "https://fakestoreapi.com/",
  //   withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    console.log("request ==> ", config);

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    console.log("response ==> ", response);
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default instance;

===================================
=> with the help of interceptors , we can pass anything with every request.
=> Interceptors ka kaam hota hai ki har request jaane se pehle ya response aane ke baad kuch kaam karo automatically.

----------------------
src > pages > Home.jsx
----------------------

import React from "react";
import axios from "../utils/axios";

const Home = () => {
  const getProduct = async () => {
    try {
     const response = await axios.get('/products')
     console.log(response.data);

    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <h1>Home</h1>
      <button onClick={getProduct} className="cursor-pointer">Get Products</button>
    </div>
  );
};

export default Home; 


//================================================================


when we go to the Navbar and click on Home or Recipes , we see that the previous page is unmounted and the new page gets mounted. so we have to make sure that the previous page is unmounted and the new page gets mounted.
=> we can also update the content inside /recipes/details/${id} , so the recipe gets updated.
=> The process from mount -> update -> unmount is called component lifecycle. and to implement it we have to use useEffect.

useEffect andar ka code   → MOUNT pe chalta hai   🟢
useEffect return ka code  → UNMOUNT pe chalta hai 🔴


----------------------
src > pages > Home.jsx
----------------------

import React, { useEffect } from "react";
import axios from "../utils/axios";

const Home = () => {
  const getProduct = async () => {
    try {
     const response = await axios.get('/products')
     console.log(response.data);
     
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {

    // ye tab chalta hai jab component MOUNT hota hai
    console.log("Home.jsx Mounted");
    getProduct()



    // ye tab chalta hai jab component UNMOUNT hota hai
    return () => {
      console.log("Home.jsx Unmounted");
    }
    
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <button onClick={getProduct} className="cursor-pointer">Get Products</button>
    </div>
  );
};

export default Home;


<!--=============================== -->



✅ Update = component ki state change hona

✅ Update mein unmount/mount nahi hota
   Component wahi rehta hai, sirf data/view badlta hai

✅ useEffect dependency array:
   []        → sirf ek baar, mount pe
   [value]   → mount pe + value change hone pe  
   kuch nahi → har render/update pe
   return    → sirf unmount pe