"use client";
import React, { useState } from 'react';

const page = () => {

  const [count, setCount] = useState(0);
  

  return (
    <div>
      <h1>This is home page element</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default page;
