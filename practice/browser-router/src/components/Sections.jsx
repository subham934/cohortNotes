// import React from "react";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import { Route, Routes } from "react-router-dom";
// import Courses from "../pages/Courses";
// import Products from "../pages/Products";
// import About from "../pages/About";
// import Home from "../pages/Home";
// import Men from "../pages/Men";
// import Women from "../pages/Women";

// const Sections = () => {
//   return (
//     <div>
//       <Navbar />

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/courses" element={<Courses />} />
//         <Route path="/products" element={<Products />}>
//           <Route path="/products/men" element={<Men />} />
//           <Route path="women" element={<Women />} />
//         </Route>
//       </Routes>

//       <Footer />
//     </div>
//   );
// };

// export default Sections;

// =========================================================

// import React from 'react'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import Layout from './Layout'
// import Home from '../pages/Home'
// import About from '../pages/About'
// import Courses from '../pages/Courses'
// import Products from '../pages/Products'
// import Men from '../pages/Men'
// import Women from '../pages/Women'

// const Sections = () => {
//   const allRoutes = createBrowserRouter([
//     {
//         path: '/',
//         element: <Layout/>,
//         children:[
//             {
//                 index:true,
//                 element: <Home/>
//             },
//             {
//                 path: 'about',
//                 element: <About/>
//             },{
//                 path: 'courses',
//                 element: <Courses/>
//             },
//             {
//                 path: "products",
//                 element: <Products/>,
//                 children:[
//                     {
//                         path: 'men',
//                         element: <Men/>
//                     },
//                     {
//                         path: 'women',
//                         element: <Women/>
//                     }
//                 ]
//             }
//         ]
//     }
//   ])

//     return (
//     <>
//         <RouterProvider router={allRoutes}/>
//     </>
//   )
// }

// export default Sections

// =========================================================

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import Home from "../pages/Home";
import About from "../pages/About";
import Courses from "../pages/Courses";
import Products from "../pages/Products";
import Men from "../pages/Men";
import Women from "../pages/Women";
import AnyCourse from "../pages/AnyCourse";
import CourseDetail from "../pages/CourseDetail";

const allRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "courses",
        element: <Courses />,
        children: [
          {
            path: ":courseId",
            element: <AnyCourse />,
            children: [
              {
                path: "detail",
                element: <CourseDetail />,
              },
            ],
          },
        ],
      },
      {
        path: "products",
        element: <Products />,
        children: [
          {
            path: "men",
            element: <Men />,
          },
          {
            path: "women",
            element: <Women />,
          },
        ],
      },
    ],
  },
]);

const Sections = () => {
  return <RouterProvider router={allRoutes} />;
};

export default Sections;