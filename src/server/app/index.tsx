import * as React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import Html from './html';
import App from '../../app';

const appMiddleware = () => (ctx, next) => {
  const content = renderToString(<App />);

  const htmlString = renderToStaticMarkup(<Html content={content} state={{}} />);

  ctx.body = `<!doctype html>\n${htmlString}`;

  return next();
};

export default appMiddleware;
