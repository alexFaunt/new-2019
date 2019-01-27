import * as React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ServerStyleSheet } from 'styled-components'
import { ApolloProvider } from 'react-apollo';

import createClient from '../../../app/apollo';
import Html from './html';
import App from '../../../app';

// TODO decide on a strat for SSR logged in stuff / app permissions
// TODO finish typing a bunch of stuff to make it better
// TODO some nicer form stuff / component set up / maybe one of the new storybooks

const appMiddleware = () => (ctx, next) => {
  const client = createClient(null, true);

  let routerContext = {} as any; // TODO static context type
  const Wrapper = () => (
    <ApolloProvider client={client}>
      <StaticRouter location={ctx.url} context={routerContext}>
        <App />
      </StaticRouter>
    </ApolloProvider>
  );

  const styleSheet = new ServerStyleSheet()
  const content = renderToString(styleSheet.collectStyles(<Wrapper />));

  const { status, action, location } = routerContext;

  if (status) {
    ctx.status = status;
  }

  if (action === 'REPLACE' && location) {
    ctx.redirect(`${location.pathname}${location.search}`);
    return;
  }

  const htmlString = renderToStaticMarkup((
    <Html
      content={content}
      state={client.extract()}
      styles={styleSheet.getStyleElement()}
    />
  ));

  ctx.body = `<!doctype html>\n${htmlString}`;

  return next();
};

export default appMiddleware;
