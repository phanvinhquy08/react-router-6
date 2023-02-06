import React from 'react';
import { Link, Outlet, useNavigation } from 'react-router-dom';

const Split: React.FC = () => {
  const navigation = useNavigation();

  return (
    <div>
      <nav>
        <Link to={'/'}>Home</Link>
        <Link to={'comments'}>Comment</Link>
      </nav>
      {navigation.state === 'loading' ? 'loading' : <Outlet />}
    </div>
  );
};

export default Split;
