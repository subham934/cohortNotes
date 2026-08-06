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
