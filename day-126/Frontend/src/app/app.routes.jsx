import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import Protected from '../features/auth/components/Protected';
import Guest from '../features/auth/components/Guest';

import { LoadingScreen } from '../components/LoadingScreen';

const delayImport = (importPromise) => {
  return Promise.all([
    importPromise,
    new Promise((resolve) => setTimeout(resolve, 1500)),
  ]).then(([module]) => module);
};

const Login = React.lazy(() => delayImport(import('../features/auth/pages/Login')));
const Register = React.lazy(() => import('../features/auth/pages/Register'));
const Dashboard = React.lazy(() => delayImport(import('../features/chat/pages/Dashboard')));
const ForgotPassword = React.lazy(() => import('../features/auth/pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../features/auth/pages/ResetPassword'));

const SuspenseLayout = ({ children }) => (
  <Suspense fallback={<LoadingScreen />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Protected>
        <SuspenseLayout>
          <Dashboard />
        </SuspenseLayout>
      </Protected>
    ),
  },
  {
    path: '/login',
    element: (
      <Guest>
        <SuspenseLayout>
          <Login />
        </SuspenseLayout>
      </Guest>
    ),
  },
  {
    path: '/register',
    element: (
      <Guest>
        <SuspenseLayout>
          <Register />
        </SuspenseLayout>
      </Guest>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <Guest>
        <SuspenseLayout>
          <ForgotPassword />
        </SuspenseLayout>
      </Guest>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <Guest>
        <SuspenseLayout>
          <ResetPassword />
        </SuspenseLayout>
      </Guest>
    ),
  },
  {
    path: '/dashboard',
    element: <Navigate to="/" replace />
  }
]);
