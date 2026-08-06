// import React from "react";
// import axios from "axios";

// const App = () => {
//   const getData = async () => {
//     const response = await axios.get("http://localhost:8000/data");
//     console.log(response);
//   };

//   return (
//     <>
//       Hello
//       <button onClick={getData}>Click</button>
//     </>
//   );
// };

// export default App;

// import Navbar from "./components/Navbar";
// import AllSection from "./components/AllSection";
// import Footer from "./components/Footer";

// const courseData = {
//   courseName: "Cohort 2.0",
//   instructor: "Sarthak",
//   mentor: "Anubhav",
//   duration: "6 months",
// };

// const App = () => {
//   return (
//     <div>
//       <Navbar />
//       <AllSection courseData={courseData} />
//       <Footer />
//     </div>
//   );
// };

// export default App;

// // ======================================

// import React, { useState } from "react";
// import Navbar from "./components/Navbar";

// const App = () => {
//   const [theme, setTheme] = useState("light");

//   return (
//     <div>
//       <Navbar theme={theme} setTheme={setTheme} />
//     </div>
//   );
// };

// export default App;

// ======================================

import React, { useState } from "react";
import Navbar from "./components/Navbar";

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


// Golden rule
// 👉 function jahan define hota hai, wahi execute hota hai
// Call kahaan se hua usse farak nahi padta.