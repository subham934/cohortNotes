'use client'
import React, {useState, useEffect} from 'react'

const page = () => {

    const [products, setProducts] = useState([]);

    let data = async ()=>{
        
        let res = await fetch('https://fakestoreapi.com/products');
        let data = await res.json();
        setProducts(data);
    }

    useEffect(()=>{
        data();
    },[]);

  return (
    <div className='p-6'>
        <h1>All Products Lists here</h1>
        <div>
          {products.map((elem) => (
            <h1 className='text-xl' key={elem.id} onClick={() => console.log("Hello")}>{elem.title}</h1>
          ))}
        </div>
    </div>
  )
}
export default page