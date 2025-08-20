import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { router } from './router/index.jsx';
import theme from './theme/theme.js'; // apne theme.js ka sahi path lagao

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />      {/* MUI baseline CSS fix karta hai */}
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
