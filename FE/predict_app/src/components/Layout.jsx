import React from 'react';
import { Outlet } from 'react-router-dom';
import UserProfile from '../(pages)/UserProfile';
import { useAuth } from '../hooks/useAuth';

const Layout = () => {
  const { user } = useAuth();

  return (
    <div>
      {user && <UserProfile />}
      <Outlet />
    </div>
  );
};

export default Layout;