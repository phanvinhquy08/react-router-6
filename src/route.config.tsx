import { createBrowserRouter } from 'react-router-dom';

import loadable from 'src/utils/loadable';
import Split from 'src/components/layout/Split';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Split />,
    children: [
      {
        index: true,
        ...loadable('home'),
      },
      {
        path: 'comments',
        ...loadable('comments'),
      },
    ],
  },
]);
