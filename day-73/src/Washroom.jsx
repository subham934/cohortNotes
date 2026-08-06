import React from 'react'

const Washroom = (props) => {
   let color;
  if (props.user === "Male") {
    color = "bg-blue-500";
  } else if (props.user === "Female") {
    color = "bg-pink-500";
  } else {
    color =
      "bg-[conic-gradient(red,orange,yellow,green,blue,indigo,violet,red)]";
  }

  return (
    <div
      className={`w-[300px] h-[200px] flex justify-center items-center text-2xl text-white font-bold ${color}`}
    >
      {props.user} Washroom
    </div>
  )
}

export default Washroom;
