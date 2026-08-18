import React from 'react'
import { NavLink } from 'react-router'

const Navbar = () => {
  return (
    <div className='w-full flex items-center justify-between px-10 py-4 bg-[#16202b] text-white'>
        <h1 className='font-bold text-xl italic text-[yellow]'>Adani Global</h1>
        <div>
            <NavLink className={({isActive})=> isActive ? "text-blue-500 mx-2 font-semibold" : "mx-2 font-light hover:text-blue-500 "} to="/">Home</NavLink>
            <NavLink className={({isActive})=> isActive ? "text-blue-500 mx-2 font-semibold" : "mx-2 font-light hover:text-blue-500 "} to="/about">About</NavLink>
            <NavLink className={({isActive})=> isActive ? "text-blue-500 mx-2 font-semibold" : "mx-2 font-light hover:text-blue-500 "} to="/product">Product</NavLink>
            <NavLink className={({isActive})=> isActive ? "text-blue-500 mx-2 font-semibold" : "mx-2 font-light hover:text-blue-500 "} to="/users">Users</NavLink>
        </div>
        <div></div>
    </div>
  )
}

export default Navbar;
