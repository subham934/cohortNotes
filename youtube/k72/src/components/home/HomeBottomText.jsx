import React from 'react'
import { Link } from 'react-router'

const HomeBottomText = () => {
  return (
    <div className='font-[font2] flex items-center justify-center gap-2 '>
        <Link className='text-[6.5vw] hover:border-[#D3FD50] hover:text-[#D3FD50] transition-all duration-300  leading-[6vw] border-5 border-white rounded-full px-10 pt-5 uppercase' to='/projects' >Projects</Link>
        <Link className='text-[6.5vw] hover:border-[#D3FD50] hover:text-[#D3FD50] transition-all duration-300 leading-[6vw] border-5 border-white rounded-full px-10 pt-5 uppercase' to='/agence' >Agence</Link>
    </div>
  )
}

export default HomeBottomText