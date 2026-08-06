import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Kodr from "./pages/Kodr";
import Kodex from "./pages/Kodex";
import AllCourses from "./pages/AllCourses";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/*<Route path="/courses">
           <Route path="/courses" element={<Courses />}/>
          <Route path="/courses/kodr" element={<Kodr />} />
          <Route path="kodex" element={<Kodex />} />
          </Route> */}
        {/* We can do the above if we want and that would solve the problem of overlap like we saw last time */}

        <Route path="/courses" element={<Courses />}>
          <Route path="/courses" element={<AllCourses />} />
          <Route path="/courses/kodr" element={<Kodr />} />
          <Route path="kodex" element={<Kodex />} />
        </Route>
      </Routes>
      <Navbar />
      <Footer />
    </>
  );
};

export default App;
