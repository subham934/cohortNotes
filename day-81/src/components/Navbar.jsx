// import React from 'react'

// const Navbar = (props) => {
//   return (
//     <div>
//       <h1>Navbar</h1>
//       <h2>{props.theme}</h2>
//       <button onClick={()=>{
//         props.setTheme(props.theme=='light'?'dark':'light')
//       }}>Change Theme</button>
//     </div>
//   )
// }

// export default Navbar

// ======================================

import React, { useState } from "react";

const Navbar = (props) => {
  const [newTheme, setNewTheme] = useState("");

  return (
    
    <div className="nav">
      <h1>Theme is {props.theme}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(newTheme);
          props.changeTheme(newTheme)
          setNewTheme("");
        }}
      >
        <input
          type="text"
          value={newTheme}
          onChange={(e) => {
            setNewTheme(e.target.value);
          }}
          placeholder="Enter Theme"
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Navbar;
