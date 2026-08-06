import React from "react";

const Card = (props) => {
  return (
    <div className="lg:w-[23vw] md:w-[30vw] sm:w-[45vw] rounded-xl py-8 px-8 text-center flex flex-col items-center h-80 bg-white text-black">
      <img
        src={props.img}
        alt="image"
        className="h-24 w-24 object-center rounded-full object-cover"
      />
      <h1 className="text-2xl font-semibold mt-2">{props.username}</h1>
      <h5 className="text-lg text-blue-500 font-semibold my-3">{props.role}</h5>
      <p className="text-sm font-medium leading-tight">{props.desc}</p>
      <button
        onClick={props.onClick}
        className="px-4 py-2 rounded bg-red-600 text-white font-semibold mt-3 text-xs cursor-pointer active:scale-95 transition-all duration-300 ease-in-out"
      >
        Remove
      </button>
    </div>
  );
};

export default Card;
