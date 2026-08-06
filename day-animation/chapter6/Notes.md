
-------
App.jsx
-------
import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
const App = () => {
  const boxRef = useRef(null)
  useGSAP(()=>{
    gsap.to(boxRef.current, {
      x: 1000,
      duration: 1,
      ease: 'power1.inOut',
      delay: 1,
      rotation: 360,
    })
  })
  return (
    <div>
      <div className="box" ref={boxRef}></div>
    </div>
  )
}

export default App;

<!-- ============================================ -->
useGSAP also provide use with multiple things , eg: scope

1.
// scope limits selector-based animations to a specific container.

// Without scope, gsap.to(".box") searches the entire document.

// With scope: containerRef, gsap.to(".box") only searches
// for .box elements inside the containerRef element.

// scope is not needed when directly using refs such as
// boxRef.current because GSAP already knows the exact element.

2. dependencies works similarly to React's useEffect.

3. revertOnUpdate

This is usually used together with dependencies.
Suppose:

useGSAP(() => {
  gsap.to(".box", {
    x: count * 100
  });
}, {
  dependencies: [count]
});

Without:

revertOnUpdate: true

every update creates a new animation:

Animation #1
Animation #2
Animation #3
Animation #4

which can cause strange behavior.

With:

revertOnUpdate: true

GSAP does:

Remove old animation
↓
Create new animation

Flow:

count changes
↓
Cleanup previous GSAP context
↓
Run useGSAP again
↓
Create fresh animations



// scope limits selector-based GSAP animations to a specific container. For example, with scope: containerRef, gsap.to(".box") will only target .box elements inside that container instead of searching the entire document. dependencies works like React's useEffect dependency array; whenever a dependency changes, the useGSAP callback runs again. revertOnUpdate: true tells GSAP to automatically clean up (revert) all previous animations before re-running the callback when dependencies change, preventing duplicate animations and keeping the animation state clean.

//==================================================================
// now lets see contextSafe, 
// contextSafe is a helper provided by useGSAP that wraps functions
// which create GSAP animations outside the main useGSAP callback
// (such as click handlers, timers, event listeners, async callbacks, etc.).

// Without contextSafe, GSAP cannot automatically track and clean up
// animations created inside those functions.

// With contextSafe, any GSAP animations created inside the wrapped
// function are registered with the current GSAP Context and will be
// automatically reverted when the component unmounts or the context
// is cleaned up.

-------
App.jsx
-------
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
const App = () => {
  const boxRef = useRef(null);
  const containerRef = useRef(null);
  const { contextSafe } = useGSAP(
    () => {
      gsap.to(boxRef.current, {
        x: 1000,
        duration: 1,
        ease: 'power1.inOut',
        delay: 1,
        rotation: 360,
      });
    },
    {
      scope: containerRef,
      dependencies: [],
      revertOnUpdate: true,
    }
  );

  const handleClick = contextSafe(() => {
    gsap.to(boxRef.current, {
      y: 200,
      duration: 1,
      rotation: 720,
    });
  });

  return (
    <div className="container" ref={containerRef}>
      <div className="box" ref={boxRef}></div>
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
};

export default App;





if you want to animate a child component, you can write as below:::


-----------
src/App.jsx
-----------
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import AnimateOnX from './components/AnimateOnX';

const App = () => {
  const boxRef = useRef(null);
  const containerRef = useRef(null);

  const { contextSafe } = useGSAP(
    () => {
      gsap.to(boxRef.current, {
        x: 1000,
        duration: 1,
        ease: 'power1.inOut',
        delay: 1,
        rotation: 360,
      });
    },
    {
      scope: containerRef,
      dependencies: [],
      revertOnUpdate: true,
    }
  );

  const handleClick = contextSafe(() => {
    gsap.to(boxRef.current, {
      y: 200,
      duration: 1,
      rotation: 720,
    });
  });

  return (
    <div ref={containerRef}>
      <div className="box" ref={boxRef}></div>

      <AnimateOnX>
        <div className="box"></div>
      </AnimateOnX>
      <AnimateOnX>
        <div className="box1"></div>
      </AnimateOnX>
    </div>
  );
};

export default App;

-----------------------------
src/components/AnimateOnX.jsx
-----------------------------
import { useGSAP } from '@gsap/react';
import React, { useRef } from 'react';
import gsap from 'gsap';

const AnimateOnX = ({ children }) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.to(containerRef.current, {
      x: 600,
      duration: 1,
      delay: 1,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
    });
  });

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
};

export default AnimateOnX;

If I animate rotation: 360 on containerRef.current, the entire container and everything inside it will rotate because children inherit the parent's transform.

