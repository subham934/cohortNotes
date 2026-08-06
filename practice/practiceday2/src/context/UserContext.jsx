// import React from 'react'

// const UserContext = (props) => {
//   return (
//     <div>
//         {props.children}
//     </div>
//   )
// }

// export default UserContext

// =============================================

import React, { createContext } from "react";

export const UserDataContext = createContext();
const UserContext = (props) => {
  return (
    <div>
      <UserDataContext.Provider value={"Subham"}>
        {props.children}
      </UserDataContext.Provider>
    </div>
  );
};

export default UserContext;
