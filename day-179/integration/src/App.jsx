import React from 'react'
import { axiosInstance } from "./config/axiosInstance";
const App = () => {

  let getData = async () => {
    try {
      let res = await axiosInstance.get('/products');
      console.log("This is UI app -> ",res);
    } catch (error) {
      console.error(error);
    }
  }
  getData()

  return (
    <div>
      <h1>Hello, Integration App!</h1>
    </div>
  )
}

export default App