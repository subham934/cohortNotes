import React, { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'

const Footer = () => {
  const user = useContext(UserDataContext);

  return (
    <div className='absolute bottom-0 w-screen h-10 bg-blue-500 flex justify-between items-center px-2'>
        <h1>This is Footer</h1>
        <h2>Welcome, {user}!</h2>
    </div>
  )
}

export default Footer