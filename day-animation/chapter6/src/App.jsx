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
