import React, { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'

const Footer = () => {
  const data = useContext(UserDataContext)

  return (
    <div className='absolute bottom-0 left-0 flex w-full items-center justify-around gap-3 bg-[rebeccapurple] px-5 py-3'>
      <h1 className='text-3xl leading-none text-white'>Footer</h1>
      <p className='text-3xl leading-none text-amber-300'>Welcome, {data}!!!</p>
    </div>
  )
}

export default Footer
