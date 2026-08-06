import React from "react";
import { useState } from "react";

const TwoWayBinding = () => {
  // const [num, setNum] = useState(0)
  // const arr = ['sarthak', 'harsh', 'ajay', 'ankit', 'hitesh']
  // const [name , setName] = useState("Name")

  const [marks, setMarks] = useState([60, 55, 89, 12, 29]);
  //   let marks = [88, 76, 90, 67, 28];

  function graceStudent() {
    const newMarks = marks.map(function (elem) {
        if(elem>=95){
            return elem;
        }else{
            return elem+5
        }
    });
    setMarks(newMarks);
  }

  return (
    <div className="text-center">
      {/* <div className="box block mt-10 text-6xl font-extrabold">
        {num}
      </div> */}

      {/* <button className='px-9 py-1 rounded font-bold text-xl my-5 cursor-pointer bg-red-500 text-white' onClick={()=>{
            const rdm = Math.floor(Math.random()*100)
            setNum(rdm) 
        }}>
            Click Here
        </button> */}

      {/* <div className="box block mt-10 text-6xl font-extrabold">
        {name}
      </div>

        <button className='px-9 py-1 rounded font-bold text-xl my-5 cursor-pointer bg-red-500 text-white' onClick={()=>{
            const rdm = Math.floor(Math.random()*(arr.length))
            setName(arr[rdm]) 
        }}>
            Click Here
        </button> */}

      {marks.map((elem, id) => {
        return (
          <h1 key={id} className="text-blue-500 font-bold text-3xl">
            Marks of Student {id + 1} is {elem} ({elem >= 33 ? "PASS" : "FAIL"})
          </h1>
        );
      })}

      <button
        className="bg-emerald-700 px-7 py-2 rounded-xl my-3 text-white font-bold"
        onClick={graceStudent}
      >
        Give Them Grace
      </button>
    </div>
  );
};

export default TwoWayBinding;