If I want only the child element to rotate while the parent moves horizontally, I should animate the parent and child separately:

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

export default function AnimateOnX({ children }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.to(containerRef.current, {
      x: 600,
      duration: 1,
      delay: 1,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
    });

    // rotate children on z-axis
    gsap.to(containerRef.current.firstChild, {
      rotation: 360,
      duration: 1,
      delay: 1,
      ease: 'none',
      repeat: -1,
    });
  });

  return (
    <div
      ref={containerRef}
    >
      {children}
    </div>
  );
}


# GSAP Parent vs Child Animations in React

## DOM Structure

```jsx
<div ref={containerRef}>
  <div className="box"></div>
</div>
```

Hierarchy:

```text
containerRef.current (parent)
└── .box (child)
```

* `containerRef.current` points to the parent element.
* `containerRef.current.firstChild` points to the first child element inside the parent.

---

## Animating the Parent

```js
gsap.to(containerRef.current, {
  x: 600,
});
```

This animates the **parent**.

Think of the parent as a truck and the child as a box inside the truck:

```text
Truck (parent)
└── Box (child)
```

When the truck moves:

```text
                    Truck
                    └── Box
```

The box appears to move too because it is inside the truck.

**Important:** The child is not being animated directly. It moves because its parent moves.

---

## Animating the Child

```js
gsap.to(containerRef.current.firstChild, {
  rotation: 360,
});
```

This animates the **child**.

Visual:

```text
Parent stays in place
Child spins ↻
```

The rotation is applied only to the child element.

---

## Animating Parent and Child Separately

```js
gsap.to(containerRef.current, {
  x: 600,
});

gsap.to(containerRef.current.firstChild, {
  rotation: 360,
});
```

Result:

```text
Parent moves →
Child spins ↻
```

Visual:

```text
↻
[box] ----------->
```

The child spins while traveling to the right because:

* Parent animation controls movement.
* Child animation controls rotation.

---

## Why Use `firstChild`?

Given:

```html
<div ref={containerRef}>
  <div class="box"></div>
</div>
```

Then:

```js
containerRef.current
```

points to:

```html
<div ref={containerRef}>
  <div class="box"></div>
</div>
```

And:

```js
containerRef.current.firstChild
```

points to:

```html
<div class="box"></div>
```

So:

```js
gsap.to(containerRef.current, {...});
```

animates the parent.

While:

```js
gsap.to(containerRef.current.firstChild, {...});
```

animates the child.

---

## Why `firstChild` Can Be Fragile

Suppose the component changes:

```jsx
<AnimateOnX>
  <h1>Hello</h1>
  <div className="box"></div>
</AnimateOnX>
```

Rendered DOM:

```html
<div ref={containerRef}>
  <h1>Hello</h1>
  <div class="box"></div>
</div>
```

Now:

```js
containerRef.current.firstChild
```

returns:

```html
<h1>Hello</h1>
```

instead of:

```html
<div class="box"></div>
```

Your animation would rotate the heading instead of the box.

---

## Recommended React Approach

Instead of relying on `firstChild`, use a dedicated ref:

```jsx
const childRef = useRef(null);

return (
  <div ref={containerRef}>
    <div ref={childRef}>{children}</div>
  </div>
);
```

Then animate directly:

```js
gsap.to(childRef.current, {
  rotation: 360,
});
```

Benefits:

* More reliable.
* Easier to read.
* Doesn't break when the DOM structure changes.
* Follows React best practices.

---

## Quick Mental Model

```text
Parent Animation
↓
Moves everything inside it

Child Animation
↓
Affects only that child
```

Example:

```js
gsap.to(parent, { x: 600 });      // move container
gsap.to(child, { rotation: 360 }); // spin child
```

Think:

```text
Parent = Truck 🚚
Child = Box 📦

Truck moves →
Box spins ↻
```


we can also provide scope on AnimateOnX

-----------------------------
src/components/AnimateOnX.jsx
-----------------------------

import { useGSAP } from '@gsap/react';
import React, { useRef } from 'react';
import gsap from 'gsap';

const AnimateOnX = ({ children }) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.to(containerRef.current, {
      x: 600,
      duration: 1,
      delay: 1,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
    });

  }, {scope: containerRef});

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
};

export default AnimateOnX;


==========================================

in App.jsx , if we want the gsap animation in multiple boxes it is not possible because we can give reference to only one DOM element.
but if we provide multiple reference as below::
------------
src/App.jsx
------------

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import AnimateOnX from './components/AnimateOnX';

