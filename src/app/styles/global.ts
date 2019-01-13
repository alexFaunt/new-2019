export default `
  html {
    font-size: 16px;
    @media (min-width: 800px) {
      font-size: 20px;
    }
  }

  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  h1, h2, h3, h4, h5, p, span, input, button, input, optgroup, select, textarea {
    font-size: 100%;
    color: inherit;
  }
`;
