import React from 'react';
import './App.css';
import Questions from './Questions';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const dark = createTheme({
  palette: {
    mode: 'dark',
  },
});


function App() {
  return (
    <ThemeProvider theme={dark}>
      <CssBaseline enableColorScheme />
      <div className="App">
        <header>
          <h1>Questions App</h1>
        </header>
        <Box padding={4} >
          <Questions />
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
