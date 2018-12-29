import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import Html from './html';
import App from '../../app';

const appMiddleware = () => (ctx, next) => {
  const content = ReactDOM.renderToString(<App />);

  const htmlString = ReactDOM.renderToStaticMarkup(<Html content={content} state={{}} />);

  ctx.body = `<!doctype html>\n${htmlString}`;

  return next();
};

export default appMiddleware;
