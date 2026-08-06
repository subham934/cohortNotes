import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Sections from './components/Sections'

const App = () => {
  return (
    <div>
      <Navbar>
        <h1 className='text-blue-500'>Danish Bhai!!!!</h1>
      </Navbar>
      <Sections brand="Dhar Jewellers">
          <h1>Welcome to React</h1>
          <h2>Halku</h2>
      </Sections>
      <Footer/>
    </div>
  )
}

export default App