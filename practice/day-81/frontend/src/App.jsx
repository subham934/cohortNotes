// import React from 'react'
// import axios from 'axios'
// const App = () => {

//   const getData = async () => {
//     const response = await axios.get('http://localhost:3000/data')
//     console.log(response)
//   }

//   return (
//     <div>
//       <button onClick={getData}>Get Data</button>
//     </div>
//   )
// }

// export default App

// =============================================

// import React from "react";
// import Navbar from "./components/Navbar";
// import AllSections from "./components/AllSections";
// import Footer from "./components/Footer";

// const App = () => {
//   const courseData = {
//     courseName: "React",
//     price: 999,
//     instructor: "Subham",
//     duration: "6 Months",
//   };

//   return (

//     <div>
//       <Navbar />
//       <AllSections courseData={courseData} />
//       <Footer />
//     </div>

//   );
// };

// export default App;
// =============================================

import React from "react";
import Navbar from "./components/Navbar";
import { useState } from "react";

const App = () => {
  const [theme, setTheme] = useState("light");
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div>
      <Navbar theme={theme} changeTheme={changeTheme} />
      
    </div>
  );
};

export default App;
