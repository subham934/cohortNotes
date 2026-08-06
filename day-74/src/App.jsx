// import React from "react";

// const App = () => {
//   const submitHandler = (e) => {
//     e.preventDefault();
//     console.log("Form Submitted");
//   };

//   return (
//     <div>
//       <form
//         onSubmit={(e) => {
//           submitHandler(e);
//         }}
//       >
//         <input type="text" placeholder="Enter Text" />
//         <button>Submit</button>
//       </form>
//     </div>
//   );
// };

// export default App;

// =======================================

// import React, { useState } from "react";

// const App = () => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [allUsers, setAllUsers] = useState([]);

//   const submitHandler = (e) => {
//     e.preventDefault();
//     const newAllUsers = [...allUsers];
//     newAllUsers.push({username, email});
//     setAllUsers(newAllUsers);
//     console.log(newAllUsers);
//     setUsername("");
//     setEmail("");
//   };

//   //   const submitHandler = (e) => {
//   //   e.preventDefault();
//   //   setAllUsers([...allUsers, username])
//   //   console.log(allUsers);
//   //   setUsername("");
//   // }

//   return (
//     <div>
//       <form
//         onSubmit={(e) => {
//           submitHandler(e);
//         }}
//       >
//         <input
//           type="text"
//           required
//           placeholder="Enter Your Name"
//           value={username}
//           onChange={(e) => {
//             setUsername(e.target.value);
//           }}
//         />
//         <input
//           type="email"
//           required
//           placeholder="Enter Your Mail Id"
//           value={email}
//           onChange={(e) => {
//             setEmail(e.target.value);
//           }}
//         />
//         <button>Submit</button>
//       </form>

//       {allUsers.map((ele, id) => {
//         return <h1 key={id}>{ele.username}</h1>;
//       })}
//     </div>
//   );
// };

// export default App;

// =======================================

import React, {useState} from "react";

const App = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");


  const [allUsers, setAllUsers] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Form Submitted");
    const newAllUsers = [...allUsers, {username, email}];
    setAllUsers(newAllUsers);
    console.log(newAllUsers);
    setUsername("");
    setEmail(""); 
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          required
          placeholder="Enter Your Name"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="email"
          required
          placeholder="Enter Your Mail Id"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <button>Submit</button>
      </form>

      {allUsers.map((ele, id) => {
        return <h1 key={id}>{ele.username}</h1>;
      })}
    </div>
  );
};

export default App;

// =======================================
