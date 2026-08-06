// import React from "react";
// import { useState } from "react";
// import { useEffect } from "react";

// const App = () => {
//   const [counter, setCounter] = useState(0);
//   const [title, setTitle] = useState("");
//   useEffect(function () {
//     console.log("hello");
//   },[counter]);
//   return (
//     <div>
//       <input
//         type="text"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />
//       <h1>{counter}</h1>
//       <button onClick={() => setCounter(counter + 1)}>Increase</button>
//     </div>
//   );
// };

// export default App;x

// =======================================

// import React from 'react'
// import { useEffect } from 'react'
// import { useState } from 'react'

// const App = () => {

//   const [number1, setNumber1] = useState(0)
//   const [number2, setNumber2] = useState(0)
//   const [number3, setNumber3] = useState(0)

//   useEffect(()=>{
//     console.log("use effect chal raha hai");

//   },[number1, number2])

//   return (
//     <div>
//       <h1>{number1}</h1>
//       <button onClick={()=>{
//         setNumber1(Math.floor(Math.random()*100))
//       }}>Change Number 1</button>

//       <br /><br />
//       <h1>{number2}</h1>
//       <button onClick={()=>{
//         setNumber2(Math.floor(Math.random()*100))
//       }}>Change Number 2</button>
//       <br /><br />
//       <h1>{number3}</h1>
//       <button onClick={()=>{
//         setNumber3(Math.floor(Math.random()*100))
//       }}>Change Number 3</button>
//     </div>
//   )
// }

// export default App;

// =======================================

// import React from "react";
// import { useEffect } from "react";
// import axios from "axios";
// import { useState } from "react";

// const App = () => {
//   const [allPokemon, setAllPokemon] = useState([]);
//   const getData = async () => {
//     const response = await axios.get("https://pokeapi.co/api/v2/pokemon");
//     setAllPokemon(response.data.results);
//     console.log(response.data.results);
//   };

//   useEffect(() => {
//     getData();
//   }, []);

//   return (
//     <div>
//       <button onClick={getData}>click</button>
//       {allPokemon.map((elem, id) => {
//         return (
//           <div key={id}>
//             <h1>{elem.name}</h1>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default App;

// =======================================

import axios from "axios";

import { useState } from "react";
import { useEffect } from "react";

const App = () => {
  const [user, setUser] = useState("");
  const [num, setNum] = useState(0)

  const getData = async () => {
    const response = await axios.get("https://randomuser.me/api/");
    setUser(
      response.data.results[0].name.first +
        " " +
      response.data.results[0].name.last,
    );
  };

  useEffect(() => {
    getData();
  }, [num]);

  return (
    <div>
      <h1>{user}</h1>
      <h2>{num}</h2>
      <button onClick={()=>setNum(num+1)}>Click Me</button>
    </div>
  );
};

export default App;