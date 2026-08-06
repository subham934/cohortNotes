import React, { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'

const Section = (props) => {

  const data = useContext(UserDataContext);

  return (
    <div className='h-[90vh] bg-amber-200 flex flex-col items-center justify-center'>
      <h1 className='text-5xl font-semibold'>Section</h1>
      <p className='text-xl text-blue-700 font-bold py-3'>{props.brand}</p>
      {props.children}
      <p className='text-xl text-blue-700 font-bold py-3'>Welcome, {data}!!!</p>
    </div>
  )
}

export default Section