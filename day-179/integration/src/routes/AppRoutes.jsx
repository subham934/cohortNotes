import React, { useEffect } from 'react';
import Home from '../pages/Home';
import { RouterProvider, createBrowserRouter } from 'react-router';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Public from './protected/Public';
import Protected from './protected/Protected';
import { axiosInstance } from '../config/axiosInstance';
import { useDispatch } from 'react-redux';
import { addUser, removeUser } from '../state/authReducer';

const AppRoutes = () => {

  console.log("appRoutes ")

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        let res = await axiosInstance.get('/api/auth/me');
        dispatch(addUser(res?.data?.user));
      } catch (error) {
        dispatch(removeUser());
        console.log('error in me api', error);
      }
    })();
  }, []);

  let router = createBrowserRouter([
    // Define your routes here
    {
      path: '/',
      element: <Public />,
      children: [
        {
          path: '',
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
      ],
    },
    {
      path: '/home',
      element: <Protected />,
      children: [
        {
          path: '',
          element: <MainLayout />,
          children: [
            {
              path: '',
              element: <Home />,
            },
          ],
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
