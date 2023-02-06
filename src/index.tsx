import React from 'react';
import ReactDOM from 'react-dom/client';

import 'src/style/index.scss';
import App from './app';

const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);

root.render(<App />);
