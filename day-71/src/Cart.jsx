import React from 'react'

const Cart = (props) => {

   const boxStyle = {
    width: "150px",
    height: "50px",
    backgroundColor: "orange",
    borderRadius: "8px"
  };
  
  return (
    <div className='bg-green-400 rounded text-amber-50 px-5 py-3 w-fit text-4xl font-semibold border-2 border-red-500 my-3'>
      <h1>{props.user} {props.age} </h1>
    </div>

    // <div style={boxStyle}>
    //   <h1>{props.user} {props.age} </h1>
    // </div>
  )
}

export default Cart


// ===============================================

// import React from "react";
// const Cart = ({ user, age }) => {
//   return (
//     <div className="bg-black rounded text-amber-50 px-5 py-3 w-fit text-4xl font-semibold border-2 border-red-500 my-3">
//       <h1>
//         {user} {age}
//       </h1>
//     </div>
//   );
// };

// export default Cart;
