import * as Koa from 'koa';
import * as koaBody from 'koa-bodyparser';
import * as Router from 'koa-router';
import * as serve from 'koa-static';

import app from './app';

const createServer = async (config) => {
  const server = new Koa();
  const router = new Router();


  // Global middleware

  // Server dist files
  server.use(serve('dist/app'));
  server.use(koaBody());

  // routes
  router.get('/health', (ctx) => { ctx.body = 'OK'; });
  router.get('*', app());

  server.use(router.routes());
  server.use(router.allowedMethods());

  server.listen(config.PORT, () => {
    console.log(`Koa server running on ${config.PORT}`); // TODO logger
  });
};

export default createServer;
