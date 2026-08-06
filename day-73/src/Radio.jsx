import React from "react";
import { useState } from "react";
import Washroom from "./Washroom";

const Radio = () => {
  const [gender, setGender] = useState("Male");

  function changeGender() {
    if (gender === "Male") {
      setGender("Female");
    } else if (gender === "Female") {
      setGender("Other");
    } else {
      setGender("Male");
    }
  }

  return (
    <div className="flex flex-col gap-5 text-center">
      <h1 className="block mt-10 text-6xl font-extrabold text-amber-900">
        {gender}
      </h1>
      <button
        className="px-9 py-1 rounded font-bold text-xl my-5 cursor-pointer bg-red-500 text-white"
        onClick={changeGender}
      >
        Change Gender
      </button>
      <Washroom user={gender} />
    </div>
  );
};

export default Radio;
