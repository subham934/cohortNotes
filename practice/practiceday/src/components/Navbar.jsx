import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='bg-blue-400 flex items-center justify-between px-5 py-2'>
        <h1 className='text-4xl font-medium text-amber-50'>Morgan</h1>

        <ul className='flex gap-3 font-medium text-2xl text-white'>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/about'>About</Link></li>
          <li><Link to='/products'>Products</Link></li>
          <li><Link to='/courses'>Courses</Link></li>
        </ul>
    </div>
  )
}

export default Navbar
