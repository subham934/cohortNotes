// import React from 'react'

// const UserContext = (props) => {
//   return (
//     <div className='context-div'>
//         {props.children}
//     </div>
//   )
// }

// export default UserContext;

// =============================================

import React, { createContext } from "react";

export const UserDataContext = createContext();


const UserContext = (props) => {

    const user = "Subham"
  return (
    <div className="context-div">
      <UserDataContext.Provider value={user}>
        {props.children}
      </UserDataContext.Provider>
    </div>
  );
};



export default UserContext;



// =============================================
