import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Footer = () => {
    const nav = useNavigate()
  return (
    <div className='w-full h-[10vh] bg-emerald-400 flex items-center justify-around'>
        <h1 className='w-fit bg-amber-200 px-2 py-1 font-bold text-2xl rounded-2xl'>Footer</h1>
        <button className='w-fit bg-amber-200 px-2 py-1 font-bold text-2xl rounded-2xl cursor-pointer' onClick={()=>{nav('/')}}>
            Home
        </button>
    </div>
  )
}

export default Footer;
