import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';

const Protected = () => {
  let { user, isLoading } = useSelector((store) => store.auth);

  if(isLoading) return <h1>Loading...</h1>

  if (!user) return <Navigate to={'/'} />;
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Protected;
