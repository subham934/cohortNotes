import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
      </Routes>
    </div>
  );
};

export default App;



// const getFirstData = async (id) => {
//   const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
//   console.log(response.data);
// };

{
  /* <h1>Ola Amigo</h1>

      <button onClick={getData}>GetData</button> */
}

{
  /* <button onClick={()=>{
        getFirstData(2)
      }}>First Products</button> */
}


