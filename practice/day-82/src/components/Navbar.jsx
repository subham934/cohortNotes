import React from 'react'

const Navbar = (props) => {
  return (
    <div className='h-10 w-full bg-emerald-600 flex justify-between items-center px-2'>
        <h1>This is Navbar </h1>
        {props.children}
    </div>
    
  )
}

export default Navbar