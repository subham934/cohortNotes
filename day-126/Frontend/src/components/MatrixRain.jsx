import React, { useEffect, useRef } from 'react';

const CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\\\$#@%&*+=';

export const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const fontSize = 14;
    let cols, drops;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: cols }, () => Math.random() * -100);
    };

    init();

    const draw = () => {
      // Translucent black overlay for trail effect
      ctx.fillStyle = 'rgba(0, 13, 0, 0.07)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const y = drops[i] * fontSize;

        // Leading bright green character
        const isHead = Math.random() > 0.95;
        ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;
        ctx.fillStyle = isHead ? '#ccffcc' : '#00ff46';
        ctx.shadowColor = '#00ff46';
        ctx.shadowBlur = isHead ? 14 : 4;
        ctx.fillText(char, i * fontSize, y);

        // Dimmer trailing characters
        ctx.fillStyle = 'rgba(0, 180, 50, 0.5)';
        ctx.shadowBlur = 0;

        // Reset drop
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5;
      }
    };

    const interval = setInterval(draw, 45);

    const handleResize = () => {
      init();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-60"
      aria-hidden="true"
    />
  );
};

export default MatrixRain;
