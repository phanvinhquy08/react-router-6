import React from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from 'src/route.config';

const App: React.FC = () => {
  return (
    <RouterProvider router={router} fallbackElement={<p>Loading app...</p>} />
  );
};

export default App;
