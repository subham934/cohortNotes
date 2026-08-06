import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { LoadingScreen } from '../../../components/LoadingScreen';

const Guest = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Guest;
