import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import MainLayout from '../layout/MainLayout';
import Skeleton from '../components/Skeleton';
import ErrorBoundary from '../components/ErrorBoundary';
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Product = lazy(() => import('../pages/Product'));
const Users = lazy(() => import('../pages/Users'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,

        element: (
          <Suspense fallback={<p>loading...</p>}>
            <Home />
          </Suspense>
        ),

      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<p>loading...</p>}>
            <About />
          </Suspense>
        ),
      },
      {
        path: 'product',
        element: (
        <ErrorBoundary>
            <Suspense fallback={<p>loading...</p>}>
            <Product />
          </Suspense>
        </ErrorBoundary>
        ),
      },
      {
        path: 'users',
        element: (
          <Suspense
            fallback={
              <div className="p-6 flex flex-wrap gap-6 items-start justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </div>
            }
          >
            <Users />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
