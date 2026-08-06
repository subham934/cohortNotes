import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate = useNavigate()
  return (
    <div className='footer'>
        <h1>Footer</h1>
        <button className="btn" onClick={()=>navigate("/")}>Home</button>
    </div>
  )
}

export default Footer