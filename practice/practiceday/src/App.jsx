import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Courses from './pages/Courses'
import About from './pages/About'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Products from './pages/Products'
import Men from './pages/Men'
import Women from './pages/Women'
import RandomAbout from './pages/RandomAbout'
import Cohort1 from './pages/Cohort1'
import AnyCourse from './pages/AnyCourse'
import CourseDetail from './pages/CourseDetail'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <div>
      
      <Navbar/>
      
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/courses" element={<Courses/>} />


        {/* Nested Routes */}
        <Route path='/products/men' element={<Men/>} />
        <Route path='/products/women' element={<Women/>} />

        {/* Dynamic Routes */}
        <Route path="/about/:ID" element={<RandomAbout/>} />
        
        {/* Nested Routes */}
        <Route path='/courses/cohort1' element={<Cohort1/>} />

        
        {/* Dynamic Routes */}
        <Route path="/courses/:courseId" element={<AnyCourse/>} />

        {/* Nested Dynamic Route */}
        <Route path="/courses/:courseId/detail" element={<CourseDetail />} />

        {/* Not Found Page */}
        <Route path="*" element={<NotFound />} />

      </Routes>

      <Footer/>
    </div>
  )
}

export default App
