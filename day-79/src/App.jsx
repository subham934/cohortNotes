import React from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import { Route, Routes } from "react-router-dom";
import Product from "./pages/Product";
import Navbar from "./components/Navbar";
import Men from "./pages/Men";
import Women from "./pages/Women";
import RandomAbout from "./pages/RandomAbout";
import Courses from "./pages/Courses";
import Cohort1 from "./pages/Cohort1";
import AnyCourse from "./pages/AnyCourse";
import CourseDetail from "./pages/CourseDetail";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/product" element={<Product />} />
        <Route path="/courses" element={<Courses/>} />

        {/* Nested Routes */}
        <Route path="/product/men" element={<Men />} />
        <Route path="/product/women" element={<Women />} />


        {/* Dynamic Route */}
        <Route path="/about/:random" element={<RandomAbout/>} />

        {/* Nested Routes */}
        <Route path="/courses/cohort1" element={<Cohort1/>} />

        {/* Dynamic Route */}
        <Route path="/courses/:ID" element={<AnyCourse/>} />
        
        {/* Nested Dynamic Route */}
        <Route path="/courses/:ID/detail" element={<CourseDetail/>} />
        
        
        {/* Not Found Page */}
        <Route path="*" element={<NotFound/>} />
        
        {/* <Route path="/product" element={<Product />}>
          <Route path="men" element={<Men />} />
          <Route path="women" element={<Women />} />
        </Route> */}
      </Routes>
    </div>
  );
};

export default App;

