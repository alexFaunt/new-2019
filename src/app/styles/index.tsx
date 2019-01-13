import * as React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

import theme from './theme';
import globalStyles from './global';

const GlobalStyle = createGlobalStyle`${globalStyles}`;

const Styles = ({ children }) => (
  <ThemeProvider theme={theme}>
    <>
      <GlobalStyle />
      { children }
    </>
  </ThemeProvider>
);

export default Styles;
