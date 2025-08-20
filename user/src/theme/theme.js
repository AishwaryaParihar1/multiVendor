import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#004030',       // deep green (dark green)
      contrastText: '#FFF9E5',  // light cream for text on primary
    },
    secondary: {
      main: '#4A9782',       // medium green
      contrastText: '#FFF9E5',
    },
    background: {
      default: '#EDEDED',    // light cream background
      paper: '#EDEDED',      // soft yellow for cards or paper
    },
    text: {
      primary: '#004030',    // dark text color
      secondary: '#4A9782',  // secondary text color
    },
    divider: '#DCD0A8',      // border color approx
    shadowColor: 'rgba(0, 64, 48, 0.3)',  // shadow (example, darkGreen with opacity)
  },
 shadows: [
    "none",
    "0px 1px 3px rgba(0,64,48,0.12),0px 1px 2px rgba(0,64,48,0.24)",
    "0px 1px 5px rgba(0,64,48,0.12),0px 2px 4px rgba(0,64,48,0.24)",
    "0px 1px 8px rgba(0,64,48,0.12),0px 3px 6px rgba(0,64,48,0.24)",
    "0px 2px 4px -1px rgba(0,64,48,0.2),0px 4px 5px rgba(0,64,48,0.14),0px 1px 10px rgba(0,64,48,0.12)",  // shadow index 4
    // Add more shadows up to length 25 as needed
    "0px 3px 5px -1px rgba(0,64,48,0.2),0px 5px 8px rgba(0,64,48,0.14),0px 1px 14px rgba(0,64,48,0.12)",
    "0px 4px 6px -1px rgba(0,64,48,0.2),0px 6px 10px rgba(0,64,48,0.14),0px 1px 18px rgba(0,64,48,0.12)",
    // ... continue adding or replicate MUI shadows ...
  ],
  typography: {
    fontFamily: '"Inter", "Arial", sans-serif',
    // color bhi yahan define ho sakta hai agar chahen
  },
  shape: {
    borderRadius: 8,  // example border radius for card, buttons
  },
});

export default theme;
