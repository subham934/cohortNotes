import React from 'react'

const Navbar = (props) => {
  return (
    <div className='h-15 w-full bg-emerald-600 flex justify-between items-center px-5'>
        <h1 className='text-3xl text-white font-bold'>Navbar</h1>
        {props.children}
    </div>
  )
}

export default Navbar

