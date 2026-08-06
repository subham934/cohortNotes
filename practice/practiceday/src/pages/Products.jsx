import React from 'react'
import {Link} from 'react-router-dom'
const Products = () => {
  return (
    <div>
    <div className='absolute top-[50vh] left-[50vw] -translate-1/2'>
      <h1 className='text-5xl bg-amber-300 px-5 py-2 rounded-2xl'>Products</h1>

      </div>
      <div  className='absolute top-[20vh] left-[50vw] -translate-1/2 flex gap-2'>
        <Link className='bg-blue-400 px-5 py-2 font-bold text-2xl rounded-2xl' to='/products/men'>Men's Product</Link>
        <Link className='bg-pink-400 px-5 py-2 font-bold text-2xl rounded-2xl' to='/products/women'>Women's Product</Link>
      </div>
    </div>
  )
}

export default Products