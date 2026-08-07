Q). agar mera parent component rerender hota hai toh kya uska child component bhi re-render hoga?

yes, parent component rerender hota hai toh child component bhi re-render hoga. 

1. Initial Render (App First Time Chala)
   └── Parent & Child functions run hote hain
   └── Full Virtual DOM Tree banta hai
   └── Pehli baar me Pura Real DOM create hota hai

2. State Update Trigger
   └── Component me State Update hoti hai (e.g. setState / useState)

3. Re-render Trigger
   └── Parent Component function dubara chalta hai
   └── Child Component function BHI dubara chalta hai (by default)

4. Virtual DOM Generation
   └── Naya Virtual DOM Tree banta hai (Parent + Child ka updated state/props ke saath)

5. Diffing & Reconciliation
   └── React Purane Virtual DOM vs Naye Virtual DOM ko compare karta hai
   └── Dekhta hai ki exact konsa HISSA badla hai

6. Real DOM Update (Commit Phase)
   └── Sirf wo badla hua part Real DOM me update (paint) hota hai




-------------------
Profilling in React
-------------------

Profiling in React means measuring how your components render, where time is spent, and what causes re-renders—so you can optimize performance.

Profiling tells you exactly where time is really spent, so you only optimize what's worth optimizing.

React DevTools includes a Profiler tab. Recording a session while you interact with your app shows you exactly whcih components rendered, how long each took, and, why each one re-rendered.


🔍 What is React Profiling?
It helps you answer questions like:

Why is this component re-rendering?
Which part of my app is slow?
How long does rendering take?


//========================================

lets create a react app, inside it, we'll create App.jsx and About.jsx and write as below

-------
App.jsx
-------

import React, { useState } from 'react'
import About from './components/About'

const App = () => {
  console.log('App rendering...')
  const [count, setCount] = useState(0)
  
  return (
    <div className="p-5">
      <h1>Count - {count}</h1>
      <button className='py-2 px-8 mt-5 mb-5 rounded-md bg-blue-500' onClick={() => setCount(count + 1)}>Increment</button>
      <About/> 
    </div>
  )
}

export default App


---------
About.jsx
---------

import React from 'react'

const About = () => {
    console.log('About rendering...')
  return (
    <div>About</div>
  )
}

export default About


=> now, why is the About component rendering twice when we click the increment button? react ka ak rule ki agar parent component re-render hoga toh uske saath uske child component bhi re-render hoga.

Q). What do you  mean by re-render? It means that ki jo state update hota hai usko re-render karna naki poore application ko re-render karna.

=> Memoization in React is a performance optimization technique that caches the results of expensive calculations, functions, or component renders to avoid redundant work during re-renders

What is memorization?
=> memorization main 3 cheez hota hai,
1. react.memo = functional component ko memorize karna
2. use callback() = function ko memorize karna
3. useMemo() = value ko memorize karna

now, if we memorize the child component then it will not re-render when the parent component re-renders.

---------
About.jsx
---------

import React from "react";

const About = React.memo(
  () => {
    console.log("About rendering...");
    return <div>About</div>;
  }
);

export default About;


=> now, that we have memorized the child component then it will not re-render when the parent component re-renders, which , in this case is done with the increment button.


<!-- -------------------------------- -->
// now if we pass the count value to the child component then it will re-render when the parent component re-renders.

-------
App.jsx
-------

import React, { useState } from 'react'
import About from './components/About'

const App = () => {
  console.log('App rendering...')
  const [count, setCount] = useState(0)
  
  return (
    <div className="p-5">
      <h1>Count - {count}</h1>
      <button className='py-2 px-8 mt-5 mb-5 rounded-md bg-blue-500' onClick={() => setCount(count + 1)}>Increment</button>
      <About count={count}/> 
    </div>
  )
}

export default App

// we have passed the count to About component, so when we click on button to update the count , then the value of count increase , and since we have passed the count to About component, it will re-render when the parent component re-renders.


=> we have discussed one way to write memoization in react , now let's see another way to write memoization in react.

-------------
About.jsx
-------------

import React from 'react'

const About = () => {
    console.log('About rendering...')
  return (
    <div>About</div>
  )
}

export default React.memo(About)

-------
App.jsx
-------

import React, { useState } from 'react'
import About from './components/About'

const App = () => {
  console.log('App rendering...')
  const [count, setCount] = useState(0)
    
  return (
    <div className="p-5">
      <h1>Count - {count}</h1>
      <button className='py-2 px-8 mt-5 mb-5 rounded-md bg-blue-500' onClick={() => setCount(count + 1)}>Increment</button>
      <About /> 
    </div>
  )
}

export default App


=> now, we have used React.memo() to memoize the About component, which means that it will not re-render when the parent component re-renders, which, in this case is done with the increment button.



//====================================

--------
App.jsx
--------

import React, { useState } from 'react'
import About from './components/About'

const App = () => {
  console.log('App rendering...')
  const [count, setCount] = useState(0)
  const [users, setUsers] = useState({
    name: "Subham"
  })  
  return (
    <div className="p-5">
      <h1>Count - {count}</h1>
      <button className='py-2 px-8 mt-5 mb-5 rounded-md bg-blue-500' onClick={() => setCount(count + 1)}>Increment</button>
      <button className='py-2 px-8 mt-5 mb-5 rounded-md block bg-amber-500' onClick={()=>setUsers({...users, name: "Raja"})}>Update User</button>
      <About users={users} /> 
    </div>
  )
}

export default App



In the above case, when we click on the "Update User" button, the About components re-renders, but when we click on the "Increment" button, the About component does not re-render.

//====================================



=> If we want, we can limit the component re-render, in useMemo, we have prevProp and nextProp, if the prevProp and nextProp are same then it will not re-render the component.

-------
App.jsx
-------

import React, { useState } from "react";
import About from "./components/About";

const App = () => {
  console.log("App rendering...");
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState({
    name: "Subham",
  });
  return (
    <div className="p-5">
      <h1>Count - {count}</h1>
      <button
        className="py-2 px-8 mt-5 mb-5 rounded-md bg-blue-500"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
      <button
        className="py-2 px-8 mt-5 mb-5 rounded-md block bg-amber-500"
        onClick={() => setUsers({ ...users, name: "Raja" })}
      >
        Update User
      </button>
      <About users={users} />
    </div>
  );
};

export default App;


----------
About.jsx
----------

import React from "react";

const About = ({users}) => {
  console.log("About rendering...");
  return <div>About</div>;
};

export default React.memo(About, (prevProps, nextProps) => {
  return prevProps.users.name === nextProps.users.name
    ? console.log("no re-rendering")
    : console.log(" re-rendering");
});
