import React from "react";

const Navbar = (props) => {
  return (
    <div className="bg-pink-400 mb-1 flex items-center justify-between text-white px-8 py-3 mask-clip-padding">
      <h2 className="text-3xl">{props.title}</h2>
      <div className="flex gap-10">
        {props.links.map((elem, idx) => {
          return (
            <h4 className="text-xl text-zinc-300" key={idx}>
              {elem}
            </h4>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;
