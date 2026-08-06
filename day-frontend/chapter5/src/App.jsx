import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  decrement,
  increment,
  incrementByAmount,
} from "./redux/slices/counterSlice";
import Navbar from "./components/Navbar";

const App = () => {
  const num = useSelector((state) => state.counter.value);

  const dispatch = useDispatch();

  return (
    <div>
      <h1>{num}</h1>

      <button
        onClick={() => {
          dispatch(increment());
        }}
      >
        Increment
      </button>
      <button
        onClick={() => {
          dispatch(decrement());
        }}
      >
        Decrement
      </button>

      <button
        onClick={() => {
          dispatch(incrementByAmount());
        }}
      >
        Increment by 5
      </button>

      <Navbar/>
    </div>
  );
};

export default App;
