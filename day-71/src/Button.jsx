import React from "react";

const Button = ({ name }) => {
  return (
    <div>
      <h1 className="text-3xl text-emerald-400 font-black cursor-pointer px-1.5 py-1 border-amber-400 rounded-2xl border-5 mb-1 max-w-fit">
        {name}
      </h1>
    </div>
  );
};

export default Button;
