import React from "react";
import { useState } from "react";
import TwoWayBinding from "./TwoWayBinding";
import TwoWayPrac from "./TwoWayPrac";
import Radio from "./Radio";

const App = () => {
  const [value, setValue] = useState(0);

  const clickIncr = () => {
    setValue(value + 1);
  };

  const clickDecr = () => {
    if (value > 0) {
      setValue(value - 1);
    }
  };

  return (
    <div className="flex flex-col justify-start items-center h-screen w-full bg-amber-200">
      <h1 className="block mt-10 text-6xl font-extrabold text-cyan-900">{value}</h1>
      <div className="flex gap-2">
        <button
          className="px-9 py-1 rounded font-bold text-xl my-5 cursor-pointer bg-emerald-900 text-white"
          onClick={clickIncr}
        >
          Increase
        </button>

        <button
          className="px-9 py-1 rounded font-bold text-xl my-5 cursor-pointer bg-red-500 text-white"
          onClick={clickDecr}
        >
          Decrease
        </button>
      </div>

      {/* <TwoWayPrac/> */}
      {/* <TwoWayBinding/> */}
      <Radio/>
    </div>
  );
};

export default App;
