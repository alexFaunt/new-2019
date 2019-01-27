import * as React from 'react';

const Html = ({ content, state, styles, environment = 'production' }) => {
  const reactSuffix = `${environment}${environment === 'production' ? '.min' : ''}`;

  return (
    <html>
      <head>
        <title>TODO helmet</title>
        { styles }
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: content }} />
        <script dangerouslySetInnerHTML={{
          __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
        }} />

        <script src={`https://unpkg.com/react@${React.version}/umd/react.${reactSuffix}.js`}></script>
        <script src={`https://unpkg.com/react-dom@${React.version}/umd/react-dom.${reactSuffix}.js`}></script>

        <script src="js/bundle.js"></script>
      </body>
    </html>
  );
};

// TODO prod bundle hash

export default Html;
