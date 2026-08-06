// import React, { useEffect, useState } from "react";

// const App = () => {
//   const [count, setCount] = useState(0);
//   const [title, setTitle] = useState("");

//   useEffect(() => {
//     console.log("Hello");
//   }, [count]);

//   return (
//     <div>
//       <input type="text" placeholder="Enter Data" value={title} onInput={(e)=>setTitle(e.target.value)} />
//       <h1>{count}</h1>
//       <button className="btn" onClick={() => setCount(count + 1)}>Increment</button>
//       <button className="btn" onClick={() => (count > 0 ? setCount(count - 1) : setCount(0))}>
//         Decrement
//       </button>
//     </div>
//   );
// };

// export default App;

// ============================================================

// import React, { useEffect, useState } from 'react'
// import axios from 'axios'

// const App = () => {

//   const [allPokemon, setAllPokemon] = useState([])
//   const getData = async () => {
//     const response = await axios.get("https://pokeapi.co/api/v2/pokemon")
//     setAllPokemon(response.data.results)
//     console.log(response.data.results)
//   }

//   useEffect(() => {
//     getData()
//   }, [])

//   return (
//     <div>
//       <button onClick={getData}>click</button>
//       {
//         allPokemon.map((elem, idx)=>{
//           return(
//             <div key={idx}>
//               <h1>{elem.name}</h1>
//             </div>
//           )
//         })
//       }
//     </div>
//   )
// }

// export default App
// ============================================================

// import React, { use, useEffect, useState } from "react";
// import axios from "axios";
// const App = () => {
//   const [user, setUser] = useState("");
//   const [num, setNum] = useState(0);

//   const getData = async () => {
//     const response = await axios.get("https://randomuser.me/api/");
//     setUser(
//       response.data.results[0].name.first +
//         " " +
//         response.data.results[0].name.last,
//     );
//   };

//   const incNum = () => {
//     setNum(num + 1);
//   };

//   useEffect(() => {
//     getData();
//   }, [num]);

//   return (
//     <div>
//       <h1>{user}</h1>
//       <h1>{num}</h1>
//       <button className="btn" onClick={incNum}>
//         Increase
//       </button>
//     </div>
//   );
// };

// export default App;

// ============================================================

import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Product from "./components/Product";
import Courses from "./components/Courses";
import Men from "./components/Men";
import Women from "./components/Women";
import RandomAbout from "./components/RandomAbout";
import Cohort1 from "./components/Cohort1";
import AnyCourse from "./components/AnyCourse";
import CourseDetail from "./components/CourseDetail";
import NotFound from "./components/NotFound";
import Footer from "./components/Footer";
import AllProducts from "./components/AllProducts";
import CoursesName from "./components/CoursesName";

const App = () => {
  return (
    <div className="flex flex-col h-screen justify-between bg-amber-200">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* <Route path="/product" element={<Product />} />
        <Route path="/product/men" element={<Men />} />
        <Route path="/product/women" element={<Women />} /> */}

        <Route path="/product" element={<Product />}>
          <Route path="/product" element={<AllProducts />} />
          <Route path="/product/men" element={<Men />} />
          <Route path="women" element={<Women />} />
        </Route>

        <Route path="/about/:Id" element={<RandomAbout />} />

        <Route path="/courses" element={<Courses />}>
          <Route path='/courses' element={<CoursesName/>} />
          <Route path="/courses/cohort1" element={<Cohort1 />} />
          <Route path="/courses/:ID" element={<AnyCourse />} />
          <Route path="/courses/:ID/detail" element={<CourseDetail />} />
        </Route>

        {/* <Route path="/courses" element={<Courses />}>
          <Route path=":ID" element={<AnyCourse />}>
            <Route path="detail" element={<CourseDetail />} />
          </Route>
        </Route> */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
