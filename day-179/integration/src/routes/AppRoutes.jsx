import React from 'react';
import Home from '../Home';
import { RouterProvider, createBrowserRouter } from 'react-router';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';

const AppRoutes = () => {
  let router = createBrowserRouter([
    // Define your routes here
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        {
          path: '',
          element: <Login />,
        },
        {
          path: 'register',
          element: <Register />,
        },
      ],
    },
    {
      path: '/home',
      element: <MainLayout />,
      children: [
        {
          path: '',
          element: <Home />,
        },
      ],
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default AppRoutes;
