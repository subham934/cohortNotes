import React, { useState } from "react";

const TwoWayPrac = () => {
  //   const arr = ["sarthak", "harsh", "ajay", "ankit", "hitesh"];
  //   const [num, setNum] = useState(0);

  const [marks, setMarks] = useState([60, 55, 89, 12, 29]);
  //   let marks = [88, 76, 90, 67, 28];

  function graceStudent() {
    const newMarks = marks.map(function (elem) {
      if (elem >= 95) {
        return elem;
      } else {
        return elem + 5;
      }
    });
    setMarks(newMarks);
  }

  return (
    <div>
      {/* <div className="bg-amber-300 rounded-3xl px-2 py-2">
        <div className="box block mt-10 text-6xl font-extrabold text-center">
        {num}
      </div>

      <button
        className="px-9 py-1 rounded font-bold text-xl my-5 cursor-pointer bg-red-500 text-white"
        onClick={() => {
          const rdm = Math.floor(Math.random() * 100);
          setNum(rdm);
        }}
      >
        Click Here
      </button>
      </div> */}

      {/* <div className="text-center">
        <div className="box block mt-10 text-6xl font-extrabold">
          {arr[num]}
        </div>

        <button
          className="px-9 py-1 rounded font-bold text-xl my-5 cursor-pointer bg-red-500 text-white"
          onClick={() => {
            const rdm = Math.floor(Math.random() * arr.length);
            setNum(rdm);
          }}
        >
          Click Here
        </button>
      </div> */}

      <div className="text-center">
        {marks.map((elem, idx) => {
          return (
            <h1 key={idx+1}>
              Marks of Student {idx + 1} is {elem} ({elem >= 33 ? "PASS" : "FAIL"})
            </h1>
          );
        })}

        <button
          className="px-9 py-1 rounded font-bold text-xl my-5 cursor-pointer bg-red-500 text-white"
          onClick={graceStudent}
        >
          Give them Grace
        </button>
      </div>
    </div>
  );
};

export default TwoWayPrac;