const App = () => {
  const boxRef = useRef(null);
  const boxRef1 = useRef(null);
  const boxRef2 = useRef(null);
  const containerRef = useRef(null);

  const { contextSafe } = useGSAP(
    () => {
      gsap.to([boxRef.current, boxRef1.current, boxRef2.current], {
        x: 1000,
        duration: 1,
        ease: 'power1.inOut',
        delay: 1,
        rotation: 360,
      });
    },
    {
      scope: containerRef,
      dependencies: [],
      revertOnUpdate: true,
    }
  );

  const handleClick = contextSafe(() => {
    gsap.to(boxRef.current, {
      y: 200,
      duration: 1,
      rotation: 720,
    });
  });

  return (
    <div ref={containerRef}>
      <div className="box" ref={boxRef}></div>
      <div className="box" ref={boxRef1}></div>
      <div className="box" ref={boxRef2}></div>

      {/* <AnimateOnX>
        <div className="box"></div>
      </AnimateOnX>
      <AnimateOnX>
        <div className="box1"></div>
      </AnimateOnX> */}


    </div>
  );
};

export default App;

This above process is problematic , so the solution to this is as below::
-------------
App.jsx
-------------

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import AnimateOnX from './components/AnimateOnX';

const App = () => {
    const boxRef = useRef([]); // inside useRef , we provide an empty array

  const containerRef = useRef(null);

  const { contextSafe } = useGSAP(
    () => {
      gsap.to([boxRef.current], {
        x: 1000,
        duration: 1,
        ease: 'power1.inOut',
        delay: 1,
        rotation: 360,
        stagger:0.2,
      });
    },
    {
      scope: containerRef,
      dependencies: [],
      revertOnUpdate: true,
    }
  );

  const handleClick = contextSafe(() => {
    gsap.to(boxRef.current, {
      y: 200,
      duration: 1,
      rotation: 720,
    });
  });

  return (
    <div ref={containerRef}>
      <div className="box" ref={(el)=> boxRef.current.push(el)}></div> // we write as (el)=> boxRef.current.push(el) in every element we want the animation
      <div className="box" ref={(el)=> boxRef.current.push(el)}></div>
      <div className="box" ref={(el)=> boxRef.current.push(el)}></div>


    </div>
  );
};

export default App;



//===================================================================
now, lets go with FramerMotion, now called Motion

npm i motion

-------
App.jsx
-------

import React from 'react';
import { motion } from 'motion/react';

const App = () => {
  return (
    <div>
      <motion.div
        initial={{ x: 0 , opacity: 0}}
        animate={{ x: 1000, backgroundColor: '#ff0000', opacity:1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="box"
      ></motion.div>
    </div>
  );
};

export default App;

// we can also provide gesture trigger::

-------
App.jsx
-------

import React from 'react';
import { motion } from 'motion/react';

const App = () => {
  return (
    <div>
      <motion.div
        initial={{ x: 0 , opacity: 0, }}
        animate={{ x: 1200, backgroundColor: '#ff0000', opacity:1 }}
        transition={{ duration: 0.5, ease: 'backInOut' }}
        whileHover={{scale:1.5}}
        whileTap={{scale:0.8}}
        className="box"
      ></motion.div>

    </div>
  );
};

export default App;


there is one more thing called whileInView:: this animation will only work when the element is visible in the viewport

-------
App.jsx
-------

import React from 'react';
import { motion } from 'motion/react';

const App = () => {
  return (
    <div>
      <div className="page"></div>
      <motion.div
        initial={{ x: 0, opacity: 0, scale: 0.5 }}
        transition={{ duration: 2, ease: 'backInOut' }}
        whileInView={{ scale: 1, opacity: 1 }}
        className="box"
      ></motion.div>
      <div className="page"></div>
    </div>
  );
};

export default App;


there is one more property called veiwport:{{once: true/false}}

if once is true:: the animation will only work once

Enter room
↓
Turn light ON

Leave room
↓
Stop caring forever

Come back
↓
Nothing happens


if once is false:: the animation will work every time the element is visible in the viewport

Enter room
↓
Turn light ON

Leave room
↓
Turn light OFF

Come back
↓
Turn light ON


But the light is already ON.

ON → ON

So you don't notice anything.

there is one more thing , that is amount and its value range from 0 to 1, it calculates the visible height of the element in the viewport meaning amount ranges from 0 to 1 and specifies how much of the element must be visible inside the viewport before whileInView is triggered.


-------
App.jsx
-------

import React from 'react';
import { motion } from 'motion/react';

const App = () => {
  return (
    <div>
      <div className="page"></div>
      <motion.div
        initial={{ x: 0, opacity: 0, scale: 0.5 }}
        // animate={{ x: 1200, backgroundColor: '#ff0000', opacity:1 }}
        transition={{ duration: 2, ease: 'backInOut' }}
        // whileHover={{ scale: 1.5 }}
        // whileTap={{ scale: 0.8 }}
        viewport={{
          once: false,
          amount: 0.5
        }}
        whileInView={{ scale: 1, opacity: 1 }}
        className="box"
      ></motion.div>
      <div className="page"></div>
    </div>
  );
};

export default App;

//==============================================================

now , if we have multiple boxes , then it is not possible to give properties to all of them , so we use the below method::

-------
App.jsx
-------
import React from 'react';
import { motion } from 'motion/react';

const App = () => {
  const boxVarient = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      x: 1200,
    },
  };

  return (
    <div>
      <motion.div
        variants={boxVarient}
        initial="hidden"
        animate="visible"
        transition={{ duration: 1.3, ease: 'easeInOut' }}
        className="box"
      ></motion.div>
      
      <motion.div
      variants={boxVarient}
        initial="hidden"
        animate="visible"
        transition={{ duration: 1.3, ease: 'easeInOut' }}
        className="box"
      ></motion.div>

      <motion.div
      variants={boxVarient}
        initial="hidden"
        animate="visible"
        transition={{ duration: 1.3, ease: 'easeInOut' }}
        className="box"
      ></motion.div>
      
      <motion.div
      variants={boxVarient}
        initial="hidden"
        animate="visible"
        transition={{ duration: 1.3, ease: 'easeInOut' }}
        className="box"
      ></motion.div>

    </div>
  );
};

