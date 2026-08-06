import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './app.routes.jsx';
import { useAuth } from '../features/auth/hook/useAuth.js';
import { MatrixRain } from '../components/MatrixRain';

const App = () => {
  const { handleGetMe } = useAuth();
  const [isHacker, setIsHacker] = useState(
    () => localStorage.getItem('theme') === 'hacker'
  );

  useEffect(() => {
    handleGetMe();
  }, []);

  // Listen for theme changes across the app
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsHacker(document.documentElement.classList.contains('hacker'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {isHacker && <MatrixRain />}
      <RouterProvider router={router} />
    </>
  );
};

export default App;
