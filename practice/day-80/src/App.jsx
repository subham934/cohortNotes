import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Kodr from "./pages/Kodr";
import Kodex from "./pages/Kodex";
import AllCourses from "./pages/AllCourses";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
const App = () => {
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
              path: "kodex",
              element: <Kodex />,
            },
            {
              path: "kodr",
              element: <Kodr />,
            },
            {
              index: true,
              element: <AllCourses />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={allRoutes} />
    </div>
  );
};

export default App;
