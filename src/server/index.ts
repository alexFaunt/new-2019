import * as Koa from 'koa';
import * as koaBody from 'koa-bodyparser';
import * as Router from 'koa-router';
import * as serve from 'koa-static';

import app from './middleware/app';
import graphql from './middleware/graphql';

export default async (config) => {
  const server = new Koa();
  const router = new Router();

  // Global middleware

  // Server dist files
  server.use(serve('dist/static'));
  server.use(koaBody());

  // routes
  router.get('/health', (ctx) => { ctx.body = 'OK'; });
  router.get('*', app());

  server.use(router.routes());
  server.use(router.allowedMethods());

  await graphql(server);

  server.listen(config.PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`Koa server running on ${config.PORT}`); // TODO logger
  });
};