export default App;

//====================================================

if we write the above thing as below it still works, ps: i've only made changes in first box, take a reference and make changes in other boxes aswell.

-------
App.jsx
-------
import React from 'react';
import { motion } from 'motion/react';

const App = () => {

  const containerVarient = {
    hidden: {},
    visible: {}
  }

  const boxVarient = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      x: 1200,
    },
  };

//The first box does not have initial or animate props, but it still animates because Motion propagates the parent's animation state to its children.

// The parent has: initial="hidden" animate="visible"

// so all child motion components automatically inherit these state names unless they define their own initial or animate.

// Motion then looks for matching keys inside the child's variants object.

// Since boxVariant contains both "hidden" and "visible" states, the child animates from hidden to visible automatically.

  return (
    <div>
      <motion.div className="containerDiv" initial="hidden" animate="visible" variants={containerVarient}>
        <motion.div
          variants={boxVarient}
          transition={{ duration: 1.3, ease: 'easeInOut' }}
          className="box"
        ></motion.div>

        <motion.div
          variants={boxVarient}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1.3, ease: 'easeInOut' }}
          className="box"
        ></motion.div>

        <motion.div
          variants={boxVarient}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1.3, ease: 'easeInOut' }}
          className="box"
        ></motion.div>

        <motion.div
          variants={boxVarient}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1.3, ease: 'easeInOut' }}
          className="box"
        ></motion.div>
      </motion.div>
    </div>
  );
};

export default App;

//==========================================
// if we want stagger ,we write as below::
-------
App.jsx
-------

import React from 'react';
import { motion } from 'motion/react';

const App = () => {
  const containerVarient = {
    hidden: {},
    visible: {},
  };

  const boxVarient = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      x: 1200,
    },
  };

  return (
    <div>
      <motion.div
        className="containerDiv"
        initial="hidden"
        animate="visible"
        variants={containerVarient}
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.div
          variants={boxVarient}
          transition={{ duration: 1.3, ease: 'easeInOut' }}
          className="box"
        ></motion.div>

        <motion.div
          variants={boxVarient}
          transition={{ duration: 1.3, ease: 'easeInOut' }}
          className="box"
        ></motion.div>

        <motion.div
          variants={boxVarient}
          transition={{ duration: 1.3, ease: 'easeInOut' }}
          className="box"
        ></motion.div>

        <motion.div
          variants={boxVarient}
          transition={{ duration: 1.3, ease: 'easeInOut' }}
          className="box"
        ></motion.div>
      </motion.div>
    </div>
  );
};

export default App;


//==========================================
// Now, we will see animate presence::



-------
App.jsx
-------


import React, { useState } from 'react';
import { motion } from 'motion/react';

const App = () => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}
      >
        Toggle
      </button>

      {show && (
        <motion.div
          initial={{ opacity: 0, y: 300 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 300 }}
          transition={{ duration: 1 }}
          className='box'
        />
      )}
    </div>
  );
};

export default App;

// in the above case, when we press the toggle button
// the box will animate and show up but when we click the box dissappers without any animation , for that we use animate presence::


-------
App.jsx
-------


import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const App = () => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}
      >
        Toggle
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 300 }}
            transition={{ duration: 1 }}
            className="box"
          ></motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
